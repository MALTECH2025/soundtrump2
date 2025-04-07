
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Referral, ReferredUser, RPCResponse } from "@/types";

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data as UserProfile;
};

export const fetchUserReferrals = async (userId: string) => {
  const { data, error } = await supabase
    .from('referred_users')
    .select(`
      id,
      referrer_id,
      referred_user_id,
      referral_code,
      created_at,
      points_awarded,
      profiles!referred_user_id(id, username, full_name, avatar_url, initials)
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchReferralCode = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', userId)
    .single();
  
  if (error) {
    // If no referral code exists, create one
    if (error.code === 'PGRST116') {
      return await generateReferralCode(userId);
    }
    console.error("Error fetching referral code:", error);
    return null;
  }
  
  return data.referral_code;
};

export const generateReferralCode = async (userId: string): Promise<string | null> => {
  const referralCode = generateUniqueCode();
  
  const { data, error } = await supabase
    .from('referrals')
    .insert([{ referrer_id: userId, referral_code: referralCode }])
    .select('referral_code')
    .single();
  
  if (error) {
    console.error("Error generating referral code:", error);
    return null;
  }
  
  return data.referral_code;
};

export const applyReferralCode = async (referralCode: string): Promise<RPCResponse> => {
  try {
    const { data, error } = await supabase.rpc('apply_referral_code', { referral_code: referralCode });
    
    if (error) {
      console.error("Error applying referral code:", error);
      return { success: false, message: error.message };
    }
    
    return data as RPCResponse;
  } catch (error: any) {
    console.error("Unexpected error applying referral code:", error);
    return { success: false, message: error.message };
  }
};

function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomChars}`.toUpperCase();
}

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      category:task_categories(id, name, description)
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
      task:tasks(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createTask = async (task: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (taskId: string, updates: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
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

export const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: role })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserStatus = async (userId: string, status: 'Normal' | 'Influencer') => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: status })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserTier = async (userId: string, tier: 'Free' | 'Premium') => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ tier: tier })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const enableRealtimeForTable = async (tableName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('enable-realtime', {
      body: { table_name: tableName },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error enabling realtime for table:', error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    // You can replace this with an actual API call to get system stats
    // For now, returning mock data
    return {
      totalUsers: 120,
      totalTasks: 35,
      totalRewards: 12,
      totalPoints: 15480
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      totalUsers: 0,
      totalTasks: 0,
      totalRewards: 0,
      totalPoints: 0
    };
  }
};

export const connectService = async (serviceName: string, accessToken: string, refreshToken?: string, expiresAt?: string, serviceUserId?: string) => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('connected_services')
      .upsert({
        user_id: userId,
        service_name: serviceName,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        service_user_id: serviceUserId || userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error connecting ${serviceName} service:`, error);
    throw error;
  }
};
