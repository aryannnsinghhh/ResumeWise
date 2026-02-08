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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', confirmPassword: '' });

  const clearErrors = () => {
    setError('');
    setFieldErrors({ email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsSubmitting(true);

    // Client-side validation
    const newFieldErrors = { email: '', password: '', confirmPassword: '' };

    if (!email.trim()) {
      newFieldErrors.email = "Email is required";
    } else if (!email.includes('@')) {
      newFieldErrors.email = "Invalid email";
    }

    if (!password) {
      newFieldErrors.password = "Password is required";
    } else if (password.length < 6) {
      newFieldErrors.password = "Min 6 characters";
    }

    if (!isLogin && password !== confirmPassword) {
      newFieldErrors.confirmPassword = "Passwords don't match";
    }

    if (newFieldErrors.email || newFieldErrors.password || newFieldErrors.confirmPassword) {
      setFieldErrors(newFieldErrors);
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
        await signup(email, password);
        alert('✅ Registration successful! Please log in.');
        onSwitch();
      }
      
    } catch (err: any) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const newErrors = { email: '', password: '', confirmPassword: '' };
          detail.forEach((error: any) => {
            const field = error.loc?.[1];
            if (field === 'email') newErrors.email = 'Invalid email';
            else if (field === 'password') newErrors.password = error.msg;
          });
          setFieldErrors(newErrors);
        } else {
          if (detail.includes('already registered')) setFieldErrors({ ...fieldErrors, email: detail });
          else setError(detail);
        }
      } else {
        setError('Network error');
      }
      
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        required
      />
      
      {!isLogin && (
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
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