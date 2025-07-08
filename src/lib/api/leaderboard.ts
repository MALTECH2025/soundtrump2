
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardUser } from "@/types";

export const fetchLeaderboard = async (limit: number = 100): Promise<LeaderboardUser[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, initials, points, tier, status')
    .order('points', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  
  // Add position to each user
  return data.map((user, index) => ({
    ...user,
    position: index + 1
  })) as LeaderboardUser[];
};

export const getUserRank = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  
  const userPoints = data.points;
  
  // Count how many users have more points
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .gt('points', userPoints);
    
  if (countError) throw countError;
  
  return (count || 0) + 1;
};
