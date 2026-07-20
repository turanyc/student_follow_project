import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Coffee, BookOpen, Target, CheckCircle, Sparkles, Timer, Zap, Brain, Gamepad2, RefreshCw, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GUIDES = {
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Tekniği',
    emoji: '🍅',
    icon: Timer,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    gradientBg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    subtitle: 'Klasik Odaklanma',
    workMinutes: 25,
    breakMinutes: 5,
    longBreak: '4 Pomodoro sonrası 15 dakika uzun mola',
    howItWorks: 'Zamanı kısa çalışma ve mola periyotlarına bölerek zihinsel yorgunluğu geciktirir. Başlaması en kolay yöntemdir. Özellikle ders çalışmaya alışkanlık kazanma aşamasındaki öğrenciler için idealdir.',
    steps: [
      { icon: '🎯', text: 'Çalışacağın konuyu belirle ve odak alanını hazırla.' },
      { icon: '⏱️', text: '25 dakikalık zamanlayıcıyı başlat ve pür dikkat çalış.' },
      { icon: '☕', text: '25 dakika dolunca 5 dakika kısa mola ver. Su iç, göz dinlendir.' },
      { icon: '🔄', text: 'Bu döngüyü 4 kez tekrar et (4 Pomodoro).' },
      { icon: '🌿', text: '4 Pomodoro sonrası 15 dakikalık uzun bir mola al.' },
    ],
    advantage: 'Sıkıcı veya başlanması zor görevlerde ilk adımı atmayı kolaylaştırır. "Sadece 25 dakika" psikolojisi ile erteleme alışkanlığını kırar.',
    bestFor: 'Rutin ödevler, kitap okuma, tekrar yapma, ders notu çıkarma',
    proTips: [
      'Telefonu sessize al veya "Rahatsız Etmeyin" moduna geçir.',
      '25 dakika boyunca tek bir konuya odaklan, konu değiştirme.',
      'Her Pomodoro sonrası kısa bir not al: ne öğrendin?',
      'Molalarda ekrana bakma, gözlerini dinlendir.',
    ],
  },
  flowtime: {
    id: 'flowtime',
    name: 'Flowtime (Akış Zamanı)',
    emoji: '🌊',
    icon: Zap,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    gradientBg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    subtitle: 'Akış Zamanı Tekniği',
    workMinutes: 45,
    breakMinutes: 8,
    longBreak: '3 seans sonrası 15 dakika uzun mola',
    howItWorks: 'Zamanlayıcının dikkati dağıtmasını engelleyerek, kişinin doğal odaklanma süresini merkeze alır. Karmaşık problem çözmek veya derin odak gerektiren işler için idealdir. Alarm çalmaz, sen kendi ritmini belirlersin.',
    steps: [
      { icon: '📝', text: 'Çalışacağın konuyu seç ve kronometreyi başlat.' },
      { icon: '🧠', text: '45 dakika boyunca derin odaklanma moduna gir.' },
      { icon: '✋', text: 'Süre dolduğunda kendini değerlendir: hâlâ odaklı mısın?' },
      { icon: '☕', text: '8 dakika mola ver, zihinsel olarak yenilenmeyi hisset.' },
      { icon: '📈', text: 'Her seansta ne kadar süre odaklanabildiğini not al.' },
    ],
    advantage: 'Yüksek konsantrasyon (akış) halindeyken alarmın çalmasıyla dikkatin bölünmesini önler. Doğal öğrenme ritmine saygı gösterir.',
    bestFor: 'Derin mantık kurma, matematik problem çözme, yazılım, essay yazma',
    proTips: [
      'Akış haline girmeden önce 5 dakika hazırlık yap.',
      'Çalışma ortamındaki tüm dikkat dağıtıcıları kaldır.',
      'İlk birkaç seansta süreleri not al, kendi optimum süreni bul.',
      'Zorlandığın an mola ver, zorla devam etme.',
    ],
  },
  animedoro: {
    id: 'animedoro',
    name: 'Animedoro',
    emoji: '🎮',
    icon: Gamepad2,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    gradientBg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    subtitle: 'Ödül Odaklı Çalışma',
    workMinutes: 50,
    breakMinutes: 20,
    longBreak: '3 seans sonrası 30 dakika uzun mola',
    howItWorks: 'Pomodoro\'nun daha uzun süreli ve büyük ödüllü bir versiyonudur. Özellikle lise ve üniversite öğrencileri arasında oldukça popüler bir motivasyon kaynağıdır. Çalışmanın hemen ardından büyük bir ödül bekler!',
    steps: [
      { icon: '📚', text: 'Çalışacağın konuyu belirle ve zamanlayıcıyı başlat.' },
      { icon: '💪', text: '50 dakika boyunca kesintisiz ve yoğun çalış.' },
      { icon: '🎬', text: 'Çalışma bitince 20 dakikalık ödül molası: dizi/anime izle!' },
      { icon: '🎮', text: 'Alternatif: kısa bir çok oyunculu maç at veya müzik dinle.' },
      { icon: '🔁', text: '3 döngü sonrası 30 dakikalık uzun bir mola al.' },
    ],
    advantage: 'Uzun süre masa başında kalmayı, gün sonunda değil hemen o an verilen büyük bir ödülle destekler. "Çalış ki eğlen" motivasyonu sağlar.',
    bestFor: 'Uzun soluklu ve zorlu ders çalışma, sınav maratonu, hafta sonu çalışmaları',
    proTips: [
      'Ödül süresini asla uzatma! 20 dakika bitince dön.',
      '1 bölüm dizi veya 1 maç = 1 ödül. Sınırı belirle.',
      'Çalışma süresinde dizi/oyun düşünme, "biraz sonra" de.',
      'Bu yöntemi hafta sonları ve uzun çalışma günlerinde kullan.',
    ],
  },
  rule5217: {
    id: 'rule5217',
    name: '52/17 Kuralı',
    emoji: '⚡',
    icon: Brain,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    gradientBg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    subtitle: 'Ritmik Verimlilik',
    workMinutes: 52,
    breakMinutes: 17,
    longBreak: '3 seans sonrası 25 dakika uzun mola',
    howItWorks: 'İnsan beyninin doğal çalışma ritmine dayandığı savunulan, bilimsel olarak kanıtlanmış bir zaman yönetimi tekniğidir. DeskTime uygulamasının en verimli kullanıcıları üzerinde yapılan araştırmadan doğmuştur.',
    steps: [
      { icon: '🎯', text: 'Tek bir göreve odaklan ve zamanlayıcıyı başlat.' },
      { icon: '⏱️', text: 'Tam olarak 52 dakika boyunca bu tek göreve odaklanılır.' },
      { icon: '🚶', text: '17 dakika boyunca ekran başından kalk, yürü, nefes egzersizi yap.' },
      { icon: '👀', text: 'Mola sırasında telefon veya bilgisayar kullanma.' },
      { icon: '📊', text: 'Her döngüde ne kadar iş tamamladığını ölç.' },
    ],
    advantage: 'Molalar Pomodoro\'ya göre daha uzun olduğu için tam bir zihinsel yenilenme sağlar ve göz yorgunluğunu azaltır. Bilimsel temele dayanan en güvenilir yöntemdir.',
    bestFor: 'Yoğun zihinsel mesai, proje çalışması, araştırma, tez yazma',
    proTips: [
      '17 dakika molada kesinlikle ekrana bakma.',
      'Mola sırasında yürüyüş yap veya esnetme hareketleri yap.',
      'Bu yöntemi özellikle uzun sınav hazırlık seanslarında dene.',
      'Birden fazla konu çalışıyorsan, her 52 dakikada konu değiştir.',
    ],
  },
  spaced: {
    id: 'spaced',
    name: 'Aralıklı Tekrar',
    emoji: '🧠',
    icon: RefreshCw,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    gradientBg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    subtitle: 'Spaced Repetition',
    workMinutes: 30,
    breakMinutes: 5,
    longBreak: '4 seans sonrası 15 dakika uzun mola',
    howItWorks: 'Yeni öğrenilen bilgilerin unutulma eğrisini (Ebbinghaus Unutma Eğrisi) kırmak için belirli zaman aralıklarıyla tekrar edilmesidir. Yabancı dil pratikleri veya ezber gerektiren konular için tasarlanmıştır.',
    steps: [
      { icon: '📝', text: 'Tekrar edeceğin konuyu veya kelime kartlarını hazırla.' },
      { icon: '⏱️', text: '30 dakika boyunca aktif tekrar yap (flashcard, soru-cevap, yazarak).' },
      { icon: '☕', text: '5 dakika kısa mola ver.' },
      { icon: '📅', text: 'İlk tekrardan 1 gün sonra, sonra 3 gün, 1 hafta, 1 ay aralıklarla tekrar et.' },
      { icon: '✅', text: 'Kolayca hatırladığın kartları ayır, zorlandıklarına odaklan.' },
    ],
    advantage: 'Bilgilerin kısa süreli bellekten uzun süreli belleğe kalıcı olarak geçmesini garantiler. Ezbere dayalı konularda en etkili bilimsel yöntemdir.',
    bestFor: 'Yabancı dil öğrenimi, tıp/hukuk terimleri, formül ezberleme, tarih kronolojileri',
    proTips: [
      'Fiziksel veya dijital flashcard kullan (Anki, Quizlet).',
      'Kartları "kolay / orta / zor" olarak kategorize et.',
      'Uyumadan önce yapılan tekrar en etkili tekrardır.',
      'Sadece okuma yapma, aktif hatırlama (active recall) uygula.',
    ],
  },
};

