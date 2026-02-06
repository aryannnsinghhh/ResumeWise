"""
Screening controller for AI-powered resume analysis.
Handles file uploads, document parsing, and Google Generative AI integration.
"""
import asyncio
import json
import httpx
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from pydantic import BaseModel

from app.models.screening import ScreeningResult, SCREENING_SCHEMA
from app.utils.document_parser import extract_text_from_file
from app.config.settings import settings


# Load prompt template
PROMPT_TEMPLATE_PATH = Path(__file__).parent.parent.parent / "prompt.txt"
try:
    with open(PROMPT_TEMPLATE_PATH, "r", encoding="utf-8") as f:
        PROMPT_TEMPLATE = f.read()
except FileNotFoundError:
    PROMPT_TEMPLATE = "Assume that you are the HR of a company currently hiring. I will provide you with a resume and a description of the job for which the resume has been submitted. Your task is to compare the resume with the job description and return a structured and extremely detailed analysis of the match between the two."


# Request Models
class ScreeningRequest(BaseModel):
    resumeText: Optional[str] = None
    jobDescriptionText: Optional[str] = None


# Constants
MAX_RETRIES = 5
INITIAL_BACKOFF = 1.0  # seconds


async def call_llm_screening(resume_text: str, job_description_text: str) -> ScreeningResult:
    """
    Call Google Generative AI to perform resume screening.
    Implements exponential backoff retry logic for 503 errors.
    
    Args:
        resume_text: Extracted resume text
        job_description_text: Job description text
    
    Returns:
        ScreeningResult with analysis
    
    Raises:
        Exception: If API call fails after retries
    """
    if not settings.GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY environment variable not set.")
    
    # Build the prompt
    prompt = f"""{PROMPT_TEMPLATE}
    JOB DESCRIPTION: 
    ---
    {job_description_text}
    ---

    RESUME TEXT: 
    ---
    {resume_text}
    ---"""
    
    # Request body for Gemini API
    request_body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": SCREENING_SCHEMA,
            "temperature": 0.1
        }
    }
    
    # Retry logic with exponential backoff
    for attempt in range(MAX_RETRIES):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                print(f'[LLM] Calling Gemini API (Attempt {attempt + 1}/{MAX_RETRIES})...')
                
                response = await client.post(
                    f"{settings.GEMINI_API_URL}?key={settings.GEMINI_API_KEY}",
                    json=request_body,
                    headers={"Content-Type": "application/json"}
                )
                
                # Success path
                if response.status_code == 200:
                    response_data = response.json()
                    
                    if response_data.get("candidates") and len(response_data["candidates"]) > 0:
                        json_text = response_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        result_dict = json.loads(json_text)
                        
                        # Parse into ScreeningResult model
                        screening_result = ScreeningResult(**result_dict)
                        return screening_result
                    
                    raise Exception("LLM response format was unexpected.")
                
                # Handle 503 Service Unavailable with retry
                elif response.status_code == 503 and attempt < MAX_RETRIES - 1:
                    backoff_time = (2 ** attempt) * INITIAL_BACKOFF
                    print(f"[LLM Retry] Attempt {attempt + 1}/{MAX_RETRIES} failed with 503. "
                          f"Retrying in {backoff_time}s...")
                    await asyncio.sleep(backoff_time)
                    continue
                
                # Other errors
                else:
                    error_detail = response.text
                    print(f"[LLM Error] Status {response.status_code}: {error_detail}")
                    raise Exception(f"LLM API request failed: {error_detail}")
        
        except httpx.TimeoutException:
            if attempt < MAX_RETRIES - 1:
                backoff_time = (2 ** attempt) * INITIAL_BACKOFF
                print(f"[LLM Retry] Timeout on attempt {attempt + 1}. Retrying in {backoff_time}s...")
                await asyncio.sleep(backoff_time)
                continue
            raise Exception("LLM API request timed out after multiple retries.")
        
        except Exception as e:
            if attempt < MAX_RETRIES - 1 and "503" in str(e):
                backoff_time = (2 ** attempt) * INITIAL_BACKOFF
                print(f"[LLM Retry] Error on attempt {attempt + 1}. Retrying in {backoff_time}s...")
                await asyncio.sleep(backoff_time)
                continue
            raise
    
    raise Exception("Maximum retry attempts reached for LLM API.")


class ScreeningController:
    """Controller for resume screening operations."""
    
    @staticmethod
    async def screen_candidate(
        resume_file: Optional[UploadFile] = None,
        job_description_file: Optional[UploadFile] = None,
        resume_text: Optional[str] = None,
        job_description_text: Optional[str] = None
    ) -> ScreeningResult:
        """
        Screen a candidate by comparing resume with job description.
        
        Args:
            resume_file: Uploaded resume file (PDF/DOCX/TXT)
            job_description_file: Uploaded JD file (PDF/DOCX/TXT)
            resume_text: Resume text (if no file uploaded)
            job_description_text: JD text (if no file uploaded)
        
        Returns:
            ScreeningResult with detailed analysis
        
        Raises:
            HTTPException: If validation fails or processing errors occur
        """
        try:
            # Process resume
            if resume_file and not resume_text:
                file_content = await resume_file.read()
                resume_text = await extract_text_from_file(
                    file_content,
                    resume_file.content_type or "text/plain"
                )
            
            # Process job description
            if job_description_file and not job_description_text:
                file_content = await job_description_file.read()
                job_description_text = await extract_text_from_file(
                    file_content,
                    job_description_file.content_type or "text/plain"
                )
            
            # Validate inputs
            if not resume_text or not resume_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing resume input (file or text)."
                )
            
            if not job_description_text or not job_description_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing job description input (file or text)."
                )
            
            # Call LLM for screening
            screening_result = await call_llm_screening(resume_text, job_description_text)
            
            return screening_result
        
        except HTTPException:
            raise
        except Exception as e:
            print(f"[Screening Error] {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error during screening process: {str(e)}"
            )


# Singleton instance
screening_controller = ScreeningController()
