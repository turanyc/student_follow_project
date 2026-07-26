import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Target, Award, BookOpen, Clock, Heart,
  Sparkles, Save, X, Check, GraduationCap, Shield, Camera, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🚀', '🧠', '🦁', '⚡', '🏆', '🦉', '🎯', '⭐'];

const ProfileEditModal = ({ isOpen, onClose, isCoach = false }) => {
  const { currentUser, userData } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    targetUniversity: '',
    targetDepartment: '',
    targetRank: '',
    examType: 'YKS',
    field: 'Sayısal',
    dailyQuestionTarget: 150,
    dailyTimeTargetMinutes: 240,
    bio: '',
    avatarEmoji: '👨‍🎓',
    specialty: '',
    workingHours: ''
  });

  const [saving, setSaving] = useState(false);

  // Sync state with userData & currentUser
  useEffect(() => {
    if (userData || currentUser) {
      setFormData({
        name: userData?.name || userData?.displayName || currentUser?.displayName || '',
        phone: userData?.phone || '',
        targetUniversity: userData?.targetUniversity || '',
        targetDepartment: userData?.targetDepartment || '',
        targetRank: userData?.targetRank || '',
        examType: userData?.examType || 'YKS',
        field: userData?.field || 'Sayısal',
        dailyQuestionTarget: userData?.dailyQuestionTarget || 150,
        dailyTimeTargetMinutes: userData?.dailyTimeTargetMinutes || 240,
        bio: userData?.bio || userData?.about || '',
        avatarEmoji: userData?.avatarEmoji || '👨‍🎓',
        specialty: userData?.specialty || userData?.branch || 'YKS & LGS Derece Koçu',
        workingHours: userData?.workingHours || 'Hafta içi 10:00 - 18:00'
      });
    }
  }, [userData, currentUser, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);

    try {
      // 1. Update Firebase Auth display name if changed
      if (formData.name.trim() && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: formData.name.trim() });
      }

      // 2. Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      const updatePayload = {
        name: formData.name.trim(),
        displayName: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        about: formData.bio.trim(),
        avatarEmoji: formData.avatarEmoji,
        updatedAt: new Date().toISOString()
      };

      if (!isCoach) {
        // Student specific fields
        updatePayload.targetUniversity = formData.targetUniversity.trim();
        updatePayload.targetDepartment = formData.targetDepartment.trim();
        updatePayload.targetRank = formData.targetRank;
        updatePayload.examType = formData.examType;
        updatePayload.field = formData.field;
        updatePayload.dailyQuestionTarget = Number(formData.dailyQuestionTarget) || 150;
        updatePayload.dailyTimeTargetMinutes = Number(formData.dailyTimeTargetMinutes) || 240;
      } else {
        // Coach specific fields
        updatePayload.specialty = formData.specialty.trim();
        updatePayload.workingHours = formData.workingHours.trim();
      }

      await setDoc(userRef, updatePayload, { merge: true });

      Swal.fire({
        icon: 'success',
        title: 'Profil Güncellendi! 🎉',
        text: 'Profil ve hedef bilgileriniz başarıyla kaydedildi.',
        timer: 1800,
        showConfirmButton: false
      });

      onClose();
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      Swal.fire({
        icon: 'error',
        title: 'Hata Oluştu',
        text: 'Profil kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#ffffff', borderRadius: 24, padding: '2rem',
            maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          {/* Kapat Butonu */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20, background: '#f1f5f9',
              border: 'none', borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>

          {/* Başlık */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', color: 'white'
            }}>
              {formData.avatarEmoji || '👨‍🎓'}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                {isCoach ? 'Koçluk Profili Güncelle' : 'Profilim ve Hedeflerim'}
              </h2>
              <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Kişisel bilgilerinizi ve hedeflerinizi anlık güncelleyin.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Avatar Seçici */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                Profil İkonu / Emoji Seçin:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {AVATAR_OPTIONS.map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => handleChange('avatarEmoji', emoji)}
                    style={{
                      width: 42, height: 42, borderRadius: 12, border: formData.avatarEmoji === emoji ? '2px solid #6366f1' : '1px solid #e2e8f0',
                      background: formData.avatarEmoji === emoji ? '#eef2ff' : '#f8fafc',
                      fontSize: '1.25rem', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Kişisel Bilgiler */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Ad Soyad:</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Adınız Soyadınız"
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.3rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Telefon Numarası:</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="05xx xxx xx xx"
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.3rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>
              </div>
            </div>

            {/* Öğrenciye Özel Alanlar */}
            {!isCoach && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Hedef Üniversite:</label>
                    <div style={{ position: 'relative' }}>
                      <GraduationCap size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={formData.targetUniversity}
                        onChange={e => handleChange('targetUniversity', e.target.value)}
                        placeholder="Örn: Boğaziçi Üniversitesi"
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.3rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Hedef Bölüm:</label>
                    <div style={{ position: 'relative' }}>
                      <Target size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={formData.targetDepartment}
                        onChange={e => handleChange('targetDepartment', e.target.value)}
                        placeholder="Örn: Bilgisayar Mühendisliği"
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.3rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Sınav Türü:</label>
                    <select
                      value={formData.examType}
                      onChange={e => handleChange('examType', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, outline: 'none', background: '#f8fafc' }}
                    >
                      <option value="YKS">YKS (TYT / AYT)</option>
                      <option value="LGS">LGS</option>
                      <option value="KPSS">KPSS</option>
                      <option value="ALES">ALES / DGS</option>
                      <option value="Özel">Özel / Kendini Geliştirme</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Çalışma Alanı / Branş:</label>
                    <select
                      value={formData.field}
                      onChange={e => handleChange('field', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, outline: 'none', background: '#f8fafc' }}
                    >
                      <option value="Sayısal">Sayısal (SAY)</option>
                      <option value="Eşit Ağırlık">Eşit Ağırlık (EA)</option>
                      <option value="Sözel">Sözel (SÖZ)</option>
                      <option value="Dil">Dil (YDT)</option>
                      <option value="Genel">Genel Kültür / Yetenek</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Günlük Soru Hedefi:</label>
                    <input
                      type="number"
                      value={formData.dailyQuestionTarget}
                      onChange={e => handleChange('dailyQuestionTarget', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Hedef Sıralama (Örn: #1000):</label>
                    <input
                      type="text"
                      value={formData.targetRank}
                      onChange={e => handleChange('targetRank', e.target.value)}
                      placeholder="Örn: İlk 5.000"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Koça Özel Alanlar */}
            {isCoach && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Uzmanlık Alanınız:</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={e => handleChange('specialty', e.target.value)}
                    placeholder="Örn: YKS Derece Koçu & PDR"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Çalışma / Görüşme Saatleri:</label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={e => handleChange('workingHours', e.target.value)}
                    placeholder="Örn: Hafta içi 10:00 - 19:00"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>
              </div>
            )}

            {/* Biyografi / Motivasyon Sözü */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                {isCoach ? 'Biyografi / Hakkınızda:' : 'Biyografi / Motivasyon Sözünüz:'}
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder={isCoach ? 'Öğrencilerinize sunduğunuz koçluk vizyonunu yazın...' : 'Sizi motive eden hedefiniz ve çalışma mottolarınız...'}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc', resize: 'vertical' }}
              />
            </div>

            {/* Kaydet Butonu */}
            <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: 14, border: '1px solid #cbd5e1',
                  background: '#f8fafc', color: '#475569', fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Vazgeç
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 2, padding: '0.85rem', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <Save size={18} /> {saving ? 'Kaydediliyor...' : '💾 Profili Güncelle & Kaydet'}
              </button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;
