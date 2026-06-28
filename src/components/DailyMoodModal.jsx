import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const DailyMoodModal = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    // Show this modal once per session/day
    const hasCheckedIn = sessionStorage.getItem('dailyMoodChecked');
    if (!hasCheckedIn) {
      setTimeout(() => setIsOpen(true), 1500); // Small delay on login
    }
  }, []);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    sessionStorage.setItem('dailyMoodChecked', 'true');
    
    // Save to Firestore
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          currentMood: mood.id,
          lastMoodUpdate: new Date().toISOString()
        });
      } catch (error) {
        console.error("Duygu durumu kaydedilemedi:", error);
      }
    }

    setTimeout(() => setIsOpen(false), 1500);
  };

  const moods = [
    { id: 'great', emoji: '🤩', label: 'Harika', color: 'var(--success-color)' },
    { id: 'good', emoji: '🙂', label: 'İyi', color: 'var(--primary-color)' },
    { id: 'tired', emoji: '🥱', label: 'Yorgun', color: 'var(--warning-color)' },
    { id: 'stressed', emoji: '😫', label: 'Stresli', color: 'var(--danger-color)' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card glass-panel"
          style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '2.5rem 2rem' }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Bugün Nasılsın?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Anlık duygu durumunu bizimle paylaş. Unutma, her duygu normaldir ve başarı yolculuğunun bir parçasıdır.
          </p>

          {!selectedMood ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              {moods.map(mood => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    background: 'var(--bg-color)',
                    border: `1px solid var(--border-color)`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 0.5rem',
                    flex: 1,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = mood.color}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>{mood.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '2rem 0' }}
            >
              <h3 style={{ color: 'var(--primary-color)' }}>Teşekkürler! 🌟</h3>
              <p>Durumunu kaydettik. Sana uygun çalışma önerileri sunacağız.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyMoodModal;
