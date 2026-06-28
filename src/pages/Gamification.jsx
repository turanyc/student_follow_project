import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

const Gamification = () => {
  const { currentUser } = useAuth();
  const [studyHours, setStudyHours] = useState(0); 

  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStudyHours(data.totalStudyHours || 0);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddHour = async () => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      totalStudyHours: increment(1)
    });
  };

  const getTreeLevel = (hours) => {
    if (hours >= 50) return 5;
    if (hours >= 25) return 4;
    if (hours >= 10) return 3;
    if (hours >= 3) return 2;
    return 1;
  };

  const currentLevel = getTreeLevel(studyHours);

  // SVG representation for the tree
  const renderTreeSvg = (level) => {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%" className={level > 1 ? "tree-sway" : ""}>
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
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground */}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(16, 185, 129, 0.2)" />

        {level >= 1 && (
           <motion.path 
             initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
             d="M100 180 Q90 160 100 150 Q110 160 100 180" fill="url(#leafGrad)" 
           />
        )}

        {level >= 2 && (
          <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <path d="M95 180 L95 120 L105 120 L105 180 Z" fill="url(#trunkGrad)" />
            <circle cx="100" cy="110" r="25" fill="url(#leafGrad)" />
          </motion.g>
        )}

        {level >= 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <path d="M92 180 L94 90 L106 90 L108 180 Z" fill="url(#trunkGrad)" />
            <path d="M94 120 Q80 100 70 100" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M106 130 Q120 110 130 110" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            
            <circle cx="100" cy="80" r="35" fill="url(#leafGradPremium)" />
            <circle cx="65" cy="95" r="20" fill="url(#leafGrad)" />
            <circle cx="135" cy="105" r="20" fill="url(#leafGrad)" />
          </motion.g>
        )}

        {level >= 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
             {/* Thicker trunk */}
             <path d="M90 180 L92 60 L108 60 L110 180 Z" fill="url(#trunkGrad)" />
             {/* Branches */}
             <path d="M92 140 Q60 110 50 100" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
             <path d="M108 120 Q140 90 150 80" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
             <path d="M96 90 Q70 60 60 50" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
             <path d="M104 80 Q130 50 140 40" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

             {/* Canopy */}
             <circle cx="100" cy="50" r="45" fill="url(#leafGradPremium)" filter={level >= 5 ? "url(#glow)" : ""} />
             <circle cx="50" cy="80" r="35" fill="url(#leafGrad)" />
             <circle cx="150" cy="70" r="35" fill="url(#leafGrad)" />
             <circle cx="65" cy="45" r="30" fill="url(#leafGradPremium)" />
             <circle cx="135" cy="40" r="30" fill="url(#leafGradPremium)" />
          </motion.g>
        )}

        {level >= 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
             <circle cx="100" cy="50" r="60" fill="url(#leafGradPremium)" filter="url(#glow)" />
             <circle cx="40" cy="70" r="45" fill="url(#leafGradPremium)" filter="url(#glow)" />
             <circle cx="160" cy="60" r="45" fill="url(#leafGradPremium)" filter="url(#glow)" />
             
             {/* Some sparkles/fruits indicating max level */}
             <circle cx="80" cy="30" r="4" fill="#fbbf24" filter="url(#glow)" />
             <circle cx="120" cy="40" r="4" fill="#fbbf24" filter="url(#glow)" />
             <circle cx="60" cy="60" r="4" fill="#fbbf24" filter="url(#glow)" />
             <circle cx="140" cy="70" r="4" fill="#fbbf24" filter="url(#glow)" />
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
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Leaf size={32} color="var(--success-color)" /> Öğrenme Ağacın
          </h1>
          <p>Çalıştıkça ağacın büyüyecek. Geleceğini şimdiden inşa et!</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
          <button className="btn btn-primary" onClick={handleAddHour} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} /> 1 Saat Ekle
          </button>
          <div className="card glass-panel" style={{ padding: '0.75rem 2rem', textAlign: 'center', margin: 0 }}>
            <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{studyHours} Saat</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Toplam Çalışma</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Current Tree View */}
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <h2 style={{ marginBottom: '2rem' }}>Şu Anki Durumun</h2>
          <div style={{ width: '250px', height: '250px' }}>
            {renderTreeSvg(currentLevel)}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--success-color)' }}>Seviye {currentLevel}</h3>
            <p>Bir sonraki seviye için {getTreeLevel(studyHours + 5) > currentLevel ? '5 saat daha çalışmalısın!' : 'çalışmaya devam et!'}</p>
          </div>
        </div>

        {/* Future Preview View */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', border: '1px dashed var(--primary-color)', background: 'var(--bg-color)' }}>
          <h2 style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Gelecekteki Ağacın</h2>
          <div style={{ width: '250px', height: '250px', opacity: 0.6, filter: 'grayscale(0.5)' }}>
            {renderTreeSvg(5)}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Seviye 5 - Ulu Ağaç</h3>
            <p>Hedefine ulaştığında ağacın böyle görünecek!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Gamification;
