import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the Auth Provider and Hook
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { ScreeningLoadingProvider } from './context/ScreenLoadingContext';

// Import your pages
import HomePage from './pages/HomePage'; 
import AuthPage from './pages/AuthPage';
import ScreeningDashboard from './pages/ScreeningDashboard';

// --- Redirect If Authenticated Component (for public routes like / and /auth) ---
// If logged in, redirects user to the dashboard.
interface RedirectIfAuthenticatedProps {
  element: React.ReactElement; 
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
      return null; 
  }

  // If authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } 
  
  // If NOT authenticated, render the public page
  return element;
};
// ----------------------------------------------------


// --- Protected Route Component (for /dashboard) ---
// Renders the element ONLY if the user IS logged in.
interface ProtectedRouteProps {
  element: React.ReactElement; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
      return null;
  }

  // If authenticated, render the dashboard
  if (isAuthenticated) {
    return element;
  } 
  
  // If NOT authenticated, redirect to the login page (/auth)
  return <Navigate to="/auth" replace />;
};
// ----------------------------------------------------

// --- General Redirect Component (for the catch-all '*') ---
// Redirects *any* authenticated user trying to access an undefined route to the dashboard.
const GeneralRedirect: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    // If authenticated, redirect them back to the main authenticated area
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // If not authenticated, show the 404 page
    return <div className="text-center p-20 text-xl">404 | Page Not Found</div>;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* 1. Root Route: Redirects to Dashboard if logged in */}
          <Route 
            path="/" 
            element={<RedirectIfAuthenticated element={<HomePage />} />} 
          />
          
          {/* 2. Public/Auth Route: Redirects to Dashboard if logged in */}
          <Route 
            path="/auth" 
            element={<RedirectIfAuthenticated element={<AuthPage />} />} 
          />
          
          {/* 3. Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ScreeningLoadingProvider>
                <ProtectedRoute element={<ScreeningDashboard />} />
              </ScreeningLoadingProvider> 
            } 
          />

          {/* 4. Catch-all: Redirects to Dashboard if authenticated, otherwise 404 */}
          <Route path="*" element={<GeneralRedirect />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;