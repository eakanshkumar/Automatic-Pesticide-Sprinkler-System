import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'react-hot-toast';

 export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useQuery(['notifications'], notificationsService.getNotifications, {
    refetchOnWindowFocus: false,
    retry: 1, // don’t infinitely retry
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation(notificationsService.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(notificationsService.markAllAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation(notificationsService.deleteNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    },
  });

  // WebSocket for real-time notifications
  useWebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:5000'}`, (data) => {
    if (data.type === 'NEW_NOTIFICATION') {
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast(data.notification.message, {
        icon: '🔔',
        duration: 5000,
      });
    }
  });

  // Update local state when data changes
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.data || []);
      setUnreadCount(notificationsData.data?.filter(n => !n.read).length || 0);
    }
  }, [notificationsData]);

  const markAsRead = async (id) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const markAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const deleteNotification = async (id) => {
    await deleteNotificationMutation.mutateAsync(id);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};