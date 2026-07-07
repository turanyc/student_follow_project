import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Target, Video, MessageSquare, User, LogOut, Leaf,
  PenTool, BarChart2, Calendar, Compass, Heart, Clock, Phone, Home, Timer, Award
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  doc, updateDoc, onSnapshot, collection, query,
  where, orderBy, addDoc, serverTimestamp, increment
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

import TreeWidget from '../components/TreeWidget';
import MotivationBanner from '../components/MotivationBanner';
import DailyMoodModal from '../components/DailyMoodModal';
import PomodoroTimer from '../components/PomodoroTimer';

const NAV_ITEMS = [
  { path: '/student',              icon: Home,         label: 'Anasayfa',          color: '#6366f1' },
  { path: '/student/planner',      icon: Calendar,     label: 'Planlar & Görevler', color: '#8b5cf6' },
  { path: '/student/goals',        icon: Target,       label: 'Hedeflerim',         color: '#ec4899' },
  { path: '/student/osym-target',  icon: Award,        label: 'ÖSYM Hedef Tablom',  color: '#eab308' },
  { path: '/student/gamification', icon: Leaf,         label: 'Öğrenme Ağacım',    color: '#10b981' },
  { path: '/student/trial-exams',  icon: PenTool,      label: 'Deneme Netleri',     color: '#f97316' },
  { path: '/student/analytics',    icon: BarChart2,    label: 'İstatistik & Analiz', color: '#06b6d4' },
  { path: '/student/mood',         icon: Heart,        label: 'Duygu Analizi',      color: '#ef4444' },
  { path: '/student/discovery',    icon: Compass,      label: 'Keşfet & Test',      color: '#f59e0b' },
  { path: '/student/coach-advice', icon: BookOpen,     label: '💡 Koçun Tavsiyesi',  color: '#ec4899' },
];

const LiveSessionCounter = ({ startTime, status }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'studying' && startTime) {
      const startMs = new Date(startTime).getTime();
      const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    } else {
      setElapsed(0);
    }
  }, [startTime, status]);

  const h = Math.floor(elapsed / 3600), m = Math.floor((elapsed % 3600) / 60), s = elapsed % 60;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{
      fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 800,
      color: status === 'studying' ? '#10b981' : '#64748b',
      letterSpacing: '0.05em', margin: '0.5rem 0',
      display: 'flex', alignItems: 'center', gap: '0.4rem'
    }}>
      <span style={{ fontSize: '1.25rem' }}>⏱</span>
      {pad(h)}:{pad(m)}:{pad(s)}
      {status === 'studying' && <span style={{ fontSize: '0.65rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.4rem', borderRadius: 6, fontWeight: 700 }}>CANLI</span>}
    </div>
  );
};

const StudyStatBox = ({ label, value, color, bg, border }) => (
  <div style={{
    background: bg, border: `1px solid ${border}`, borderRadius: 12,
    padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column',
    alignItems: 'flex-start', transition: 'transform 0.2s'
  }}>
    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: color, marginTop: '0.2rem' }}>{value}</span>
  </div>
);

const StudentDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => path === '/student' ? location.pathname === '/student' : location.pathname.startsWith(path);
  const { currentUser, userRole } = useAuth();

  const [userData, setUserData] = useState({});
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [events, setEvents] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);

  const [dailyNote, setDailyNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptNote, setApptNote] = useState('');
  const [requestingAppt, setRequestingAppt] = useState(false);
  const [dashTab, setDashTab] = useState('home');
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const pomodoroRef = useRef();

  useEffect(() => {
    if (!currentUser) return;
    const unsubUser = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });
    const unsubEvents = onSnapshot(collection(db, 'events'), (s) => {
      const evs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      evs.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      setEvents(evs);
    });
    return () => { unsubUser(); unsubEvents(); };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    return onSnapshot(
      query(collection(db, 'users', currentUser.uid, 'studySessions'), where('date', '==', today)),
      (snap) => {
        let total = 0;
        snap.forEach(d => { total += d.data().durationMinutes || 0; });
        setTodayStudyMinutes(total);
      }
    );
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(
      query(collection(db, 'appointmentRequests'), where('studentId', '==', currentUser.uid), orderBy('requestedAt', 'desc')),
      (snap) => setMyAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [currentUser]);

  const toggleStatus = async () => {
    if (!currentUser || !userData) return;
    const isStudying = userData.status === 'studying';
    if (isStudying) {
      if (pomodoroRef.current?.reset) {
        pomodoroRef.current.reset();
        setIsPomodoroActive(false);
      }
      const startTime = userData.studySessionStart ? new Date(userData.studySessionStart) : null;
      const endTime = new Date();
      const durationMinutes = startTime ? (endTime - startTime) / 60000 : 0;
      const today = endTime.toISOString().split('T')[0];
      if (durationMinutes > 0.1) {
        await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
          date: today, durationMinutes: parseFloat(durationMinutes.toFixed(2)),
          startedAt: userData.studySessionStart, endedAt: endTime.toISOString(),
        });
        await updateDoc(doc(db, 'users', currentUser.uid), {
          status: 'not-studying', studySessionStart: null,
          totalStudyHours: increment(durationMinutes / 60),
        });
      } else {
        await updateDoc(doc(db, 'users', currentUser.uid), { status: 'not-studying', studySessionStart: null });
      }
    } else {
      await updateDoc(doc(db, 'users', currentUser.uid), { status: 'studying', studySessionStart: new Date().toISOString() });
    }
  };

  const handlePomodoroEnd = async () => {
    if (!currentUser || !userData) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
        date: today, durationMinutes: 50,
        startedAt: new Date(Date.now() - 50 * 60000).toISOString(),
        endedAt: new Date().toISOString(), type: 'pomodoro'
      });
      await updateDoc(doc(db, 'users', currentUser.uid), {
        totalStudyHours: increment(50 / 60),
        treePoints: increment(1)
      });
      Swal.fire({ icon: 'success', title: '🍅 1 Pomodoro Tamamlandı!', text: 'Harika iş! +50 dakika çalışma süresi!', timer: 3000, showConfirmButton: false });
    } catch (e) { console.error(e); }
  };

  const saveNote = async () => {
    if (!dailyNote.trim() || !currentUser) return;
    setSavingNote(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { lastNote: dailyNote, lastNoteAt: new Date().toISOString() });
      Swal.fire({ icon: 'success', title: 'Not Kaydedildi!', timer: 1500, showConfirmButton: false });
      setDailyNote('');
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Not kaydedilemedi.' });
    } finally { setSavingNote(false); }
  };

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    if (!apptDate || !apptTime || !currentUser) return;
    setRequestingAppt(true);
    try {
      await addDoc(collection(db, 'appointmentRequests'), {
        studentId: currentUser.uid, studentName: userData.name || currentUser.email,
        studentEmail: currentUser.email, requestedDate: apptDate, requestedTime: apptTime,
        message: apptNote, status: 'pending', requestedAt: serverTimestamp(),
      });
      Swal.fire({ icon: 'success', title: 'Randevu Talebi Gönderildi!', text: 'Koçunuz talebi inceleyip size dönüş yapacaktır.', confirmButtonColor: '#6366f1' });
      setAppointmentModal(false); setApptDate(''); setApptTime(''); setApptNote('');
    } catch (e) { Swal.fire({ icon: 'error', title: 'Hata', text: 'Talebiniz iletilemedi.' }); } finally { setRequestingAppt(false); }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Çıkış Yapılsın mı?',
      text: 'Oturumunuz kapatılacaktır.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Evet, Çıkış Yap',
      cancelButtonText: 'İptal'
    });
    if (result.isConfirmed) {
      try {
        if (userData.status === 'studying') {
          await updateDoc(doc(db, 'users', currentUser.uid), { status: 'not-studying', studySessionStart: null });
        }
        await signOut(auth);
        navigate('/login');
      } catch (error) { console.error('Logout error:', error); }
    }
  };

  const handleGuardedNavigation = (action) => {
    if (isPomodoroActive) {
      Swal.fire({
        title: '⚠️ Pomodoro / Çalışma Devam Ediyor!',
        text: 'Sayfadan ayrılmak için önce çalışmayı sonlandır veya mola ver butonuna tıklamalısın.',
        icon: 'warning',
        confirmButtonText: 'Anladım',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }
    action();
  };

  const todayTotalMinutes = todayStudyMinutes + (
    userData.status === 'studying' && userData.studySessionStart
      ? (Date.now() - new Date(userData.studySessionStart).getTime()) / 60000
      : 0
  );
  const totalStudyHours = (userData.totalStudyHours || 0) + (
    userData.status === 'studying' && userData.studySessionStart
      ? (Date.now() - new Date(userData.studySessionStart).getTime()) / 3600000
      : 0
  );
  const acceptedAppt = (myAppointments || []).filter(a => a?.status === 'accepted');
  const pendingAppt = (myAppointments || []).filter(a => a?.status === 'pending').length;

  const HomeContent = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {events && events.length > 0 && events[events.length - 1] && (
        <div style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          color: 'white', padding: '1.1rem 1.5rem', borderRadius: 16,
          marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          boxShadow: '0 8px 20px rgba(6,182,212,0.3)', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              📢
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.25)', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Yeni Koç Duyurusu</span>
              <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>
                {events[events.length - 1].title || ''}
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', opacity: 0.95 }}>
                📅 Tarih: {events[events.length - 1].date ? new Date(events[events.length - 1].date).toLocaleString('tr-TR') : ''}
              </p>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Anlık Durum</h3>
          </div>
          <span className={`status-badge ${userData.status === 'studying' ? 'status-studying' : 'status-not-studying'}`} style={{ fontSize: '0.9rem', padding: '0.45rem 1rem' }}>
            {userData.status === 'studying' ? 'Şu an çalışıyorsun 📚' : 'Şu an çalışmıyorsun 💤'}
          </span>
          <LiveSessionCounter startTime={userData.studySessionStart} status={userData.status} />
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={16} color="white" /></div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Çalışma Süresi</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <StudyStatBox label="Bugün" value={`${Math.floor(todayTotalMinutes / 60)}sa ${Math.round(todayTotalMinutes % 60)}dk`} color="#059669" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.2)" />
            <StudyStatBox label="Toplam" value={`${totalStudyHours.toFixed(1)}sa`} color="#6366f1" bg="rgba(99,102,241,0.08)" border="rgba(99,102,241,0.15)" />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid rgba(249,115,22,0.2)', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Günlük Çalışma Notu</h3>
          </div>
          <textarea className="input-field" rows="3" placeholder="Bugün ne çalıştın?" value={dailyNote} onChange={(e) => setDailyNote(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={saveNote} disabled={savingNote}>{savingNote ? 'Kaydediliyor...' : '💾 Notu Kaydet'}</button>
        </div>

        {/* Events card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} color="white" /></div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Yaklaşan Etkinlikler</h3>
          </div>
          {events.length === 0
            ? <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Planlanmış etkinlik yok.</p>
            : events.map(ev => (
              <div key={ev.id} style={{ padding: '0.65rem 0.875rem', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, marginBottom: '0.4rem' }}>
                <strong style={{ color: '#0891b2', fontSize: '0.88rem' }}>{ev.title}</strong>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{new Date(ev.date).toLocaleString('tr-TR')}</p>
              </div>
            ))}
        </div>

        {/* Coach recommendation */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎯</div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Koçun Tavsiyeleri</h3>
            </div>
            <button
              onClick={() => handleGuardedNavigation(() => navigate('/student/coach-advice'))}
              style={{
                background: 'linear-gradient(135deg,#ec4899,#db2777)', color: 'white',
                border: 'none', borderRadius: 20, padding: '0.45rem 1rem', fontSize: '0.8rem',
                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(236,72,153,0.3)', transition: 'all 0.2s'
              }}
            >
              💡 4 Kalem Yöntemini İncele ➔
            </button>
          </div>
          {userData.coachRecommendation
            ? <div style={{ padding: '0.875rem 1rem', background: 'rgba(236,72,153,0.06)', borderRadius: 10, border: '1px solid rgba(236,72,153,0.15)', borderLeft: '4px solid #ec4899', marginBottom: '0.75rem' }}>
                <p style={{ margin: 0, color: '#be185d', fontWeight: 600, fontSize: '0.9rem' }}>"{userData.coachRecommendation}"</p>
              </div>
            : <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Henüz yeni bir tavsiye notu yok.</p>
          }
          <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: 12, border: '1px dashed #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
               onClick={() => handleGuardedNavigation(() => navigate('/student/coach-advice'))}>
            <span style={{ fontSize: '0.85rem', color: '#831843', fontWeight: 700 }}>✏️ Kitaplar mutlaka 4 Kurşun Kalem'le okunacak!</span>
            <span style={{ fontSize: '0.75rem', background: '#fdf2f8', color: '#db2777', padding: '0.2rem 0.5rem', borderRadius: 8, fontWeight: 800 }}>Özel Yöntem</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── Appointments ──────────────────────────────────────────
  const AppointmentsContent = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>📅 Randevularım</h2>
        <button className="btn btn-primary" onClick={() => setAppointmentModal(true)}>
          <Phone size={16} /> Yeni Randevu Talebi
        </button>
      </div>
      {myAppointments.length === 0
        ? <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}>
            <Phone size={40} style={{ color: '#c4b5fd', marginBottom: '1rem' }} />
            <p style={{ color: '#7c3aed', fontWeight: 600 }}>Henüz görüşme talebinde bulunmadınız.</p>
          </div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myAppointments.map(req => (
              <div key={req.id} className="card" style={{
                borderLeft: `4px solid ${req.status === 'accepted' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b'}`,
                background: req.status === 'accepted' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : req.status === 'rejected' ? 'linear-gradient(135deg,#fef2f2,#fee2e2)' : 'linear-gradient(135deg,#fffbeb,#fef3c7)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem',
                      background: req.status === 'accepted' ? 'rgba(16,185,129,0.15)' : req.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                      color: req.status === 'accepted' ? '#059669' : req.status === 'rejected' ? '#ef4444' : '#d97706'
                    }}>
                      {req.status === 'accepted' ? '✅ Onaylandı' : req.status === 'rejected' ? '❌ Reddedildi' : '⏳ Bekliyor'}
                    </span>
                    {req.message && <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#475569' }}>"{req.message}"</p>}
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                      {req.requestedAt ? new Date(req.requestedAt.toMillis ? req.requestedAt.toMillis() : req.requestedAt).toLocaleString('tr-TR') : '...'}
                    </p>
                  </div>
                  {req.status === 'accepted' && req.appointmentTime && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Randevu Saati</p>
                      <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#059669', fontSize: '1rem' }}>📅 {new Date(req.appointmentTime).toLocaleString('tr-TR')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      }
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <DailyMoodModal />

      {/* Appointment modal */}
      <AnimatePresence>
        {appointmentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="card" style={{ maxWidth: 460, width: '90%', padding: '2rem', background: 'white', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 20px 60px rgba(99,102,241,0.2)' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>📅 Koçla Görüşme Talebi</h2>
              <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.875rem' }}>Koçunuza mesaj bırakın. Talebi onaylayıp size randevu saati belirleyecek.</p>
              <textarea className="input-field" rows={4} placeholder="Görüşmek istediğiniz konu, tercih ettiğiniz gün/saat..."
                value={appointmentMsg} onChange={e => setAppointmentMsg(e.target.value)} style={{ resize: 'vertical', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSendAppointmentRequest} disabled={sendingAppointment || !appointmentMsg.trim()}>
                  {sendingAppointment ? 'Gönderiliyor...' : '📨 Talep Gönder'}
                </button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAppointmentModal(false)}>İptal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="sidebar-logo" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🎓</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>Öğrenci Paneli</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{userData.name || userData.email}</p>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, position: 'relative', zIndex: 1 }}>
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <button key={path} onClick={() => handleGuardedNavigation(() => navigate(path))}
              className={`sidebar-nav-btn ${isActive(path) ? 'active' : ''}`}>
              <Icon size={16} /> {label}
            </button>
          ))}

          <div className="sidebar-divider" />

          <button onClick={() => handleGuardedNavigation(() => navigate('/messages'))} className={`sidebar-nav-btn ${isActive('/messages') ? 'active' : ''}`}>
            <MessageSquare size={16} /> Mesajlar
          </button>
          <button onClick={() => handleGuardedNavigation(() => navigate('/video-call'))} className={`sidebar-nav-btn ${isActive('/video-call') ? 'active' : ''}`}>
            <Video size={16} /> Görüşmeler
          </button>
          <button onClick={() => handleGuardedNavigation(() => navigate('/profile'))} className={`sidebar-nav-btn ${isActive('/profile') ? 'active' : ''}`}>
            <User size={16} /> Profil
          </button>

          {/* Appointment button */}
          <button onClick={() => handleGuardedNavigation(() => setAppointmentModal(true))}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.875rem', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(236,72,153,0.4)', background: 'rgba(236,72,153,0.12)',
              color: '#f9a8d4', fontWeight: 600, fontSize: '0.875rem',
              width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
              position: 'relative'
            }}>
            <Phone size={16} /> Koç ile Görüşme Ayarla
            {pendingAppt > 0 && (
              <span style={{ marginLeft: 'auto', background: '#f59e0b', color: 'white', fontSize: '0.65rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingAppt}</span>
            )}
          </button>
        </nav>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => handleGuardedNavigation(handleLogout)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.875rem', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)',
              color: '#fca5a5', fontWeight: 600, fontSize: '0.875rem',
              width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
            }}>
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="main-content">
        <MotivationBanner />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.1rem' }}>Hoş Geldin, {userData.name || 'Öğrenci'}! 👋</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>Bugün harika şeyler başarmak için harika bir gün.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TreeWidget studyHours={todayTotalMinutes / 60} totalHours={userData.treePoints || userData.totalStudyHours || 0} />
            <button className={`btn ${userData.status === 'studying' ? 'btn-danger' : 'btn-success'}`}
              onClick={toggleStatus} style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', fontSize: '0.95rem' }}>
              {userData.status === 'studying' ? '⏸ Mola Ver' : '🚀 Çalışmaya Başla'}
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        {!children && (
          <>
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', background: 'white', padding: '0.3rem', borderRadius: 12, width: 'fit-content', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              {[
                { id: 'home',         label: '🏠 Anasayfa' },
                { id: 'pomodoro',     label: '🍅 Pomodoro' },
                { id: 'appointments', label: `📅 Randevularım${acceptedAppt.length > 0 ? ` (${acceptedAppt.length})` : ''}` },
              ].map(tab => (
                <button key={tab.id} onClick={() => setDashTab(tab.id)}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: dashTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                    color: dashTab === tab.id ? 'white' : '#64748b',
                    fontWeight: dashTab === tab.id ? 700 : 500, fontSize: '0.85rem',
                    boxShadow: dashTab === tab.id ? '0 4px 10px rgba(99,102,241,0.3)' : 'none',
                    transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif'
                  }}>{tab.label}</button>
              ))}
            </div>

            <div style={{ display: dashTab === 'home' ? 'block' : 'none' }}>
              <HomeContent />
            </div>

            <div style={{ display: dashTab === 'pomodoro' ? 'block' : 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', maxWidth: 900 }}>
                <PomodoroTimer 
                  ref={pomodoroRef}
                  onSessionStart={() => { if (userData.status !== 'studying') toggleStatus(); }} 
                  onSessionEnd={handlePomodoroEnd}
                  onSessionStop={() => { if (userData.status === 'studying') toggleStatus(); }}
                  onRunningChange={(isRunning) => setIsPomodoroActive(isRunning)}
                />
                <div className="card" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <h3 style={{ color: '#7c3aed', marginBottom: '0.875rem' }}>🍅 Pomodoro Tekniği Nedir?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { icon: '📚', text: '50 dakika kesintisiz çalış', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
                      { icon: '☕', text: '10 dakika dinlen & mola ver', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                      { icon: '🔔', text: 'Süre dolunca sesli bildirim', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                      { icon: '🎯', text: 'Her pomodoro = 1 başarı puan', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
                      { icon: '🌱', text: 'Odaklı çalışma ağacını büyütür', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: item.bg, borderRadius: 8, border: `1px solid ${item.color}20` }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: dashTab === 'appointments' ? 'block' : 'none' }}>
              <AppointmentsContent />
            </div>
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default StudentDashboard;
