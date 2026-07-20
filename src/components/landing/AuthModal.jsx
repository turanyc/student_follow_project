import React, { useState, useEffect } from 'react';
import { 
  UserCircle, GraduationCap, Phone, Mail, Lock, User, ArrowRight, X, Sparkles, ShieldCheck 
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        let loggedInRole = 'student';

        const isNurbanu = user?.email && user.email.toLowerCase().trim() === 'nurbanu@gmail.com';
        if (isNurbanu) {
          loggedInRole = 'coach';
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'coach',
            name: 'Nurbanu Koç',
            plan: 'pro_coach'
          }, { merge: true });
        } else {
          try {
            const userDocSnap = await getDoc(doc(db, 'users', user.uid));
            if (userDocSnap.exists() && userDocSnap.data().role) {
              loggedInRole = userDocSnap.data().role;
            }
          } catch (docErr) {
            console.error('Kullanıcı rolü alınamadı:', docErr);
          }
        }

        if (onSuccess) onSuccess(loggedInRole);
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
        confirmButtonColor: '#0284c7'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#ffffff',
        border: '1px solid #e2e8f0', borderRadius: 28,
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.2), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        padding: '2.5rem 2.2rem', position: 'relative', color: '#0f172a',
        maxHeight: '90vh', overflowY: 'auto',
        fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }} className="custom-scrollbar">
        
        {/* Close X Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 38, height: 38, borderRadius: '50%', background: '#f1f5f9',
            border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
        >
          <X size={20} />
        </button>

        {/* Top Tabs */}
        <div style={{
          display: 'flex', background: '#f1f5f9', padding: '0.35rem',
          borderRadius: 16, marginBottom: '1.5rem', border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.92rem', transition: 'all 0.25s',
              background: !isRegister ? '#ffffff' : 'transparent',
              color: !isRegister ? '#0284c7' : '#64748b',
              boxShadow: !isRegister ? '0 4px 12px rgba(15, 23, 42, 0.08)' : 'none'
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
              background: isRegister ? '#ffffff' : 'transparent',
              color: isRegister ? '#0284c7' : '#64748b',
              boxShadow: isRegister ? '0 4px 12px rgba(15, 23, 42, 0.08)' : 'none'
            }}
          >
            Ücretsiz Kayıt Ol
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1.2rem', background: '#ffffff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.05)' }}>
            <img src="/logo-full.png" alt="Menutu Koçluk" style={{ height: 86, width: 'auto', maxWidth: '300px', objectFit: 'contain' }} />
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.85rem', borderRadius: 99, background: '#e0f2fe',
            color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #bae6fd'
          }}>
            <Sparkles size={13} color="#0284c7" /> {isRegister ? '14 GÜN ÜCRETSİZ PRO DENEME' : 'MENUTU KOÇLUK ALTYAPISI'}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
            {isRegister ? 'Aramıza Hoş Geldiniz! 🚀' : 'Tekrar Hoş Geldiniz! 👋'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', maxWidth: '90%', lineHeight: 1.5 }}>
            {isRegister ? 'Hemen profilinizi oluşturun ve koçluk altyapımızla çalışmaya başlayın.' : 'Hesabınıza giriş yaparak koçluk ve takip panelinize ulaşın.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* If Register: Role Selection */}
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                HESAP TÜRÜ SEÇİN
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${role === 'student' ? '#0284c7' : '#cbd5e1'}`,
                    background: role === 'student' ? '#f0f9ff' : '#f8fafc',
                    color: role === 'student' ? '#0369a1' : '#64748b', fontWeight: 800, fontSize: '0.88rem'
                  }}
                >
                  <GraduationCap size={18} color={role === 'student' ? '#0284c7' : '#64748b'} />
                  Öğrenciyim
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coach')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${role === 'coach' ? '#0284c7' : '#cbd5e1'}`,
                    background: role === 'coach' ? '#f0f9ff' : '#f8fafc',
                    color: role === 'coach' ? '#0369a1' : '#64748b', fontWeight: 800, fontSize: '0.88rem'
                  }}
                >
                  <UserCircle size={18} color={role === 'coach' ? '#0284c7' : '#64748b'} />
                  Koç / Eğitmenim
                </button>
              </div>
            </div>
          )}

          {/* If Register and Student: Exam Type (YKS vs LGS) */}
          {isRegister && role === 'student' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                HAZIRLANDIĞINIZ SINAV
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setExamType('yks')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.7rem', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1.5px solid ${examType === 'yks' ? '#0284c7' : '#cbd5e1'}`,
                    background: examType === 'yks' ? '#f0f9ff' : '#f8fafc',
                    color: examType === 'yks' ? '#0369a1' : '#64748b', fontWeight: 800, fontSize: '0.85rem'
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
                    border: `1.5px solid ${examType === 'lgs' ? '#0284c7' : '#cbd5e1'}`,
                    background: examType === 'lgs' ? '#f0f9ff' : '#f8fafc',
                    color: examType === 'lgs' ? '#0369a1' : '#64748b', fontWeight: 800, fontSize: '0.85rem'
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
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
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
                      border: '1px solid #cbd5e1', background: '#f8fafc',
                      color: '#0f172a', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0284c7'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
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
                      border: '1px solid #cbd5e1', background: '#f8fafc',
                      color: '#0f172a', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0284c7'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
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
                  border: '1px solid #cbd5e1', background: '#f8fafc',
                  color: '#0f172a', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#0284c7'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
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
                  border: '1px solid #cbd5e1', background: '#f8fafc',
                  color: '#0f172a', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#0284c7'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '1rem', borderRadius: 14, border: 'none', cursor: loading ? 'default' : 'pointer',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white',
              fontWeight: 900, fontSize: '1.05rem', marginTop: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              boxShadow: '0 8px 25px rgba(2, 132, 199, 0.35)', transition: 'all 0.2s',
              position: 'relative', overflow: 'hidden'
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {loading ? (
                <>
                  <Sparkles size={18} />
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Ücretsiz Kayıt Ol & Başla' : 'Giriş Yap & Panele Git'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
            <span 
              onClick={() => setIsRegister(!isRegister)}
              style={{ fontSize: '0.88rem', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}
            >
              {isRegister ? 'Zaten hesabınız var mı? Giriş Yapın' : 'Henüz hesabınız yok mu? Hemen Ücretsiz Kayıt Olun'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#0284c7" />
            <span>256-bit SSL ve KVKK Güvencesiyle Korunmaktadır</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

