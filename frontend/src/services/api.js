import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Set auth token immediately from localStorage so it's ready before any component mounts
try {
  const stored = localStorage.getItem('user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
} catch {}

export default api;
