import api from '../services/api'
// Create axios instance

export const diseaseService = {
  analyzeDisease: async (formData) => {
    const response = await ML_api.post('/disease/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDiseaseHistory: async () => {
    const response = await api.get('/disease/history');
    return response.data;
  },

  getTreatmentRecommendations: async (diseaseType, infectionLevel) => {
    const response = await api.get('/disease/treatments', {
      params: { diseaseType, infectionLevel }
    });
    return response.data;
  }
};