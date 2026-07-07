import React, { useState, useEffect } from 'react';
import { 
  UserCircle, GraduationCap, Phone, Mail, Lock, User, ArrowRight, X, Sparkles, ShieldCheck 
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AuthModal = ({ initialMode = 'login', onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [role, setRole] = useState('student');
  const [examType, setExamType] = useState('yks'); // 'yks' or 'lgs'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsRegister(initialMode === 'register');
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          Swal.fire({ icon: 'warning', title: 'Eksik Bilgi', text: 'Lütfen ad ve soyadınızı giriniz.' });
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          Swal.fire({ icon: 'warning', title: 'Eksik Bilgi', text: 'Lütfen telefon numaranızı giriniz.' });
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        let assignedCoachId = null;

        if (role === 'student') {
          const q = query(collection(db, 'users'), where('role', '==', 'coach'), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            assignedCoachId = querySnapshot.docs[0].id;
          }
        }
        
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: role,
          name: name.trim(),
          phone: phone.trim(),
          examType: role === 'student' ? examType : null,
          status: role === 'student' ? 'not-studying' : null,
          coachId: role === 'student' ? assignedCoachId : null,
          subscriptionStatus: 'trial', // Default 14-day trial
          plan: 'starter_free',
          createdAt: new Date().toISOString()
        });

        if (role === 'student') {
          sessionStorage.setItem('newStudentRegistered', 'true');
        }

        Swal.fire({
          icon: 'success',
          title: 'Hoş Geldiniz! 🚀',
          text: 'Hesabınız başarıyla oluşturuldu. Panele yönlendiriliyorsunuz...',
          timer: 1500,
          showConfirmButton: false
        });

        if (onSuccess) onSuccess(role);
        
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Firebase Auth Error: ', err);
      let errorMsg = err.message;
      if (errorMsg.includes('auth/email-already-in-use')) errorMsg = 'Bu e-posta adresi zaten kullanımda.';
      if (errorMsg.includes('auth/wrong-password') || errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/invalid-credential')) errorMsg = 'E-posta veya şifre hatalı.';
      if (errorMsg.includes('auth/weak-password')) errorMsg = 'Şifre en az 6 karakter olmalıdır.';

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: isRegister ? `Kayıt olurken bir hata oluştu: ${errorMsg}` : `Giriş başarısız: ${errorMsg}`,
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5, 8, 16, 0.85)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 28,
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(99,102,241,0.25)',
        padding: '2.5rem 2.2rem', position: 'relative', color: 'white',
        maxHeight: '90vh', overflowY: 'auto'
      }} className="custom-scrollbar">
        
        {/* Close X Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <X size={20} />
        </button>

        {/* Top Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(11, 15, 25, 0.7)', padding: '0.4rem',
          borderRadius: 16, marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.92rem', transition: 'all 0.25s',
              background: !isRegister ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: !isRegister ? 'white' : '#94a3b8',
              boxShadow: !isRegister ? '0 4px 15px rgba(99,102,241,0.4)' : 'none'
            }}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.92rem', transition: 'all 0.25s',
              background: isRegister ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
              color: isRegister ? 'white' : '#94a3b8',
              boxShadow: isRegister ? '0 4px 15px rgba(236,72,153,0.4)' : 'none'
            }}
          >
            Ücretsiz Kayıt Ol
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.8rem', borderRadius: 99, background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.6rem'
          }}>
            <Sparkles size={13} /> {isRegister ? '14 GÜN ÜCRETSİZ PRO DENEME' : 'EDUKOÇ PRO ALTYAPISI'}
          </div>
          <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
            {isRegister ? 'Aramıza Hoş Geldiniz! 🚀' : 'Tekrar Hoş Geldiniz! 👋'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            {isRegister ? 'Hemen profilinizi oluşturun ve efsanevi ağacınızı büyütmeye başlayın.' : 'Hesabınıza giriş yaparak koçluk ve takip panelinize ulaşın.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* If Register: Role Selection */}
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                HESAP TÜRÜ SEÇİN
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${role === 'student' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                    background: role === 'student' ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.03)',
                    color: role === 'student' ? 'white' : '#94a3b8', fontWeight: 800, fontSize: '0.88rem'
                  }}
                >
                  <GraduationCap size={18} color={role === 'student' ? '#a5b4fc' : '#64748b'} />
                  Öğrenciyim
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coach')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${role === 'coach' ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                    background: role === 'coach' ? 'rgba(236,72,153,0.22)' : 'rgba(255,255,255,0.03)',
                    color: role === 'coach' ? 'white' : '#94a3b8', fontWeight: 800, fontSize: '0.88rem'
                  }}
                >
                  <UserCircle size={18} color={role === 'coach' ? '#f472b6' : '#64748b'} />
                  Koç / Eğitmenim
                </button>
              </div>
            </div>
          )}

          {/* If Register and Student: Exam Type (YKS vs LGS) */}
          {isRegister && role === 'student' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                HAZIRLANDIĞINIZ SINAV
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setExamType('yks')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.7rem', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${examType === 'yks' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                    background: examType === 'yks' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
                    color: examType === 'yks' ? '#6ee7b7' : '#94a3b8', fontWeight: 800, fontSize: '0.85rem'
                  }}
                >
                  <span>🎯 YKS (TYT-AYT)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('lgs')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.7rem', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${examType === 'lgs' ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                    background: examType === 'lgs' ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.03)',
                    color: examType === 'lgs' ? '#fcd34d' : '#94a3b8', fontWeight: 800, fontSize: '0.85rem'
                  }}
                >
                  <span>📘 LGS (MEB)</span>
                </button>
              </div>
            </div>
          )}

          {/* If Register: Name & Phone fields */}
          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  AD SOYAD
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(11, 15, 25, 0.7)',
                      color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  TELEFON NUMARASI
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="05xx xxx xx xx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(11, 15, 25, 0.7)',
                      color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
              E-POSTA ADRESİ
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="ornek@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(11, 15, 25, 0.7)',
                  color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
              ŞİFRE
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(11, 15, 25, 0.7)',
                  color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '1rem', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white',
              fontWeight: 900, fontSize: '1.05rem', marginTop: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              boxShadow: '0 8px 25px rgba(99,102,241,0.5)', transition: 'all 0.2s'
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block'
                }} />
                İşleniyor...
              </span>
            ) : (
              <>
                <span>{isRegister ? 'Ücretsiz Kayıt Ol & Başla' : 'Giriş Yap & Panele Git'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
            <span 
              onClick={() => setIsRegister(!isRegister)}
              style={{ fontSize: '0.85rem', color: '#a5b4fc', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
            >
              {isRegister ? 'Zaten hesabınız var mı? Giriş Yapın' : 'Henüz hesabınız yok mu? Hemen Ücretsiz Kayıt Olun'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>256-bit SSL ve KVKK Güvencesiyle Korunmaktadır</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
