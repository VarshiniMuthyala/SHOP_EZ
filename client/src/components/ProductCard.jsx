import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { _id, name, category, price, image, discount, rating, reviewsCount } = product;

  // Calculate discounted price
  const discountedPrice = price * (1 - (discount || 0) / 100);

  return (
    <div className="glass-card product-card animate-fade-in">
      <div className="product-img-wrapper">
        {discount > 0 && (
          <span className="discount-badge">-{discount}% OFF</span>
        )}
        <img src={image} alt={name} loading="lazy" />
      </div>

      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        
        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({reviewsCount || 0})</span>
        </div>

        <div className="product-pricing">
          <span className="product-price">${discountedPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="product-old-price">${price.toFixed(2)}</span>
          )}
        </div>

        <Link to={`/products/${_id}`} className="btn btn-secondary" style={{ width: '100%', gap: '6px' }}>
          <Eye size={16} />
          <span>Shop Now</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
