"""
User model for authentication and profile management.
Migrated from TypeScript/Mongoose to Python/Beanie.
"""
from datetime import datetime, timezone
from typing import Optional
from beanie import Document
from pydantic import EmailStr, Field


class User(Document):
    """User document model for MongoDB."""
    
    email: EmailStr = Field(..., unique=True)
    password: str = Field(...)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "users"