const COMPARISON_TABLE = [
  { name: 'Pomodoro', work: '25 Dakika', brk: '5 Dakika', best: 'Rutin ödevler, okuma yapma', color: '#ef4444' },
  { name: 'Flowtime', work: '45 Dakika', brk: '8 Dakika', best: 'Derin mantık kurma, problem çözme', color: '#3b82f6' },
  { name: 'Animedoro', work: '50 Dakika', brk: '20 Dakika', best: 'Uzun soluklu ve zorlu ders çalışma', color: '#8b5cf6' },
  { name: '52/17 Kuralı', work: '52 Dakika', brk: '17 Dakika', best: 'Yoğun zihinsel mesai', color: '#f59e0b' },
  { name: 'Aralıklı Tekrar', work: '30 Dakika', brk: '5 Dakika', best: 'Yabancı dil öğrenimi, terim ezberleme', color: '#10b981' },
];

const StudyMethodGuide = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const methodParam = searchParams.get('method') || 'pomodoro';
  const [activeMethod, setActiveMethod] = useState(methodParam);

  useEffect(() => {
    setActiveMethod(methodParam);
  }, [methodParam]);

  const guide = GUIDES[activeMethod] || GUIDES.pomodoro;
  const IconComp = guide.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 1rem', borderRadius: 12, border: 'none',
              background: 'white', color: '#64748b', fontSize: '0.88rem',
              fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <ArrowLeft size={18} /> Geri Dön
          </motion.button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem' }}>
            <BookOpen size={28} color={guide.color} /> Çalışma Yöntemleri Rehberi
          </h1>
        </div>
      </div>

      {/* Method Tabs */}
      <div style={{
        display: 'flex', gap: '0.4rem', overflowX: 'auto',
        padding: '0.35rem', background: 'white',
        borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {Object.values(GUIDES).map(g => {
          const isActive = activeMethod === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveMethod(g.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.6rem 1rem', borderRadius: 12, border: 'none',
                background: isActive ? g.gradient : 'transparent',
                color: isActive ? 'white' : '#64748b',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.25s', fontFamily: 'Outfit, sans-serif',
                whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: isActive ? `0 4px 12px ${g.color}30` : 'none'
              }}
            >
              <span>{g.emoji}</span> {g.name}
            </button>
          );
        })}
      </div>

      {/* Hero Card */}
      <motion.div
        key={activeMethod}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: guide.gradientBg,
          border: `2px solid ${guide.color}25`,
          borderRadius: 24, padding: '2.5rem',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Decorative */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${guide.color}15, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.85rem', borderRadius: 10,
              background: `${guide.color}12`, color: guide.color,
              fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem'
            }}>
              <Sparkles size={14} /> {guide.subtitle}
            </div>

            <h2 style={{
              fontSize: '2rem', fontWeight: 900, color: '#1e293b',
              margin: '0 0 0.75rem', letterSpacing: '-0.02em',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {guide.emoji} {guide.name}
            </h2>

            <p style={{
              fontSize: '1rem', color: '#475569', lineHeight: 1.7,
              margin: '0 0 1.5rem'
            }}>
              {guide.howItWorks}
            </p>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                background: 'white', borderRadius: 14, padding: '0.75rem 1.1rem',
                border: `1.5px solid ${guide.color}20`,
                boxShadow: `0 2px 10px ${guide.color}10`
              }}>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Çalışma</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: guide.color }}>{guide.workMinutes} dk</span>
              </div>
              <div style={{
                background: 'white', borderRadius: 14, padding: '0.75rem 1.1rem',
                border: '1.5px solid rgba(16,185,129,0.2)',
                boxShadow: '0 2px 10px rgba(16,185,129,0.08)'
              }}>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Kısa Mola</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>{guide.breakMinutes} dk</span>
              </div>
              <div style={{
                background: 'white', borderRadius: 14, padding: '0.75rem 1.1rem',
                border: '1.5px solid rgba(139,92,246,0.2)',
                boxShadow: '0 2px 10px rgba(139,92,246,0.08)'
              }}>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Uzun Mola</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8b5cf6', marginTop: '0.2rem' }}>{guide.longBreak}</span>
              </div>
            </div>
          </div>

          {/* Right: Advantage & Best For */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'white', borderRadius: 18, padding: '1.25rem 1.5rem',
              border: `1.5px solid ${guide.color}18`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <TrendingUp size={18} color={guide.color} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: guide.color, textTransform: 'uppercase' }}>En Büyük Avantajı</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                {guide.advantage}
              </p>
            </div>

            <div style={{
              background: 'white', borderRadius: 18, padding: '1.25rem 1.5rem',
              border: '1.5px solid rgba(99,102,241,0.15)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Target size={18} color="#6366f1" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>En Uygun Kullanım</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                {guide.bestFor}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Steps & Pro Tips Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Steps */}
        <div className="card" style={{
          padding: '2rem', background: 'white',
          border: `1.5px solid ${guide.color}15`, borderRadius: 22
        }}>
          <h3 style={{
            margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '1.15rem', fontWeight: 800, color: '#1e293b'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: guide.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BookOpen size={16} color="white" />
            </div>
            Bu Yöntemle Nasıl Çalışırsın?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {guide.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.85rem 1rem', borderRadius: 14,
                  background: idx % 2 === 0 ? guide.gradientBg : '#fafbff',
                  border: `1px solid ${guide.color}10`
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'white', border: `1.5px solid ${guide.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                  boxShadow: `0 2px 6px ${guide.color}10`
                }}>
                  {step.icon}
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: guide.color, fontWeight: 800, textTransform: 'uppercase' }}>
                    Adım {idx + 1}
                  </span>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="card" style={{
          padding: '2rem', background: 'white',
          border: '1.5px solid rgba(251,191,36,0.2)', borderRadius: 22
        }}>
          <h3 style={{
            margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '1.15rem', fontWeight: 800, color: '#1e293b'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Star size={16} color="white" />
            </div>
            Pro İpuçları
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {guide.proTips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
                  padding: '0.8rem 1rem', borderRadius: 14,
                  background: idx % 2 === 0 ? '#fffbeb' : '#fafbff',
                  border: '1px solid rgba(251,191,36,0.12)'
                }}
              >
                <CheckCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>
                  {tip}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 24px ${guide.color}30` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/student')}
            style={{
              width: '100%', padding: '0.95rem', borderRadius: 14, border: 'none',
              background: guide.gradient, color: 'white', fontWeight: 800,
              fontSize: '0.95rem', cursor: 'pointer', marginTop: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontFamily: 'Outfit, sans-serif',
              boxShadow: `0 4px 14px ${guide.color}25`
            }}
          >
            {guide.emoji} {guide.name} ile Hemen Çalışmaya Başla
          </motion.button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card" style={{
        padding: '2rem', background: 'white',
        border: '1.5px solid #e2e8f0', borderRadius: 22
      }}>
        <h3 style={{
          margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '1.15rem', fontWeight: 800, color: '#1e293b'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertCircle size={16} color="white" />
          </div>
          Yöntemlerin Karşılaştırması
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.4rem',
            fontSize: '0.88rem'
          }}>
            <thead>
              <tr>
                {['Yöntem', 'Çalışma Süresi', 'Mola Süresi', 'En Uygun Kullanım Alanı'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '0.6rem 1rem',
                    color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, idx) => {
                const isActive = activeMethod === Object.keys(GUIDES)[idx];
                return (
                  <tr
                    key={row.name}
                    onClick={() => setActiveMethod(Object.keys(GUIDES)[idx])}
                    style={{
                      cursor: 'pointer',
                      background: isActive ? `${row.color}08` : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{
                      padding: '0.75rem 1rem', borderRadius: '10px 0 0 10px',
                      fontWeight: 800, color: row.color,
                      borderLeft: isActive ? `3px solid ${row.color}` : '3px solid transparent'
                    }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#334155', fontWeight: 600 }}>
                      {row.work}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#334155', fontWeight: 600 }}>
                      {row.brk}
                    </td>
                    <td style={{
                      padding: '0.75rem 1rem', color: '#64748b', fontWeight: 500,
                      borderRadius: '0 10px 10px 0'
                    }}>
                      {row.best}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyMethodGuide;
