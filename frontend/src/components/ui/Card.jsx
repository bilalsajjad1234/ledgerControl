export default function Card({ title, value, icon, children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-soft ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        {icon}
      </div>
      {children}
    </div>
  );
}
