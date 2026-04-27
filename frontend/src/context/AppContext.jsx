import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [credits, setCredits] = useState([]);
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({ dailySales: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchStore = async () => {
    try {
      setLoading(true);
      const [productRes, customerRes, creditRes, salesRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/customers'),
        api.get('/api/credits'),
        api.get('/api/reports/summary'),
      ]);
      setProducts(productRes.data);
      setCustomers(customerRes.data);
      setCredits(creditRes.data);
      setSales(salesRes.data.recentSales || []);
      setSummary({
        dailySales: salesRes.data.dailySales || 0,
        monthlyRevenue: salesRes.data.monthlyRevenue || 0,
      });
    } catch (error) {
      toast.error('Unable to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const lowStockAlerts = useMemo(
    () => products.filter((item) => item.quantity <= 5),
    [products]
  );

  return (
    <AppContext.Provider
      value={{ products, customers, credits, sales, summary, loading, lowStockAlerts, fetchStore }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
