
-- Fix the complete_task function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.complete_task(task_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  selected_task public.tasks;
  task_completion public.user_tasks;
  result JSON;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication required');
  END IF;
  
  -- Get task info using the parameter name with qualification
  SELECT * INTO selected_task FROM public.tasks WHERE tasks.id = complete_task.task_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Task not found');
  END IF;
  
  -- Check if user already completed this task
  SELECT * INTO task_completion 
  FROM public.user_tasks 
  WHERE user_tasks.user_id = auth.uid() AND user_tasks.task_id = complete_task.task_id;
  
  IF FOUND AND task_completion.status = 'Completed' THEN
    RETURN json_build_object('success', false, 'message', 'Task already completed');
  END IF;
  
  -- Insert or update task completion
  IF FOUND THEN
    UPDATE public.user_tasks
    SET status = 'Completed',
        completed_at = now(),
        points_earned = selected_task.points
    WHERE id = task_completion.id
    RETURNING * INTO task_completion;
  ELSE
    INSERT INTO public.user_tasks (user_id, task_id, status, completed_at, points_earned)
    VALUES (auth.uid(), complete_task.task_id, 'Completed', now(), selected_task.points)
    RETURNING * INTO task_completion;
  END IF;
  
  -- Update user points
  UPDATE public.profiles
  SET points = points + selected_task.points
  WHERE id = auth.uid();
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Task completed successfully',
    'points_earned', selected_task.points
  );
END;
$function$
