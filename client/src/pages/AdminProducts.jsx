import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, Edit, Plus, ArrowLeft, Image } from 'lucide-react';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { token, user, showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
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
      navigate('/login?redirect=/admin/products');
      return;
    }

    fetchProducts();
  }, [token, user, navigate]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        showToast(`Product "${name}" deleted successfully`, 'info');
        fetchProducts(); // Refresh list
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Deletion failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Listed Products</h2>
        <Link to="/admin/products/new" className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Retrieving products...
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <h3>No Products Listed</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Start by adding a new product listing to the catalog.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Standard Price</th>
                  <th>Discount</th>
                  <th>Stock Available</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
                  return (
                    <tr key={product._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <span style={{ fontWeight: 700 }}>${finalPrice.toFixed(2)}</span>
                        {product.discount > 0 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'line-through', marginLeft: '6px' }}>
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td style={{ color: product.discount > 0 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {product.discount > 0 ? `${product.discount}% OFF` : '-'}
                      </td>
                      <td style={{ color: product.stock <= 3 ? 'var(--error)' : 'var(--text-primary)', fontWeight: 600 }}>
                        {product.stock} units
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => navigate(`/products/${product._id}`)} 
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id, product.name)} 
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              transition: 'color 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--error)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
