import { useEffect, useState } from 'react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  // Global toast handler - triggered by custom events
  useEffect(() => {
    const handleShowToast = (e) => {
      setToast(e.detail);
      const timer = window.setTimeout(() => setToast(null), 3000);
      return () => window.clearTimeout(timer);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  if (!toast) return null;

  const bg = toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-700';

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-3xl px-4 py-3 text-white shadow-soft ${bg}`}>
      {toast.message}
    </div>
  );
}
