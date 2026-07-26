import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Target, Video, MessageSquare, User, LogOut, Leaf,
  PenTool, BarChart2, Calendar, Compass, Heart, Clock, Phone, Home, Timer, Award, PlusCircle, Flame, Sparkles, Trophy, Menu, X, CheckCircle, XCircle, Zap, Brain, Rocket, Pause, Bell, Trash2, GraduationCap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  doc, setDoc, updateDoc, onSnapshot, collection, query,
  where, orderBy, addDoc, serverTimestamp, increment, limit, deleteDoc
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

import TreeWidget from '../components/TreeWidget';
import MotivationBanner from '../components/MotivationBanner';
import DailyMoodModal from '../components/DailyMoodModal';
import PomodoroTimer from '../components/PomodoroTimer';
import StudyHeatmapCalendar from '../components/StudyHeatmapCalendar';
import LiveLeaderboard from './LiveLeaderboard';
import ProfileEditModal from '../components/ProfileEditModal';

const AtesIcon = () => (
  <img src="/leaderboard/ates.png" alt="Ateş" style={{ width: 20, height: 20, objectFit: 'contain', verticalAlign: 'middle' }} />
);

const NAV_ITEMS = [
  { path: '/student/smart-planner',icon: Brain,       label: 'Akıllı Planlayıcı ⚡', color: '#a855f7' },
  { path: '/student/study-map',    icon: Flame,        label: 'Anlık Çalışma Haritan', color: '#38bdf8' },
  { path: '/student/messages',     icon: MessageSquare,label: 'Mesajlarım 💬',        color: '#8b5cf6' },
  { path: '/student/leaderboard',  icon: AtesIcon,     label: 'Canlı Liderlik & Yarışma', color: '#f59e0b' },
  { path: '/student/planner',      icon: Calendar,     label: 'Planlar & Görevler', color: '#6366f1' },
  { path: '/student/goals',        icon: Target,       label: 'Hedeflerim',         color: '#3b82f6' },
  { path: '/student/osym-target',  icon: Award,        label: 'ÖSYM Hedef Tablom',  color: '#6366f1' },
  { path: '/student/uni-search',   icon: GraduationCap,label: 'Üniversite Robotu', color: '#818cf8' },
  { path: '/student/gamification', icon: Leaf,         label: 'Öğrenme Ağacım',    color: '#10b981' },
  { path: '/student/trial-exams',  icon: PenTool,      label: 'Deneme Netleri',     color: '#38bdf8' },
  { path: '/student/reports',      icon: BarChart2,    label: 'Raporlarım',         color: '#f97316' },
  { path: '/student/osym-curriculum', icon: BookOpen,  label: 'ÖSYM Müfredatı',     color: '#3b82f6' },
  { path: '/student/mood',         icon: Heart,        label: 'Duygu Analizi',      color: '#f43f5e' },
  { path: '/student/discovery',    icon: Compass,      label: 'Keşfet & Test',      color: '#38bdf8' },
  { path: '/student/coach-advice', icon: BookOpen,     label: 'Koçun Tavsiyeleri',  color: '#6366f1' },
];

export const getSafeTimeMs = (val) => {
  if (!val) return Date.now();
  if (typeof val === 'number') return val;
  if (typeof val?.toMillis === 'function') return val.toMillis();
  if (val?.seconds) return val.seconds * 1000;
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
};

