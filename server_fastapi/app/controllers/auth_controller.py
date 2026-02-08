"""
Authentication controllers for user management.
Handles signup, login, logout, and user profile retrieval.
"""
from fastapi import Response, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, field_validator
from app.models.user import User
from app.utils.auth import hash_password, verify_password, create_access_token, decode_token
from app.config.settings import settings


# Request/Response Models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    email: str


class MessageResponse(BaseModel):
    message: str


class AuthController:
    """Authentication controller with all auth-related operations."""
    
    @staticmethod
    async def get_user(request: Request) -> dict:
        """
        Get current authenticated user profile.
        Requires valid JWT token in cookie.
        """
        token = request.cookies.get("jwt")
        
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized. No user data found."
            )
        
        payload = decode_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token."
            )
        
        user_id = payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload."
            )
        
        # Fetch user from database
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
        
        return {
            "user": {
                "email": user.email
            }
        }
    
    @staticmethod
    async def signup(data: SignupRequest) -> dict:
        """
        Register a new user.
        
        Args:
            data: Signup request with email, password, and name
        
        Returns:
            Success message
        
        Raises:
            HTTPException: If user already exists or validation fails
        """
        # Check if user already exists
        existing_user = await User.find_one(User.email == data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already registered. Please use a different email or log in."
            )
        
        # Hash password
        hashed_password = hash_password(data.password)
        
        # Create new user
        new_user = User(
            email=data.email,
            password=hashed_password
        )
        await new_user.insert()
        
        return {"message": "Registration successful"}
    
    @staticmethod
    async def login(data: LoginRequest, response: Response, request: Request) -> dict:
        """
        Authenticate user and set JWT cookie.
        
        Args:
            data: Login request with email and password
            response: FastAPI response object for setting cookies
            request: FastAPI request object
        
        Returns:
            User data and success message
        
        Raises:
            HTTPException: If credentials are invalid
        """
        # Check for existing valid token
        existing_token = request.cookies.get("jwt")
        if existing_token:
            payload = decode_token(existing_token)
            if payload:
                # Token is still valid
                user = await User.find_one(User.email == payload.get("email"))
                if user:
                    return {
                        "message": "Already logged in.",
                        "user": {
                            "email": user.email,
                            "name": user.name
                        }
                    }
        
        # Find user by email
        user = await User.find_one(User.email == data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials (User not found)."
            )
        
        # Verify password
        is_valid = verify_password(data.password, user.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials (Password mismatch)."
            )
        
        # Generate JWT token
        token_data = {
            "userId": str(user.id),
            "email": user.email
        }
        token = create_access_token(token_data)
        
        # Set secure HTTP-only cookie
        is_production = settings.ENVIRONMENT == "production"
        response.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            secure=is_production,
            samesite="none" if is_production else "lax",
            max_age=24 * 60 * 60  # 24 hours
        )
        
        return {
            "user": {
                "email": user.email
            },
            "message": "Login successful"
        }
    
    @staticmethod
    async def logout(response: Response) -> dict:
        """
        Logout user by clearing JWT cookie.
        
        Args:
            response: FastAPI response object
        
        Returns:
            Success message
        """
        is_production = settings.ENVIRONMENT == "production"
        response.delete_cookie(
            key="jwt",
            secure=is_production,
            samesite="none" if is_production else "lax",
            path="/"
        )
        
        return {"message": "Logout successful"}


# Create singleton instance
auth_controller = AuthController()
