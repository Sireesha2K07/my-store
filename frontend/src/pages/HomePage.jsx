import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const addToCart = useCartStore((s) => s.addToCart);
  const fetchProducts = async (search = '') => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?keyword=${search}`);
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-10 mb-10 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Welcome to ShopForge</h1>
        <p className="text-lg mb-6 opacity-90">Discover amazing products at great prices</p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-gray-800 outline-none"
          />
          <button
            type="submit"
            className="bg-white text-orange-500 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Search
          </button>
        </form>
      </div>
      {/* Products */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
      {loading ? (
        <div className="text-center py-20 text-gray-500 text-lg">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:opacity-90 transition"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">{product.category}</p>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-orange-500 transition mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-orange-500">${product.price}</span>
                  <span className="text-yellow-400 text-sm">★ {product.rating}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.countInStock === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition"
                >
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}