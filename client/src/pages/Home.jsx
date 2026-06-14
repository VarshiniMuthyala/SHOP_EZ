import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Sparkles, Watch, ShoppingBag, Smartphone, Laptop, Headphones } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [adminConfig, setAdminConfig] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch Admin Banner & Categories
        const configRes = await fetch('/api/admin/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          setAdminConfig(configData);
        }

        // Fetch Products and filter to show exactly one item per category
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          
          // Get exactly one item per category for the home page (e.g. 1 Mobile, 1 Laptop, 1 Headphone, 1 Watch)
          const categorySet = new Set();
          const filteredRecs = [];
          for (const product of productsData) {
            if (!categorySet.has(product.category)) {
              categorySet.add(product.category);
              filteredRecs.push(product);
            }
          }
          setRecommended(filteredRecs.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home page details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'mobiles': return <Smartphone size={28} className="category-icon" />;
      case 'laptops': return <Laptop size={28} className="category-icon" />;
      case 'headphones': return <Headphones size={28} className="category-icon" />;
      case 'watches': return <Watch size={28} className="category-icon" />;
      default: return <Sparkles size={28} className="category-icon" />;
    }
  };

  const defaultBanner = {
    title: 'ShopEZ Electronics Store',
    subtitle: 'Find the best deals on smartphones, laptops, headphones, and smartwatches. Perfect for student budgets.',
    image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200'
  };

  const banner = adminConfig?.banner || defaultBanner;
  const categories = adminConfig?.categories || ['Mobiles', 'Laptops', 'Headphones', 'Watches'];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '40px 0' }}>
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            <Sparkles size={14} />
            <span>STUDENT ELECTRONICS DEALS</span>
          </div>
          <h1>{banner.title}</h1>
          <p>{banner.subtitle}</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ padding: '14px 28px' }}>
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/products?category=Mobiles')} className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              <span>Explore Mobiles</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <img src={banner.image} alt="ShopEZ Banner" />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--text-primary)'
          }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Featured Categories</p>
              <h4 style={{ fontWeight: 600 }}>Top Gadgets & Mobiles</h4>
            </div>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Save up to 20%</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 className="section-title">
          <span>Shop by Category</span>
        </h2>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card"
              onClick={() => navigate(`/products?category=${cat}`)}
            >
              {getCategoryIcon(cat)}
              <h4 style={{ marginTop: '12px', fontWeight: 600 }}>{cat}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>Explore Items</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for You Section */}
      <section className="recommended-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <Sparkles className="text-gradient" size={24} />
            <span>Featured Products</span>
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>One handpicked item from each category</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading featured products...
          </div>
        ) : (
          <div className="products-grid">
            {recommended.map((product) => {
              const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
              return (
                <div key={product._id} className="glass-card product-card" style={{ padding: '20px' }}>
                  <div className="product-img-wrapper" style={{ height: '240px' }}>
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}% OFF</span>
                    )}
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="product-info">
                    <span className="product-category" style={{ fontSize: '0.75rem' }}>{product.category}</span>
                    <h3 className="product-name" style={{ fontSize: '1.05rem', margin: '4px 0 8px 0' }}>{product.name}</h3>
                    
                    <div className="product-rating" style={{ marginBottom: '10px' }}>
                      <Star size={12} fill="currentColor" />
                      <span style={{ fontSize: '0.8rem' }}>{product.rating.toFixed(1)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviewsCount} reviews)</span>
                    </div>

                    <div style={{ background: 'rgba(13, 110, 253, 0.05)', border: '1px dashed rgba(13, 110, 253, 0.2)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={12} fill="currentColor" />
                      <span>Great choice for student life!</span>
                    </div>

                    <div className="product-pricing" style={{ marginBottom: '16px' }}>
                      <span className="product-price" style={{ fontSize: '1.2rem' }}>${discountedPrice.toFixed(2)}</span>
                      {product.discount > 0 && (
                        <span className="product-old-price" style={{ fontSize: '0.9rem' }}>${product.price.toFixed(2)}</span>
                      )}
                    </div>

                    <Link to={`/products/${product._id}`} className="btn btn-primary" style={{ width: '100%', gap: '6px', padding: '10px' }}>
                      <span>View Product</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
