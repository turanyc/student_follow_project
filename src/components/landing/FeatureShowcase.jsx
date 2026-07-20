import React, { useState, useEffect } from 'react';
import { 
  Target, Leaf, Clock, BarChart2, Calendar, Video, Smile, Compass, FileText, 
  Sparkles, CheckCircle, ArrowUpRight, Flame, Trophy, Award, Zap, Play, 
  Pause, RotateCcw, Info, Users, Crown, Shield, Activity, TrendingUp, 
  ChevronRight, ChevronLeft, Check, AlertCircle
} from 'lucide-react';
import AnimatedTreeSvg from '../AnimatedTreeSvg';

const features = [
  {
    id: 'pomodoro',
    title: '5 Farklı Çalışma Yöntemi & Odak Odası',
    subtitle: 'Sana En Uygun Tekniği Seç & Odaklanmaya Başla',
    desc: 'Pomodoro (25+5), Flowtime (45+8), Animedoro (50+20), 52/17 Kuralı ve Aralıklı Tekrar olmak üzere 5 farklı bilimsel odaklanma tekniği. Lofi müzikler ve canlı sayaç ile kesintisiz konsantrasyon odası sayesinde dikkat dağınıklığına son.',
    icon: Clock,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: '5 YÖNTEM & ODA',
    details: [
      'Pomodoro (25+5), Flowtime (45+8), Animedoro (50+20) tam desteği',
      'Canlı odak odasında anlık sayaç, döngü takibi ve Lofi sesler',
      'Çalışılan sürenin anlık olarak ısı haritasına ve öğrenme ağacına eklenmesi'
    ]
  },
  {
    id: 'studymap',
    title: 'Anlık Çalışma Haritan & Isı Takvimi',
    subtitle: 'Canlı Isı Matrisi & İstikrar Serisi (Streak) Takibi',
    desc: 'Her gün tamamladığın pomodorolar, seanslar ve test saatleri bu canlı ısı matrisinde anlık olarak ışıldar. İstikrar serini (Streak) koruyarak her geçen gün daha da güçlen ve platformda efsanevi başarılara imza at.',
    icon: Flame,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'CANLI HARİTA',
    details: [
      'GitHub tarzı 365 günlük canlı çalışma yoğunluğu ısı haritası',
      'Arka arkaya çalıştığın her gün büyüyen İstikrar Serisi (Streak)',
      '1 saat ve 4 saat üzeri çalışmalarda aktif olan özel belirgin renkler'
    ]
  },
  {
    id: 'osym',
    title: 'ÖSYM ve Hedef Simülasyonu',
    subtitle: '2026 YKS/LGS Resmî Sonuç Belgesi Formatında Analiz',
    desc: 'TYT, AYT, YDT ve LGS için gerçek katsayılarla net ve puan simülasyonu. Resmî ÖSYM sonuç belgesi arayüzü ile hedeflediğiniz üniversite için kaç net gerektiğini anında görün ve çalışma stratejinizi belirleyin.',
    icon: Target,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'EN POPÜLER',
    details: [
      'Resmî ÖSYM sonuç belgesi formatında gerçeğe birebir uygun arayüz',
      '2025/2026 güncel katsayılarla tam isabetli Türkiye sıralama tahmini',
      'Hedef üniversite/lise için net açığı ve kazanma durumu analizi'
    ]
  },
  {
    id: 'arena',
    title: 'Canlı Çalışma Arenası & Liderlik',
    subtitle: '1-2-3. Olan Şampiyonların Efsanevi Görünümü',
    desc: 'Haftalık ve günlük en çok odaklanan öğrencilerin yarıştığı canlı arena. İlk 3 sıraya giren şampiyon öğrenciler özel rozetler, çerçeveler ve unvanlarla ödüllendirilir. Rekabetle motivasyonunu sürekli en üst seviyede tut.',
    icon: Trophy,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'CANLI ARENA',
    details: [
      '1. (Zirve Kralı), 2. (Usta Odaklanıcı) ve 3. (Azim Savaşçısı) için özel görünümler',
      'Ağaç seviyesi, haftalık toplam saat ve anlık aktiflik durumu göstergesi',
      'Arkadaşlarla ve Türkiye genelindeki öğrencilerle tatlı motivasyon rekabeti'
    ]
  },
  {
    id: 'gamification',
    title: 'Oyunlaştırma & Öğrenme Ağacı',
    subtitle: 'Çalıştıkça Büyüyen 10 Seviyeli Dijital Eşlikçi',
    desc: 'Her 50 dakikalık odaklanma seansında ağacınızı besleyin. Tohumdan 500+ saatlik Zirve Ağacı seviyesine kadar büyüyün, özel rozetler ve XP kazanarak öğrenme serüveninizi keyifli bir oyuna dönüştürün.',
    icon: Leaf,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'BENZERSİZ',
    details: [
      '10 aşamalı görsel ağaç büyüme animasyonu ve gelişmiş seviyeler',
      '24 farklı başarı rozeti ve dinamik XP liderlik tablosu',
      'Arkadaş ve koçla motivasyon dolu, keyifli gelişim takibi'
    ]
  },
  {
    id: 'ai-analytics',
    title: 'Gelişmiş Performans Analizi',
    subtitle: 'İstatistik Analiz & Net Gelişim Grafikleri',
    desc: 'Girdiğiniz deneme ve etüt verilerini anlık olarak işleyerek net artış grafiğinizi, ders bazlı başarı oranlarınızı ve hangi konuları unutmaya başladığınızı görsel grafiklerle detaylıca sunan akıllı raporlama sistemi.',
    icon: BarChart2,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'AKILLI ANALİZ',
    details: [
      'Denemeler arası net artışı ve uzun vadeli gelişim trendi grafikleri',
      'Ders ve konu bazlı hata oranları ve başarı yüzdesi barları',
      'Akıllı tekrar tavsiyeleri ve eksik konu kapatma uyarıları'
    ]
  },
  {
    id: 'planner',
    title: 'Haftalık & Günlük Akıllı Planlayıcı',
    subtitle: 'İnteraktif Zaman Çizelgesi & Görev Takibi',
    desc: 'Koçunuzun veya kendinizin hazırladığı haftalık ders programını, etüt saatlerini ve deneme tarihlerini saat saat yönetin, tamamlanan görevleri işaretleyin. Sorumluluklarınızı tek ekrandan kolayca takip edin.',
    icon: Calendar,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'PLANLAMA',
    details: [
      'Saatlik zaman çizelgesi ve öncelik dereceli görev kartları',
      'Tamamlandı olarak işaretleme ve günlük başarı yüzdesi takibi',
      'Koç paneliyle anlık senkronizasyon ve akıllı bildirimler'
    ]
  },
  {
    id: 'video-call',
    title: 'Canlı Görüntülü Birebir Koçluk',
    subtitle: 'Kesintisiz Online Görüşme & Rehberlik',
    desc: 'Platform üzerinden ayrılmadan, uzman koçunuzla birebir HD canlı görüntü ve sesli görüşme yapın. Haftalık durum değerlendirmesini tek tıkla başlatarak koçunuzun rehberliğinden anında yararlanın.',
    icon: Video,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'CANLI SEANS',
    details: [
      'Harici uygulama gerektirmeyen entegre, yüksek kaliteli görüşme odası',
      'Randevu takvimi ve yaklaşan seanslar için anlık bildirimler',
      'Koç tavsiyesi notlarını ve stratejilerini ekranda anlık görme'
    ]
  },
  {
    id: 'mood',
    title: 'Duygu Durumu & Motivasyon Takibi',
    subtitle: 'Psikolojik Destek & Stres Yönetimi',
    desc: 'Sınav maratonu sadece bilgi değil, motivasyon ve psikoloji işidir. Günlük duygu durumunuzu (mutlu, kaygılı, yorgun) bildirin, sistem size özel moral desteği sunsun ve koçunuz rehberliğini bu duruma göre uyarlasın.',
    icon: Smile,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'MOTİVASYON',
    details: [
      'Günlük duygu durumu kaydı ve geçmiş istatistik takibi (Mood Tracker)',
      'Kaygı yüksekken devreye giren rahatlatıcı ve odaklayıcı rehberler',
      'Koça anlık iletilen motivasyon seviyesi ve moral raporu'
    ]
  },
  {
    id: 'trials',
    title: 'Deneme Sınavı Gelişim Grafikleri',
    subtitle: 'Net Artışlarını Adım Adım İzleyin',
    desc: 'TYT, AYT, LGS ve branş deneme sonuçlarınızı sisteme kaydedin, zaman içindeki net yükselişinizi, branş bazlı ortalamalarınızı ve eksiklerinizi şık, anlaşılır grafiklerle inceleyerek hedefe emin adımlarla ilerleyin.',
    icon: FileText,
    color: '#1e7796',
    bg: 'rgba(30, 119, 150, 0.12)',
    badge: 'GELİŞİM',
    details: [
      'Ders ders ve konu konu kapsamlı doğru, yanlış ve net kaydı',
      'Türkiye geneli deneme katsayılarıyla net ve puan karşılaştırması',
      'Hedef net grafiği ile adım adım üniversite ve lise başarı tahmini'
    ]
  }
];

