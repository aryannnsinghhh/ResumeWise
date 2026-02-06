// src/components/features/ResultsDisplay.tsx
import React from 'react';
import { type MatchResult } from '../pages/ScreeningDashboard';
import Button from '../ui/Button';

interface ResultsDisplayProps {
    result: MatchResult;
    onNewScreen: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onNewScreen }) => {
    
    // Determine color based on match score
    const scoreColor = result.match_score_percent >= 75 ? 'text-green-600' :
                       result.match_score_percent >= 50 ? 'text-yellow-600' :
                       'text-red-600';
    
    // Helper to render skill tags
    const renderSkillTags = (skills: string[]) => (
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 border rounded bg-gray-50">
            {skills.length > 0 ? (
                skills.map((skill, index) => (
                    <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                        {skill}
                    </span>
                ))
            ) : (
                <p className="text-xs text-gray-500 italic p-1">No specific skills found in this category.</p>
            )}
        </div>
    );

    return (
        <div className="bg-white shadow-xl rounded-lg p-6 border-t-8 border-blue-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Screening Complete</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center border-b pb-6">
                {/* Match Score Display */}
                <div className="text-center md:col-span-1">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Overall Match Score</p>
                    <div className={`mt-2 font-extrabold ${scoreColor}`}>
                        <span className="text-6xl">{result.match_score_percent}</span>
                        <span className="text-3xl">%</span>
                    </div>
                </div>

                {/* Summary & Candidate Data */}
                <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xl font-semibold">Candidate Summary</h3>
                    <p className="text-gray-700 italic border-l-4 border-blue-200 pl-3">"{result.fit_summary}"</p>
                    <p className="text-sm text-gray-500 font-bold">
                        Experience Found: {result.extracted_data.total_years_experience} years
                    </p>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Skill Gaps (Unchanged) */}
                <div>
                    <h3 className="text-xl font-semibold text-red-700 mb-3">Critical Missing Skills</h3>
                    {result.critical_missing_skills.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {result.critical_missing_skills.map((skill, index) => (
                                <li key={index} className="text-sm text-red-500 font-medium">{skill}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-green-600 font-medium">No critical skills were identified as missing!</p>
                    )}
                </div>

                {/* 2. Skills Matched (Updated to show lists and counts) */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills Matched ({result.skill_breakdown.technical_match_count + result.skill_breakdown.soft_skill_match_count} Total)</h3>
                    
                    {/* Technical Skills List */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-md font-semibold text-gray-700">Technical Skills ({result.skill_breakdown.technical_match_count})</p>
                            
                        </div>
                        {renderSkillTags(result.technical_skills_matched)}
                    </div>
                    
                    {/* Soft Skills List */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-md font-semibold text-gray-700">Soft Skills ({result.skill_breakdown.soft_skill_match_count})</p>
                        </div>
                        {renderSkillTags(result.soft_skills_matched)}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <Button onClick={onNewScreen}>
                    Screen Another Candidate
                </Button>
            </div>
        </div>
    );
};

export default ResultsDisplay;