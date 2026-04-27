import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { customerService } from '../services/customerService';
import { useToast } from '../hooks/useToast';

const initialCustomer = { name: '', phone: '' };
const PAGE_SIZE = 20;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialCustomer);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState('');
  const toast = useToast();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await customerService.list();
      setCustomers(data);
    } catch {
      toast.error('Unable to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, []);
  useEffect(() => { setPage(1); }, [localQuery]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, phone: form.phone };
    try {
      if (editingId) {
        await customerService.update(editingId, payload);
        toast.success('Customer updated');
      } else {
        await customerService.create(payload);
        toast.success('Customer added');
      }
      setForm(initialCustomer);
      setEditingId(null);
      loadCustomers();
    } catch {
      toast.error('Customer save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await customerService.remove(id);
      toast.success('Customer deleted');
      loadCustomers();
    } catch {
      toast.error('Unable to delete customer');
    }
  };

  const filtered = useMemo(() => {
    const q = localQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  }, [customers, localQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add/Edit Form */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Customers</h2>
        <p className="mt-1 sm:mt-2 text-sm text-slate-500">Track customer details and outstanding balances.</p>
        <form onSubmit={handleSave} className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button type="submit">{editingId ? 'Update Customer' : 'Add Customer'}</Button>
            {editingId && (
              <button type="button" className="text-sm text-slate-500 hover:text-slate-900" onClick={() => { setEditingId(null); setForm(initialCustomer); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Customer List */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft overflow-x-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Customer List</h3>
            <span className="text-sm text-slate-500">{filtered.length} of {customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-80 shadow-sm">
            <FiSearch size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              autoComplete="off"
            />
            {localQuery && (
              <button onClick={() => setLocalQuery('')} className="text-slate-400 hover:text-slate-700 text-xs shrink-0">✕</button>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {paginated.length ? paginated.map((customer) => (
            <div key={customer._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="text-sm text-slate-500">{customer.phone}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${customer.totalDue > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {customer.totalDue > 0 ? 'Due' : 'Clear'}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm font-semibold text-slate-900">{customer.totalDue} PKR</span>
                <div className="space-x-2">
                  <button onClick={() => { setEditingId(customer._id); setForm({ name: customer.name, phone: customer.phone }); }} className="text-sm font-medium text-brand-600 hover:text-brand-500">Edit</button>
                  <button onClick={() => handleDelete(customer._id)} className="text-sm font-medium text-rose-600 hover:text-rose-500">Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <p className="py-8 text-center text-slate-400">
              {localQuery ? `"${localQuery}" se koi customer nahi mila` : 'No customers found.'}
            </p>
          )}
        </div>

        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Total Due</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? paginated.map((customer) => (
              <tr key={customer._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-semibold text-slate-900">{customer.name}</td>
                <td className="py-4 px-4">{customer.phone}</td>
                <td className="py-4 px-4">{customer.totalDue} PKR</td>
                <td className="py-4 px-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${customer.totalDue > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {customer.totalDue > 0 ? 'Due' : 'Clear'}
                  </span>
                </td>
                <td className="py-4 px-4 space-x-2">
                  <button onClick={() => { setEditingId(customer._id); setForm({ name: customer.name, phone: customer.phone }); }} className="text-sm font-medium text-brand-600 hover:text-brand-500">Edit</button>
                  <button onClick={() => handleDelete(customer._id)} className="text-sm font-medium text-rose-600 hover:text-rose-500">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-8 text-center text-slate-400">
                {localQuery ? `"${localQuery}" se koi customer nahi mila` : 'No customers found.'}
              </td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-2xl border border-slate-200 px-3 sm:px-4 py-2 text-sm disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-2xl border border-slate-200 px-3 sm:px-4 py-2 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
