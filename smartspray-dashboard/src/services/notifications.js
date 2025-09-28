import api from './api';

export const notificationsService = {
  // Get all notifications
  // getNotifications: async (params = {}) => {
  //   const response = await api.get('/notifications', { params });
  //   return response.data;
  // },

  // Get single notification
  getNotification: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Create notification
  createNotification: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },
};