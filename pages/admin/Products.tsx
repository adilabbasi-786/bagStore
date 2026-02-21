import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { Edit, Trash, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  // Form State
  const [form, setForm] = useState<Partial<Product>>({
    title: '', price: 0, stock_quantity: 0, category: '', description: '', images: []
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await supabase.from('products').update(form).eq('id', editing.id);
        toast.success('Product updated');
      } else {
        await supabase.from('products').insert([{ ...form, status: 'published' }]);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
    toast.success('Product deleted');
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditing(product);
      setForm(product);
    } else {
      setEditing(null);
      setForm({ title: '', price: 0, stock_quantity: 0, category: 'Clothing', description: '', images: [] });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded bg-cover bg-center" style={{ backgroundImage: `url(${p.images?.[0] || ''})` }}></div>
                  <span className="font-medium">{p.title}</span>
                </td>
                <td className="p-4">Rs{p.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${p.stock_quantity < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{p.category}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => openModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? 'Edit Product' : 'New Product'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  required 
                  className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg" 
                    value={form.price} 
                    onChange={e => setForm({...form, price: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg" 
                    value={form.stock_quantity} 
                    onChange={e => setForm({...form, stock_quantity: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home">Home</option>
                  </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg h-24" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Demo only)</label>
                <input 
                   className="w-full p-2 bg-white text-black border border-gray-300 rounded-lg"
                   placeholder="https://..."
                   value={form.images?.[0] || ''}
                   onChange={e => setForm({...form, images: [e.target.value]})}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
