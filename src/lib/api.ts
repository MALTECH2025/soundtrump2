import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { Task, UserProfile } from "@/types";

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
      .select("id, username, full_name, avatar_url, initials, points, tier, status, role")
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

// Admin API functions
export const updateUserRole = async (userId: string, role: "user" | "admin") => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success(`User role updated to ${role}`);
    return data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    toast.error("Failed to update user role. Please try again.");
    return null;
  }
};

export const createTask = async (taskData: {
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  verification_type: "Automatic" | "Manual";
  category_id?: string;
  estimated_time?: string;
  instructions?: string;
  active?: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Task created successfully");
    return data;
  } catch (error: any) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task. Please try again.");
    return null;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(taskData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Task updated successfully");
    return data;
  } catch (error: any) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task. Please try again.");
    return null;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;
    
    toast.success("Task deleted successfully");
    return true;
  } catch (error: any) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task. Please try again.");
    return false;
  }
};

export const createReward = async (rewardData: {
  name: string;
  description: string;
  points_cost: number;
  image_url?: string;
  quantity?: number;
  active?: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .insert(rewardData)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Reward created successfully");
    return data;
  } catch (error: any) {
    console.error("Error creating reward:", error);
    toast.error("Failed to create reward. Please try again.");
    return null;
  }
};

export const updateReward = async (rewardId: string, rewardData: Partial<any>) => {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .update(rewardData)
      .eq("id", rewardId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Reward updated successfully");
    return data;
  } catch (error: any) {
    console.error("Error updating reward:", error);
    toast.error("Failed to update reward. Please try again.");
    return null;
  }
};

export const deleteReward = async (rewardId: string) => {
  try {
    const { error } = await supabase
      .from("rewards")
      .delete()
      .eq("id", rewardId);

    if (error) throw error;
    
    toast.success("Reward deleted successfully");
    return true;
  } catch (error: any) {
    console.error("Error deleting reward:", error);
    toast.error("Failed to delete reward. Please try again.");
    return false;
  }
};

// Admin functions to manage users
export const updateUserStatus = async (userId: string, status: "Normal" | "Influencer") => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success(`User status updated to ${status}`);
    return data;
  } catch (error: any) {
    console.error("Error updating user status:", error);
    toast.error("Failed to update user status. Please try again.");
    return null;
  }
};

export const updateUserTier = async (userId: string, tier: "Free" | "Premium") => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ tier })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success(`User tier updated to ${tier}`);
    return data;
  } catch (error: any) {
    console.error("Error updating user tier:", error);
    toast.error("Failed to update user tier. Please try again.");
    return null;
  }
};

// Enable real-time for tables (Run this on app initialization)
export const enableRealtimeForTables = async () => {
  try {
    // Create a function to call the edge function for enabling realtime
    const enableRealtimeForTable = async (tableName: string) => {
      const { data, error } = await supabase.functions.invoke('enable-realtime', {
        body: { table_name: tableName }
      });
      
      if (error) {
        console.error(`Error enabling realtime for ${tableName}:`, error);
        return false;
      }
      
      console.log(`Realtime enabled for ${tableName}:`, data);
      return true;
    };
    
    // Enable realtime for tasks table
    await enableRealtimeForTable('tasks');
    
    // Enable realtime for user_tasks table
    await enableRealtimeForTable('user_tasks');
    
    // Enable realtime for user_rewards table
    await enableRealtimeForTable('user_rewards');
    
    // Enable realtime for referred_users table
    await enableRealtimeForTable('referred_users');
    
    console.log('Realtime enabled for tables');
    return true;
  } catch (error: any) {
    console.error('Error enabling realtime for tables:', error);
    return false;
  }
};

// Additional admin functions for statistics and system settings
export const getSystemStats = async () => {
  try {
    // This is a placeholder for a real implementation
    // You would typically call an RPC function to get aggregated statistics
    const stats = {
      totalUsers: 0,
      totalTasks: 0,
      totalRewards: 0,
      totalPoints: 0
    };

    // Get total users
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    
    stats.totalUsers = userCount || 0;

    // Get total tasks
    const { count: taskCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });
    
    stats.totalTasks = taskCount || 0;

    // Get total rewards
    const { count: rewardCount } = await supabase
      .from("rewards")
      .select("*", { count: "exact", head: true });
    
    stats.totalRewards = rewardCount || 0;

    // Get total points
    const { data: pointsData } = await supabase
      .from("profiles")
      .select("points");
    
    stats.totalPoints = pointsData?.reduce((sum, user) => sum + user.points, 0) || 0;

    return stats;
  } catch (error: any) {
    console.error("Error fetching system stats:", error);
    return null;
  }
};
