import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Analytics = () => {
  const { currentUser } = useAuth();
  const [examProgression, setExamProgression] = useState([]);
  const [strengthData, setStrengthData] = useState([
    { subject: 'Matematik', A: 0, fullMark: 100 },
    { subject: 'Türkçe', A: 0, fullMark: 100 },
    { subject: 'Fen Bilimleri', A: 0, fullMark: 100 },
    { subject: 'Sosyal Bilgiler', A: 0, fullMark: 100 }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
    const q = query(examsRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const exams = [];
      let mathSum = 0, turkishSum = 0, scienceSum = 0, socialSum = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        exams.push({
          name: data.title || 'Deneme',
          math: data.math,
          turkish: data.turkish,
          total: data.total
        });
        mathSum += data.math;
        turkishSum += data.turkish;
        scienceSum += data.science;
        socialSum += data.social;
      });

      setExamProgression(exams);

      const count = exams.length || 1; // avoid division by zero
      setStrengthData([
        { subject: 'Matematik', A: Math.round((mathSum / count) / 40 * 100), fullMark: 100 },
        { subject: 'Türkçe', A: Math.round((turkishSum / count) / 40 * 100), fullMark: 100 },
        { subject: 'Fen Bilimleri', A: Math.round((scienceSum / count) / 20 * 100), fullMark: 100 },
        { subject: 'Sosyal Bilgiler', A: Math.round((socialSum / count) / 20 * 100), fullMark: 100 }
      ]);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
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
      <h1 style={{ marginBottom: '2rem' }}>İstatistiksel Analiz</h1>

      {loading ? (
        <p>Veriler yükleniyor...</p>
      ) : examProgression.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Yeterli Veri Yok</h3>
          <p className="text-muted">Grafiklerin oluşması için en az bir deneme neti girmelisin.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Progression Line Chart */}
          <div className="card glass-panel" style={{ height: '450px' }}>
            <h3>Net Gelişim Grafiği</h3>
            <p style={{ fontSize: '0.85rem' }}>Zaman içerisindeki deneme netlerinin artış grafiği.</p>
            <div style={{ width: '100%', height: '80%', marginTop: '1rem' }}>
              <ResponsiveContainer>
                <LineChart data={examProgression} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Toplam Net" stroke="var(--primary-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="math" name="Matematik" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="turkish" name="Türkçe" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strength Radar Chart */}
          <div className="card glass-panel" style={{ height: '450px' }}>
            <h3>Konu Hakimiyeti</h3>
            <p style={{ fontSize: '0.85rem' }}>Hangi derslerde daha güçlüsün?</p>
            <div style={{ width: '100%', height: '80%', marginTop: '1rem' }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={strengthData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 12 }} />
                  <Radar name="Hakimiyet %" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.5} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
