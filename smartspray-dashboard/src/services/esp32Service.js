import api from './api';

export const esp32Service = {
  // Send command to ESP32
  sendCommand: async (command, payload = {}) => {
    const response = await api.post('/esp32/command', {
      command,
      ...payload
    });
    return response.data;
  },

  // Trigger specific actions based on disease analysis
  triggerAction: async (actionType, severity = 'moderate') => {
    const commands = {
      urgent_spray: { pump: 'on', duration: 30, intensity: 'high' },
      schedule_spray: { pump: 'on', duration: 15, intensity: 'medium' },
      adjust_moisture: { moisture: 'adjust', level: severity === 'severe' ? 'low' : 'medium' },
      increase_ventilation: { fan: 'on', duration: 20 }
    };

    if (commands[actionType]) {
      return await esp32Service.sendCommand(actionType, commands[actionType]);
    }
    
    return { success: false, message: 'Unknown action type' };
  },

  // Get device status
  getStatus: async () => {
    const response = await api.get('/esp32/status');
    return response.data;
  }
};