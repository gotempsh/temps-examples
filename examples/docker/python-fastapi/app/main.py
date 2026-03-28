from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from bson import ObjectId

from app.database import db, redis_client
from app.models import BookmarkCreate, BookmarkUpdate, BookmarkResponse

import json


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to databases
    await db.connect()
    await redis_client.connect()
    yield
    # Shutdown: close connections
    await db.close()
    await redis_client.close()


app = FastAPI(
    title="Bookmarks API",
    description="A bookmark manager API with MongoDB and Redis caching",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    mongo_ok = await db.ping()
    redis_ok = await redis_client.ping()
    return {
        "status": "ok" if (mongo_ok and redis_ok) else "degraded",
        "mongo": "connected" if mongo_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/bookmarks", response_model=list[BookmarkResponse])
async def list_bookmarks(tag: str | None = None):
    # Try cache first
    cache_key = f"bookmarks:{tag or 'all'}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    query = {"tags": tag} if tag else {}
    bookmarks = await db.bookmarks.find(query).sort("created_at", -1).to_list(100)

    result = [_serialize(b) for b in bookmarks]
    await redis_client.setex(cache_key, 60, json.dumps(result, default=str))
    return result


@app.post("/api/bookmarks", response_model=BookmarkResponse, status_code=201)
async def create_bookmark(bookmark: BookmarkCreate):
    doc = {
        **bookmark.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db.bookmarks.insert_one(doc)
    doc["_id"] = result.inserted_id
    await _invalidate_cache()
    return _serialize(doc)


@app.get("/api/bookmarks/{bookmark_id}", response_model=BookmarkResponse)
async def get_bookmark(bookmark_id: str):
    bookmark = await db.bookmarks.find_one({"_id": ObjectId(bookmark_id)})
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return _serialize(bookmark)


@app.patch("/api/bookmarks/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(bookmark_id: str, update: BookmarkUpdate):
    updates = {k: v for k, v in update.model_dump(exclude_unset=True).items()}
    updates["updated_at"] = datetime.now(timezone.utc)

    result = await db.bookmarks.find_one_and_update(
        {"_id": ObjectId(bookmark_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    await _invalidate_cache()
    return _serialize(result)


@app.delete("/api/bookmarks/{bookmark_id}")
async def delete_bookmark(bookmark_id: str):
    result = await db.bookmarks.delete_one({"_id": ObjectId(bookmark_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    await _invalidate_cache()
    return {"deleted": True}


@app.get("/api/tags")
async def list_tags():
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    tags = await db.bookmarks.aggregate(pipeline).to_list(50)
    return [{"name": t["_id"], "count": t["count"]} for t in tags]


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def _invalidate_cache():
    keys = await redis_client.keys("bookmarks:*")
    if keys:
        await redis_client.delete(*keys)
