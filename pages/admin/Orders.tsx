import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';
import { Eye, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    loadOrders();
    toast.success(`Order marked as ${status}`);
  };

  const statusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentMethod = (order: Order) => {
    if (order.payment_intent_id === 'COD') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">
          <Banknote size={12} /> COD
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
        <CreditCard size={12} /> Online
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Payment</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                <td className="p-4 text-sm">{order.profiles?.email}</td>
                <td className="p-4 font-medium">₹{order.total_amount}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    {getPaymentMethod(order)}
                    <span className="text-[10px] text-gray-400 capitalize">{order.payment_status}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 flex gap-2">
                  {order.status !== 'completed' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'completed')}
                      title="Mark Completed"
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
