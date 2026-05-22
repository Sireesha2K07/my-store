import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaClipboardList, FaStore } from 'react-icons/fa';
const links = [
  { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/admin/products', label: 'Products', icon: <FaBox /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaClipboardList /> },
];
export default function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
          <FaStore />
          Admin Panel
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              pathname === link.to
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2">
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}