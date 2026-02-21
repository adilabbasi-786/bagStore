import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Filter, Search, ShoppingBag } from 'lucide-react';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').eq('status', 'published');
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Store</h1>
          <p className="text-gray-500">Explore our complete collection of premium products.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black w-full sm:w-64 text-black placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black w-full sm:w-48 appearance-none text-black cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Bags">Bags</option>
              <option value="Watches">Watches</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition duration-300 overflow-hidden">
              <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={product.images[0] || `https://picsum.photos/seed/${product.id}/300/400`}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {product.sale_price && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 hover:bg-black hover:text-white"
                >
                  <ShoppingBag size={18} />
                </button>
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-brand-600 transition">{product.title}</h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {product.sale_price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">Rs{product.sale_price}</span>
                        <span className="text-sm text-gray-400 line-through">RS{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">Rs{product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-medium text-gray-600">No products found.</h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
