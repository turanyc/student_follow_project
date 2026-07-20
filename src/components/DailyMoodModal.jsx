import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

const DailyMoodModal = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastChecked = localStorage.getItem('dailyMoodDate');
    if (lastChecked !== today) {
      setTimeout(() => setIsOpen(true), 1800);
    }
  }, []);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('dailyMoodDate', today);

    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          currentMood: mood.id,
          lastMoodUpdate: new Date().toISOString()
        });
        // Geçmişe kaydet
        await addDoc(collection(db, 'users', currentUser.uid, 'moodHistory'), {
          mood: mood.id,
          date: today,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Duygu durumu kaydedilemedi:', error);
      }
    }

    setTimeout(() => setIsOpen(false), 1800);
  };

  const moods = [
    { id: 'great', emoji: '🤩', label: 'Harika', color: '#10b981' },
    { id: 'excited', emoji: '🚀', label: 'Heyecanlı', color: '#06b6d4' },
    { id: 'good', emoji: '🙂', label: 'İyi', color: '#6366f1' },
    { id: 'tired', emoji: '🥱', label: 'Yorgun', color: '#f59e0b' },
    { id: 'sad', emoji: '😢', label: 'Üzgün', color: '#8b5cf6' },
    { id: 'stressed', emoji: '😫', label: 'Stresli', color: '#ef4444' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mood-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <motion.div
          initial={{ scale: 0.88, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.88, y: 30 }}
          className="card glass-panel"
          style={{ maxWidth: '500px', width: '90%', textAlign: 'center', padding: '2.5rem 2rem' }}
        >
          <p style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>💭</p>
          <h2 style={{ marginBottom: '0.5rem' }}>Bugün Nasılsın?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Anlık duygu durumunu paylaş. Her duygu normaldir ve başarı yolculuğunun bir parçasıdır.
          </p>

          {!selectedMood ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {moods.map(mood => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    background: 'var(--bg-color)',
                    border: `1px solid var(--border-color)`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = mood.color;
                    e.currentTarget.style.background = `${mood.color}15`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-color)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{mood.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '2rem 0' }}
            >
              <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selectedMood.emoji}</p>
              <h3 style={{ color: selectedMood.color }}>Teşekkürler! 🌟</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Durumunu kaydettik. Sana uygun çalışma önerileri sunacağız.
              </p>
            </motion.div>
          )}

          {!selectedMood && (
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('dailyMoodDate', today);
                setIsOpen(false);
              }}
              style={{
                marginTop: '1.5rem',
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              Şimdi değil
            </button>
          )}
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyMoodModal;
