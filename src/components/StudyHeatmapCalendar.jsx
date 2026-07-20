import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Flame, Trophy, Clock, Star,
  ChevronLeft, ChevronRight, Award, Zap, CheckCircle2,
  Sparkles, X, TrendingUp, Filter, Info
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Helper to format minutes cleanly
const formatMins = (mins = 0) => {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0 && m > 0) return `${h}sa ${m}dk`;
  if (h > 0) return `${h} saat`;
  return `${m} dk`;
};

// Color scaling for light-mode heatmap
const getHeatmapStyle = (minutes = 0) => {
  if (minutes <= 0) return { bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b', label: 'Çalışma Yok', icon: '💤' };
  if (minutes < 60) return { bg: '#d1fae5', border: '#6ee7b7', color: '#065f46', label: 'Hafif Odak', icon: '🌱' };
  if (minutes < 120) return { bg: '#6ee7b7', border: '#34d399', color: '#064e3b', label: 'İyi Çalışma', icon: '🌿' };
  if (minutes < 240) return { bg: '#10b981', border: '#059669', color: '#ffffff', label: 'Harika Efor', icon: '🌲' };
  if (minutes < 360) return { bg: '#06b6d4', border: '#0891b2', color: '#ffffff', label: 'Kozmik Seviye', icon: '⚡' };
  return { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: '#d97706', color: '#1e1b4b', label: 'Efsanevi Zirve!', icon: '👑', isLegendary: true };
};

const StudyHeatmapCalendar = ({ studentId, studentName, isCoachView = false }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('heatmap'); // 'heatmap' | 'calendar'
  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedInfoDay, setSelectedInfoDay] = useState(null);

  const heatmapScrollRef = useRef(null);
  useEffect(() => {
    if (activeTab === 'heatmap' && heatmapScrollRef.current && !loading && sessions.length > 0) {
      heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
    }
  }, [activeTab, sessions, loading]);

  // Calendar month state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Subscribe to student studySessions
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users', studentId, 'studySessions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessions(list);
        setLoading(false);
      },
      (err) => {
        console.error('StudySessions yüklenemedi:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [studentId]);

  // Aggregate daily stats: { 'YYYY-MM-DD': { totalMinutes, sessions: [] } }
  const dailyStats = useMemo(() => {
    const map = {};
    sessions.forEach(sess => {
      let dateStr = sess.date;
      if (!dateStr && sess.startedAt) {
        dateStr = sess.startedAt.split('T')[0];
      }
      if (!dateStr) return;

      if (!map[dateStr]) {
        map[dateStr] = { totalMinutes: 0, sessions: [], date: dateStr };
      }
      const mins = parseFloat(sess.durationMinutes || 0);
      map[dateStr].totalMinutes += mins;
      map[dateStr].sessions.push(sess);
    });
    return map;
  }, [sessions]);

  // Compute stats: Today, This Month, Streaks, Best Day
  const stats = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    const todayMins = dailyStats[todayStr]?.totalMinutes || 0;

    let thisMonthMins = 0;
    const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    let bestDay = { date: '-', minutes: 0 };

    Object.entries(dailyStats).forEach(([dStr, data]) => {
      if (data && dStr.startsWith(monthPrefix)) {
        thisMonthMins += (data.totalMinutes || 0);
      }
      if (data && (data.totalMinutes || 0) > bestDay.minutes) {
        bestDay = { date: dStr, minutes: data.totalMinutes || 0 };
      }
    });

    // Streaks calculation
    const allDates = Object.keys(dailyStats)
      .filter(d => (dailyStats[d]?.totalMinutes || 0) > 0)
      .sort();

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const checkDate = new Date(today);
    let checkStr = checkDate.toISOString().split('T')[0];

    if (!dailyStats[checkStr] || (dailyStats[checkStr]?.totalMinutes || 0) <= 0) {
      checkDate.setDate(checkDate.getDate() - 1);
      checkStr = checkDate.toISOString().split('T')[0];
    }

    if (dailyStats[checkStr] && (dailyStats[checkStr]?.totalMinutes || 0) > 0) {
      const cur = new Date(checkStr);
      while (true) {
        const dStr = cur.toISOString().split('T')[0];
        if (dailyStats[dStr] && (dailyStats[dStr]?.totalMinutes || 0) > 0) {
          currentStreak++;
          cur.setDate(cur.getDate() - 1);
        } else {
          break;
        }
      }
    }

    if (allDates.length > 0) {
      tempStreak = 1;
      bestStreak = 1;
      for (let i = 1; i < allDates.length; i++) {
        const prev = new Date(allDates[i - 1]);
        const curr = new Date(allDates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
    }

    return {
      todayMins,
      thisMonthMins,
      currentStreak,
      bestStreak,
      bestDay
    };
  }, [dailyStats, today]);

  // Generate last 365 days for Heatmap grid
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 364);

    const firstDayOfWeek = startDate.getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < offset; i++) {
      currentWeek.push({ empty: true, data: { totalMinutes: 0, sessions: [] } });
    }

    const cur = new Date(startDate);
    while (cur <= endDate) {
      const dateStr = cur.toISOString().split('T')[0];
      const data = dailyStats[dateStr] || { totalMinutes: 0, sessions: [], date: dateStr };
      currentWeek.push({ dateStr, data, dateObj: new Date(cur) });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      cur.setDate(cur.getDate() + 1);
    }

    if (currentWeek.length > 0 && currentWeek.length < 7) {
      while (currentWeek.length < 7) {
        currentWeek.push({ empty: true, data: { totalMinutes: 0, sessions: [] } });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [dailyStats]);

  // Generate calendar grid for active month
  const monthCalendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDayOfWeek = firstDay.getDay();
    let offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const grid = [];
    for (let i = 0; i < offset; i++) {
      grid.push({ empty: true, key: `empty-start-${i}`, data: { totalMinutes: 0, sessions: [] } });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const data = dailyStats[dateStr] || { totalMinutes: 0, sessions: [], date: dateStr };
      grid.push({ empty: false, day, dateStr, data, key: dateStr });
    }

    while (grid.length % 7 !== 0) {
      grid.push({ empty: true, key: `empty-end-${grid.length}`, data: { totalMinutes: 0, sessions: [] } });
    }

    return grid;
  }, [currentYear, currentMonth, dailyStats]);

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 24,
        padding: '2rem',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        fontFamily: 'Outfit, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: '#ecfdf5', color: '#059669', padding: '0.35rem 0.8rem',
              borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, border: '1px solid #a7f3d0',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
            }}>
              <Flame size={14} color="#f59e0b" /> <span>{isCoachView ? `${studentName || 'Öğrenci'} Takvimi` : 'ANLIK ÇALIŞMA HARİTAN'}</span>
            </span>
            {stats.currentStreak >= 3 && (
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', padding: '0.35rem 0.8rem',
                borderRadius: 20, fontSize: '0.78rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <span>🔥 {stats.currentStreak} GÜNLÜK SERİ!</span>
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1e293b' }}>
            <CalendarIcon size={26} color="#10b981" /> <span>Çalışma Takvimi & Isı Haritası</span>
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.92rem' }}>
            {isCoachView ? `Öğrencinin son 1 yıllık çalışma yoğunluğu ve seans geçmişi.` : `Her gün çalışarak takvimini yemyeşil yap, serilerini büyüt ve efsanevi formlara ulaş!`}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', background: '#f1f5f9', padding: '0.35rem',
          borderRadius: 14, border: '1px solid #e2e8f0', gap: '0.35rem'
        }}>
          <button
            onClick={() => setActiveTab('heatmap')}
            style={{
              padding: '0.55rem 1.1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === 'heatmap' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'heatmap' ? 'white' : '#64748b', fontWeight: 800, fontSize: '0.85rem',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <Flame size={16} /> Yıllık Isı Haritası
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '0.55rem 1.1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === 'calendar' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'calendar' ? 'white' : '#64748b', fontWeight: 800, fontSize: '0.85rem',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <CalendarIcon size={16} /> Aylık Etkileşimli Takvim
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: '1.4rem' }}>⏱</div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Bugünkü Çalışma</span>
            <strong style={{ display: 'block', fontSize: '1.35rem', color: '#059669', fontWeight: 900, marginTop: '0.15rem' }}>{loading ? '...' : formatMins(stats.todayMins)}</strong>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '1.4rem' }}>📅</div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Bu Ayki Efor</span>
            <strong style={{ display: 'block', fontSize: '1.35rem', color: '#4f46e5', fontWeight: 900, marginTop: '0.15rem' }}>{loading ? '...' : formatMins(stats.thisMonthMins)}</strong>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '1.4rem' }}>🔥</div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Mevcut Seri (Streak)</span>
            <strong style={{ display: 'block', fontSize: '1.35rem', color: '#d97706', fontWeight: 900, marginTop: '0.15rem' }}>{loading ? '...' : `${stats.currentStreak} Gün`}</strong>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', fontSize: '1.4rem' }}>🏆</div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>En Uzun Seri</span>
            <strong style={{ display: 'block', fontSize: '1.35rem', color: '#db2777', fontWeight: 900, marginTop: '0.15rem' }}>{loading ? '...' : `${stats.bestStreak} Gün`}</strong>
          </div>
        </div>
      </div>

      {/* TAB 1: HEATMAP GRID */}
      {activeTab === 'heatmap' && (
        <div
          style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: 20, border: '1px solid #e2e8f0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#10b981" /> Son 1 Yıllık Çalışma Yoğunluğu Haritası
            </h4>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              <span>Daha Az</span>
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#f1f5f9', border: '1px solid #e2e8f0' }} title="0 dakika" />
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#d1fae5', border: '1px solid #6ee7b7' }} title="< 1 saat" />
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#6ee7b7', border: '1px solid #34d399' }} title="1 - 2 saat" />
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#10b981', border: '1px solid #059669' }} title="2 - 4 saat" />
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#06b6d4', border: '1px solid #0891b2' }} title="4 - 6 saat" />
              <span style={{ width: 13, height: 13, borderRadius: 3, background: '#fbbf24', border: '1px solid #d97706' }} title="6+ saat (Efsanevi)" />
              <span>Daha Fazla</span>
            </div>
          </div>

          {/* Static Compact Info Box Above Grid (No Layout Shift / No Jump) */}
          <div style={{
            minHeight: 48, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14,
            padding: '0.65rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            {selectedInfoDay || (hoveredDay && hoveredDay.data) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 800, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {getHeatmapStyle((selectedInfoDay || hoveredDay)?.data?.totalMinutes || 0).icon}
                </span>
                <span style={{ color: '#1e293b' }}>
                  Tarih: {(selectedInfoDay || hoveredDay)?.dateStr || '-'}
                </span>
                <span style={{ color: '#059669', background: '#d1fae5', padding: '0.2rem 0.65rem', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                  ⏱️ Çalışılan Süre: {formatMins((selectedInfoDay || hoveredDay)?.data?.totalMinutes || 0)}
                </span>
                {((selectedInfoDay || hoveredDay)?.data?.sessions?.length || 0) > 0 && (
                  <span style={{ color: '#475569', fontSize: '0.78rem', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                    {(selectedInfoDay || hoveredDay)?.data?.sessions?.length} Seans Tamamlandı
                  </span>
                )}
              </div>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>
                💡 Çalışılan süreyi ve detayları hemen burada incelemek için takvimdeki karelerden birine tıklayın.
              </span>
            )}
            {(selectedInfoDay || hoveredDay)?.data?.totalMinutes > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedDayModal((selectedInfoDay || hoveredDay).data); }}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', border: 'none', borderRadius: 10,
                  padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)', transition: 'all 0.2s'
                }}
              >
                Seans Detaylarını Aç ➔
              </button>
            )}
          </div>

          {/* Grid Container */}
          <div ref={heatmapScrollRef} style={{ overflowX: 'auto', paddingBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            {/* Day of week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '0.6rem', fontSize: '0.68rem', color: '#64748b', fontWeight: 700, paddingTop: '1px' }}>
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                <span key={day} style={{ height: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}>{day}</span>
              ))}
            </div>

            {/* Heatmap Columns */}
            <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {week.map((dayItem, dIdx) => {
                    if (dayItem.empty || !dayItem.data) {
                      return <div key={dIdx} style={{ width: 14, height: 14, borderRadius: 3, background: 'transparent' }} />;
                    }
                    const totalMins = dayItem.data?.totalMinutes || 0;
                    const styleInfo = getHeatmapStyle(totalMins);
                    const isToday = dayItem.dateStr === today.toISOString().split('T')[0];
                    return (
                      <motion.div
                        key={dayItem.dateStr || dIdx}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        onClick={() => { setSelectedInfoDay(dayItem); setHoveredDay(dayItem); }}
                        onMouseEnter={() => setHoveredDay(dayItem)}
                        onMouseLeave={() => setHoveredDay(null)}
                        style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: styleInfo.bg,
                          border: isToday ? '1.5px solid #10b981' : `1px solid ${styleInfo.border}`,
                          cursor: totalMins > 0 ? 'pointer' : 'default',
                          position: 'relative',
                          boxShadow: styleInfo.isLegendary ? '0 0 8px rgba(251,191,36,0.6)' : isToday ? '0 0 6px rgba(16,185,129,0.4)' : 'none',
                          transition: 'background 0.2s'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY INTERACTIVE CALENDAR */}
      {activeTab === 'calendar' && (
        <div
          style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: 20, border: '1px solid #e2e8f0' }}
        >
          {/* Month Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => changeMonth(-1)}
                style={{
                  width: 38, height: 38, borderRadius: 10, background: '#ffffff',
                  border: '1px solid #e2e8f0', color: '#1e293b', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, minWidth: 160, textAlign: 'center', color: '#1e293b' }}>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => changeMonth(1)}
                style={{
                  width: 38, height: 38, borderRadius: 10, background: '#ffffff',
                  border: '1px solid #e2e8f0', color: '#1e293b', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
              style={{
                padding: '0.45rem 1rem', borderRadius: 10, background: '#eef2ff',
                border: '1px solid #c7d2fe', color: '#4f46e5', fontWeight: 800,
                fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Bugüne Dön
            </button>
          </div>

          {/* Static Compact Info Box Above Monthly Grid (No Layout Shift / No Jump) */}
          <div style={{
            minHeight: 48, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14,
            padding: '0.65rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            {selectedInfoDay || (hoveredDay && hoveredDay.data) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 800, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {getHeatmapStyle((selectedInfoDay || hoveredDay)?.data?.totalMinutes || 0).icon}
                </span>
                <span style={{ color: '#1e293b' }}>
                  Tarih: {(selectedInfoDay || hoveredDay)?.dateStr || '-'}
                </span>
                <span style={{ color: '#059669', background: '#d1fae5', padding: '0.2rem 0.65rem', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                  ⏱️ Çalışılan Süre: {formatMins((selectedInfoDay || hoveredDay)?.data?.totalMinutes || 0)}
                </span>
                {((selectedInfoDay || hoveredDay)?.data?.sessions?.length || 0) > 0 && (
                  <span style={{ color: '#475569', fontSize: '0.78rem', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                    {(selectedInfoDay || hoveredDay)?.data?.sessions?.length} Seans Tamamlandı
                  </span>
                )}
              </div>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>
                💡 Çalışılan süreyi ve detayları hemen burada incelemek için takvimdeki günlerden birine tıklayın.
              </span>
            )}
            {(selectedInfoDay || hoveredDay)?.data?.totalMinutes > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedDayModal((selectedInfoDay || hoveredDay).data); }}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', border: 'none', borderRadius: 10,
                  padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)', transition: 'all 0.2s'
                }}
              >
                Seans Detaylarını Aç ➔
              </button>
            )}
          </div>

          <style>{`
            .calendar-responsive-wrapper {
              width: 100%;
              overflow-x: hidden;
            }
            .calendar-responsive-grid {
              width: 100%;
            }
            @media (max-width: 768px) {
              .calendar-responsive-grid {
                width: 100% !important;
              }
              .calendar-day-cell {
                min-height: 54px !important;
                padding: 0.25rem !important;
                border-radius: 8px !important;
              }
              .calendar-day-num {
                font-size: 0.72rem !important;
              }
              .calendar-day-icon {
                font-size: 0.8rem !important;
              }
              .calendar-day-badge {
                padding: 0.1rem 0.2rem !important;
                border-radius: 5px !important;
              }
              .calendar-day-badge strong {
                font-size: 0.62rem !important;
                line-height: 1 !important;
              }
              .calendar-day-badge span {
                display: none !important;
              }
              .calendar-grid-gap {
                gap: 0.25rem !important;
              }
            }
            @media (max-width: 480px) {
              .calendar-day-cell {
                min-height: 48px !important;
                padding: 0.15rem !important;
              }
              .calendar-day-num {
                font-size: 0.68rem !important;
              }
              .calendar-day-icon {
                font-size: 0.72rem !important;
              }
              .calendar-day-badge strong {
                font-size: 0.58rem !important;
              }
              .day-modal-box {
                padding: 1.25rem !important;
                max-width: 92vw !important;
              }
            }
          `}</style>

          {/* Fully Responsive Grid Container */}
          <div className="calendar-responsive-wrapper">
            <div className="calendar-responsive-grid">
              {/* Weekday headers */}
              <div className="calendar-grid-gap" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(dayName => (
                  <span key={dayName} style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    {dayName}
                  </span>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="calendar-grid-gap" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem' }}>
                {monthCalendarGrid.map(cell => {
                  if (cell.empty) {
                    return <div key={cell.key} className="calendar-day-cell" style={{ minHeight: 90, background: '#f1f5f9', borderRadius: 14, border: '1px solid #e2e8f0' }} />;
                  }

                  const totalMins = cell.data?.totalMinutes || 0;
                  const styleInfo = getHeatmapStyle(totalMins);
                  const isToday = cell.dateStr === today.toISOString().split('T')[0];

                  return (
                    <motion.div
                      key={cell.key}
                      whileHover={{ scale: 1.03, y: -2 }}
                      onClick={() => { setSelectedInfoDay(cell); setHoveredDay(cell); }}
                      onMouseEnter={() => setHoveredDay(cell)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="calendar-day-cell"
                      style={{
                        minHeight: 90, borderRadius: 14, padding: '0.65rem',
                        background: totalMins > 0 ? '#ffffff' : '#f8fafc',
                        border: isToday ? '2px solid #10b981' : `1px solid ${totalMins > 0 ? styleInfo.border : '#e2e8f0'}`,
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        cursor: totalMins > 0 ? 'pointer' : 'default',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: totalMins > 0 ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Top: Day number & status icon */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="calendar-day-num" style={{
                          fontSize: '0.9rem', fontWeight: 800,
                          color: isToday ? '#10b981' : totalMins > 0 ? '#1e293b' : '#64748b',
                          background: isToday ? '#d1fae5' : 'transparent',
                          padding: isToday ? '0.1rem 0.4rem' : 0, borderRadius: 6
                        }}>
                          <span>{cell.day}</span> {isToday && <span>✨</span>}
                        </span>
                        <span className="calendar-day-icon" style={{ fontSize: '1.1rem' }}>{styleInfo.icon}</span>
                      </div>

                      {/* Bottom: Duration badge */}
                      <div style={{ marginTop: '0.4rem' }}>
                        {totalMins > 0 ? (
                          <div className="calendar-day-badge" style={{
                            background: styleInfo.bg, padding: '0.3rem 0.5rem', borderRadius: 8,
                            border: `1px solid ${styleInfo.border}`, textAlign: 'center'
                          }}>
                            <strong style={{ fontSize: '0.78rem', color: styleInfo.color === '#ffffff' ? '#065f46' : styleInfo.color, display: 'block', fontWeight: 900 }}>
                              {formatMins(totalMins)}
                            </strong>
                            <span style={{ fontSize: '0.65rem', color: styleInfo.color === '#ffffff' ? '#065f46' : styleInfo.color, opacity: 0.9, fontWeight: 700 }}>
                              {cell.data?.sessions?.length || 0} Pomodoro/Seans
                            </span>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', opacity: 0.4, fontSize: '0.72rem', color: '#94a3b8', padding: '0.2rem 0' }}>
                            -
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Day Details & Session Breakdown */}
      <AnimatePresence>
        {selectedDayModal && (
          <motion.div
            key="day-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
            }} onClick={() => setSelectedDayModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="day-modal-box"
              style={{
                background: '#ffffff',
                borderRadius: 24, padding: '2rem', maxWidth: 520, width: '100%',
                maxHeight: '85vh', overflowY: 'auto',
                border: '1px solid #e2e8f0',
                boxShadow: '0 25px 60px rgba(0,0,0,0.15)', color: '#1e293b', position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedDayModal(null)}
                style={{
                  position: 'absolute', top: 18, right: 18, width: 34, height: 34,
                  borderRadius: '50%', background: '#f1f5f9', border: '1px solid #e2e8f0',
                  color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: '#d1fae5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
                }}>
                  {getHeatmapStyle(selectedDayModal?.totalMinutes || 0).icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#1e293b' }}>
                    🗓 {selectedDayModal?.date || '-'} Çalışma Raporu
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>
                    Toplam Efor: {formatMins(selectedDayModal?.totalMinutes || 0)} — {getHeatmapStyle(selectedDayModal?.totalMinutes || 0).label}
                  </p>
                </div>
              </div>

              {/* Motivational Badge Banner */}
              <div style={{
                background: '#ecfdf5',
                padding: '1rem', borderRadius: 14, border: '1px solid #a7f3d0',
                display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'
              }}>
                <Sparkles size={24} color="#059669" />
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5, fontWeight: 600 }}>
                  {(selectedDayModal?.totalMinutes || 0) >= 240
                    ? '✨ Efsanevi bir çalışma günü! Ağacına muazzam derecede yaşam enerjisi ve puan kattın.'
                    : '🌱 İstikrarlı adımlar başarıyı getirir. Harika bir konsantrasyon örneği gösterildi!'}
                </p>
              </div>

              <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#10b981" /> Gün İçindeki Çalışma / Pomodoro Kayıtları
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 280, overflowY: 'auto', paddingRight: '0.4rem' }}>
                {selectedDayModal.sessions.map((sess, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc', padding: '0.85rem 1.1rem',
                    borderRadius: 12, border: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{sess.type === 'pomodoro' ? '🍅' : '⏱'}</span>
                      <div>
                        <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.9rem', fontWeight: 800 }}>
                          {sess.type === 'pomodoro' ? 'Pomodoro Odak Seansı' : 'Serbest Odak Çalışması'}
                        </strong>
                        {sess.startedAt && (
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Başlangıç: {new Date(sess.startedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{
                      padding: '0.3rem 0.75rem', background: '#d1fae5',
                      color: '#059669', borderRadius: 10, fontWeight: 900, fontSize: '0.85rem'
                    }}>
                      +{formatMins(sess.durationMinutes)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedDayModal(null)}
                  style={{
                    padding: '0.7rem 1.5rem', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Kapat & İncelemeye Devam Et
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyHeatmapCalendar;
