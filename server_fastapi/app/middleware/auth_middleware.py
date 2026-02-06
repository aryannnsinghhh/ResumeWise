"""
Authentication middleware for protecting routes.
Handles JWT token validation from cookies.
"""
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.utils.auth import decode_token
from app.models.user import User


security = HTTPBearer(auto_error=False)


async def get_current_user_from_cookie(request: Request) -> Optional[dict]:
    """
    Extract and validate JWT token from cookie.
    
    Args:
        request: FastAPI request object
    
    Returns:
        User payload dict or None
    """
    token = request.cookies.get("jwt")
    
    if not token:
        return None
    
    payload = decode_token(token)
    return payload


async def require_auth(request: Request) -> dict:
    """
    Dependency for routes that require authentication.
    Raises HTTPException if user is not authenticated.
    
    Args:
        request: FastAPI request object
    
    Returns:
        User payload dict
    
    Raises:
        HTTPException: If authentication fails
    """
    user_payload = await get_current_user_from_cookie(request)
    
    if not user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized. No valid token found."
        )
    
    return user_payload


async def get_current_user(request: Request) -> Optional[User]:
    """
    Get the current authenticated user from database.
    
    Args:
        request: FastAPI request object
    
    Returns:
        User document or None
    """
    user_payload = await get_current_user_from_cookie(request)
    
    if not user_payload:
        return None
    
    user_id = user_payload.get("userId")
    if not user_id:
        return None
    
    user = await User.get(user_id)
    return user
