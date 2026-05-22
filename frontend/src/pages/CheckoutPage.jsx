import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: '', city: '', postalCode: '', country: '', paymentMethod: 'PayPal',
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderItems = cartItems.map((i) => ({
        product: i._id, name: i.name,
        qty: i.qty, price: i.price, image: i.image,
      }));
      const { data } = await axios.post('/api/orders', {
        orderItems,
        shippingAddress: {
          address: form.address, city: form.city,
          postalCode: form.postalCode, country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Shipping Address</h2>
          {[
            { label: 'Street Address', name: 'address', placeholder: '123 Main Street' },
            { label: 'City', name: 'city', placeholder: 'New York' },
            { label: 'Postal Code', name: 'postalCode', placeholder: '10001' },
            { label: 'Country', name: 'country', placeholder: 'USA' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                placeholder={placeholder}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg text-gray-800 mb-4">
              <span>Order Total</span>
              <span className="text-orange-500">${(getTotal() + (getTotal() > 100 ? 0 : 10) + getTotal() * 0.1).toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}