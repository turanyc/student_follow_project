import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, ReferenceLine
} from 'recharts';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';

// ---- Paylaşılan grafik bileşeni ----
const ExamLineChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>Henüz deneme verisi bulunmuyor.</div>;
  }
  const WINDOW = 20; // Ekranda gösterilen deneme sayısı
  const [offset, setOffset] = useState(0);
  const [activeLines, setActiveLines] = useState({ total: true, math: true, turkish: true, science: true, social: true });

  // Her veri noktası için Önceki net - Şimdiki net farkını hesapla
  const dataWithDelta = data.map((d, i) => ({
    ...d,
    delta: i > 0 && d?.total !== undefined && data[i - 1]?.total !== undefined ? parseFloat((d.total - data[i - 1].total).toFixed(2)) : 0
  }));

  const maxOffset = Math.max(0, dataWithDelta.length - WINDOW);
  const windowData = dataWithDelta.slice(offset, offset + WINDOW);

  const handleScroll = (dir) => {
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + dir * Math.ceil(WINDOW / 2))));
  };

  const toggleLine = (key) => setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const LINES = [
    { key: 'total', label: 'Toplam Net', color: '#a5b4fc', width: 2.5 },
    { key: 'math', label: 'Matematik', color: '#f59e0b', width: 1.5 },
    { key: 'turkish', label: 'Türkçe', color: '#10b981', width: 1.5 },
    { key: 'science', label: 'Fen', color: '#06b6d4', width: 1.5 },
    { key: 'social', label: 'Sosyal', color: '#f472b6', width: 1.5 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const delta = payload.find(p => p.dataKey === 'total')?.payload?.delta;
    return (
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        padding: '0.75rem 1rem', borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        minWidth: 180
      }}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#a5b4fc' }}>
          {label}
        </p>
        {payload.map((entry, i) => (
          <p key={i} style={{ margin: '0.2rem 0', color: entry.color, fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>{entry.name}</span>
            <strong>{entry.value}</strong>
          </p>
        ))}
        {delta !== undefined && delta !== 0 && (
          <p style={{
            margin: '0.5rem 0 0', fontSize: '0.8rem', fontWeight: 700,
            color: delta > 0 ? '#10b981' : '#ef4444',
            borderTop: '1px solid #334155', paddingTop: '0.4rem'
          }}>
            {delta > 0 ? '▲' : '▼'} {Math.abs(delta)} net {delta > 0 ? 'artış' : 'düşüş'}
          </p>
        )}
      </div>
    );
  };

  // XAxis tick: çok fazla veri varsa kısalt
  const CustomTick = ({ x, y, payload }) => {
    const text = payload.value.length > 10 ? payload.value.slice(0, 10) + '…' : payload.value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={14} textAnchor="end" fill="#64748b" fontSize={10} transform="rotate(-35)">
          {text}
        </text>
      </g>
    );
  };

  if (data.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      <BarChart2 size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
      <p>Henüz deneme verisi yok.</p>
    </div>
  );

  return (
    <div>
      {/* Legend / Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {LINES.map(l => (
          <button key={l.key} onClick={() => toggleLine(l.key)} style={{
            padding: '0.25rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', cursor: 'pointer',
            border: `1px solid ${activeLines[l.key] ? l.color : '#334155'}`,
            background: activeLines[l.key] ? `${l.color}20` : 'transparent',
            color: activeLines[l.key] ? l.color : '#64748b',
            transition: 'all 0.15s', fontWeight: 600
          }}>
            ● {l.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={windowData} margin={{ top: 8, right: 16, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={true} />
            <XAxis
              dataKey="name"
              tick={<CustomTick />}
              interval={0}
              stroke="#334155"
            />
            <YAxis
              stroke="#334155"
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />

            {LINES.map(l => activeLines[l.key] && (
              <Line
                key={l.key}
                type="linear"
                dataKey={l.key}
                name={l.label}
                stroke={l.color}
                strokeWidth={l.width}
                dot={{ r: data.length <= 20 ? 4 : 2, fill: l.color, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pagination */}
      {data.length > WINDOW && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <button
            onClick={() => handleScroll(-1)}
            disabled={offset === 0}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid #334155',
              borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer',
              color: offset === 0 ? '#475569' : '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}
          >
            <ChevronLeft size={16} /> Önceki
          </button>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {offset + 1}–{Math.min(offset + WINDOW, data.length)} / {data.length} deneme
          </span>
          <button
            onClick={() => handleScroll(1)}
            disabled={offset >= maxOffset}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid #334155',
              borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer',
              color: offset >= maxOffset ? '#475569' : '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}
          >
            Sonraki <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Mini trend indicators */}
      {data.length >= 2 && (() => {
        const last5 = data.slice(-5);
        const trend = last5[last5.length - 1].total - last5[0].total;
        const best = Math.max(...data.map(d => d.total));
        const worst = Math.min(...data.map(d => d.total));
        return (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Son 5 Deneme Trendi', val: trend > 0 ? `▲ +${trend.toFixed(1)}` : `▼ ${trend.toFixed(1)}`, color: trend >= 0 ? '#10b981' : '#ef4444' },
              { label: 'En Yüksek', val: best.toFixed(1), color: '#f59e0b' },
              { label: 'En Düşük', val: worst.toFixed(1), color: '#94a3b8' },
              { label: 'Ortalama', val: (data.reduce((s, d) => s + d.total, 0) / data.length).toFixed(1), color: '#a5b4fc' },
            ].map(stat => (
              <div key={stat.label} style={{
                flex: 1, minWidth: 100, padding: '0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid #334155',
                borderRadius: 8, textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{stat.label}</p>
                <p style={{ margin: 0, fontWeight: 800, color: stat.color, fontSize: '1rem' }}>{stat.val}</p>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
};

// ---- Ana Analytics Sayfası ----
const Analytics = ({ studentId: propStudentId, studentName }) => {
  const { currentUser } = useAuth();
  const uid = propStudentId || currentUser?.uid;

  const [examProgression, setExamProgression] = useState([]);
  const [strengthData, setStrengthData] = useState([
    { subject: 'Matematik', A: 0, fullMark: 100 },
    { subject: 'Türkçe', A: 0, fullMark: 100 },
    { subject: 'Fen Bilimleri', A: 0, fullMark: 100 },
    { subject: 'Sosyal Bilgiler', A: 0, fullMark: 100 }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const examsRef = collection(db, 'users', uid, 'trialExams');
    const q = query(examsRef, orderBy('date', 'asc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const exams = [];
      let mathSum = 0, turkishSum = 0, scienceSum = 0, socialSum = 0;

      snapshot.forEach(doc => {
        const d = doc.data();
        exams.push({
          name: d.title || 'Deneme',
          math: parseFloat((d.math || 0).toFixed(2)),
          turkish: parseFloat((d.turkish || 0).toFixed(2)),
          science: parseFloat((d.science || 0).toFixed(2)),
          social: parseFloat((d.social || 0).toFixed(2)),
          total: parseFloat((d.total || 0).toFixed(2)),
        });
        mathSum += d.math || 0;
        turkishSum += d.turkish || 0;
        scienceSum += d.science || 0;
        socialSum += d.social || 0;
      });

      setExamProgression(exams);

      const count = exams.length || 1;
      setStrengthData([
        { subject: 'Matematik', A: Math.min(100, Math.round((mathSum / count) / 40 * 100)), fullMark: 100 },
        { subject: 'Türkçe', A: Math.min(100, Math.round((turkishSum / count) / 40 * 100)), fullMark: 100 },
        { subject: 'Fen Bilimleri', A: Math.min(100, Math.round((scienceSum / count) / 20 * 100)), fullMark: 100 },
        { subject: 'Sosyal Bilgiler', A: Math.min(100, Math.round((socialSum / count) / 20 * 100)), fullMark: 100 }
      ]);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const CustomRadarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.8rem' }}>
        <p style={{ margin: 0, color: '#a5b4fc', fontWeight: 700 }}>{payload[0]?.payload?.subject}</p>
        <p style={{ margin: 0, color: '#10b981' }}>Hakimiyet: %{payload[0]?.value}</p>
      </div>
    );
  };

  const isEmbedded = !!propStudentId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {!isEmbedded && <h1 style={{ marginBottom: '2rem' }}>📈 İstatistiksel Analiz</h1>}
      {studentName && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 10
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            {studentName[0]?.toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{studentName}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— Deneme analizi</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Veriler yükleniyor...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Main Chart — full width */}
          <div className="card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Net Gelişim Grafiği</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Her deneme için keskin net değişimleri • {examProgression.length} deneme
                </p>
              </div>
            </div>
            <ExamLineChart data={examProgression} />
          </div>

          {/* Radar — konu hakimiyeti */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card glass-panel" style={{ height: 380 }}>
              <h3>Konu Hakimiyeti</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Hangi derslerde daha güçlüsün?</p>
              <div style={{ width: '100%', height: '85%', marginTop: '0.5rem' }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={strengthData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 12 }} />
                    <Radar name="Hakimiyet %" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                    <Tooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Son 10 deneme özeti tablosu */}
            <div className="card" style={{ height: 420, overflowY: 'auto', background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#000000', fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.75rem', borderBottom: '2px solid #000000', paddingBottom: '0.5rem' }}>📊 Son Denemeler (Net ve Detaylı Tablo)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #000000', background: '#f1f5f9' }}>
                    {['Deneme', 'Mat', 'Tür', 'Fen', 'Sos', 'Toplam'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 0.75rem', textAlign: h === 'Deneme' ? 'left' : 'center', color: '#000000', fontWeight: 900, fontSize: '1rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...examProgression].reverse().slice(0, 15).map((exam, i, arr) => {
                    const prev = arr[i + 1];
                    const delta = prev ? exam.total - prev.total : null;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #cbd5e1', background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#000000', fontWeight: 800, fontSize: '0.95rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exam.name}
                        </td>
                        {[exam.math, exam.turkish, exam.science, exam.social].map((v, vi) => (
                          <td key={vi} style={{ padding: '0.65rem 0.75rem', textAlign: 'center', color: '#000000', fontWeight: 700, fontSize: '0.95rem' }}>{v}</td>
                        ))}
                        <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 900, color: '#000000', fontSize: '1.05rem', background: '#e2e8f0' }}>
                          {exam.total}
                          {delta !== null && (
                            <span style={{ fontSize: '0.75rem', color: delta >= 0 ? '#059669' : '#dc2626', marginLeft: 4, fontWeight: 900 }}>
                              {delta >= 0 ? `▲+${delta.toFixed(1)}` : `▼${delta.toFixed(1)}`}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
