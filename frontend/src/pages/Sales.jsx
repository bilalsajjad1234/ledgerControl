import { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import api from '../services/api';
import { salesService } from '../services/salesService';
import { useToast } from '../hooks/useToast';

const paymentOptions = [
  { label: 'Paid', value: 'paid' },
  { label: 'Credit (Udhaar)', value: 'credit' },
];

function printReceipt({ items, total, paymentType, customerName }) {
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Sale Receipt</title>
        <style>
          body { font-family: monospace; padding: 30px; max-width: 320px; margin: auto; }
          h2 { text-align: center; margin-bottom: 4px; }
          p { margin: 4px 0; }
          hr { border: 1px dashed #999; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; }
          .total { font-weight: bold; font-size: 1.1em; }
        </style>
      </head>
      <body>
        <h2>Fancy Casting</h2>
        <p style="text-align:center">Sale Receipt</p>
        <hr/>
        <p style="font-weight:bold;margin:4px 0">Contact Us:</p>
        <p style="margin:2px 0">📞 +92 321 4722489</p>
        <p style="margin:2px 0">📞 +92 300 4155407</p>
        <p style="margin:2px 0">☎️ 042-37659598</p>
        <hr/>
        <p>Date: ${new Date().toLocaleString()}</p>
        <p>Payment: ${paymentType === 'credit' ? 'Credit (Udhaar)' : 'Paid'}</p>
        ${customerName ? `<p>Customer: ${customerName}</p>` : ''}
        <hr/>
        ${items.map(item => `
          <div class="row"><span>${item.name} x${item.quantity}</span><span>${item.price * item.quantity} PKR</span></div>
        `).join('')}
        <hr/>
        <div class="row total"><span>TOTAL</span><span>${total} PKR</span></div>
        <hr/>
        <p style="text-align:center;margin-top:16px">Thank you!</p>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState('paid');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [salesFilter, setSalesFilter] = useState('all');
  const [salesPage, setSalesPage] = useState(1);
  const SALES_PAGE_SIZE = 15;
  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [{ data: productData }, { data: customerData }, { data: salesData }] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/customers'),
        api.get('/api/sales'),
      ]);
      setProducts(productData);
      setCustomers(customerData);
      setSalesHistory(salesData);
    } catch {
      toast.error('Unable to load sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addToCart = () => {
    if (!selectedProduct) return toast.error('Select a product');
    const product = products.find((item) => item._id === selectedProduct);
    if (!product) return;
    const count = Math.min(product.quantity, Number(quantity));
    if (count <= 0) return toast.error('Invalid quantity');
    const existing = cart.find((item) => item._id === selectedProduct);
    if (existing) {
      setCart(cart.map((item) => item._id === selectedProduct ? { ...item, quantity: item.quantity + count } : item));
    } else {
      setCart([...cart, { ...product, quantity: count }]);
    }
    setQuantity(1);
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item._id !== id));

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const filteredSales = useMemo(() => {
    if (salesFilter === 'all') return salesHistory;
    return salesHistory.filter(s => s.paymentType === salesFilter);
  }, [salesHistory, salesFilter]);

  const totalSalesPages = Math.ceil(filteredSales.length / SALES_PAGE_SIZE);
  const paginatedSales = filteredSales.slice((salesPage - 1) * SALES_PAGE_SIZE, salesPage * SALES_PAGE_SIZE);

  const handleCheckout = async () => {
    if (!cart.length) return toast.error('Add products to cart first');
    if (paymentType === 'credit' && !customerId) return toast.error('Select a customer for credit');

    const customer = customers.find((c) => c._id === customerId);
    try {
      await salesService.create({
        items: cart.map(({ _id, quantity, price }) => ({ productId: _id, quantity, price })),
        amount: total,
        paymentType,
        customerId: paymentType === 'credit' ? customerId : undefined,
      });
      toast.success('Sale completed');

      // Show receipt
      setReceipt({ items: cart, total, paymentType, customerName: customer?.name });
      setCart([]);
      setCustomerId('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sale could not be completed');
    }
  };

  const handleReturn = async (saleId) => {
    if (!window.confirm('Return this sale? Stock will be restored.')) return;
    try {
      await api.put(`/api/sales/${saleId}/return`);
      toast.success('Sale returned. Stock restored.');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Return failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 text-center">Sale Successful</h3>
            <div className="mt-4 space-y-2 text-sm">
              {receipt.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{item.price * item.quantity} PKR</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span>Total</span>
                <span>{receipt.total} PKR</span>
              </div>
              <p className="text-slate-500">Payment: {receipt.paymentType === 'credit' ? 'Credit (Udhaar)' : 'Paid'}</p>
              {receipt.customerName && <p className="text-slate-500">Customer: {receipt.customerName}</p>}
            </div>
            <div className="mt-4 sm:mt-6 flex gap-3">
              <button onClick={() => printReceipt(receipt)} className="flex-1 rounded-2xl bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-500">
                Print
              </button>
              <button onClick={() => setReceipt(null)} className="flex-1 rounded-2xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Point of Sale</h2>
        <div className="mt-4 sm:mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Product Selection */}
          <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                <span className="hidden sm:inline">Product</span>
                <select className="mt-1 sm:mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  <option value="">Select</option>
                  {products.map((item) => (
                    <option key={item._id} value={item._id}>{item.name} ({item.quantity})</option>
                  ))}
                </select>
              </label>
              <Input label="Qty" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
              <label className="block text-sm font-medium text-slate-700">
                <span className="hidden sm:inline">Payment</span>
                <select className="mt-1 sm:mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  {paymentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            {paymentType === 'credit' && (
              <label className="block text-sm font-medium text-slate-700">
                Customer
                <select className="mt-1 sm:mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </label>
            )}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button type="button" onClick={addToCart} className="text-xs sm:text-sm px-3 sm:px-4">Add</Button>
              <Button type="button" onClick={handleCheckout} className="bg-emerald-600 hover:bg-emerald-500 text-xs sm:text-sm px-3 sm:px-4">Checkout</Button>
            </div>
          </div>

          {/* Cart */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 shadow-soft">
            <h3 className="text-base font-semibold text-slate-900">Cart</h3>
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
              {cart.length ? cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.quantity} x {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-semibold text-slate-900 text-sm">{item.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item._id)} className="text-rose-400 hover:text-rose-600 text-xs">✕</button>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">Empty cart</p>}
            </div>
            <div className="mt-3 sm:mt-6 flex items-center justify-between rounded-2xl bg-slate-100 px-3 sm:px-4 py-2 sm:py-4">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-lg sm:text-xl font-semibold text-slate-900">{total} PKR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft overflow-x-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Sales History</h3>
            <span className="text-sm text-slate-500">{filteredSales.length} sales</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'All', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Udhaar', value: 'credit' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => { setSalesFilter(tab.value); setSalesPage(1); }}
                className={`rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition ${
                  salesFilter === tab.value
                    ? tab.value === 'credit'
                      ? 'bg-amber-500 text-white'
                      : tab.value === 'paid'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {paginatedSales.length ? paginatedSales.map((sale) => (
            <div key={sale._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{sale.customerId?.name || '—'}</p>
                  <p className="text-xs text-slate-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold text-slate-900">{sale.amount} PKR</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sale.paymentType === 'credit' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {sale.paymentType === 'credit' ? 'Udhaar' : 'Paid'}
                  </span>
                  {sale.returned && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">Returned</span>}
                </div>
                {!sale.returned && (
                  <button onClick={() => handleReturn(sale._id)} className="text-xs font-medium text-rose-600 hover:text-rose-500">Return</button>
                )}
              </div>
            </div>
          )) : (
            <p className="py-8 text-center text-slate-400">No sales yet.</p>
          )}
        </div>

        {/* Desktop Table View */}
        <table className="hidden lg:table w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.length ? paginatedSales.map((sale) => (
              <tr key={sale._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 whitespace-nowrap">{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-4">{sale.customerId?.name || '—'}</td>
                <td className="py-4 px-4">{sale.items.length} item{sale.items.length !== 1 ? 's' : ''}</td>
                <td className="py-4 px-4 font-semibold">{sale.amount} PKR</td>
                <td className="py-4 px-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sale.paymentType === 'credit' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {sale.paymentType === 'credit' ? 'Udhaar' : 'Paid'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {sale.returned
                    ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Returned</span>
                    : <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">Active</span>}
                </td>
                <td className="py-4 px-4">
                  {!sale.returned && (
                    <button onClick={() => handleReturn(sale._id)} className="text-sm font-medium text-rose-600 hover:text-rose-500">Return</button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">No sales yet.</td></tr>
            )}
          </tbody>
        </table>

        {totalSalesPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button disabled={salesPage === 1} onClick={() => setSalesPage(salesPage - 1)} className="rounded-2xl border border-slate-200 px-3 sm:px-4 py-2 text-sm disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <span className="text-sm text-slate-500">{salesPage}/{totalSalesPages}</span>
            <button disabled={salesPage === totalSalesPages} onClick={() => setSalesPage(salesPage + 1)} className="rounded-2xl border border-slate-200 px-3 sm:px-4 py-2 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
