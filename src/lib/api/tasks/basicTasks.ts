
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      category:task_categories!tasks_category_id_fkey(*)
    `)
    .gt('expires_at', new Date().toISOString()) // Only fetch non-expired tasks
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchTaskCategories = async () => {
  const { data, error } = await supabase
    .from('task_categories')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const createTask = async (taskData: Task & { image?: File; duration?: number }) => {
  console.log('Creating task:', taskData);

  // The RLS policies will now handle admin permission checking automatically
  let image_url = null;
  
  // Upload task image if provided
  if (taskData.image) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const fileExt = taskData.image.name.split('.').pop();
    const fileName = `task-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('task-images')
      .upload(fileName, taskData.image);
    
    if (uploadError) throw uploadError;
    image_url = uploadData.path;
  }
  
  // Calculate expiration date
  const duration = taskData.duration || 24; // Default 24 hours
  const expires_at = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
  
  const { image, duration: _, ...taskWithoutFile } = taskData;
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskWithoutFile,
      image_url,
      expires_at
    })
    .select(`
      *,
      category:task_categories!tasks_category_id_fkey(*)
    `)
    .single();
    
  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  
  console.log('Task created successfully:', data);
  return data;
};

export const updateTask = async ({ taskId, updates }: { taskId: string, updates: Partial<Task> }) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(`
      *,
      category:task_categories!tasks_category_id_fkey(*)
    `)
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId: string) => {
  // Get task details first to delete associated image
  const { data: task, error: getError } = await supabase
    .from('tasks')
    .select('image_url')
    .eq('id', taskId)
    .single();
    
  if (!getError && task?.image_url) {
    // Delete the task image from storage
    await supabase.storage
      .from('task-images')
      .remove([task.image_url]);
  }
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
    
  if (error) throw error;
};

// Cleanup expired tasks manually (can be called by admin)
export const cleanupExpiredTasks = async () => {
  const { data, error } = await supabase.rpc('cleanup_expired_tasks');
  
  if (error) throw error;
  return { success: true, message: 'Expired tasks cleaned up successfully' };
};
