import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Compass, Users, Sparkles, Eye, Headphones, BookOpen, Activity, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const questions = [
  {
    question: 'Yeni bir konuyu öğrenirken hangisi sana daha çok yardımcı olur?',
    options: [
      { text: 'Şekiller, grafikler ve videolar izlemek', style: 'visual' },
      { text: 'Öğretmeni veya ses kaydını dinlemek', style: 'auditory' },
      { text: 'Notlar almak ve kitaptan okumak', style: 'reading' },
      { text: 'Deneyerek, dokunarak ve pratik yaparak', style: 'kinesthetic' }
    ]
  },
  {
    question: 'Sınava çalışırken hangi ortamı tercih edersin?',
    options: [
      { text: 'Sessiz, düzenli ve renkli notların olduğu masa', style: 'visual' },
      { text: 'Arka planda hafif müzik veya tartışma ortamı', style: 'auditory' },
      { text: 'Kütüphane gibi sessiz, kitaplarla dolu ortam', style: 'reading' },
      { text: 'Sürekli pozisyon değiştirerek, yürüyerek ezber', style: 'kinesthetic' }
    ]
  },
  {
    question: 'Bir konuyu en iyi nasıl hatırlarsın?',
    options: [
      { text: 'Zihin haritaları ve renkli notlarla', style: 'visual' },
      { text: 'Sesli okuyarak veya birine anlatarak', style: 'auditory' },
      { text: 'Özetler ve listeler yaparak', style: 'reading' },
      { text: 'Uygulama yaparak ve hareket ederek', style: 'kinesthetic' }
    ]
  },
  {
    question: 'Bir problemi çözerken nasıl yaklaşırsın?',
    options: [
      { text: 'Diyagram veya çizimle görselleştiririm', style: 'visual' },
      { text: 'Sesli düşünür, başkasına danışırım', style: 'auditory' },
      { text: 'Adım adım yazarak çözmeye çalışırım', style: 'reading' },
      { text: 'Deneme yanılma yöntemiyle uğraşırım', style: 'kinesthetic' }
    ]
  },
  {
    question: 'Bir konuyu anlayıp anlamadığını nasıl anlarsın?',
    options: [
      { text: 'Konunun zihnimde net bir resmi oluşur', style: 'visual' },
      { text: 'İçimde sesi duyabilirim gibi hissederim', style: 'auditory' },
      { text: 'Özet yazabildiğimde anlıyorum', style: 'reading' },
      { text: 'Soru çözebildiğimde anlıyorum', style: 'kinesthetic' }
    ]
  },
  {
    question: 'Boş zamanlarında ne yapmayı tercih edersin?',
    options: [
      { text: 'Film, dizi veya sanat ile ilgilenirim', style: 'visual', personality: 'social' },
      { text: 'Podcast dinler veya arkadaşlarla konuşurum', style: 'auditory', personality: 'social' },
      { text: 'Kitap okur veya blog yazarım', style: 'reading', personality: 'analytical' },
      { text: 'Spor yapar veya el işleri ile uğraşırım', style: 'kinesthetic', personality: 'practical' }
    ]
  },
  {
    question: 'Zor bir sınav öncesi ne yaparsın?',
    options: [
      { text: 'Konuları görsel özetlerle gözden geçiririm', style: 'visual', personality: 'analytical' },
      { text: 'Arkadaşlarla soru çözer, tartışırım', style: 'auditory', personality: 'social' },
      { text: 'Tekrar notlarıma bakarak üzerinden geçerim', style: 'reading', personality: 'analytical' },
      { text: 'Hızlıca genel tekrar yaparak hareket ederim', style: 'kinesthetic', personality: 'competitive' }
    ]
  },
  {
    question: 'Başarı sana göre nedir?',
    options: [
      { text: 'Konuları tam anlamak ve kavramak', style: 'reading', personality: 'analytical' },
      { text: 'Ekip içinde ön plana çıkmak', style: 'auditory', personality: 'social' },
      { text: 'Sıralamada en üst yere ulaşmak', style: 'visual', personality: 'competitive' },
      { text: 'Bir şeyi kendi başıma yapabilmek', style: 'kinesthetic', personality: 'practical' }
    ]
  },
  {
    question: 'Motivasyonun nereden gelir?',
    options: [
      { text: 'Başkalarının başarısını izleyerek ilham alırım', style: 'visual', personality: 'social' },
      { text: 'Teşvik edici sözler ve övgü beni güçlendirir', style: 'auditory', personality: 'social' },
      { text: 'Hedef belirleyip ona ulaştığımda', style: 'reading', personality: 'competitive' },
      { text: 'İşin içine girince, yaptıkça hız kazanırım', style: 'kinesthetic', personality: 'practical' }
    ]
  },
  {
    question: 'Bir grup projesinde hangi rolü üstlenirsin?',
    options: [
      { text: 'Slayt ve görsel materyaller hazırlarım', style: 'visual', personality: 'analytical' },
      { text: 'Sunum yapar, ekibi motive ederim', style: 'auditory', personality: 'social' },
      { text: 'Araştırma yapar, rapor yazarım', style: 'reading', personality: 'analytical' },
      { text: 'Pratik kısımları organize eder, yaparım', style: 'kinesthetic', personality: 'practical' }
    ]
  }
];

