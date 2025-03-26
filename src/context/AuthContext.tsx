import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/lib/toast";
import { UserProfile, ProfileDisplayData } from "@/types";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string | null;
  }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{
    success: boolean;
    error?: string | null;
  }>;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error?: string | null;
  }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => {},
  logout: async () => {},
  register: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as UserProfile);
          setIsAdmin(data.role === 'admin');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await getProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        getProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === "Email not confirmed") {
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
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setProfile(profile);
        toast.success("Logged in successfully!");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        throw error;
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setProfile(profile);
        toast.success("Logged in successfully!");
      }
      
    } catch (error: any) {
      console.error("Login with Google error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  const register = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData?.username || email.split("@")[0],
          },
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        if (data.session) {
          const profile = await fetchUserProfile(data.user.id);
          setProfile(profile);
          toast.success("Account created successfully! Redirecting to dashboard...");
          
          setUser(data.user);
          setSession(data.session);
        } else {
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

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message || "Password reset failed. Please try again.");
        throw error;
      }
      
      toast.success("Password reset email sent successfully!");
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Password reset failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

      const isUserAdmin = data?.role === "admin";
      setIsAdmin(isUserAdmin);

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    loginWithGoogle,
    logout,
    register,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
