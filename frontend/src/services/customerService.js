import api from './api';

export const customerService = {
  list: () => api.get('/api/customers'),
  create: (customer) => api.post('/api/customers', customer),
  update: (id, customer) => api.put(`/api/customers/${id}`, customer),
  remove: (id) => api.delete(`/api/customers/${id}`),
};
