
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  role: {
    tier: "Free" | "Premium";
    status: "Normal" | "Influencer";
  };
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  updateUserProfile: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    // In a real app, this would verify a token with your backend
    // For now, we'll just check localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to verify credentials
    // For demo purposes, we're just accepting any email/password
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create mock user based on email
    const mockUser: User = {
      id: "user-1",
      name: email.split("@")[0],
      email,
      initials: email.substring(0, 2).toUpperCase(),
      role: {
        tier: Math.random() > 0.5 ? "Premium" : "Free",
        status: Math.random() > 0.8 ? "Influencer" : "Normal"
      }
    };
    
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  
  // Update user profile function
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
