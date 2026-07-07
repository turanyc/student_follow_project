import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Award, Star, Eye, Lightbulb, Bookmark, PenTool, Sparkles, Check, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const CoachAdvice = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [pledged, setPledged] = useState(false);
  const [selectedColor, setSelectedColor] = useState('green');

  const handlePledge = () => {
    setPledged(true);
    Swal.fire({
      title: '🌟 Söz Verildi ve Mühürlendi!',
      text: 'Kitaplarını artık "4 Kurşun Kalem" yöntemiyle okuyarak zihnini bir sanat eserine dönüştüreceksin. Harika bir karar!',
      icon: 'success',
      confirmButtonColor: '#ec4899',
      confirmButtonText: 'Başarıya Koş!'
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
      name: '4. Siyah Kurşun Kalem',
      title: 'Zirve Dokunuş: Kenar Notları & Üst Boşluk Cümlesi',
      color: '#0f172a',
      bg: 'rgba(15, 23, 42, 0.06)',
      border: 'rgba(15, 23, 42, 0.3)',
      icon: '⚫',
      desc: 'Sayfanın sağ ve sol kenarlarına notlar alınır, başlıklar çıkarılır ve en önemlisi: SAYFANIN ÜST BOŞLUĞUNA o sayfanın EN ÖNEMLİ CÜMLESİ yazılır!',
      details: 'Okuyucuyu pasif bir alıcı olmaktan çıkarıp aktif bir düşünüre dönüştüren asıl aşamadır. Kenarlara yaptığınız kavramlaştırmalar ve sayfa üstlerine el yazınızla çıkardığınız o tek cümlelik özetler, kitabı tamamen sizin zihni mülkünüz yapar.',
      action: 'Bölüm sonundaki 3. ve son adımda: Sayfaların üst taraflarına kendi kelimelerinizle yazdığınız altın cümleler peş peşe okunarak mükemmel bir sentez tamamlanır!'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ paddingBottom: '3rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #be185d 100%)',
        borderRadius: 24, padding: '3rem 2.5rem', color: 'white',
        boxShadow: '0 12px 35px rgba(190, 24, 93, 0.3)', position: 'relative', overflow: 'hidden',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '12rem', opacity: 0.12, userSelect: 'none' }}>
          📖
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: 0.5, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles size={16} /> KOÇUN BAŞARI SIRRI & PEDAGOJİK METODU
            </span>
          </div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, margin: '0 0 1.25rem', lineHeight: 1.15, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
            4 Kurşun Kalemle Okuma Yöntemi
          </h1>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '1.25rem 1.75rem',
            borderRadius: '16px',
            maxWidth: '780px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <p style={{ fontSize: '1.18rem', margin: 0, color: '#ffffff', lineHeight: 1.65, fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              Kitaplar asla sıradan bir göz gezdirmeyle değil, mutlaka <strong style={{ color: '#fef08a', fontWeight: 800, background: 'rgba(254, 240, 138, 0.15)', padding: '0.15rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(254, 240, 138, 0.35)', display: 'inline-block', margin: '0 0.2rem' }}>4 Kurşun Kalem</strong> ile aktif bir zihni inşa süreciyle okunmalıdır. Her sayfayı estetik bir sanat tablosuna dönüştürmeye hazır mısın?
            </p>
          </div>
        </div>
      </div>

      {/* ── NEDEN BU YÖNTEM? (FELSEFE & GEREKÇE) ───────────────────────── */}
      <div style={{
        background: '#ffffff', borderRadius: 24, padding: '2.5rem',
        border: '2px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Lightbulb size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Kültürel & Entelektüel Gerekçe</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0f172a', fontWeight: 900 }}>Neden 4 Kurşun Kalemle Okuma Yöntemi?</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 16, borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              <Eye size={20} /> Görsel Çağın Ayartıcı Tuzakları
            </div>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Görsel kültürün hâkim olduğu bir çağda yaşıyoruz. Sadece sınırsız görselliğe maruz kalmak, zihnî faaliyeti yalnızca pasif bir <strong>'görüntü izleme'</strong> sürecine indirgiyor. Oysa denetimsiz görüntü, hem ayartıcı hem de zihnin derin analiz melekelerini yoksullaştırıcı bir işlev görüyor.
            </p>
          </div>

          <div style={{ background: '#fdf4ff', padding: '1.5rem', borderRadius: 16, borderLeft: '4px solid #d946ef' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a21caf', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} /> Görselliği Yazılı Kültürde Eritmek
            </div>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Bu eşsiz okuma yöntemiyle görselliği, <strong>yazılı kültürün içinde eritiyoruz!</strong> Renkli kalemler ve sayfa kenarı notlarıyla ortaya her sayfanın estetik bir resim tablosuna dönüştüğü, zihni canlandıran muazzam bir <strong>"manzara"</strong> çıkmış oluyor.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 RENK 4 KALEM ETKİLEŞİMLİ KARTLAR ───────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 800, background: '#fdf2f8', padding: '0.35rem 1rem', borderRadius: 20, border: '1px solid #fbcfe8', display: 'inline-block', marginBottom: '0.5rem' }}>
            ✏️ KALEMLERİN İŞLEVLЕРİ VE KULLANIM SIRLARI
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>4 Kalemin Gücünü Keşfet</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem' }}>Aşağıdaki renkli kalem kartlarına tıklayarak detaylı işlevlerini ve nasıl uygulanacağını inceleyin.</p>
        </div>

        {/* Tab Selector buttons */}
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
                <strong style={{ color: isSel ? val.color : '#334155', fontSize: '0.95rem', fontWeight: 800 }}>{val.name}</strong>
              </button>
            );
          })}
        </div>

        {/* Selected Card Details Panel */}
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
                  background: '#ffffff', borderRadius: 20, padding: '2.5rem',
                  border: `2px solid ${cur.color}`, boxShadow: `0 10px 30px ${cur.color}15`,
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', right: '20px', bottom: '-20px', fontSize: '10rem', opacity: 0.05, userSelect: 'none' }}>
                  {cur.icon}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: cur.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: 'white', flexShrink: 0, boxShadow: `0 6px 16px ${cur.color}40` }}>
                    {cur.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: cur.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cur.name} İşlevi</span>
                    <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{cur.title}</h3>
                  </div>
                </div>

                <div style={{ background: cur.bg, padding: '1.25rem 1.5rem', borderRadius: 14, borderLeft: `5px solid ${cur.color}`, marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, lineHeight: 1.5 }}>
                    🎯 "{cur.desc}"
                  </p>
                </div>

                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
                  {cur.details}
                </p>

                <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '1.25rem' }}>⚡</span>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    <strong style={{ color: cur.color }}>Koçun Uygulama Notu:</strong> {cur.action}
                  </span>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* ── BİRİNCİ BÖLÜM BİTİNCE: 3 ADIMLI TEKRAR STRATEJİSİ ────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: 24, padding: '3rem 2.5rem', color: 'white',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.3)', marginBottom: '3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800, border: '1px solid rgba(236,72,153,0.3)', display: 'inline-block', marginBottom: '0.5rem' }}>
            🚀 BİRİNCİ BÖLÜM BİTİNCE YAPILACAKLAR
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, color: 'white' }}>Zafere Giden 3 Adımlı Tekrar Sırası</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '700px', margin: '0.5rem auto 0' }}>
            Kitapta bir bölüm bitirildiğinde asla direkt diğer bölüme geçilmez! Aşağıdaki 3 altın adımla bilginin kalıcı hafızaya çelik gibi mühürlendiğinden emin olunur.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '1.75rem', border: '1px solid rgba(16,185,129,0.3)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#10b981', color: 'white', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.75rem', borderRadius: 12 }}>
              ADIM 1
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🟢</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>Yeşil Kalem Taraması</h3>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Önce sadece <strong>yeşil kalemle</strong> altı çizilen yerler ve anahtar kavramlar çok hızla okunarak zihinde bölümün kavramsal haritası uyandırılır.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '1.75rem', border: '1px solid rgba(239,68,68,0.3)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#ef4444', color: 'white', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.75rem', borderRadius: 12 }}>
              ADIM 2
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🔴</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>Kırmızı Satır Özümsemesi</h3>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Ardından <strong>kırmızı kalemle</strong> altı çizilen o can alıcı, önemli satırlar dikkatlice okunur. Yazarın vermek istediği asıl mesajlar derinlemesine kavranır.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '1.75rem', border: '1px solid rgba(245,158,11,0.3)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#f59e0b', color: 'white', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.75rem', borderRadius: 12 }}>
              ADIM 3 (ZİRVE)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>👑</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>Sayfa Üstü Cümleleri</h3>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              En son, sayfaların <strong>üst taraflarına</strong> kendi el yazınızla yazdığınız o altın özet cümleler arka arkaya okunur. Bu aşama, bilgiyi kalıcı hafızaya mühürler!
            </p>
          </div>
        </div>
      </div>

      {/* ── MOTİVASYON VE SÖZ VERME BLOĞU ────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)',
        borderRadius: 24, padding: '2.5rem', textAlign: 'center',
        border: '2px dashed #f472b6', boxShadow: '0 8px 25px rgba(244,114,182,0.15)'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 6px 16px rgba(236,72,153,0.4)' }}>
          <Award size={36} />
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#831843', margin: '0 0 0.5rem' }}>
          Bu Yöntemi Uygulamaya Söz Veriyor Musun?
        </h3>
        <p style={{ color: '#9d174d', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Koçunun tasarladığı 4 Kurşun Kalem metodunu kitap okumalarında uygulayarak zihnini geliştirmek ve netlerini zirveye taşımak için şimdi bir adım at!
        </p>
        <button
          onClick={handlePledge}
          disabled={pledged}
          style={{
            background: pledged ? '#10b981' : 'linear-gradient(135deg, #ec4899, #be185d)',
            color: 'white', border: 'none', borderRadius: 30,
            padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800,
            cursor: pledged ? 'default' : 'pointer', boxShadow: pledged ? '0 4px 15px rgba(16,185,129,0.3)' : '0 8px 25px rgba(236,72,153,0.4)',
            transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            transform: pledged ? 'scale(1)' : 'scale(1.02)'
          }}
        >
          {pledged ? (
            <>
              <CheckCircle size={22} /> Söz Verildi! Artık 4 Kalemle Okuyorsun ✨
            </>
          ) : (
            <>
              <Sparkles size={22} /> 🙋‍♂️ Söz Veriyorum, 4 Kalem Yöntemini Uygulayacağım!
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default CoachAdvice;
