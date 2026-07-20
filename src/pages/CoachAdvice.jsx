import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle, Award, Star, Eye, Lightbulb, Bookmark, PenTool, 
  Sparkles, Check, ArrowRight, Wind, Heart, Play, Pause, RefreshCw, 
  Zap, Brain, ChevronDown, ChevronUp, Activity, Shield, Target, Clock, MessageSquare 
} from 'lucide-react';
import Swal from 'sweetalert2';

const CoachAdvice = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    reading: false,
    breathing: false
  });

  const [pledgedReading, setPledgedReading] = useState(false);
  const [pledgedBreathing, setPledgedBreathing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('green');
  const [selectedBreathing, setSelectedBreathing] = useState('box');

  // Interactive Breathing Assistant state
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  useEffect(() => {
    if (location.state?.section === 'breathing') {
      setOpenSections({ reading: false, breathing: true });
    } else if (location.state?.section === 'reading') {
      setOpenSections({ reading: true, breathing: false });
    } else {
      setOpenSections({ reading: false, breathing: false });
    }
  }, [location.state]);

  const toggleSection = (sec) => {
    setOpenSections(prev => {
      const isOpening = !prev[sec];
      if (isOpening) {
        return {
          reading: sec === 'reading',
          breathing: sec === 'breathing'
        };
      } else {
        return { ...prev, [sec]: false };
      }
    });
  };

  const handlePledgeReading = () => {
    setPledgedReading(true);
    Swal.fire({
      title: '🌟 Söz Verildi ve Mühürlendi!',
      text: 'Kitaplarını artık "4 Kurşun Kalem" yöntemiyle okuyarak zihnini bir sanat eserine dönüştüreceksin. Harika bir karar!',
      icon: 'success',
      confirmButtonColor: '#ec4899',
      confirmButtonText: 'Başarıya Koş!'
    });
  };

  const handlePledgeBreathing = () => {
    setPledgedBreathing(true);
    Swal.fire({
      title: '🧘‍♂️ Nefes Protokolü Mühürlendi!',
      text: 'Sınav kaygısını ve dikkat dağınıklığını nefes egzersizleriyle kontrol altına alarak odaklanmanı zirveye çıkaracaksın!',
      icon: 'success',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Sakin ve Odaklı Kal ✨'
    });
  };

  const pencilDetails = {
    green: {
      name: '1. Yeşil Kalem',
      title: 'Kilit Kavramların İskeleti',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: '🟢',
      desc: 'Metindeki en temel, kilit ve anahtar kavramların altı yeşil kalemle çizilir.',
      details: 'Metni okurken zihninizin kaybolmasını önleyen nirengi noktalarıdır. Yeşil renk, beynin dikkat merkezini uyararak anahtar terimleri hafızada canlandırır.',
      action: 'Birinci bölüm bittiğinde yapılacak ilk iş: Sadece yeşil kalemle çizilen kilit kavramları ışık hızıyla gözden geçirmektir!'
    },
    red: {
      name: '2. Kırmızı Kalem',
      title: 'Önemli Satırlar ve Vurucu Tanımlar',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: '🔴',
      desc: 'Yazarın can alıcı mesajını verdiği, asla unutulmaması gereken önemli satırların altı kırmızıyla çizilir.',
      details: 'Kırmızı, zihinde aciliyet ve yüksek önem algısı uyandırır. Kitaptaki en kemikli, en besleyici cümleleri kırmızıyla işaretleyerek bilginin özünü yakalarsınız.',
      action: 'Birinci bölümün ikinci tekrar adımında kırmızı kalemle çizilen o can alıcı satırlar dikkatlice ve özümsenerek okunur.'
    },
    blue: {
      name: '3. Mavi Kalem',
      title: 'Hafifçe İşaretlenen Bağlantı Noktaları',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      icon: '🔵',
      desc: 'Atlanmayacak yerler incelikle işaretlenir veya gerekirse üzerinden hafifçe çizilerek geçilir.',
      details: 'Mavi renk sakinliği ve derinliği temsil eder. Ana fikir kadar keskin olmasa da, argümanı birbirine bağlayan, genel kültürü besleyen tamamlayıcı detayları maviyle haritalarsınız.',
      action: 'Okuma esnasında metnin akışını kaybetmemek ve bağlamı güçlendirmek için mavi kalem rehberinizdir.'
    },
    black: {
      name: '4. Kurşun Kalem (Grafit / Mor)',
      title: 'Zirve Dokunuş: Kenar Notları & Üst Boşluk Cümlesi',
      color: '#6d28d9',
      bg: 'rgba(109, 40, 217, 0.08)',
      border: 'rgba(109, 40, 217, 0.3)',
      icon: '🟣',
      desc: 'Sayfanın sağ ve sol kenarlarına notlar alınır, başlıklar çıkarılır ve en önemlisi: SAYFANIN ÜST BOŞLUĞUNA o sayfanın EN ÖNEMLİ CÜMLESİ yazılır!',
      details: 'Okuyucuyu pasif bir alıcı olmaktan çıkarıp aktif bir düşünüre dönüştüren asıl aşamadır. Kenarlara yaptığınız kavramlaştırmalar ve sayfa üstlerine el yazınızla çıkardığınız o tek cümlelik özetler, kitabı tamamen sizin zihni mülkünüz yapar.',
      action: 'Bölüm sonundaki 3. ve son adımda: Sayfaların üst taraflarına kendi kelimelerinizle yazdığınız altın cümleler peş peşe okunarak mükemmel bir sentez tamamlanır!'
    }
  };

  const breathingDetails = {
    box: {
      name: '1. Kutu Nefesi (4-4-4-4)',
      title: 'Sınav Anı Panik & Acil Durum Sıfırlaması',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: '🟩',
      desc: 'Deneme sınavında veya çalışma esnasında stres yükseldiğinde kalp atışını dakikalar içinde dengeleyen taktiksel odak nefesi.',
      details: 'Navy SEALs (Özel Kuvvetler) tarafından yüksek baskı ve kriz anlarında saniyeler içinde maksimum odaklanma ve sükunet sağlamak için kullanılan bilimsel yöntemdir. 4 eşit aşama (4 sn al, 4 sn tut, 4 sn ver, 4 sn bekle) sempatik sinir sistemini (savaş/kaç) yatıştırır ve prefrontal korteksi (akıl yürütme merkezi) anında açar.',
      action: 'Deneme sınavı kitapçığı dağıtıldığında veya zor bir soruda tıkanıp kaygı hissettiğinde kalemi 30 saniyeliğine bırak ve tam 4 tur uygulayıp zihnini sıfırla!',
      phases: [
        { label: 'Burnundan Derin Nefes Al', duration: 4, action: 'expand' },
        { label: 'Nefesini Tut & Zihni Durula', duration: 4, action: 'hold' },
        { label: 'Ağzından Yavaşça Nefes Ver', duration: 4, action: 'contract' },
        { label: 'Ciğerler Boş Bekle (Tut)', duration: 4, action: 'hold-bottom' }
      ]
    },
    '478': {
      name: '2. 4-7-8 Rahatlama ve Uyku Nefesi',
      title: 'Sınav Akşamları Uykusuzluk & Aşırı Kaygı Çözümü',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.08)',
      border: 'rgba(139, 92, 246, 0.3)',
      icon: '🟪',
      desc: 'Harvard Dr. Andrew Weil tarafından geliştirilen, zihinsel aşırı uyarılmayı yatıştırıp uykuya geçişi hızlandıran doğal yatıştırıcı.',
      details: '7 saniye nefes tutmak kandaki oksijeni hücrelere maksimum entegre ederken, 8 saniye boyunca uzun ve yavaş nefes vermek parasempatik sinir sisteminin anahtarı olan Vagus sinirini doğrudan uyarır. Sınav gecesi yatağa girdiğinde zihninde sürekli sorular veya kaygı dönüyorsa bu döngü beynin fişini nazikçe çeker.',
      action: 'Akşam etüt bittiğinde yatağa uzandığında dilinin ucunu üst dişlerinin arkasına dokundur ve bu döngüyü arka arkaya 4 kez tekrarla. Kalp ritmin saniyeler içinde gevşer.',
      phases: [
        { label: 'Burnundan Sessizçe Nefes Al', duration: 4, action: 'expand' },
        { label: 'Nefesini İçinde Tut & Sakinleş', duration: 7, action: 'hold' },
        { label: 'Hafif Islık Sesiyle Nefes Ver', duration: 8, action: 'contract' }
      ]
    },
    diaphragm: {
      name: '3. Diyafram (Karın) Nefesi',
      title: 'Derin Oksijenasyon & Enerji Yenileme',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      icon: '🟦',
      desc: 'Akciğer kapasitesini tam kullanarak beyne giden oksijeni %30 artıran ve ders başındaki uyku halini yok eden enerji nefesi.',
      details: 'Heyecan ve masa başı yanlış oturuş nedeniyle öğrenciler genellikle sığ göğüs nefesi alır. Bu durum beynin erken yorulmasına ve baş ağrısına yol açar. Diyafram nefesinde göğüs değil, göbek deliği bölgesindeki karın kasları balon gibi şişip iner. Böylece akciğerin en alt loblarındaki zengin damar ağına taze oksijen ulaşır.',
      action: 'Pomodoro mola aralarında masadan kalk, bir elini göğsüne diğerini karnına koy. Sadece alttaki elinin hareket ettiğini hissederek 5 dakika derin nefes al; kahveden daha iyi zinde tutar!',
      phases: [
        { label: 'Karnını Şişirerek Derin Nefes Al', duration: 4, action: 'expand' },
        { label: 'Oksijeni Beyninde Hisset (Tut)', duration: 2, action: 'hold' },
        { label: 'Karnını İçeri Çekerek Yavaşça Ver', duration: 6, action: 'contract' }
      ]
    },
    alternate: {
      name: '4. Alternatif Burun Deliği (Denge)',
      title: 'Sağ & Sol Beyin Dengesi ve Odak Toplama',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: '🟨',
      desc: 'Beynin mantıksal (sol) ve yaratıcı/bütüncül (sağ) loblarını senkronize eden, dikkat dağınıklığını bıçak gibi kesen odak protokolü.',
      details: 'Binlerce yıllık Nadi Shodhana tekniğinin modern nörobilimdeki karşılığıdır. Sağ ve sol burun deliklerinden dönüşümlü nefes almak, beynin iki yarımküresi arasındaki elektriksel aktiviteyi dengeler. Sayısal bir dersten sözel bir derse (örn. Matematikten Tarihe) geçerken zihinsel vites değiştirmeyi kolaylaştırır.',
      action: 'Ders değiştirirken veya molada sağ baş parmağınla sağ deliği kapat solla al, sonra yüzük parmağınla solu kapat sağla ver. 3 dakika uygula, dikkatin lazer gibi toplansın!',
      phases: [
        { label: 'Sol Burun Deliğinden Nefes Al', duration: 4, action: 'expand' },
        { label: 'İki Burun Deliğini Kapat & Tut', duration: 4, action: 'hold' },
        { label: 'Sağ Burun Deliğinden Nefes Ver', duration: 4, action: 'contract' },
        { label: 'Sağdan Al, Soldan Ver (Döngü)', duration: 4, action: 'expand' }
      ]
    }
  };

  // Timer logic for Interactive Breathing Assistant
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const currentPhases = breathingDetails[selectedBreathing].phases;
            const nextIndex = (phaseIndex + 1) % currentPhases.length;
            if (nextIndex === 0) {
              setRoundsCompleted((r) => {
                const newR = r + 1;
                if (newR >= 4) {
                  setIsRunning(false);
                  Swal.fire({
                    title: '🧘‍♂️ Harika! Egzersiz Tamamlandı',
                    text: '4 tur nefes egzersizini başarıyla tamamladın. Zihnin berraklaştı ve odaklanmaya tamamen hazır!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Çalışmaya Dön ✨'
                  });
                }
                return newR;
              });
            }
            setPhaseIndex(nextIndex);
            return currentPhases[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, phaseIndex, selectedBreathing]);

  const toggleBreathExercise = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setPhaseIndex(0);
      setTimeLeft(breathingDetails[selectedBreathing].phases[0].duration);
      setIsRunning(true);
      setRoundsCompleted(0);
    }
  };

  const handleBreathingTabSelect = (key) => {
    setSelectedBreathing(key);
    setIsRunning(false);
    setPhaseIndex(0);
    setTimeLeft(breathingDetails[key].phases[0].duration);
    setRoundsCompleted(0);
  };

  const currentPhaseObj = breathingDetails[selectedBreathing].phases[phaseIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ paddingBottom: '4rem', maxWidth: '1150px', margin: '0 auto' }}
    >
      {/* ── TOP HERO BANNER (KOÇUN TAVSİYELERİ HUB) ───────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #6b21a8 80%, #be185d 100%)',
        borderRadius: 26, padding: '3rem 2.5rem', color: 'white',
        boxShadow: '0 15px 40px rgba(107, 33, 168, 0.35)', position: 'relative', overflow: 'hidden',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'absolute', right: '-15px', top: '-15px', fontSize: '14rem', opacity: 0.08, userSelect: 'none' }}>
          🎯
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.9rem', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: 0.5, border: '1px solid rgba(255,255,255,0.25)' }}>
              <Sparkles size={16} /> KOÇUN ÖZEL METOTLARI & ZİHİN YÖNETİMİ
            </span>
          </div>
          <h1 style={{ fontSize: '2.7rem', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.3)', color: '#ffffff' }}>
            Koçun Tavsiyeleri & Başarı Rehberleri
          </h1>
          <p style={{ fontSize: '1.12rem', margin: 0, color: '#f8fafc', maxWidth: '820px', lineHeight: 1.65, fontWeight: 500 }}>
            Gerçek akademi başarısı sadece çok çalışmakla değil, <strong>doğru okuma stratejileriyle zihni inşa etmek</strong> ve <strong>sınav anında kaygıyı nefesle yönetebilmekle</strong> mümkündür. Aşağıdaki başlıklara tıklayarak koçunuzun hazırladığı iki büyük rehberi açın ve inceleyin.
          </p>
        </div>
      </div>

      {/* ── ACCORDION HEADER 1: 4 KURŞUN KALEMLE OKUMA YÖNTEMİ ────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          onClick={() => toggleSection('reading')}
          style={{
            background: openSections.reading 
              ? 'linear-gradient(135deg, #be185d 0%, #db2777 100%)' 
              : 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
            borderRadius: openSections.reading ? '22px 22px 0 0' : '22px',
            padding: '1.6rem 2rem', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: openSections.reading ? '0 12px 30px rgba(190, 24, 93, 0.3)' : '0 8px 25px rgba(131, 24, 67, 0.25)',
            border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.3s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.9rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              📖
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#fbcfe8', display: 'block' }}>1. SEÇENEK • BİLİŞSEL ÖĞRENME STRATEJİSİ</span>
              <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>4 Kurşun Kalemle Okuma Yöntemi</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: openSections.reading ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', padding: '0.6rem 1.2rem', borderRadius: 25, fontSize: '0.9rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {openSections.reading ? (
              <>Seçeneği Gizle <ChevronUp size={18} /></>
            ) : (
              <>👆 1. Seçeneği Aç & İncele <ChevronDown size={18} /></>
            )}
          </div>
        </div>

        {/* ── SECTION 1 CONTENT ────────────────────────────────────────── */}
        <AnimatePresence>
          {openSections.reading && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                background: '#ffffff', borderRadius: '0 0 22px 22px', padding: '2.5rem',
                border: '2px solid #e2e8f0', borderTop: 'none', boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                {/* 4 Kalem Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #fff1f2 0%, #fdf4ff 100%)',
                  borderRadius: 18, padding: '1.75rem', borderLeft: '5px solid #ec4899',
                  marginBottom: '2.5rem'
                }}>
                  <p style={{ fontSize: '1.15rem', margin: 0, color: '#831843', lineHeight: 1.65, fontWeight: 600 }}>
                    Kitaplar asla sıradan bir göz gezdirmeyle değil, mutlaka <strong style={{ color: '#be185d', background: '#fce7f3', padding: '0.15rem 0.5rem', borderRadius: 6 }}>4 Kurşun Kalem</strong> ile aktif bir zihni inşa süreciyle okunmalıdır. Her sayfayı estetik bir sanat tablosuna dönüştürmeye hazır mısın?
                  </p>
                </div>

                {/* Neden Bu Yöntem? */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Lightbulb size={22} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#831843', fontWeight: 900 }}>Neden 4 Kurşun Kalemle Okuma Yöntemi?</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1.4rem', borderRadius: 16, borderLeft: '4px solid #ef4444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 800, fontSize: '1.02rem', marginBottom: '0.5rem' }}>
                        <Eye size={18} /> Görsel Çağın Ayartıcı Tuzakları
                      </div>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        Görsel kültürün hâkim olduğu bir çağda yaşıyoruz. Sadece sınırsız görselliğe maruz kalmak, zihnî faaliyeti yalnızca pasif bir <strong>'görüntü izleme'</strong> sürecine indirgiyor. Denetimsiz görüntü, zihnin derin analiz melekelerini yoksullaştırıyor.
                      </p>
                    </div>

                    <div style={{ background: '#fdf4ff', padding: '1.4rem', borderRadius: 16, borderLeft: '4px solid #d946ef' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a21caf', fontWeight: 800, fontSize: '1.02rem', marginBottom: '0.5rem' }}>
                        <Sparkles size={18} /> Görselliği Yazılı Kültürde Eritmek
                      </div>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        Bu eşsiz okuma yöntemiyle görselliği, <strong>yazılı kültürün içinde eritiyoruz!</strong> Renkli kalemler ve sayfa kenarı notlarıyla ortaya her sayfanın estetik bir resim tablosuna dönüştüğü, zihni canlandıran muazzam bir <strong>"manzara"</strong> çıkmış oluyor.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Renk Kalem Seçici */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#ec4899', fontWeight: 800, background: '#fdf2f8', padding: '0.35rem 1rem', borderRadius: 20, border: '1px solid #fbcfe8', display: 'inline-block', marginBottom: '0.4rem' }}>
                      ✏️ KALEMLERİN İŞLEVLЕRİ VE KULLANIM SIRLARI
                    </span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#831843', margin: 0 }}>4 Kalemin Gücünü Keşfet</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>Renk kartlarına tıklayarak detaylı işlevlerini ve nasıl uygulanacağını inceleyin.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {Object.entries(pencilDetails).map(([key, val]) => {
                      const isSel = selectedColor === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedColor(key)}
                          style={{
                            padding: '1rem', borderRadius: 16, border: isSel ? `2.5px solid ${val.color}` : '2px solid #e2e8f0',
                            background: isSel ? val.bg : 'white', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            boxShadow: isSel ? `0 6px 20px ${val.color}30` : 'none', transform: isSel ? 'translateY(-3px)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '1.75rem' }}>{val.icon}</span>
                          <strong style={{ color: isSel ? val.color : '#334155', fontSize: '0.92rem', fontWeight: 800 }}>{val.name}</strong>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    {(() => {
                      const cur = pencilDetails[selectedColor];
                      return (
                        <motion.div
                          key={selectedColor}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          style={{
                            background: '#ffffff', borderRadius: 18, padding: '2rem',
                            border: `2px solid ${cur.color}`, boxShadow: `0 10px 30px ${cur.color}15`,
                            position: 'relative', overflow: 'hidden'
                          }}
                        >
                          <div style={{ position: 'absolute', right: '15px', bottom: '-15px', fontSize: '8rem', opacity: 0.05, userSelect: 'none' }}>
                            {cur.icon}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: cur.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: 'white', flexShrink: 0 }}>
                              {cur.icon}
                            </div>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: cur.color, textTransform: 'uppercase' }}>{cur.name} İşlevi</span>
                              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.45rem', fontWeight: 900, color: '#831843' }}>{cur.title}</h4>
                            </div>
                          </div>
                          <div style={{ background: cur.bg, padding: '1.15rem 1.4rem', borderRadius: 12, borderLeft: `5px solid ${cur.color}`, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            <p style={{ margin: 0, fontSize: '1.05rem', color: '#831843', fontWeight: 700 }}>🎯 "{cur.desc}"</p>
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            {cur.details}
                          </p>
                          <div style={{ background: '#f8fafc', padding: '0.9rem 1.2rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 2 }}>
                            <span style={{ fontSize: '1.2rem' }}>⚡</span>
                            <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
                              <strong style={{ color: cur.color }}>Koçun Uygulama Notu:</strong> {cur.action}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* 3 Adımlı Tekrar Sırası */}
                <div style={{
                  background: 'linear-gradient(135deg, #4c1d95 0%, #701a75 100%)',
                  borderRadius: 20, padding: '2.5rem', color: 'white', marginBottom: '2.5rem'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 800, border: '1px solid rgba(236,72,153,0.3)', display: 'inline-block', marginBottom: '0.4rem' }}>
                      🚀 BİRİNCİ BÖLÜM BİTİNCE YAPILACAKLAR
                    </span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Zafere Giden 3 Adımlı Tekrar Sırası</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '680px', margin: '0.4rem auto 0' }}>
                      Kitapta bir bölüm bitirildiğinde asla direkt diğer bölüme geçilmez! Aşağıdaki 3 altın adımla bilginin kalıcı hafızaya çelik gibi mühürlendiğinden emin olunur.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(16,185,129,0.3)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#10b981', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 1</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🟢</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#34d399' }}>Yeşil Kalem Taraması</h4>
                      </div>
                      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Önce sadece <strong>yeşil kalemle</strong> altı çizilen anahtar kavramlar çok hızla okunarak zihinde bölümün kavramsal haritası uyandırılır.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(239,68,68,0.3)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#ef4444', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 2</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🔴</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#f87171' }}>Kırmızı Satır Özümsemesi</h4>
                      </div>
                      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Ardından <strong>kırmızı kalemle</strong> çizilen can alıcı, önemli satırlar dikkatlice okunur. Yazarın vermek istediği asıl mesajlar derinlemesine kavranır.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(245,158,11,0.3)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#f59e0b', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 3 (ZİRVE)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>👑</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#fbbf24' }}>Sayfa Üstü Cümleleri</h4>
                      </div>
                      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        En son, sayfaların <strong>üst taraflarına</strong> el yazınızla yazdığınız o altın özet cümleler arka arkaya okunur. Bu aşama bilgiyi kalıcı hafızaya mühürler!
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Kalem Pledge */}
                <div style={{
                  background: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)',
                  borderRadius: 20, padding: '2rem', textAlign: 'center', border: '2px dashed #f472b6'
                }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#831843', margin: '0 0 0.5rem' }}>
                    4 Kurşun Kalem Yöntemini Uygulamaya Söz Veriyor Musun?
                  </h4>
                  <p style={{ color: '#9d174d', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.25rem' }}>
                    Kitap okumalarında bu metodu uygulayarak zihnini bir sanat eserine dönüştürmek için şimdi mühürle!
                  </p>
                  <button
                    onClick={handlePledgeReading}
                    disabled={pledgedReading}
                    style={{
                      background: pledgedReading ? '#10b981' : 'linear-gradient(135deg, #ec4899, #be185d)',
                      color: 'white', border: 'none', borderRadius: 25, padding: '0.85rem 2.2rem',
                      fontSize: '1rem', fontWeight: 800, cursor: pledgedReading ? 'default' : 'pointer',
                      boxShadow: pledgedReading ? '0 4px 15px rgba(16,185,129,0.3)' : '0 6px 20px rgba(236,72,153,0.35)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                    }}
                  >
                    {pledgedReading ? (
                      <><CheckCircle size={20} /> Söz Verildi ve Mühürlendi! ✨</>
                    ) : (
                      <><Sparkles size={20} /> 🙋‍♂️ Söz Veriyorum, 4 Kalem Yöntemini Uygulayacağım!</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ACCORDION HEADER 2: ODAKLANMA & STRES YÖNETİMİ İÇİN NEFES EGZERSİZLERİ ── */}
      <div>
        <div
          onClick={() => toggleSection('breathing')}
          style={{
            background: openSections.breathing 
              ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
              : 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
            borderRadius: openSections.breathing ? '22px 22px 0 0' : '22px',
            padding: '1.6rem 2rem', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: openSections.breathing ? '0 12px 30px rgba(16, 185, 129, 0.3)' : '0 8px 25px rgba(6, 78, 59, 0.25)',
            border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.3s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.9rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              🧘‍♂️
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#d1fae5', display: 'block' }}>2. SEÇENEK • FİZYOLOJİK ODAK & STRES PROTOKOLÜ</span>
              <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>Odaklanma & Stres Yönetimi İçin Nefes Egzersizleri</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: openSections.breathing ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', padding: '0.6rem 1.2rem', borderRadius: 25, fontSize: '0.9rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {openSections.breathing ? (
              <>Seçeneği Gizle <ChevronUp size={18} /></>
            ) : (
              <>👆 2. Seçeneği Aç & İncele <ChevronDown size={18} /></>
            )}
          </div>
        </div>

        {/* ── SECTION 2 CONTENT ────────────────────────────────────────── */}
        <AnimatePresence>
          {openSections.breathing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                background: '#ffffff', borderRadius: '0 0 22px 22px', padding: '2.5rem',
                border: '2px solid #e2e8f0', borderTop: 'none', boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                {/* Breathing Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  borderRadius: 18, padding: '1.75rem', borderLeft: '5px solid #10b981',
                  marginBottom: '2.5rem'
                }}>
                  <p style={{ fontSize: '1.15rem', margin: 0, color: '#065f46', lineHeight: 1.65, fontWeight: 600 }}>
                    Zihin ve beden birbirine sıkı sıkıya bağlıdır. Sınav kaygısı, dikkat dağınıklığı ve zihin tıkanması yaşandığında <strong>sadece nefes ritmini kontrol ederek</strong> beynin prefrontal odak merkezini saniyeler içinde aktive edebilirsiniz!
                  </p>
                </div>

                {/* Neden Nefes Egzersizi? (Fizyolojik & Nörolojik Gerekçe) */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Brain size={22} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#065f46', fontWeight: 900 }}>Neden Nefes Egzersizi? (Nörobilimsel Gerekçe)</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    <div style={{ background: '#fef2f2', padding: '1.4rem', borderRadius: 16, borderLeft: '4px solid #ef4444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 800, fontSize: '1.02rem', marginBottom: '0.5rem' }}>
                        <Activity size={18} /> Sınav Kaygısı ve Amigdala Kaçırılması
                      </div>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        Sınav anında süre baskısı veya zor bir soruyla karşılaşıldığında beyindeki tehlike alarmı <strong>(Amigdala)</strong> devreye girer. Sempatik sinir sistemi uyarılarak kalp atışı hızlanır, sığ göğüs nefesi başlar ve en önemlisi: mantıksal düşünme merkezimiz olan prefrontal korteks kilitlenir! Bildiğiniz soruyu çözememenizin sebebi tam olarak budur.
                      </p>
                    </div>

                    <div style={{ background: '#ecfdf5', padding: '1.4rem', borderRadius: 16, borderLeft: '4px solid #10b981' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '1.02rem', marginBottom: '0.5rem' }}>
                        <Shield size={18} /> Vagus Siniri ile Zihni Resetleme Mucizesi
                      </div>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        Bilinçli, ritmik ve özellikle <strong>uzun nefes vermeye dayalı egzersizler</strong>, vücudumuzdaki en uzun sinir olan <strong>Vagus Sinirini</strong> uyarır. Bu uyarı beynin "Savaş ya da Kaç" alarmını kapatıp "Dinlen ve Odaklan" (Parasempatik) modunu açar. Saniyeler içinde kalp ritmi düşer ve zihin cam gibi berraklaşır.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Temel Nefes Metodu (Tab Selector + Cards) */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 800, background: '#ecfdf5', padding: '0.35rem 1rem', borderRadius: 20, border: '1px solid #a7f3d0', display: 'inline-block', marginBottom: '0.4rem' }}>
                      🧘 BİLİMSEL NEFES TEKNİKLERİ VE KULLANIM ALANLARI
                    </span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#065f46', margin: 0 }}>4 Temel Odak ve Sakinleşme Nefesi</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>Aşağıdaki teknik kartlarına tıklayarak adım adım uygulama rehberini ve koç notlarını inceleyin.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {Object.entries(breathingDetails).map(([key, val]) => {
                      const isSel = selectedBreathing === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleBreathingTabSelect(key)}
                          style={{
                            padding: '1rem', borderRadius: 16, border: isSel ? `2.5px solid ${val.color}` : '2px solid #e2e8f0',
                            background: isSel ? val.bg : 'white', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            boxShadow: isSel ? `0 6px 20px ${val.color}30` : 'none', transform: isSel ? 'translateY(-3px)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '1.75rem' }}>{val.icon}</span>
                          <strong style={{ color: isSel ? val.color : '#334155', fontSize: '0.92rem', fontWeight: 800 }}>{val.name}</strong>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Breathing Details Card */}
                  <AnimatePresence mode="wait">
                    {(() => {
                      const cur = breathingDetails[selectedBreathing];
                      return (
                        <motion.div
                          key={selectedBreathing}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          style={{
                            background: '#ffffff', borderRadius: 18, padding: '2rem',
                            border: `2px solid ${cur.color}`, boxShadow: `0 10px 30px ${cur.color}15`,
                            position: 'relative', overflow: 'hidden', marginBottom: '2rem'
                          }}
                        >
                          <div style={{ position: 'absolute', right: '15px', bottom: '-15px', fontSize: '8rem', opacity: 0.05, userSelect: 'none' }}>
                            {cur.icon}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: cur.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: 'white', flexShrink: 0 }}>
                              {cur.icon}
                            </div>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: cur.color, textTransform: 'uppercase' }}>{cur.name} İşlevi</span>
                              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.45rem', fontWeight: 900, color: '#065f46' }}>{cur.title}</h4>
                            </div>
                          </div>
                          <div style={{ background: cur.bg, padding: '1.15rem 1.4rem', borderRadius: 12, borderLeft: `5px solid ${cur.color}`, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            <p style={{ margin: 0, fontSize: '1.05rem', color: '#065f46', fontWeight: 700 }}>🎯 "{cur.desc}"</p>
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
                            {cur.details}
                          </p>
                          <div style={{ background: '#f8fafc', padding: '0.9rem 1.2rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 2 }}>
                            <span style={{ fontSize: '1.2rem' }}>⚡</span>
                            <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
                              <strong style={{ color: cur.color }}>Koçun Uygulama Notu:</strong> {cur.action}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>

                  {/* ── INTERACTIVE CANLI NEFES ASİSTANI (GÖRSEL SAYAÇ) ──────── */}
                  <div style={{
                    background: 'linear-gradient(135deg, #047857 0%, #0f766e 100%)',
                    borderRadius: 22, padding: '2.5rem', color: 'white',
                    boxShadow: '0 12px 35px rgba(4, 120, 87, 0.25)', position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)', display: 'inline-block', marginBottom: '0.4rem' }}>
                        🎯 İNTERAKTİF EGZERSİZ MODU • CANLI ASİSTAN
                      </span>
                      <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                        {breathingDetails[selectedBreathing].name} ile Şimdi Pratik Yap!
                      </h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.93rem', margin: '0.4rem auto 0', maxWidth: '600px' }}>
                        Aşağıdaki başlat butonuna bas ve açılıp kapanan nefes çemberini takip ederek 4 tur rehberli egzersiz yap.
                      </p>
                    </div>

                    {/* Breathing Circle Visualization */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', margin: '1.5rem 0' }}>
                      <motion.div
                        animate={
                          isRunning ? {
                            scale: currentPhaseObj.action === 'expand' ? 1.35 : currentPhaseObj.action === 'contract' ? 0.85 : 1.35,
                            boxShadow: currentPhaseObj.action === 'expand'
                              ? '0 0 60px rgba(16, 185, 129, 0.6)'
                              : currentPhaseObj.action === 'contract'
                              ? '0 0 20px rgba(16, 185, 129, 0.2)'
                              : '0 0 45px rgba(16, 185, 129, 0.4)'
                          } : { scale: 1, boxShadow: '0 0 25px rgba(255,255,255,0.1)' }
                        }
                        transition={{ duration: currentPhaseObj?.duration || 4, ease: 'easeInOut' }}
                        style={{
                          width: 170, height: 170, borderRadius: '50%',
                          background: isRunning 
                            ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                            : 'rgba(255,255,255,0.1)',
                          border: '4px solid rgba(255,255,255,0.3)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          textAlign: 'center', padding: '1rem', cursor: 'pointer', userSelect: 'none'
                        }}
                        onClick={toggleBreathExercise}
                      >
                        {isRunning ? (
                          <>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
                              {currentPhaseObj.label}
                            </span>
                            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', lineHeight: 1, marginTop: '0.2rem' }}>
                              {timeLeft}s
                            </span>
                          </>
                        ) : (
                          <>
                            <Play size={44} color="#10b981" />
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', marginTop: '0.4rem' }}>
                              BAŞLAT (TIKLA)
                            </span>
                          </>
                        )}
                      </motion.div>

                      {/* Phase & Round Info */}
                      <div style={{ marginTop: '1.8rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.5rem 1.2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Aktif Aşama:</span>{' '}
                          <strong style={{ color: '#34d399', fontSize: '0.92rem' }}>
                            {isRunning ? `${phaseIndex + 1}/${breathingDetails[selectedBreathing].phases.length} • ${currentPhaseObj.label}` : 'Hazır bekliyor'}
                          </strong>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.5rem 1.2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Tamamlanan Tur:</span>{' '}
                          <strong style={{ color: '#fbbf24', fontSize: '0.92rem' }}>{roundsCompleted} / 4 Tur</strong>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={toggleBreathExercise}
                          style={{
                            background: isRunning ? '#ef4444' : '#10b981', color: 'white',
                            border: 'none', borderRadius: 20, padding: '0.65rem 1.8rem',
                            fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: isRunning ? '0 4px 15px rgba(239,68,68,0.4)' : '0 4px 15px rgba(16,185,129,0.4)'
                          }}
                        >
                          {isRunning ? <><Pause size={18} /> Egzersizi Durdur</> : <><Play size={18} /> Rehberli Egzersizi Başlat</>}
                        </button>
                        {isRunning && (
                          <button
                            onClick={() => { setIsRunning(false); setPhaseIndex(0); setTimeLeft(breathingDetails[selectedBreathing].phases[0].duration); setRoundsCompleted(0); }}
                            style={{
                              background: 'rgba(255,255,255,0.15)', color: 'white',
                              border: 'none', borderRadius: 20, padding: '0.65rem 1.2rem',
                              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <RefreshCw size={16} /> Baştan Al
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sınav & Çalışma Rutininde 3 Adımlı Nefes Protokolü */}
                <div style={{
                  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  borderRadius: 20, padding: '2.5rem', color: 'white', marginBottom: '2.5rem'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: '#a7f3d0', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block', marginBottom: '0.4rem' }}>
                      🔥 GÜNLÜK VE SINAV PROTOKOLÜ
                    </span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Zafere Giden 3 Adımlı Nefes Rutini</h3>
                    <p style={{ color: '#d1fae5', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '680px', margin: '0.4rem auto 0' }}>
                      Nefes egzersizi sadece kriz anında değil, güne yayılan bir performans alışkanlığı olmalıdır. Aşağıdaki 3 altın adımla odaklanma kapasiteni 2 katına çıkar!
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#10b981', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 1 • BAŞLANGIÇ</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🏁</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#6ee7b7' }}>Çalışma Öncesi Kutu Nefesi</h4>
                      </div>
                      <p style={{ margin: 0, color: '#ecfdf5', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Masaya oturduğunda telefonu kaldır ve sadece 2 dakika <strong>Kutu Nefesi (4-4-4-4)</strong> yap. Beynine "Dış dünya kapandı, şimdi tam odaklanıyoruz" komutunu ver.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#f59e0b', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 2 • KRİZ ANINDA</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#fde047' }}>Zor Soruda Diyafram Reset</h4>
                      </div>
                      <p style={{ margin: 0, color: '#ecfdf5', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Sınavda takıldığında veya süre paniklettiğinde 15 saniyeliğine gözlerini kapatıp 2 tur derin <strong>Diyafram Nefesi</strong> al. Kortizol salgısını anında kes ve net düşün.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '18px', background: '#8b5cf6', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 10 }}>ADIM 3 • GECE YENİLENMESİ</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🌙</span>
                        <h4 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#d8b4fe' }}>Uyku Öncesi 4-7-8 Konsolidasyon</h4>
                      </div>
                      <p style={{ margin: 0, color: '#ecfdf5', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Gün bitiminde yatağa girdiğinde <strong>4-7-8 nefesiyle</strong> uykuya dal. Öğrendiğin bilgilerin uykuda hipokampüsten kalıcı hafızaya aktarılmasını hızlandır!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Breathing Pledge */}
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  borderRadius: 20, padding: '2rem', textAlign: 'center', border: '2px dashed #10b981'
                }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#065f46', margin: '0 0 0.5rem' }}>
                    Nefes Egzersizlerini Rutinine Katmaya Söz Veriyor Musun?
                  </h4>
                  <p style={{ color: '#047857', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.25rem' }}>
                    Sınav kaygısını sıfırlayıp odaklanma gücünü eline almak için şimdi söz ver ve protokolü mühürle!
                  </p>
                  <button
                    onClick={handlePledgeBreathing}
                    disabled={pledgedBreathing}
                    style={{
                      background: pledgedBreathing ? '#10b981' : 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white', border: 'none', borderRadius: 25, padding: '0.85rem 2.2rem',
                      fontSize: '1rem', fontWeight: 800, cursor: pledgedBreathing ? 'default' : 'pointer',
                      boxShadow: pledgedBreathing ? '0 4px 15px rgba(16,185,129,0.3)' : '0 6px 20px rgba(16,185,129,0.35)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                    }}
                  >
                    {pledgedBreathing ? (
                      <><CheckCircle size={20} /> Söz Verildi! Nefes Protokolü Aktif ✨</>
                    ) : (
                      <><Sparkles size={20} /> 🙋‍♂️ Söz Veriyorum, Nefes Egzersizlerini Uygulayacağım!</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CoachAdvice;
