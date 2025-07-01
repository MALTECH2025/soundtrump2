
import { supabase } from "@/integrations/supabase/client";

export const setupRealtimeSubscriptions = (userId: string, callbacks: {
  onTasksUpdate?: () => void;
  onUserTasksUpdate?: () => void;
  onReferralsUpdate?: () => void;
  onProfileUpdate?: () => void;
}) => {
  const channels: any[] = [];

  // Tasks subscription
  if (callbacks.onTasksUpdate) {
    const tasksChannel = supabase
      .channel('public:tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        callbacks.onTasksUpdate
      )
      .subscribe();
    channels.push(tasksChannel);
  }

  // User tasks subscription
  if (callbacks.onUserTasksUpdate) {
    const userTasksChannel = supabase
      .channel('public:user_tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_tasks', filter: `user_id=eq.${userId}` }, 
        callbacks.onUserTasksUpdate
      )
      .subscribe();
    channels.push(userTasksChannel);
  }

  // Referrals subscription
  if (callbacks.onReferralsUpdate) {
    const referralsChannel = supabase
      .channel('public:referred_users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'referred_users', filter: `referrer_id=eq.${userId}` }, 
        callbacks.onReferralsUpdate
      )
      .subscribe();
    channels.push(referralsChannel);
  }

  // Profile subscription
  if (callbacks.onProfileUpdate) {
    const profileChannel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, 
        callbacks.onProfileUpdate
      )
      .subscribe();
    channels.push(profileChannel);
  }

  return () => {
    channels.forEach(channel => supabase.removeChannel(channel));
  };
};
