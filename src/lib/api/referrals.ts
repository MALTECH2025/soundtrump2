
import { supabase } from "@/integrations/supabase/client";
import { generateRandomCode } from './utils';

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
