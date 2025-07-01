
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { setupRealtimeSubscriptions } from '@/lib/api/realtime';

export const useRealtimeData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const cleanup = setupRealtimeSubscriptions(user.id, {
      onTasksUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onUserTasksUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      },
      onReferralsUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ['referrals'] });
      },
      onProfileUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });

    return cleanup;
  }, [user?.id, queryClient]);
};
