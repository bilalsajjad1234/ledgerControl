import api from './api';

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (data) => api.post('/api/auth/register', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};
