
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      points,
      difficulty,
      active,
      expires_at,
      image_url,
      redirect_url,
      category:task_categories!tasks_category_id_fkey(id, name)
    `)
    .eq('active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(50); // Limit results for better performance
    
  if (error) throw error;
  return data;
};

export const fetchTaskCategories = async () => {
  const { data, error } = await supabase
    .from('task_categories')
    .select('id, name')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const createTask = async (taskData: Task & { image?: File; duration?: number }) => {
  console.log('Creating task:', taskData);

  // Optimized task creation - upload image first if exists, then create task
  let image_url = null;
  
  // Upload task image if provided
  if (taskData.image) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const fileExt = taskData.image.name.split('.').pop();
    const fileName = `task-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('task-images')
      .upload(fileName, taskData.image, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    image_url = uploadData.path;
  }
  
  // Calculate expiration date
  const duration = taskData.duration || 24; // Default 24 hours
  const expires_at = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
  
  // Remove file and duration from task data
  const { image, duration: _, ...taskWithoutFile } = taskData;
  
  // Create task with optimized query
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
    // If task creation fails but image was uploaded, clean up the image
    if (image_url) {
      await supabase.storage
        .from('task-images')
        .remove([image_url]);
    }
    throw new Error(`Failed to create task: ${error.message}`);
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
