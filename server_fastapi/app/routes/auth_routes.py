"""
Authentication routes.
Handles user registration, login, logout, and profile retrieval.
"""
from fastapi import APIRouter, Response, Request, Depends
from app.controllers.auth_controller import (
    auth_controller,
    SignupRequest,
    LoginRequest
)
from app.middleware import require_auth


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup")
async def signup(data: SignupRequest):
    """
    Register a new user.
    
    Request body:
    - email: User's email address
    - password: User's password
    - name: User's full name
    """
    return await auth_controller.signup(data)


@router.post("/login")
async def login(data: LoginRequest, response: Response, request: Request):
    """
    Login user and set JWT cookie.
    
    Request body:
    - email: User's email address
    - password: User's password
    """
    return await auth_controller.login(data, response, request)


@router.post("/logout")
async def logout(response: Response, _: dict = Depends(require_auth)):
    """
    Logout user by clearing JWT cookie.
    Requires authentication.
    """
    return await auth_controller.logout(response)


@router.get("/user")
async def get_user(request: Request, _: dict = Depends(require_auth)):
    """
    Get current authenticated user profile.
    Requires authentication.
    """
    return await auth_controller.get_user(request)
