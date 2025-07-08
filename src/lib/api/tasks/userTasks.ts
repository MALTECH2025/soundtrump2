
import { supabase } from "@/integrations/supabase/client";

export const fetchUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks!user_tasks_task_id_fkey(
        *,
        category:task_categories!tasks_category_id_fkey(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const startTask = async (taskId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user already has this task
  const { data: existingTask } = await supabase
    .from('user_tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('task_id', taskId)
    .single();
    
  if (existingTask) {
    throw new Error('Task already started');
  }
  
  const { data, error } = await supabase
    .from('user_tasks')
    .insert({
      user_id: user.id,
      task_id: taskId,
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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Use the complete_task function from Supabase
  const { data, error } = await supabase.rpc('complete_task', {
    task_id: taskId
  });
  
  if (error) throw error;
  
  // Handle the case where data might be null
  if (!data) {
    return {
      success: true,
      message: 'Task completed successfully',
      points_earned: 0
    };
  }
  
  return {
    success: true,
    message: 'Task completed successfully',
    points_earned: data.points_earned || 0
  };
};
