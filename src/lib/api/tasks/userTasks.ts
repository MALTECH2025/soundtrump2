
import { supabase } from "@/integrations/supabase/client";

export const fetchUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:task_id(
        *,
        category:category_id(*)
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
      status: 'In Progress'
    })
    .select(`
      *,
      task:task_id(
        *,
        category:category_id(*)
      )
    `)
    .single();
    
  if (error) throw error;
  return data;
};
