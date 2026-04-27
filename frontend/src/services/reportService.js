import api from './api';

export const reportService = {
  summary: () => api.get('/api/reports/summary'),
  monthly: () => api.get('/api/reports/monthly'),
};
