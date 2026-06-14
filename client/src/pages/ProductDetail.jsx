import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, token } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Standard');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // Set default variant
          if (data.category === 'Mobiles' || data.category === 'Laptops') {
            setSize('128GB');
          } else {
            setSize('Standard');
          }
        } else {
          console.error('Failed to load product');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
        Loading product information...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Products
        </button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity, size);
    if (success) {
      navigate('/cart');
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate('/login?redirect=' + encodeURIComponent(`/products/${id}`));
      return;
    }
    const success = await addToCart(product, quantity, size);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '32px',
          fontWeight: 500,
          transition: 'color 0.2s'
        }}
        onMouseOver={e => e.target.style.color = 'var(--primary)'}
        onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} />
        <span>Back to catalog</span>
      </button>

      {/* Detail Layout */}
      <div className="product-detail-layout">
        {/* Images */}
        <div className="product-detail-images">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Specs and actions */}
        <div className="product-detail-info">
          <span className="product-category" style={{ fontSize: '0.9rem' }}>{product.category}</span>
          <h1 style={{ marginTop: '8px' }}>{product.name}</h1>

          <div className="product-detail-meta">
            <div className="product-rating" style={{ marginBottom: 0 }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  style={{ marginRight: '2px' }}
                />
              ))}
              <span style={{ marginLeft: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>{product.reviewsCount} verified reviews</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="product-detail-price">
            <span>${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="product-old-price" style={{ fontSize: '1.25rem' }}>${product.price.toFixed(2)}</span>
                <span style={{ background: 'rgba(13, 110, 253, 0.1)', color: 'var(--accent)', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          <div className="options-section">
            {/* Size Selector */}
            <div>
              <p style={{ fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select Variant:
              </p>
              <div className="size-selector">
                {(product.category === 'Mobiles' || product.category === 'Laptops' ? ['128GB', '256GB'] : ['Standard', 'Premium']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`size-btn ${size === sz ? 'active' : ''}`}
                    style={{ width: 'auto', padding: '0 16px' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <p style={{ fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Quantity:
              </p>
              <div className="qty-selector">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="qty-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="qty-btn"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons" style={{ marginTop: '40px' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-secondary"
              style={{ flexGrow: 1, padding: '16px', gap: '8px' }}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="btn btn-primary"
              style={{ flexGrow: 1.5, padding: '16px' }}
              disabled={product.stock <= 0}
            >
              <span>Shop Now</span>
            </button>
          </div>

          {/* Trust points */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Secured Checkout</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <Truck size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Insured Shipping</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <RefreshCcw size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
