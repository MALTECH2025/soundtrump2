
-- Ensure profiles table has RLS enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create policies for regular users
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policies for admins
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (EXISTS (
  SELECT 1
  FROM public.profiles
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM public.profiles
  WHERE id = auth.uid() AND role = 'admin'
));
