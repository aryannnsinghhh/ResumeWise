import React, { useState } from 'react';
import Header from '../layout/Header';
// import Footer from '../layout/Footer';
import ScreeningForm from '../features/ScreeningForm';
import ResultsDisplay from '../features/ResultsDisplay';
import { useAuth } from '../context/AuthContext'; // Used for logout on session failure
import { useScreeningLoading } from '../context/ScreenLoadingContext';
import client from '../api/client'; // Your configured Axios client

// Define the shape of the data received from the LLM/Express API
export interface MatchResult {
  match_score_percent: number;
  fit_summary: string;
  critical_missing_skills: string[];
  technical_skills_matched: string[];
  soft_skills_matched: string[];
  extracted_data: {
    name: string;
    email: string;
    total_years_experience: number;
  };
  skill_breakdown: {
    technical_match_count: number;
    soft_skill_match_count: number;
  };
}

const ScreeningDashboard: React.FC = () => {
  const { logout } = useAuth(); // Get logout function from context
  const { setIsScreeningLoading } = useScreeningLoading();

  const [results, setResults] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the form submission and API call
  const handleScreeningSubmit = (formData: FormData) => {
    // 1. Reset state
    setResults(null);
    setError(null);
    setIsLoading(true);
    setIsScreeningLoading(true);

    // 2. Use Axios client for protected endpoint
    // console.log(formData);
    // console.log("--- Inspecting FormData ---");
    // for (const [key, value] of formData.entries()) {
    //     if (value instanceof File) {
    //         console.log(`Key: ${key}, Value: File (${value.name}, ${value.size} bytes)`);
    //     } else {
    //         console.log(`Key: ${key}, Value: ${value}`);
    //     }
    // }
    // console.log("---------------------------");

    client.post('/screen', formData, {})
    .then(response => {
        // Response data is the structured JSON from the LLM endpoint (200 OK)
        setResults(response.data as MatchResult);
    })
    .catch(err => {
        const statusCode = err.response?.status;
        
        // --- CRITICAL SECURITY CHECK ---
        if (statusCode === 401 || statusCode === 403) {
            // Token is invalid, missing, or expired (401/403 from verifyToken middleware)
            setError('Session expired or invalid. Please log in again.');
            logout(); // Clear frontend state and trigger redirection via AuthContext
            
        } else {
            // Handle other errors (500 from server, network error, etc.)
            const errorMessage = err.response?.data?.message || err.message;
            console.error("API Error:", errorMessage);
            setError(`Screening failed: ${errorMessage}`);
        }
    })
    .finally(() => {
        setIsLoading(false);
        setIsScreeningLoading(false);
    });
  };
  
  // Helper to allow users to start a new screen
  const handleNewScreen = () => {
      setResults(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">Resume Screening Dashboard</h1>
        
        {/* Conditional rendering based on state */}
        {results ? (
            // Show results if available
            <ResultsDisplay result={results} onNewScreen={handleNewScreen} />
        ) : (
            // Show input form otherwise
            <ScreeningForm 
                onSubmit={handleScreeningSubmit} 
                isLoading={isLoading} 
                error={error} 
            />
        )}
        
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ScreeningDashboard;
