import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DollarSign, Users, ShoppingBag, ShoppingCart, Plus, List, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useApp();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not admin, redirect
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (!token) {
      navigate('/login?redirect=/admin');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
        Loading admin dashboard statistics...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800 }}>Seller Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Analyze store activity and manage product deliveries.</p>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products/new" className="btn btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} />
            <span>New Product</span>
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary" style={{ gap: '6px' }}>
            <ClipboardList size={16} />
            <span>Process Orders</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--success)' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Revenue</span>
            <h3 className="stat-number">${stats?.totalRevenue.toFixed(2) || '0.00'}</h3>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--primary)' }}>
            <ShoppingCart size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</span>
            <h3 className="stat-number">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--secondary)' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Products Listed</span>
            <h3 className="stat-number">{stats?.totalProducts || 0}</h3>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent)' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Customers</span>
            <h3 className="stat-number">{stats?.totalUsers || 0}</h3>
          </div>
        </div>
      </div>

      {/* Details Sections Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
        {/* Order Status Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Order Processing Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>Pending Processing</span>
                <span style={{ fontWeight: 700 }}>{stats?.statusBreakdown.pending || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'var(--warning)',
                  width: `${stats?.totalOrders > 0 ? ((stats.statusBreakdown.pending / stats.totalOrders) * 100) : 0}%`
                }} />
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>Shipped / In Transit</span>
                <span style={{ fontWeight: 700 }}>{stats?.statusBreakdown.shipped || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: '#3b82f6',
                  width: `${stats?.totalOrders > 0 ? ((stats.statusBreakdown.shipped / stats.totalOrders) * 100) : 0}%`
                }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>Delivered Successfully</span>
                <span style={{ fontWeight: 700 }}>{stats?.statusBreakdown.delivered || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'var(--success)',
                  width: `${stats?.totalOrders > 0 ? ((stats.statusBreakdown.delivered / stats.totalOrders) * 100) : 0}%`
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation and management options */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Store Administration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Access configuration utilities to add fashion catalog products, adjust details, change shipping rates, or track seller analytics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <Link to="/admin/products" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <List size={18} className="text-primary" />
                <span>Manage Product Listings</span>
              </span>
              <span>&rarr;</span>
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={18} className="text-primary" />
                <span>Manage Customer Orders</span>
              </span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
