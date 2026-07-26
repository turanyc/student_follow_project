import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, addDoc, collection, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

const DailyMoodModal = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const checkAndCleanMoods = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // --- DUPLICATE CLEANUP LOGIC ---
        // Get all mood history for current user
        const moodRef = collection(db, 'users', currentUser.uid, 'moodHistory');
        const moodSnap = await getDocs(moodRef);
        const moodsByDate = {};
        
        // Group by date
        moodSnap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.date) {
            if (!moodsByDate[data.date]) moodsByDate[data.date] = [];
            moodsByDate[data.date].push({ id: docSnap.id, timestamp: data.timestamp });
          }
        });

        // Delete duplicates (keep the latest one for each day)
        for (const date in moodsByDate) {
          if (moodsByDate[date].length > 1) {
            // Sort descending by timestamp
            moodsByDate[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            // Delete all except the first (latest)
            for (let i = 1; i < moodsByDate[date].length; i++) {
              await deleteDoc(doc(db, 'users', currentUser.uid, 'moodHistory', moodsByDate[date][i].id));
            }
          }
        }

        // --- CHECK IF MOOD SHOULD BE SHOWN ---
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        let showModal = false;
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          const lastUpdate = data.lastMoodUpdate ? data.lastMoodUpdate.split('T')[0] : null;
          if (lastUpdate !== today) {
            showModal = true;
          }
        } else {
          showModal = true;
        }

        if (showModal) {
          setTimeout(() => setIsOpen(true), 1800);
        }
      } catch (error) {
        console.error("Duygu durumu kontrol edilirken hata oluştu:", error);
      }
    };

    checkAndCleanMoods();
  }, [currentUser]);

  // Lock body scroll when modal is open (iOS/Android fix)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
    { id: 'great', emoji: '/emoji/harika.png', label: 'Harika', color: '#10b981' },
    { id: 'excited', emoji: '/emoji/heyecanli.png', label: 'Heyecanlı', color: '#06b6d4' },
    { id: 'good', emoji: '/emoji/iyi.png', label: 'İyi', color: '#6366f1' },
    { id: 'tired', emoji: '/emoji/yorgun.png', label: 'Yorgun', color: '#f59e0b' },
    { id: 'sad', emoji: '/emoji/uzgun.png', label: 'Üzgün', color: '#8b5cf6' },
    { id: 'stressed', emoji: '/emoji/stresli.png', label: 'Stresli', color: '#ef4444' },
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
          style={{ maxWidth: '500px', width: '90%', textAlign: 'center', padding: '2.5rem 2rem', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <p style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>💭</p>
          <h2 style={{ marginBottom: '0.35rem', fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>Bugün Nasılsın?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: 'clamp(0.78rem, 2.5vw, 0.9rem)' }}>
            Anlık duygu durumunu paylaş. Her duygu normaldir ve başarı yolculuğunun bir parçasıdır.
          </p>

          {!selectedMood ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.4rem, 1.5vw, 0.75rem)' }}>
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
                    padding: 'clamp(0.5rem, 2vw, 1rem) 0.5rem',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.5rem)',
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
                  <img src={mood.emoji} alt={mood.label} style={{ width: 'clamp(2.5rem, 8vw, 3.5rem)', height: 'clamp(2.5rem, 8vw, 3.5rem)', objectFit: 'contain' }} />
                  <span style={{ fontSize: 'clamp(0.68rem, 2vw, 0.8rem)', fontWeight: 600, color: 'var(--text-main)' }}>{mood.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '2rem 0' }}
            >
              <img src={selectedMood.emoji} alt={selectedMood.label} style={{ width: '5rem', height: '5rem', marginBottom: '0.5rem', objectFit: 'contain', display: 'inline-block' }} />
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
