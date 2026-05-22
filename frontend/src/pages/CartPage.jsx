import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
        <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-orange-500">
                  {item.name}
                </Link>
                <p className="text-orange-500 font-bold">${item.price}</p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item._id, Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1"
              >
                {[...Array(10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              <button
                onClick={() => { removeFromCart(item._id); toast.success('Item removed'); }}
                className="text-red-400 hover:text-red-600 font-bold text-xl transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{getTotal() > 100 ? 'FREE' : '$10.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${(getTotal() * 0.1).toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800 mb-6">
            <span>Total</span>
            <span className="text-orange-500">
              ${(getTotal() + (getTotal() > 100 ? 0 : 10) + getTotal() * 0.1).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}