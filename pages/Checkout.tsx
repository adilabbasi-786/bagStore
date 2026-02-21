import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { CreditCard, Banknote, Lock } from 'lucide-react';

// Helper for loading script if not present
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  
  const [address, setAddress] = useState({
    line1: '', city: '', state: '', postal_code: '', country: 'IN'
  });

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate('/auth');
      return;
    }

    if (!address.line1 || !address.city || !address.state || !address.postal_code) {
      toast.error("Please fill in all address fields");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        await createOrderInDB('COD', 'COD');
      } else {
        // Handle Razorpay
        await handleRazorpay();
      }
    } catch (err) {
      console.error(err);
      toast.error("Order processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // 1. Create Order via Supabase Function
    const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount: cartTotal, currency: 'INR' } 
    });

    if (orderError) {
      throw new Error("Failed to create Razorpay order");
    }

    // In production, NEVER use mock ID on client if function fails.
    const orderId = orderData?.id; 
    const amountInPaise = Math.round(cartTotal * 100);

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_placeholder', 
      amount: amountInPaise,
      currency: "PKR",
      name: "Bagxco",
      description: "Order Payment",
      order_id: orderId,
      handler: async function (response: any) {
        // Payment Success
        await createOrderInDB(response.razorpay_payment_id, response.razorpay_order_id);
      },
      prefill: {
        name: user?.full_name,
        email: user?.email,
      },
      theme: {
        color: "#000000"
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const createOrderInDB = async (paymentId: string, orderId: string) => {
    try {
      const isCod = paymentId === 'COD';
      
      // Insert Order
      const { data: order, error } = await supabase.from('orders').insert({
        user_id: user!.id,
        status: isCod ? 'pending' : 'processing',
        total_amount: cartTotal,
        payment_status: isCod ? 'pending' : 'paid',
        payment_intent_id: paymentId, // Stores 'COD' or Razorpay ID
        shipping_address: address
      }).select().single();

      if (error) throw error;

      // Insert Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        quantity: item.quantity,
        price: item.product.sale_price || item.product.price,
        total: (item.product.sale_price || item.product.price) * item.quantity
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Trigger Stock Decrement (Database function should handle this, or we do it manually if trigger not set)
      await supabase.rpc('decrement_stock', { order_id: order.id });
      
      clearCart();
      toast.success(isCod ? "Order placed! Pay on delivery." : "Payment successful! Order placed.");
      navigate('/profile'); 
    } catch (err) {
      console.error(err);
      toast.error("Error saving order. Please contact support.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
          <form className="space-y-4">
            <input 
              className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
              placeholder="Address Line 1" 
              value={address.line1}
              onChange={e => setAddress({...address, line1: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                placeholder="City" 
                value={address.city}
                onChange={e => setAddress({...address, city: e.target.value})}
              />
              <input 
                className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                placeholder="State" 
                value={address.state}
                onChange={e => setAddress({...address, state: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                placeholder="ZIP Code" 
                value={address.postal_code}
                onChange={e => setAddress({...address, postal_code: e.target.value})}
              />
              <input 
                className="w-full p-3 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed" 
                value="India" readOnly
              />
            </div>
          </form>

          <h2 className="text-xl font-bold mt-10 mb-6">Payment Method</h2>
          <div className="space-y-4">
             <label className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition relative overflow-hidden ${paymentMethod === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${paymentMethod === 'razorpay' ? 'bg-black' : 'bg-transparent'}`}></div>
              <input 
                type="radio" 
                name="payment" 
                className="w-5 h-5 text-black accent-black"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              <div className="flex-1">
                <span className="font-bold block flex items-center gap-2"><CreditCard size={18}/> Online Payment</span>
                <span className="text-sm text-gray-500">Secure Razorpay Gateway</span>
              </div>
             </label>

             <label className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition relative overflow-hidden ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${paymentMethod === 'cod' ? 'bg-black' : 'bg-transparent'}`}></div>
              <input 
                type="radio" 
                name="payment" 
                className="w-5 h-5 text-black accent-black"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div className="flex-1">
                <span className="font-bold block flex items-center gap-2"><Banknote size={18}/> Cash on Delivery</span>
                <span className="text-sm text-gray-500">Pay at your doorstep</span>
              </div>
             </label>
          </div>

        </div>
        
        <div className="bg-gray-50 p-8 rounded-2xl h-fit sticky top-24 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <div className="flex-1 pr-4">
                  <span className="font-medium text-gray-900">{item.product.title}</span>
                  <span className="text-gray-500 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-medium">RS{((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 mb-8 space-y-3">
             <div className="flex justify-between text-gray-600">
               <span>Subtotal</span>
               <span>Rs{cartTotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-gray-600">
               <span>Shipping</span>
               <span className="text-green-600 font-medium">Free</span>
             </div>
             <div className="flex justify-between font-bold text-xl pt-2 text-gray-900">
               <span>Total</span>
               <span>Rs{cartTotal.toFixed(2)}</span>
             </div>
          </div>
          
          <button 
            onClick={handlePayment}
            disabled={loading || !address.line1}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
          >
            {loading ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : <><Lock size={16} /> Pay Securely</>)}
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
            <Lock size={12} /> SSL Encrypted Transaction
          </p>
        </div>
      </div>
    </div>
  );
}
