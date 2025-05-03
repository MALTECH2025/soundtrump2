
import { supabase } from "@/integrations/supabase/client";

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
