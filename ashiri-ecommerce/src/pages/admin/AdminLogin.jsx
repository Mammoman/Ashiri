import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Lock, Eye, EyeOff, User } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { success, error: loginError } = await login(email, password);
    
    if (!success) {
      setError(loginError || 'Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">ASHIRI</div>
        <p className="admin-login-subtitle">Admin Dashboard Access</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@ashiri.com"
                className="admin-form-input"
                style={{ paddingLeft: '40px' }}
                autoFocus
                required
              />
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="admin-form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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

          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '10px', fontSize: '0.85rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '24px', lineHeight: 1.5 }}>
          If connected to Supabase, use your Supabase Auth credentials.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
