import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
    ${isActive(path) ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}
  `;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <Link to="/" className="text-xl font-bold text-brand-900 flex items-center gap-2">
            LuxeMart <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className={linkClass('/admin')}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className={linkClass('/admin/products')}>
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/orders" className={linkClass('/admin/orders')}>
            <ShoppingBag size={20} /> Orders
          </Link>
          <Link to="/admin/coupons" className={linkClass('/admin/coupons')}>
            <Ticket size={20} /> Coupons
          </Link>
          <Link to="/admin/customers" className={linkClass('/admin/customers')}>
            <Users size={20} /> Customers
          </Link>
          <div className="pt-4 mt-4 border-t">
            <Link to="/admin/settings" className={linkClass('/admin/settings')}>
              <Settings size={20} /> Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
