import api from './api';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async (params = {}) => {
    const response = await api.get('/analytics', { params });
    return response.data;
  },

  // Get efficiency comparison
  getEfficiencyComparison: async (params = {}) => {
    const response = await api.get('/analytics/efficiency', { params });
    return response.data;
  },

  // Get infection trends
  getInfectionTrends: async (params = {}) => {
    const response = await api.get('/analytics/infection-trends', { params });
    return response.data;
  },

  // Generate report
  generateReport: async (reportData) => {
    const response = await api.post('/analytics/generate-report', reportData);
    return response.data;
  },

  // Export data
  exportData: async (exportData) => {
    const response = await api.post('/analytics/export', exportData, {
      responseType: 'blob',
    });
    return response.data;
  },
};