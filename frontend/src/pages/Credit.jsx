import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import api from '../services/api';
import { salesService } from '../services/salesService';
import { useToast } from '../hooks/useToast';

export default function Credit() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadCredits = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/credits');
      setCredits(data);
    } catch (error) {
      toast.error('Unable to load credit history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const handlePay = async (id) => {
    try {
      await salesService.payCredit(id);
      toast.success('Credit marked as paid');
      loadCredits();
    } catch (error) {
      toast.error('Unable to mark credit paid');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft overflow-x-auto">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Credit Management</h2>
        <p className="mt-1 sm:mt-2 text-sm text-slate-500">Track unpaid invoices and settle balances.</p>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3 mt-4">
          {credits.length ? credits.map((credit) => (
            <div key={credit._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{credit.customerName}</p>
                  <p className="text-xs text-slate-500">{new Date(credit.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${credit.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                  {credit.paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-slate-900">{credit.amount} PKR</span>
                {!credit.paid && (
                  <Button onClick={() => handlePay(credit._id)} className="rounded-2xl bg-brand-600 px-3 py-1.5 text-xs">
                    Pay
                  </Button>
                )}
              </div>
            </div>
          )) : (
            <p className="py-8 text-center text-slate-400">No credit records found.</p>
          )}
        </div>

        {/* Desktop Table View */}
        <table className="hidden md:table mt-4 w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Amount Due</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((credit) => (
              <tr key={credit._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-semibold text-slate-900">{credit.customerName}</td>
                <td className="py-4 px-4">{credit.amount} PKR</td>
                <td className="py-4 px-4">{new Date(credit.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${credit.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                    {credit.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Button disabled={credit.paid} onClick={() => handlePay(credit._id)} className="rounded-2xl bg-brand-600 px-4 py-2 text-xs">
                    Mark as Paid
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
