# ResumeWise

## Overview

ResumeWise is a full-stack AI-powered resume screening platform that automates initial candidate evaluation by intelligently analyzing resumes against job descriptions. Built with FastAPI and React, it leverages Google's Generative AI to provide structured, detailed candidate assessments with match scoring, skill gap analysis, and suitability recommendations—reducing manual screening time for HR professionals and hiring managers.

## Key Features

-   **JWT-Based Authentication:** Secure user registration, login, and logout with HTTP-only cookie sessions and middleware-protected routes.
-   **Flexible Input Methods:** Support for both file uploads (PDF, DOCX, TXT) and direct text input for resumes and job descriptions.
-   **Concurrent Document Processing:** Asynchronous parsing of multiple document formats with PyPDF2 and python-docx libraries.
-   **AI-Powered Semantic Analysis:** Google Generative AI (Gemini) integration for intelligent resume-to-job-description matching with structured JSON Schema responses.
-   **Comprehensive Candidate Evaluation:** 
    - Overall match score (0-100%)
    - Detailed fit summary with strengths and weaknesses
    - Matched technical and soft skills
    - Critical missing skills identification
    - Extracted candidate information (name, email, experience)
-   **Resilient API Integration:** Exponential backoff retry mechanism for handling AI service transient failures.
-   **Responsive Modern UI:** React-TypeScript frontend with Tailwind CSS, featuring real-time loading states and instant result display.
-   **RESTful API Architecture:** Clean separation of concerns with routes, controllers, models, and middleware layers.

## Tech Stack

### Frontend

-   **Framework:** React 19
-   **Language:** TypeScript 5.9
-   **Build Tool:** Vite 7
-   **Styling:** Tailwind CSS 3.4
-   **HTTP Client:** Axios
-   **Routing:** React Router DOM 7
-   **Icons:** Lucide React

### Backend

-   **Framework:** FastAPI 0.115
-   **Language:** Python 3.8+
-   **Server:** Uvicorn with standard extras
-   **AI:** Google Generative AI (Gemini)
-   **Authentication:** JWT (python-jose) + bcrypt password hashing
-   **Database:** MongoDB with Beanie ODM (Motor async driver)
-   **Document Processing:** PyPDF2 & python-docx
-   **Task Scheduling:** APScheduler
-   **HTTP Client:** httpx (async)

## Project Structure

```
ResumeWise/
├── client/                          # React TypeScript frontend
│   ├── src/
│   │   ├── api/                     # API client utilities
│   │   ├── components/              # Reusable React components
│   │   │   └── AuthForm.tsx        # Authentication form
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.tsx     # User authentication state
│   │   │   └── ScreenLoadingContext.tsx  # Loading state management
│   │   ├── features/                # Feature-specific components
│   │   │   ├── FeatureOverview.tsx
│   │   │   ├── ResultsDisplay.tsx  # AI analysis results display
│   │   │   ├── ScreeningForm.tsx   # Resume/JD upload form
│   │   │   └── Testimonials.tsx
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/                   # Page-level components
│   │   │   ├── HomePage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   └── ScreeningDashboard.tsx
│   │   ├── ui/                      # UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ArrowLeftIcon.tsx
│   │   ├── App.tsx                  # Main app with routing
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── server_fastapi/                  # Python FastAPI backend
    ├── app/
    │   ├── config/                  # Configuration & database
    │   │   ├── settings.py         # Environment variables
    │   │   └── db.py               # MongoDB connection
    │   ├── controllers/             # Business logic
    │   │   ├── auth_controller.py  # Auth operations
    │   │   └── screening_controller.py  # AI screening logic
    │   ├── middleware/              # Request middleware
    │   │   └── auth_middleware.py  # JWT verification
    │   ├── models/                  # Data models
    │   │   ├── user.py             # User schema
    │   │   └── screening.py        # Screening result schema
    │   ├── routes/                  # API endpoints
    │   │   ├── auth_routes.py      # Auth endpoints
    │   │   └── screening_routes.py # Screening endpoints
    │   └── utils/                   # Utility functions
    │       ├── auth.py             # JWT & password utils
    │       ├── document_parser.py  # PDF/DOCX extraction
    │       └── scheduler.py        # APScheduler tasks
    ├── main.py                      # FastAPI app entry point
    ├── requirements.txt
    └── prompt.txt                   # LLM prompt template
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST /signup** - Register new user account
- **POST /login** - Authenticate user and create session
- **POST /logout** - Clear user session (protected)
- **GET /user** - Get current authenticated user info (protected)

### Screening Routes (`/api`)
- **POST /screen** - Analyze resume against job description (protected)
  - Accepts file uploads (PDF/DOCX/TXT) or text input
  - Returns structured AI analysis with match score, skills, and recommendations

## Architecture Overview

ResumeWise follows a **secure three-tier architecture** with async processing:

**1. Frontend (Client Tier)**
- React SPA with TypeScript for type safety
- Context API for global state (auth, loading)
- Axios for HTTP requests with JWT cookies
- Protected and public route guards

**2. Backend (API Tier)**
- FastAPI with async/await for concurrent operations
- JWT middleware protecting sensitive endpoints
- HTTP-only cookies for secure session storage
- Lifespan events for database connection management

**3. Data Tier**
- MongoDB with Beanie ODM for async database operations
- User collection for authentication
- Efficient document-based storage for screening results

**4. External Services**
- Google Generative AI (Gemini) for semantic analysis
- Exponential backoff retry (5 attempts) for reliability

**Data Flow:**
1. User uploads resume + job description (or pastes text)
2. Backend validates JWT and processes files concurrently
3. Document parser extracts text from PDF/DOCX
4. Structured prompt sent to Gemini API with JSON schema
5. AI response parsed and validated
6. Results displayed instantly in React dashboard

## AI Analysis Output

The screening endpoint returns a structured JSON response with the following fields:

**Core Metrics:**
- `match_score_percent` (0-100): Overall candidate fit score
- `fit_summary`: Detailed 5-6 sentence assessment of strengths and weaknesses
- `critical_missing_skills`: Array of required skills absent from resume

**Skill Analysis:**
- `technical_skills_matched`: Array of matched technical skills (Python, React, AWS, etc.)
- `soft_skills_matched`: Array of matched soft skills (leadership, communication, etc.)

**Extracted Candidate Data:**
- `name`: Candidate's name
- `email`: Contact email
- `total_years_experience`: Calculated work experience

**Skill Breakdown:**
- `technical_match_count`: Number of technical skills matched
- `soft_skill_match_count`: Number of soft skills matched

## Getting Started

### Prerequisites

-   **Python 3.8+** with pip
-   **Node.js 18+** and npm
-   **MongoDB** (local installation or MongoDB Atlas account)
-   **Google Gemini API key** ([Get it here](https://makersuite.google.com/app/apikey))

### Environment Configuration

**Backend (.env in `server_fastapi/`):**
```bash
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=resumewise

# Server
HOST=0.0.0.0
PORT=8000

# Security
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Google AI
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend (.env in `client/`):**
```bash
VITE_SERVER_URL=http://localhost:8000
```

### Installation

**1. Backend Setup:**
```bash
cd server_fastapi
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

# Create and configure .env file (see above)

# Run the server
python main.py
```

Server will start on `http://localhost:8000`

**2. Frontend Setup:**
```bash
cd client
npm install

# Create .env file (see above)

npm run dev
```

Frontend will start on `http://localhost:5173`

### Quick Start Commands

**Backend:**
```bash
cd server_fastapi
.\venv\Scripts\python.exe main.py
```

**Frontend:**
```bash
cd client
npm run dev
```

## Usage

1. Navigate to `http://localhost:5173`
2. Register/Login with your credentials
3. Upload resume and job description (PDF/DOCX) or paste text
4. Click "Screen Candidate"
5. View detailed AI analysis with match scores and recommendations

## Project Features Implemented

✅ **Authentication System**
- User registration and login
- JWT-based session management
- HTTP-only cookie storage
- Protected route middleware

✅ **Document Processing**
- PDF parsing with PyPDF2
- DOCX parsing with python-docx
- Text input support
- Concurrent file processing

✅ **AI Integration**
- Google Gemini API integration
- Structured JSON schema responses
- Exponential backoff retry mechanism
- Custom prompt template

✅ **Frontend**
- React 19 with TypeScript
- Tailwind CSS styling
- Context-based state management
- Protected and public routes
- Real-time loading indicators
- Responsive design

✅ **Backend**
- FastAPI async architecture
- MongoDB with Beanie ODM
- JWT authentication middleware
- RESTful API endpoints
- APScheduler for background tasks
- CORS configuration

## Technologies & Libraries

**Frontend:**
- react, react-dom, react-router-dom
- typescript, vite
- tailwindcss, postcss, autoprefixer
- axios
- lucide-react (icons)

**Backend:**
- fastapi, uvicorn
- beanie, motor, pymongo (MongoDB)
- python-jose, passlib, bcrypt (Auth)
- google-generativeai
- PyPDF2, python-docx, pypdf
- APScheduler
- httpx, requests
- python-dotenv, pydantic

## Contributing

This is a portfolio project. Suggestions and feedback are welcome!

## License

This project is open source and available for educational purposes.

---

**Built with ❤️ using React, TypeScript, FastAPI, MongoDB, and Google Generative AI**