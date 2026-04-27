import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button 
            onClick={onMenuClick} 
            className="rounded-2xl border border-slate-200 bg-slate-100 p-3 text-slate-700 hover:bg-slate-200 md:hidden"
          >
            <FiMenu size={20} />
          </button>
          <div>
            <p className="text-xl font-bold text-slate-900">Habib Atiq</p>
            <p className="text-xs text-slate-400">Fancy Casting</p>
          </div>
        </div>
        <button onClick={() => navigate('/products')} className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          <FiPlus /> <span className="hidden sm:inline">Add Product</span>
        </button>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-100 px-3 py-2 shadow-sm md:px-4 md:py-3">
          <div className="h-8 w-8 rounded-full bg-brand-500 text-center leading-8 text-white md:h-10 md:w-10 md:leading-10">{user?.name?.[0] || 'H'}</div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Habib Atiq'}</p>
            <button onClick={logout} className="text-xs text-slate-500 hover:text-slate-900">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
