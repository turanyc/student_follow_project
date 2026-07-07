import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quotes from '../data/quotes.json';

const LoadingMotivation = ({ onFinish }) => {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'quote' | 'done'
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Yılın günü hesabı ile 365 günde farklı söz
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % quotes.length;
    setQuote(quotes[index]);

    // 1.8 saniye loading → quote ekranı
    const t1 = setTimeout(() => setPhase('quote'), 1800);
    // 4.5 saniye sonra tamamen biter
    const t2 = setTimeout(() => {
      setPhase('done');
      onFinish?.();
    }, 4800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <AnimatePresence mode="wait">
      {phase === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2rem'
          }}
        >
          {/* Logo / Brand */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99,102,241,0.5)',
              fontSize: '2rem'
            }}>🎯</div>
            <h1 style={{
              fontSize: '2.5rem', fontWeight: 800, margin: 0,
              background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Koçluk Platformu
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '1rem' }}>
              Başarıya giden yolun rehberi
            </p>
          </motion.div>

          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ position: 'relative', width: 64, height: 64 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                border: '3px solid rgba(99,102,241,0.2)',
                borderTopColor: '#6366f1',
                position: 'absolute'
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid rgba(139,92,246,0.2)',
                borderTopColor: '#8b5cf6',
                position: 'absolute', top: 10, left: 10
              }}
            />
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, 20, -20],
                x: [Math.sin(i) * 10, Math.cos(i) * 10, Math.sin(i) * 10],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }}
              style={{
                position: 'absolute',
                width: 6, height: 6, borderRadius: '50%',
                background: i % 2 === 0 ? '#6366f1' : '#8b5cf6',
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + (i * 15)}%`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </motion.div>
      )}

      {phase === 'quote' && (
        <motion.div
          key="quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
        >
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
          }}>
            {[300, 500, 700].map((size, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20 + i * 5, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: size, height: size,
                  borderRadius: '50%',
                  border: `1px solid rgba(99,102,241,${0.05 - i * 0.01})`,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
            style={{
              maxWidth: 600, width: '100%', textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 24, padding: '3rem 2.5rem',
              boxShadow: '0 0 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative', zIndex: 1
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
              style={{ fontSize: '3rem', marginBottom: '1.5rem' }}
            >
              ✨
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 500,
                lineHeight: 1.7,
                color: 'white',
                fontStyle: 'italic',
                marginBottom: '2rem',
                textShadow: '0 2px 20px rgba(99,102,241,0.3)'
              }}
            >
              "{quote}"
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                color: 'rgba(165,180,252,0.8)', fontSize: '0.875rem'
              }}
            >
              <span style={{
                display: 'inline-block', width: 40, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(165,180,252,0.6))'
              }} />
              Günün Motivasyonu
              <span style={{
                display: 'inline-block', width: 40, height: 1,
                background: 'linear-gradient(to left, transparent, rgba(165,180,252,0.6))'
              }} />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 3, borderRadius: '0 0 24px 24px',
                background: 'rgba(99,102,241,0.2)', overflow: 'hidden'
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #6366f1, #8b5cf6)'
                }}
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ color: 'rgba(255,255,255,0.35)', marginTop: '2rem', fontSize: '0.85rem' }}
          >
            Panele yönlendiriliyorsunuz...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingMotivation;
