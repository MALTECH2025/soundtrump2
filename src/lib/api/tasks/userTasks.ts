
import { supabase } from "@/integrations/supabase/client";

export const fetchUserTasks = async (userId: string) => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      id,
      status,
      points_earned,
      completed_at,
      created_at,
      task_id,
      task:tasks!user_tasks_task_id_fkey(
        id,
        title,
        points,
        difficulty,
        redirect_url,
        instructions,
        category:task_categories!tasks_category_id_fkey(id, name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
    
  if (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }
  return data || [];
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
    throw new Error('Task already started or completed');
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
    
  if (error) {
    console.error('Error starting task:', error);
    throw error;
  }
  return data;
};

export const completeTask = async (taskId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  try {
    // Use the complete_task RPC function which handles everything atomically
    const { data, error } = await supabase.rpc('complete_task', {
      task_id: taskId
    });
    
    if (error) {
      console.error('Error completing task via RPC:', error);
      throw error;
    }
    
    // Handle the response - data can be null or an object
    if (data && typeof data === 'object') {
      const result = data as { success?: boolean; message?: string; points_earned?: number };
      
      if (result.success) {
        return {
          success: true,
          message: result.message || 'Task completed successfully',
          points_earned: result.points_earned || 0
        };
      } else {
        throw new Error(result.message || 'Failed to complete task');
      }
    } else {
      // If data is null or not an object, assume success based on no error
      return {
        success: true,
        message: 'Task completed successfully',
        points_earned: 0
      };
    }
    
  } catch (error: any) {
    console.error('Error completing task:', error);
    throw new Error(error.message || 'Failed to complete task');
  }
};
