import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axios from '../../api/axios';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, orders: 0, revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/api/products?limit=100'),
          axios.get('/api/orders'),
        ]);
        const orders = ordersRes.data;
        const revenue = orders.reduce((a, o) => a + o.totalPrice, 0);
        setStats({
          products: productsRes.data.total,
          orders: orders.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const cards = [
    { label: 'Total Products', value: stats.products, icon: <FaBox />, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.orders, icon: <FaShoppingCart />, color: 'bg-orange-500' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: <FaDollarSign />, color: 'bg-green-500' },
  ];
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className={`${card.color} text-white p-4 rounded-xl text-xl`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-semibold text-orange-500">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}