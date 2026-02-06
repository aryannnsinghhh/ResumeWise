// src/components/features/HeroSection.tsx
import React from 'react';
import Button from '../ui/Button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32 text-center relative overflow-hidden">
      {/* Background circles for visual flair */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl flex flex-col gap-y-4 font-extrabold leading-tight mb-6 animate-fade-in-up">
          Stop Guessing. Start Hiring.
          <br className="hidden md:inline" /> <span className="text-yellow-300">ResumeWise AI</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in-up animation-delay-500">
          The Smartest Way to Match Resumes to Job Descriptions Instantly.
          <br className="hidden md:inline" /> Turn hours of screening into minutes.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center animate-fade-in-up animation-delay-1000">
          {/* <Button onClick={() => console.log('Analyze First Resume!')}>
            Analyze My First Resume for Free
          </Button> */}
          <Button variant="outline" onClick={() => navigate('/auth')} className="border-white text-white hover:bg-white hover:text-blue-600">
            Get Started for Free
          </Button>
        </div>
        <div className="mt-12 text-lg opacity-80 animate-fade-in-up animation-delay-1500 font-semibold">
          Trusted by 500+ Hiring Teams Globally
          <div className="mt-4 flex justify-center space-x-6 opacity-70">
            {/* <img src="https://via.placeholder.com/60x30/2563eb/ffffff?text=CompanyA" alt="Company A" className="h-6 filter grayscale invert opacity-75" />
            <img src="https://via.placeholder.com/60x30/2563eb/ffffff?text=CompanyB" alt="Company B" className="h-6 filter grayscale invert opacity-75" />
            <img src="https://via.placeholder.com/60x30/2563eb/ffffff?text=CompanyC" alt="Company C" className="h-6 filter grayscale invert opacity-75" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;