import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ShoppingCart, User, LogOut, LayoutDashboard, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate total items in the cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar-header">
      <Link to="/" className="nav-logo">
        <ShoppingBag className="text-primary" size={28} />
        <span className="text-gradient">ShopEZ</span>
      </Link>

      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Products
            </NavLink>
          </li>
          
          {user && (
            <li>
              <Link to="/cart" className="nav-link nav-badge-container">
                <ShoppingCart size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <span>Cart</span>
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </Link>
            </li>
          )}

          {user ? (
            <>
              {user.role === 'admin' ? (
                <li>
                  <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <LayoutDashboard size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    <span>Admin Panel</span>
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <User size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    <span>My Profile</span>
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
