import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { productService } from '../services/productService';
import { useToast } from '../hooks/useToast';

const initialState = { name: '', price: '', quantity: '', category: '' };
const PAGE_SIZE = 10;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState('');
  const toast = useToast();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productService.list();
      setProducts(data);
    } catch {
      toast.error('Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { setPage(1); }, [localQuery]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (Number(form.price) <= 0) return toast.error('Price must be greater than 0');
    if (Number(form.quantity) < 0) return toast.error('Quantity cannot be negative');
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
    try {
      if (editingId) {
        await productService.update(editingId, payload);
        toast.success('Product updated');
      } else {
        await productService.create(payload);
        toast.success('Product added');
      }
      setForm(initialState);
      setEditingId(null);
      loadProducts();
    } catch {
      toast.error('Unable to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.remove(id);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Unable to remove product');
    }
  };

  const filtered = useMemo(() => {
    const q = localQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [products, localQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStockProducts = useMemo(() => products.filter((p) => p.quantity <= 5), [products]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add/Edit Form */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Products</h2>
        <p className="mt-1 sm:mt-2 text-sm text-slate-500">Manage inventory, categories and stock availability.</p>
        <form onSubmit={handleSave} className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <Input label="Price (PKR)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" />
          <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="0" />
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit">{editingId ? 'Update Product' : 'Add Product'}</Button>
            {editingId && (
              <button type="button" className="text-sm text-slate-500 hover:text-slate-900" onClick={() => { setEditingId(null); setForm(initialState); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft overflow-x-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Product List</h3>
            <span className="text-sm text-slate-500">{filtered.length} of {products.length} product{products.length !== 1 ? 's' : ''}</span>
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
          {paginated.length ? paginated.map((product) => (
            <div key={product._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.category}</p>
                </div>
                {product.quantity <= 5
                  ? <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-600">Low</span>
                  : <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">OK</span>}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="text-sm">
                  <span className="text-slate-500">{product.price} PKR</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-500">Stock: {product.quantity}</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => { setEditingId(product._id); setForm({ name: product.name, price: product.price, quantity: product.quantity, category: product.category }); }} className="text-sm font-medium text-brand-600 hover:text-brand-500">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-sm font-medium text-rose-600 hover:text-rose-500">Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <p className="py-8 text-center text-slate-400">No products found.</p>
          )}
        </div>

        {/* Desktop Table View */}
        <table className="hidden md:table mt-4 w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? paginated.map((product) => (
              <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-semibold text-slate-900">{product.name}</td>
                <td className="py-4 px-4">{product.category}</td>
                <td className="py-4 px-4">{product.price} PKR</td>
                <td className="py-4 px-4">{product.quantity}</td>
                <td className="py-4 px-4">
                  {product.quantity <= 5
                    ? <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">Low Stock</span>
                    : <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Healthy</span>}
                </td>
                <td className="py-4 px-4 space-x-2">
                  <button onClick={() => { setEditingId(product._id); setForm({ name: product.name, price: product.price, quantity: product.quantity, category: product.category }); }} className="text-sm font-medium text-brand-600 hover:text-brand-500">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-sm font-medium text-rose-600 hover:text-rose-500">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">No products found.</td></tr>
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

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 shadow-soft">
          <h4 className="text-sm font-semibold text-slate-900">Low Stock Alert</h4>
          <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            {lowStockProducts.map((product) => (
              <li key={product._id} className="rounded-2xl bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{product.name}</span>
                <span className="text-xs sm:text-sm text-rose-600 self-start sm:self-auto">Stock: {product.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
