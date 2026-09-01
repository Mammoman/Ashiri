import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">ASHIRI</div>
        <p className="admin-login-subtitle">Admin Dashboard Access</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="admin-form-input"
                style={{ paddingRight: '40px' }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.78rem', marginBottom: '16px', fontWeight: 500 }}>
              {error}
            </p>
          )}

          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '10px', fontSize: '0.85rem' }}>
            <Lock size={15} />
            Sign In
          </button>
        </form>

        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '24px' }}>
          Default password: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>ashiri2026</code>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
