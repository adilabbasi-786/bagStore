import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Package, Instagram, Twitter, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return <Outlet />;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white shadow-lg">
              <Package size={20} strokeWidth={2.5} />
            </div>
            BagXCo
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-black transition uppercase tracking-wider">Home</Link>
            <Link to="/store" className="text-sm font-medium text-gray-600 hover:text-black transition uppercase tracking-wider">Store</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-black transition uppercase tracking-wider">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition uppercase tracking-wider">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition uppercase tracking-wider border border-brand-200 px-3 py-1 rounded-full bg-brand-50">
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Link to="/cart" className="relative p-1 text-gray-600 hover:text-black transition group">
              <ShoppingCart size={24} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="p-1 text-gray-600 hover:text-black">
                  <User size={24} strokeWidth={2} />
                </button>
                <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 hidden group-hover:block py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900">{user.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-1 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-6 absolute w-full shadow-2xl animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Home</Link>
              <Link to="/store" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Store</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</Link>
              {!user && (
                <Link to="/auth" className="bg-black text-white py-3 rounded-lg text-center font-medium" onClick={() => setIsMenuOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Bagxco</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Premium products curated for the modern lifestyle. Quality meets elegance in every detail.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/store" className="hover:text-white transition">All Products</Link></li>
                <li><Link to="/store" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link to="/store" className="hover:text-white transition">Featured</Link></li>
                <li><Link to="/store" className="hover:text-white transition">Collections</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe for latest updates and offers.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-900 border border-gray-800 text-white px-4 py-2.5 rounded-lg w-full focus:outline-none focus:border-gray-600 text-sm" 
                />
                <button className="bg-white text-black px-4 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition text-sm">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} LuxeMart Enterprise. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
