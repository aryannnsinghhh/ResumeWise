"""
Configuration settings for the FastAPI application.
Handles environment variables and application settings.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # MongoDB Configuration
    MONGO_URL: str = "mongodb://localhost:27017/resumewise"
    
    # JWT Configuration
    JWT_SECRET: str = "your_super_secure_jwt_secret_key_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 20  # 20 minutes session timeout
    
    # Google Generative AI
    GEMINI_API_KEY: str
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    
    # CORS Settings
    CLIENT_DEV_URL: str = "http://localhost:5173"
    CLIENT_DEV_URL_2: str = "http://localhost:5174"
    CLIENT_DEV_URL_3: str = "http://localhost:5175"
    CLIENT_PROD_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Allowed origins for CORS
ALLOWED_ORIGINS = [
    settings.CLIENT_DEV_URL,
    settings.CLIENT_DEV_URL_2,
    settings.CLIENT_DEV_URL_3,
    settings.CLIENT_PROD_URL,
]
