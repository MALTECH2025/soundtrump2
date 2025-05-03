
-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Drop existing policies on tasks table if they exist
DROP POLICY IF EXISTS "Admins can manage tasks" ON public.tasks;

-- Create a new policy that allows admins to perform all operations on tasks
CREATE POLICY "Admins can manage tasks" 
ON public.tasks
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy to allow all users to read active tasks
DROP POLICY IF EXISTS "Anyone can view active tasks" ON public.tasks;
CREATE POLICY "Anyone can view active tasks"
ON public.tasks
FOR SELECT
USING (active = true OR public.is_admin());
