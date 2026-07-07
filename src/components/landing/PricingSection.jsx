import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, HelpCircle, ArrowRight } from 'lucide-react';

const PricingSection = ({ onOpenAuth, onOpenRoadmap }) => {
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual for 2 months free

  return (
    <section id="pricing" style={{
      padding: '6rem 6%',
      background: '#0b0f19',
      position: 'relative',
      color: 'white',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      {/* Background Neon Orb */}
      <div style={{
        position: 'absolute', top: '40%', right: '10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto 3.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 99, background: 'rgba(236, 72, 153, 0.12)',
          color: '#f472b6', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem',
          border: '1px solid rgba(236, 72, 153, 0.3)'
        }}>
          <Sparkles size={14} /> ŞEFFAF & AVANTAJLI FİYATLANDIRMA
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: 'white'
        }}>
          Geleceğinize Doğru Yatırımı Yapın: <br />
          <span style={{
            background: 'linear-gradient(135deg, #f472b6, #818cf8, #38bdf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Eğitim & Koçluk Paketleri
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          Hiçbir gizli ücret yok. İster aylık esneklikle, ister yıllık %16 indirim ve 2 ay hediye avantajıyla hemen başlayın.
        </p>

        {/* Billing Toggle Switch */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '1rem',
          background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem', borderRadius: 99,
          border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <button
            onClick={() => setIsAnnual(false)}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: 99, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.92rem', transition: 'all 0.25s',
              background: !isAnnual ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: !isAnnual ? 'white' : '#94a3b8',
              boxShadow: !isAnnual ? '0 4px 15px rgba(99,102,241,0.4)' : 'none'
            }}
          >
            Aylık Ödeme
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            style={{
              padding: '0.6rem 1.6rem', borderRadius: 99, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.92rem', transition: 'all 0.25s',
              background: isAnnual ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
              color: isAnnual ? 'white' : '#94a3b8',
              boxShadow: isAnnual ? '0 4px 15px rgba(236,72,153,0.4)' : 'none',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <span>Yıllık Ödeme</span>
            <span style={{ fontSize: '0.7rem', background: '#fbbf24', color: '#1e1b4b', padding: '0.15rem 0.5rem', borderRadius: 99, fontWeight: 900 }}>
              2 AY HEDİYE (%16 İNDİRİM)
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem', maxWidth: 1250, margin: '0 auto', alignItems: 'stretch'
      }}>
        
        {/* Tier 1: Free Starter */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', backdropFilter: 'blur(20px)', transition: 'all 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BAŞLANGIÇ</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '0.3rem 0 1rem' }}>Temel Takip Paketi</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, minHeight: 45 }}>
              Platforma alışmak ve kendi kendine çalışma düzeni kurmak isteyen öğrenciler için.
            </p>
            <div style={{ margin: '1.5rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white' }}>0 TL</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '0.4rem' }}>/ Süresiz Ücretsiz</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem' }}>
              {[
                'Standart Pomodoro Odak Zamanlayıcısı',
                'Öğrenme Ağacı (Genç Ağaç - Seviye 3 e kadar)',
                'Temel Günlük Çalışma Saat Takibi',
                'Basit ÖSYM Net Hesaplama Aracı',
                'Topluluk Keşif Kütüphanesi Erişimi'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <Check size={18} color="#34d399" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenAuth('register')}
            style={{
              width: '100%', padding: '0.9rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: 'white', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Ücretsiz Kayıt Ol & Başla
          </button>
        </div>

        {/* Tier 2: VIP Coach & ÖSYM PRO (En Popüler) */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          border: '2px solid #ec4899',
          borderRadius: 26, padding: '2.5rem 2.2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', backdropFilter: 'blur(25px)',
          boxShadow: '0 25px 60px rgba(236,72,153,0.2), 0 0 40px rgba(99,102,241,0.2)',
          position: 'relative', transform: 'scale(1.03)', zIndex: 5
        }}>
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #ec4899, #6366f1)', color: 'white',
            fontWeight: 900, fontSize: '0.78rem', padding: '0.35rem 1.25rem', borderRadius: 99,
            boxShadow: '0 4px 15px rgba(236,72,153,0.6)', letterSpacing: '0.05em'
          }}>
            🌟 EN ÇOK TERCİH EDİLEN VİP PAKET
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRO KOÇLUK</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 800 }}>⭐ 14 GÜN DENEME</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 1rem' }}>VİP Koçluk & ÖSYM Pro</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, minHeight: 45 }}>
              Hayalindeki üniversite veya lisede sıfır şansa yer bırakmak isteyenler için eksiksiz profesyonel takip.
            </p>
            <div style={{ margin: '1.5rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              {isAnnual ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white' }}>9.000 TL</span>
                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ Yıllık Toplam</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, marginTop: '0.3rem' }}>
                    🎉 Aylık sadece 750 TL'ye gelir! 2 Ay (1.800 TL) Bizden Hediye!
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white' }}>900 TL</span>
                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ Aylık Ödeme</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#f472b6', fontWeight: 600, marginTop: '0.3rem' }}>
                    💡 Yıllık pakete geçerek %16 indirim kazanabilirsiniz.
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem' }}>
              {[
                'Birebir Canlı Görüntülü Koçluk Seansları',
                'Sınırsız ÖSYM Türkiye Sıralama Simülasyonu',
                'Yapay Zeka Destekli Zayıf Konu Analizi',
                '7/24 Koç ile Soru-Cevap ve Mesajlaşma',
                'Efsanevi Hayat Ağacı (Seviye 7) ve Tüm Rozetler',
                'Günlük Duygu Durumu (Mood) ve Stres Desteği',
                'Kişiye Özel Haftalık Sürükle-Bırak Planlayıcı'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: 'white', fontWeight: 600 }}>
                  <Check size={18} color="#f472b6" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenAuth('register')}
            style={{
              width: '100%', padding: '1.1rem', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #6366f1)',
              color: 'white', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 8px 25px rgba(236,72,153,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(236,72,153,0.7)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(236,72,153,0.5)'; }}
          >
            <span>VİP Pro Paketi Hemen Deneyin</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Tier 3: Kurumsal / Okul */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', backdropFilter: 'blur(20px)', transition: 'all 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KURUMSAL</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '0.3rem 0 1rem' }}>Okul & Dershane Paketi</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, minHeight: 45 }}>
              Rehberlik servisleri, etüt merkezleri ve özel koçluk ofisleri için toplu öğrenci takip çözümleri.
            </p>
            <div style={{ margin: '1.5rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white' }}>Özel Fiyat</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '0.4rem' }}>/ Toplu Lisans</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem' }}>
              {[
                'Çoklu Koç / Rehber Öğretmen Paneli',
                'Toplu Sınıf ve Deneme Sonucu İçe Aktarma',
                'Kuruma Özel Logo ve Renk Özelleştirmesi',
                'Detaylı Veli Bilgilendirme Raporları',
                'Özel Teknik Destek ve Hesap Yöneticisi'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <Check size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenAuth('register')}
            style={{
              width: '100%', padding: '0.9rem', borderRadius: 14, border: '1px solid rgba(56,189,248,0.4)',
              background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.1)'; }}
          >
            Kurumsal Teklif İsteyin
          </button>
        </div>

      </div>

      {/* Payment Roadmap CTA Banner Bottom */}
      <div style={{
        maxWidth: 1050, margin: '5rem auto 0',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(120, 53, 15, 0.25))',
        border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 22, padding: '2.5rem',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', maxWidth: 650 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0
          }}>
            <ShieldCheck size={30} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              Türkiye'de Ödeme ve Abonelik Sistemi Nasıl Kurulur?
            </h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              Aylık 900 TL ve Yıllık 9.000 TL'lik bu paketleri Türkiye'de aktif satmak için İyzico, PayTR, e-Fatura ve yasal ETBİS aşamalarını içeren 6 adımlı rehberimizi inceleyin.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRoadmap}
          style={{
            padding: '0.9rem 1.6rem', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white',
            fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 6px 20px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>Ödeme Entegrasyon Rehberini Aç</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default PricingSection;
