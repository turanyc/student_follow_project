import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Flame } from 'lucide-react';
import quotes from '../data/quotes.json';

const MotivationBanner = () => {
  const [quote, setQuote] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const today = new Date();
    const index = today.getDate() % quotes.length;
    setQuote(quotes[index]);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          key="motivation-banner"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="motivation-banner-card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: 16,
          padding: '0.9rem 1.4rem',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(30, 27, 75, 0.18)',
          border: '1px solid rgba(129, 140, 248, 0.25)'
        }}
      >
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '10%',
          width: '180px', height: '180px',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="motivation-banner-content" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1e1b4b', flexShrink: 0, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <Flame size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                <Sparkles size={13} color="#fcd34d" />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a5b4fc' }}>
                  GÜNÜN MOTİVASYONU
                </span>
              </div>
              <p className="motivation-banner-text" style={{ margin: 0, fontSize: '0.96rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                "{quote || 'Çalışmak, şans kapısını açmanın en emin yoludur.'}"
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            title="Kapat"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 10,
              width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#cbd5e1', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#cbd5e1'; }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .motivation-banner-card {
              padding: 0.7rem 0.95rem !important;
              border-radius: 14px !important;
              margin-bottom: 1rem !important;
            }
            .motivation-banner-text {
              font-size: 0.83rem !important;
              line-height: 1.35 !important;
            }
            .motivation-banner-content {
              gap: 0.65rem !important;
            }
          }
        `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotivationBanner;
