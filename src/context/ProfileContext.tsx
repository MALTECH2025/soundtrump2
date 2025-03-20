
import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { ProfileDisplayData, UserProfile } from '@/types';

// Create a type for the enhanced user that will be used throughout the application
export interface EnhancedUser {
  id: string;
  email: string | undefined;
  name: string;
  avatar: string;
  initials: string;
  role: {
    tier: 'Free' | 'Premium';
    status: 'Normal' | 'Influencer';
  };
  // Preserve any other User properties from Supabase
  [key: string]: any;
}

interface ProfileContextType {
  user: EnhancedUser | null;
}

// Create the context
const ProfileContext = createContext<ProfileContextType>({
  user: null
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  // Get user and profile from AuthContext
  const { user, profile } = useAuth();
  
  // Create an enhanced user object that has both User properties and display properties
  const enhancedUser = user && profile ? {
    ...user,
    name: profile.full_name || profile.username || 'User',
    avatar: profile.avatar_url || '',
    initials: profile.initials || 'US',
    role: {
      tier: profile.tier as 'Free' | 'Premium',
      status: profile.status as 'Normal' | 'Influencer'
    }
  } as EnhancedUser : null;
  
  return (
    <ProfileContext.Provider value={{ user: enhancedUser }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
