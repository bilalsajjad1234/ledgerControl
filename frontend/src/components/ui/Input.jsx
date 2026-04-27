export default function Input({ label, invalid, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 ${invalid ? 'border-rose-500' : ''} ${className}`}
        {...props}
      />
    </label>
  );
}
