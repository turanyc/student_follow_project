import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft, User, Phone, BookOpen, Target, Shield, CheckCircle, Award, BarChart2, Sparkles, GraduationCap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🚀', '🧠', '🦁', '⚡', '🏆', '🦉', '🎯', '⭐'];

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [examType, setExamType] = useState('yks'); // 'yks', 'lgs', 'kpss', 'ales'
  const [field, setField] = useState('Sayısal');
  const [targetSchool, setTargetSchool] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [dailyQuestionTarget, setDailyQuestionTarget] = useState(150);
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👨‍🎓');

  const [osymTargetData, setOsymTargetData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setName(data.name || data.displayName || currentUser.displayName || data.email?.split('@')[0] || '');
        setPhone(data.phone || '');
        setExamType(data.examType || 'yks');
        setField(data.field || 'Sayısal');
        setTargetSchool(data.targetSchool || data.targetUniversity || '');
        setTargetDepartment(data.targetDepartment || '');
        setDailyQuestionTarget(data.dailyQuestionTarget || 150);
        setBio(data.bio || data.about || '');
        setPhotoURL(data.photoURL || '');
        setAvatarEmoji(data.avatarEmoji || '👨‍🎓');
      }
      setLoading(false);
    });

    const unsubTarget = onSnapshot(doc(db, 'users', currentUser.uid, 'osymTarget', 'targetData'), (snap) => {
      if (snap.exists()) {
        setOsymTargetData(snap.data());
      } else {
        setOsymTargetData(null);
      }
    });

    return () => { unsub(); unsubTarget(); };
  }, [currentUser]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Dosya Çok Büyük!',
        text: 'Profil fotoğrafı maksimum 2 MB boyutunda olmalıdır.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 320;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_DIM) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          }
        } else {
          if (h > MAX_DIM) {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoURL(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);

    try {
      // 1. Firebase Auth profile name
      if (auth.currentUser && name.trim()) {
        await updateProfile(auth.currentUser, { displayName: name.trim() });
      }

      // 2. Firestore user doc update
      const payload = {
        name: name.trim(),
        displayName: name.trim(),
        phone: phone.trim(),
        examType,
        field,
        targetSchool: targetSchool.trim(),
        targetUniversity: targetSchool.trim(),
        targetDepartment: targetDepartment.trim(),
        dailyQuestionTarget: Number(dailyQuestionTarget) || 150,
        bio: bio.trim(),
        about: bio.trim(),
        photoURL: photoURL || null,
        avatarEmoji,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', currentUser.uid), payload, { merge: true });

      Swal.fire({
        icon: 'success',
        title: 'Harika! 🎉',
        text: 'Profil ve hedef bilgileriniz başarıyla güncellendi.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', fontFamily: 'Outfit, sans-serif', paddingBottom: '2.5rem' }}>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/student')} 
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', boxShadow: 'var(--shadow-sm)', borderRadius: 12 }}
      >
        <ArrowLeft size={18} /> Öğrenci Paneline Dön
      </button>

      <div className="card glass-panel" style={{ padding: '2.25rem', background: '#ffffff', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* Üst Profil Kart Başlığı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
              <div style={{ 
                width: '90px', height: '90px', borderRadius: '50%',
                background: photoURL ? '#ffffff' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 800, boxShadow: '0 8px 25px rgba(99,102,241,0.25)',
                overflow: 'hidden', border: '3px solid #e0e7ff'
              }}>
                {photoURL ? (
                  <img src={photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{avatarEmoji || (name ? name[0].toUpperCase() : '🎓')}</span>
                )}
              </div>
              <label 
                htmlFor="profilePhotoInput"
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#6366f1', color: 'white', border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                  zIndex: 2
                }}
                title="Fotoğraf Yükle (Maks 2 MB)"
              >
                <Camera size={16} />
                <input 
                  id="profilePhotoInput" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              {photoURL && (
                <button
                  type="button"
                  onClick={() => setPhotoURL('')}
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#ef4444', color: 'white', border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '0.65rem', fontWeight: 900, zIndex: 2
                  }}
                  title="Fotoğrafı Kaldır"
                >
                  ✕
                </button>
              )}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{name || 'Öğrenci'}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{userData?.email}</span> • 
                <span style={{ 
                  background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '0.15rem 0.6rem', 
                  borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' 
                }}>
                  {userData?.role === 'coach' ? 'Koç' : 'Öğrenci Portalı'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.6rem 1rem', borderRadius: 14, textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>HAZIRLANILAN SINAV</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#059669' }}>
              {examType === 'lgs' ? '📘 MEB LGS' : examType === 'kpss' ? '📗 KPSS' : examType === 'ales' ? '📕 ALES / DGS' : '🎯 ÖSYM YKS'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          
          {/* Avatar Emoji Seçimi */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
              Profil İkonu / Emoji Seçin:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  style={{
                    width: 42, height: 42, borderRadius: 12,
                    border: avatarEmoji === emoji ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: avatarEmoji === emoji ? '#eef2ff' : '#f8fafc',
                    fontSize: '1.25rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Sınav Türü Seçimi */}
          <div style={{ background: '#f8fafc', padding: '1.35rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              <Target size={18} color="#6366f1" /> Hangi Sınava Hazırlanıyorsunuz? (YKS / LGS / KPSS / ALES)
            </label>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Seçtiğiniz sınav türüne göre deneme netleriniz ve ÖSYM/MEB hedef tablolarınız otomatik olarak güncellenecektir.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setExamType('yks')}
                style={{
                  padding: '0.85rem', borderRadius: 12, border: `2px solid ${examType === 'yks' ? '#6366f1' : '#e2e8f0'}`,
                  background: examType === 'yks' ? 'rgba(99,102,241,0.08)' : 'white',
                  color: examType === 'yks' ? '#4f46e5' : '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s'
                }}
              >
                <span>🎯 ÖSYM YKS (TYT-AYT)</span>
                {examType === 'yks' && <CheckCircle size={16} color="#6366f1" />}
              </button>

              <button
                type="button"
                onClick={() => setExamType('lgs')}
                style={{
                  padding: '0.85rem', borderRadius: 12, border: `2px solid ${examType === 'lgs' ? '#f59e0b' : '#e2e8f0'}`,
                  background: examType === 'lgs' ? 'rgba(245,158,11,0.08)' : 'white',
                  color: examType === 'lgs' ? '#d97706' : '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s'
                }}
              >
                <span>📘 MEB LGS (8. Sınıf)</span>
                {examType === 'lgs' && <CheckCircle size={16} color="#f59e0b" />}
              </button>

              <button
                type="button"
                onClick={() => setExamType('kpss')}
                style={{
                  padding: '0.85rem', borderRadius: 12, border: `2px solid ${examType === 'kpss' ? '#10b981' : '#e2e8f0'}`,
                  background: examType === 'kpss' ? 'rgba(16,185,129,0.08)' : 'white',
                  color: examType === 'kpss' ? '#059669' : '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s'
                }}
              >
                <span>📗 KPSS</span>
                {examType === 'kpss' && <CheckCircle size={16} color="#10b981" />}
              </button>
            </div>
          </div>

          {/* Ad Soyad & Telefon Numarası */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155' }}>
                <User size={16} color="#6366f1" /> Ad Soyad
              </label>
              <input 
                type="text" 
                required
                className="input-field" 
                placeholder="Örn: Ahmet Yılmaz" 
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155' }}>
                <Phone size={16} color="#10b981" /> Telefon Numarası
              </label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="Örn: 05xx xxx xx xx" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc' }}
              />
            </div>
          </div>

          {/* Hedef Okul ve Hedef Bölüm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155' }}>
                <BookOpen size={16} color="#8b5cf6" /> Hedeflenen {examType === 'lgs' ? 'Lise' : 'Üniversite'}
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder={examType === 'lgs' ? 'Örn: Galatasaray Lisesi' : 'Örn: Boğaziçi Üniversitesi'} 
                value={targetSchool}
                onChange={e => setTargetSchool(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155' }}>
                <Target size={16} color="#3b82f6" /> Hedeflenen Bölüm / Branş
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Örn: Bilgisayar Mühendisliği" 
                value={targetDepartment}
                onChange={e => setTargetDepartment(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc' }}
              />
            </div>
          </div>

          {/* Çalışma Alanı & Günlük Soru Hedefi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155', display: 'block' }}>
                Çalışma Alanı / Branş:
              </label>
              <select
                value={field}
                onChange={e => setField(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, background: '#f8fafc', outline: 'none' }}
              >
                <option value="Sayısal">Sayısal (SAY)</option>
                <option value="Eşit Ağırlık">Eşit Ağırlık (EA)</option>
                <option value="Sözel">Sözel (SÖZ)</option>
                <option value="Dil">Dil (YDT)</option>
                <option value="Genel">Genel Kültür / Yetenek</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155', display: 'block' }}>
                Günlük Soru Hedefi:
              </label>
              <input
                type="number"
                value={dailyQuestionTarget}
                onChange={e => setDailyQuestionTarget(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc', outline: 'none' }}
              />
            </div>
          </div>

          {/* Sol alt blok ve Sağ alt blok: ÖSYM Hedefi & Motivasyon Sözü */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
            {/* Sol Alt Blok: ÖSYM & MEB Hedef Özeti */}
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1.5px solid #fde68a', borderRadius: 16, padding: '1.25rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                  <Award size={18} color="#d97706" /> ÖSYM / MEB Hedef Kartım
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: 1.5 }}>
                  {osymTargetData ? (
                    examType === 'lgs' ? (
                      <>
                        <strong style={{ display: 'block', fontSize: '1.1rem', color: '#78350f', margin: '0.2rem 0' }}>
                          {osymTargetData.lgs?.lgs_puan ? `${osymTargetData.lgs.lgs_puan} Puan` : 'Hedef Belirlendi'}
                        </strong>
                        Hedef Net: {(() => {
                          const l = osymTargetData.lgs || {};
                          return (Number(l.lgs_turkce_d||0) - Number(l.lgs_turkce_y||0)/3 + Number(l.lgs_mat_d||0) - Number(l.lgs_mat_y||0)/3 + Number(l.lgs_fen_d||0) - Number(l.lgs_fen_y||0)/3 + Number(l.lgs_inkilap_d||0) - Number(l.lgs_inkilap_y||0)/3 + Number(l.lgs_ing_d||0) - Number(l.lgs_ing_y||0)/3 + Number(l.lgs_din_d||0) - Number(l.lgs_din_y||0)/3).toFixed(1);
                        })()} Net (LGS)
                      </>
                    ) : (
                      <>
                        <strong style={{ display: 'block', fontSize: '1.1rem', color: '#78350f', margin: '0.2rem 0' }}>
                          {osymTargetData.yks?.say_puan ? `Sayısal: ${osymTargetData.yks.say_puan} Puan` : osymTargetData.yks?.ea_puan ? `EA: ${osymTargetData.yks.ea_puan} Puan` : 'YKS Hedefi Yapılandırıldı'}
                        </strong>
                        TYT Hedef Net: {(() => {
                          const y = osymTargetData.yks || {};
                          return (Number(y.tyt_turkce_d||0) - Number(y.tyt_turkce_y||0)/4 + Number(y.tyt_mat_d||0) - Number(y.tyt_mat_y||0)/4 + Number(y.tyt_fen_d||0) - Number(y.tyt_fen_y||0)/4 + Number(y.tyt_sosyal_d||0) - Number(y.tyt_sosyal_y||0)/4).toFixed(1);
                        })()} Net
                      </>
                    )
                  ) : (
                    'ÖSYM / MEB hedef net ve puan tablonuz henüz oluşturulmamış.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/student/osym-target')}
                style={{
                  marginTop: '1rem', width: '100%', padding: '0.65rem', borderRadius: 12,
                  background: 'white', border: '1px solid #f59e0b', color: '#b45309',
                  fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  boxShadow: '0 2px 6px rgba(245,158,11,0.1)'
                }}
              >
                <BarChart2 size={15} /> Hedef Tablom'u Düzenle ➔
              </button>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#334155' }}>
                <Shield size={16} color="#f59e0b" /> Hakkımda / Motivasyon Sözü
              </label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="Kendinizi tanıtın veya bu seneki motivasyon cümlenizi yazın..."
                style={{ resize: 'vertical', width: '100%', padding: '0.7rem 0.9rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, background: '#f8fafc' }}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{
                padding: '0.85rem 2.2rem', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
              }}
            >
              <Save size={18} /> {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
