import { NavLink } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineCreditCard,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineClose,
} from 'react-icons/ai';

const links = [
  { label: 'Dashboard', path: '/', icon: AiOutlineDashboard },
  { label: 'Products', path: '/products', icon: AiOutlineShopping },
  { label: 'Sales', path: '/sales', icon: AiOutlineShoppingCart },
  { label: 'Customers', path: '/customers', icon: AiOutlineUser },
  { label: 'Credit', path: '/credit', icon: AiOutlineCreditCard },
  { label: 'Reports', path: '/reports', icon: AiOutlineBarChart },
  { label: 'Settings', path: '/settings', icon: AiOutlineSetting },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-slate-200 bg-slate-900 px-6 py-8 text-slate-100 
        transform transition-transform duration-300 ease-in-out
        md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500 p-3 shadow-soft text-white font-bold text-sm">FC</div>
            <div>
              <p className="text-xl font-bold text-white leading-tight">Fancy Casting</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-800">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                to={link.path}
                key={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-900 px-6 py-8 text-slate-100 md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500 p-3 shadow-soft text-white font-bold text-sm">FC</div>
          <div>
            <p className="text-xl font-bold text-white leading-tight">Fancy Casting</p>
          </div>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                to={link.path}
                key={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
