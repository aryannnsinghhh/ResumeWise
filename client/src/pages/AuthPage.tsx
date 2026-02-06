import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
// import ArrowLeftIcon from '../ui/ArrowLeftIcon';
// import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  // State to toggle between true (Login) and false (Signup)
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(prev => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md"> {/* Wrapper to contain both form and button */}
        
        {/* The Auth Form component */}
        <AuthForm isLogin={isLogin} onSwitch={handleSwitch} />
        
        {/* Back to Home Button/Link */}
        {/* <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-blue-600 font-bold transition duration-150"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1 inline-block font-bold" />
            Back to Home
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default AuthPage;