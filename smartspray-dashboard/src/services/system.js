import api from './api';

export const systemService = {
  // Get system settings
  getSettings: async () => {
    const response = await api.get('/admin/system/settings');
    return response.data;
  },

  // Update system settings
  updateSettings: async (settings) => {
    const response = await api.put('/admin/system/settings', settings);
    return response.data;
  },

  // Get system logs
  getLogs: async (params = {}) => {
    const response = await api.get('/admin/system/logs', { params });
    return response.data;
  },

  // Get system health
  getHealth: async () => {
    const response = await api.get('/admin/system/health');
    return response.data;
  },

  // Backup system
  backupSystem: async () => {
    const response = await api.post('/admin/system/backup');
    return response.data;
  },

  //Upload image
  uploadImage: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};