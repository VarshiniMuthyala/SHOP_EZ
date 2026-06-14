import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

const AdminNewProduct = () => {
  const navigate = useNavigate();
  const { token, user, showToast } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Bracelets');
  const [image, setImage] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('10');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState(['Bracelets', 'Necklaces', 'Earrings', 'Handbags', 'Watches']);

  // Fetch admin configs to get available categories list
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (!token) {
      navigate('/login?redirect=/admin/products/new');
      return;
    }

    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/config');
        if (res.ok) {
          const data = await res.json();
          if (data && data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !image) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          image,
          discount: Number(discount),
          stock: Number(stock)
        })
      });

      const data = await res.json();

      if (res.ok) {
        showToast(`Product "${name}" added successfully!`, 'success');
        navigate('/admin/products');
      } else {
        throw new Error(data.message || 'Creation failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Back button */}
      <button 
        onClick={() => navigate('/admin/products')} 
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
        <span>Back to Products List</span>
      </button>

      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Sparkles className="text-gradient" size={24} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input 
              type="text" 
              id="name" 
              placeholder="e.g. Diamond Stud Earrings"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Category selection */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select 
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-input"
                style={{ background: 'rgba(20, 18, 38, 0.95)' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Standard Price */}
            <div className="form-group">
              <label htmlFor="price">Standard Price ($) *</label>
              <input 
                type="number" 
                id="price" 
                min="0.01"
                step="0.01"
                placeholder="e.g. 89.99"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Discount Percentage */}
            <div className="form-group">
              <label htmlFor="discount">Discount Percentage (%)</label>
              <input 
                type="number" 
                id="discount" 
                min="0"
                max="100"
                placeholder="e.g. 15 for 15%"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Initial Stock */}
            <div className="form-group">
              <label htmlFor="stock">Initial Stock Quantity</label>
              <input 
                type="number" 
                id="stock" 
                min="0"
                placeholder="e.g. 15"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Product Image URL */}
          <div className="form-group">
            <label htmlFor="image">Product Image URL *</label>
            <input 
              type="url" 
              id="image" 
              placeholder="e.g. https://images.unsplash.com/..."
              value={image}
              onChange={e => setImage(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Product Description *</label>
            <textarea 
              id="description" 
              rows="4"
              placeholder="Write detailed specifications, style guidelines, materials, and size information..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-input"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '16px' }}
            disabled={submitting}
          >
            <Save size={18} />
            <span>{submitting ? 'Adding Listing...' : 'Save Product Listing'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNewProduct;
