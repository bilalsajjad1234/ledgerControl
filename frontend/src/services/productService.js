import api from './api';

export const productService = {
  list: () => api.get('/api/products'),
  create: (product) => api.post('/api/products', product),
  update: (id, product) => api.put(`/api/products/${id}`, product),
  remove: (id) => api.delete(`/api/products/${id}`),
};
