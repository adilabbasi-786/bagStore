import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch only 4 featured products
    supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .limit(4)
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  return (
    <div className="pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-32 md:py-48 relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="text-brand-400 font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">New Collection 2024</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Elevate Your <br/> Everyday Style.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Discover our curated selection of premium Ladies bags, accessories, and electronics designed for the modern lifestyle.
          </p>
          <Link 
            to="/store" 
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 flex items-center gap-2"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Trending Now</h2>
            <p className="text-gray-500">Handpicked favorites just for you.</p>
          </div>
          <Link to="/store" className="hidden md:flex items-center gap-2 font-medium hover:text-brand-600 transition">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full">
              <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/500`}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                {product.sale_price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    SALE
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-black hover:text-white"
                >
                  <ArrowRight size={20} />
                </button>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-yellow-400 mb-2 text-xs">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <span className="text-gray-300 ml-1">(4.8)</span>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-brand-600 transition truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    {product.sale_price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">RS{product.sale_price}</span>
                        <span className="text-sm text-gray-400 line-through">RS{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">RS{product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <Link to="/store" className="inline-block border border-gray-300 px-6 py-3 rounded-full font-medium hover:border-black transition">
            View All Products
          </Link>
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="container mx-auto px-4 mb-20">
        <div className="rounded-3xl bg-gray-100 overflow-hidden flex flex-col md:flex-row relative">
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center items-start z-10">
            <span className="text-brand-600 font-bold tracking-widest uppercase mb-4">Limited Time Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get 20% Off <br/> Summer Essentials
            </h2>
            <p className="text-gray-600 mb-8 max-w-md text-lg">
              Upgrade your wardrobe with our premium summer collection. Use code <strong>SUMMER20</strong> at checkout.
            </p>
            <Link 
              to="/store" 
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
            >
              Shop Collection
            </Link>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative">
             <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
              alt="Promo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
