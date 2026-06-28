import React from 'react';
import { motion } from 'framer-motion';

const TreeWidget = ({ studyHours = 0 }) => {
  // Determine tree level based on study hours
  // 0-1h: Seed, 2-5h: Sprout, 6-10h: Sapling, 11-20h: Young Tree, 21+: Mature Tree
  let level = 1;
  if (studyHours >= 21) level = 5;
  else if (studyHours >= 11) level = 4;
  else if (studyHours >= 6) level = 3;
  else if (studyHours >= 2) level = 2;

  const getTreeIcon = () => {
    switch(level) {
      case 1: return '🌱'; // Seedling
      case 2: return '🌿'; // Herb
      case 3: return '🪴'; // Potted Plant
      case 4: return '🌲'; // Evergreen
      case 5: return '🌳'; // Deciduous
      default: return '🌱';
    }
  };

  const getTreeLabel = () => {
    switch(level) {
      case 1: return 'Tohum';
      case 2: return 'Filiz';
      case 3: return 'Fidan';
      case 4: return 'Genç Ağaç';
      case 5: return 'Ulu Ağaç';
      default: return 'Tohum';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 1rem',
        borderRadius: '999px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer'
      }}
      title="Ağacını büyütmek için daha fazla çalış!"
    >
      <div style={{
        fontSize: '1.5rem',
        filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))'
      }} className="tree-sway">
        {getTreeIcon()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          Gelişim
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {getTreeLabel()}
        </span>
      </div>
    </motion.div>
  );
};

export default TreeWidget;
