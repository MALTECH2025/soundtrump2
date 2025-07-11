
-- Fix the profiles table RLS policies to allow inserts during user creation
-- Drop the existing policies that might be blocking inserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create a policy that allows inserts during the signup process
-- This policy allows inserts when the user_id matches the authenticated user OR when called by the trigger
CREATE POLICY "Allow profile creation during signup"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id OR 
  -- Allow inserts from the trigger function (when auth.uid() might be null during signup)
  current_setting('role') = 'supabase_auth_admin'
);

-- Also ensure the handle_new_user function has the right permissions
-- Update the function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
BEGIN
    -- Insert into profiles table with error handling
    INSERT INTO public.profiles (id, username, full_name, avatar_url, initials)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'user' || substr(new.id::text, 1, 8)),
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.raw_user_meta_data->>'avatar_url',
        UPPER(SUBSTRING(COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email), 1, 2))
    );

    -- Create a referral code for the new user
    INSERT INTO public.referrals (referrer_id, referral_code)
    VALUES (new.id, 'ST' || substr(new.id::text, 1, 8));

    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN new;
END;
$$;
