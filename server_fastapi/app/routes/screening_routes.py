"""
Screening routes.
Handles resume screening and analysis operations.
"""
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.controllers.screening_controller import screening_controller
from app.middleware import require_auth
from app.models.screening import ScreeningResult


router = APIRouter(prefix="/api", tags=["Screening"])


@router.post("/screen", response_model=ScreeningResult)
async def screen_candidate(
    resume: Optional[UploadFile] = File(None),
    jobDescription: Optional[UploadFile] = File(None),
    resumeText: Optional[str] = Form(None),
    jobDescriptionText: Optional[str] = Form(None),
    _: dict = Depends(require_auth)
):
    """
    Screen a candidate by comparing their resume with the job description.
    
    Accepts either file uploads or text input:
    - resume: Resume file (PDF, DOCX, or TXT)
    - jobDescription: Job description file (PDF, DOCX, or TXT)
    - resumeText: Resume as plain text
    - jobDescriptionText: Job description as plain text
    
    Returns:
        Detailed screening analysis with match score, skills breakdown, etc.
    """
    return await screening_controller.screen_candidate(
        resume_file=resume,
        job_description_file=jobDescription,
        resume_text=resumeText,
        job_description_text=jobDescriptionText
    )
