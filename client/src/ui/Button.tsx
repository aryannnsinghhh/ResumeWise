// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string; // Allow custom Tailwind classes
  type?: "button" | "submit" | "reset";
  message?: string;
  logout?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isLoading = false,
  variant = 'primary',
  className = '',
  type = 'button',
  message = 'Loading...',
  logout = false,
}) => {
  const baseClasses = "font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          {!logout && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
          {message}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;