import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Trophy, Flame, Star, Clock, Zap, Target, User, Heart,
  TrendingUp, CheckCircle, PlusCircle, Sparkles, Shield, Crown,
  ChevronRight, RefreshCw, AlertCircle, BarChart2, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection, query, where, onSnapshot, getDocs, setDoc, doc,
  addDoc, updateDoc, increment, orderBy, serverTimestamp, limit
} from 'firebase/firestore';
import { getTreeLevel } from '../components/TreeWidget';
import Swal from 'sweetalert2';

// Sample students to populate if arena has fewer students or for instant simulation
const SAMPLE_RIVALS = [
  {
    id: 'rival-1',
    name: 'Efe Yılmaz',
    email: 'efe.yilmaz@ogrenci.com',
    role: 'student',
    status: 'studying',
    studySessionStart: new Date(Date.now() - 42 * 60000).toISOString(),
    totalStudyHours: 145.5,
    treePoints: 148,
    todayMinutes: 230, // ~3sa 50dk
    motto: 'Zirveye sadece hiç durmayanlar ulaşır. 🔥'
  },
  {
    id: 'rival-2',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@ogrenci.com',
    role: 'student',
    status: 'not-studying',
    totalStudyHours: 198.0,
    treePoints: 205,
    todayMinutes: 285, // ~4sa 45dk
    motto: 'Bugün küçümsenen her dakika, yarınki başarının temelidir. 🌟'
  },
  {
    id: 'rival-3',
    name: 'Mert Demir',
    email: 'mert.demir@ogrenci.com',
    role: 'student',
    status: 'studying',
    studySessionStart: new Date(Date.now() - 15 * 60000).toISOString(),
    totalStudyHours: 88.2,
    treePoints: 92,
    todayMinutes: 165, // ~2sa 45dk
    motto: 'Her pomodoro hayalime bir adım daha yakın! 🎯'
  },
  {
    id: 'rival-4',
    name: 'Ayşe Şahin',
    email: 'ayse.sahin@ogrenci.com',
    role: 'student',
    status: 'not-studying',
    totalStudyHours: 112.4,
    treePoints: 115,
    todayMinutes: 190, // ~3sa 10dk
    motto: 'Asla pes etme, asırlık çınar ol! 🌿'
  },
  {
    id: 'rival-5',
    name: 'Burak Can',
    email: 'burak.can@ogrenci.com',
    role: 'student',
    status: 'studying',
    studySessionStart: new Date(Date.now() - 50 * 60000).toISOString(),
    totalStudyHours: 64.0,
    treePoints: 66,
    todayMinutes: 120, // 2sa
    motto: 'Azim ve odak her engeli aşar. ⚡'
  }
];