const STYLE_DETAILS = {
  visual: {
    title: 'Görsel Öğrenici',
    desc: 'Haritalar, grafikler, renkli kalemler ve videolar en büyük yardımcın. Bilgiyi zihninde fotoğraflar gibi saklıyorsun.',
    tips: ['Zihin haritaları kullan', 'Konuları renk kodlarıyla not al', 'Eğitim videoları izle', 'Akış diyagramları oluştur'],
    icon: <Eye size={48} color="#f59e0b" />,
    color: '#f59e0b'
  },
  auditory: {
    title: 'İşitsel Öğrenici',
    desc: 'Dinleyerek, tartışarak ve yüksek sesle okuyarak çok daha iyi anlıyorsun. Ses kayıtları senin için ideal.',
    tips: ['Konuları sesli tekrar et', 'Arkadaşınla ders anlat', 'Podcast ve ders kayıtları dinle', 'Tartışma gruplarına katıl'],
    icon: <Headphones size={48} color="#6366f1" />,
    color: '#6366f1'
  },
  reading: {
    title: 'Okuyarak/Yazarak Öğrenici',
    desc: 'Listeler, özetler ve detaylı notlar alarak harika bir sistem kuruyorsun. Kelimeler senin gücün.',
    tips: ['Ayrıntılı notlar tut', 'Özet ve liste yap', 'Yazarak tekrar et', 'Sözlük tut'],
    icon: <BookOpen size={48} color="#10b981" />,
    color: '#10b981'
  },
  kinesthetic: {
    title: 'Kinestetik Öğrenici',
    desc: 'Hareket ederek, deneyerek ve pratik yaparak öğreniyorsun. Uygulamalı dersler tam sana göre.',
    tips: ['Soru çözerek öğren', 'Kısa molalar ver, hareket et', 'Pratik örnekler üret', 'Rol yaparak ezber yap'],
    icon: <Activity size={48} color="#ef4444" />,
    color: '#ef4444'
  }
};

const PERSONALITY_DETAILS = {
  analytical: {
    title: 'Analitik Tip',
    desc: 'Sistematik, detay odaklı ve mantıkla düşünürsün. Verileri ve kalıpları seversin.',
    emoji: '🧠', color: '#6366f1'
  },
  social: {
    title: 'Sosyal Tip',
    desc: 'İnsanlarla bağlantı kurarak en iyi performansı gösterirsin. İş birliği gücündür.',
    emoji: '🤝', color: '#10b981'
  },
  competitive: {
    title: 'Rekabetçi Tip',
    desc: 'Hedef odaklı, azimli ve başarıya yöneliksin. Meydan okumalar seni güçlendirir.',
    emoji: '🏆', color: '#f59e0b'
  },
  practical: {
    title: 'Pratik Tip',
    desc: 'Ellerini kullanan ve sonuç odaklı düşünen birisin. Uygulamak seni besler.',
    emoji: '⚙️', color: '#ef4444'
  }
};

