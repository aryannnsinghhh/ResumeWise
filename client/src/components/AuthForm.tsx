import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ArrowLeftIcon from '../ui/ArrowLeftIcon';
import { Link, useNavigate } from 'react-router-dom'; // <-- ADDED: useNavigate
import { useAuth } from '../context/AuthContext';    // <-- NEW: Import useAuth

interface AuthFormProps {
  isLogin: boolean; // Flag to determine if it's the Login or Signup view
  onSwitch: () => void; // Function to switch between views
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSwitch }) => {
  const navigate = useNavigate(); // Initialize navigation
  const { login, signup } = useAuth(); // Get auth functions from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // <-- NEW: State for name field
  
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading
  const [error, setError] = useState('');

  // Remove unused API_ENDPOINT constant

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    
    if (!isLogin && !name.trim()) {
        setError("Please provide your name.");
        setIsSubmitting(false);
        return;
    }


    try {
      if (isLogin) {
        // CALL CONTEXT LOGIN FUNCTION
        await login(email, password);
        
        // On successful login, the AuthProvider updates state, and we redirect to dashboard
        navigate('/dashboard', { replace: true });
        
      } else {
        // CALL CONTEXT SIGNUP FUNCTION
        await signup(email, password, name);
        
        // On successful signup, show message and redirect user to the login form
        alert('Registration successful! Please log in.');
        onSwitch(); // Switch to the login view
      }
      
    } catch (err: any) {
      // Axios error handling sends the message through err.response.data
      const errorMessage = err.response?.data?.message || 'An unknown network error occurred.';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
        
      {!isLogin && (
        <Input
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {!isLogin && (
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-6">
        {isLogin ? 'Log In to ResumeWise' : 'Sign Up'}
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button type="button" onClick={onSwitch} className="font-medium text-blue-600 hover:text-blue-500 ml-1">
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>

      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className="text-sm text-gray-600 hover:text-blue-600 font-bold transition duration-150"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1 inline-block font-bold" />
          Back to Home
        </Link>
      </div>
    </form>
  );
};

export default AuthForm;