"""
Screening result models for AI-powered resume analysis.
Defines the structure for screening responses from Google Generative AI.
"""
from typing import List
from pydantic import BaseModel, Field


class ExtractedData(BaseModel):
    """Candidate data extracted from resume."""
    name: str = Field(..., description="Candidate's full name")
    email: str = Field(..., description="Candidate's email address")
    total_years_experience: float = Field(
        ..., 
        description="Total relevant years of experience"
    )


class SkillBreakdown(BaseModel):
    """Breakdown of matched skills counts."""
    technical_match_count: int = Field(
        ..., 
        description="Count of matched technical skills"
    )
    soft_skill_match_count: int = Field(
        ..., 
        description="Count of matched soft skills"
    )


class ScreeningResult(BaseModel):
    """
    Complete screening analysis result from AI.
    This matches the schema expected by Google Generative AI.
    """
    match_score_percent: float = Field(
        ..., 
        ge=0, 
        le=100,
        description="Percentage fit score (0-100)"
    )
    fit_summary: str = Field(
        ..., 
        description="Five to six-sentence summary of candidate's fit"
    )
    critical_missing_skills: List[str] = Field(
        default_factory=list,
        description="Must-have skills from JD not present on resume"
    )
    technical_skills_matched: List[str] = Field(
        default_factory=list,
        description="Matched technical skills (e.g., Python, AWS, React)"
    )
    soft_skills_matched: List[str] = Field(
        default_factory=list,
        description="Matched soft skills (e.g., leadership, communication)"
    )
    extracted_data: ExtractedData = Field(
        ..., 
        description="Extracted candidate information"
    )
    skill_breakdown: SkillBreakdown = Field(
        ..., 
        description="Skill match statistics"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "match_score_percent": 85.5,
                "fit_summary": "Strong candidate with relevant experience...",
                "critical_missing_skills": ["AWS Certification", "Kubernetes"],
                "technical_skills_matched": ["Python", "FastAPI", "MongoDB"],
                "soft_skills_matched": ["Leadership", "Communication"],
                "extracted_data": {
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "total_years_experience": 5.0
                },
                "skill_breakdown": {
                    "technical_match_count": 8,
                    "soft_skill_match_count": 4
                }
            }
        }


# Schema definition for Google Generative AI
SCREENING_SCHEMA = {
    "type": "object",
    "properties": {
        "match_score_percent": {
            "type": "number",
            "description": "A score from 0 to 100 indicating the percentage fit of the resume to the job description."
        },
        "fit_summary": {
            "type": "string",
            "description": "A five to six-sentence summary of the candidate's core strengths and weaknesses relative to the job."
        },
        "critical_missing_skills": {
            "type": "array",
            "items": {"type": "string"},
            "description": "A list of all MUST-HAVE skills or certifications from the JD that are not present on the resume."
        },
        "technical_skills_matched": {
            "type": "array",
            "items": {"type": "string"},
            "description": "A list of all specific technical skills (e.g., Python, AWS, React) successfully found and matched on the resume."
        },
        "soft_skills_matched": {
            "type": "array",
            "items": {"type": "string"},
            "description": "A list of all specific soft skills (e.g., leadership, communication, problem-solving) successfully found and matched on the resume."
        },
        "extracted_data": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "total_years_experience": {
                    "type": "number",
                    "description": "Total relevant years of experience extracted from the resume."
                }
            },
            "required": ["name", "email", "total_years_experience"]
        },
        "skill_breakdown": {
            "type": "object",
            "properties": {
                "technical_match_count": {"type": "number"},
                "soft_skill_match_count": {"type": "number"}
            },
            "required": ["technical_match_count", "soft_skill_match_count"]
        }
    },
    "required": [
        "match_score_percent",
        "fit_summary",
        "critical_missing_skills",
        "technical_skills_matched",
        "soft_skills_matched",
        "extracted_data",
        "skill_breakdown"
    ]
}
