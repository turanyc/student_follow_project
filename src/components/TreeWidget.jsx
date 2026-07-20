import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Leaf, TreePine, Trees, Crown, Sparkles, Trophy } from 'lucide-react';

// Tree level based on daily study hours OR cumulative total hours / tree points:
const getTreeLevel = (dailyHours = 0, totalHours = 0) => {
  if (totalHours >= 500) return { level: 10, label: 'Zirve Ağacı', icon: '👑', IconComp: Trophy, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #be185d, #4c0519)', isLegendary: true };
  if (totalHours >= 400) return { level: 9, label: 'Hayat Ağacı', icon: '⚡', IconComp: Sparkles, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2, #164e63)', isLegendary: true };
  if (totalHours >= 300) return { level: 8, label: 'Orman Ruhu', icon: '🌌', IconComp: Sparkles, color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #7e22ce, #4c1d95)', isLegendary: true };
  if (totalHours >= 200) return { level: 7, label: 'Bilge Ağaç', icon: '🏆', IconComp: Trophy, color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)', isLegendary: true };
  if (totalHours >= 150) return { level: 6, label: 'Asırlık Çınar', icon: '✨', IconComp: Sparkles, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)', isLegendary: true };
  if (totalHours >= 100 || dailyHours >= 5) return { level: 5, label: 'Köklü Çınar', icon: '👑', IconComp: Crown, color: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', isLegendary: false };
  if (totalHours >= 50 || dailyHours >= 3.5) return { level: 4, label: 'Gür Ağaç', icon: '🌳', IconComp: Trees, color: '#059669', gradient: 'linear-gradient(135deg, #059669, #047857)', isLegendary: false };
  if (totalHours >= 20 || dailyHours >= 2) return { level: 3, label: 'Genç Ağaç', icon: '🌲', IconComp: TreePine, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', isLegendary: false };
  if (totalHours >= 5 || dailyHours >= 0.8) return { level: 2, label: 'Fidan Formu', icon: '🌿', IconComp: Leaf, color: '#34d399', gradient: 'linear-gradient(135deg, #34d399, #10b981)', isLegendary: false };
  if (totalHours >= 1 || dailyHours >= 0.3) return { level: 1, label: 'Filiz Formu', icon: '🌱', IconComp: Sprout, color: '#6ee7b7', gradient: 'linear-gradient(135deg, #6ee7b7, #34d399)', isLegendary: false };
  return { level: 0, label: 'Tohum', icon: '🌱', IconComp: Sprout, color: '#a7f3d0', gradient: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)', isLegendary: false };
};

const TreeWidget = ({ studyHours = 0, totalHours = 0 }) => {
  const { level, label, IconComp, color, gradient, isLegendary } = getTreeLevel(studyHours, totalHours);
  const nextTarget = [1, 5, 20, 50, 100, 150, 200, 300, 400, 500, 1000][Math.min(level, 10)];
  const remaining = Math.max(0, nextTarget - (totalHours || studyHours)).toFixed(1);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: isLegendary
          ? (level === 10 ? 'linear-gradient(135deg, #fdf2f8, #fbcfe8)' : level === 9 ? 'linear-gradient(135deg, #ecfeff, #cffafe)' : level === 8 ? 'linear-gradient(135deg, #faf5ff, #f3e8ff)' : 'linear-gradient(135deg, #fffbeb, #fef3c7)')
          : '#ffffff',
        border: `1.5px solid ${isLegendary ? color : color + '40'}`,
        padding: '0.55rem 1.1rem', borderRadius: '999px',
        boxShadow: isLegendary
          ? `0 0 20px ${color}55`
          : `0 2px 10px ${color}20`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={level < 10 ? `Bir sonraki seviye için ${remaining} saat/puan daha kazan!` : 'Zirve Ağacı Seviyesi! Platformun en zirve ağacına sahipsin!'}
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
      <motion.div
        animate={{ y: [-2.5, 2.5, -2.5], rotate: [-4, 4, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${color}40`,
          position: 'relative', zIndex: 1
        }}
      >
        <IconComp size={20} color="white" strokeWidth={2.5} />
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        <span style={{ fontSize: '0.68rem', color: isLegendary ? '#d97706' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isLegendary ? '⭐ Kutsal Ağaç' : `Seviye ${level}`}
        </span>
        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: isLegendary ? '#b45309' : color }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};

export default TreeWidget;
export { getTreeLevel };
