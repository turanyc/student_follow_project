import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, PlusCircle, Star, Flame, Sparkles, Award, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc, increment, collection } from 'firebase/firestore';
import { getTreeLevel } from '../components/TreeWidget';
import StudyHeatmapCalendar from '../components/StudyHeatmapCalendar';
import AnimatedTreeSvg from '../components/AnimatedTreeSvg';

const LEVEL_DATA = [
  { lvl: 1, title: 'Filiz Formu', req: '1 - 5 Puan / Pomodoro', color: '#6ee7b7', desc: 'Öğrenme yolculuğuna ilk adımlar.' },
  { lvl: 2, title: 'Fidan Formu', req: '5 - 20 Puan', color: '#34d399', desc: 'Temeller güçleniyor ve kökler derinleşiyor.' },
  { lvl: 3, title: 'Genç Ağaç', req: '20 - 50 Puan', color: '#10b981', desc: 'Düzenli çalışma disiplini kazanılıyor.' },
  { lvl: 4, title: 'Gür Ağaç', req: '50 - 100 Puan', color: '#059669', desc: 'Sağlam ve yıkılmaz bir çalışma düzeni.' },
  { lvl: 5, title: 'Köklü Çınar', req: '100 - 150 Puan', color: '#eab308', desc: 'Altın hareli özel parıltı ve bilge form.' },
  { lvl: 6, title: 'Asırlık Çınar', req: '150 - 200 Puan', color: '#f59e0b', desc: 'Parlayan partiküller ve kutsal hale.' },
  { lvl: 7, title: 'Bilge Ağaç', req: '200 - 300 Puan', color: '#ca8a04', desc: 'Çift altın hale, rünler, partiküller ve sonsuz bilgelik!' },
  { lvl: 8, title: 'Orman Ruhu', req: '300 - 400 Puan', color: '#a855f7', desc: 'Mor galaktik hale, yıldız yörüngeleri ve kozmik enerji!' },
  { lvl: 9, title: 'Hayat Ağacı', req: '400 - 500 Puan', color: '#06b6d4', desc: 'Turkuaz yıldırımlar, enerji halkaları ve yıldızlararası usta!' },
  { lvl: 10, title: 'Zirve Ağacı', req: '500+ Puan', color: '#ec4899', desc: '3 katmanlı kozmik taç, elmas partiküller ve mutlak ölümsüzlük form!' },
];

const getPointsForLevel = (lvl) => {
  switch (lvl) {
    case 0: return 0;
    case 1: return 3;
    case 2: return 12;
    case 3: return 35;
    case 4: return 75;
    case 5: return 125;
    case 6: return 175;
    case 7: return 250;
    case 8: return 350;
    case 9: return 450;
    case 10: return 600;
    default: return 0;
  }
};

