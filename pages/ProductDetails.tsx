import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Check, Star, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      supabase.from('products').select('*').eq('id', id).single()
        .then(({ data }) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.images[0] || `https://picsum.photos/seed/${product.id}/600/600`}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:border-black transition">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
              <span className="text-xs text-gray-400">SKU: {product.sku}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-2 text-yellow-500 mb-6">
              <div className="flex">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <span className="text-gray-500 text-sm ml-2 font-medium underline">42 reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
               {product.sale_price ? (
                <>
                  <span className="text-5xl font-bold text-brand-600">RS{product.sale_price}</span>
                  <span className="text-2xl text-gray-400 line-through">RS{product.price}</span>
                </>
              ) : (
                <span className="text-5xl font-bold text-gray-900">RS{product.price}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-10 text-lg border-b pb-8">
            {product.description}
          </p>

          <div className="flex gap-4 mb-10">
             <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
            >
              Add to Cart <ArrowRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-white p-2 rounded-full shadow-sm text-green-600"><Check size={20} /></div>
              <div>
                <p className="font-bold text-sm">In Stock</p>
                <p className="text-xs text-gray-500">Ready to ship today</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
               <div className="bg-white p-2 rounded-full shadow-sm text-brand-600"><Truck size={20} /></div>
               <div>
                <p className="font-bold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500">On all orders over RS2000</p>
              </div>
            </div>
             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
               <div className="bg-white p-2 rounded-full shadow-sm text-blue-600"><ShieldCheck size={20} /></div>
               <div>
                <p className="font-bold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-500">Encrypted transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
