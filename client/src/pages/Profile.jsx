import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Mail, Calendar, Package, Clock, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/profile');
      return;
    }

    const fetchUserOrders = async () => {
      try {
        const res = await fetch('/api/users/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [token, navigate]);

  if (!user) {
    return null;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2.5fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* User Card */}
        <div className="glass-card" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#07050f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.username}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>
              {user.role} Account
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} className="text-primary" />
              <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={16} className="text-primary" />
              <span>Joined June 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={16} className="text-primary" />
              <span>Verified Account</span>
            </div>
          </div>
        </div>

        {/* Orders History Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package className="text-primary" size={24} />
              <span>My Order History</span>
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Retrieving your purchases...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <Clock size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p style={{ fontWeight: 600 }}>No orders placed yet.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Explore the products page and buy custom gifts.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map((order) => (
                  <div 
                    key={order._id} 
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.2)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    {/* Order Meta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID:</span>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order._id}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Placed:</span>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                        <p style={{ marginTop: '2px' }}>
                          <span className={`status-pill ${getStatusClass(order.status)}`}>{order.status}</span>
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Paid:</span>
                        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Products list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.products.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                          />
                          <div style={{ flexGrow: 1 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Qty: {item.quantity}</p>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address */}
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px dashed var(--border-color)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
