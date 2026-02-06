// src/components/layout/Header.tsx
import { useState } from 'react';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- NEW: Import useAuth hook
import { useScreeningLoading } from '../context/ScreenLoadingContext';
import Button from '../ui/Button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // 1. Get authentication status and actions from the global context
  const { isAuthenticated, user, logout } = useAuth();
  const { isScreeningLoading } = isAuthenticated ? useScreeningLoading() : { isScreeningLoading: false };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const handleLogout = () => {
  //     setIsLoggingOut(true);
  //     logout();
  //     // Added a slight delay for realism, though state updates immediately
  //     setTimeout(() => setIsLoggingOut(false), 100); 
  // };

  const handleMobileNavigation = (path: string) => {
      setIsMobileMenuOpen(false);
      if (path.startsWith('/')) {
        navigate(path);
      } else {
        // Handle anchor tags if needed
        window.location.href = path;
      }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo/Title: Use Link to navigate back to the home page */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-3xl font-extrabold text-blue-600 transition duration-150">
            ResumeWise
          </h1>
        </Link>
        
        <div className='flex items-center space-x-6'>
            <nav className="hidden md:block">
                <ul className="flex space-x-8">
                    {/* Use Link or smooth scrolling to sections */}
                    {!isAuthenticated && (
                      <li><a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Features</a></li>
                    )}
                    {!isAuthenticated && (
                      <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Testimonials</a></li>
                    )}
                </ul>
            </nav>
            
            {/* 2. Conditional Rendering for Auth Buttons */}
            <div className="hidden md:block">
                {isAuthenticated ? (
                    // --- Logged In State ---
                    <div className="flex items-center space-x-3">
                        {/* Display User Information (Name/Email) */}

                        {user && (<div className="text-right leading-snug">
                            <p className="text-md font-semibold text-gray-800">Hi, {user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>)}
                        
                        {/* Logout Button */}
                        <Button 
                            variant="outline" 
                            onClick={logout} // Call the logout function from context
                            className="text-red-600 border-red-400 hover:bg-red-50"
                            isLoading={isScreeningLoading} // <-- Use the global loading state
                            message='Logout'
                            logout={true}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    // --- Logged Out State ---
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/auth')}
                    >
                        Login / Signup
                    </Button>
                )}
            </div>

            {/* 3. MOBILE HAMBURGER ICON (Visible below md breakpoint) */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition duration-150"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {/* REPLACED INLINE SVG with Lucide components */}
              {isMobileMenuOpen ? (
                  <X className="h-6 w-6" /> // Close X Icon
              ) : (
                  <Menu className="h-6 w-6" /> // Hamburger Menu Icon
              )}
            </button>
        </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200 p-4 shadow-lg absolute w-full left-0 z-40 space-y-4">
              
              {isAuthenticated && user ? (
                  // LOGGED IN MOBILE VIEW: Shows user info, Dashboard, and Logout
                  <div className="space-y-3">
                      {/* User Info (Stacked) */}
                      <div className="text-center pb-2 border-b border-gray-200">
                          <p className="text-md font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      {/* Dashboard Link */}
                      {/* <Link 
                          to="/dashboard" 
                          onClick={() => handleMobileNavigation('/dashboard')}
                          className="flex items-center justify-center w-full py-2 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
                      >
                           <LayoutDashboard className='w-5 h-5 mr-2' /> Go to Dashboard
                      </Link> */}

                      {/* Logout Button */}
                      <Button 
                          variant="outline" 
                          onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                          className="w-full text-red-600 border-red-400 hover:bg-red-50"
                          isLoading={isScreeningLoading} 
                          message='Logout'
                          logout={true}
                      >
                          Logout
                      </Button>
                  </div>
              ) : (
                  // LOGGED OUT MOBILE VIEW: Shows public navigation and Login/Signup
                  <div className="space-y-3">
                      {/* Navigation Links */}
                      <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg">
                          Features
                      </a>
                      <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg">
                          Testimonials
                      </a>
                      
                      {/* Login/Signup Button */}
                      <Button 
                          variant="primary" 
                          onClick={() => { handleMobileNavigation('/auth'); }} 
                          className="w-full mt-3"
                      >
                          Login / Signup
                      </Button>
                  </div>
              )}
          </div>
      )}
    </header>
  );
};

export default Header;