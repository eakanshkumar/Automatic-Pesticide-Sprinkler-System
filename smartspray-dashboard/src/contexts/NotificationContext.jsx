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

  /* =========================
     ✅ FIXED useQuery (v5)
  ========================= */
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getNotifications,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /* =========================
     MUTATIONS
  ========================= */
  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationsService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  /* =========================
     WEBSOCKET HANDLER
  ========================= */
  useWebSocket(
    import.meta.env.VITE_WS_URL || 'ws://localhost:5000/notifications',
    (data) => {
      if (data.type === 'NEW_NOTIFICATION') {
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        toast(data.notification.message, {
          icon: '🔔',
          duration: 5000,
        });
      }
    }
  );

  /* =========================
     SYNC QUERY → LOCAL STATE
  ========================= */
  useEffect(() => {
    if (notificationsData?.data) {
      setNotifications(notificationsData.data);
      setUnreadCount(
        notificationsData.data.filter((n) => !n.read).length
      );
    }
  }, [notificationsData]);

  /* =========================
     CONTEXT ACTIONS
  ========================= */
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
