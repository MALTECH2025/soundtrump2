
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
  // Log the task being created for debugging
  console.log('Creating task:', task);

  try {
    // First check if user has admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      console.error('Permission denied: User is not an admin');
      throw new Error('Permission denied: Only admins can create tasks');
    }
    
    // Use service role key to bypass RLS
    const adminAuthClient = supabase.auth.admin;
    
    if (!adminAuthClient) {
      // Fallback approach - direct insert with regular client
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
      
      return data;
    }
    
    // Admin users can create tasks using service role to bypass RLS
    // Note: Must enable service role key in Supabase dashboard settings
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
