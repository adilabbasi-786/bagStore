import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import Store from './pages/Store';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCoupons from './pages/admin/Coupons';
import AdminCustomers from './pages/admin/Customers';

// Route Guards
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && isAdmin ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="auth" element={<Auth />} />
        <Route 
          path="checkout" 
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <PrivateRoute>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">User Profile</h1>
                <p>Order history goes here.</p>
              </div>
            </PrivateRoute>
          } 
        />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<div className="p-8">Store Settings</div>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <AppRoutes />
          <Toaster position="bottom-right" />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}
