import React, { useState } from 'react';
import { Target, Leaf, Clock, BarChart2, Calendar, Video, Smile, Compass, FileText, Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';

const features = [
  {
    id: 'osym',
    title: 'ÖSYM Hedef Simülasyonu',
    subtitle: 'Resmî Sonuç Belgesi Formatında Analiz',
    desc: 'TYT, AYT, YDT ve LGS için güncel katsayılarla gerçek sınav sonucu simülasyonu. Hedeflediğiniz üniversite ve bölüm için kaç net ve sıralama gerektiğini anlık görün.',
    icon: Target,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    badge: 'EN POPÜLER',
    details: ['Resmî ÖSYM sonuç belgesi arayüzü', '2025/2026 katsayılarına göre sıralama tahmini', 'Hedef üniversite ile net açığı analizi']
  },
  {
    id: 'gamification',
    title: 'Oyunlaştırma & Öğrenme Ağacı',
    subtitle: 'Çalıştıkça Büyüyen 8 Seviyeli Dijital Eşlikçi',
    desc: 'Her 50 dakikalık odaklanma seansında ağacınızı besleyin. Tohumdan 200+ saatlik Efsanevi Hayat Ağacı seviyesine kadar büyüyün, özel rozetler ve XP kazanın.',
    icon: Leaf,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    badge: 'BENZERSİZ',
    details: ['8 aşamalı görsel ağaç büyüme animasyonu', '24 farklı başarı rozeti ve XP liderlik tablosu', 'Arkadaş ve koçla tatlı rekabet']
  },
  {
    id: 'pomodoro',
    title: 'Akıllı Pomodoro & Odak Odası',
    subtitle: 'Kesintisiz Konsantrasyon & Lofi Müzikler',
    desc: '50 dakika odak, 10 dakika mola veya serbest zamanlayıcı ile maksimum verim. Arkada çalan rahatlatıcı çalışma müzikleri ile dikkat dağıtıcıları dışarıda bırakın.',
    icon: Clock,
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.12)',
    badge: 'VERİMLİLİK',
    details: ['Özelleştirilebilir süre ve mola döngüleri', 'Entegre Lofi ve doğa sesleri kütüphanesi', 'Günlük/Haftalık toplam odaklanma istatistikleri']
  },
  {
    id: 'ai-analytics',
    title: 'Yapay Zeka Destekli Performans Analizi',
    subtitle: 'Zayıf Konuları Tespit Eden Akıllı Koçluk',
    desc: 'Girdiğiniz deneme sınavı verilerini işleyerek hangi derste hangi konuları unutmaya başladığınızı algılar ve kişiye özel koçluk tavsiyeleri üretir.',
    icon: BarChart2,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    badge: 'YAPAY ZEKA',
    details: ['Ders ve konu bazlı hata ısı haritaları', 'Geriye dönük performans trend eğrileri', 'Akıllı tekrar tavsiyeleri ve yönlendirme']
  },
  {
    id: 'planner',
    title: 'Haftalık & Günlük Akıllı Planlayıcı',
    subtitle: 'İnteraktif Takvim & Görev Takibi',
    desc: 'Koçunuzun veya kendinizin hazırladığı haftalık ders programını, etüt saatlerini ve deneme tarihlerini sürükle-bırak kolaylığıyla yönetin.',
    icon: Calendar,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    badge: 'PLANLAMA',
    details: ['Haftalık ve aylık takvim görünümleri', 'Tamamlandı olarak işaretleme ve günlük görev listesi', 'Koç paneliyle anlık senkronizasyon']
  },
  {
    id: 'video-call',
    title: 'Canlı Görüntülü Birebir Koçluk',
    subtitle: 'Kesintisiz Online Görüşme & Rehberlik',
    desc: 'Platform üzerinden ayrılmadan, uzman koçunuzla birebir HD canlı görüntü ve sesli görüşme yapın. Haftalık durum değerlendirmesini tek tıkla başlatın.',
    icon: Video,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    badge: 'CANLI SEANS',
    details: ['Harici uygulama gerektirmeyen entegre oda', 'Randevu takvimi ve anlık bildirimler', 'Koç tavsiyesi notlarını ekranda görme']
  },
  {
    id: 'mood',
    title: 'Duygu Durumu & Motivasyon Takibi',
    subtitle: 'Psikolojik Destek & Stres Yönetimi',
    desc: 'Sınav maratonu sadece bilgi değil, psikoloji işidir. Günlük duygu durumunuzu (mutlu, kaygılı, yorgun) bildirin, sistem size özel moral ve koçluk desteği sunsun.',
    icon: Smile,
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    badge: 'PSİKOLOJİK',
    details: ['Günlük duygu durumu kaydı (Mood Tracker)', 'Kaygı yüksekken devreye giren rahatlatıcı rehberler', 'Koça iletilen stres seviyesi raporu']
  },
  {
    id: 'discovery',
    title: 'Keşif & Rehberlik Kütüphanesi',
    subtitle: 'Başarı Hikayeleri & Sınav Stratejileri',
    desc: 'Türkiye derecesi yapmış öğrencilerin taktikleri, bölüm tanıtımları, çıkmış soru teknikleri ve motivasyon artıran özel içerik havuzuna sınırsız erişin.',
    icon: Compass,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    badge: 'KÜTÜPHANE',
    details: ['Güncel ÖSYM & MEB müfredat duyuruları', 'Derece öğrencilerinden video rehberler', 'Sınav taktikleri ve zaman yönetimi makaleleri']
  },
  {
    id: 'trials',
    title: 'Deneme Sınavı Gelişim Grafikleri',
    subtitle: 'Net Artışlarını Adım Adım İzleyin',
    desc: 'TYT, AYT ve LGS deneme sonuçlarınızı kaydedin, zaman içindeki net yükselişinizi, branş bazlı ortalamalarınızı şık grafiklerle inceleyin.',
    icon: FileText,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    badge: 'GELİŞİM',
    details: ['Ders ders doğru/yanlış/net kaydı', 'Türkiye geneli deneme net karşılaştırması', 'Hedef net grafiği ve başarı tahmini']
  }
];

