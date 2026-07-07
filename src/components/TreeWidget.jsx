import React from 'react';
import { motion } from 'framer-motion';

// Tree level based on daily study hours OR cumulative total hours / tree points:
// 0-1h: Tohum/Filiz | 1-5h: Fidan/Genç | 50h+: Ulu Ağaç
// 100h+: Altın Hareli Bilge | 150h+: Kutsal Işıltılı | 200h+: Devasa Efsanevi Hayat Ağacı
const getTreeLevel = (dailyHours = 0, totalHours = 0) => {
  if (totalHours >= 200) return { level: 7, label: 'Efsanevi Hayat Ağacı 🌟', icon: '🌲✨', color: '#fbbf24', isLegendary: true };
  if (totalHours >= 150) return { level: 6, label: 'Kutsal Işıltılı Ağaç ✨', icon: '🌳💫', color: '#f59e0b', isLegendary: true };
  if (totalHours >= 100 || dailyHours >= 5) return { level: 5, label: 'Altın Hareli Bilge Ağaç 🌟', icon: '🌳☀️', color: '#eab308', isLegendary: false };
  if (totalHours >= 50 || dailyHours >= 3.5) return { level: 4, label: 'Ulu Ağaç 🌳', icon: '🌳', color: '#059669', isLegendary: false };
  if (totalHours >= 20 || dailyHours >= 2) return { level: 3, label: 'Genç Ağaç 🌲', icon: '🌲', color: '#10b981', isLegendary: false };
  if (totalHours >= 5 || dailyHours >= 0.8) return { level: 2, label: 'Fidan 🪴', icon: '🪴', color: '#34d399', isLegendary: false };
  if (totalHours >= 1 || dailyHours >= 0.3) return { level: 1, label: 'Filiz 🌿', icon: '🌿', color: '#6ee7b7', isLegendary: false };
  return { level: 0, label: 'Tohum 🌱', icon: '🌱', color: '#a7f3d0', isLegendary: false };
};

const TreeWidget = ({ studyHours = 0, totalHours = 0 }) => {
  const { level, label, icon, color, isLegendary } = getTreeLevel(studyHours, totalHours);
  const nextTarget = [1, 5, 20, 50, 100, 150, 200, 300][Math.min(level, 7)];
  const remaining = Math.max(0, nextTarget - (totalHours || studyHours)).toFixed(1);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        background: isLegendary ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : '#ffffff',
        border: `1.5px solid ${isLegendary ? '#fbbf24' : color + '40'}`,
        padding: '0.5rem 1rem', borderRadius: '999px',
        boxShadow: isLegendary ? '0 0 15px rgba(251,191,36,0.4)' : `0 2px 8px ${color}20`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={level < 7 ? `Bir sonraki seviye için ${remaining} saat/puan daha kazan!` : 'Efsanevi Seviye! Platformun en ulu ağacına sahipsin!'}
    >
      {isLegendary && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      )}
      <div style={{ fontSize: '1.5rem', filter: `drop-shadow(0 2px 4px ${color}50)` }} className="tree-sway">
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        <span style={{ fontSize: '0.65rem', color: isLegendary ? '#d97706' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isLegendary ? '⭐ Kutsal Ağaç' : 'Öğrenme Ağacı'}
        </span>
        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isLegendary ? '#b45309' : color }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};

export default TreeWidget;
export { getTreeLevel };