const LiveSessionCounter = ({ startTime, status }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'studying' && startTime) {
      const startMs = getSafeTimeMs(startTime);
      const tick = () => {
        const diff = Math.floor((Date.now() - startMs) / 1000);
        setElapsed(diff > 0 ? diff : 0);
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    } else {
      setElapsed(0);
    }
  }, [startTime, status]);

  const h = Math.floor(elapsed / 3600), m = Math.floor((elapsed % 3600) / 60), s = elapsed % 60;
  const pad = (n) => String(isNaN(n) || n < 0 ? 0 : n).padStart(2, '0');

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
  const [totalSessionHours, setTotalSessionHours] = useState(0);
  const [events, setEvents] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);

  const [dailyNote, setDailyNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptNote, setApptNote] = useState('');
  const [requestingAppt, setRequestingAppt] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [dashTab, setDashTab] = useState(location.state?.dashTab || 'home');
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [activeStudyMethod, setActiveStudyMethod] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const pomodoroRef = useRef();

  // Lock body scroll when mobile drawer is open (iOS/Android fix)
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubUser = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });
    const unsubSessions = onSnapshot(collection(db, 'users', currentUser.uid, 'studySessions'), (snap) => {
      let totalMins = 0;
      snap.forEach(d => { totalMins += parseFloat(d.data().durationMinutes || 0); });
      setTotalSessionHours(Math.floor(totalMins / 60));
    });
    const unsubEvents = onSnapshot(query(collection(db, 'events'), limit(30)), (s) => {
      const evs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      evs.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      setEvents(evs);
    });
    return () => { unsubUser(); unsubSessions(); unsubEvents(); };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    let listA = [];
    let listB = [];

    const updateAllNotifs = () => {
      const mergedMap = new Map();
      [...listA, ...listB].forEach(n => mergedMap.set(n.id, n));
      const sorted = Array.from(mergedMap.values()).sort((a, b) => (b.time || 0) - (a.time || 0));
      setNotifications(sorted);
    };

    // 1. Personal user notifications subcollection listener
    const unsub1 = onSnapshot(query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('createdAt', 'desc'), limit(30)), (snap) => {
      listA = snap.docs.map(d => {
        const data = d.data();
        const t = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now());
        return { id: d.id, message: data.message || data.title, time: t, ...data };
      });
      updateAllNotifs();
    });

    // 2. Global notifications listener filtered for this user
    const unsub2 = onSnapshot(query(collection(db, 'notifications'), where('userId', '==', currentUser.uid), limit(30)), (snap) => {
      listB = snap.docs.map(d => {
        const data = d.data();
        const t = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now());
        return { id: d.id, message: data.message, time: t, ...data };
      });
      updateAllNotifs();
    });

    return () => { unsub1(); unsub2(); };
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
      query(collection(db, 'appointmentRequests'), where('studentId', '==', currentUser.uid), orderBy('requestedAt', 'desc'), limit(20)),
      (snap) => setMyAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (error) => {
        console.error("Firestore Randevu Hatası (Büyük ihtimalle Index eksik):", error);
        setMyAppointments([]);
      }
    );
  }, [currentUser]);

  useEffect(() => {
    if (location.pathname === '/student') {
      if (location.state && location.state.dashTab) {
        setDashTab(location.state.dashTab);
      } else {
        setDashTab('pomodoro');
      }
    }
  }, [location.pathname, location.state]);

  const toggleStatus = async () => {
    if (!currentUser || !userData) return;
    try {
      const isStudying = userData.status === 'studying';
      if (isStudying) {
        let wasPomodoroActive = false;
        if (pomodoroRef.current?.reset && isPomodoroActive) {
          try { pomodoroRef.current.reset(); } catch (e) { console.error('pomodoro reset error:', e); }
          setIsPomodoroActive(false);
          wasPomodoroActive = true;
        }
        const startMs = userData.studySessionStart ? getSafeTimeMs(userData.studySessionStart) : null;
        const endMs = Date.now();
        const durationMinutes = startMs ? Math.max(0, (endMs - startMs) / 60000) : 0;
        const today = new Date(endMs).toISOString().split('T')[0];
        
        // If pomodoro was active, its time was already recorded via reset(). 
        // Also, if duration is over 12 hours (720 mins), assume user left it open and ignore it.
        if (durationMinutes > 0.1 && !wasPomodoroActive && durationMinutes <= 720) {
          const validMins = isNaN(durationMinutes) ? 0 : parseFloat(durationMinutes.toFixed(2));
          await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
            date: today, durationMinutes: validMins,
            startedAt: userData.studySessionStart || new Date(endMs - validMins * 60000).toISOString(),
            endedAt: new Date(endMs).toISOString(),
            completed: false, note: 'Manuel Çalışma'
          });
          await updateDoc(doc(db, 'users', currentUser.uid), {
            status: 'not-studying', studySessionStart: null,
            totalStudyHours: increment(validMins / 60),
          });
        } else {
          await updateDoc(doc(db, 'users', currentUser.uid), { status: 'not-studying', studySessionStart: null });
        }
      } else {
        await updateDoc(doc(db, 'users', currentUser.uid), { status: 'studying', studySessionStart: new Date().toISOString() });
      }
    } catch (error) {
      console.error('toggleStatus error:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Durum Bilgisi',
        text: 'Bağlantı veya tarayıcı kısıtlaması nedeniyle işlem gecikti, ancak durumunuz işleniyor.',
        timer: 2500,
        showConfirmButton: false
      });
    }
  };

  const handlePomodoroEnd = async (method, sessionData = { completed: true, actualMinutes: null }) => {
    if (!currentUser || !userData) return;
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = sessionData.completed !== false;
    const methodMinutes = isCompleted ? (method?.workMinutes || 25) : Math.round(sessionData.actualMinutes || 1);

    try {
      if (isCompleted) {
        setUserData(prev => ({
          ...prev,
          totalStudyHours: (prev.totalStudyHours || 0) + (methodMinutes / 60),
          treePoints: (prev.treePoints || prev.totalStudyHours || 0) + 1
        }));
        setTotalSessionHours(prev => (prev || 0) + (methodMinutes / 60));
        window.dispatchEvent(new CustomEvent('treePointAdded', { detail: { added: 1 } }));

        await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
          date: today, durationMinutes: methodMinutes,
          startedAt: new Date(Date.now() - methodMinutes * 60000).toISOString(),
          endedAt: new Date().toISOString(), type: method?.id || 'pomodoro',
          completed: true
        });
        await updateDoc(doc(db, 'users', currentUser.uid), {
          totalStudyHours: increment(methodMinutes / 60),
          treePoints: increment(1),
          status: 'not-studying',
          studySessionStart: null
        });
        Swal.fire({ icon: 'success', title: `${method?.emoji || '🍅'} 1 Seans Tamamlandı!`, text: `Harika iş! +${methodMinutes} dakika çalışma süresi!`, timer: 3000, showConfirmButton: false });
      } else {
        // Kısmi (tamamlanmamış) çalışma kaydı
        setUserData(prev => ({
          ...prev,
          totalStudyHours: (prev.totalStudyHours || 0) + (methodMinutes / 60)
        }));
        setTotalSessionHours(prev => (prev || 0) + (methodMinutes / 60));

        await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
          date: today, durationMinutes: methodMinutes,
          startedAt: new Date(Date.now() - methodMinutes * 60000).toISOString(),
          endedAt: new Date().toISOString(), type: method?.id || 'pomodoro',
          completed: false, note: 'Tamamlanmadı (Erken Sonlandırıldı)'
        });
        await updateDoc(doc(db, 'users', currentUser.uid), {
          totalStudyHours: increment(methodMinutes / 60),
          status: 'not-studying',
          studySessionStart: null
        });
        Swal.fire({ icon: 'info', title: '⏱️ Kısmi Çalışma Kaydedildi', text: `Seans tamamlanmadı, ancak çalıştığın ${methodMinutes} dakika bugünkü sürene eklendi!`, timer: 3000, showConfirmButton: false });
      }
    } catch (e) { console.error(e); }
  };

  const handleAddHourTest = async () => {
    if (!currentUser) return;
    try {
      setUserData(prev => ({
        ...prev,
        totalStudyHours: (prev.totalStudyHours || 0) + 1,
        treePoints: (prev.treePoints || prev.totalStudyHours || 0) + 1
      }));
      setTotalSessionHours(prev => (prev || 0) + 1);
      window.dispatchEvent(new CustomEvent('treePointAdded', { detail: { added: 1 } }));

      const userRef = doc(db, 'users', currentUser.uid);
      const todayStr = new Date().toISOString().split('T')[0];

      await setDoc(userRef, {
        totalStudyHours: increment(1),
        treePoints: increment(1)
      }, { merge: true });

      await addDoc(collection(db, 'users', currentUser.uid, 'studySessions'), {
        date: todayStr,
        durationMinutes: 60,
        subject: 'Test / Simülasyon Saati',
        topic: 'Ağaç Evrim Testi (+1 Saat)',
        startedAt: new Date().toISOString(),
        type: 'test'
      });

      await addDoc(collection(db, 'notifications'), {
        userId: currentUser.uid,
        userName: userData.name || 'Öğrenci',
        subject: 'Test / Simülasyon Saati',
        message: '1 saatlik simülasyon tamamlandı, 1 puan öğrenme ağacına ve istatistiklerine yansıdı.',
        isRead: false,
        readByCoach: false,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Tebrikler! +1 Puan & +1 Saat Eklendi',
        text: 'Öğrenme ağacın ve çalışma takvimin anında evrimleşti!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Test saati eklenirken hata:', err);
    }
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
      ? Math.max(0, (Date.now() - getSafeTimeMs(userData.studySessionStart)) / 60000)
      : 0
  );
  const totalStudyHours = (userData.totalStudyHours || 0) + (
    userData.status === 'studying' && userData.studySessionStart
      ? Math.max(0, (Date.now() - getSafeTimeMs(userData.studySessionStart)) / 3600000)
      : 0
  );
  const acceptedAppt = (myAppointments || []).filter(a => a?.status === 'accepted');
  const pendingAppt = (myAppointments || []).filter(a => a?.status === 'pending').length;



  // ── Appointments ──────────────────────────────────────────
  const AppointmentsContent = () => {
    const handleDeleteAppointment = async (id) => {
      try {
        await deleteDoc(doc(db, 'appointmentRequests', id));
      } catch (e) {
        console.error(e);
        Swal.fire('Hata', 'Randevu silinirken bir hata oluştu.', 'error');
      }
    };

    const cleanExpiredAppointments = async () => {
      const now = new Date();
      const toDelete = myAppointments.filter(req => {
        if (req.status === 'accepted' && req.appointmentTime) {
          return new Date(req.appointmentTime) < now;
        }
        if (req.requestedAt) {
          const reqDate = new Date(req.requestedAt.toMillis ? req.requestedAt.toMillis() : req.requestedAt);
          return (now - reqDate) / (1000 * 60 * 60 * 24) > 2;
        }
        return false;
      });

      if (toDelete.length === 0) {
        Swal.fire('Bilgi', 'Silinecek süresi geçmiş randevu bulunamadı.', 'info');
        return;
      }

      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: `${toDelete.length} adet süresi geçmiş randevu talebi silinecek.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, Temizle',
        cancelButtonText: 'İptal',
        confirmButtonColor: '#ef4444'
      });

      if (result.isConfirmed) {
        try {
          await Promise.all(toDelete.map(req => deleteDoc(doc(db, 'appointmentRequests', req.id))));
          Swal.fire('Başarılı', 'Süresi geçmiş randevular temizlendi.', 'success');
        } catch (e) {
          console.error(e);
          Swal.fire('Hata', 'Temizleme işlemi sırasında hata oluştu.', 'error');
        }
      }
    };

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>📅 Randevularım</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {myAppointments.length > 0 && (
            <button className="btn btn-secondary" onClick={cleanExpiredAppointments} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0', background: 'white', color: '#64748b' }}>
              <Trash2 size={15} /> Temizle
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setAppointmentModal(true)}>
            <Phone size={16} /> Yeni Talep
          </button>
        </div>
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
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem',
                      background: req.status === 'accepted' ? 'rgba(16,185,129,0.15)' : req.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                      color: req.status === 'accepted' ? '#059669' : req.status === 'rejected' ? '#ef4444' : '#d97706'
                    }}>
                      {req.status === 'accepted' ? <CheckCircle size={13} /> : req.status === 'rejected' ? <XCircle size={13} /> : <Clock size={13} />}
                      {req.status === 'accepted' ? 'Onaylandı' : req.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                    </span>
                    {req.message && <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#475569' }}>"{req.message}"</p>}
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                      {req.requestedAt ? new Date(req.requestedAt.toMillis ? req.requestedAt.toMillis() : req.requestedAt).toLocaleString('tr-TR') : '...'}
                    </p>
                  </div>
                  {req.status === 'accepted' && req.appointmentTime && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Randevu Saati</p>
                      <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#059669', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={15} /> {new Date(req.appointmentTime).toLocaleString('tr-TR')}</p>
                    </div>
                  )}
                  <button onClick={() => handleDeleteAppointment(req.id)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem' }} title="Sil" onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
      }
    </motion.div>
    );
  };

  return (
    <div className="app-container">
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
              <input className="input-field" type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} style={{ marginBottom: '0.5rem' }} />
              <input className="input-field" type="time" value={apptTime} onChange={e => setApptTime(e.target.value)} style={{ marginBottom: '0.5rem' }} />
              <textarea className="input-field" rows={3} placeholder="Görüşmek istediğiniz konu..."
                value={apptNote} onChange={e => setApptNote(e.target.value)} style={{ resize: 'vertical', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRequestAppointment} disabled={requestingAppt || !apptDate || !apptTime}>
                  {requestingAppt ? 'Gönderiliyor...' : '📨 Talep Gönder'}
                </button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAppointmentModal(false)}>İptal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Header Topbar ── */}
      <div className="mobile-header" style={{ background: '#ffffff', borderBottom: '1px solid var(--sidebar-border)', padding: '0.4rem 1rem' }}>
        <div onClick={() => handleGuardedNavigation(() => { navigate('/student'); setDashTab('home'); })} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.2rem 0' }} title="Ana Sayfaya Dön">
          <img src="/logo-full.png" alt="Menutu Koçluk" style={{ height: 62, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', color: '#0f172a' }}>
              <Bell size={24} />
              {notifications.length > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>}
            </button>
            {isNotifOpen && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">Bildirimler</div>
                {notifications.length === 0 ? <div style={{ padding: '2rem 1rem', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>Yeni bildirim yok.</div> : notifications.map(n => (
                  <div key={n.id} className="notification-item">
                    <p>{n.message}</p>
                    <span>{new Date(n.createdAt?.toMillis ? n.createdAt.toMillis() : (n.createdAt || Date.now())).toLocaleString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)} aria-label="Menüyü Aç" style={{ color: '#0f172a' }}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer Overlay (Visible when hamburger clicked) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            key="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="mobile-drawer-content"
              style={{ background: '#ffffff', color: '#0f172a' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--sidebar-border)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => { navigate('/student'); setDashTab('home'); }); }} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: 12 }}>
                    <img src="/logo-full.png" alt="Menutu Koçluk" style={{ height: 64, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'rgba(30,119,150,0.1)', border: 'none', color: '#0f172a', padding: '0.4rem', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: 'rgba(30,119,150,0.06)', padding: '0.65rem 0.85rem', borderRadius: 14 }} onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => navigate('/student/profile')); }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: userData.photoURL ? 'transparent' : '#1e7796', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', overflow: 'hidden', border: '2px solid #38bdf8', flexShrink: 0 }}>
                    {userData.photoURL ? <img src={userData.photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (userData.avatarEmoji || '🎓')}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userData.name || userData.displayName || userData.email}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#6366f1', fontWeight: 600 }}>Profil Sayfam ➔</p>
                  </div>
                </div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
                  <button key={path} onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => { navigate(path); if (path === '/student') setDashTab('home'); }); }}
                    className={`sidebar-nav-btn ${isActive(path) ? 'active' : ''}`}>
                    <Icon size={16} /> {label}
                  </button>
                ))}

                <div className="sidebar-divider" />

                <button onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => navigate('/messages')); }} className={`sidebar-nav-btn ${isActive('/messages') ? 'active' : ''}`}>
                  <MessageSquare size={16} /> Mesajlar
                </button>
                <button onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => navigate('/video-call')); }} className={`sidebar-nav-btn ${isActive('/video-call') ? 'active' : ''}`}>
                  <Video size={16} /> Görüşmeler
                </button>
                <button onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => navigate('/profile')); }} className={`sidebar-nav-btn ${isActive('/profile') ? 'active' : ''}`}>
                  <User size={16} /> Profil
                </button>
                <button onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(() => setAppointmentModal(true)); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.65rem 0.875rem', borderRadius: 10, cursor: 'pointer',
                    border: '1px solid rgba(30, 119, 150, 0.3)', background: 'rgba(30, 119, 150, 0.08)',
                    color: '#1e7796', fontWeight: 700, fontSize: '0.9rem',
                    width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
                    marginTop: '0.2rem'
                  }}>
                  <Phone size={16} /> Koç ile Görüşme Ayarla
                  {pendingAppt > 0 && (
                    <span style={{ marginLeft: 'auto', background: '#ffd48d', color: '#0f172a', fontSize: '0.65rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingAppt}</span>
                  )}
                </button>

                {/* Hemen bitişik Çıkış Yap / Oturum Sonlandır Butonu */}
                <div style={{ marginTop: '0.4rem', borderTop: '1px dashed var(--sidebar-border)', paddingTop: '0.4rem' }}>
                  {(!userData || userData.status !== 'studying') && !isPomodoroActive && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: 8, marginBottom: '0.35rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <span>Çalışma yöntemi aktif değil. Dilerseniz oturumu güvenle sonlandırabilirsiniz.</span>
                    </div>
                  )}
                  <button onClick={() => { setIsMobileMenuOpen(false); handleGuardedNavigation(handleLogout); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.65rem',
                      padding: '0.65rem 0.875rem', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid rgba(239, 68, 68, 0.35)', background: (!userData || userData.status !== 'studying') && !isPomodoroActive ? '#fef2f2' : 'rgba(239, 68, 68, 0.06)',
                      color: '#dc2626', fontWeight: 700, fontSize: '0.9rem',
                      width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.2s'
                    }}>
                    <LogOut size={16} /> {(!userData || userData.status !== 'studying') && !isPomodoroActive ? 'Oturumu Sonlandır (Çıkış Yap)' : 'Çıkış Yap'}
                  </button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div className="sidebar">
        {/* Brand Logo in Sidebar */}
        <div style={{ padding: '0.8rem 0.5rem 1.4rem', borderBottom: '1px solid var(--sidebar-border)', marginBottom: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div onClick={() => handleGuardedNavigation(() => { navigate('/student'); setDashTab('home'); })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', padding: '0.5rem 0.8rem', borderRadius: 16 }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} title="Ana Sayfaya Dön">
            <img src="/logo-full.png" alt="Menutu Koçluk" style={{ height: 86, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          </div>
        </div>

        <div className="sidebar-logo" style={{ position: 'relative', zIndex: 1, paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.25rem', cursor: 'pointer', flex: 1 }} onClick={() => handleGuardedNavigation(() => navigate('/student/profile'))} title="Profilinizi Düzenlemek İçin Tıklayın">
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: userData.photoURL ? 'transparent' : '#1e7796', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', boxShadow: '0 4px 14px rgba(30, 119, 150, 0.3)', overflow: 'hidden', border: '2px solid #38bdf8', flexShrink: 0 }}>
              {userData.photoURL ? <img src={userData.photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (userData.avatarEmoji || '🎓')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userData.name || userData.displayName || userData.email}</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', color: '#64748b' }}>
              <Bell size={20} />
              {notifications.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '1.5px solid white' }}></span>}
            </button>
            {isNotifOpen && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  Bildirimler
                  <button onClick={() => setIsNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '0.2rem' }}><X size={18} /></button>
                </div>
                {notifications.length === 0 ? <div style={{ padding: '2rem 1rem', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>Yeni bildirim yok.</div> : notifications.map(n => (
                  <div key={n.id} className="notification-item">
                    <p>{n.message}</p>
                    <span>{new Date(n.createdAt?.toMillis ? n.createdAt.toMillis() : (n.createdAt || Date.now())).toLocaleString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative', zIndex: 1 }}>
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <button key={path} onClick={() => handleGuardedNavigation(() => { navigate(path); if (path === '/student') setDashTab('home'); })}
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
              padding: '0.65rem 0.875rem', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(30, 119, 150, 0.3)', background: 'rgba(30, 119, 150, 0.08)',
              color: '#1e7796', fontWeight: 700, fontSize: '0.9rem',
              width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
              position: 'relative', marginTop: '0.2rem'
            }}>
            <Phone size={16} /> Koç ile Görüşme Ayarla
            {pendingAppt > 0 && (
              <span style={{ marginLeft: 'auto', background: '#ffd48d', color: '#0f172a', fontSize: '0.65rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingAppt}</span>
            )}
          </button>

          {/* Hemen bitişik Çıkış Yap / Oturum Sonlandır Butonu */}
          <div style={{ marginTop: '0.4rem', borderTop: '1px dashed var(--sidebar-border)', paddingTop: '0.4rem' }}>
            {(!userData || userData.status !== 'studying') && !isPomodoroActive && (
              <div style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: 8, marginBottom: '0.35rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span>Çalışma yöntemi aktif değil. Dilerseniz oturumu güvenle sonlandırabilirsiniz.</span>
              </div>
            )}
            <button onClick={() => handleGuardedNavigation(handleLogout)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 0.875rem', borderRadius: 10, cursor: 'pointer',
                border: '1px solid rgba(239, 68, 68, 0.35)', background: (!userData || userData.status !== 'studying') && !isPomodoroActive ? '#fef2f2' : 'rgba(239, 68, 68, 0.06)',
                color: '#dc2626', fontWeight: 700, fontSize: '0.9rem',
                width: '100%', justifyContent: 'flex-start', fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s'
              }}>
              <LogOut size={16} /> {(!userData || userData.status !== 'studying') && !isPomodoroActive ? 'Oturumu Sonlandır (Çıkış Yap)' : 'Çıkış Yap'}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main ── */}
      <div className="main-content">
        <MotivationBanner />

        {/* Header - Premium Welcome Section */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          padding: '1.4rem 1.6rem', borderRadius: 20, border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' }}>
            {/* Clickable Profile Avatar right on Home Page */}
            <div
              onClick={() => handleGuardedNavigation(() => navigate('/profile'))}
              style={{
                width: 74, height: 74, borderRadius: '50%',
                background: userData.photoURL ? '#ffffff' : 'linear-gradient(135deg, #6366f1, #0d9488)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 900, cursor: 'pointer',
                border: '3.5px solid #ffffff', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.28)',
                position: 'relative', overflow: 'hidden', flexShrink: 0,
                transition: 'all 0.25s'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.06) rotate(3deg)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(99, 102, 241, 0.38)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.28)'; }}
              title="Profil Fotoğrafını veya Bilgilerini Düzenlemek için Tıkla"
            >
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{(userData.name || userData.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.8rem', borderRadius: 99, background: 'rgba(30, 119, 150, 0.12)', border: '1px solid rgba(30, 119, 150, 0.25)', width: 'fit-content' }}>
                <Sparkles size={13} color="#1e7796" />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e7796', letterSpacing: '0.04em' }}>MENUTU KOÇLUK PRO ÖĞRENCİ PORTALI</span>
              </div>
              <h1 style={{ 
                margin: 0, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a',
                display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', lineHeight: 1.15
              }}>
                <span style={{ color: '#1e7796', fontWeight: 900 }}>
                  Hoş Geldin,
                </span>
                <span style={{
                  background: 'linear-gradient(135deg, #1e7796 0%, #d97706 50%, #ffd48d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900,
                  filter: 'drop-shadow(0 2px 6px rgba(30, 119, 150, 0.18))'
                }}>
                  {userData.name || 'Mustafa Turan Yılancıoğlu'}!
                </span>
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, borderRadius: '6px', background: 'rgba(30, 119, 150, 0.15)', color: '#1e7796'
                }}>
                  <Award size={15} strokeWidth={2.5} />
                </span>
                <span>Bugün hedeflerini aşmak ve efsanevi ağacını yeşertmek için harika bir gün.</span>
              </p>
            </div>
          </div>
          
          {/* Bugün Çalışılan Süre */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0.8rem 1.4rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', minWidth: '150px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              Bugün Çalışılan
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Timer size={22} color="#10b981" />
              <span style={{ fontSize: '1.45rem', fontWeight: 900 }}>
                {Math.floor((todayTotalMinutes || 0) / 60)}s {Math.floor((todayTotalMinutes || 0) % 60)}dk
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <TreeWidget studyHours={todayTotalMinutes / 60} totalHours={Math.max(Number(userData.treePoints || 0), Number(userData.totalStudyHours || 0), Number(totalSessionHours || 0))} />
            <button
              onClick={() => {
                if (userData.status === 'studying') {
                  toggleStatus();
                } else {
                  if (location.pathname !== '/student') {
                    navigate('/student', { state: { dashTab: 'pomodoro' } });
                  } else {
                    setDashTab('pomodoro');
                  }
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                color: 'white',
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: userData.status === 'studying'
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                boxShadow: userData.status === 'studying'
                  ? '0 0 28px rgba(239, 68, 68, 0.45), 0 6px 16px rgba(220, 38, 38, 0.35)'
                  : '0 0 28px rgba(16, 185, 129, 0.45), 0 6px 16px rgba(5, 150, 105, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = userData.status === 'studying'
                  ? '0 0 36px rgba(239, 68, 68, 0.65), 0 10px 24px rgba(220, 38, 38, 0.45)'
                  : '0 0 36px rgba(16, 185, 129, 0.65), 0 10px 24px rgba(5, 150, 105, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = userData.status === 'studying'
                  ? '0 0 28px rgba(239, 68, 68, 0.45), 0 6px 16px rgba(220, 38, 38, 0.35)'
                  : '0 0 28px rgba(16, 185, 129, 0.45), 0 6px 16px rgba(5, 150, 105, 0.35)';
              }}
              title={userData.status === 'studying' ? 'Çalışmayı mola vererek duraklat' : 'Pür dikkat pomodoro seansına başla!'}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.22)',
                boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.35)',
              }}>
                {userData.status === 'studying' ? <Pause size={16} color="white" /> : <Rocket size={16} color="white" />}
              </span>
              <span>{userData.status === 'studying' ? 'Mola Ver & Duraklat' : 'Çalışmaya Başla'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        {!children && (
          <>
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', background: 'white', padding: '0.3rem', borderRadius: 12, width: 'fit-content', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
              {[
                { id: 'leaderboard',  label: 'Canlı Liderlik Arenası', icon: Trophy },
                { id: 'pomodoro',     label: 'Çalışma Yöntemleri', icon: Timer },
                { id: 'appointments', label: `Randevularım${acceptedAppt.length > 0 ? ` (${acceptedAppt.length})` : ''}`, icon: Calendar },
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setDashTab(tab.id)}
                    style={{
                      padding: '0.5rem 1.1rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: dashTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                      color: dashTab === tab.id ? 'white' : '#64748b',
                      fontWeight: dashTab === tab.id ? 700 : 500, fontSize: '0.85rem',
                      boxShadow: dashTab === tab.id ? '0 4px 10px rgba(99,102,241,0.3)' : 'none',
                      transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                    <IconComponent size={15} /> {tab.label}
                  </button>
                );
              })}
            </div>



            <div style={{ display: dashTab === 'leaderboard' ? 'block' : 'none' }}>
              <LiveLeaderboard />
            </div>

            <div style={{ display: dashTab === 'pomodoro' ? 'block' : 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: activeStudyMethod ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', width: '100%' }}>
                <PomodoroTimer 
                  ref={pomodoroRef}
                  onSessionStart={() => { if (userData.status !== 'studying') toggleStatus(); }} 
                  onSessionEnd={handlePomodoroEnd}
                  onSessionStop={() => { if (userData.status === 'studying') toggleStatus(); }}
                  onRunningChange={(isRunning) => setIsPomodoroActive(isRunning)}
                  onMethodChange={(method) => setActiveStudyMethod(method)}
                  todayStudyMinutes={todayStudyMinutes}
                  onNavigateGuide={(methodId) => handleGuardedNavigation(() => navigate(`/student/study-methods?method=${methodId}`))}
                />
                {!activeStudyMethod && (
                  <div className="card" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <h3 style={{ color: '#7c3aed', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={20} color="#7c3aed" /> 5 Farklı Çalışma Yöntemi
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {[
                        { icon: Timer, text: 'Pomodoro — 25dk çalış, 5dk mola', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                        { icon: Compass, text: 'Flowtime — 45dk derin odak, 8dk mola', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                        { icon: Sparkles, text: 'Animedoro — 50dk çalış, 20dk ödül', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
                        { icon: Zap, text: '52/17 — 52dk odak, 17dk dinlenme', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                        { icon: Brain, text: 'Aralıklı Tekrar — 30dk seans, ezber', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                      ].map((item, i) => {
                        const MethodIcon = item.icon;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: item.bg, borderRadius: 8, border: `1px solid ${item.color}20` }}>
                            <MethodIcon size={18} color={item.color} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{item.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handleGuardedNavigation(() => navigate('/student/study-methods'))}
                      style={{
                        width: '100%', marginTop: '1rem', padding: '0.7rem', borderRadius: 10,
                        border: 'none', background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                        color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                      }}
                    >
                      📖 Tüm Yöntemleri Detaylı İncele
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: dashTab === 'appointments' ? 'block' : 'none' }}>
              <AppointmentsContent />
            </div>
          </>
        )}
        {children}
      </div>
      {/* Profil Düzenleme Modalı */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isCoach={false}
      />
    </div>
  );
};

export default StudentDashboard;
