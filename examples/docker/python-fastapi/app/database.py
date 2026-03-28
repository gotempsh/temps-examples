import os
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as aioredis


class MongoDB:
    def __init__(self):
        self.client: AsyncIOMotorClient | None = None
        self.bookmarks = None

    async def connect(self):
        url = os.environ.get("MONGODB_URL", "mongodb://admin:secret@localhost:27017/bookmarks?authSource=admin")
        self.client = AsyncIOMotorClient(url)
        database = self.client.get_default_database()
        self.bookmarks = database.bookmarks

    async def ping(self) -> bool:
        try:
            await self.client.admin.command("ping")
            return True
        except Exception:
            return False

    async def close(self):
        if self.client:
            self.client.close()


class RedisClient:
    def __init__(self):
        self.client: aioredis.Redis | None = None

    async def connect(self):
        url = os.environ.get("REDIS_URL", "redis://localhost:6379")
        self.client = aioredis.from_url(url, decode_responses=True)

    async def ping(self) -> bool:
        try:
            return await self.client.ping()
        except Exception:
            return False

    async def get(self, key: str) -> str | None:
        try:
            return await self.client.get(key)
        except Exception:
            return None

    async def setex(self, key: str, ttl: int, value: str):
        try:
            await self.client.setex(key, ttl, value)
        except Exception:
            pass

    async def keys(self, pattern: str) -> list:
        try:
            return await self.client.keys(pattern)
        except Exception:
            return []

    async def delete(self, *keys):
        try:
            await self.client.delete(*keys)
        except Exception:
            pass

    async def close(self):
        if self.client:
            await self.client.aclose()


db = MongoDB()
redis_client = RedisClient()
