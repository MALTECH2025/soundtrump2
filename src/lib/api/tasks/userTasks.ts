
import { supabase } from "@/integrations/supabase/client";

export const fetchUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks!user_tasks_task_id_fkey(
        *,
        category:task_categories!tasks_category_id_fkey(*)
      ),
      submission:task_submissions!task_submissions_user_task_id_fkey(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const startTask = async (taskId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if task is expired
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('expires_at')
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;
  
  if (new Date(task.expires_at) < new Date()) {
    throw new Error('This task has expired and is no longer available');
  }

  // Check if user already has this task
  const { data: existingUserTask, error: checkError } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks!user_tasks_task_id_fkey(
        *,
        category:task_categories!tasks_category_id_fkey(*)
      )
    `)
    .eq('user_id', user.id)
    .eq('task_id', taskId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  // If user already has this task, return the existing record
  if (existingUserTask) {
    return existingUserTask;
  }

  // If no existing task, create a new one
  const { data, error } = await supabase
    .from('user_tasks')
    .insert({
      task_id: taskId,
      user_id: user.id,
      status: 'Pending'
    })
    .select(`
      *,
      task:tasks!user_tasks_task_id_fkey(
        *,
        category:task_categories!tasks_category_id_fkey(*)
      )
    `)
    .single();
    
  if (error) throw error;
  return data;
};

export const completeTask = async (taskId: string) => {
  // For automatic verification tasks, we'll use a simple approach
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get the user task
  const { data: userTask, error: getUserTaskError } = await supabase
    .from('user_tasks')
    .select('*')
    .eq('task_id', taskId)
    .eq('user_id', user.id)
    .single();

  if (getUserTaskError) throw getUserTaskError;
  if (!userTask) throw new Error('User task not found');

  // Update to completed
  const { error: updateError } = await supabase
    .from('user_tasks')
    .update({
      status: 'Completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', userTask.id);

  if (updateError) throw updateError;

  return { 
    success: true, 
    message: 'Task completed successfully!'
  };
};
