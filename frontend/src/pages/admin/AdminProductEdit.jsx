import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: '', image: '', countInStock: '',
  });
  const categories = ['Electronics', 'Sports', 'Kitchen', 'Accessories', 'Clothing', 'Books'];
  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setForm({
            name: data.name, description: data.description,
            price: data.price, category: data.category,
            image: data.image, countInStock: data.countInStock,
          });
        } catch {
          toast.error('Failed to load product');
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [id]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isNew) {
        await axios.post('/api/products', form);
        toast.success('Product created!');
      } else {
        await axios.put(`/api/products/${id}`, form);
        toast.success('Product updated!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
          <div className="bg-white rounded-xl shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} required placeholder="e.g. Wireless Headphones"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description" value={form.description}
                  onChange={handleChange} required rows={3}
                  placeholder="Product description..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number" name="price" value={form.price}
                    onChange={handleChange} required min="0" step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                  <input
                    type="number" name="countInStock" value={form.countInStock}
                    onChange={handleChange} required min="0"
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category" value={form.category}
                  onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text" name="image" value={form.image}
                  onChange={handleChange} required
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                >
                  {loading ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}