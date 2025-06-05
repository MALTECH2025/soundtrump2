
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
      ),
      submission:task_submissions(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const startTask = async (taskId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user already has this task
  const { data: existingUserTask, error: checkError } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks(
        *,
        category:task_categories(*)
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
      task:tasks(
        *,
        category:task_categories(*)
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
    
    if (uploadError) throw uploadError;
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
  
  if (functionError) throw functionError;
  if (!functionResult?.success) throw new Error(functionResult?.error || 'Failed to submit task');
  
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
      user_task:user_tasks(
        *,
        user:profiles(id, username, full_name),
        task:tasks(*)
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
      user_task:user_tasks(*, task:tasks(*))
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

export const createTask = async (task: Task) => {
  console.log('Creating task:', task);

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
