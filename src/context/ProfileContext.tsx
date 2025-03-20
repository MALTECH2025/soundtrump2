
import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { ProfileDisplayData } from '@/types';

// Extended User type for frontend display
type ExtendedUser = User & ProfileDisplayData;

interface ProfileContextType {
  user: ExtendedUser | null;
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
  
  // Create an extended user object that has both User properties and display properties
  const extendedUser = user && profile ? {
    ...user,
    name: profile.full_name || profile.username || 'User',
    avatar: profile.avatar_url,
    initials: profile.initials || 'US',
    role: {
      tier: profile.tier,
      status: profile.status
    }
  } : null;
  
  return (
    <ProfileContext.Provider value={{ user: extendedUser as ExtendedUser | null }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
