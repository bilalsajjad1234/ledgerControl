import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { reportService } from '../services/reportService';
import { useToast } from '../hooks/useToast';

const exportCSV = (rows) => {
  const csv = ['Metric,Value', ...rows.map((row) => `${row.metric},${row.value}`)].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'report-summary.csv';
  link.click();
};

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data } = await reportService.summary();
      setSummary(data);
    } catch (error) {
      toast.error('Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Reports</h2>
            <p className="mt-1 sm:mt-2 text-sm text-slate-500">View daily and monthly analytics for your store.</p>
          </div>
          <Button type="button" onClick={() => exportCSV([
            { metric: 'Daily Sales', value: summary.dailySales },
            { metric: 'Monthly Revenue', value: summary.monthlyRevenue },
            { metric: 'Top Product', value: summary.topProduct },
          ])} className="text-sm">
            Export CSV
          </Button>
        </div>

        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500">Daily Sales</h3>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">{summary.dailySales.toLocaleString()} PKR</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500">Monthly Revenue</h3>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">{summary.monthlyRevenue.toLocaleString()} PKR</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500">Top-selling Product</h3>
            <p className="mt-2 sm:mt-3 text-lg sm:text-2xl font-semibold text-slate-900 truncate">{summary.topProduct}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
