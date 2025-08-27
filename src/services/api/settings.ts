import { api } from './api';

export const settingsApi = {
  updateProfile: async (data: any) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  }
}; 