// Study Methods definition matching Screenshot 1
const STUDY_METHODS = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    badge: '25dk + 5dk',
    desc: '25 dk çalış, 5 dk mola. 4 turda 15 dk uzun mola.',
    workMins: 25,
    breakMins: 5,
    color: '#ef4444',
    bg: '#fff1f2',
    border: '#fecdd3',
    icon: '🍅'
  },
  {
    id: 'flowtime',
    name: 'Flowtime',
    badge: '45dk + 8dk',
    desc: '45 dk derin odak, 8 dk mola. Doğal ritmine uy.',
    workMins: 45,
    breakMins: 8,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: '🌊'
  },
  {
    id: 'animedoro',
    name: 'Animedoro',
    badge: '50dk + 20dk',
    desc: '50 dk çalış, 20 dk ödül molası. Dizi/oyun/müzik.',
    workMins: 50,
    breakMins: 20,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: '🎮'
  },
  {
    id: 'rule5217',
    name: '52/17 Kuralı',
    badge: '52dk + 17dk',
    desc: '52 dk odak, 17 dk tam dinlenme. Bilimsel ritim.',
    workMins: 52,
    breakMins: 17,
    color: '#d97706',
    bg: '#fefce8',
    border: '#fde047',
    icon: '🧠'
  },
  {
    id: 'spaced',
    name: 'Aralıklı Tekrar',
    badge: '30dk + 5dk',
    desc: '30 dk tekrar seansı, 5 dk mola. Ezber ve dil için.',
    workMins: 30,
    breakMins: 5,
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: '🔄'
  }
];

// Tree level names
const TREE_LEVEL_NAMES = [
  'Tohum', 'Çimlenme', 'Yeşeren Filiz', 'Genç Fidan', 'Kök Salan Ağaç',
  'Gürültülü Yapraklar', 'Yükselen Gövde', 'Çiçek Açan Dalları', 'Meyve Veren Ağaç',
  'Bilge Çınar', 'Zirve Ağacı (Orman Ruhunun Efendisi)'
];

