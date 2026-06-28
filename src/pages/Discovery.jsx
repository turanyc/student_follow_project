import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Compass, Users, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Discovery = () => {
  const { currentUser } = useAuth();
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);

  const questions = [
    {
      question: "Yeni bir konuyu öğrenirken hangisi sana daha çok yardımcı olur?",
      options: [
        { text: "Şekiller, grafikler ve videolar izlemek", type: "visual" },
        { text: "Öğretmeni veya bir ses kaydını dinlemek", type: "auditory" },
        { text: "Notlar almak ve kitaptan okumak", type: "reading" },
        { text: "Deneyerek, dokunarak ve pratik yaparak öğrenmek", type: "kinesthetic" }
      ]
    },
    {
      question: "Sınava çalışırken genellikle nasıl bir ortam tercih edersin?",
      options: [
        { text: "Sessiz, düzenli ve renkli notların olduğu bir masa", type: "visual" },
        { text: "Arka planda hafif bir müzik veya arkadaşlarımla tartışarak", type: "auditory" },
        { text: "Kütüphane gibi tamamen sessiz ve kitaplarla dolu bir ortam", type: "reading" },
        { text: "Sürekli pozisyon değiştirerek, yürüyerek ezber yaparak", type: "kinesthetic" }
      ]
    }
  ];

  // Store scores
  const [scores, setScores] = useState({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });

  const handleAnswer = async (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const maxType = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      setResult(maxType);
      triggerConfetti();

      // Save to Firestore
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, { learningStyle: maxType });
        } catch (error) {
          console.error("Öğrenme stili kaydedilemedi:", error);
        }
      }
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
  };

  const resultDetails = {
    visual: { title: "Görsel Öğrenici", desc: "Haritalar, grafikler, renkli kalemler ve videolar senin en büyük yardımcın. Bilgiyi zihninde fotoğraflar gibi saklıyorsun.", icon: <Sparkles size={40} color="#f59e0b" /> },
    auditory: { title: "İşitsel Öğrenici", desc: "Dinleyerek, tartışarak ve yüksek sesle okuyarak çok daha iyi anlıyorsun. Ses kayıtları senin için ideal.", icon: <Users size={40} color="#6366f1" /> },
    reading: { title: "Okuyarak/Yazarak Öğrenici", desc: "Listeler, özetler ve detaylı notlar alarak harika bir sistem kuruyorsun. Kelimeler senin gücün.", icon: <Brain size={40} color="#10b981" /> },
    kinesthetic: { title: "Kinestetik Öğrenici", desc: "Hareket ederek, deneyerek ve pratik yaparak öğreniyorsun. Laboratuvar ortamları ve uygulamalı dersler tam sana göre.", icon: <Compass size={40} color="#ef4444" /> }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Öğrenme Stili & Keşif</h1>
        <p>Kendi öğrenme stilini keşfet ve potansiyelini zirveye taşı.</p>
      </div>

      {!testStarted && !result && (
        <div className="card glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <Brain size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
          <h2>Kendini Tanımaya Hazır mısın?</h2>
          <p style={{ marginBottom: '2rem' }}>
            Herkesin öğrenme stili farklıdır. Bu kısa testi çözerek sana en uygun çalışma yöntemlerini belirleyelim.
          </p>
          <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => setTestStarted(true)}>
            Testi Başlat
          </button>
        </div>
      )}

      {testStarted && !result && (
        <div className="card glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Soru {currentQuestion + 1} / {questions.length}</span>
            <div style={{ width: '100px', height: '6px', background: 'var(--border-color)', borderRadius: '3px' }}>
              <div style={{ width: `${((currentQuestion) / questions.length) * 100}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '3px', transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem' }}>{questions[currentQuestion].question}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions[currentQuestion].options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.type)}
                style={{
                  background: 'var(--bg-color-alt)',
                  border: '1px solid var(--border-color)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-color-alt)'; }}
              >
                {option.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="card glass-panel" 
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem', background: 'var(--gradient-glass)' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            {resultDetails[result].icon}
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>{resultDetails[result].title}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {resultDetails[result].desc}
          </p>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Sana Özel Tavsiyeler</h4>
            <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '0.5rem' }}>Öğrenme stiline uygun metotları haftalık planına ekledik.</li>
              <li>Koçunla bu sonuç üzerine konuşabilirsin.</li>
            </ul>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => { setTestStarted(false); setResult(null); setScores({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 }); setCurrentQuestion(0); }}>
            Testi Tekrar Çöz
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Discovery;
