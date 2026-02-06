# ResumeWise FastAPI Backend

Complete Python FastAPI migration of the ResumeWise backend from Express.js/TypeScript.

## Features

- ✅ FastAPI framework with async/await support
- ✅ MongoDB with Beanie ODM (async)
- ✅ JWT authentication with HTTP-only cookies
- ✅ File upload support (PDF, DOCX, TXT)
- ✅ Google Generative AI integration
- ✅ Automatic API documentation (Swagger/OpenAPI)
- ✅ Background task scheduling with APScheduler
- ✅ CORS configured for frontend integration

## Tech Stack

- **Framework**: FastAPI 0.115+
- **Database**: MongoDB with Motor (async driver)
- **ODM**: Beanie (Pydantic-based)
- **Authentication**: python-jose + passlib (bcrypt)
- **File Processing**: PyPDF2 + python-docx
- **AI**: Google Generative AI Python SDK
- **Scheduler**: APScheduler
- **Server**: Uvicorn (ASGI server)

## Project Structure

```
server_fastapi/
├── app/
│   ├── __init__.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py      # Environment configuration
│   │   └── db.py            # MongoDB connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   └── screening.py     # Screening result models
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── auth_controller.py       # Authentication logic
│   │   └── screening_controller.py  # Screening logic
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py           # Auth endpoints
│   │   └── screening_routes.py      # Screening endpoints
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth_middleware.py       # JWT verification
│   └── utils/
│       ├── __init__.py
│       ├── auth.py                  # JWT utilities
│       ├── document_parser.py       # File parsing
│       └── scheduler.py             # Background tasks
├── main.py                # Application entry point
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore
├── prompt.txt            # AI prompt template
└── README.md

```

## Installation

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGO_URL, JWT_SECRET, GEMINI_API_KEY
```

### 4. Set Up MongoDB

Ensure MongoDB is running locally or provide a MongoDB Atlas connection string in `.env`:

```
MONGO_URL=mongodb://localhost:27017/resumewise
# or
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/resumewise
```

## Running the Server

### Development Mode (with auto-reload)

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
python main.py
```

Or with Uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user profile

### Screening

- `POST /api/screen` - Screen candidate resume (requires auth)

### Health

- `GET /` - Welcome page
- `GET /health` - Health check endpoint

## Environment Variables

```bash
# Server Configuration
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# MongoDB
MONGO_URL=mongodb://localhost:27017/resumewise

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Google Generative AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

# Client URLs (for CORS)
CLIENT_DEV_URL=http://localhost:5173
CLIENT_PROD_URL=https://resumewise-ai.vercel.app
```

## Migration from Express.js

This FastAPI backend is a complete replacement for the original Express.js backend. Key improvements:

### ✅ What Changed

- **Language**: TypeScript → Python
- **Framework**: Express.js → FastAPI
- **Database Driver**: Mongoose → Beanie + Motor
- **Auth Library**: jsonwebtoken + bcrypt → python-jose + passlib
- **File Upload**: Multer → FastAPI UploadFile
- **Document Parsing**: pdf-parse + mammoth → PyPDF2 + python-docx
- **Scheduler**: node-cron → APScheduler

### ✅ What Stayed the Same

- **Database**: MongoDB (same database, no migration needed!)
- **API Endpoints**: Same paths and request/response formats
- **Authentication**: JWT with HTTP-only cookies
- **AI Integration**: Google Generative AI
- **Core Logic**: Resume screening algorithm

### Frontend Integration

No changes needed in the frontend! The API contract is identical:

```javascript
// Same endpoints work with FastAPI backend
axios.post('/api/auth/login', { email, password })
axios.post('/api/screen', formData)
```

Just update the backend URL in your frontend `.env`:

```
VITE_API_URL=http://localhost:8000
```

## Testing

### Manual Testing

Use the Swagger UI at http://localhost:8000/docs to test all endpoints interactively.

### cURL Examples

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get User (with cookie)
curl -X GET http://localhost:8000/api/auth/user \
  -b cookies.txt
```

## Deployment

### Render / Railway / Heroku

1. Add `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. Set environment variables in the platform dashboard

3. Deploy!

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t resumewise-api .
docker run -p 8000:8000 --env-file .env resumewise-api
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas, whitelist your IP)

### Import Errors

- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Port Already in Use

```bash
# Change PORT in .env
PORT=8001
```

## Performance

FastAPI is significantly faster than Express.js:

- **Async/await**: Native async support
- **Pydantic**: Fast data validation
- **Uvicorn**: High-performance ASGI server
- **Type hints**: Better IDE support and fewer bugs

## License

Same as original project.

## Contributing

Same as original project.

## Questions?

For migration-specific questions, check the original Express.js code in the `server/` directory for reference.
