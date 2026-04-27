import Card from '../components/ui/Card';
import SalesChart from '../components/charts/SalesChart';
import { useApp } from '../context/AppContext';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { products, customers, lowStockAlerts, summary, sales, loading, fetchStore } = useApp();

  if (loading) return <Loader />;

  const chartData = sales.length
    ? sales.map((s) => ({
        label: new Date(s.createdAt).toLocaleDateString('en-PK', { weekday: 'short' }),
        value: s.amount,
      }))
    : [{ label: 'No Data', value: 0 }];

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchStore} className="mb-2">🔄 Refresh</Button>
      </div>
      {/* Stats Cards - Responsive Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card title="Total Products" value={products.length} />
        <Card title="Total Customers" value={customers.length} />
        <Card title="Today's Sales" value={`${summary.dailySales.toLocaleString()} PKR`} />
        <Card title="Monthly Revenue" value={`${summary.monthlyRevenue.toLocaleString()} PKR`} />
      </div>

      {/* Charts and Alerts - Responsive Grid */}
      <div className="grid gap-4 lg:gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Recent Sales</h2>
              <p className="mt-1 text-sm text-slate-500">Latest transactions</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 h-48 sm:h-64 lg:h-72">
            <SalesChart data={chartData} />
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
          <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {lowStockAlerts.length ? (
              lowStockAlerts.map((product) => (
                <li key={product._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{product.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500">Only {product.quantity} left</p>
                  </div>
                  <span className="self-start sm:self-auto rounded-full bg-rose-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-rose-600">Low</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-slate-500">No products below stock threshold.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
