"""
Initialize config package.
"""
from app.config.settings import settings, ALLOWED_ORIGINS
from app.config.db import init_db, close_db

__all__ = [
    "settings",
    "ALLOWED_ORIGINS",
    "init_db",
    "close_db"
]
