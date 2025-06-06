
import { supabase } from "@/integrations/supabase/client";

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
