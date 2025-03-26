
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/lib/toast";
import { UserProfile, ProfileDisplayData } from "@/types";

// Define the auth context type
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  session: Session | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  session: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      // Check if user has admin role
      const isUserAdmin = data?.role === "admin";
      setIsAdmin(isUserAdmin);

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          const profile = await fetchUserProfile(currentSession.user.id);
          setProfile(profile);
          setIsLoading(false);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession?.user?.email || "No session");
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          const profile = await fetchUserProfile(currentSession.user.id);
          setProfile(profile);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkSession();

    // Force auth check to complete after a timeout
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check timeout reached");
        setIsLoading(false);
        setAuthChecked(true);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Special handling for email not confirmed error
        if (error.message === "Email not confirmed") {
          // Send new confirmation email
          await supabase.auth.resend({
            type: 'signup',
            email: email,
          });
          toast.error("Email not confirmed. We've sent a new confirmation link to your email.");
        } else {
          toast.error(error.message || "Login failed. Please try again.");
        }
        throw error;
      }
      
      // Fetch user profile after successful login
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setProfile(profile);
        toast.success("Logged in successfully!");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      // Error handling is done earlier
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, username?: string) => {
    try {
      setIsLoading(true);
      
      // Setting auto confirmation to true for development
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split("@")[0],
          },
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        if (data.session) {
          // User is auto-confirmed, fetch profile and redirect
          const profile = await fetchUserProfile(data.user.id);
          setProfile(profile);
          toast.success("Account created successfully! Redirecting to dashboard...");
          
          // Store user and session 
          setUser(data.user);
          setSession(data.session);
        } else {
          // User needs to confirm email
          toast.success("Account created successfully! Please check your email for verification.");
        }
      }
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state change listener will handle state updates
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };
  
  // Update user profile function
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);
      
      if (error) throw error;
      
      if (profile) {
        setProfile({ ...profile, ...data });
      }
      
      toast.success("Profile updated successfully");
      
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user && !!session,
    isLoading,
    isAdmin,
    login,
    signup,
    logout,
    updateUserProfile,
    session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