const Gamification = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studyHours, setStudyHours] = useState(0);
  const [treePoints, setTreePoints] = useState(0);
  const [sessionHours, setSessionHours] = useState(0);
  const [previewLevel, setPreviewLevel] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStudyHours(data.totalStudyHours || 0);
        setTreePoints(data.treePoints || data.totalStudyHours || 0);
      }
    });

    const sessionsRef = collection(db, 'users', currentUser.uid, 'studySessions');
    const unsubSessions = onSnapshot(sessionsRef, (snap) => {
      let totalMins = 0;
      snap.forEach(d => {
        totalMins += parseFloat(d.data().durationMinutes || 0);
      });
      setSessionHours(Math.floor(totalMins / 60));
    });

    const handleLocalAdd = (e) => {
      const addVal = Number(e.detail?.added || 1);
      setTreePoints(prev => Number(prev || 0) + addVal);
      setSessionHours(prev => Number(prev || 0) + addVal);
    };
    window.addEventListener('treePointAdded', handleLocalAdd);

    return () => {
      unsubUser();
      unsubSessions();
      window.removeEventListener('treePointAdded', handleLocalAdd);
    };
  }, [currentUser]);

  const effectivePoints = Math.max(Number(treePoints || 0), Number(studyHours || 0), Number(sessionHours || 0));
  const { level, label, icon, color, isLegendary } = getTreeLevel(0, effectivePoints);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Outfit, sans-serif' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Leaf size={32} color="var(--success-color)" /> Öğrenme & Yaşam Ağacın
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b' }}>
            Pomodoro tamamladıkça ve çalıştıkça ağacın evrimleşir. 200 Puan üstünde Bilge Ağaç seviyesine ulaş!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
          <div className="card glass-panel" style={{ padding: '0.85rem 1.75rem', textAlign: 'center', margin: 0, background: 'white', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.65rem', fontWeight: 900 }}>
              {Number(effectivePoints).toFixed(1).replace(/\.0$/, '')} Puan
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Kümülatif Başarı</span>
            <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.35rem', background: '#ecfdf5', padding: '0.35rem 0.65rem', borderRadius: 8, border: '1px solid #a7f3d0' }}>
              💡 1 saat çalışma = 1 Kümülatif Puan
            </div>
          </div>
        </div>
      </div>

      {/* Competition Jump Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)',
        color: 'white', padding: '1.25rem 1.75rem', borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', boxShadow: '0 8px 24px rgba(49, 46, 129, 0.25)',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #fbbf24, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
            🏆
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
              Diğer Öğrencilerin Ağaçlarıyla & Çalışma Süreleriyle Yarış!
            </h3>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', opacity: 0.85 }}>
              Canlı çalışma arenasında bugün kim kaç saat çalıştı incele, sıralamana bak ve rakiplerini geride bırak!
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/leaderboard')}
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#78350f',
            border: 'none', borderRadius: 14, padding: '0.7rem 1.3rem', fontSize: '0.9rem',
            fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)', transition: 'all 0.2s', flexShrink: 0
          }}
        >
          ⚔️ Canlı Liderlik Tablosuna Git →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Current Tree View */}
        {(() => {
          const activeLevel = previewLevel !== null ? previewLevel : level;
          const activePoints = previewLevel !== null ? getPointsForLevel(previewLevel) : effectivePoints;
          const activeTree = getTreeLevel(0, activePoints);
          const activeItem = LEVEL_DATA.find(i => i.lvl === activeLevel);
          const displayLabel = activeItem ? activeItem.title : label;
          const isLgnd = activeLevel >= 5;

          return (
            <div className="card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '580px', padding: '1.75rem', background: '#ffffff',
              border: `2px solid ${previewLevel !== null ? '#8b5cf6' : isLgnd ? '#fbbf24' : '#e2e8f0'}`, borderRadius: 24,
              boxShadow: previewLevel !== null ? '0 10px 40px rgba(139, 92, 246, 0.25)' : isLgnd ? '0 10px 40px rgba(251,191,36,0.25)' : '0 4px 15px rgba(0,0,0,0.03)',
              position: 'relative', overflow: 'visible'
            }}>
              {previewLevel !== null && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                  margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white',
                  padding: '0.45rem 1.25rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 800,
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)', whiteSpace: 'nowrap'
                }}>
                  <span>👁️ ÖNİZLEME: Seviye {previewLevel}</span>
                  <button
                    onClick={() => setPreviewLevel(null)}
                    style={{
                      background: 'white', color: '#6366f1', border: 'none', borderRadius: 10,
                      padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer'
                    }}
                  >
                    👉 Kendi Ağacına Dön
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {isLgnd && previewLevel === null && (
                  <div style={{ background: '#f59e0b', color: 'white', padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                    <Sparkles size={16} /> EFSANEVİ EVRİM
                  </div>
                )}
                <h2 style={{ margin: 0, color: previewLevel !== null ? '#8b5cf6' : '#1e293b', fontWeight: 800, fontSize: '1.6rem', textAlign: 'center' }}>
                  {previewLevel !== null ? `Önizlenen Ağaç Formu` : `Mevcut Ağaç Formun`}
                </h2>
              </div>
              <div style={{ width: '100%', maxWidth: '480px', minHeight: '360px', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem auto' }}>
                <AnimatedTreeSvg level={activeLevel} points={Number(activePoints).toFixed(1).replace(/\.0$/, '')} />
              </div>
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ color: previewLevel !== null ? '#8b5cf6' : isLgnd ? '#d97706' : '#10b981', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
                  Seviye {activeLevel} — {displayLabel}
                </h3>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0', fontWeight: 600 }}>
                  {previewLevel !== null
                    ? `👆 ${activeItem?.desc || ''} (Gereksinim: ${activeItem?.req || ''})`
                    : activeLevel >= 10 ? '👑 Muazzam! Platformun en üstün Zirve Ağacına ulaştın!' : activeLevel >= 7 ? '🌟 Tebrikler! Efsanevi kozmik evrim aşamasındasın!' : `Bir sonraki evrim aşaması için odaklı çalışmaya devam et!`}
                </p>
              </div>
            </div>
          );
        })()}



        {/* Level Progression Table / Legend */}
        <div className="card" style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', margin: '0 0 1.5rem' }}>
            <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <Award size={22} color="#f59e0b" /> Ağaç Evrim Haritası & Hedefler
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#f3e8ff', color: '#7e22ce', padding: '0.35rem 0.8rem', borderRadius: 12, fontWeight: 800, border: '1px solid #d8b4fe' }}>
              👆 Önizlemek için herhangi bir ağaca tıkla!
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {LEVEL_DATA.map(item => {
              const isCurrent = level === item.lvl || (level === 0 && item.lvl === 1);
              const isPreviewed = previewLevel === item.lvl;
              return (
                <div key={item.lvl}
                  onClick={() => setPreviewLevel(item.lvl)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.85rem 1rem', borderRadius: 14,
                    background: isPreviewed ? '#f3e8ff' : isCurrent ? `${item.color}15` : '#f8fafc',
                    border: `1.5px solid ${isPreviewed ? '#8b5cf6' : isCurrent ? item.color : '#f1f5f9'}`,
                    boxShadow: isPreviewed ? '0 4px 15px rgba(139, 92, 246, 0.25)' : 'none',
                    cursor: 'pointer', transition: 'all 0.2s',
                    transform: isPreviewed ? 'scale(1.02)' : 'scale(1)'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: `${item.color}20`, color: item.color, flexShrink: 0 }}>
                      S{item.lvl}
                    </span>
                    <div>
                      <strong style={{ display: 'block', color: isPreviewed ? '#6b21a8' : '#1e293b', fontSize: '0.9rem', fontWeight: 800 }}>{item.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 8, background: isPreviewed ? '#8b5cf6' : isCurrent ? item.color : '#e2e8f0', color: (isPreviewed || isCurrent) ? 'white' : '#475569', fontSize: '0.75rem', fontWeight: 800 }}>
                      {item.req}
                    </span>
                    {isPreviewed && <span style={{ display: 'block', fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 900, marginTop: '0.25rem' }}>👁️ ŞU AN ÖNİZLENİYOR</span>}
                    {!isPreviewed && isCurrent && <span style={{ display: 'block', fontSize: '0.68rem', color: item.color, fontWeight: 800, marginTop: '0.2rem' }}>◄ SENİN SEVİYEN</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


    </motion.div>
  );
};

export default Gamification;
