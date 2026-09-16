import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { storeSettings, updateSettings } = useAdmin();
  const [form, setForm] = useState({ ...storeSettings });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...storeSettings });
  }, [storeSettings]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(form, logoFile);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
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

            {/* Logo Upload Section */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                Store Logo
              </h3>
              <div style={{
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '8px',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img
                    src={logoPreview || form.logoUrl || '/logo.png'}
                    alt="Store Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    id="logo-upload"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-block', cursor: 'pointer', marginBottom: '8px' }}
                  >
                    Change Logo
                  </label>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Recommended format: PNG or SVG with transparent background.<br/>
                    Max size: 5MB.
                  </p>
                </div>
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
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Flutterwave Payments</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Online card & bank transfer payments</div>
                  </div>
                  <span className={`admin-badge ${import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ? 'delivered' : 'pending'}`}>
                    {import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ? 'Connected' : 'Demo Mode'}
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
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Resend (Vercel Serverless)</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Premium order & fulfillment emails</div>
                  </div>
                  <span className="admin-badge delivered">
                    Connected
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
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Orders, products, reviews, and settings</div>
                  </div>
                  <span className={`admin-badge ${import.meta.env.VITE_SUPABASE_URL ? 'delivered' : 'pending'}`}>
                    {import.meta.env.VITE_SUPABASE_URL ? 'Supabase Connected' : 'localStorage Fallback'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '10px 24px' }} disabled={isSaving}>
                {saved ? <><Check size={15} /> Saved!</> : isSaving ? 'Saving...' : <><Save size={15} /> Save Settings</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
