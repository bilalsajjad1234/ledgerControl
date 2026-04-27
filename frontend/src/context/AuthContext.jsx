import { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/auth/login', credentials);
      const userData = { ...data.user, token: data.token };

      // Set token immediately — before any child component mounts and fetches
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
