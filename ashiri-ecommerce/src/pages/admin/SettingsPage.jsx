import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { storeSettings, setStoreSettings } = useAdmin();
  const [form, setForm] = useState({ ...storeSettings });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStoreSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Store Configuration</span>
        </div>
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSave}>
            <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Store Name</label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Currency Symbol</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Store Email</label>
                <input
                  type="email"
                  value={form.storeEmail}
                  onChange={(e) => handleChange('storeEmail', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Store Phone</label>
                <input
                  type="tel"
                  value={form.storePhone}
                  onChange={(e) => handleChange('storePhone', e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>

            {/* Integration Status */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                Integration Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Paystack Payments</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Online card & bank transfer payments</div>
                  </div>
                  <span className={`admin-badge ${import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? 'delivered' : 'pending'}`}>
                    {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? 'Connected' : 'Demo Mode'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>EmailJS</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Browser-side order confirmation emails</div>
                  </div>
                  <span className={`admin-badge ${import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'delivered' : 'pending'}`}>
                    {import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'Connected' : 'Not Configured'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Data Storage</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Orders, reviews, and settings persistence</div>
                  </div>
                  <span className="admin-badge processing">localStorage</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '10px 24px' }}>
                {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
