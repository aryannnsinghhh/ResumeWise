import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

// 1. Define the Context's Shape
interface ScreeningLoadingContextType {
  isScreeningLoading: boolean;
  setIsScreeningLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Create the Context
const ScreeningLoadingContext = createContext<ScreeningLoadingContextType | undefined>(undefined);

// 3. Create the Provider Component
interface ScreeningLoadingProviderProps {
  children: ReactNode;
}

export const ScreeningLoadingProvider: React.FC<ScreeningLoadingProviderProps> = ({ children }) => {
  const [isScreeningLoading, setIsScreeningLoading] = useState(false);

  // Memoize the value
  const contextValue = useMemo(() => ({
    isScreeningLoading,
    setIsScreeningLoading,
  }), [isScreeningLoading]);

  return (
    <ScreeningLoadingContext.Provider value={contextValue}>
      {children}
    </ScreeningLoadingContext.Provider>
  );
};

// 4. Create a Custom Hook
export const useScreeningLoading = (): ScreeningLoadingContextType => {
  const context = useContext(ScreeningLoadingContext);
  if (context === undefined) {
    throw new Error('useScreeningLoading must be used within a ScreeningLoadingProvider');
  }
  return context;
};
