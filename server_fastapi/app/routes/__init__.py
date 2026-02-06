"""
Initialize routes package.
"""
from app.routes.auth_routes import router as auth_router
from app.routes.screening_routes import router as screening_router

__all__ = [
    "auth_router",
    "screening_router"
]
