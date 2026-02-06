// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs sm:text-sm order-2 md:order-none mt-3 md:mt-0">
          &copy; {new Date().getFullYear()} ResumeWise. All rights reserved.
        </p>
        <div className="flex justify-center space-x-3 sm:space-x-4 text-xs sm:text-sm items-center order-1 md:order-none mb-3 md:mb-0">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms of Service</a>
          <a href="#" className="hover:text-blue-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;