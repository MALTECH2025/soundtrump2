
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get the request data
    const { referral_code } = await req.json();

    if (!referral_code) {
      return new Response(
        JSON.stringify({ success: false, message: "Referral code is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get referral info
    const { data: referralData, error: referralError } = await supabase
      .from("referrals")
      .select("referrer_id, referral_code")
      .eq("referral_code", referral_code)
      .single();

    if (referralError || !referralData) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid referral code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if the user is trying to refer themselves
    if (referralData.referrer_id === user.id) {
      return new Response(
        JSON.stringify({ success: false, message: "You cannot use your own referral code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if the user has already been referred
    const { data: existingReferral } = await supabase
      .from("referred_users")
      .select("*")
      .eq("referred_user_id", user.id)
      .single();

    if (existingReferral) {
      return new Response(
        JSON.stringify({ success: false, message: "You have already used a referral code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Define the referral points to award
    const referralPoints = 10;

    // Create referral record
    const { error: referredError } = await supabase.from("referred_users").insert({
      referrer_id: referralData.referrer_id,
      referred_user_id: user.id,
      referral_code: referral_code,
      points_awarded: true,
    });

    if (referredError) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create referral record" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Get referrer's current points and update
    const { data: referrerProfile, error: referrerGetError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", referralData.referrer_id)
      .single();

    if (referrerGetError) {
      console.error("Error getting referrer profile:", referrerGetError);
    } else {
      // Update referrer points
      const { error: referrerPointsError } = await supabase
        .from("profiles")
        .update({ points: (referrerProfile.points || 0) + referralPoints })
        .eq("id", referralData.referrer_id);

      if (referrerPointsError) {
        console.error("Error updating referrer points:", referrerPointsError);
      }
    }

    // Get user's current points and update
    const { data: userProfile, error: userGetError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single();

    let newUserPoints = referralPoints;
    if (!userGetError && userProfile) {
      newUserPoints = (userProfile.points || 0) + referralPoints;
    }

    // Update user points
    const { data: updatedUserProfile, error: userPointsError } = await supabase
      .from("profiles")
      .update({ points: newUserPoints })
      .eq("id", user.id)
      .select("points")
      .single();

    if (userPointsError) {
      console.error("Error updating user points:", userPointsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Referral code applied successfully! You've earned ${referralPoints} points.`,
        points_earned: referralPoints,
        total_points: updatedUserProfile?.points || newUserPoints,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
