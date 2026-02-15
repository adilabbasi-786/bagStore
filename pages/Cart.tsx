import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/store" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, quantity }) => {
            const price = product.sale_price || product.price;
            return (
              <div key={product.id} className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <img
                  src={product.images[0] || `https://picsum.photos/seed/${product.id}/100/100`}
                  alt={product.title}
                  className="w-28 h-28 object-cover rounded-xl bg-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="font-bold text-xl">₹{(price * quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t pt-6 mb-8">
              <div className="flex justify-between font-bold text-2xl">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Including GST</p>
            </div>
            <Link 
              to="/checkout"
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
