
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCategory } from "@/types";

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
    .from('tasks')
    .select(`
      *,
      category:task_categories(*)
    `)
    .eq('active', true)
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

// Referrals
// ===========================================

export const generateReferralCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user already has a referral code
  const { data: existingReferral } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('user_id', user.id)
    .single();
    
  if (existingReferral?.code) {
    return existingReferral.code;
  }
  
  // Generate a new referral code
  const referralCode = generateRandomCode(8);
  
  const { error } = await supabase
    .from('referral_codes')
    .insert({
      user_id: user.id,
      code: referralCode
    });
    
  if (error) throw error;
  
  return referralCode;
};

export const fetchReferralStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Get the user's referral code
  const { data: referralData } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('user_id', user.id)
    .single();
    
  // Count the total number of users who used the referral code
  const { data: countData, error } = await supabase
    .from('user_referrals')
    .select('id', { count: 'exact' })
    .eq('referrer_id', user.id);
    
  if (error) throw error;
  
  return {
    code: referralData?.code || null,
    referralCount: countData?.length || 0
  };
};

export const fetchReferrals = async (type: 'referred' | 'referrers') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  let query;
  
  if (type === 'referred') {
    // Users I referred
    query = supabase
      .from('user_referrals')
      .select(`
        id,
        created_at,
        referred_user:profiles!referred_user_id(id, full_name, username, avatar_url, initials)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });
  } else {
    // Users who referred me
    query = supabase
      .from('user_referrals')
      .select(`
        id,
        created_at,
        referrer:profiles!referrer_id(id, full_name, username, avatar_url, initials)
      `)
      .eq('referred_user_id', user.id)
      .order('created_at', { ascending: false });
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data;
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
  
  // Sum total points earned
  const { data: pointsData, error: pointsError } = await supabase
    .from('user_points')
    .select('points');
    
  if (pointsError) throw pointsError;
  
  const totalPoints = pointsData.reduce((sum, entry) => sum + entry.points, 0);
  
  return {
    totalUsers: usersCount,
    totalTasks: tasksCount,
    totalRewards: rewardsCount,
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
    .from('user_services')
    .upsert({
      user_id: user.id,
      service,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      service_user_id: serviceUserId
    });
    
  if (error) throw error;
};

export const getUserService = async (service: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('user_services')
    .select('*')
    .eq('user_id', user.id)
    .eq('service', service)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  
  return data;
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
