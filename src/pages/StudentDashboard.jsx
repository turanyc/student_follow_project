import React, { useState, useEffect } from 'react';
import { BookOpen, Target, CheckCircle, Video, MessageSquare, User, LogOut, Leaf, PenTool, BarChart2, Calendar, Compass } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

// New Components
import TreeWidget from '../components/TreeWidget';
import MotivationBanner from '../components/MotivationBanner';
import DailyMoodModal from '../components/DailyMoodModal';

const StudentDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [dailyNote, setDailyNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        
        if (data.coachId) {
          const eq = query(collection(db, 'events'), where('coachId', '==', data.coachId), orderBy('date', 'asc'));
          onSnapshot(eq, (eventSnapshot) => {
            const evts = [];
            eventSnapshot.forEach((eDoc) => {
              evts.push({ id: eDoc.id, ...eDoc.data() });
            });
            setEvents(evts);
          });
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleStatus = async () => {
    if (!currentUser || !userData) return;
    const newStatus = userData.status === 'studying' ? 'not-studying' : 'studying';
    await updateDoc(doc(db, 'users', currentUser.uid), {
      status: newStatus,
      lastActive: new Date().toISOString()
    });
  };

  const saveNote = async () => {
    if (!currentUser || !dailyNote.trim()) return;
    setSavingNote(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        lastNote: dailyNote,
        lastActive: new Date().toISOString()
      });
      setDailyNote('');
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışma notunuz başarıyla kaydedildi.',
        confirmButtonColor: '#6366f1'
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Not kaydedilirken bir hata oluştu.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!userData) return <div style={{padding:'2rem'}}>Yükleniyor...</div>;

  const isActive = (path) => location.pathname === path;

  // If children is provided, it means we are rendering a sub-route (like Planner or Gamification)
  // Otherwise, render the default dashboard content.
  const DashboardContent = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Status Card */}
        <div className="card glass-panel">
          <h3>Anlık Durumun</h3>
          <div style={{ marginTop: '1rem' }}>
            <span className={`status-badge ${userData.status === 'studying' ? 'status-studying' : 'status-not-studying'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {userData.status === 'studying' ? 'Şu an çalışıyorsun' : 'Şu an çalışmıyorsun'}
            </span>
          </div>
          {userData.lastNote && (
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              <strong>Son Notun:</strong> {userData.lastNote}
            </p>
          )}
        </div>

        {/* Daily Notes Card */}
        <div className="card glass-panel" style={{ gridColumn: 'span 2' }}>
          <h3>Günlük Çalışma Notu Ekle</h3>
          <textarea 
            className="input-field" 
            rows="4" 
            placeholder="Bugün hangi konuları çalıştın? Kaç soru çözdün?"
            style={{ marginTop: '1rem', resize: 'vertical' }}
            value={dailyNote}
            onChange={(e) => setDailyNote(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={saveNote} disabled={savingNote}>
            {savingNote ? 'Kaydediliyor...' : 'Notu Kaydet'}
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="card glass-panel">
          <h3>Yaklaşan Etkinlikler</h3>
          {events.length === 0 ? (
            <p className="text-muted" style={{ marginTop: '1rem' }}>Şu an planlanmış bir etkinlik yok.</p>
          ) : (
            events.map(ev => (
              <div key={ev.id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                <strong style={{ color: 'var(--primary-color)' }}>{ev.title}</strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(ev.date).toLocaleString('tr-TR')} - Koç ile</p>
              </div>
            ))
          )}
        </div>

        {/* Goals Card */}
        <div className="card glass-panel">
          <h3>Koçun Tavsiyeleri</h3>
          {userData.coachRecommendation ? (
            <div style={{ padding: '1.25rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: 'white', boxShadow: 'var(--shadow-md)' }}>
              <p style={{ margin: 0, fontWeight: 500, color: 'white' }}>"{userData.coachRecommendation}"</p>
            </div>
          ) : (
            <p className="text-muted">Şu an için yeni bir tavsiye yok.</p>
          )}
        </div>

      </div>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <DailyMoodModal />
      
      {/* Sidebar */}
      <div className="glass-panel" style={{ width: '280px', borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Öğrenci Paneli
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <button className={`btn ${isActive('/student') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student')}><BookOpen size={18} /> Anasayfa</button>
          <button className={`btn ${isActive('/student/planner') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student/planner')}><Calendar size={18} /> Planlar & Görevler</button>
          <button className={`btn ${isActive('/student/gamification') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student/gamification')}><Leaf size={18} /> Öğrenme Ağacım</button>
          <button className={`btn ${isActive('/student/trial-exams') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student/trial-exams')}><PenTool size={18} /> Deneme Netleri</button>
          <button className={`btn ${isActive('/student/analytics') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student/analytics')}><BarChart2 size={18} /> İstatistik & Analiz</button>
          <button className={`btn ${isActive('/student/discovery') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/student/discovery')}><Compass size={18} /> Keşfet & Test</button>
          
          <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)' }}></div>
          
          <button className={`btn ${isActive('/messages') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/messages')}><MessageSquare size={18} /> Mesajlar</button>
          <button className={`btn ${isActive('/video-call') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/video-call')}><Video size={18} /> Görüşmeler</button>
          <button className={`btn ${isActive('/profile') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/profile')}><User size={18} /> Profil</button>
        </nav>
        
        <button className="btn btn-danger" style={{ justifyContent: 'flex-start', marginTop: '2rem' }} onClick={handleLogout}><LogOut size={18} /> Çıkış Yap</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <MotivationBanner />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Hoş Geldin, {userData.name || 'Öğrenci'}! 👋</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Bugün harika şeyler başarmak için harika bir gün.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <TreeWidget studyHours={userData.totalStudyHours || Math.floor(Math.random() * 30)} />
            <button 
              className={`btn ${userData.status === 'studying' ? 'btn-danger' : 'btn-success'}`}
              onClick={toggleStatus}
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '999px' }}
            >
              {userData.status === 'studying' ? 'Mola Ver' : '🚀 Çalışmaya Başla'}
            </button>
          </div>
        </div>

        {children || <DashboardContent />}
      </div>
    </div>
  );
};

export default StudentDashboard;
