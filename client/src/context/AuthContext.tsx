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
}

// 1. Define the Context's Shape (State and Actions)
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // --- Session Timeout Logic: 20 minutes (1200000 ms) ---
  useEffect(() => {
    if (!user) return; // Only track activity when logged in

    const SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

    // Check every minute if session has expired
    const checkSessionExpiry = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        console.log('Session expired due to inactivity');
        logout(); // Auto-logout after 20 minutes of inactivity
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSessionExpiry);
  }, [user, lastActivityTime]);

  // --- Track user activity to reset timeout ---
  useEffect(() => {
    if (!user) return; // Only track when logged in

    const updateActivity = () => {
      setLastActivityTime(Date.now());
    };

    // Track various user activities
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user]); 

  useEffect(() => {
    client.get('/auth/user')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await client.post('/auth/login', { email, password });
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    await client.post('/auth/signup', { email, password });
  };

  const logout = () => {
    client.post('/auth/logout').finally(() => setUser(null));
  };

  const contextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    signup,
    logout,
    isLoading,
  }), [user, isLoading]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// 4. Create a Custom Hook for easy consumption
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};