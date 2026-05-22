import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((s) => s.addToCart);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
    navigate('/cart');
  };
  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!product) return null;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
        <div className="p-8">
          <p className="text-sm text-orange-400 font-semibold uppercase mb-2">{product.category}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-orange-500">${product.price}</span>
            <span className="text-yellow-400">★ {product.rating} ({product.numReviews} reviews)</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Stock: <span className={product.countInStock > 0 ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
              {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of Stock'}
            </span>
          </p>
          {product.countInStock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="font-semibold text-gray-700">Qty:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition"
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}