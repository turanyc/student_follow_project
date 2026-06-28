import React from 'react';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <div className="card glass-panel">
        <h2 style={{ marginBottom: '2rem' }}>Profil Ayarları</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            backgroundColor: 'var(--secondary-color)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <UserPlaceholder />
            <button className="btn btn-primary" style={{ position: 'absolute', bottom: 0, right: 0, padding: '0.5rem', borderRadius: '50%' }}>
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3>Ahmet Yılmaz</h3>
            <p className="text-muted">Öğrenci</p>
          </div>
        </div>

        <form>
          <div className="input-group">
            <label>Ad Soyad</label>
            <input type="text" className="input-field" defaultValue="Ahmet Yılmaz" />
          </div>
          <div className="input-group">
            <label>E-posta</label>
            <input type="email" className="input-field" defaultValue="ahmet@example.com" />
          </div>
          <div className="input-group">
            <label>Hedeflenen Bölüm / Üniversite</label>
            <input type="text" className="input-field" defaultValue="Bilgisayar Mühendisliği" />
          </div>
          <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Save size={18} /> Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

const UserPlaceholder = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Profile;
