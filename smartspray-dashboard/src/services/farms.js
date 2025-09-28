import api from './api';

export const farmsService = {
  // Get all farms for current user
  getFarms: async () => {
    const response = await api.get('/farms');
    return response.data;
  },

  // Get single farm
  getFarm: async (id) => {
    const response = await api.get(`/farms/${id}`);
    return response.data.data;
  },

  // Create new farm
  createFarm: async (farmData) => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },

  // Update farm
  updateFarm: async (id, farmData) => {
    const response = await api.put(`/farms/${id}`, farmData);
    return response.data;
  },

  // Delete farm
  deleteFarm: async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  },

  // Get farms within radius
  getFarmsInRadius: async (zipcode, distance) => {
    const response = await api.get(`/farms/radius/${zipcode}/${distance}`);
    return response.data;
  },
};