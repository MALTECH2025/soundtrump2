
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

// Tasks
// ===========================================

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

export const submitTask = async (userTaskId: string, submissionData: {
  screenshot?: File;
  notes?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let screenshot_url = null;
  
  // Upload screenshot if provided
  if (submissionData.screenshot) {
    const fileExt = submissionData.screenshot.name.split('.').pop();
    const fileName = `${userTaskId}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('task-screenshots')
      .upload(filePath, submissionData.screenshot);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
    }
    screenshot_url = uploadData.path;
  }
  
  // Use the edge function to create submission
  const { data: functionResult, error: functionError } = await supabase.functions.invoke('create-task-submission', {
    body: {
      p_user_task_id: userTaskId,
      p_screenshot_url: screenshot_url,
      p_submission_notes: submissionData.notes || null
    }
  });
  
  if (functionError) {
    console.error('Function error:', functionError);
    throw new Error(`Submission failed: ${functionError.message}`);
  }
  
  if (!functionResult?.success) {
    console.error('Function result error:', functionResult);
    throw new Error(functionResult?.error || 'Failed to submit task');
  }
  
  return { userTask: null, submission: functionResult.data };
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

// Admin functions
export const fetchPendingSubmissions = async () => {
  const { data, error } = await supabase
    .from('task_submissions')
    .select(`
      *,
      user_task:user_tasks!task_submissions_user_task_id_fkey(
        *,
        user:profiles!user_tasks_user_id_fkey(id, username, full_name),
        task:tasks!user_tasks_task_id_fkey(*)
      )
    `)
    .is('reviewed_at', null)
    .order('submitted_at', { ascending: true });
    
  if (error) throw error;
  return data || [];
};

export const reviewTaskSubmission = async (submissionId: string, decision: 'approve' | 'reject', adminNotes?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Get submission details first
  const { data: submission, error: getError } = await supabase
    .from('task_submissions')
    .select(`
      *,
      user_task:user_tasks!task_submissions_user_task_id_fkey(*, task:tasks!user_tasks_task_id_fkey(*))
    `)
    .eq('id', submissionId)
    .single();
    
  if (getError) throw getError;
  if (!submission || !submission.user_task) throw new Error('Submission not found');
  
  // Update submission with review
  const { error: submissionError } = await supabase
    .from('task_submissions')
    .update({
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      admin_notes: adminNotes
    })
    .eq('id', submissionId);
    
  if (submissionError) throw submissionError;
  
  // Update user task status
  const newStatus = decision === 'approve' ? 'Completed' : 'Rejected';
  const updateData: any = { status: newStatus };
  
  if (decision === 'approve') {
    updateData.completed_at = new Date().toISOString();
    updateData.points_earned = submission.user_task.task.points;
    
    // Award points to user - simple approach without RPC
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', submission.user_task.user_id)
      .single();
      
    if (!profileError && currentProfile) {
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({
          points: currentProfile.points + submission.user_task.task.points
        })
        .eq('id', submission.user_task.user_id);
        
      if (pointsError) console.error('Error updating points:', pointsError);
    }
  }
  
  const { error: taskUpdateError } = await supabase
    .from('user_tasks')
    .update(updateData)
    .eq('id', submission.user_task_id);
    
  if (taskUpdateError) throw taskUpdateError;
  
  return { success: true, message: `Task ${decision}d successfully` };
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

// Get task image URL
export const getTaskImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  const { data } = supabase.storage.from('task-images').getPublicUrl(imagePath);
  return data.publicUrl;
};

// Get screenshot URL
export const getScreenshotUrl = (screenshotPath: string) => {
  if (!screenshotPath) return null;
  const { data } = supabase.storage.from('task-screenshots').getPublicUrl(screenshotPath);
  return data.publicUrl;
};
