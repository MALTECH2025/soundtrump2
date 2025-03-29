
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User, createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { UserProfile } from '@/types';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user: User | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, metadata?: { username?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  user: null,
  profile: null,
  signOut: async () => {},
  updateUserProfile: async () => {},
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });
  }, []);
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setIsAdmin(data?.role === 'admin');
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      toast.error('Failed to load profile. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error('Failed to sign out. Please try again.');
    }
  };
  
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add login method
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        return { success: false, message: error.message };
      }
      
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error('An unexpected error occurred');
      return { success: false, message: error.message };
    }
  };
  
  // Add register method
  const register = async (email: string, password: string, metadata?: { username?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Registration error:', error.message);
        toast.error(error.message);
        return { success: false, message: error.message };
      }
      
      toast.success('Registration successful! Check your email for verification.');
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error.message);
      toast.error('An unexpected error occurred');
      return { success: false, message: error.message };
    }
  };
  
  // Add logout as an alias for signOut
  const logout = signOut;

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    isAdmin,
    user,
    profile,
    signOut,
    updateUserProfile,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
