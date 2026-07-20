import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const MOOD_CONFIG = {
  great: { label: 'Harika', emoji: '🤩', color: '#10b981' },
  good: { label: 'İyi', emoji: '🙂', color: '#6366f1' },
  tired: { label: 'Yorgun', emoji: '🥱', color: '#f59e0b' },
  stressed: { label: 'Stresli', emoji: '😫', color: '#ef4444' },
  sad: { label: 'Üzgün', emoji: '😢', color: '#8b5cf6' },
  excited: { label: 'Heyecanlı', emoji: '🚀', color: '#06b6d4' },
};

const MoodAnalysis = () => {
  const { currentUser } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly');

  useEffect(() => {
    if (!currentUser) return;
    const moodRef = collection(db, 'users', currentUser.uid, 'moodHistory');
    const q = query(moodRef, orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setMoodHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  const getWeeklyData = () => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const today = new Date();
    return days.map((day, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const entries = moodHistory.filter(m => m.date === dateStr);
      const mood = entries[0]?.mood || null;
      const moodValue = mood ? { great: 5, excited: 5, good: 4, tired: 3, sad: 2, stressed: 1 }[mood] || 3 : 0;
      return { day, moodValue, mood, emoji: mood ? MOOD_CONFIG[mood]?.emoji : '-', date: dateStr };
    });
  };

  const getMonthlyData = () => {
    const now = new Date();
    const weeks = [];
    for (let w = 3; w >= 0; w--) {
      const weekEntries = moodHistory.filter(m => {
        const date = new Date(m.date);
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        return diffDays >= w * 7 && diffDays < (w + 1) * 7;
      });
      const avgMood = weekEntries.length > 0
        ? weekEntries.reduce((sum, m) => sum + ({ great: 5, excited: 5, good: 4, tired: 3, sad: 2, stressed: 1 }[m.mood] || 3), 0) / weekEntries.length
        : 0;
      weeks.push({ day: `${w === 0 ? 'Bu' : w === 1 ? 'Geçen' : `${4 - w}.`} Hafta`, moodValue: parseFloat(avgMood.toFixed(1)) });
    }
    return weeks.reverse();
  };

  const getMoodDistribution = () => {
    const counts = {};
    moodHistory.forEach(m => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([mood, count]) => ({
      name: MOOD_CONFIG[mood]?.label || mood,
      value: count,
      color: MOOD_CONFIG[mood]?.color || '#ccc',
      emoji: MOOD_CONFIG[mood]?.emoji || '😐'
    }));
  };

  const chartData = view === 'weekly' ? getWeeklyData() : getMonthlyData();
  const distribution = getMoodDistribution();
  const lastMood = moodHistory[0]?.mood;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const entry = payload[0]?.payload;
      return (
        <div style={{ background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 8 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>{label}</p>
          {entry?.emoji && entry.emoji !== '-' && (
            <p style={{ margin: 0, fontSize: '1.2rem' }}>{entry.emoji}</p>
          )}
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Puan: {payload[0]?.value} / 5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>💭 Duygu Analizi</h1>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color-alt)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button onClick={() => setView('weekly')} className={`btn ${view === 'weekly' ? 'btn-primary' : ''}`}
            style={{ background: view === 'weekly' ? 'var(--primary-color)' : 'transparent', color: view === 'weekly' ? 'white' : 'var(--text-muted)' }}>
            Haftalık
          </button>
          <button onClick={() => setView('monthly')} className={`btn ${view === 'monthly' ? 'btn-primary' : ''}`}
            style={{ background: view === 'monthly' ? 'var(--primary-color)' : 'transparent', color: view === 'monthly' ? 'white' : 'var(--text-muted)' }}>
            Aylık
          </button>
        </div>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : moodHistory.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '3rem' }}>💭</p>
          <h3>Henüz duygu verisi yok</h3>
          <p className="text-muted">Her gün açılan "Bugün Nasılsın?" modalından duygunuzu girin.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>

          {/* Ana durum */}
          <div className="card glass-panel" style={{
            background: lastMood ? `linear-gradient(135deg, ${MOOD_CONFIG[lastMood]?.color}22 0%, transparent 100%)` : undefined,
            borderColor: lastMood ? `${MOOD_CONFIG[lastMood]?.color}40` : undefined,
            textAlign: 'center', padding: '2.5rem'
          }}>
            <p style={{ fontSize: '4rem', margin: 0 }}>{lastMood ? MOOD_CONFIG[lastMood]?.emoji : '😐'}</p>
            <h3 style={{ margin: '0.5rem 0 0', color: lastMood ? MOOD_CONFIG[lastMood]?.color : 'var(--text-main)' }}>
              {lastMood ? MOOD_CONFIG[lastMood]?.label : 'Bilinmiyor'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>
              Bugünkü durumun
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              {Object.entries(MOOD_CONFIG).map(([id, m]) => (
                <div key={id} style={{ textAlign: 'center', opacity: lastMood === id ? 1 : 0.35, flex: '1 1 45px' }}>
                  <p style={{ fontSize: '1.5rem', margin: 0 }}>{m.emoji}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card glass-panel">
            <h3>{view === 'weekly' ? 'Haftalık' : 'Aylık'} Duygu Grafiği</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              5 = Harika / Heyecanlı · 4 = İyi · 3 = Yorgun · 2 = Üzgün · 1 = Stresli
            </p>
            <div style={{ height: 220, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="moodValue" name="Duygu Puanı" fill="var(--primary-color)" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={
                        entry.moodValue >= 4 ? '#10b981' :
                        entry.moodValue >= 3 ? '#6366f1' :
                        entry.moodValue >= 2 ? '#f59e0b' :
                        entry.moodValue >= 1 ? '#ef4444' : 'rgba(255,255,255,0.1)'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Distribution */}
          <div className="card glass-panel">
            <h3>Duygu Dağılımı</h3>
            {distribution.length === 0 ? (
              <p className="text-muted">Yeterli veri yok.</p>
            ) : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                      paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} %${Math.round(percent * 100)}`}
                      labelStyle={{ fontSize: 11, fontWeight: 700, fill: 'var(--text-main)' }}
                      labelLine={false}>
                      {distribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val, name) => [`${val} gün`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Son 7 gün listesi */}
          <div className="card glass-panel">
            <h3>Son Kayıtlar</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 250, overflowY: 'auto' }}>
              {moodHistory.slice(0, 14).map(entry => {
                const mc = MOOD_CONFIG[entry.mood];
                return (
                  <div key={entry.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    background: `${mc?.color}10`,
                    border: `1px solid ${mc?.color}30`,
                    borderRadius: 8
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{mc?.emoji}</span>
                      <span style={{ color: mc?.color, fontWeight: 600, fontSize: '0.875rem' }}>{mc?.label}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entry.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default MoodAnalysis;
