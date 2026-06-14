import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(10, 8, 20, 0.9)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '40px 20px',
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', fontWeight: 800 }}>
          <ShoppingBag className="text-primary" size={24} />
          <span className="text-gradient">ShopEZ</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.5 }}>
          Your one-stop destination for effortless online shopping. Browse curated fashion accessories and enjoy seamless checkouts.
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        margin: '20px 0',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a>
        <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a>
        <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Help & FAQ</a>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '20px' }}>
        &copy; {new Date().getFullYear()} ShopEZ Inc. Designed with premium aesthetics. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
