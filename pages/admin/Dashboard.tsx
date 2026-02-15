import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    products: 0,
    customers: 0
  });

  useEffect(() => {
    async function loadStats() {
      // Parallel requests for dashboard stats
      const [orders, products, profiles] = await Promise.all([
        supabase.from('orders').select('total_amount'),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      const totalSales = orders.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        sales: totalSales,
        orders: orders.data?.length || 0,
        products: products.count || 0,
        customers: profiles.count || 0
      });
    }
    loadStats();
  }, []);

  const Card = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total Revenue" 
          value={`$${stats.sales.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <Card 
          title="Total Orders" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
        />
        <Card 
          title="Products" 
          value={stats.products} 
          icon={Package} 
          color="bg-purple-500" 
        />
        <Card 
          title="Customers" 
          value={stats.customers} 
          icon={Users} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border h-64 flex items-center justify-center">
          <p className="text-gray-400">Sales Chart Placeholder (Requires Recharts)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border h-64 flex items-center justify-center">
          <p className="text-gray-400">Recent Activity Placeholder</p>
        </div>
      </div>
    </div>
  );
}