const LiveLeaderboard = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today'); // today | alltime | tree
  const [pinnedRivalId, setPinnedRivalId] = useState(() => localStorage.getItem('pinnedRivalId') || null);
  const [cheeredIds, setCheeredIds] = useState({});
  const [seeding, setSeeding] = useState(false);

  // Fetch all students and their study sessions for today
  useEffect(() => {
    if (!currentUser) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // Listen to users collection for students
    const qUsers = query(collection(db, 'users'), where('role', '==', 'student'), limit(200));
    const unsubUsers = onSnapshot(qUsers, async (usersSnap) => {
      const loadedUsers = [];

      // For each student, get their today's study sessions
      for (const d of usersSnap.docs) {
        const udata = d.data();
        let todayMins = 0;

        try {
          // Check studySessions subcollection for today
          const qSess = query(collection(db, 'users', d.id, 'studySessions'), where('date', '==', todayStr), limit(50));
          const sessSnap = await getDocs(qSess);
          sessSnap.forEach(sDoc => {
            todayMins += Number(sDoc.data().durationMinutes || 0);
          });
        } catch (err) {
          console.error('Study session query error for user', d.id, err);
        }

        // Also check if user has active studying status right now to add elapsed live minutes
        let activeElapsedMins = 0;
        if (udata.status === 'studying' && udata.studySessionStart) {
          const startMs = new Date(udata.studySessionStart).getTime();
          if (!isNaN(startMs)) {
            const diffMins = Math.floor((Date.now() - startMs) / 60000);
            if (diffMins > 0 && diffMins < 300) {
              activeElapsedMins = diffMins;
            }
          }
        }

        loadedUsers.push({
          id: d.id,
          ...udata,
          name: udata.name || udata.email?.split('@')[0] || 'Öğrenci',
          todayMinutes: todayMins + activeElapsedMins,
          totalStudyHours: Number(udata.totalStudyHours || 0),
          treePoints: Number(udata.treePoints || udata.totalStudyHours || 0),
          isCurrent: d.id === currentUser.uid
        });
      }

      // If fewer than 3 students are found in database, merge with realistic sample rivals so arena is competitive!
      let combined = [...loadedUsers];
      if (loadedUsers.length < 4) {
        const existingIds = new Set(loadedUsers.map(u => u.id));
        SAMPLE_RIVALS.forEach(sample => {
          if (!existingIds.has(sample.id) && sample.id !== currentUser.uid) {
            combined.push({
              ...sample,
              isSample: true,
              isCurrent: false
            });
          }
        });
      }

      setStudents(combined);
      setLoading(false);
    }, (err) => {
      console.error('Leaderboard users error:', err);
      setLoading(false);
    });

    // Also set interval to refresh live elapsed timers every 60s
    const timerId = setInterval(() => {
      setStudents(prev => prev.map(s => {
        if (s.status === 'studying' && s.studySessionStart) {
          const startMs = new Date(s.studySessionStart).getTime();
          if (!isNaN(startMs)) {
            const diffMins = Math.floor((Date.now() - startMs) / 60000);
            if (diffMins > 0 && diffMins < 300) {
              return { ...s, todayMinutes: (s.baseTodayMinutes || s.todayMinutes) + 1 };
            }
          }
        }
        return s;
      }));
    }, 60000);

    return () => {
      unsubUsers();
      clearInterval(timerId);
    };
  }, [currentUser]);

  // Sort students based on active timeframe selection
  const sortedStudents = [...students].sort((a, b) => {
    if (timeframe === 'today') {
      return (b.todayMinutes || 0) - (a.todayMinutes || 0);
    } else if (timeframe === 'alltime') {
      return (b.totalStudyHours || 0) - (a.totalStudyHours || 0);
    } else {
      return (b.treePoints || 0) - (a.treePoints || 0);
    }
  });

  // Find logged user's ranking
  const myIndex = sortedStudents.findIndex(s => s.isCurrent || s.id === currentUser?.uid);
  const myRank = myIndex !== -1 ? myIndex + 1 : sortedStudents.length + 1;
  const myData = myIndex !== -1 ? sortedStudents[myIndex] : null;
  const studentAboveMe = myIndex > 0 ? sortedStudents[myIndex - 1] : null;

  // Pin rival
  const handlePinRival = (id) => {
    if (pinnedRivalId === id) {
      setPinnedRivalId(null);
      localStorage.removeItem('pinnedRivalId');
    } else {
      setPinnedRivalId(id);
      localStorage.setItem('pinnedRivalId', id);
      Swal.fire({
        icon: 'success',
        title: '⚔️ Rakip Belirlendi!',
        text: 'Bu öğrenciyi günlük hedefin olarak işaretledin. Onu geçmek için odaklanmaya devam et!',
        timer: 2500,
        showConfirmButton: false
      });
    }
  };

  // Cheer / Fire up another student (with real notification & XP reward)
  const handleCheer = async (id, name) => {
    setCheeredIds(prev => ({ ...prev, [id]: true }));
    try {
      if (id && currentUser) {
        // Send to target user's personal notifications
        await addDoc(collection(db, 'users', id, 'notifications'), {
          title: '🔥 Biri Seni Ateşledi!',
          message: `${currentUser.displayName || 'Bir sınıf arkadaşın'} çalışma arenasında seni tebrik edip çalışma ateşi yolladı! (+5 Puan kazandın!)`,
          type: 'cheer',
          fromName: currentUser.displayName || 'Sınıf Arkadaşın',
          createdAt: serverTimestamp(),
          isRead: false
        });
        // Also add to global notifications for dashboard listen
        await addDoc(collection(db, 'notifications'), {
          userId: id,
          userName: name || 'Öğrenci',
          subject: '🔥 Biri Seni Ateşledi!',
          message: `${currentUser.displayName || 'Bir sınıf arkadaşın'} çalışma arenasında seni tebrik edip çalışma ateşi yolladı! (+5 Puan kazandın!)`,
          isRead: false,
          createdAt: serverTimestamp(),
        });
        // Increment profile treePoints
        await updateDoc(doc(db, 'users', id), {
          treePoints: increment(5),
          arenaCheersCount: increment(1)
        });
      }
    } catch (e) {
      console.error('Cheer notification error:', e);
    }
    Swal.fire({
      icon: 'success',
      title: '🌟 TEBRİK EDİLDİ & ATEŞLENDİ! 🌟',
      html: `<div style="font-size:1.05rem; color:#1e293b; margin-top:0.5rem;"><b>${name}</b> öğrencisine alkış ve motivasyon ateşi gönderdin!</div><div style="background:#fef3c7; border:1px solid #f59e0b; padding:0.6rem; border-radius:12px; margin-top:0.8rem; font-weight:800; color:#d97706;">🎁 +5 Başarı Puanı (XP) kazandı ve anlık bildirim iletildi!</div>`,
      timer: 3500,
      showConfirmButton: true,
      confirmButtonText: '🔥 Harika, Devam!',
      confirmButtonColor: '#f59e0b'
    });
  };

  // Seed sample students directly into Firestore if user wants full database realism
  const handleSeedToDatabase = async () => {
    if (!currentUser) return;
    setSeeding(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      for (const sample of SAMPLE_RIVALS) {
        const uRef = doc(db, 'users', sample.id);
        await setDoc(uRef, {
          name: sample.name,
          email: sample.email,
          role: 'student',
          status: sample.status,
          studySessionStart: sample.studySessionStart || null,
          totalStudyHours: sample.totalStudyHours,
          treePoints: sample.treePoints,
          motto: sample.motto
        }, { merge: true });

        // Add a study session for today
        await addDoc(collection(db, 'users', sample.id, 'studySessions'), {
          date: todayStr,
          durationMinutes: sample.todayMinutes,
          subject: '📚 Günlük Odak Seansı',
          topic: 'Yarışma Arenası Kaydı',
          startedAt: new Date(Date.now() - sample.todayMinutes * 60000).toISOString(),
          type: 'pomodoro'
        });
      }
      Swal.fire({
        icon: 'success',
        title: '🌟 Sınıf Arkadaşları Sisteme Kaydedildi!',
        text: 'Tüm yarışmacılar veritabanına eklendi ve bugünkü çalışma saatleri güncellendi.',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Kayıt eklenirken bir sorun oluştu.' });
    } finally {
      setSeeding(false);
    }
  };

  // Helper to format minutes nicely
  const formatStudyDuration = (mins = 0) => {
    if (mins <= 0) return '0 dk';
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h === 0) return `${m} dk`;
    if (m === 0) return `${h} saat`;
    return `${h}sa ${m}dk`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)',
            borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
          }} />
          <p style={{ fontWeight: 600 }}>Canlı çalışma verileri & sıralamalar hesaplanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Outfit, sans-serif' }}
    >
      <style>{`
        @keyframes arenaPulseGlow {
          0% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), inset 0 0 8px rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
          50% { box-shadow: 0 0 28px rgba(245, 158, 11, 0.85), inset 0 0 16px rgba(245, 158, 11, 0.3); border-color: #fde047; }
          100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), inset 0 0 8px rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
        }
        @keyframes silverGlow {
          0% { box-shadow: 0 0 12px rgba(148, 163, 184, 0.35), inset 0 0 6px rgba(148, 163, 184, 0.1); border-color: #94a3b8; }
          50% { box-shadow: 0 0 24px rgba(148, 163, 184, 0.7), inset 0 0 14px rgba(148, 163, 184, 0.25); border-color: #f1f5f9; }
          100% { box-shadow: 0 0 12px rgba(148, 163, 184, 0.35), inset 0 0 6px rgba(148, 163, 184, 0.1); border-color: #94a3b8; }
        }
        @keyframes bronzeGlow {
          0% { box-shadow: 0 0 12px rgba(217, 119, 6, 0.35), inset 0 0 6px rgba(217, 119, 6, 0.1); border-color: #d97706; }
          50% { box-shadow: 0 0 24px rgba(217, 119, 6, 0.7), inset 0 0 14px rgba(217, 119, 6, 0.25); border-color: #fba124; }
          100% { box-shadow: 0 0 12px rgba(217, 119, 6, 0.35), inset 0 0 6px rgba(217, 119, 6, 0.1); border-color: #d97706; }
        }
        @keyframes borderPulseRank {
          0% { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1); }
          50% { border-color: #8b5cf6; box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3); }
          100% { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1); }
        }
        .rank-glow-1 { animation: arenaPulseGlow 2.2s infinite ease-in-out !important; }
        .rank-glow-2 { animation: silverGlow 2.6s infinite ease-in-out !important; }
        .rank-glow-3 { animation: bronzeGlow 2.6s infinite ease-in-out !important; }
        .rank-glow-other { animation: borderPulseRank 3.5s infinite ease-in-out; }
      `}</style>
      {/* ── Arena Header & Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        borderRadius: 24, padding: '2.5rem 2rem', color: 'white',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(49, 46, 129, 0.35)', border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 250, height: 250,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -50, left: '30%', width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24',
              padding: '0.35rem 0.9rem', borderRadius: 99, fontSize: '0.78rem',
              fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: '0.85rem',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}>
              <Trophy size={15} /> CANLI ÇALIŞMA ARENASI & LİDERLİK
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.6rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              Bugün Kim Ne Kadar Çalıştı? 🔥
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', maxWidth: '640px', lineHeight: 1.6 }}>
              Sınıfındaki diğer öğrencilerin bugün kaç saat ders çalıştığını canlı takip et, rekabete katıl ve günün şampiyonu sen ol!
            </p>
          </div>

          {/* User's Quick Rank Box */}
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            borderRadius: 20, padding: '1.25rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: '280px'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '16px',
              background: myRank === 1 ? 'linear-gradient(135deg,#fbbf24,#d97706)' : myRank <= 3 ? 'linear-gradient(135deg,#e2e8f0,#94a3b8)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)', flexShrink: 0
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>Sıran</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>#{myRank}</span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Bugünkü Çalışman</span>
              <strong style={{ display: 'block', fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24', marginTop: '0.1rem' }}>
                {formatStudyDuration(myData?.todayMinutes || 0)}
              </strong>
              {studentAboveMe && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginTop: '0.25rem' }}>
                  <TrendingUp size={13} /> +{Math.max(1, (studentAboveMe.todayMinutes || 0) - (myData?.todayMinutes || 0) + 1)} dk ile #{myRank - 1}. sıraya çık!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeframe & Action Bar ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.4rem', background: 'white', padding: '0.35rem',
          borderRadius: 14, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
          width: '100%'
        }}>
          {[
            { id: 'today',   label: '🔥 Bugünün Liderleri (Canlı)', icon: Clock },
            { id: 'alltime', label: '🏆 Tüm Zamanlar Toplam',     icon: Award },
            { id: 'tree',    label: '🌿 Ağaç & Evrim Puanları',   icon: Star },
          ].map(tab => {
            const IconC = tab.icon;
            const active = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                  padding: '0.55rem 0.9rem', borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: active ? 'var(--gradient-primary)' : 'transparent',
                  color: active ? 'white' : '#64748b',
                  fontWeight: active ? 800 : 600, fontSize: '0.82rem',
                  boxShadow: active ? '0 4px 12px rgba(99,102,241,0.28)' : 'none',
                  transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                  flex: '1 1 auto', textAlign: 'center'
                }}
              >
                <IconC size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
          <button
            onClick={handleSeedToDatabase}
            disabled={seeding}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
              padding: '0.6rem 1rem', borderRadius: 12, border: '1.5px solid #eab308',
              background: '#fffbeb', color: '#b45309', fontWeight: 800, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(234,179,8,0.15)',
              flex: '1 1 auto', textAlign: 'center'
            }}
            title="Veritabanına diğer örnek yarışmacıları kaydeder ve günceller"
          >
            <RefreshCw size={15} className={seeding ? 'spin-anim' : ''} />
            {seeding ? 'Veriler Güncelleniyor...' : '⚡ Sınıf Arkadaşlarını & Rakipleri Yenile'}
          </button>
        </div>
      </div>

      {/* ── Top 3 Podium (Sıralama Kürsüsü) ───────────────────────────────────── */}
      {sortedStudents.length >= 3 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.25rem',
          alignItems: 'stretch', margin: '1.5rem 0 0.5rem'
        }}>
          {/* #2 Silver */}
          <PodiumCard
            student={sortedStudents[1]}
            rank={2}
            color="#64748b"
            border="#94a3b8"
            bg="linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
            height="180px"
            timeframe={timeframe}
            formatStudyDuration={formatStudyDuration}
            onCheer={handleCheer}
            cheered={cheeredIds[sortedStudents[1].id]}
          />

          {/* #1 Gold Champion */}
          <PodiumCard
            student={sortedStudents[0]}
            rank={1}
            color="#d97706"
            border="#fbbf24"
            bg="linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)"
            height="210px"
            timeframe={timeframe}
            formatStudyDuration={formatStudyDuration}
            onCheer={handleCheer}
            cheered={cheeredIds[sortedStudents[0].id]}
            isChampion
          />

          {/* #3 Bronze */}
          <PodiumCard
            student={sortedStudents[2]}
            rank={3}
            color="#b45309"
            border="#d97706"
            bg="linear-gradient(180deg, #fffcf5 0%, #ffedd5 100%)"
            height="160px"
            timeframe={timeframe}
            formatStudyDuration={formatStudyDuration}
            onCheer={handleCheer}
            cheered={cheeredIds[sortedStudents[2].id]}
          />
        </div>
      )}

      {/* ── Full Leaderboard List Table ───────────────────────────────────────── */}
      <div className="card" style={{ padding: '1.75rem', background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={22} color="#6366f1" /> Tüm Öğrenci Sıralaması ({sortedStudents.length} Yarışmacı)
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, background: '#f8fafc', padding: '0.4rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            🟢 Canlı Veriler 60 Saniyede Bir Güncellenir
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedStudents.map((s, index) => {
            const rank = index + 1;
            const isMe = s.isCurrent || s.id === currentUser?.uid;
            const isPinned = pinnedRivalId === s.id;
            const effPoints = Math.max(Number(s.treePoints || 0), Number(s.totalStudyHours || 0));
            const treeInfo = getTreeLevel(0, effPoints);

            const displayValue = timeframe === 'today'
              ? formatStudyDuration(s.todayMinutes || 0)
              : timeframe === 'alltime'
                ? `${(s.totalStudyHours || 0).toFixed(1)} Saat`
                : `${effPoints} Puan`;

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className={rank === 1 ? 'rank-glow-1' : rank === 2 ? 'rank-glow-2' : rank === 3 ? 'rank-glow-3' : 'rank-glow-other'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', borderRadius: 20,
                  background: isMe
                    ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                    : isPinned
                      ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                      : rank === 1 ? '#fffdf7' : rank === 2 ? '#fafbfc' : rank === 3 ? '#fffefc' : '#ffffff',
                  border: isMe
                    ? '2px solid #8b5cf6'
                    : isPinned
                      ? '2px solid #f59e0b'
                      : rank === 1
                        ? '2px solid #f59e0b'
                        : rank === 2
                          ? '2px solid #94a3b8'
                          : rank === 3
                            ? '2px solid #d97706'
                            : '1.5px solid #e2e8f0',
                  boxShadow: isMe ? '0 6px 20px rgba(139, 92, 246, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s', flexWrap: 'wrap', gap: '1rem'
                }}
              >
                {/* Left: Rank & Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', flex: '1 1 280px', minWidth: 0 }}>
                  {/* Rank Badge */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 14,
                    background: rank === 1 ? 'linear-gradient(135deg, #fbbf24, #d97706)' : rank === 2 ? 'linear-gradient(135deg, #cbd5e1, #64748b)' : rank === 3 ? 'linear-gradient(135deg, #fba124, #b45309)' : '#f1f5f9',
                    color: rank <= 3 ? 'white' : '#475569',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: rank <= 3 ? '1.15rem' : '0.95rem', flexShrink: 0,
                    boxShadow: rank <= 3 ? '0 4px 12px rgba(0,0,0,0.18)' : 'none'
                  }}>
                    {rank <= 3 ? (rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉') : `#${rank}`}
                  </div>

                  {/* Name & Tree Form */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.02rem', color: '#1e293b', fontWeight: 800 }}>
                        {s.name}
                      </strong>
                      {isMe && (
                        <span style={{ background: '#8b5cf6', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 8 }}>
                          👈 Sen Buradasın
                        </span>
                      )}
                      {isPinned && (
                        <span style={{ background: '#f59e0b', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          ⚔️ Hedef Rakibin
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {/* Tree Badge */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: treeInfo.color, fontWeight: 700, background: `${treeInfo.color}15`, padding: '0.2rem 0.6rem', borderRadius: 8 }}>
                        <span>{treeInfo.icon}</span> Seviye {treeInfo.level} • {treeInfo.label}
                      </span>

                      {/* Live Study Status */}
                      {s.status === 'studying' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.12)', padding: '0.2rem 0.6rem', borderRadius: 8 }}>
                          <span className="live-dot" /> 🟢 Canlı Çalışıyor!
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, background: '#f8fafc', padding: '0.2rem 0.6rem', borderRadius: 8 }}>
                          💤 Mola / Dinleniyor
                        </span>
                      )}
                    </div>

                    {s.motto && (
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{s.motto}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Study Duration & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', flex: '1 1 auto', minWidth: '220px', borderTop: '1px dashed rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                  {/* Score / Time Box */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      {timeframe === 'today' ? 'Bugün Süre' : timeframe === 'alltime' ? 'Toplam Çalışma' : 'Ağaç Puanı'}
                    </span>
                    <strong style={{ fontSize: '1.3rem', fontWeight: 900, color: rank === 1 ? '#d97706' : '#1e293b' }}>
                      {displayValue}
                    </strong>
                  </div>

                  {/* Actions (Cheer / Pin) */}
                  {!isMe && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCheer(s.id, s.name)}
                        disabled={cheeredIds[s.id]}
                        style={{
                          padding: '0.5rem 0.85rem', borderRadius: 12,
                          border: `1px solid ${cheeredIds[s.id] ? '#10b981' : '#f43f5e'}`,
                          background: cheeredIds[s.id] ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.08)',
                          color: cheeredIds[s.id] ? '#10b981' : '#f43f5e',
                          fontWeight: 800, fontSize: '0.78rem', cursor: cheeredIds[s.id] ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap'
                        }}
                        title="Motivasyon gönder"
                      >
                        <Flame size={14} fill={cheeredIds[s.id] ? '#10b981' : '#f43f5e'} />
                        {cheeredIds[s.id] ? 'Ateşlendi! 🔥' : 'Ateşle! 🔥'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePinRival(s.id)}
                        style={{
                          padding: '0.5rem 0.85rem', borderRadius: 12,
                          border: `1px solid ${isPinned ? '#f59e0b' : '#6366f1'}`,
                          background: isPinned ? '#f59e0b' : 'rgba(99,102,241,0.08)',
                          color: isPinned ? 'white' : '#6366f1',
                          fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap'
                        }}
                        title="Günlük rakibin olarak işaretle"
                      >
                        <Target size={14} />
                        {isPinned ? 'Rakibin ⚔️' : 'Hedef Seç'}
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Sub-component for Top 3 Podium Cards
const PodiumCard = ({ student, rank, color, border, bg, height, timeframe, formatStudyDuration, onCheer, cheered, isChampion }) => {
  if (!student) return null;
  const effPoints = Math.max(Number(student.treePoints || 0), Number(student.totalStudyHours || 0));
  const treeInfo = getTreeLevel(0, effPoints);
  const displayValue = timeframe === 'today'
    ? formatStudyDuration(student.todayMinutes || 0)
    : timeframe === 'alltime'
      ? `${(student.totalStudyHours || 0).toFixed(1)} Saat`
      : `${effPoints} Puan`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
      style={{
        background: bg, border: `2px solid ${border}`, borderRadius: 24,
        padding: '1.4rem 1.1rem', textAlign: 'center', position: 'relative',
        minHeight: 'auto', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', gap: '0.75rem', overflow: 'hidden',
        boxShadow: isChampion ? '0 12px 36px rgba(245,158,11,0.25)' : '0 6px 20px rgba(0,0,0,0.05)'
      }}
    >
      {/* Crown / Medal Header - Placed inside card box so it never gets clipped/cut off */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        margin: '0 auto 0.4rem',
        background: rank === 1
          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
          : rank === 2
            ? 'linear-gradient(135deg, #64748b, #475569)'
            : 'linear-gradient(135deg, #d97706, #b45309)',
        color: rank === 1 ? '#451a03' : '#ffffff',
        padding: '0.45rem 1rem', borderRadius: 99, fontWeight: 900,
        fontSize: rank === 1 ? '0.86rem' : '0.8rem',
        boxShadow: rank === 1 ? '0 4px 15px rgba(245, 158, 11, 0.35)' : '0 3px 10px rgba(0,0,0,0.15)',
        border: rank === 1 ? '1.5px solid #d97706' : rank === 2 ? '1.5px solid #334155' : '1.5px solid #92400e',
        whiteSpace: 'normal', wordBreak: 'break-word'
      }}>
        {rank === 1 ? <Crown size={16} fill="#451a03" /> : rank === 2 ? '🥈' : '🥉'}
        {rank === 1 ? '🥇 1. ŞAMPİYON' : `${rank}. SIRADA`}
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', margin: '0 0 0.25rem', wordBreak: 'break-word', lineHeight: 1.3 }}>
          {student.name}
        </h3>
        <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: treeInfo.color, background: `${treeInfo.color}15`, padding: '0.2rem 0.6rem', borderRadius: 8 }}>
          {treeInfo.icon} {treeInfo.label}
        </span>
      </div>

      <div style={{ margin: '0.4rem 0' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
          {timeframe === 'today' ? 'Bugünün Süresi' : timeframe === 'alltime' ? 'Toplam Çalışma' : 'Ağaç Puanı'}
        </span>
        <strong style={{ fontSize: isChampion ? '1.75rem' : '1.45rem', fontWeight: 900, color: color }}>
          {displayValue}
        </strong>
      </div>

      {student.status === 'studying' && (
        <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.35rem', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>
          🟢 Canlı Çalışıyor!
        </div>
      )}

      {!student.isCurrent && (
        <button
          onClick={() => onCheer(student.id, student.name)}
          disabled={cheered}
          style={{
            width: '100%', padding: '0.65rem 0.5rem', borderRadius: 12, marginTop: 'auto',
            border: 'none', background: cheered ? '#10b981' : color, color: 'white',
            fontWeight: 800, fontSize: '0.82rem', cursor: cheered ? 'default' : 'pointer',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
          }}
        >
          <Flame size={15} fill="white" /> {cheered ? 'Ateşlendi! 🔥' : 'Tebrik Et & Ateşle!'}
        </button>
      )}
    </motion.div>
  );
};

export default LiveLeaderboard;
