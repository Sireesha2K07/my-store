import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  if (loading) return <div className="text-center py-20 text-gray-500">Loading orders...</div>;
  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">📦</p>
        <p className="text-xl text-gray-500">You have no orders yet</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-400 font-mono">#{order._id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{order.orderItems.length} item(s)</p>
                <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
              </div>
              <p className="text-xl font-bold text-orange-500">${order.totalPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}