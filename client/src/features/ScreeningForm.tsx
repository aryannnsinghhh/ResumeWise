// src/components/features/ScreeningForm.tsx
import React, { useState, useRef, type DragEvent } from 'react';
import Button from '../ui/Button';

interface ScreeningFormProps {
    onSubmit: (formData: FormData) => void;
    isLoading: boolean;
    error: string | null;
}

// Define the file state type to hold the file object and its name
type FileInputState = {
    file: File | null;
    fileName: string;
    isDragging: boolean;
};

const ScreeningForm: React.FC<ScreeningFormProps> = ({ onSubmit, isLoading, error }) => {
    // State to manage input type choice (file vs. text)
    const [resumeInputType, setResumeInputType] = useState<'file' | 'text'>('file');
    const [jdInputType, setJdInputType] = useState<'file' | 'text'>('file');
    
    // State for text inputs
    const [resumeText, setResumeText] = useState('');
    const [jdText, setJdText] = useState('');
    
    // State for file inputs (includes drag state and file object)
    const [resumeFileState, setResumeFileState] = useState<FileInputState>({ file: null, fileName: '', isDragging: false });
    const [jdFileState, setJdFileState] = useState<FileInputState>({ file: null, fileName: '', isDragging: false });
    
    // Refs for triggering the hidden file input click
    const resumeFileInputRef = useRef<HTMLInputElement>(null);
    const jdFileInputRef = useRef<HTMLInputElement>(null);

    // --- Core Dropzone Handlers ---

    // Generic drag handler to prevent default browser behavior
    const handleDragEvents = (e: DragEvent<HTMLDivElement>, isOver: boolean, setState: React.Dispatch<React.SetStateAction<FileInputState>>) => {
        e.preventDefault();
        e.stopPropagation();
        setState(prev => ({ ...prev, isDragging: isOver }));
    };

    // Handles file selection from drag-and-drop or manual file input change
    const handleFileDropOrChange = (
        e: React.ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>, 
        setState: React.Dispatch<React.SetStateAction<FileInputState>>
    ) => {
        e.preventDefault();
        e.stopPropagation();
        let files: FileList | null = null;

        if ('dataTransfer' in e) {
            // Drag and drop event
            files = e.dataTransfer.files;
            setState(prev => ({ ...prev, isDragging: false })); // Stop dragging state
        } else {
            // Standard file change event
            files = e.target.files;
        }

        if (files && files.length > 0) {
            const file = files[0];
            setState({ file: file, fileName: file.name, isDragging: false });
        }
    };

    // --- Submission Logic ---

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        let isValid = true;

        // 2. Handle Resume Input
        if (resumeInputType === 'file' && resumeFileState.file) {
            formData.append('resume', resumeFileState.file);
        } else if (resumeInputType === 'text' && resumeText.trim()) {
            formData.append('resumeText', resumeText);
        } else {
            alert('Please provide a resume input (file or text).'); 
            isValid = false;
        }

        // 3. Handle JD Input
        if (jdInputType === 'file' && jdFileState.file) {
            formData.append('jobDescription', jdFileState.file);
        } else if (jdInputType === 'text' && jdText.trim()) {
            formData.append('jobDescriptionText', jdText);
        } else {
            alert('Please provide a job description input (file or text).');
            isValid = false;
        }

        if (isValid) {
            onSubmit(formData);
        }
    };

    // --- Render Dropzone Helper Component (Inline for Simplicity) ---
    
    const renderDropzone = (
        inputType: 'file' | 'text', 
        fileState: FileInputState, 
        setState: React.Dispatch<React.SetStateAction<FileInputState>>,
        fileRef: React.RefObject<HTMLInputElement | null>,
        placeholderText: string,
        accept: string
    ) => {
        if (inputType === 'file') {
            return (
                <div
                    // Dropzone Event Handlers
                    onDragOver={(e) => handleDragEvents(e, true, setState)}
                    onDragLeave={(e) => handleDragEvents(e, false, setState)}
                    onDrop={(e) => handleFileDropOrChange(e, setState)}
                    onClick={() => fileRef.current?.click()} // Click to open file dialog
                    
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition duration-300 min-h-[160px]
                        ${fileState.isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileRef} 
                        accept={accept} 
                        onChange={(e) => handleFileDropOrChange(e, setState)}
                        className="hidden" 
                    />
                    
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.885-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 9H7z"></path></svg>
                    
                    {fileState.fileName ? (
                        <p className="mt-2 text-sm font-medium text-green-600">File Selected: {fileState.fileName}</p>
                    ) : (
                        <p className="mt-2 text-sm text-gray-600 text-center">
                            Drag 'n' drop {placeholderText} here, or click to select
                        </p>
                    )}
                </div>
            );
        } else {
             return (
                 <textarea 
                    rows={6} 
                    value={fileRef === resumeFileInputRef ? resumeText : jdText} 
                    onChange={(e) => fileRef === resumeFileInputRef ? setResumeText(e.target.value) : setJdText(e.target.value)} 
                    placeholder={placeholderText}
                    className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500 h-full min-h-[160px]"
                />
            );
        }
    }


    // --- Final Render ---

    return (
        <div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl text-center md:text-left font-semibold mb-6">Upload & Analyze</h2>
            
            {/* Display Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    Error: {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className='flex flex-col gap-y-4 md:flex-row justify-between items-start gap-x-4'>
                    {/* ---------- RESUME INPUT AREA ---------- */}
                    <div className="border p-4 rounded-lg bg-gray-50 flex-1">
                        <h3 className="text-lg font-medium mb-3">1. Resume Input</h3>
                        
                        {/* Input Type Toggles */}
                        <div className="flex space-x-4 mb-3">
                            <Button variant={resumeInputType === 'file' ? 'primary' : 'secondary'} 
                                    type="button" 
                                    onClick={() => setResumeInputType('file')}
                                    className="text-sm py-1 px-3"
                            >Upload File (PDF/DOCX)</Button>
                            <Button variant={resumeInputType === 'text' ? 'primary' : 'secondary'} 
                                    type="button" 
                                    onClick={() => setResumeInputType('text')}
                                    className="text-sm py-1 px-3"
                            >Paste Text</Button>
                        </div>
                        
                        {renderDropzone(
                            resumeInputType, 
                            resumeFileState, 
                            setResumeFileState, 
                            resumeFileInputRef, 
                            "Resume file", 
                            ".pdf,.docx,.txt"
                        )}
                    </div>

                    {/* ---------- JOB DESCRIPTION AREA ---------- */}
                    <div className="border p-4 rounded-lg bg-gray-50 flex-1">
                        <h3 className="text-lg font-medium mb-3">2. Job Description Input</h3>
                        
                        {/* Input Type Toggles (JD) */}
                        <div className="flex space-x-4 mb-3">
                            <Button variant={jdInputType === 'file' ? 'primary' : 'secondary'} 
                                    type="button" 
                                    onClick={() => setJdInputType('file')}
                                    className="text-sm py-1 px-3"
                            >Upload File (PDF/DOCX)</Button>
                            <Button variant={jdInputType === 'text' ? 'primary' : 'secondary'} 
                                    type="button" 
                                    onClick={() => setJdInputType('text')}
                                    className="text-sm py-1 px-3"
                            >Paste Text</Button>
                        </div>

                        {renderDropzone(
                            jdInputType, 
                            jdFileState, 
                            setJdFileState, 
                            jdFileInputRef, 
                            "Job Description file", 
                            ".pdf,.docx,.txt"
                        )}
                    </div>
                </div>

                {/* ---------- SUBMIT BUTTON (Right-aligned) ---------- */}
                <div className='w-full flex justify-end'>
                    <Button type="submit" isLoading={isLoading} className="w-full">
                        Analyze Resume Fit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ScreeningForm;