
import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  type: 'task_completed' | 'mining_finished' | 'reward_redeemed' | 'referral_bonus' | 'level_up';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast.success(notification.title, {
      description: notification.message
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate some notifications for demonstration
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      // Welcome notification
      addNotification({
        type: 'level_up',
        title: 'Welcome to SoundTrump!',
        message: 'Start completing tasks to earn ST coins and unlock rewards.'
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  return {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
    unreadCount
  };
};
