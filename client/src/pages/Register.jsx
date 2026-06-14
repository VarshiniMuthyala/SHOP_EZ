import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, User, Mail, Key, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, user } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setSubmitting(true);
    const success = await register(username, email, password, role);
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
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Register to start your seamless online shopping experience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="username"
                placeholder="Enter your name e.g. Sarah"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

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
                placeholder="Enter password (minimum 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Role selection (convenient for testing) */}
          <div className="form-group">
            <label htmlFor="role">Register As</label>
            <div style={{ position: 'relative' }}>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px', appearance: 'none', background: 'rgba(20, 18, 38, 0.95)' }}
              >
                <option value="user">Customer (Browse and Buy)</option>
                <option value="admin">Seller / Admin (Dashboard and Orders)</option>
              </select>
              <Shield size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '12px' }}
            disabled={submitting}
          >
            <UserPlus size={18} />
            <span>{submitting ? 'Registering...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
