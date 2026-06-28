import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, GraduationCap } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser && userRole) {
      navigate(userRole === 'student' ? '/student' : '/coach');
    }
  }, [currentUser, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // Öğrenci veya Koç kaydı
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        let assignedCoachId = null;

        // Öğrenci kayıt oluyorsa, sistemdeki tek/ana koçu bul ve ata
        if (role === 'student') {
          const q = query(collection(db, 'users'), where('role', '==', 'coach'), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            assignedCoachId = querySnapshot.docs[0].id;
          }
        }
        
        // Veritabanına kaydet
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: role,
          name: email.split('@')[0],
          status: role === 'student' ? 'not-studying' : null,
          coachId: role === 'student' ? assignedCoachId : null,
          createdAt: new Date().toISOString()
        });
        
      } else {
        // Giriş yap
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Firebase Login/Register Error: ", err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: isRegister ? `Kayıt olurken bir hata oluştu: ${err.message}` : `Giriş başarısız: ${err.message}`,
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-color)' }}>Öğrenci Takip</h1>
          <p className="text-muted">{isRegister ? 'Yeni hesap oluşturun' : 'Sisteme giriş yapın'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-posta</label>
            <input 
              type="email" 
              required 
              className="input-field" 
              placeholder="ornek@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Şifre</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={18} />
                Öğrenci
              </button>
              <button
                type="button"
                className={`btn ${role === 'coach' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setRole('coach')}
              >
                <UserCircle size={18} />
                Koç
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'İşleniyor...' : (isRegister ? 'Kayıt Ol' : 'Giriş Yap')}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
              onClick={() => { setIsRegister(!isRegister); }}
            >
              {isRegister ? 'Zaten hesabım var, Giriş Yap' : 'Hesabım yok, Kayıt Ol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
