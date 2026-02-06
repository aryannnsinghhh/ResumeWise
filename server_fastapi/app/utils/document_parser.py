"""
Document processing utilities for extracting text from PDF and DOCX files.
"""
import io
from typing import BinaryIO
from PyPDF2 import PdfReader
from docx import Document


async def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extract text from a PDF file.
    
    Args:
        file_content: PDF file content as bytes
    
    Returns:
        Extracted text as string
    
    Raises:
        Exception: If PDF processing fails
    """
    try:
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        
        return "\n".join(text_parts).strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")


async def extract_text_from_docx(file_content: bytes) -> str:
    """
    Extract text from a DOCX file.
    
    Args:
        file_content: DOCX file content as bytes
    
    Returns:
        Extracted text as string
    
    Raises:
        Exception: If DOCX processing fails
    """
    try:
        docx_file = io.BytesIO(file_content)
        doc = Document(docx_file)
        
        text_parts = []
        for paragraph in doc.paragraphs:
            if paragraph.text:
                text_parts.append(paragraph.text)
        
        return "\n".join(text_parts).strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from DOCX: {str(e)}")


async def extract_text_from_file(file_content: bytes, mime_type: str) -> str:
    """
    Extract text from a file based on its MIME type.
    
    Args:
        file_content: File content as bytes
        mime_type: MIME type of the file
    
    Returns:
        Extracted text as string
    
    Raises:
        Exception: If file format is unsupported or processing fails
    """
    if mime_type == "application/pdf":
        return await extract_text_from_pdf(file_content)
    
    elif mime_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]:
        return await extract_text_from_docx(file_content)
    
    elif mime_type == "text/plain":
        return file_content.decode("utf-8").strip()
    
    else:
        raise Exception(f"Unsupported file format: {mime_type}")
