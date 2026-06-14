import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, Filter, RefreshCw } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'All';

  // Fetch categories from config on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/config');
        if (res.ok) {
          const data = await res.json();
          if (data && data.categories) {
            setCategories(['All', ...data.categories]);
          }
        }
      } catch (err) {
        console.error('Error fetching categories config:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on search and category filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = [];
      
      if (activeCategory && activeCategory !== 'All') {
        params.push(`category=${encodeURIComponent(activeCategory)}`);
      }
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchParams]); // Refetch on category parameter change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryClick = (category) => {
    setSearchParams({ category });
  };

  return (
    <div className="animate-fade-in">
      {/* Title Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
          Our Fashion Accessories Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our handpicked collections of luxury jewelry, handbags, and precision watches designed for elegance.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px',
        marginBottom: '40px',
        alignItems: 'center'
      }}>
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '44px' }}
          />
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
        </form>

        {/* Categories Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          whiteSpace: 'nowrap'
        }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
                borderRadius: '20px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Display Grid */}
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0',
          gap: '16px',
          color: 'var(--text-secondary)'
        }}>
          <RefreshCw className="animate-spin" size={36} style={{ color: 'var(--primary)' }} />
          <span>Searching for beautiful items...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '8px' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try refining your search keyword or selected category filter.</p>
          <button 
            onClick={() => { setSearch(''); handleCategoryClick('All'); }} 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            <span>Showing {products.length} stunning accessories</span>
            <span>Category: <strong style={{ color: 'var(--primary)' }}>{activeCategory}</strong></span>
          </div>
          
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