// Mood Options matching Screenshot 4
const MOOD_OPTIONS = [
  { id: 'harika', name: 'Harika', emoji: '🤩', level: 5, color: '#10b981', bg: '#ecfdf5' },
  { id: 'iyi', name: 'İyi', emoji: '😊', level: 4, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'yorgun', name: 'Yorgun', emoji: '😔', level: 3, color: '#f59e0b', bg: '#ffedd5' },
  { id: 'stresli', name: 'Stresli', emoji: '😫', level: 1, color: '#ef4444', bg: '#fee2e2' },
  { id: 'uzgun', name: 'Üzgün', emoji: '😢', level: 2, color: '#8b5cf6', bg: '#f3e8ff' },
  { id: 'heyecanli', name: 'Heyecanlı', emoji: '🚀', level: 5, color: '#06b6d4', bg: '#cffafe' }
];

const FeatureShowcase = ({ onOpenAuth }) => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  // Pomodoro 2-page showcase state
  const [pomodoroPage, setPomodoroPage] = useState(1); // 1 = Methods list, 2 = Live Timer
  const [selectedMethod, setSelectedMethod] = useState(STUDY_METHODS[0]);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // OSYM tab state
  const [osymTab, setOsymTab] = useState('tyt'); // 'tyt' | 'ayt' | 'lgs'

  // Gamification tree selection state
  const [selectedTreeLevel, setSelectedTreeLevel] = useState(6);
  const [hoveredTreeIdx, setHoveredTreeIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 860 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Analytics tab state
  const [analyticsTab, setAnalyticsTab] = useState('total'); // 'total' | 'tyt_branch'

  // Mood tracker selection state
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);

  // Timer interval simulation
  useEffect(() => {
    let interval = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setTimerSeconds(method.workMins * 60);
    setIsRunning(false);
    setPomodoroPage(2);
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
  };

  // Generate organic, naturally varied/randomized heatmap grid data (not regular diagonal stripes)
  const heatmapGrid = React.useMemo(() => {
    const cells = [];
    const colorShades = [
      '#f1f5f9', '#f1f5f9', '#f1f5f9', '#d1fae5', '#d1fae5', 
      '#6ee7b7', '#10b981', '#059669', '#047857', '#f59e0b'
    ];
    for (let i = 0; i < 210; i++) {
      // Use organic sine wave / pseudorandom mixing to create authentic, scattered heatmap clusters
      const pseudoRand = Math.abs(Math.sin(i * 12.9898 + (i * 3.1415)) * 43758.5453) % 1;
      let shadeIndex = Math.floor(pseudoRand * colorShades.length);
      // Give clusters of high activity around weekends/midweek
      if (i % 7 === 5 || i % 7 === 6) {
        shadeIndex = Math.min(colorShades.length - 1, shadeIndex + 3);
      }
      cells.push({ id: i, color: colorShades[shadeIndex] });
    }
    return cells;
  }, []);

  // Custom renderer based on active feature
  const renderCustomShowcaseContent = () => {
    // 1. POMODORO SHOWCASE (2 PAGES)
    if (activeFeature.id === 'pomodoro') {
      return (
        <div style={{ marginTop: '1.5rem' }}>
          {/* 2-Page Tab Switcher */}
          <div style={{
            display: 'flex', alignItems: 'center', background: '#f1f5f9',
            padding: '0.4rem', borderRadius: 16, marginBottom: '2rem', gap: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setPomodoroPage(1)}
              style={{
                flex: 1, padding: '0.85rem 1rem', borderRadius: 12, border: 'none',
                background: pomodoroPage === 1 ? '#ffffff' : 'transparent',
                color: pomodoroPage === 1 ? '#db2777' : '#64748b',
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: pomodoroPage === 1 ? '0 4px 15px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
              }}
            >
              <Sparkles size={18} />
              <span>1. Sayfa: Çalışma Yöntemini Seç</span>
            </button>
            <button
              onClick={() => setPomodoroPage(2)}
              style={{
                flex: 1, padding: '0.85rem 1rem', borderRadius: 12, border: 'none',
                background: pomodoroPage === 2 ? '#ffffff' : 'transparent',
                color: pomodoroPage === 2 ? '#ef4444' : '#64748b',
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: pomodoroPage === 2 ? '0 4px 15px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
              }}
            >
              <Clock size={18} />
              <span>2. Sayfa: Odak Odası & Canlı Sayaç</span>
            </button>
          </div>

          {pomodoroPage === 1 ? (
            /* Page 1: 5 Study Methods (Exact match of Screenshot 1) */
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 1.2rem', borderRadius: 99, background: '#f3e8ff',
                  color: '#7e22ce', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.8rem',
                  border: '1px solid #d8b4fe'
                }}>
                  ✨ ÇALIŞMA YÖNTEMİNİ SEÇ
                </span>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem' }}>
                  Nasıl Çalışmak İstiyorsun?
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                  Sana en uygun tekniği seç ve odaklanmaya başla
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {STUDY_METHODS.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem', borderRadius: 20,
                      background: m.bg, border: `1.5px solid ${m.border}`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.25s', flexWrap: 'wrap', gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flex: 1, minWidth: 260 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 16, background: m.color,
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.6rem', boxShadow: `0 6px 16px ${m.color}40`, flexShrink: 0
                      }}>
                        {m.icon === '🍅' ? <Clock size={28} /> : m.icon === '🌊' ? <Zap size={28} /> : m.icon === '🎮' ? <Sparkles size={28} /> : m.icon === '🧠' ? <Target size={28} /> : <RotateCcw size={28} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{m.name}</span>
                          <span style={{
                            padding: '0.2rem 0.65rem', borderRadius: 8,
                            background: `${m.color}20`, color: m.color,
                            fontSize: '0.78rem', fontWeight: 800
                          }}>
                            {m.badge}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{m.desc}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        title="Bilgi"
                        style={{
                          width: 40, height: 40, borderRadius: '50%', background: 'white',
                          border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <Info size={18} />
                      </button>
                      <button
                        onClick={() => handleSelectMethod(m)}
                        style={{
                          width: 44, height: 44, borderRadius: '50%', background: m.color,
                          border: 'none', color: 'white', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 4px 14px ${m.color}50`, transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Play size={20} fill="white" style={{ marginLeft: 2 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Page 2: Live Timer (Exact match of Screenshot 2) */
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
                  BUGÜN ÇALIŞILAN TOPLAM SÜRE
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', marginTop: '0.3rem' }}>
                  0dk 0sn
                </div>
              </div>

              {/* Glowing Circular Timer UI */}
              <div style={{
                width: 260, height: 260, borderRadius: '50%',
                background: '#fff1f2', border: '8px solid #ffe4e6',
                margin: '0 auto 2.5rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', position: 'relative',
                boxShadow: '0 15px 35px rgba(239, 68, 68, 0.12)'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', background: '#ffedd5',
                  border: '2px solid #fb923c', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '0.5rem', fontSize: '1.6rem'
                }}>
                  🎯
                </div>
                <div style={{
                  fontSize: '3.4rem', fontWeight: 900, color: '#ef4444',
                  fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1
                }}>
                  {formatTimer(timerSeconds)}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#475569', marginTop: '0.5rem' }}>
                  {selectedMethod.name}
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  style={{
                    padding: '0.95rem 2.2rem', borderRadius: 16, border: 'none',
                    background: '#ef4444', color: 'white', fontWeight: 800, fontSize: '1.05rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
                    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.35)', transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isRunning ? <Pause size={20} /> : <Play size={20} fill="white" />}
                  <span>{isRunning ? 'Mola / Duraklat' : 'Çalışmaya Başla'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimerSeconds(selectedMethod.workMins * 60);
                  }}
                  style={{
                    padding: '0.95rem 1.6rem', borderRadius: 16, border: '1.5px solid #cbd5e1',
                    background: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <RotateCcw size={18} />
                  <span>Sıfırla</span>
                </button>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                {selectedMethod.name}: {selectedMethod.workMins} dk çalış, {selectedMethod.breakMins} dk mola ver
              </p>
            </div>
          )}
        </div>
      );
    }

    // 2. STUDYMAP SHOWCASE (Colorful Heatmap with Organic Randomized Colors)
    if (activeFeature.id === 'studymap') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          {/* Stats Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem', marginBottom: '2rem'
          }}>
            <div style={{ background: '#ecfdf5', padding: '1.1rem', borderRadius: 16, border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '0.3rem' }}>BUGÜNKÜ ÇALIŞMA</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#064e3b' }}>3sa 45dk</div>
            </div>
            <div style={{ background: '#eff6ff', padding: '1.1rem', borderRadius: 16, border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.3rem' }}>BU AYKİ EFOR</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a' }}>84sa 12dk</div>
            </div>
            <div style={{ background: '#fef3c7', padding: '1.1rem', borderRadius: 16, border: '1px solid #fde047' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', marginBottom: '0.3rem' }}>MEVCUT SERİ (STREAK)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#78350f', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>24 Gün</span> 🔥
              </div>
            </div>
            <div style={{ background: '#faf5ff', padding: '1.1rem', borderRadius: 16, border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9333ea', marginBottom: '0.3rem' }}>EN UZUN SERİ</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#581c87', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>42 Gün</span> 🏆
              </div>
            </div>
          </div>

          {/* GitHub-style Colorful Heatmap Container */}
          <div style={{
            background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 20,
            padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="#059669" /> Son 1 Yıllık Çalışma Yoğunluğu Haritası
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                <span>Daha Az</span>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#f1f5f9' }} />
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#d1fae5' }} />
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#6ee7b7' }} />
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} />
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#f59e0b' }} />
                <span>Daha Fazla</span>
              </div>
            </div>

            {/* Heatmap Matrix Grid (Organic, Naturally Randomized Distribution) */}
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="custom-scrollbar">
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', paddingRight: '0.4rem' }}>
                <span>Pzt</span>
                <span>Çar</span>
                <span>Cum</span>
                <span>Paz</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: '0.35rem', flex: 1 }}>
                {heatmapGrid.map((c) => (
                  <div
                    key={c.id}
                    title="Günlük Çalışma"
                    style={{
                      width: 14, height: 14, borderRadius: 4,
                      background: c.color,
                      transition: 'transform 0.15s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.4)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Legend Explanation Cards matching Screenshot 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🔥
              </div>
              <div>
                <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>İstikrar Serisi (Streak)</h5>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Arka arkaya çalıştığın her gün serini büyütür ve ağacını güçlendirir.</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                ⚡
              </div>
              <div>
                <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Anlık Renk Koyuluğu</h5>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>1 saat ve üzeri çalışmalarda zümrüt yeşili, 4 saat ve üzerindeki günlerde altın efsaneliği aktif olur.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. ÖSYM HEDEF SİMÜLASYONU SHOWCASE
    if (activeFeature.id === 'osym') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          {/* Exam Type Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['tyt', 'ayt', 'lgs'].map(type => (
              <button
                key={type}
                onClick={() => setOsymTab(type)}
                style={{
                  padding: '0.6rem 1.4rem', borderRadius: 12, border: '1px solid #bae6fd',
                  background: osymTab === type ? '#0284c7' : '#f0f9ff',
                  color: osymTab === type ? 'white' : '#0284c7',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  textTransform: 'uppercase', transition: 'all 0.2s'
                }}
              >
                {type === 'tyt' ? '🎓 2026 TYT Simülasyonu' : type === 'ayt' ? '📈 2026 AYT Sayısal' : '🏫 2026 LGS Hedef'}
              </button>
            ))}
          </div>

          {/* Authentic ÖSYM Result Card Simulation */}
          <div style={{
            background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: 20,
            padding: '1.8rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative', overflow: 'hidden', marginBottom: '1.5rem'
          }}>
            <div style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '1.2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  T.C. ÖLÇME, SEÇME VE YERLEŞTİRME MERKEZİ (SİMÜLASYON)
                </div>
                <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  {osymTab === 'tyt' ? '2026 YKS - TYT Yerleştirme ve Net Analizi' : osymTab === 'ayt' ? '2026 YKS - AYT Sayısal Puan Belgesi' : '2026 LGS - Merkezi Sınav Puanı Analizi'}
                </h4>
              </div>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: 99, fontWeight: 800, fontSize: '0.8rem', border: '1px solid #bbf7d0' }}>
                ✓ 2026 GÜNCEL KATSAYI
              </span>
            </div>

            {/* Simulated Score Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Türkçe / Sözel Neti</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>35.25 Net</div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>36 Doğru - 3 Yanlış</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Matematik / Sayısal Neti</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>34.50 Net</div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>35 Doğru - 2 Yanlış</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '1.2rem', borderRadius: 14, border: '1.5px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>TAHMİNİ YERLEŞTİRME PUANI</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a', margin: '0.2rem 0' }}>
                  {osymTab === 'lgs' ? '484.50' : '512.80'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 800 }}>Türkiye Sıralaması: ~4.150</div>
              </div>
            </div>

            {/* Target University Status Bar */}
            <div style={{
              background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: 16,
              padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.3rem' }}>
                  🎯
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46' }}>SEÇİLİ HEDEF KONTROLÜ</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#064e3b' }}>
                    {osymTab === 'lgs' ? 'Galatasaray Lisesi (482.00 Puan)' : 'Boğaziçi Üniv. - Bilgisayar Mühendisliği (510.00 Puan)'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid #a7f3d0' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#065f46' }}>YETERLİ! (Kazanıyor ✅)</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. CANLI ÇALIŞMA ARENASI & LİDERLİK SHOWCASE
    if (activeFeature.id === 'arena') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.4rem 1.1rem', borderRadius: 99, fontWeight: 800, fontSize: '0.82rem', border: '1px solid #fde047', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Trophy size={16} /> HAFTALIK ŞAMPİYONLAR KÜRSÜSÜ
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> 142 Öğrenci Şu An Odak Odasında
            </span>
          </div>

          {/* Top 3 Epic Spotlight Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* #1 Champion */}
            <div style={{
              background: 'linear-gradient(135deg, #fefce8, #fff)', border: '2.5px solid #eab308',
              borderRadius: 20, padding: '1.4rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', boxShadow: '0 8px 25px rgba(234, 179, 8, 0.18)',
              position: 'relative', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#eab308',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.6rem', boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)'
                }}>
                  👑
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Alperen K.</span>
                    <span style={{ background: '#eab308', color: 'white', padding: '0.2rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 900 }}>
                      #1. SIRADA
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#854d0e', fontWeight: 800 }}>
                    🌟 Seviye 10 • Orman Ruhunun Efendisi
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>48sa 30dk</div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800 }}>🟢 Pomodoro Odasında</div>
              </div>
            </div>

            {/* #2 Champion */}
            <div style={{
              background: '#f8fafc', border: '2px solid #94a3b8', borderRadius: 18,
              padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: '#64748b',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.4rem'
                }}>
                  🥈
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Zeynep M.</span>
                    <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.15rem 0.6rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800 }}>
                      #2. SIRADA
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>
                    🌳 Seviye 9 • Bilge Çınar
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>44sa 15dk</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>21.200 XP</div>
              </div>
            </div>

            {/* #3 Champion */}
            <div style={{
              background: '#fff7ed', border: '2px solid #fdba74', borderRadius: 18,
              padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: '#ea580c',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.4rem'
                }}>
                  🥉
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Burak T.</span>
                    <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.15rem 0.6rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800 }}>
                      #3. SIRADA
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#9a3412', fontWeight: 700 }}>
                    🌲 Seviye 8 • Ulu Meşe
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>41sa 50dk</div>
                <div style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 700 }}>19.800 XP</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. OYUNLAŞTIRMA & ÖĞRENME AĞACI SHOWCASE (Interactive AnimatedTreeSvg Grid)
    if (activeFeature.id === 'gamification') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          {/* Active Spotlight Preview Stage */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '2px solid #a7f3d0',
            borderRadius: 24, padding: '1.8rem', textAlign: 'center', marginBottom: '2rem',
            position: 'relative', overflow: 'hidden', boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)'
          }}>
            <span style={{ background: '#10b981', color: 'white', padding: '0.35rem 1rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block', marginBottom: '1rem' }}>
              🌳 SEÇİLİ AĞAÇ CANLI ANİMASYONU
            </span>
            <div style={{ width: 190, height: 190, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatedTreeSvg level={selectedTreeLevel} points={selectedTreeLevel * 60 + 20} animated={true} />
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#064e3b', margin: '0.8rem 0 0.3rem' }}>
              Seviye {selectedTreeLevel}: {TREE_LEVEL_NAMES[selectedTreeLevel]}
            </h4>
            <p style={{ color: '#059669', fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
              Gereken Süre: {selectedTreeLevel * 50} Saat Odaklanma • Rozet & XP Kilit Açık
            </p>
          </div>

          {/* Side-by-Side Tree Level Grid (Static by default, animated on selection/hover) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🌲 10 AŞAMALI AĞAÇ EVRİMİ (TIKLAYIP ANİMASYONU İNCELEYİN)
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '0.75rem', maxHeight: 360, overflowY: 'auto', paddingRight: '0.4rem'
            }} className="custom-scrollbar">
              {Array.from({ length: 11 }, (_, i) => {
                const isSelected = selectedTreeLevel === i;
                const isAnimated = isSelected || hoveredTreeIdx === i;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedTreeLevel(i)}
                    onMouseEnter={() => setHoveredTreeIdx(i)}
                    onMouseLeave={() => setHoveredTreeIdx(null)}
                    style={{
                      background: isSelected ? '#ffffff' : '#f8fafc',
                      border: `2px solid ${isSelected ? '#10b981' : '#e2e8f0'}`,
                      borderRadius: 16, padding: '0.8rem 0.5rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      cursor: 'pointer', transition: 'all 0.25s',
                      boxShadow: isSelected ? '0 8px 20px rgba(16, 185, 129, 0.2)' : 'none',
                      position: 'relative'
                    }}
                    onMouseOver={e => !isSelected && (e.currentTarget.style.borderColor = '#6ee7b7')}
                    onMouseOut={e => !isSelected && (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    <div style={{ width: 68, height: 68, marginBottom: '0.4rem' }}>
                      <AnimatedTreeSvg level={i} animated={isAnimated} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isSelected ? '#059669' : '#334155' }}>
                      Seviye {i}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 6. GELİŞMİŞ PERFORMANS ANALİZİ SHOWCASE (Net Gelişim Grafiği & İstatistik Analiz)
    if (activeFeature.id === 'ai-analytics') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          {/* Analysis View Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAnalyticsTab('total')}
              style={{
                padding: '0.6rem 1.4rem', borderRadius: 12, border: '1px solid #d8b4fe',
                background: analyticsTab === 'total' ? '#7e22ce' : '#f3e8ff',
                color: analyticsTab === 'total' ? 'white' : '#7e22ce',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📊 Toplam Net Yükseliş Trendi
            </button>
            <button
              onClick={() => setAnalyticsTab('tyt_branch')}
              style={{
                padding: '0.6rem 1.4rem', borderRadius: 12, border: '1px solid #d8b4fe',
                background: analyticsTab === 'tyt_branch' ? '#7e22ce' : '#f3e8ff',
                color: analyticsTab === 'tyt_branch' ? 'white' : '#7e22ce',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📈 Branş Bazlı Net Gelişim Grafiği
            </button>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 20, padding: '1.6rem', border: '1.5px solid #e2e8f0', marginBottom: '1.5rem' }}>
            {analyticsTab === 'total' ? (
              <div>
                <h4 style={{ margin: '0 0 1.2rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} color="#7e22ce" /> Son 4 Deneme Toplam Net Eğrisi
                </h4>
                
                {/* Net Bar Chart Simulation */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 140, paddingTop: 20, paddingBottom: 10, borderBottom: '2px solid #cbd5e1', gap: '1rem' }}>
                  {[
                    { label: 'Deneme 1', net: '74.5', height: '55%', color: '#c084fc' },
                    { label: 'Deneme 2', net: '82.0', height: '70%', color: '#a855f7' },
                    { label: 'Deneme 3', net: '89.5', height: '85%', color: '#9333ea' },
                    { label: 'Deneme 4', net: '96.5 🚀', height: '100%', color: '#7e22ce', isBest: true }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: item.isBest ? '#7e22ce' : '#475569', marginBottom: '0.4rem' }}>{item.net}</span>
                      <div style={{ width: '100%', maxWidth: 48, height: item.height, background: item.color, borderRadius: '8px 8px 0 0', boxShadow: item.isBest ? '0 4px 15px rgba(126, 34, 206, 0.3)' : 'none' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginTop: '0.5rem' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Branch-by-Branch Net Progress Chart */
              <div>
                <h4 style={{ margin: '0 0 1.2rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={20} color="#7e22ce" /> TYT Branş Bazlı Net Gelişim Tablosu (Geçen Ay vs Bu Ay)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { subject: 'TYT Türkçe', prev: '28.50', curr: '35.25', progress: '88%', change: '+%24 Artış 🟢', color: '#9333ea' },
                    { subject: 'TYT Matematik', prev: '24.00', curr: '34.50', progress: '86%', change: '+%43 Artış 🚀', color: '#7e22ce' },
                    { subject: 'TYT Fen Bilimleri', prev: '11.50', curr: '16.75', progress: '84%', change: '+%45 Artış 🟢', color: '#a855f7' },
                    { subject: 'TYT Sosyal Bilgiler', prev: '13.00', curr: '17.50', progress: '88%', change: '+%35 Artış 🟢', color: '#c084fc' }
                  ].map((b, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '1rem 1.2rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.98rem' }}>{b.subject}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Geçen Ay: {b.prev} ➔ <b style={{ color: '#0f172a' }}>Bu Ay: {b.curr} Net</b></span>
                          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 900 }}>{b.change}</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: b.progress, height: '100%', background: b.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendation Alert */}
            <div style={{ background: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: 14, padding: '1rem 1.2rem', marginTop: '1.4rem', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <Sparkles size={22} color="#7e22ce" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Yapay Zeka Koç Analizi & Tavsiyesi</div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#581c87', fontWeight: 600, lineHeight: 1.5 }}>
                  Son denemelerde Matematik ve Türkçe netleriniz muazzam bir ivme kazandı. Bu hafta Geometri 'Çemberde Açılar' konusuna odaklanırsanız +3 net daha artış öngörülmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 7. DUYGU DURUMU & MOTİVASYON TAKİBİ SHOWCASE (Exact 2x2 Grid matching Screenshot 4)
    if (activeFeature.id === 'mood') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          {/* 2x2 Grid on Desktop, 1 Column Stacked on Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            {/* Top-Left Card: Today's Mood Selector */}
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.8rem 1.4rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: selectedMood.bg, margin: '0 auto 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: `0 8px 25px ${selectedMood.color}25` }}>
                  {selectedMood.emoji}
                </div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: selectedMood.color, margin: '0 0 0.2rem' }}>
                  {selectedMood.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, margin: '0 0 1.6rem' }}>
                  Bugünkü durumun
                </p>
              </div>

              {/* Selectable Mood Row */}
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', flexWrap: 'wrap' }}>
                {MOOD_OPTIONS.map((m) => {
                  const isSel = selectedMood.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m)}
                      title={m.name}
                      style={{
                        background: isSel ? m.bg : 'transparent', border: isSel ? `1.5px solid ${m.color}` : '1px solid transparent',
                        borderRadius: 12, padding: '0.4rem 0.3rem', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 45px'
                      }}
                    >
                      <span style={{ fontSize: '1.4rem', marginBottom: '0.15rem' }}>{m.emoji}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: isSel ? 800 : 600, color: isSel ? m.color : '#64748b' }}>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top-Right Card: Weekly Mood Bar Chart */}
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.6rem 1.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Haftalık Duygu Grafiği</h4>
                <p style={{ margin: '0 0 1.2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  5 = Harika / Heyecanlı • 4 = İyi • 3 = Yorgun • 2 = Üzgün • 1 = Stresli
                </p>
              </div>

              {/* Bar Chart Grid */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingBottom: 6, borderBottom: '1.5px solid #cbd5e1', gap: '0.5rem' }}>
                {[
                  { day: 'Pzt', val: 0, height: '4%', color: '#e2e8f0' },
                  { day: 'Sal', val: 0, height: '4%', color: '#e2e8f0' },
                  { day: 'Çar', val: 0, height: '4%', color: '#e2e8f0' },
                  { day: 'Per', val: 0, height: '4%', color: '#e2e8f0' },
                  { day: 'Cum', val: 5, height: '100%', color: '#10b981' },
                  { day: 'Cmt', val: 5, height: '100%', color: '#10b981' },
                  { day: 'Paz', val: 5, height: '100%', color: '#10b981' }
                ].map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', maxWidth: 36, height: d.height, background: d.color, borderRadius: '8px 8px 0 0', transition: 'height 0.3s' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '0.5rem' }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-Left Card: Mood Distribution (Donut Simulation) */}
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.6rem 1.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Duygu Dağılımı</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', margin: 'auto 0' }}>
                {/* Donut Ring Simulation */}
                <div style={{
                  width: 130, height: 130, borderRadius: '50%',
                  background: 'conic-gradient(#10b981 0% 29%, #06b6d4 29% 41%, #f59e0b 41% 65%, #3b82f6 65% 83%, #8b5cf6 83% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)', flexShrink: 0
                }}>
                  <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                    %100
                  </div>
                </div>

                {/* Wrapped legend items below donut so it never overflows or clips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #a7f3d0' }}>🤩 Harika %29</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0891b2', background: '#ecfeff', padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #a5f3fc' }}>🚀 Heyecanlı %12</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', background: '#fffbeb', padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #fde68a' }}>🥱 Yorgun %24</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #bfdbfe' }}>🙂 İyi %18</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce', background: '#faf5ff', padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #e9d5ff' }}>😢 Üzgün %18</span>
                </div>
              </div>
            </div>

            {/* Bottom-Right Card: Recent Records */}
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.6rem 1.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Son Kayıtlar</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { emoji: selectedMood.emoji, name: selectedMood.name, date: '2026-07-19', bg: selectedMood.bg, color: selectedMood.color },
                  { emoji: '😢', name: 'Üzgün', date: '2026-07-18', bg: '#f3e8ff', color: '#7e22ce' },
                  { emoji: '😊', name: 'İyi', date: '2026-07-17', bg: '#eff6ff', color: '#2563eb' },
                  { emoji: '😔', name: 'Yorgun', date: '2026-07-16', bg: '#ffedd5', color: '#c2410c' }
                ].map((r, idx) => (
                  <div key={idx} style={{ background: r.bg, padding: '0.8rem 1.1rem', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{r.emoji}</span>
                      <span style={{ fontWeight: 800, color: r.color, fontSize: '0.94rem' }}>{r.name}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{r.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      );
    }

    // 5. HAFTALIK PLANLAYICI SHOWCASE
    if (activeFeature.id === 'planner') {
      return (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: '#f8fafc', borderRadius: 20, padding: '1.5rem', border: '1.5px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="#ea580c" /> Bugünün Çalışma Programı (Pazartesi)
              </span>
              <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.35rem 0.8rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 800 }}>
                %83 Hedef Tamamlandı
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ background: 'white', padding: '1rem 1.2rem', borderRadius: 14, border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <CheckCircle size={22} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.98rem', textDecoration: 'line-through' }}>TYT Matematik - Problem Çözümü (50 Soru)</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>09:00 - 10:30 • 2 Pomodoro Tamamlandı</div>
                  </div>
                </div>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800 }}>Tamamlandı</span>
              </div>

              <div style={{ background: 'white', padding: '1rem 1.2rem', borderRadius: 14, border: '1.5px solid #ea580c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.08)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Clock size={22} color="#ea580c" />
                  <div>
                    <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.98rem' }}>AYT Fizik - Manyetizma Konu Tekrarı</div>
                    <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 800 }}>11:00 - 12:30 • Sıradaki Etüt Seansı</div>
                  </div>
                </div>
                <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 900 }}>Aktif Görev</span>
              </div>

              <div style={{ background: 'white', padding: '1rem 1.2rem', borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.85, flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Video size={22} color="#0891b2" />
                  <div>
                    <div style={{ fontWeight: 800, color: '#334155', fontSize: '0.98rem' }}>Koç Birebir Haftalık Değerlendirme Görüşmesi</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>15:00 - 15:45 • Canlı Oda</div>
                  </div>
                </div>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800 }}>Planlandı</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default return null if feature doesn't have custom interactive block above details
    return null;
  };

  return (
    <section id="features" style={{
      padding: '6rem 5%',
      background: '#ffffff',
      position: 'relative',
      color: '#0f172a',
      borderTop: '1px solid #e2e8f0'
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 4.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 99, background: '#e0f2fe',
          color: '#0284c7', fontSize: '0.82rem', fontWeight: 800, marginBottom: '1rem',
          border: '1px solid #bae6fd'
        }}>
          <Sparkles size={14} /> PLATFORMUN GÜCÜNÜ KEŞFEDİN
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.25, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: '#0f172a', wordBreak: 'break-word'
        }}>
          Sıradan Takipleri Unutun: <br />
          <span style={{ color: '#1e7796' }}>
            10 Devasa Koçluk ve Oyunlaştırma Özelliği
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
          YKS (TYT-AYT), LGS ve düzenli ders çalışmak isteyen tüm öğrencilerin odaklanmasını artıran, velilerin ve koçların gelişimi saniye saniye izlemesini sağlayan yeni nesil teknolojik altyapı.
        </p>
      </div>

      {/* Interactive Layout: Left Feature Tabs Grid, Right Spotlight Display */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem', alignItems: 'start', maxWidth: 1380, margin: '0 auto', width: '100%'
      }}>
        {/* Left: Feature Selection Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem', height: '780px', maxHeight: '780px', overflowY: 'auto', paddingRight: '0.5rem', width: '100%'
        }} className="custom-scrollbar">
          {features.map((item) => {
            const IconComp = item.icon;
            const isSelected = activeFeature.id === item.id;
            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => {
                    setActiveFeature(item);
                    if (item.id === 'pomodoro') setPomodoroPage(1);
                  }}
                  style={{
                    padding: '1.35rem',
                    borderRadius: 18,
                    background: isSelected ? '#f1f5f9' : 'white',
                    border: `1.5px solid ${isSelected ? '#1e7796' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 10px 25px -5px rgba(30, 119, 150, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}
                  onMouseOver={e => !isSelected && (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={e => !isSelected && (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: item.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color
                    }}>
                      <IconComp size={22} />
                    </div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem',
                      borderRadius: 99, background: `${item.color}15`, color: item.color,
                      letterSpacing: '0.04em'
                    }}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>{item.subtitle}</p>
                </div>

                {/* Mobile Accordion Showcase: Shows right below the clicked item on mobile */}
                {isSelected && isMobile && (
                  <div style={{
                    background: 'white',
                    border: `2px solid ${activeFeature.color}40`,
                    borderRadius: 24, padding: '1.8rem 1.25rem',
                    boxShadow: `0 15px 35px rgba(0,0,0,0.06), 0 0 30px ${activeFeature.color}10`,
                    margin: '0.5rem 0 1.5rem 0',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 16, background: activeFeature.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeFeature.color
                      }}>
                        {React.createElement(activeFeature.icon, { size: 26 })}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: activeFeature.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ÖZEL İNTERAKTİF TANITIM
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>{activeFeature.title}</h3>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem', fontWeight: 500 }}>
                      {activeFeature.desc}
                    </p>

                    {renderCustomShowcaseContent()}

                    <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.2rem', margin: '1.5rem 0', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        BU ÖZELLİKLE NELER KAZANIRSINIZ?
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {activeFeature.details.map((detail, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 700 }}>
                            <CheckCircle size={16} color={activeFeature.color} style={{ flexShrink: 0 }} />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenAuth('register')}
                      style={{
                        width: '100%', padding: '1rem', borderRadius: 14, border: 'none',
                        background: '#1e7796',
                        color: 'white', fontWeight: 800, fontSize: '0.96rem', cursor: 'pointer',
                        transition: 'all 0.3s', boxShadow: '0 8px 25px rgba(30, 119, 150, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                      }}
                    >
                      <span>Bu Özelliği Hemen Ücretsiz Deneyin</span>
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Active Feature Detailed Glassmorphic Showcase Panel (Desktop Only) */}
        {!isMobile && (
          <div style={{
            position: 'sticky', top: '100px',
            background: 'white',
            border: '2px solid rgba(30, 119, 150, 0.25)',
            borderRadius: 28, padding: '2.5rem 2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06), 0 0 40px rgba(30, 119, 150, 0.08)',
            transition: 'all 0.4s ease',
            height: '780px',
            minHeight: '780px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto'
          }} className="custom-scrollbar">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18, background: 'rgba(30, 119, 150, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e7796',
                  boxShadow: '0 10px 20px rgba(30, 119, 150, 0.15)'
                }}>
                  {React.createElement(activeFeature.icon, { size: 32 })}
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e7796', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ÖZEL İNTERAKTİF TANITIM
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{activeFeature.title}</h3>
                </div>
              </div>

              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.5rem', fontWeight: 500 }}>
                {activeFeature.desc}
              </p>

              {/* Render custom interactive showcase block if available */}
              {renderCustomShowcaseContent()}

              <div style={{ background: '#f8fafc', borderRadius: 18, padding: '1.4rem', margin: '1.5rem 0', border: '1px solid #cbd5e1' }}>
                <h4 style={{ margin: '0 0 0.9rem', fontSize: '0.9rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  BU ÖZELLİKLE NELER KAZANIRSINIZ?
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {activeFeature.details.map((detail, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.96rem', color: '#1e293b', fontWeight: 700 }}>
                      <CheckCircle size={18} color="#1e7796" style={{ flexShrink: 0 }} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <button
                onClick={() => onOpenAuth('register')}
                style={{
                  width: '100%', padding: '1.1rem', borderRadius: 16, border: 'none',
                  background: '#1e7796',
                  color: 'white', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
                  transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(30, 119, 150, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>Bu Özelliği Hemen Ücretsiz Deneyin</span>
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureShowcase;





