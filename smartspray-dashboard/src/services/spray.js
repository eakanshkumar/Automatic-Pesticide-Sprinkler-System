import api from './api';

export const sprayService = {
  // Get all spray events
  getSprayEvents: async (params = {}) => {
    const response = await api.get('/spray', { params });
    return response.data;
  },

  // Get single spray event
  getSprayEvent: async (id) => {
    const response = await api.get(`/spray/${id}`);
    return response.data;
  },

  // Create spray event
  createSprayEvent: async (sprayData) => {
    const response = await api.post('/spray', sprayData);
    return response.data;
  },

  // Update spray event
  updateSprayEvent: async (id, sprayData) => {
    const response = await api.put(`/spray/${id}`, sprayData);
    return response.data;
  },

  // Delete spray event
  deleteSprayEvent: async (id) => {
    const response = await api.delete(`/spray/${id}`);
    return response.data;
  },

  // Get spray statistics
  getSprayStats: async () => {
    const response = await api.get('/spray/stats/overview');
    return response.data;
  },

  // Manual spray control
  manualSpray: async (controlData) => {
    const response = await api.post('/spray/manual', controlData);
    return response.data;
  },

  // Schedule spray
  scheduleSpray: async (scheduleData) => {
    const response = await api.post('/spray/schedule', scheduleData);
    return response.data;
  },
};