const FeatureShowcase = ({ onOpenAuth }) => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section id="features" style={{
      padding: '6rem 6%',
      background: '#0b0f19',
      position: 'relative',
      color: 'white',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto 4.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 99, background: 'rgba(56, 189, 248, 0.12)',
          color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <Sparkles size={14} /> PLATFORMUN GÜCÜNÜ KEŞFEDİN
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: 'white'
        }}>
          Sıradan Takipleri Unutun: <br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #818cf8, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            9 Devasa Koçluk ve Oyunlaştırma Özelliği
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          YKS (TYT-AYT) ve LGS hazırlık sürecinde öğrencilerin odaklanmasını artıran, velilerin ve koçların gelişimi saniye saniye izlemesini sağlayan 10.000 dolarlık teknolojik altyapı.
        </p>
      </div>

      {/* Interactive Layout: Left Feature Tabs Grid, Right Spotlight Display */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem', alignItems: 'start', maxWidth: 1350, margin: '0 auto'
      }}>
        {/* Left: Feature Selection Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem', maxHeight: 680, overflowY: 'auto', paddingRight: '0.5rem'
        }} className="custom-scrollbar">
          {features.map((item) => {
            const IconComp = item.icon;
            const isSelected = activeFeature.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveFeature(item)}
                style={{
                  padding: '1.35rem',
                  borderRadius: 18,
                  background: isSelected ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.4)',
                  border: `1.5px solid ${isSelected ? item.color : 'rgba(255, 255, 255, 0.07)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? `0 15px 35px -10px ${item.color}30` : 'none',
                  position: 'relative'
                }}
                onMouseOver={e => !isSelected && (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)')}
                onMouseOut={e => !isSelected && (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)')}
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
                    borderRadius: 99, background: `${item.color}20`, color: item.color,
                    letterSpacing: '0.04em'
                  }}>
                    {item.badge}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>{item.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Active Feature Detailed Glassmorphic Showcase Panel */}
        <div style={{
          position: 'sticky', top: '110px',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
          border: `2px solid ${activeFeature.color}50`,
          borderRadius: 28, padding: '3rem 2.5rem',
          backdropFilter: 'blur(25px)',
          boxShadow: `0 30px 70px -15px rgba(0,0,0,0.6), 0 0 50px ${activeFeature.color}15`,
          transition: 'all 0.4s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, background: activeFeature.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeFeature.color,
              boxShadow: `0 10px 25px ${activeFeature.color}30`
            }}>
              {React.createElement(activeFeature.icon, { size: 34 })}
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: activeFeature.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ÖZEL TANITIM MODÜLÜ
              </span>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{activeFeature.title}</h3>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 400 }}>
            {activeFeature.desc}
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 18, padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.92rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BU ÖZELLİKLE NELER KAZANIRSINIZ?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeFeature.details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.98rem', color: '#e2e8f0', fontWeight: 600 }}>
                  <CheckCircle size={18} color={activeFeature.color} style={{ flexShrink: 0 }} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenAuth('register')}
            style={{
              width: '100%', padding: '1.1rem', borderRadius: 16, border: 'none',
              background: `linear-gradient(135deg, ${activeFeature.color}, #6366f1)`,
              color: 'white', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: `0 10px 30px ${activeFeature.color}40`,
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
    </section>
  );
};

export default FeatureShowcase;
