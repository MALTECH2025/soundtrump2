
import { supabase } from "@/integrations/supabase/client";

// Admin
// ===========================================

export const getSystemStats = async () => {
  // Count total users
  const { count: usersCount, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  if (usersError) throw usersError;
  
  // Count total tasks
  const { count: tasksCount, error: tasksError } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true });
    
  if (tasksError) throw tasksError;
  
  // Count total rewards claimed
  const { count: rewardsCount, error: rewardsError } = await supabase
    .from('user_rewards')
    .select('*', { count: 'exact', head: true });
    
  if (rewardsError) throw rewardsError;
  
  // Calculate total points from user profiles
  const { data: pointsData, error: pointsError } = await supabase
    .from('profiles')
    .select('points');
    
  if (pointsError) throw pointsError;
  
  const totalPoints = pointsData.reduce((sum, entry) => sum + (entry.points || 0), 0);
  
  return {
    totalUsers: usersCount || 0,
    totalTasks: tasksCount || 0,
    totalRewards: rewardsCount || 0,
    totalPoints: totalPoints
  };
};

export const updateUserRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
    
  if (error) throw error;
  
  return { success: true };
};

export const updateUserStatus = async (userId: string, status: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);
    
  if (error) throw error;
  
  return { success: true };
};

export const updateUserTier = async (userId: string, tier: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ tier })
    .eq('id', userId);
    
  if (error) throw error;
  
  return { success: true };
};
