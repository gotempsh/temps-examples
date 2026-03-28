from pydantic import BaseModel
from datetime import datetime


class BookmarkCreate(BaseModel):
    url: str
    title: str
    description: str = ""
    tags: list[str] = []


class BookmarkUpdate(BaseModel):
    url: str | None = None
    title: str | None = None
    description: str | None = None
    tags: list[str] | None = None


class BookmarkResponse(BaseModel):
    id: str
    url: str
    title: str
    description: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime
