# ResumeWise AI

<h3>Video Demo Link: <a href="https://drive.google.com/file/d/1TWeAB2lsSnLss7LiY2YWAPTFMG_cdLV8/view?usp=sharing" target="_blank">Click Here</a></h3>

<h3>Deployment: <a href="https://resumewise-ai.vercel.app/" target="_blank">Click Here</a></h3>

## Overview

ResumeWise AI is a powerful, full-stack web application designed to streamline the initial stages of the recruitment process. It leverages artificial intelligence to analyze resumes against job descriptions, providing a detailed and structured comparison. This allows human resources (HR) professionals and hiring managers to quickly identify the most promising candidates.

## Features

-   **User Authentication:** Secure user registration and login system using JWT for session management.
-   **Resume Upload/Input:** Users can upload/input resumes in various formats (e.g., PDF, DOCX, text).
-   **Job Description Upload/Input:** A simple interface to upload/input the job description for the role being hired for.
-   **AI-Powered Analysis:** Utilizes Google's Generative AI to perform an in-depth analysis of the uploaded resume against the provided job description.
-   **Results Display:** Presents the analysis in a clear and structured format, highlighting the candidate's suitability for the role.
-   **Responsive UI:** A modern and responsive user interface built with React and Tailwind CSS.

## Tech Stack

### Frontend

-   **Framework:** React.js
-   **Language:** TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **HTTP Client:** Axios
-   **Routing:** React Router DOM

### Backend

-   **Framework:** Express.js
-   **Language:** TypeScript
-   **Runtime:** Node.js
-   **AI:** Google Generative AI
-   **Authentication:** JSON Web Tokens (JWT)
-   **File Handling:** Multer
-   **Database:** MongoDB with Mongoose

## Project Structure

The project is organized into two main directories:

-   `client/`: Contains the frontend React application.
-   `server/`: Contains the backend Node.js and Express.js application, including all API routes, controllers, models, and AI integration.

## Project Architecture

The general architecture of the ResumeWise AI Screener project follows a classic, secure **Three-Tier Architecture** pattern, optimized for **asynchronous processing** and utilizing a specific API service (the LLM Orchestrator) for its core intelligence.

- **Client Presentation Layer:** The user interacts with a responsive **Single-Page Application (SPA)** that handles all the presentation and user input (file upload/text paste) within the browser.

- **API Gateway & Firewall:** All client requests are routed through a central API server (the backend entry point). This layer includes middleware that acts as a firewall, validating the session token before any request proceeds to the business logic.

- **Secure Session Management:** User identity is maintained via a secure, **HTTP-Only session token (JWT)** stored in a cookie. The token is validated upon every request to maintain security without requiring persistent server-side session storage.
 
- **Data Ingestion & Storage:** User profile information and application configuration settings are persistently stored in a dedicated **NoSQL Document Database (MongoDB)**.

- **Asynchronous Pre-Processing (Concurrency):** The core screening route immediately identifies the inputs (file vs. text). If files are uploaded, the system executes two distinct file parsing tasks (Resume and JD) **concurrently** to minimize latency, waiting only for the longest task to complete.
 
- **Document Parsing Service:** A utility module converts the raw file buffers (PDF, DOCX) into clean, usable text strings. This is a critical step that prepares unstructured documents for the AI.
 
- **LLM Orchestration Layer:** This is the core intelligence component. It constructs a precise natural language prompt using the extracted text and a strict JSON Schema definition to communicate with the external Generative AI service (Gemini).

- **External AI Service:** The application relies on an external Generative AI Microservice to perform contextual comparison, scoring, and structured data extraction based on the provided schema.

- **Resilience & Retries:** The communication channel with the external AI service includes a built-in **Exponential Backoff Retry Mechanism** to gracefully handle transient service failures or overload conditions (e.g., 503 errors).

- **Structured Response:** The final output is a clean, structured JSON object (Match Score, Gap Lists, etc.). This object is returned to the client's presentation layer for visual display in the results dashboard, completing the cycle.

## LLM Prompt

Assume that you are the HR of a company currently hiring. I will provide you with a resume and a description of the job for which the resume has been submitted. Your task is to compare the resume with the job description and return a structured and extremely detailed analysis of the match between the two.

```text
JOB DESCRIPTION:
--- [Job Description Text] ---
RESUME TEXT: 
--- [Resume Text] ---
```

## LLM Output Format (Required JSON Schema)

The LLM response **must** be a structured JSON object containing all the following fields and sub-properties.

### 1. Core Metrics (Top-Level)

| Field | Type | Description |
| :--- | :--- | :--- |
| `match_score_percent` | Number (0-100) | The overall fit score from 0 to 100, indicating how well the candidate matches the job description. |
| `fit_summary` | String | A detailed five- to six-sentence summary of the candidate's primary strengths and weaknesses concerning the role. |
| `critical_missing_skills` | Array of Strings | A list of all MUST-HAVE skills or certifications mentioned in the job description that were absent from the resume. |

### 2. Detailed Skill Matching (New Arrays)

| Field | Type | Description |
| :--- | :--- | :--- |
| `technical_skills_matched` | Array of Strings | A list of all specific technical skills (e.g., Python, AWS, React) that the LLM successfully found and matched on the resume. |
| `soft_skills_matched` | Array of Strings | A list of all specific soft skills (e.g., leadership, communication, problem-solving) that the LLM successfully found and matched on the resume. |

### 3. Extracted Data (Object: `extracted_data`)

The sub-object `extracted_data` contains key personal and professional data points:

| Sub-Property | Description |
| :--- | :--- |
| `name` | The candidate's name. |
| `email` | The candidate's email address. |
| `total_years_experience` | The total relevant years of professional experience extracted from the document. |

### 4. Skill Counts (Object: `skill_breakdown`)

The sub-object `skill_breakdown` summarizes the skill counts (used for quick dashboard metrics):

| Sub-Property | Description |
| :--- | :--- |
| `technical_match_count` | The total count of technical skills matched (should equal the length of `technical_skills_matched`). |
| `soft_skill_match_count` | The total count of soft skills matched (should equal the length of `soft_skills_matched`). |

## Getting Started

### Prerequisites

-   Node.js and npm
-   Tailwind CSS
-   MongoDB
-   Gemini API

### Installation and Running

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```
