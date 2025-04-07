import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCategory, Reward, LeaderboardUser } from "@/types";

// Users and Profiles
// ===========================================

export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
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
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Tasks
// ===========================================

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      category:task_categories(*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks(
        *,
        category:task_categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchTaskCategories = async () => {
  const { data, error } = await supabase
    .from('task_categories')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const createTask = async (task: Task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select(`
      *,
      category:task_categories(*)
    `)
    .single();
    
  if (error) throw error;
  return data;
};

export const updateTask = async ({ taskId, updates }: { taskId: string, updates: Partial<Task> }) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(`
      *,
      category:task_categories(*)
    `)
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
    
  if (error) throw error;
};

// Rewards
// ===========================================

export const fetchRewards = async () => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('active', true)
    .order('points_cost', { ascending: true });
    
  if (error) throw error;
  return data || [];
};

export const fetchUserRewards = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_rewards')
    .select(`
      *,
      reward:rewards(*)
    `)
    .eq('user_id', userId)
    .order('redeemed_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const redeemReward = async (rewardId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('redeem-reward', {
      body: { reward_id: rewardId }
    });
    
    if (error) throw error;
    
    return data || { success: false, message: 'Failed to redeem reward' };
  } catch (error: any) {
    console.error('Error redeeming reward:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while redeeming the reward'
    };
  }
};

// Leaderboard
// ===========================================

export const fetchLeaderboard = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, initials, points, tier, status')
    .order('points', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  
  // Add position to each user
  const leaderboard: LeaderboardUser[] = (data || []).map((user, index) => ({
    ...user,
    position: index + 1
  }));
  
  return leaderboard;
};

// Referrals
// ===========================================

export const generateReferralCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user already has a referral code
  const { data: existingReferral } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', user.id)
    .single();
    
  if (existingReferral?.referral_code) {
    return existingReferral.referral_code;
  }
  
  // Generate a new referral code
  const referralCode = generateRandomCode(8);
  
  const { error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: user.id,
      referral_code: referralCode
    });
    
  if (error) throw error;
  
  return referralCode;
};

export const fetchReferralCode = async (userId: string) => {
  // Get the user's referral code
  const { data, error } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  
  // If no referral code exists, generate one
  if (!data?.referral_code) {
    const code = await generateReferralCode();
    return code;
  }
  
  return data?.referral_code || null;
};

export const fetchReferralStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Get the user's referral code
  const { data: referralData } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', user.id)
    .single();
    
  // Count the total number of users who used the referral code
  const { data: countData, error } = await supabase
    .from('referred_users')
    .select('id', { count: 'exact' })
    .eq('referrer_id', user.id);
    
  if (error) throw error;
  
  return {
    code: referralData?.referral_code || null,
    referralCount: countData?.length || 0
  };
};

export const fetchReferrals = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');
  
  // Users I referred
  const { data, error } = await supabase
    .from('referred_users')
    .select(`
      id,
      created_at,
      referred_user_id,
      profiles:referred_user_id(id, full_name, username, avatar_url, initials)
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data;
};

export const fetchUserReferrals = fetchReferrals; // Alias for backward compatibility

export const applyReferralCode = async (referralCode: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('apply-referral-code', {
      body: { referral_code: referralCode }
    });
    
    if (error) throw error;
    
    return data || { success: false, message: 'Failed to apply referral code' };
  } catch (error: any) {
    console.error('Error applying referral code:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while applying the referral code'
    };
  }
};

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

// Services (Spotify, etc.)
// ===========================================

export const connectService = async (
  service: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: string,
  serviceUserId?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('connected_services')
    .upsert({
      user_id: user.id,
      service_name: service,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      service_user_id: serviceUserId || ''
    });
    
  if (error) throw error;
};

export const getUserService = async (service: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('connected_services')
    .select('*')
    .eq('user_id', user.id)
    .eq('service_name', service)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  
  return data;
};

// User role and status management (admin)
// ===========================================

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

// Realtime
// ===========================================

export const enableRealtimeForTable = async (tableName: string) => {
  const { error } = await supabase.functions.invoke('enable-realtime', {
    body: { table: tableName }
  });
  
  if (error) {
    console.error(`Failed to enable realtime for ${tableName}:`, error);
  }
  
  return !error;
};

// Utilities
// ===========================================

function generateRandomCode(length: number) {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}
