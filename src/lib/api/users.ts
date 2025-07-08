
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, initials, points, tier, status, role')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('id, username, full_name, avatar_url, initials, points, tier, status, role')
    .single();
    
  if (error) throw error;
  return data;
};
