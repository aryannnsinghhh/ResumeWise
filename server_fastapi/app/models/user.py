"""
User model for authentication and profile management.
Migrated from TypeScript/Mongoose to Python/Beanie.
"""
from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import EmailStr, Field


class User(Document):
    """User document model for MongoDB."""
    
    # Authentication Fields
    email: EmailStr = Field(..., unique=True, description="User's email address")
    password: str = Field(..., description="Hashed password")
    
    # Profile Information
    name: str = Field(..., description="User's full name")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "users"  # MongoDB collection name
        indexes = [
            "email",  # Index on email for faster lookups
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "hashed_password_here"
            }
        }
