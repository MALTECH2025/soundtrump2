
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
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
  } catch (error: any) {
    console.error('Error starting task:', error);
    throw error;
  }
};

export const submitTask = async (userTaskId: string, submissionData: {
  screenshot?: File;
  notes?: string;
}) => {
  try {
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
    
    // Use raw SQL for insertion since the table might not be in types yet
    const { data: submission, error: submissionError } = await supabase
      .rpc('create_task_submission', {
        p_user_task_id: userTaskId,
        p_screenshot_url: screenshot_url,
        p_submission_notes: submissionData.notes || null
      });
      
    if (submissionError) {
      // Fallback to direct insertion if RPC doesn't exist
      const { data: submissionFallback, error: fallbackError } = await supabase
        .from('task_submissions' as any)
        .insert({
          user_task_id: userTaskId,
          screenshot_url,
          submission_notes: submissionData.notes
        } as any)
        .select()
        .single();
        
      if (fallbackError) throw fallbackError;
      
      // Update user task status
      const { error: updateError } = await supabase
        .from('user_tasks')
        .update({
          status: 'Submitted',
          submission_id: submissionFallback.id
        })
        .eq('id', userTaskId);
        
      if (updateError) throw updateError;
      
      return { userTask: null, submission: submissionFallback };
    }
    
    return { userTask: null, submission };
  } catch (error: any) {
    console.error('Error submitting task:', error);
    throw error;
  }
};

export const completeTask = async (taskId: string) => {
  try {
    // For automatic verification tasks
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

// Admin functions
export const fetchPendingSubmissions = async () => {
  try {
    // Use a simpler query approach since the table might not be in types
    const { data, error } = await supabase
      .from('task_submissions' as any)
      .select(`
        *,
        user_task:user_tasks(
          *,
          user:profiles(id, username, full_name),
          task:tasks(*)
        )
      ` as any)
      .is('reviewed_at', null)
      .order('submitted_at', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching pending submissions:', error);
    return [];
  }
};

export const reviewTaskSubmission = async (submissionId: string, decision: 'approve' | 'reject', adminNotes?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get submission details first
    const { data: submission, error: getError } = await supabase
      .from('task_submissions' as any)
      .select(`
        *,
        user_task:user_tasks(*, task:tasks(*))
      ` as any)
      .eq('id', submissionId)
      .single();
      
    if (getError) throw getError;
    
    // Update submission with review
    const { error: submissionError } = await supabase
      .from('task_submissions' as any)
      .update({
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        admin_notes: adminNotes
      } as any)
      .eq('id', submissionId);
      
    if (submissionError) throw submissionError;
    
    // Update user task status and award points if approved
    const newStatus = decision === 'approve' ? 'Completed' : 'Rejected';
    const updateData: any = { status: newStatus };
    
    if (decision === 'approve') {
      updateData.completed_at = new Date().toISOString();
      updateData.points_earned = submission.user_task.task.points;
      
      // Award points to user
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({
          points: submission.user_task.task.points
        })
        .eq('id', submission.user_task.user_id);
        
      if (pointsError) {
        // Try with increment instead
        const { error: incrementError } = await supabase.rpc('increment_user_points', {
          user_id: submission.user_task.user_id,
          points_to_add: submission.user_task.task.points
        });
        
        if (incrementError) console.error('Error updating points:', incrementError);
      }
    }
    
    const { error: taskUpdateError } = await supabase
      .from('user_tasks')
      .update(updateData)
      .eq('id', submission.user_task_id);
      
    if (taskUpdateError) throw taskUpdateError;
    
    return { success: true, message: `Task ${decision}d successfully` };
  } catch (error: any) {
    console.error('Error reviewing submission:', error);
    throw error;
  }
};

const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
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
