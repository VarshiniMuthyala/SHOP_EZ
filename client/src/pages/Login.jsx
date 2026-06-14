import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '40px auto',
      animation: 'fadeIn 0.6s ease forwards'
    }}>
      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Login to access your profile and check your orders
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                placeholder="Enter email e.g. varshini@shopez.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="password"
                placeholder="Enter password e.g. sarah123"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '12px' }}
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
        </div>

        {/* Demo credentials box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '32px',
          fontSize: '0.8rem'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Demo Accounts for Testing:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <p style={{ fontWeight: 500 }}>Customer (Varshini):</p>
              <p style={{ color: 'var(--text-secondary)' }}>varshini@shopez.com</p>
              <p style={{ color: 'var(--text-secondary)' }}>Pass: varshini123</p>
            </div>
            <div>
              <p style={{ fontWeight: 500 }}>Admin Seller:</p>
              <p style={{ color: 'var(--text-secondary)' }}>admin@shopez.com</p>
              <p style={{ color: 'var(--text-secondary)' }}>Pass: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
