import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const getCount = useCartStore((s) => s.getCount);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-400">
        <FaStore />
        ShopForge
      </Link>
      {/* Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-orange-400 transition">Home</Link>
        {user && (
          <Link to="/orders" className="hover:text-orange-400 transition">My Orders</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
            Admin Panel
          </Link>
        )}
        {/* Cart */}
        <Link to="/cart" className="relative hover:text-orange-400 transition">
          <FaShoppingCart size={22} />
          {getCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCount()}
            </span>
          )}
        </Link>
        {/* User */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition"
          >
            <FaUser size={14} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}