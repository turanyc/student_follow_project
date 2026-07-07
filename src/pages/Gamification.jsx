import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, PlusCircle, Star, Flame, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { getTreeLevel } from '../components/TreeWidget';

const Gamification = () => {
  const { currentUser } = useAuth();
  const [studyHours, setStudyHours] = useState(0);
  const [treePoints, setTreePoints] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStudyHours(data.totalStudyHours || 0);
        setTreePoints(data.treePoints || data.totalStudyHours || 0);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddHour = async () => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      totalStudyHours: increment(1),
      treePoints: increment(1)
    });
  };

  const { level, label, icon, color, isLegendary } = getTreeLevel(0, treePoints || studyHours);

  // SVG representation for the tree (Levels 0 to 7)
  const renderTreeSvg = (lvl) => {
    const isGold = lvl >= 5;
    const isMythic = lvl >= 7;

    return (
      <svg viewBox="-25 -25 250 240" width="100%" height="100%" style={{ overflow: 'visible' }} className={lvl > 1 ? "tree-sway" : ""}>
        <defs>
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="leafGradPremium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <linearGradient id="leafGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="leafGradMythic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground & Halo */}
        {isGold && (
          <ellipse cx="100" cy="180" rx="80" ry="14" fill="rgba(234, 179, 8, 0.25)" filter="url(#glow)" />
        )}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill={isGold ? "rgba(202, 138, 4, 0.4)" : "rgba(16, 185, 129, 0.2)"} />

        {/* Level 0: Tohum / Level 1: Filiz */}
        {lvl >= 0 && lvl <= 1 && (
           <motion.path 
             initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
             d="M100 180 Q90 160 100 150 Q110 160 100 180" fill="url(#leafGrad)" 
           />
        )}

        {/* Level 2: Fidan */}
        {lvl === 2 && (
          <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <path d="M95 180 L95 120 L105 120 L105 180 Z" fill="url(#trunkGrad)" />
            <circle cx="100" cy="110" r="25" fill="url(#leafGrad)" />
          </motion.g>
        )}

        {/* Level 3: Genç Ağaç */}
        {lvl === 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <path d="M92 180 L94 90 L106 90 L108 180 Z" fill="url(#trunkGrad)" />
            <path d="M94 120 Q80 100 70 100" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M106 130 Q120 110 130 110" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            
            <circle cx="100" cy="80" r="35" fill="url(#leafGradPremium)" />
            <circle cx="65" cy="95" r="20" fill="url(#leafGrad)" />
            <circle cx="135" cy="105" r="20" fill="url(#leafGrad)" />
          </motion.g>
        )}

        {/* Level 4: Ulu Ağaç */}
        {lvl === 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
             <path d="M90 180 L92 60 L108 60 L110 180 Z" fill="url(#trunkGrad)" />
             <path d="M92 140 Q60 110 50 100" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
             <path d="M108 120 Q140 90 150 80" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
             <path d="M96 90 Q70 60 60 50" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
             <path d="M104 80 Q130 50 140 40" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

             <circle cx="100" cy="50" r="45" fill="url(#leafGradPremium)" />
             <circle cx="50" cy="80" r="35" fill="url(#leafGrad)" />
             <circle cx="150" cy="70" r="35" fill="url(#leafGrad)" />
             <circle cx="65" cy="45" r="30" fill="url(#leafGradPremium)" />
             <circle cx="135" cy="40" r="30" fill="url(#leafGradPremium)" />
          </motion.g>
        )}

        {/* Level 5 & 6: Altın Hareli Bilge / Kutsal Işıltılı */}
        {lvl >= 5 && lvl <= 6 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
             {/* Golden Halo Ring */}
             <circle cx="100" cy="70" r="85" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 6" filter="url(#glow)">
               <animateTransform attributeName="transform" type="rotate" from="0 100 70" to="360 100 70" dur="20s" repeatCount="indefinite" />
             </circle>

             <path d="M88 180 L90 50 L110 50 L112 180 Z" fill="url(#trunkGrad)" />
             <path d="M90 130 Q50 100 35 90" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
             <path d="M110 120 Q150 90 165 80" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />

             <circle cx="100" cy="50" r="60" fill={lvl === 6 ? "url(#leafGradGold)" : "url(#leafGradPremium)"} filter="url(#glow)" />
             <circle cx="40" cy="70" r="45" fill={lvl === 6 ? "url(#leafGradGold)" : "url(#leafGradPremium)"} filter="url(#glow)" />
             <circle cx="160" cy="60" r="45" fill={lvl === 6 ? "url(#leafGradGold)" : "url(#leafGradPremium)"} filter="url(#glow)" />
             
             {/* Sparkles */}
             {[
               { cx: 80, cy: 30 }, { cx: 120, cy: 40 }, { cx: 50, cy: 50 }, { cx: 150, cy: 65 },
               { cx: 100, cy: 20 }, { cx: 70, cy: 80 }, { cx: 130, cy: 85 }
             ].map((s, idx) => (
               <circle key={idx} cx={s.cx} cy={s.cy} r={idx % 2 === 0 ? "5" : "3"} fill="#fef08a" filter="url(#glow)">
                 <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + idx * 0.3}s`} repeatCount="indefinite" />
               </circle>
             ))}
          </motion.g>
        )}

        {/* Level 7: Devasa Efsanevi Hayat Ağacı (200+ Puan) */}
        {isMythic && (
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8 }}>
             {/* Double Golden & Mystic Halos */}
             <circle cx="100" cy="80" r="95" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="10 5" filter="url(#goldGlow)">
               <animateTransform attributeName="transform" type="rotate" from="0 100 80" to="360 100 80" dur="25s" repeatCount="indefinite" />
             </circle>
             <circle cx="100" cy="80" r="75" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 8" filter="url(#glow)">
               <animateTransform attributeName="transform" type="rotate" from="360 100 80" to="0 100 80" dur="15s" repeatCount="indefinite" />
             </circle>

             {/* Massive Ancient Trunk with Glowing Runes */}
             <path d="M84 180 L88 40 L112 40 L116 180 Z" fill="url(#trunkGrad)" />
             <path d="M96 160 L100 130 L104 150 L98 100 L102 70" stroke="#fbbf24" strokeWidth="3" fill="none" filter="url(#glow)" opacity="0.8">
               <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
             </path>

             {/* Ancient Branches */}
             <path d="M88 130 Q40 90 20 80" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
             <path d="M112 120 Q160 80 180 70" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
             <path d="M92 80 Q60 40 45 30" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
             <path d="M108 70 Q140 30 155 20" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />

             {/* Mystic & Gold Canopy */}
             <circle cx="100" cy="45" r="65" fill="url(#leafGradMythic)" filter="url(#goldGlow)" />
             <circle cx="35" cy="65" r="50" fill="url(#leafGradGold)" filter="url(#glow)" />
             <circle cx="165" cy="55" r="50" fill="url(#leafGradGold)" filter="url(#glow)" />
             <circle cx="65" cy="25" r="40" fill="url(#leafGradPremium)" filter="url(#glow)" />
             <circle cx="135" cy="25" r="40" fill="url(#leafGradPremium)" filter="url(#glow)" />
             <circle cx="100" cy="10" r="35" fill="#fde047" opacity="0.6" filter="url(#goldGlow)" />

             {/* Floating Particle Stars */}
             {[
               { cx: 30, cy: 30 }, { cx: 170, cy: 35 }, { cx: 100, cy: 5 }, { cx: 60, cy: 60 },
               { cx: 140, cy: 65 }, { cx: 20, cy: 100 }, { cx: 180, cy: 95 }, { cx: 85, cy: 20 },
               { cx: 115, cy: 20 }, { cx: 50, cy: 110 }, { cx: 150, cy: 110 }
             ].map((p, idx) => (
               <g key={idx} transform={`translate(${p.cx}, ${p.cy})`}>
                 <circle r={idx % 2 === 0 ? "5" : "4"} fill="#ffffff" filter="url(#goldGlow)">
                   <animate attributeName="r" values="2;6;2" dur={`${1.2 + idx * 0.2}s`} repeatCount="indefinite" />
                 </circle>
                 <path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke="#fbbf24" strokeWidth="1.5">
                   <animateTransform attributeName="transform" type="rotate" from="0" to="180" dur={`${3 + idx * 0.5}s`} repeatCount="indefinite" />
                 </path>
               </g>
             ))}
          </motion.g>
        )}
      </svg>
    );
  };

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
            Pomodoro tamamladıkça ve çalıştıkça ağacın evrimleşir. 200 Puan üstünde Devasa Efsanevi Hayat Ağacına ulaş!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
          <button className="btn btn-primary" onClick={handleAddHour} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 800 }}>
            <PlusCircle size={20} /> +1 Puan / Saat Test Ekle
          </button>
          <div className="card glass-panel" style={{ padding: '0.75rem 2rem', textAlign: 'center', margin: 0, background: 'white', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.6rem', fontWeight: 900 }}>{treePoints || studyHours} Puan</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Kümülatif Başarı</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Current Tree View */}
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '640px', padding: '2.5rem', background: isLegendary ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'white',
          border: `2px solid ${isLegendary ? '#fbbf24' : '#e2e8f0'}`, borderRadius: 24,
          boxShadow: isLegendary ? '0 10px 40px rgba(251,191,36,0.25)' : '0 4px 15px rgba(0,0,0,0.03)',
          position: 'relative', overflow: 'visible'
        }}>
          {isLegendary && (
            <div style={{ position: 'absolute', top: 20, right: 20, background: '#f59e0b', color: 'white', padding: '0.45rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', zIndex: 10 }}>
              <Sparkles size={16} /> EFSANEVİ EVRİM
            </div>
          )}
          <h2 style={{ marginBottom: '1.5rem', color: '#1e293b', fontWeight: 800, fontSize: '1.6rem', textAlign: 'center' }}>Mevcut Ağaç Formun</h2>
          <div style={{ width: '100%', maxWidth: '480px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem auto' }}>
            {renderTreeSvg(level)}
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ color: isLegendary ? '#d97706' : '#10b981', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
              Seviye {level} — {label}
            </h3>
            <p style={{ color: '#64748b', margin: '0.5rem 0 0', fontWeight: 600 }}>
              {level >= 7 ? '🌟 Tebrikler! Platformun en ulu, altın hareli efsanevi ağacına ulaştın!' : `Bir sonraki evrim aşaması için odaklı çalışmaya devam et!`}
            </p>
          </div>
        </div>

        {/* Level Progression Table / Legend */}
        <div className="card" style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 24 }}>
          <h3 style={{ margin: '0 0 1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <Award size={22} color="#f59e0b" /> Ağaç Evrim Haritası & Hedefler
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { lvl: 1, title: 'Filiz Formu 🌿', req: '1 - 5 Puan / Pomodoro', color: '#6ee7b7', desc: 'Öğrenme yolculuğuna ilk adımlar.' },
              { lvl: 2, title: 'Fidan Formu 🪴', req: '5 - 20 Puan', color: '#34d399', desc: 'Temeller güçleniyor ve kökler derinleşiyor.' },
              { lvl: 3, title: 'Genç Ağaç 🌲', req: '20 - 50 Puan', color: '#10b981', desc: 'Düzenli çalışma disiplini kazanılıyor.' },
              { lvl: 4, title: 'Ulu Ağaç 🌳', req: '50 - 100 Puan', color: '#059669', desc: 'Sağlam ve yıkılmaz bir çalışma düzeni.' },
              { lvl: 5, title: 'Altın Hareli Bilge Ağaç 🌟', req: '100 - 150 Puan', color: '#eab308', desc: 'Altın hareli özel parıltı ve bilge form.' },
              { lvl: 6, title: 'Kutsal Işıltılı Ağaç ✨', req: '150 - 200 Puan', color: '#f59e0b', desc: 'Parlayan partiküller ve kutsal hale.' },
              { lvl: 7, title: 'Devasa Efsanevi Hayat Ağacı 🌲✨', req: '200+ Puan', color: '#ca8a04', desc: 'Çift altın hale, rünler, partiküller ve sonsuz bilgelik!' },
            ].map(item => {
              const isCurrent = level === item.lvl || (level === 0 && item.lvl === 1);
              return (
                <div key={item.lvl} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', borderRadius: 14,
                  background: isCurrent ? `${item.color}15` : '#f8fafc',
                  border: `1.5px solid ${isCurrent ? item.color : '#f1f5f9'}`,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.title.split(' ')[item.title.split(' ').length - 1]}</span>
                    <div>
                      <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.9rem', fontWeight: 800 }}>{item.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 8, background: isCurrent ? item.color : '#e2e8f0', color: isCurrent ? 'white' : '#475569', fontSize: '0.75rem', fontWeight: 800 }}>
                      {item.req}
                    </span>
                    {isCurrent && <span style={{ display: 'block', fontSize: '0.68rem', color: item.color, fontWeight: 800, marginTop: '0.2rem' }}>◄ ŞU AN BURADASIN</span>}
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
