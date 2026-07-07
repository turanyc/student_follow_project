import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft, User, Phone, BookOpen, Target, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [examType, setExamType] = useState('yks'); // 'yks' or 'lgs'
  const [targetSchool, setTargetSchool] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setName(data.name || data.email?.split('@')[0] || '');
        setPhone(data.phone || '');
        setExamType(data.examType || 'yks');
        setTargetSchool(data.targetSchool || '');
        setBio(data.bio || '');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        phone: phone.trim(),
        examType: examType,
        targetSchool: targetSchool.trim(),
        bio: bio.trim(),
        updatedAt: new Date().toISOString()
      });
      Swal.fire({
        icon: 'success',
        title: 'Harika!',
        text: 'Profil bilgileriniz ve sınav türünüz başarıyla güncellendi.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Profil güncellenirken bir hata oluştu.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto', width: '100%', fontFamily: 'Outfit, sans-serif' }}>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', boxShadow: 'var(--shadow-sm)' }}
      >
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <div className="card glass-panel" style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: '90px', height: '90px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 800, boxShadow: '0 8px 25px rgba(99,102,241,0.3)'
            }}>
              {name ? name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.6rem', color: '#1e293b' }}>{name || 'Kullanıcı'}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{userData?.email}</span> • 
                <span style={{ 
                  background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '0.15rem 0.6rem', 
                  borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' 
                }}>
                  {userData?.role === 'coach' ? 'Koç' : 'Öğrenci'}
                </span>
              </p>
            </div>
          </div>

          {userData?.role === 'student' && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.6rem 1rem', borderRadius: 12, textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>HAZIRLANILAN SINAV</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                {examType === 'lgs' ? '📘 MEB LGS' : '🎯 ÖSYM YKS'}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Sınav Türü Seçimi - Eğer öğrenciyse */}
          {userData?.role === 'student' && (
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                <Target size={18} color="#6366f1" /> Hangi Sınava Hazırlanıyorsunuz? (YKS / LGS)
              </label>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                Seçtiğiniz sınav türüne göre deneme netleri dersleriniz (Türkçe, Matematik, Fen, Sosyal vs.) ve ÖSYM/MEB hedef tabloları otomatik olarak revize edilecektir.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setExamType('yks')}
                  style={{
                    padding: '1rem', borderRadius: 12, border: `2px solid ${examType === 'yks' ? '#6366f1' : '#e2e8f0'}`,
                    background: examType === 'yks' ? 'rgba(99,102,241,0.08)' : 'white',
                    color: examType === 'yks' ? '#4f46e5' : '#64748b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s',
                    boxShadow: examType === 'yks' ? '0 4px 15px rgba(99,102,241,0.15)' : 'none'
                  }}
                >
                  <span>🎯 ÖSYM YKS (TYT - AYT)</span>
                  {examType === 'yks' && <CheckCircle size={18} color="#6366f1" />}
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('lgs')}
                  style={{
                    padding: '1rem', borderRadius: 12, border: `2px solid ${examType === 'lgs' ? '#f59e0b' : '#e2e8f0'}`,
                    background: examType === 'lgs' ? 'rgba(245,158,11,0.08)' : 'white',
                    color: examType === 'lgs' ? '#d97706' : '#64748b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s',
                    boxShadow: examType === 'lgs' ? '0 4px 15px rgba(245,158,11,0.15)' : 'none'
                  }}
                >
                  <span>📘 MEB LGS (8. Sınıf)</span>
                  {examType === 'lgs' && <CheckCircle size={18} color="#f59e0b" />}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
                <User size={16} color="#6366f1" /> Ad Soyad
              </label>
              <input 
                type="text" 
                required
                className="input-field" 
                placeholder="Örn: Ahmet Yılmaz" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
                <Phone size={16} color="#10b981" /> Telefon Numarası
              </label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="Örn: 05xx xxx xx xx" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {userData?.role === 'student' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
                <BookOpen size={16} color="#8b5cf6" /> Hedeflenen {examType === 'lgs' ? 'Lise' : 'Üniversite ve Bölüm'}
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder={examType === 'lgs' ? 'Örn: Galatasaray Lisesi / Fen Lisesi' : 'Örn: Boğaziçi Bilgisayar Mühendisliği / ODTÜ'} 
                value={targetSchool}
                onChange={e => setTargetSchool(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
              <Shield size={16} color="#f59e0b" /> Hakkımda / Motivasyon Sözü
            </label>
            <textarea 
              className="input-field" 
              rows="3" 
              placeholder="Kendinizi tanıtın veya bu seneki motivasyon cümlenizi yazın..."
              style={{ resize: 'vertical' }}
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ padding: '0.8rem 2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
            >
              {saving ? 'Kaydediliyor...' : (
                <>
                  <Save size={18} /> Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