const Discovery = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnboarding = new URLSearchParams(location.search).get('onboarding') === '1';
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [personalityResult, setPersonalityResult] = useState(null);

  const [scores, setScores] = useState({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });
  const [personalityScores, setPersonalityScores] = useState({ analytical: 0, social: 0, competitive: 0, practical: 0 });

  const handleAnswer = async (option) => {
    const newScores = { ...scores, [option.style]: scores[option.style] + 1 };
    setScores(newScores);

    const newPersonality = option.personality
      ? { ...personalityScores, [option.personality]: personalityScores[option.personality] + 1 }
      : personalityScores;
    setPersonalityScores(newPersonality);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const maxStyle = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      const maxPersonality = Object.keys(newPersonality).reduce((a, b) => newPersonality[a] > newPersonality[b] ? a : b);
      setResult(maxStyle);
      setPersonalityResult(maxPersonality);

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#6366f1', '#10b981', '#f59e0b'] });

      if (currentUser) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            learningStyle: maxStyle,
            personalityType: maxPersonality
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const reset = () => {
    setTestStarted(false);
    setResult(null);
    setPersonalityResult(null);
    setScores({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });
    setPersonalityScores({ analytical: 0, social: 0, competitive: 0, practical: 0 });
    setCurrentQuestion(0);
  };

  const progress = testStarted && !result ? ((currentQuestion) / questions.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {isOnboarding && !result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '2rem', padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)',
            border: '1px solid rgba(99,102,241,0.4)', borderRadius: 16,
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>👋</span>
          <div>
            <h3 style={{ margin: 0, color: '#a5b4fc' }}>Hoş Geldin! İlk adım olarak seni tanıyalım.</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'rgba(165,180,252,0.7)', fontSize: '0.9rem' }}>
              Koçun sana daha iyi rehberlik edebilmesi için öğrenme stilini ve kişilik tipini belirleyelim.
              Bu test yalnızca 2 dakika sürer.
            </p>
          </div>
        </motion.div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🧭 Öğrenme Stili & Keşif</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Kendi öğrenme stilini ve kişilik tipini keşfet. 10 soruluk test — yaklaşık 2 dakika.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* START */}
        {!testStarted && !result && (
          <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card glass-panel" style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
              <Brain size={72} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
              <h2>Kendini Tanımaya Hazır mısın?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                Bu 10 soruluk test ile hem öğrenme stilini hem de kişilik tipini keşfedeceksin.
                Sonuçlar koçunla paylaşılacak ve sana özel çalışma önerileri sunulacak.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Görsel', icon: <Eye size={20} />, color: '#f59e0b' },
                  { label: 'İşitsel', icon: <Headphones size={20} />, color: '#6366f1' },
                  { label: 'Okuma/Yazma', icon: <BookOpen size={20} />, color: '#10b981' },
                  { label: 'Kinestetik', icon: <Activity size={20} />, color: '#ef4444' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '1rem', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${s.color}40`,
                    background: `${s.color}10`,
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: s.color
                  }}>
                    {s.icon}
                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }} onClick={() => setTestStarted(true)}>
                🚀 Testi Başlat
              </button>
            </div>
          </motion.div>
        )}

        {/* QUESTION */}
        {testStarted && !result && (
          <motion.div key={`q-${currentQuestion}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="card glass-panel" style={{ maxWidth: 640, margin: '0 auto' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Soru {currentQuestion + 1} / {questions.length}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                    %{Math.round(progress)}
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 3 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                {questions[currentQuestion].question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {questions[currentQuestion].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      border: '1px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0,
                      fontWeight: 700
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Learning Style Card */}
              <div className="card glass-panel" style={{
                textAlign: 'center', padding: '3rem 2rem',
                borderColor: `${STYLE_DETAILS[result].color}40`,
                background: `linear-gradient(135deg, ${STYLE_DETAILS[result].color}12 0%, transparent 100%)`
              }}>
                <div style={{ marginBottom: '1.5rem' }}>{STYLE_DETAILS[result].icon}</div>
                <h2 style={{ color: STYLE_DETAILS[result].color, marginBottom: '0.5rem', fontSize: '2rem' }}>
                  {STYLE_DETAILS[result].title}
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-muted)' }}>
                  {STYLE_DETAILS[result].desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                  {STYLE_DETAILS[result].tips.map((tip, i) => (
                    <span key={i} style={{
                      padding: '0.4rem 0.9rem', borderRadius: 20,
                      background: `${STYLE_DETAILS[result].color}20`,
                      border: `1px solid ${STYLE_DETAILS[result].color}40`,
                      color: STYLE_DETAILS[result].color, fontSize: '0.85rem'
                    }}>
                      ✨ {tip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Personality Card */}
              {personalityResult && (
                <div className="card glass-panel" style={{
                  padding: '2rem',
                  borderColor: `${PERSONALITY_DETAILS[personalityResult].color}40`,
                  background: `linear-gradient(135deg, ${PERSONALITY_DETAILS[personalityResult].color}10 0%, transparent 100%)`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{PERSONALITY_DETAILS[personalityResult].emoji}</span>
                    <div>
                      <h3 style={{ margin: 0, color: PERSONALITY_DETAILS[personalityResult].color }}>
                        Kişilik Tipi: {PERSONALITY_DETAILS[personalityResult].title}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {PERSONALITY_DETAILS[personalityResult].desc}
                      </p>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                    {Object.entries(scores).map(([style, score]) => (
                      <div key={style} style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{
                          style === 'visual' ? 'Görsel' : style === 'auditory' ? 'İşitsel' : style === 'reading' ? 'Okuma' : 'Kinestetik'
                        }</p>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '0.35rem 0' }}>
                          <div style={{ width: `${(score / questions.length) * 100}%`, height: '100%', background: STYLE_DETAILS[style].color, borderRadius: 2 }} />
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>{score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {isOnboarding ? (
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '1rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem' }}
                    onClick={() => navigate('/student')}
                  >
                    Panele Git <ArrowRight size={18} />
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ fontSize: '1rem' }} onClick={reset}>
                    🔄 Testi Tekrar Çöz
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Discovery;
