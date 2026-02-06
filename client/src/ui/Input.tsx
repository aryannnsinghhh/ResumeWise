// src/components/ui/Input.tsx
import React, { type InputHTMLAttributes } from 'react';

// Extend base HTML input attributes for maximum flexibility
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string; // Optional field for displaying validation errors
}

const Input: React.FC<InputProps> = ({ label, id, error, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
          bg-white text-gray-900 transition duration-150 ease-in-out`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;