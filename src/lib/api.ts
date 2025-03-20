
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

// Define RPC function response types
interface RPCResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Tasks API
export const fetchTasks = async () => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        category: task_categories(*)
      `)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to load tasks. Please try again.");
    return [];
  }
};

export const fetchUserTasks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .select(`
        *,
        task: tasks(*)
      `)
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching user tasks:", error);
    toast.error("Failed to load your task history. Please try again.");
    return [];
  }
};

export const completeTask = async (taskId: string) => {
  try {
    const { data, error } = await supabase.rpc("complete_task", {
      task_id: taskId
    });

    if (error) throw error;
    
    const response = data as RPCResponse;
    
    if (!response.success) {
      toast.error(response.message || "Failed to complete task");
      return { success: false, message: response.message };
    }
    
    toast.success(response.message || "Task completed successfully");
    return response;
  } catch (error: any) {
    console.error("Error completing task:", error);
    toast.error("Failed to complete task. Please try again.");
    return { success: false, message: error.message };
  }
};

// Rewards API
export const fetchRewards = async () => {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("active", true)
      .order("points_cost", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching rewards:", error);
    toast.error("Failed to load rewards. Please try again.");
    return [];
  }
};

export const fetchUserRewards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .select(`
        *,
        reward: rewards(*)
      `)
      .eq("user_id", userId)
      .order("redeemed_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching user rewards:", error);
    toast.error("Failed to load your rewards. Please try again.");
    return [];
  }
};

export const redeemReward = async (rewardId: string) => {
  try {
    const { data, error } = await supabase.rpc("redeem_reward", {
      reward_id: rewardId
    });

    if (error) throw error;
    
    const response = data as RPCResponse;
    
    if (!response.success) {
      toast.error(response.message || "Failed to redeem reward");
      return { success: false, message: response.message };
    }
    
    toast.success(response.message || "Reward redeemed successfully");
    return response;
  } catch (error: any) {
    console.error("Error redeeming reward:", error);
    toast.error("Failed to redeem reward. Please try again.");
    return { success: false, message: error.message };
  }
};

// Referrals API
export const fetchUserReferrals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("referred_users")
      .select(`
        *,
        referred_user: profiles(id, username, full_name, avatar_url, initials)
      `)
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching user referrals:", error);
    toast.error("Failed to load your referrals. Please try again.");
    return [];
  }
};

export const fetchReferralCode = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("referral_code")
      .eq("referrer_id", userId)
      .single();

    if (error) throw error;
    return data?.referral_code;
  } catch (error: any) {
    console.error("Error fetching referral code:", error);
    return null;
  }
};

export const applyReferralCode = async (referralCode: string) => {
  try {
    const { data, error } = await supabase.rpc("apply_referral_code", {
      referral_code: referralCode
    });

    if (error) throw error;
    
    const response = data as RPCResponse;
    
    if (!response.success) {
      toast.error(response.message || "Failed to apply referral code");
      return { success: false, message: response.message };
    }
    
    toast.success(response.message || "Referral code applied successfully");
    return response;
  } catch (error: any) {
    console.error("Error applying referral code:", error);
    toast.error("Failed to apply referral code. Please try again.");
    return { success: false, message: error.message };
  }
};

// User profiles and leaderboard
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, initials, points, tier, status")
      .order("points", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    toast.error("Failed to load leaderboard. Please try again.");
    return [];
  }
};

// Connected services
export const connectService = async (
  userId: string,
  serviceName: string,
  serviceUserId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date
) => {
  try {
    const { data, error } = await supabase
      .from("connected_services")
      .upsert({
        user_id: userId,
        service_name: serviceName,
        service_user_id: serviceUserId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    toast.success(`Connected to ${serviceName} successfully`);
    return data;
  } catch (error: any) {
    console.error(`Error connecting to ${serviceName}:`, error);
    toast.error(`Failed to connect to ${serviceName}. Please try again.`);
    return null;
  }
};

export const disconnectService = async (userId: string, serviceName: string) => {
  try {
    const { error } = await supabase
      .from("connected_services")
      .delete()
      .match({ user_id: userId, service_name: serviceName });

    if (error) throw error;
    toast.success(`Disconnected from ${serviceName} successfully`);
    return true;
  } catch (error: any) {
    console.error(`Error disconnecting from ${serviceName}:`, error);
    toast.error(`Failed to disconnect from ${serviceName}. Please try again.`);
    return false;
  }
};

export const getUserConnectedServices = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("connected_services")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching connected services:", error);
    return [];
  }
};
