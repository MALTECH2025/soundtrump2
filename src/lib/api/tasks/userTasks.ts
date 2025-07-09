
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
    // Get the task details first
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('points, title')
      .eq('id', taskId)
      .single();
      
    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // Check if user already completed this task
    const { data: existingUserTask } = await supabase
      .from('user_tasks')
      .select('status')
      .eq('user_id', user.id)
      .eq('task_id', taskId)
      .single();

    if (existingUserTask?.status === 'Completed') {
      throw new Error('Task already completed');
    }

    // Use transaction-like approach: update user_tasks and profile points
    const { data: userTaskData, error: userTaskError } = await supabase
      .from('user_tasks')
      .upsert({
        user_id: user.id,
        task_id: taskId,
        status: 'Completed',
        completed_at: new Date().toISOString(),
        points_earned: task.points
      }, {
        onConflict: 'user_id,task_id'
      })
      .select()
      .single();

    if (userTaskError) {
      console.error('Error updating user task:', userTaskError);
      throw userTaskError;
    }

    // Call the edge function to update user points
    const { data: updateResult, error: updateError } = await supabase.functions.invoke(
      'increment-user-points',
      {
        body: { 
          user_id: user.id, 
          points_to_add: task.points 
        }
      }
    );

    if (updateError) {
      console.error('Error updating user points via edge function:', updateError);
      
      // Try direct update as fallback
      const { error: fallbackError } = await supabase
        .from('profiles')
        .update({ 
          points: supabase.sql`points + ${task.points}`
        })
        .eq('id', user.id);
        
      if (fallbackError) {
        console.error('Fallback update failed:', fallbackError);
        // Still return success since task completion was recorded
      }
    }

    return {
      success: true,
      message: `Task "${task.title}" completed successfully!`,
      points_earned: task.points
    };
    
  } catch (error: any) {
    console.error('Error completing task:', error);
    throw new Error(error.message || 'Failed to complete task');
  }
};
