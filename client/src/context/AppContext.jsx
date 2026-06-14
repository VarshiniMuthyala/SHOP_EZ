import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Show premium notification toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load user token from localStorage on start
  useEffect(() => {
    const storedUser = localStorage.getItem('shopez_user');
    const storedToken = localStorage.getItem('shopez_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Fetch cart from server when token changes or when cart changes
  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('shopez_user', JSON.stringify({ _id: data._id, username: data.username, email: data.email, role: data.role }));
      localStorage.setItem('shopez_token', data.token);
      showToast(`Welcome back, ${data.username}!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const register = async (username, email, password, role = 'user') => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('shopez_user', JSON.stringify({ _id: data._id, username: data.username, email: data.email, role: data.role }));
      localStorage.setItem('shopez_token', data.token);
      showToast(`Account created! Welcome ${data.username}`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem('shopez_user');
    localStorage.removeItem('shopez_token');
    showToast('Logged out successfully', 'info');
  };

  // Cart Operations
  const addToCart = async (product, quantity, size) => {
    if (!token) {
      showToast('Please log in to add items to your cart', 'error');
      return false;
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          quantity: Number(quantity),
          size,
          price: product.price,
          image: product.image
        })
      });

      if (res.ok) {
        await fetchCart();
        showToast(`Added ${quantity}x ${product.name} (${size}) to cart!`, 'success');
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateCartItem = async (cartItemId, quantity, size) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity, size })
      });

      if (res.ok) {
        await fetchCart();
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update item');
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchCart();
        showToast('Item removed from cart', 'info');
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to remove item');
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setCart([]);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Checkout / Place Order Operations
  const placeOrder = async (shippingAddress, paymentMethod) => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }

    const totalAmount = cart.reduce((sum, item) => {
      const price = item.price * (1 - (item.productId?.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    const productsList = cart.map(item => ({
      productId: item.productId?._id || item.productId,
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      price: item.price * (1 - (item.productId?.discount || 0) / 100),
      image: item.image
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          products: productsList,
          shippingAddress,
          paymentMethod,
          totalAmount
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCart([]); // Reset local cart
        showToast('Order placed successfully!', 'success');
        return data;
      } else {
        throw new Error(data.message || 'Order placement failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        cart,
        toast,
        loading,
        showToast,
        login,
        register,
        logout,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        placeOrder,
        fetchCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
