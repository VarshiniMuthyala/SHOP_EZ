import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, ShoppingCart, RefreshCcw } from 'lucide-react';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { token, user, showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (!token) {
      navigate('/login?redirect=/admin/orders');
      return;
    }

    fetchOrders();
  }, [token, user, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Order status updated to "${newStatus}"`, 'success');
        fetchOrders(); // Refresh order records
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Status update failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button 
        onClick={() => navigate('/admin')} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '24px',
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Admin Panel</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Manage Placed Orders</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Update fulfillment states for pending customer orders.
          </p>
        </div>
        
        <button 
          onClick={fetchOrders} 
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
        >
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Retrieving order details...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <Clock size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Customer purchases will appear here for processing.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-card" style={{ padding: '24px' }}>
              
              {/* Order summary header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID / Date:</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>{order._id}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.orderDate).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer:</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>{order.userId?.username || 'Deleted Account'}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.userId?.email || ''}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pricing:</span>
                  <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.15rem', marginTop: '2px' }}>
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>via {order.paymentMethod}</span>
                </div>

                {/* Status Update Dropdown */}
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Fulfilment Status:
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`status-pill ${getStatusClass(order.status)}`}
                    style={{
                      border: '1px solid var(--border-color)',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      outline: 'none',
                      appearance: 'none',
                      background: 'rgba(20, 18, 38, 0.95)'
                    }}
                  >
                    <option value="Pending" style={{ color: 'var(--warning)', background: 'var(--bg-base)' }}>Pending</option>
                    <option value="Shipped" style={{ color: '#3b82f6', background: 'var(--bg-base)' }}>Shipped</option>
                    <option value="Delivered" style={{ color: 'var(--success)', background: 'var(--bg-base)' }}>Delivered</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.products.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Quantity: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Address detail */}
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px dashed var(--border-color)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
