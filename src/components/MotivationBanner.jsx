import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quotes from '../data/quotes.json';

const MotivationBanner = () => {
  const [quote, setQuote] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Pick a random quote for the day (or based on hash of date)
    const today = new Date();
    const index = today.getDate() % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>
              Günün Motivasyonu
            </span>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: 'white', marginTop: '0.5rem', fontStyle: 'italic' }}>
              "{quote}"
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ✕
          </button>
        </div>
        
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-5%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%'
        }} />
      </motion.div>
    </AnimatePresence>
  );
};

export default MotivationBanner;
