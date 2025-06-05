
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

export const createReward = async (reward: {
  name: string;
  description: string;
  points_cost: number;
  quantity?: number;
  image_url?: string;
  expires_at?: string;
}) => {
  const { data, error } = await supabase
    .from('rewards')
    .insert({
      ...reward,
      active: true
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateReward = async (rewardId: string, updates: any) => {
  const { data, error } = await supabase
    .from('rewards')
    .update(updates)
    .eq('id', rewardId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteReward = async (rewardId: string) => {
  const { error } = await supabase
    .from('rewards')
    .delete()
    .eq('id', rewardId);
    
  if (error) throw error;
};

export const redeemReward = async (rewardId: string) => {
  const { data, error } = await supabase.functions.invoke('redeem-reward', {
    body: { reward_id: rewardId }
  });
  
  if (error) throw error;
  
  return data || { success: false, message: 'Failed to redeem reward' };
};
