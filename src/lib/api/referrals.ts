
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
  // Check if user already has a referral code
  const { data: existingReferral } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', userId)
    .single();
    
  if (existingReferral?.referral_code) {
    return existingReferral;
  }
  
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
  const { data, error } = await supabase.functions.invoke('apply-referral-code', {
    body: { referral_code: referralCode }
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
    pointsEarned: data.filter(r => r.points_awarded).length * 10, // 10 points per referral
    pendingReferrals: data.filter(r => !r.points_awarded).length
  };
};

// Check if referral code is in URL and apply it
export const checkAndApplyReferralFromUrl = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('ref');
  
  if (referralCode) {
    // Store in localStorage for later application after login
    localStorage.setItem('pendingReferralCode', referralCode);
    
    // If user is already logged in, apply immediately
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const result = await applyReferralCode(referralCode);
        localStorage.removeItem('pendingReferralCode');
        return result;
      } catch (error) {
        console.error('Error applying referral code:', error);
        return null;
      }
    }
  }
  
  return null;
};

// Apply pending referral code after login
export const applyPendingReferralCode = async () => {
  const pendingCode = localStorage.getItem('pendingReferralCode');
  
  if (pendingCode) {
    try {
      const result = await applyReferralCode(pendingCode);
      localStorage.removeItem('pendingReferralCode');
      return result;
    } catch (error) {
      console.error('Error applying pending referral code:', error);
      localStorage.removeItem('pendingReferralCode');
      return null;
    }
  }
  
  return null;
};
