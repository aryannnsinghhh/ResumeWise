"""
Database configuration and initialization.
Handles MongoDB connection using Motor and Beanie ODM.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config.settings import settings
from app.models.user import User


async def init_db():
    """
    Initialize database connection and Beanie ODM.
    This should be called on application startup.
    """
    # Create Motor client
    client = AsyncIOMotorClient(
        settings.MONGO_URL,
        serverSelectionTimeoutMS=5000
    )
    
    # Get database
    db = client.get_default_database()
    
    # Initialize Beanie with document models
    await init_beanie(
        database=db,
        document_models=[
            User,
            # Add other document models here as needed
        ]
    )
    
    print("✅ MongoDB connected successfully via Beanie")
    return client


async def close_db(client: AsyncIOMotorClient):
    """Close database connection."""
    client.close()
    print("📪 MongoDB connection closed")
