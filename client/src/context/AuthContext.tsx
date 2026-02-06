import React, { 
    createContext, 
    useContext, 
    useState, 
    useMemo, 
    useEffect, 
    type ReactNode 
} from 'react';
import client from '../api/client'; // Assuming you have configured the Axios client here

// Define the shape of the User data returned by the backend
interface UserData {
    email: string;
    name: string; 
}

// 1. Define the Context's Shape (State and Actions)
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  // FIX: login now accepts credentials and is an asynchronous function that returns a Promise.
  login: (email: string, password: string) => Promise<void>; 
  // NEW: signup function added
  signup: (email: string, password: string, name: string) => Promise<void>; 
  logout: () => void;
  isLoading: boolean; 
}

// 2. Create the Context with a default (unauthenticated) value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  // --- Session Persistence Logic: Check the Cookie on Server ---
  useEffect(() => {
    // Call the protected endpoint to check if the JWT cookie is valid
    client.get('/auth/user') 
        .then(response => {
            // Success: Cookie is valid. Backend returned user data.
            const userData = response.data.user;
            setUser({ email: userData.email, name: userData.name });
        })
        .catch(() => {
            // Failure: Cookie missing, expired, or invalid. Backend should have cleared it.
            setUser(null); 
        })
        .finally(() => {
            setIsLoading(false);
        });
  }, []); // Run only once on mount

  // FIX: login now handles the network request and error propagation
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true); // Set loading while the request is pending
    try {
        const response = await client.post('/auth/login', { email, password });
        
        // Success: The cookie was set by the backend. We only update frontend state.
        const userData = response.data.user;
        setUser({ email: userData.email, name: userData.name });
        
    } catch (error) {
        // If the API call fails (e.g., 401 Invalid Credentials), clear state and re-throw
        setUser(null); 
        // Throw the error so the calling component (AuthForm) can catch and display it
        throw error; 
    } finally {
        setIsLoading(false);
    }
  };

  // NEW: Signup function to handle network request
  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true); 
    try {
        await client.post('/auth/signup', { email, password, name });
        
        // NOTE: Unlike login, signup typically does NOT set a cookie. 
        // We just confirm success and let the user redirect to the login form.
        
    } catch (error) {
        // Throw the error so the calling component (AuthForm) can catch and display it
        throw error; 
    } finally {
        setIsLoading(false);
    }
  };


  // Logout function clears the session on both frontend and backend
  const logout = () => {
    // Call backend to clear the HttpOnly cookie
    client.post('/auth/logout')
        .finally(() => {
            // Clear frontend state and update isAuthenticated flag
            setUser(null); 
        });
  };

  // Memoize the value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    signup, // <-- Added signup to the context value
    logout,
    isLoading,
  }), [user, isLoading]); 

  // Display a loader while determining session status
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Loading session...</p>
        </div>
    ); 
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a Custom Hook for easy consumption
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};