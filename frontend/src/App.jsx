import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Credit from './pages/Credit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import { useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Toast from './components/ui/Toast';

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Toast />
        {user ? (
          <div className="flex min-h-screen">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1">
              <Topbar onMenuClick={() => setSidebarOpen(true)} />
              <main className="p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/credit" element={<Credit />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </SearchProvider>
  );
}

export default App;
