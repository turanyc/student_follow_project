import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Calendar, MessageSquare, Video, LogOut, PlusCircle,
  Target, Heart, TrendingUp, Phone, Clock, Send, Check, X, ChevronDown, ChevronUp, Bell
} from 'lucide-react';
import Analytics from './Analytics';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, addDoc, serverTimestamp, orderBy, getDocs, limit
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { getTreeLevel } from '../components/TreeWidget';

// ── Helpers ─────────────────────────────────────────────────────────────────
const MOOD_CONFIG = {
  great:   { label: 'Harika',    emoji: '🤩', color: '#10b981' },
  excited: { label: 'Heyecanlı', emoji: '🚀', color: '#06b6d4' },
  good:    { label: 'İyi',        emoji: '🙂', color: '#6366f1' },
  tired:   { label: 'Yorgun',    emoji: '🥱', color: '#f59e0b' },
  sad:     { label: 'Üzgün',     emoji: '😢', color: '#8b5cf6' },
  stressed:{ label: 'Stresli',   emoji: '😫', color: '#ef4444' },
};

const formatMins = (mins = 0) => {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0) return `${h}sa ${m}dk`;
  return `${m}dk`;
};

const timeAgo = (ts) => {
  if (!ts) return '';
  const ms = ts.toMillis ? ts.toMillis() : new Date(ts).getTime();
  const diff = (Date.now() - ms) / 1000;
  if (diff < 60) return 'Az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
};

// ── Nav button ──────────────────────────────────────────────────────────────
const NavBtn = ({ active, onClick, icon: Icon, label, badge }) => (
  <button onClick={onClick} className={`sidebar-nav-btn ${active ? 'active' : ''}`}>
    <Icon size={16} /> {label}
    {badge > 0 && (
      <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
    )}
  </button>
);

