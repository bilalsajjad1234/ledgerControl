import api from './api';

export const salesService = {
  create: (payload) => api.post('/api/sales', payload),
  list: () => api.get('/api/sales'),
  credit: (payload) => api.post('/api/credits', payload),
  payCredit: (id) => api.put(`/api/credits/${id}/pay`),
};
