
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Reward redemption function started');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Not authenticated' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the request data
    const requestData = await req.json();
    const { reward_id } = requestData;

    if (!reward_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Reward ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, points')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, message: 'User profile not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabaseClient
      .from('rewards')
      .select('*')
      .eq('id', reward_id)
      .eq('active', true)
      .single();

    if (rewardError || !reward) {
      return new Response(
        JSON.stringify({ success: false, message: 'Reward not found or inactive' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user has enough points
    if (profile.points < reward.points_cost) {
      return new Response(
        JSON.stringify({ success: false, message: 'Not enough points to redeem this reward' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if reward is out of stock
    if (reward.quantity !== null && reward.quantity <= 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'This reward is out of stock' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Start a transaction
    const { data: transaction, error: transactionError } = await supabaseClient.rpc('redeem_reward', {
      p_user_id: user.id,
      p_reward_id: reward_id,
      p_points_cost: reward.points_cost
    });

    if (transactionError) {
      return new Response(
        JSON.stringify({ success: false, message: transactionError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully redeemed reward: ${reward.name}`,
        rewardName: reward.name,
        pointsSpent: reward.points_cost,
        remainingPoints: profile.points - reward.points_cost
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in reward redemption:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