// ── Main Component ──────────────────────────────────────────────────────────
const CoachDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');   // feed | students | goals | moods | analytics | events | appointments | messages

  const [students, setStudents]           = useState([]);
  const [events, setEvents]               = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate]   = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);

  const [expandedStudent, setExpandedStudent]           = useState(null);
  const [selectedAnalyticsStudent, setSelectedAnalyticsStudent] = useState(null);
  const [studentExams, setStudentExams]   = useState({});
  const [studentGoals, setStudentGoals]   = useState({});
  const [studentMoods, setStudentMoods]   = useState({});
  const [studentStudyToday, setStudentStudyToday] = useState({});
  const [studentSolvedQuestions, setStudentSolvedQuestions] = useState({});
  const [studentResources, setStudentResources]             = useState({});
  const [studentOsymTargets, setStudentOsymTargets]         = useState({});
  const [selectedTrialModal, setSelectedTrialModal]         = useState(null);
  const [studentTab, setStudentTab]                         = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [goalAdvices, setGoalAdvices]     = useState({});

  // Appointment requests
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [appointmentTimes, setAppointmentTimes]       = useState({});

  // Messaging
  const [selectedMsgStudent, setSelectedMsgStudent] = useState(null);
  const [chatMessages, setChatMessages]             = useState([]);
  const [msgInput, setMsgInput]                     = useState('');
  const messagesEndRef = useRef(null);

  // Activity feed
  const [activityItems, setActivityItems] = useState([]);

  // ── Load students & events & appointments ──────────────────────────────
  useEffect(() => {
    const unsubStudents = onSnapshot(
      query(collection(db, 'users'), where('role', '==', 'student')),
      snap => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    const unsubEvents = onSnapshot(
      query(collection(db, 'events'), where('coachId', '==', currentUser?.uid || '')),
      snap => {
        const evs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        evs.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        setEvents(evs);
      }
    );

    const unsubAppts = onSnapshot(
      query(collection(db, 'appointmentRequests'), orderBy('requestedAt', 'desc')),
      snap => setAppointmentRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => { unsubStudents(); unsubEvents(); unsubAppts(); };
  }, [currentUser]);

  // ── Build activity feed from studySessions, trialExams, appointmentRequests ──
  useEffect(() => {
    if (students.length === 0) return;
    const items = [];
    const cutoff = Date.now() - 48 * 3600 * 1000; // last 48h

    // 1. Appointment requests
    appointmentRequests.forEach(req => {
      const ms = req.requestedAt?.toMillis ? req.requestedAt.toMillis() : new Date(req.requestedAt || 0).getTime();
      if (ms > cutoff) {
        items.push({
          key: `appt-${req.id}`, ms,
          icon: '📅', color: '#f59e0b',
          text: `${req.studentName || 'Öğrenci'} görüşme talebi gönderdi`,
          sub: req.message || '',
          tag: req.status === 'pending' ? 'Bekliyor' : req.status === 'accepted' ? 'Onaylandı' : 'Reddedildi',
          tagColor: req.status === 'accepted' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
        });
      }
    });

    // 2. Per-student subcollections (studySessions + trialExams)
    const promises = students.map(async (s) => {
      const today = new Date().toISOString().split('T')[0];

      // Today's study sessions
      try {
        const sessSnap = await getDocs(query(
          collection(db, 'users', s.id, 'studySessions'),
          where('date', '==', today),
          orderBy('endedAt', 'desc')
        ));
        let totalMins = 0;
        sessSnap.forEach(d => { totalMins += d.data().durationMinutes || 0; });
        if (totalMins > 0) {
          items.push({
            key: `sess-${s.id}-${today}`, ms: Date.now() - 1000,
            icon: '⏱', color: '#6366f1',
            text: `${s.name || s.email} bugün ${formatMins(totalMins)} çalıştı`,
            sub: `Toplam: ${(s.totalStudyHours || 0).toFixed(1)}sa`,
            tag: getTreeLevel(totalMins / 60).icon + ' ' + getTreeLevel(totalMins / 60).label,
            tagColor: '#10b981',
          });
        }
      } catch (_) { /* ignore */ }

      // Recent trial exams (last 48h)
      try {
        const examSnap = await getDocs(query(
          collection(db, 'users', s.id, 'trialExams'),
          orderBy('createdAt', 'desc'), limit(3)
        ));
        examSnap.forEach(d => {
          const data = d.data();
          const ms = new Date(data.createdAt || 0).getTime();
          if (ms > cutoff) {
            items.push({
              key: `exam-${d.id}`, ms,
              icon: '📊', color: '#8b5cf6',
              text: `${s.name || s.email} deneme ekledi: ${data.title}`,
              sub: `Toplam net: ${data.total}`,
              tag: data.total >= 80 ? '🔥 Harika' : data.total >= 50 ? '👍 İyi' : '📈 Gelişiyor',
              tagColor: data.total >= 80 ? '#ef4444' : data.total >= 50 ? '#10b981' : '#f59e0b',
            });
          }
        });
      } catch (_) { /* ignore */ }

      // Completed topics (if topicCompletions subcollection exists)
      try {
        const topicSnap = await getDocs(query(
          collection(db, 'users', s.id, 'topicCompletions'),
          orderBy('completedAt', 'desc'), limit(5)
        ));
        topicSnap.forEach(d => {
          const data = d.data();
          const ms = new Date(data.completedAt || 0).getTime();
          if (ms > cutoff) {
            items.push({
              key: `topic-${d.id}`, ms,
              icon: '✅', color: '#10b981',
              text: `${s.name || s.email} konu tamamladı: ${data.topicTitle}`,
              sub: data.category || '',
              tag: data.exam || '',
              tagColor: '#6366f1',
            });
          }
        });
      } catch (_) { /* ignore */ }
    });

    Promise.all(promises).then(() => {
      items.sort((a, b) => b.ms - a.ms);
      setActivityItems([...items]);
    });
  }, [students, appointmentRequests]);

  // ── Per-student data when expanded ────────────────────────────────────
  useEffect(() => {
    if (!expandedStudent) return;
    const sid = expandedStudent;

    const unsubExams = onSnapshot(
      query(collection(db, 'users', sid, 'trialExams'), orderBy('date', 'desc')),
      snap => setStudentExams(p => ({ ...p, [sid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))
    );
    const unsubGoals = onSnapshot(
      query(collection(db, 'users', sid, 'goals'), orderBy('createdAt', 'desc')),
      snap => setStudentGoals(p => ({ ...p, [sid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))
    );
    const unsubMood = onSnapshot(
      query(collection(db, 'users', sid, 'moodHistory'), orderBy('date', 'desc')),
      snap => setStudentMoods(p => ({ ...p, [sid]: snap.docs.slice(0, 7).map(d => ({ id: d.id, ...d.data() })) }))
    );

    const today = new Date().toISOString().split('T')[0];
    const unsubSess = onSnapshot(
      query(collection(db, 'users', sid, 'studySessions'), where('date', '==', today)),
      snap => {
        let total = 0;
        snap.forEach(d => { total += d.data().durationMinutes || 0; });
        setStudentStudyToday(p => ({ ...p, [sid]: total }));
      }
    );

    const unsubSq = onSnapshot(
      query(collection(db, 'users', sid, 'solvedQuestions'), orderBy('createdAt', 'desc')),
      snap => setStudentSolvedQuestions(p => ({ ...p, [sid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))
    );

    const unsubRes = onSnapshot(
      query(collection(db, 'users', sid, 'resources'), orderBy('createdAt', 'desc')),
      snap => setStudentResources(p => ({ ...p, [sid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))
    );

    const unsubOsym = onSnapshot(
      doc(db, 'users', sid, 'osymTarget', 'targetData'),
      snap => setStudentOsymTargets(p => ({ ...p, [sid]: snap.exists() ? snap.data() : null }))
    );

    return () => { unsubExams(); unsubGoals(); unsubMood(); unsubSess(); unsubSq(); unsubRes(); unsubOsym(); };
  }, [expandedStudent]);

  // ── Chat ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser || !selectedMsgStudent) return;
    const unsub = onSnapshot(
      collection(db, 'messages'),
      snap => {
        const msgs = [];
        snap.forEach(d => {
          const data = d.data();
          if (
            (data.senderId === currentUser.uid && data.receiverId === selectedMsgStudent.id) ||
            (data.senderId === selectedMsgStudent.id && data.receiverId === currentUser.uid)
          ) msgs.push({ id: d.id, ...data });
        });
        msgs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || Date.now());
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || Date.now());
          return timeA - timeB;
        });
        setChatMessages(msgs);
      }
    );
    return () => unsub();
  }, [currentUser, selectedMsgStudent]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    setCreatingEvent(true);
    try {
      await addDoc(collection(db, 'events'), { title: newEventTitle, date: newEventDate, coachId: currentUser.uid, createdAt: serverTimestamp() });
      setNewEventTitle(''); setNewEventDate('');
      Swal.fire({ icon: 'success', title: 'Duyuruldu!', timer: 1600, showConfirmButton: false });
    } finally { setCreatingEvent(false); }
  };

  const handleSendRecommendation = async (studentId) => {
    const text = recommendations[studentId];
    if (!text?.trim()) return;
    await updateDoc(doc(db, 'users', studentId), { coachRecommendation: text });
    setRecommendations(p => ({ ...p, [studentId]: '' }));
    Swal.fire({ icon: 'success', title: 'Tavsiye gönderildi!', timer: 1400, showConfirmButton: false });
  };

  const handleSendGoalAdvice = async (studentId, goalId) => {
    const key = `${studentId}_${goalId}`;
    const text = goalAdvices[key];
    if (!text?.trim()) return;
    await updateDoc(doc(db, 'users', studentId, 'goals', goalId), { coachAdvice: text });
    setGoalAdvices(p => ({ ...p, [key]: '' }));
    Swal.fire({ icon: 'success', title: 'Hedef tavsiyesi gönderildi!', timer: 1400, showConfirmButton: false });
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedMsgStudent) return;
    const text = msgInput; setMsgInput('');
    await addDoc(collection(db, 'messages'), {
      text, senderId: currentUser.uid, receiverId: selectedMsgStudent.id,
      senderRole: 'coach', createdAt: serverTimestamp()
    });
  };

  const handleSetAppointment = async (reqId) => {
    const time = appointmentTimes[reqId];
    if (!time) return;
    await updateDoc(doc(db, 'appointmentRequests', reqId), {
      appointmentTime: time, status: 'accepted', respondedAt: serverTimestamp()
    });
    setAppointmentTimes(p => ({ ...p, [reqId]: '' }));
    Swal.fire({ icon: 'success', title: 'Randevu ayarlandı!', timer: 1600, showConfirmButton: false });
  };

  const handleRejectAppointment = async (reqId) => {
    await updateDoc(doc(db, 'appointmentRequests', reqId), { status: 'rejected', respondedAt: serverTimestamp() });
  };

  const handleLogout = async () => { await signOut(auth); navigate('/login'); };

  const pendingRequests = appointmentRequests.filter(r => r.status === 'pending');

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="sidebar-logo" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🎯</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>Koç Paneli</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, position: 'relative', zIndex: 1 }}>
          <NavBtn active={activeTab==='feed'}         onClick={() => setActiveTab('feed')}         icon={Bell}         label="Aktivite Akışı" />
          <NavBtn active={activeTab==='students'}     onClick={() => setActiveTab('students')}     icon={Users}        label="Öğrencilerim" />
          <NavBtn active={activeTab==='goals'}        onClick={() => setActiveTab('goals')}        icon={Target}       label="Tüm Hedefler" />
          <NavBtn active={activeTab==='moods'}        onClick={() => setActiveTab('moods')}        icon={Heart}        label="Duygu Durumları" />
          <NavBtn active={activeTab==='analytics'}    onClick={() => setActiveTab('analytics')}    icon={TrendingUp}   label="Deneme Grafikleri" />
          <NavBtn active={activeTab==='events'}       onClick={() => setActiveTab('events')}       icon={Calendar}     label="Etkinlikler" />
          <NavBtn active={activeTab==='appointments'} onClick={() => setActiveTab('appointments')} icon={Phone}        label="Görüşme Talepleri" badge={pendingRequests.length} />
          <NavBtn active={activeTab==='messages'}     onClick={() => setActiveTab('messages')}     icon={MessageSquare}label="Mesajlar" />
          <div className="sidebar-divider" />
          <NavBtn active={false} onClick={() => navigate('/video-call')} icon={Video} label="Görüşmeler" />
        </nav>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '0.5rem' }}>
          <button onClick={handleLogout} style={{
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

      {/* ── Main Content ── */}
      <div className="main-content">

        {/* ---- AKTİVİTE AKIŞI (Coach Home) ---- */}
        {activeTab === 'feed' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ marginBottom: '0.25rem' }}>Aktivite Akışı</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Son 48 saatte öğrencilerin yaptıkları değişiklikler ve aktiviteler</p>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Toplam Öğrenci', value: students.length, icon: '👥', color: '#6366f1' },
                { label: 'Çalışan Öğrenci', value: students.filter(s => s.status === 'studying').length, icon: '📚', color: '#10b981' },
                { label: 'Bekleyen Talep', value: pendingRequests.length, icon: '📅', color: '#f59e0b' },
                { label: 'Son 48sa Aktivite', value: activityItems.length, icon: '⚡', color: '#8b5cf6' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '1rem', border: `1px solid ${stat.color}20` }}>
                  <p style={{ margin: 0, fontSize: '1.5rem' }}>{stat.icon}</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Activity list */}
            {activityItems.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Bell size={40} style={{ color: '#e2e8f0', marginBottom: '1rem' }} />
                <p style={{ color: '#94a3b8' }}>Son 48 saatte kayıt edilmiş aktivite yok.</p>
                <p style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Öğrenciler çalışmaya başladığında aktiviteler burada görünecek.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {activityItems.map((item, i) => (
                  <div key={item.key} className="card activity-new" style={{
                    padding: '0.875rem 1.25rem',
                    border: `1px solid ${item.color}20`,
                    background: `${item.color}06`,
                    animationDelay: `${i * 0.04}s`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: `${item.color}15`, border: `1px solid ${item.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', flexShrink: 0
                      }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{item.text}</p>
                        {item.sub && <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>{item.sub}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {item.tag && (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: `${item.tagColor}15`, color: item.tagColor }}>
                            {item.tag}
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {timeAgo(item.ms ? { toMillis: () => item.ms } : null)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- ÖĞRENCİLER ---- */}
        {activeTab === 'students' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Öğrencilerim</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {students.length === 0 && <p style={{ color: '#94a3b8' }}>Henüz kayıtlı öğrenci yok.</p>}
              {students.map(student => {
                const isExpanded = expandedStudent === student.id;
                const exams = studentExams[student.id] || [];
                const mood = student.currentMood ? MOOD_CONFIG[student.currentMood] : null;
                const todayMins = studentStudyToday[student.id] || 0;
                const tree = getTreeLevel((todayMins + (student.status === 'studying' ? 0 : 0)) / 60, student.treePoints || student.totalStudyHours || 0);

                return (
                  <div key={student.id} className="card" style={{ overflow: 'hidden', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedStudent(isExpanded ? null : student.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {(student.name || student.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{student.name || student.email}</h3>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                            <span className={`status-badge ${student.status === 'studying' ? 'status-studying' : 'status-not-studying'}`}>
                              {student.status === 'studying' ? '📚 Çalışıyor' : '💤 Çalışmıyor'}
                            </span>
                            <span style={{ fontSize: '0.72rem', background: tree.level >= 4 ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.1)', color: tree.level >= 4 ? '#d97706' : '#059669', padding: '0.15rem 0.5rem', borderRadius: 12, fontWeight: 800 }}>
                              {tree.icon} Seviye {tree.level}: {tree.label} {tree.level >= 4 ? '✨ (Ulu / Efsanevi)' : ''}
                            </span>
                            {isExpanded && todayMins > 0 && (
                              <span style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '0.15rem 0.5rem', borderRadius: 12, fontWeight: 700 }}>
                                ⏱ Bugün: {formatMins(todayMins)}
                              </span>
                            )}
                            <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '0.15rem 0.5rem', borderRadius: 12, fontWeight: 700 }}>
                              📊 Toplam: {(student.totalStudyHours || 0).toFixed(1)}sa
                            </span>
                            {mood && <span style={{ fontSize: '0.72rem', background: `${mood.color}15`, color: mood.color, padding: '0.15rem 0.5rem', borderRadius: 12, fontWeight: 700 }}>{mood.emoji} {mood.label}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {exams[0] && (
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>Son Deneme</p>
                            <p style={{ margin: 0, fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>{exams[0].total} net</p>
                          </div>
                        )}
                        {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1.25rem', paddingTop: '1.25rem' }}>
                        {/* Sub nav */}
                        <div style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', padding: '0.4rem', borderRadius: 12, marginBottom: '1.25rem', overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                          {[
                            { id: 'overview', label: '📊 Genel & Ağaç' },
                            { id: 'exams', label: '📝 Deneme & ÖSYM' },
                            { id: 'questions', label: '📈 Çözülen Sorular' },
                            { id: 'goals', label: '🎯 Hedefler & Görevler' },
                            { id: 'resources', label: '📚 Kaynaklar' },
                            { id: 'moods', label: '💭 Duygu & Tavsiye' }
                          ].map(t => {
                            const cur = studentTab[student.id] || 'overview';
                            return (
                              <button key={t.id} onClick={e => { e.stopPropagation(); setStudentTab(p => ({ ...p, [student.id]: t.id })); }}
                                style={{
                                  padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                                  background: cur === t.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                                  color: cur === t.id ? 'white' : '#64748b',
                                  fontWeight: cur === t.id ? 700 : 600, fontSize: '0.82rem', whiteSpace: 'nowrap',
                                  boxShadow: cur === t.id ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                                  transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
                                }}>
                                {t.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Sub-tab: OVERVIEW */}
                        {((studentTab[student.id] || 'overview') === 'overview') && (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                              {[
                                { label: 'Bugünün Süresi', value: formatMins(todayMins), color: '#10b981' },
                                { label: 'Toplam Çalışma', value: `${(student.totalStudyHours || 0).toFixed(1)}sa`, color: '#6366f1' },
                                { label: 'Ağaç Formu', value: `${tree.icon} ${tree.label}`, color: '#059669' },
                              ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '0.85rem', background: `${s.color}07`, borderRadius: 12, border: `1px solid ${s.color}20` }}>
                                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>{s.label}</p>
                                  <p style={{ margin: '0.25rem 0 0', fontWeight: 900, color: s.color, fontSize: '1.1rem' }}>{s.value}</p>
                                </div>
                              ))}
                            </div>

                            <div style={{ padding: '1.25rem', background: tree.level >= 4 ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : '#f8fafc', border: `1px solid ${tree.level >= 4 ? '#fde68a' : '#e2e8f0'}`, borderRadius: 16, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                              <div>
                                <h4 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                                  {tree.icon} Mevcut Ağaç Evrimi: Seviye {tree.level} ({tree.label})
                                  {tree.level >= 4 && <span style={{ background: '#f59e0b', color: 'white', padding: '0.15rem 0.6rem', borderRadius: 12, fontSize: '0.72rem' }}>✨ ULU AĞAÇ ULAŞILDI!</span>}
                                </h4>
                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                  Kümülatif Ağaç Puanı: <strong>{student.treePoints || student.totalStudyHours || 0} Puan</strong> (Günde 5+ pomodoro veya kümülatif puan ile evrimleşir)
                                </p>
                              </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16 }}>
                              <h4 style={{ margin: '0 0 0.6rem', color: '#6366f1', fontSize: '0.9rem', fontWeight: 800 }}>🎯 Ana Ekran Koç Mesajı & Tavsiyesi Gönder</h4>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="text" className="input-field" placeholder="Öğrencinin panelinde anlık görünecek tavsiye..."
                                  value={recommendations[student.id] || ''}
                                  onChange={e => setRecommendations(p => ({ ...p, [student.id]: e.target.value }))} style={{ flex: 1, fontWeight: 600 }} />
                                <button className="btn btn-primary" onClick={() => handleSendRecommendation(student.id)} style={{ fontWeight: 800 }}>
                                  Tavsiyeyi Gönder
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sub-tab: EXAMS */}
                        {((studentTab[student.id] || 'overview') === 'exams') && (
                          <div>
                            <h4 style={{ color: '#6366f1', margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800 }}>📊 Deneme Netleri & ÖSYM Hedef Karşılaştırması</h4>
                            {exams.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Henüz girilmiş bir deneme yok.</p> : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                {exams.map(exam => (
                                  <div key={exam.id} style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                      <div>
                                        <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{exam.title}</p>
                                        <p style={{ margin: '0.15rem 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>🗓 {exam.date} — {(exam.examType || student.examType || 'yks').toUpperCase()}</p>
                                      </div>
                                      <span style={{ padding: '0.25rem 0.65rem', background: 'rgba(16,185,129,0.15)', color: '#059669', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem' }}>
                                        {exam.total} Net
                                      </span>
                                    </div>
                                    <button
                                      onClick={e => { e.stopPropagation(); setSelectedTrialModal({ exam, student, osymTarget: studentOsymTargets[student.id] || null }); }}
                                      style={{ width: '100%', padding: '0.55rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: 8, color: '#4f46e5', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                      👁 Detay & ÖSYM Hedefi ile Karşılaştır
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sub-tab: QUESTIONS */}
                        {((studentTab[student.id] || 'overview') === 'questions') && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem', fontWeight: 800 }}>📈 Ders Bazlı Çözülen Soru Dağılımı</h4>
                              <span style={{ padding: '0.3rem 0.8rem', background: '#e0e7ff', color: '#4338ca', borderRadius: 14, fontWeight: 800, fontSize: '0.82rem' }}>
                                Toplam: {(student.totalQuestionCount || 0).toLocaleString('tr-TR')} Soru
                              </span>
                            </div>
                            {(studentSolvedQuestions[student.id] || []).length === 0 ? (
                              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Henüz soru kaydı girilmedi.</p>
                            ) : (
                              <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                  {(() => {
                                    const totals = {};
                                    (studentSolvedQuestions[student.id] || []).forEach(item => {
                                      const s = item.subject || 'Diğer';
                                      totals[s] = (totals[s] || 0) + (item.count || 0);
                                    });
                                    return Object.entries(totals).map(([subj, cnt]) => (
                                      <div key={subj} style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>{subj}</span>
                                        <strong style={{ display: 'block', fontSize: '1.3rem', color: '#1e293b', fontWeight: 900, marginTop: '0.2rem', fontFamily: 'monospace' }}>{cnt}</strong>
                                      </div>
                                    ));
                                  })()}
                                </div>
                                <h5 style={{ margin: '0 0 0.6rem', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>Son Soru Giriş Kayıtları</h5>
                                <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '0.5rem' }}>
                                  {(studentSolvedQuestions[student.id] || []).slice(0, 15).map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.85rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 8, fontSize: '0.82rem' }}>
                                      <span><strong style={{ color: '#4f46e5' }}>{item.subject}</strong>: +{item.count} Soru Çözüldü</span>
                                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.date}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sub-tab: GOALS */}
                        {((studentTab[student.id] || 'overview') === 'goals') && (
                          <div>
                            <h4 style={{ color: '#1e293b', margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800 }}>🎯 Hedefler, Görevler & Koç Tavsiyeleri</h4>
                            {(studentGoals[student.id] || []).length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Öğrenci henüz hedef eklememiş.</p> : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(studentGoals[student.id] || []).map(goal => {
                                  const key = `${student.id}_${goal.id}`;
                                  return (
                                    <div key={goal.id} style={{ padding: '1rem', background: '#f8fafc', borderLeft: `5px solid ${goal.completed ? '#10b981' : '#6366f1'}`, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                      <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', textDecoration: goal.completed ? 'line-through' : 'none' }}>
                                        {goal.completed ? '✅ ' : '🎯 '}{goal.title}
                                      </p>
                                      {goal.description && <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{goal.description}</p>}
                                      {goal.targetDate && <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>🗓 Hedef Tarihi: {goal.targetDate}</p>}
                                      {goal.coachAdvice && (
                                        <div style={{ marginTop: '0.6rem', padding: '0.6rem 0.85rem', background: 'rgba(99,102,241,0.08)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
                                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#4f46e5', fontWeight: 700 }}>💬 İletilen Koç Tavsiyesi: {goal.coachAdvice}</p>
                                        </div>
                                      )}
                                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" className="input-field" placeholder="Bu hedef için özel tavsiye / yönlendirme yazın..." style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                                          value={goalAdvices[key] || ''}
                                          onChange={e => setGoalAdvices(p => ({ ...p, [key]: e.target.value }))} />
                                        <button className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', fontWeight: 700 }}
                                          onClick={() => handleSendGoalAdvice(student.id, goal.id)} disabled={!goalAdvices[key]?.trim()}>
                                          Gönder
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sub-tab: RESOURCES */}
                        {((studentTab[student.id] || 'overview') === 'resources') && (
                          <div>
                            <h4 style={{ color: '#1e293b', margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800 }}>📚 Ders Bazlı Kaynak Kütüphanesi & Bitirme Hedefleri</h4>
                            {(studentResources[student.id] || []).length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Öğrenci kütüphanesine henüz kaynak eklememiş.</p> : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
                                {(studentResources[student.id] || []).map(r => (
                                  <div key={r.id} style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                      <span style={{ padding: '0.2rem 0.65rem', background: 'rgba(16,185,129,0.15)', color: '#059669', borderRadius: 12, fontSize: '0.72rem', fontWeight: 800 }}>
                                        {r.subject || 'Genel'}
                                      </span>
                                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {r.type === 'book' ? '📚 Kitap' : r.type === 'video' ? '🎥 Video' : '📝 Deneme'}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{r.name}</p>
                                    {r.targetDate && <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: '#d97706', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1' }}>🗓 Bitirme Hedef Tarihi: {r.targetDate}</p>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sub-tab: MOODS & ADVICE */}
                        {((studentTab[student.id] || 'overview') === 'moods') && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div>
                              <h4 style={{ color: '#f59e0b', margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800 }}>💭 Son 7 Gün Duygu Geçmişi</h4>
                              {(studentMoods[student.id] || []).length === 0
                                ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Duygu verisi bulunamadı.</p>
                                : (
                                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    {(studentMoods[student.id] || []).map(m => {
                                      const mc = MOOD_CONFIG[m.mood];
                                      return (
                                        <div key={m.id} style={{ textAlign: 'center', padding: '0.65rem 0.9rem', background: `${mc?.color}15`, border: `1px solid ${mc?.color}35`, borderRadius: 12 }}>
                                          <p style={{ margin: 0, fontSize: '1.5rem' }}>{mc?.emoji}</p>
                                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', fontWeight: 800, color: mc?.color }}>{mc?.label}</p>
                                          <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>{m.date?.slice(5)}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )
                              }
                            </div>
                            <div style={{ padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16 }}>
                              <h4 style={{ color: '#6366f1', margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800 }}>🎯 Anlık Koç Tavsiyesi & Mesajı İlet</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <textarea className="input-field" rows={3} placeholder="Öğrencinin panelinde görünecek genel motivasyon veya çalışma tavsiyeniz..."
                                  value={recommendations[student.id] || ''}
                                  onChange={e => setRecommendations(p => ({ ...p, [student.id]: e.target.value }))} style={{ resize: 'vertical' }} />
                                <button className="btn btn-primary" onClick={() => handleSendRecommendation(student.id)} style={{ fontWeight: 800, padding: '0.65rem 1.25rem' }}>
                                  Tavsiyeyi İlet
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- TÜM HEDEFLER ---- */}
        {activeTab === 'goals' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>🎯 Tüm Öğrencilerin Hedefleri</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {students.map(student => {
                const goals = studentGoals[student.id] || [];
                return (
                  <div key={student.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>{student.name || student.email}</h3>
                      {!studentGoals[student.id] && (
                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}
                          onClick={async () => {
                            const snap = await getDocs(query(collection(db, 'users', student.id, 'goals'), orderBy('createdAt', 'desc')));
                            setStudentGoals(p => ({ ...p, [student.id]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
                          }}>Hedefleri Yükle</button>
                      )}
                    </div>
                    {goals.length === 0
                      ? <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Henüz hedef eklenmemiş.</p>
                      : goals.map(goal => {
                        const key = `${student.id}_${goal.id}`;
                        return (
                          <div key={goal.id} style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: '0.5rem' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{goal.completed ? '✅ ' : '🎯 '}{goal.title}</p>
                            {goal.targetDate && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#f59e0b' }}>🗓 {goal.targetDate}</p>}
                            {goal.coachAdvice && <div style={{ marginTop: '0.4rem', padding: '0.4rem 0.6rem', background: 'rgba(99,102,241,0.08)', borderRadius: 6, borderLeft: '3px solid #6366f1' }}>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#6366f1' }}>💬 {goal.coachAdvice}</p>
                            </div>}
                            <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.4rem' }}>
                              <input type="text" className="input-field" placeholder="Bu hedef için tavsiye..." style={{ fontSize: '0.82rem' }}
                                value={goalAdvices[key] || ''}
                                onChange={e => setGoalAdvices(p => ({ ...p, [key]: e.target.value }))} />
                              <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                                onClick={() => handleSendGoalAdvice(student.id, goal.id)} disabled={!goalAdvices[key]?.trim()}>
                                <Send size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- ANALİTİK GRAFİKLER ---- */}
        {activeTab === 'analytics' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>📈 Öğrenci Deneme Grafikleri</h1>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {students.map(s => (
                <button key={s.id} onClick={() => setSelectedAnalyticsStudent(s)}
                  style={{
                    padding: '0.45rem 1rem', borderRadius: 20, cursor: 'pointer',
                    border: `1px solid ${selectedAnalyticsStudent?.id === s.id ? '#6366f1' : '#e2e8f0'}`,
                    background: selectedAnalyticsStudent?.id === s.id ? 'rgba(99,102,241,0.08)' : '#ffffff',
                    color: selectedAnalyticsStudent?.id === s.id ? '#6366f1' : '#64748b',
                    fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.15s',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                  {(s.name || s.email)?.[0]?.toUpperCase()} {s.name || s.email}
                </button>
              ))}
            </div>
            {!selectedAnalyticsStudent
              ? <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                  <TrendingUp size={40} style={{ color: '#e2e8f0', marginBottom: '1rem' }} />
                  <p style={{ color: '#94a3b8' }}>Bir öğrenci seçin</p>
                </div>
              : <Analytics studentId={selectedAnalyticsStudent.id} studentName={selectedAnalyticsStudent.name || selectedAnalyticsStudent.email} />
            }
          </div>
        )}

        {/* ---- DUYGU DURUMLARI ---- */}
        {activeTab === 'moods' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>💭 Öğrenci Duygu Durumları</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {students.map(student => {
                const mood = student.currentMood ? MOOD_CONFIG[student.currentMood] : null;
                const moodHistory = studentMoods[student.id] || [];
                return (
                  <div key={student.id} className="card" style={{ border: `1px solid ${mood ? mood.color + '30' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>{student.name || student.email}</h3>
                      {mood ? <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.8rem' }}>{mood.emoji}</span><p style={{ margin: 0, fontSize: '0.65rem', color: mood.color }}>{mood.label}</p></div>
                        : <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>😐</span>}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>
                      Son güncelleme: {student.lastMoodUpdate ? new Date(student.lastMoodUpdate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </p>
                    {!studentMoods[student.id] && (
                      <button className="btn btn-secondary" style={{ fontSize: '0.78rem', width: '100%' }}
                        onClick={async () => {
                          const snap = await getDocs(query(collection(db, 'users', student.id, 'moodHistory'), orderBy('date', 'desc')));
                          setStudentMoods(p => ({ ...p, [student.id]: snap.docs.slice(0, 7).map(d => ({ id: d.id, ...d.data() })) }));
                        }}>Geçmişi Göster</button>
                    )}
                    {moodHistory.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                        {moodHistory.map(m => {
                          const mc = MOOD_CONFIG[m.mood];
                          return <div key={m.id} title={m.date} style={{ fontSize: '1rem' }}>{mc?.emoji}</div>;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- ETKİNLİKLER ---- */}
        {activeTab === 'events' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>📅 Etkinlik Yönetimi</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>➕ Yeni Etkinlik Duyur</h3>
                <form onSubmit={handleCreateEvent}>
                  <input type="text" required className="input-field" placeholder="Etkinlik Adı" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} style={{ marginBottom: '0.75rem' }} />
                  <input type="datetime-local" required className="input-field" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} style={{ marginBottom: '0.75rem' }} />
                  <button type="submit" className="btn btn-success" disabled={creatingEvent} style={{ width: '100%' }}>
                    {creatingEvent ? 'Oluşturuluyor...' : 'Tüm Öğrencilere Duyur'}
                  </button>
                </form>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Aktif Etkinlikler ({events.length})</h3>
                <div style={{ maxHeight: 350, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {events.length === 0 ? <p style={{ color: '#94a3b8' }}>Henüz etkinlik yok.</p>
                    : events.map(ev => (
                      <div key={ev.id} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{ev.title}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>{new Date(ev.date).toLocaleString('tr-TR')}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- GÖRÜŞME TALEPLERİ ---- */}
        {activeTab === 'appointments' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>📅 Görüşme Talepleri</h1>
            {appointmentRequests.length === 0
              ? <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Phone size={40} style={{ color: '#e2e8f0', marginBottom: '1rem' }} />
                  <p style={{ color: '#94a3b8' }}>Henüz görüşme talebi yok.</p>
                </div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {appointmentRequests.map(req => (
                    <div key={req.id} className="card" style={{
                      borderLeft: `4px solid ${req.status === 'accepted' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b'}`,
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                              {(req.studentName || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{req.studentName}</p>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                                {req.requestedAt ? new Date(req.requestedAt.toMillis ? req.requestedAt.toMillis() : req.requestedAt).toLocaleString('tr-TR') : '...'}
                              </p>
                            </div>
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                              background: req.status === 'accepted' ? 'rgba(16,185,129,0.1)' : req.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                              color: req.status === 'accepted' ? '#059669' : req.status === 'rejected' ? '#ef4444' : '#d97706'
                            }}>
                              {req.status === 'pending' ? '⏳ Bekliyor' : req.status === 'accepted' ? '✅ Onaylandı' : '❌ Reddedildi'}
                            </span>
                          </div>
                          {req.message && (
                            <div style={{ padding: '0.65rem 0.875rem', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #6366f1', marginBottom: '0.5rem' }}>
                              <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>"{req.message}"</p>
                            </div>
                          )}
                          {req.status === 'accepted' && req.appointmentTime && (
                            <p style={{ margin: 0, fontWeight: 700, color: '#059669', fontSize: '0.9rem' }}>
                              📅 {new Date(req.appointmentTime).toLocaleString('tr-TR')}
                            </p>
                          )}
                        </div>
                        {req.status === 'pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 220 }}>
                            <input type="datetime-local" className="input-field" style={{ fontSize: '0.85rem' }}
                              value={appointmentTimes[req.id] || ''}
                              onChange={e => setAppointmentTimes(p => ({ ...p, [req.id]: e.target.value }))} />
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button className="btn btn-success" style={{ flex: 1, fontSize: '0.8rem' }}
                                onClick={() => handleSetAppointment(req.id)} disabled={!appointmentTimes[req.id]}>
                                <Check size={14} /> Randevu Ata
                              </button>
                              <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.8rem' }}
                                onClick={() => handleRejectAppointment(req.id)}>
                                <X size={14} /> Reddet
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ---- MESAJLAR ---- */}
        {activeTab === 'messages' && (
          <div>
            <h1 style={{ marginBottom: '1.5rem' }}>💬 Öğrencilerle Mesajlaşma</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '1.25rem', height: '70vh' }}>
              {/* Student list */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1rem' }}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Öğrenciler</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
                  {students.map(s => (
                    <button key={s.id} onClick={() => setSelectedMsgStudent(s)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.7rem', borderRadius: 8,
                      border: `1px solid ${selectedMsgStudent?.id === s.id ? '#6366f1' : 'transparent'}`,
                      background: selectedMsgStudent?.id === s.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'Outfit, sans-serif'
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>
                        {(s.name || s.email)?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name || s.email}</p>
                        <span className={`status-badge ${s.status === 'studying' ? 'status-studying' : 'status-not-studying'}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.4rem' }}>
                          {s.status === 'studying' ? 'Çalışıyor' : 'Çevrimdışı'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat area */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {selectedMsgStudent
                    ? <>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                          {(selectedMsgStudent.name || selectedMsgStudent.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{selectedMsgStudent.name || selectedMsgStudent.email}</p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Öğrenci</p>
                        </div>
                      </>
                    : <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>Soldan bir öğrenci seçin</p>
                  }
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {!selectedMsgStudent && (
                    <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.3 }}>
                      <MessageSquare size={40} />
                      <p>Bir öğrenci seçin</p>
                    </div>
                  )}
                  {chatMessages.map(msg => {
                    const isMine = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        background: isMine ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f1f5f9',
                        color: isMine ? 'white' : '#1e293b',
                        padding: '0.65rem 1rem',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        maxWidth: '68%', fontSize: '0.875rem'
                      }}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                          {msg.createdAt ? new Date(msg.createdAt.toMillis ? msg.createdAt.toMillis() : msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
                  <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="input-field"
                      placeholder={selectedMsgStudent ? `${selectedMsgStudent.name || selectedMsgStudent.email}'e mesaj gönder...` : 'Önce bir öğrenci seçin'}
                      value={msgInput} onChange={e => setMsgInput(e.target.value)}
                      disabled={!selectedMsgStudent} style={{ flex: 1 }} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }} disabled={!selectedMsgStudent || !msgInput.trim()}>
                      <Send size={17} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── ÖSYM HEDEF & DENEME KARŞILAŞTIRMA MODALI ── */}
      {selectedTrialModal && (() => {
        const { exam, student, osymTarget } = selectedTrialModal;
        const osym = osymTarget || {};
        const isLgs = exam.examType === 'lgs' || student.examType === 'lgs';
        const ratio = isLgs ? 3 : 4;

        const subjectNames = {
          turkce: isLgs ? 'Türkçe' : 'TYT Türkçe',
          matematik: isLgs ? 'Matematik' : 'TYT Matematik',
          fen: isLgs ? 'Fen Bilimleri' : 'TYT Fen Bilimleri',
          sosyal: 'TYT Sosyal Bilgiler',
          inkilap: 'T.C. İnkılap Tarihi',
          ingilizce: 'İngilizce',
          din: 'Din Kültürü',
          aytMat: 'AYT Matematik',
          fizik: 'AYT Fizik',
          kimya: 'AYT Kimya',
          biyoloji: 'AYT Biyoloji',
          edebiyat: 'AYT Edebiyat',
          tarih1: 'AYT Tarih-1',
          cografya1: 'AYT Coğrafya-1',
          tarih2: 'AYT Tarih-2',
          cografya2: 'AYT Coğrafya-2',
          felsefe: 'AYT Felsefe Grubu',
          dinAyt: 'AYT Din'
        };

        const getOsymSubjectTarget = (subjKey) => {
          if (isLgs && osym.lgs) {
            const l = osym.lgs;
            if (subjKey === 'turkce') return l.lgs_turkce_d - (l.lgs_turkce_y || 0) / 3;
            if (subjKey === 'matematik') return l.lgs_mat_d - (l.lgs_mat_y || 0) / 3;
            if (subjKey === 'fen') return l.lgs_fen_d - (l.lgs_fen_y || 0) / 3;
            if (subjKey === 'inkilap') return l.lgs_inkilap_d - (l.lgs_inkilap_y || 0) / 3;
            if (subjKey === 'ingilizce') return l.lgs_ing_d - (l.lgs_ing_y || 0) / 3;
            if (subjKey === 'din') return l.lgs_din_d - (l.lgs_din_y || 0) / 3;
          }
          if (!isLgs && osym.yks) {
            const y = osym.yks;
            if (subjKey === 'turkce') return y.tyt_turkce_d - (y.tyt_turkce_y || 0) / 4;
            if (subjKey === 'matematik') return y.tyt_mat_d - (y.tyt_mat_y || 0) / 4;
            if (subjKey === 'fen') return y.tyt_fen_d - (y.tyt_fen_y || 0) / 4;
            if (subjKey === 'sosyal') return y.tyt_sosyal_d - (y.tyt_sosyal_y || 0) / 4;
            if (subjKey === 'aytMat') return y.ayt_mat_d - (y.ayt_mat_y || 0) / 4;
            if (subjKey === 'fizik') return y.ayt_fizik_d - (y.ayt_fizik_y || 0) / 4;
            if (subjKey === 'kimya') return y.ayt_kimya_d - (y.ayt_kimya_y || 0) / 4;
            if (subjKey === 'biyoloji') return y.ayt_biyo_d - (y.ayt_biyo_y || 0) / 4;
            if (subjKey === 'edebiyat') return y.ayt_tde_d - (y.ayt_tde_y || 0) / 4;
            if (subjKey === 'tarih1') return y.ayt_tar1_d - (y.ayt_tar1_y || 0) / 4;
            if (subjKey === 'cografya1') return y.ayt_cog1_d - (y.ayt_cog1_y || 0) / 4;
          }
          return null;
        };

        const getOsymSubjectTargetData = (subjKey) => {
          if (isLgs && osym.lgs) {
            const l = osym.lgs;
            if (subjKey === 'turkce') return { d: Number(l.lgs_turkce_d || 0), y: Number(l.lgs_turkce_y || 0), net: Number(l.lgs_turkce_d || 0) - Number(l.lgs_turkce_y || 0) / 3 };
            if (subjKey === 'matematik') return { d: Number(l.lgs_mat_d || 0), y: Number(l.lgs_mat_y || 0), net: Number(l.lgs_mat_d || 0) - Number(l.lgs_mat_y || 0) / 3 };
            if (subjKey === 'fen') return { d: Number(l.lgs_fen_d || 0), y: Number(l.lgs_fen_y || 0), net: Number(l.lgs_fen_d || 0) - Number(l.lgs_fen_y || 0) / 3 };
            if (subjKey === 'inkilap') return { d: Number(l.lgs_inkilap_d || 0), y: Number(l.lgs_inkilap_y || 0), net: Number(l.lgs_inkilap_d || 0) - Number(l.lgs_inkilap_y || 0) / 3 };
            if (subjKey === 'ingilizce') return { d: Number(l.lgs_ing_d || 0), y: Number(l.lgs_ing_y || 0), net: Number(l.lgs_ing_d || 0) - Number(l.lgs_ing_y || 0) / 3 };
            if (subjKey === 'din') return { d: Number(l.lgs_din_d || 0), y: Number(l.lgs_din_y || 0), net: Number(l.lgs_din_d || 0) - Number(l.lgs_din_y || 0) / 3 };
          }
          if (!isLgs && osym.yks) {
            const y = osym.yks;
            if (subjKey === 'turkce') return { d: Number(y.tyt_turkce_d || 0), y: Number(y.tyt_turkce_y || 0), net: Number(y.tyt_turkce_d || 0) - Number(y.tyt_turkce_y || 0) / 4 };
            if (subjKey === 'matematik') return { d: Number(y.tyt_mat_d || 0), y: Number(y.tyt_mat_y || 0), net: Number(y.tyt_mat_d || 0) - Number(y.tyt_mat_y || 0) / 4 };
            if (subjKey === 'fen') return { d: Number(y.tyt_fen_d || 0), y: Number(y.tyt_fen_y || 0), net: Number(y.tyt_fen_d || 0) - Number(y.tyt_fen_y || 0) / 4 };
            if (subjKey === 'sosyal') return { d: Number(y.tyt_sosyal_d || 0), y: Number(y.tyt_sosyal_y || 0), net: Number(y.tyt_sosyal_d || 0) - Number(y.tyt_sosyal_y || 0) / 4 };
            if (subjKey === 'aytMat') return { d: Number(y.ayt_mat_d || 0), y: Number(y.ayt_mat_y || 0), net: Number(y.ayt_mat_d || 0) - Number(y.ayt_mat_y || 0) / 4 };
            if (subjKey === 'fizik') return { d: Number(y.ayt_fizik_d || 0), y: Number(y.ayt_fizik_y || 0), net: Number(y.ayt_fizik_d || 0) - Number(y.ayt_fizik_y || 0) / 4 };
            if (subjKey === 'kimya') return { d: Number(y.ayt_kimya_d || 0), y: Number(y.ayt_kimya_y || 0), net: Number(y.ayt_kimya_d || 0) - Number(y.ayt_kimya_y || 0) / 4 };
            if (subjKey === 'biyoloji') return { d: Number(y.ayt_biyo_d || 0), y: Number(y.ayt_biyo_y || 0), net: Number(y.ayt_biyo_d || 0) - Number(y.ayt_biyo_y || 0) / 4 };
            if (subjKey === 'edebiyat') return { d: Number(y.ayt_tde_d || 0), y: Number(y.ayt_tde_y || 0), net: Number(y.ayt_tde_d || 0) - Number(y.ayt_tde_y || 0) / 4 };
            if (subjKey === 'tarih1') return { d: Number(y.ayt_tar1_d || 0), y: Number(y.ayt_tar1_y || 0), net: Number(y.ayt_tar1_d || 0) - Number(y.ayt_tar1_y || 0) / 4 };
            if (subjKey === 'cografya1') return { d: Number(y.ayt_cog1_d || 0), y: Number(y.ayt_cog1_y || 0), net: Number(y.ayt_cog1_d || 0) - Number(y.ayt_cog1_y || 0) / 4 };
          }
          return null;
        };

        let subjectsObj = exam.subjects || {};
        if (Object.keys(subjectsObj).length === 0) {
          if (isLgs) {
            subjectsObj = {
              turkce: { d: exam.turkishCorrect || 0, y: exam.turkishWrong || 0, net: exam.turkish !== undefined ? exam.turkish : (exam.turkishCorrect - (exam.turkishWrong||0)/3) },
              matematik: { d: exam.mathCorrect || 0, y: exam.mathWrong || 0, net: exam.math !== undefined ? exam.math : (exam.mathCorrect - (exam.mathWrong||0)/3) },
              fen: { d: exam.scienceCorrect || 0, y: exam.scienceWrong || 0, net: exam.science !== undefined ? exam.science : (exam.scienceCorrect - (exam.scienceWrong||0)/3) },
              inkilap: { d: exam.inkilapCorrect || 0, y: exam.inkilapWrong || 0, net: exam.inkilap !== undefined ? exam.inkilap : (exam.inkilapCorrect - (exam.inkilapWrong||0)/3) },
              ingilizce: { d: exam.englishCorrect || 0, y: exam.englishWrong || 0, net: exam.english !== undefined ? exam.english : (exam.englishCorrect - (exam.englishWrong||0)/3) },
              din: { d: exam.dinCorrect || 0, y: exam.dinWrong || 0, net: exam.din !== undefined ? exam.din : (exam.dinCorrect - (exam.dinWrong||0)/3) },
            };
          } else {
            subjectsObj = {
              turkce: { d: exam.turkishCorrect || 0, y: exam.turkishWrong || 0, net: exam.turkish !== undefined ? exam.turkish : (exam.turkishCorrect - (exam.turkishWrong||0)/4) },
              matematik: { d: exam.mathCorrect || 0, y: exam.mathWrong || 0, net: exam.math !== undefined ? exam.math : (exam.mathCorrect - (exam.mathWrong||0)/4) },
              fen: { d: exam.scienceCorrect || 0, y: exam.scienceWrong || 0, net: exam.science !== undefined ? exam.science : (exam.scienceCorrect - (exam.scienceWrong||0)/4) },
              sosyal: { d: exam.socialCorrect || 0, y: exam.socialWrong || 0, net: exam.social !== undefined ? exam.social : (exam.socialCorrect - (exam.socialWrong||0)/4) },
            };
          }
        }
        const subjKeys = Object.keys(subjectsObj);

        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
          }} onClick={() => setSelectedTrialModal(null)}>
            <div className="card" style={{
              width: '100%', maxWidth: 750, maxHeight: '85vh', overflowY: 'auto',
              background: 'white', border: '1px solid #cbd5e1', borderRadius: 24, padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative'
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                    📊 {exam.title} — ÖSYM Hedef Karşılaştırması
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    {student.name || student.email} ({isLgs ? 'LGS (3 Yanlış 1 Doğru)' : 'YKS (4 Yanlış 1 Doğru)'}) — Tarih: {exam.date}
                  </p>
                </div>
                <button onClick={() => setSelectedTrialModal(null)} style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, display: 'block' }}>DENEME TOPLAM NET</span>
                  <strong style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: 900, fontFamily: 'monospace' }}>{exam.total}</strong>
                </div>
                <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'block' }}>ÖSYM TOPLAM HEDEF</span>
                  <strong style={{ fontSize: '1.8rem', color: '#14532d', fontWeight: 900, fontFamily: 'monospace' }}>
                    {isLgs ? (osym.lgs ? (osym.lgs.lgs_turkce_d - (osym.lgs.lgs_turkce_y||0)/3 + osym.lgs.lgs_mat_d - (osym.lgs.lgs_mat_y||0)/3 + osym.lgs.lgs_fen_d - (osym.lgs.lgs_fen_y||0)/3 + osym.lgs.lgs_inkilap_d - (osym.lgs.lgs_inkilap_y||0)/3 + osym.lgs.lgs_ing_d - (osym.lgs.lgs_ing_y||0)/3 + osym.lgs.lgs_din_d - (osym.lgs.lgs_din_y||0)/3).toFixed(1) : '-')
                           : (osym.yks ? (osym.yks.tyt_turkce_d - (osym.yks.tyt_turkce_y||0)/4 + osym.yks.tyt_mat_d - (osym.yks.tyt_mat_y||0)/4 + osym.yks.tyt_fen_d - (osym.yks.tyt_fen_y||0)/4 + osym.yks.tyt_sosyal_d - (osym.yks.tyt_sosyal_y||0)/4).toFixed(1) : '-')}
                  </strong>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, display: 'block' }}>GENEL DURUM</span>
                  <strong style={{ fontSize: '1.2rem', color: '#92400e', fontWeight: 800, display: 'block', marginTop: '0.35rem' }}>
                    {osym ? '📈 Analiz Hazır' : '⚠️ Hedef Girilmemiş'}
                  </strong>
                </div>
              </div>

              <h4 style={{ margin: '0 0 1rem', color: '#1e293b', fontSize: '1.05rem', fontWeight: 800 }}>Ders Bazlı Doğru - Yanlış - Net ve Hedef Karşılaştırması</h4>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800 }}>Ders Adı</th>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800, textAlign: 'center' }}>Deneme (D / Y)</th>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800, textAlign: 'center' }}>Deneme Neti</th>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800, textAlign: 'center' }}>Hedef (D / Y)</th>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800, textAlign: 'center' }}>Hedef Neti</th>
                      <th style={{ padding: '0.75rem 0.6rem', fontWeight: 800, textAlign: 'right' }}>Fark & Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjKeys.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Ders detay verisi bulunamadı.</td>
                      </tr>
                    ) : (
                      subjKeys.map(key => {
                        const sData = subjectsObj[key] || {};
                        const d = Number(sData.d || 0);
                        const y = Number(sData.y || 0);
                        const net = sData.net !== undefined ? Number(sData.net) : parseFloat((d - y / ratio).toFixed(2));
                        const targetData = getOsymSubjectTargetData(key);
                        const targetNet = targetData ? targetData.net : getOsymSubjectTarget(key);
                        const diff = targetNet !== null && targetNet !== undefined ? parseFloat((net - targetNet).toFixed(2)) : null;

                        return (
                          <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.8rem 0.6rem', fontWeight: 700, color: '#1e293b' }}>
                              {subjectNames[key] || key.toUpperCase()}
                            </td>
                            <td style={{ padding: '0.8rem 0.6rem', textAlign: 'center', color: '#64748b' }}>
                              <span style={{ color: '#10b981', fontWeight: 700 }}>{d} D</span> / <span style={{ color: '#ef4444', fontWeight: 700 }}>{y} Y</span>
                            </td>
                            <td style={{ padding: '0.8rem 0.6rem', textAlign: 'center', fontWeight: 800, color: '#1e3a8a', fontSize: '0.95rem' }}>
                              {net.toFixed(2)}
                            </td>
                            <td style={{ padding: '0.8rem 0.6rem', textAlign: 'center', color: '#64748b' }}>
                              {targetData ? (
                                <>
                                  <span style={{ color: '#10b981', fontWeight: 700 }}>{targetData.d} D</span> / <span style={{ color: '#ef4444', fontWeight: 700 }}>{targetData.y} Y</span>
                                </>
                              ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                            </td>
                            <td style={{ padding: '0.8rem 0.6rem', textAlign: 'center', fontWeight: 700, color: '#475569' }}>
                              {targetNet !== null && targetNet !== undefined ? targetNet.toFixed(2) : <span style={{ color: '#cbd5e1' }}>—</span>}
                            </td>
                            <td style={{ padding: '0.8rem 0.6rem', textAlign: 'right' }}>
                              {diff !== null ? (
                                <span style={{
                                  padding: '0.25rem 0.6rem', borderRadius: 12, fontWeight: 800, fontSize: '0.75rem',
                                  background: diff >= 0 ? '#dcfce7' : '#fee2e2',
                                  color: diff >= 0 ? '#15803d' : '#b91c1c', display: 'inline-block'
                                }}>
                                  {diff >= 0 ? `🎉 +${diff} (Hedef Aşıldı)` : `⚠️ ${diff} (Hedefin Altında)`}
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hedef Girilmemiş</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() => setSelectedTrialModal(null)} style={{ padding: '0.65rem 1.75rem', fontWeight: 800 }}>
                  Kapat & Panele Dön
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CoachDashboard;
