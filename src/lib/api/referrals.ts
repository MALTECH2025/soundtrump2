
import { supabase } from "@/integrations/supabase/client";
import { Referral, ReferredUser } from "@/types";

export const fetchUserReferrals = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
};

export const fetchReferredUsers = async (userId: string) => {
  const { data, error } = await supabase
    .from('referred_users')
    .select(`
      *,
      referred_user:profiles!referred_users_referred_user_id_fkey(*)
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const createReferralCode = async (userId: string) => {
  // Generate a unique referral code
  const referralCode = 'ST' + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: userId,
      referral_code: referralCode
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const applyReferralCode = async (referralCode: string) => {
  const { data, error } = await supabase.rpc('apply_referral_code', {
    referral_code: referralCode
  });
  
  if (error) throw error;
  return data;
};

export const getReferralStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('referred_users')
    .select('id, points_awarded')
    .eq('referrer_id', userId);
    
  if (error) throw error;
  
  return {
    totalReferrals: data.length,
    pointsEarned: data.filter(r => r.points_awarded).length * 100, // Assuming 100 points per referral
    pendingReferrals: data.filter(r => !r.points_awarded).length
  };
};
