
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

// Tasks
// ===========================================

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      category:task_categories(*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks(
        *,
        category:task_categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const completeTask = async (taskId: string) => {
  try {
    // Call the complete_task database function
    const { data, error } = await supabase.rpc('complete_task', {
      task_id: taskId
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error completing task:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while completing the task'
    };
  }
};

export const fetchTaskCategories = async () => {
  const { data, error } = await supabase
    .from('task_categories')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const createTask = async (task: Task) => {
  console.log('Creating task:', task);

  try {
    // The RLS policies will now handle admin permission checking automatically
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select(`
        *,
        category:task_categories(*)
      `)
      .single();
      
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    
    console.log('Task created successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Create task error:', error);
    throw error;
  }
};

export const updateTask = async ({ taskId, updates }: { taskId: string, updates: Partial<Task> }) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(`
      *,
      category:task_categories(*)
    `)
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
    
  if (error) throw error;
};
