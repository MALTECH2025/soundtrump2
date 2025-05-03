
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardUser } from "@/types";

// Leaderboard
// ===========================================

export const fetchLeaderboard = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, initials, points, tier, status')
    .order('points', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  
  // Add position to each user and ensure type safety
  const leaderboard: LeaderboardUser[] = (data || []).map((user, index) => ({
    ...user,
    position: index + 1,
    tier: user.tier as "Free" | "Premium", // Explicit type casting
    status: user.status as "Normal" | "Influencer" // Explicit type casting
  }));
  
  return leaderboard;
};
