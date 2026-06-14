import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminNewProduct from './pages/AdminNewProduct';
import AdminOrders from './pages/AdminOrders';

// Toast Component
const NotificationToast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const getBorderColor = () => {
    switch (toast.type) {
      case 'error': return 'var(--error)';
      case 'info': return 'var(--secondary)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="notification-banner" style={{ borderLeftColor: getBorderColor() }}>
      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{toast.message}</span>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useApp();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Authenticated Customer Routes */}
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login?redirect=/cart" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login?redirect=/profile" />} />
          
          {/* Admin / Seller Dashboard Routes */}
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login?redirect=/admin" />} />
          <Route path="/admin/products" element={user && user.role === 'admin' ? <AdminProducts /> : <Navigate to="/login?redirect=/admin/products" />} />
          <Route path="/admin/products/new" element={user && user.role === 'admin' ? <AdminNewProduct /> : <Navigate to="/login?redirect=/admin/products/new" />} />
          <Route path="/admin/orders" element={user && user.role === 'admin' ? <AdminOrders /> : <Navigate to="/login?redirect=/admin/orders" />} />
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <NotificationToast />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
