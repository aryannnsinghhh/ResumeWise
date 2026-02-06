"""
Main FastAPI application entry point.
Handles app initialization, CORS, middleware, routes, and lifecycle events.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.config import settings, ALLOWED_ORIGINS, init_db, close_db
from app.routes import auth_router, screening_router
from app.utils.scheduler import setup_scheduler, shutdown_scheduler


# MongoDB client instance (will be set during startup)
db_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    print("🚀 Starting ResumeWise FastAPI Server...")
    global db_client
    db_client = await init_db()
    setup_scheduler()
    print(f"✅ Server running on {settings.HOST}:{settings.PORT}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down server...")
    shutdown_scheduler()
    if db_client:
        await close_db(db_client)
    print("👋 Server shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="ResumeWise AI API",
    description="AI-powered resume screening and analysis API",
    version="2.0.0",
    lifespan=lifespan
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Register Routes
app.include_router(auth_router)
app.include_router(screening_router)


# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def root():
    """Welcome endpoint."""
    return """
    <html>
        <head>
            <title>ResumeWise API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                }
                h1 {
                    font-size: 3em;
                    margin-bottom: 0.2em;
                }
                p {
                    font-size: 1.2em;
                }
                a {
                    color: #fff;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 Welcome to ResumeWise API</h1>
                <p>FastAPI Backend Server</p>
                <p>Visit <a href="/docs">/docs</a> for interactive API documentation</p>
            </div>
        </body>
    </html>
    """


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "ResumeWise API",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
