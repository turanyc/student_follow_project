import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Award, Users, Star, Clock } from 'lucide-react';

const HeroSection = ({ onOpenAuth }) => {
  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      padding: '5rem 6% 6rem',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at top center, rgba(30, 27, 75, 0.4) 0%, rgba(11, 15, 25, 1) 70%)',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* Background Neon Glowing Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 1
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '15%', width: 550, height: 550,
        background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 400,
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none', zIndex: 1
      }} />

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1050, margin: '0 auto' }}>
        
        {/* Top Pill Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.5rem 1.25rem', borderRadius: 99,
          background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)',
          color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 700, marginBottom: '2rem',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)',
          animation: 'bounce 3s ease-in-out infinite'
        }}>
          <Sparkles size={16} color="#f472b6" />
          <span>2026 YKS & LGS Hazırlıkta Yapay Zeka Koçluk Devrimi!</span>
          <span style={{ background: '#ec4899', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 99, fontWeight: 800 }}>YENİ</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          marginBottom: '1.75rem',
          color: '#ffffff',
          textShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          Geleceğini Şimdiden <br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 40%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 35px rgba(236,72,153,0.3))'
          }}>
            Akıllı Koçlukla İnşa Et!
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
          color: '#94a3b8',
          lineHeight: 1.7,
          maxWidth: 780,
          margin: '0 auto 2.75rem',
          fontWeight: 400
        }}>
          Odaklanmanı zirveye taşıyan <strong style={{ color: '#38bdf8' }}>Pomodoro tekniği</strong>, çalıştıkça büyüttüğün <strong style={{ color: '#10b981' }}>200 saatlik efsanevi öğrenme ağaçları</strong>, gerçek sonuç belgesi formatında <strong style={{ color: '#f472b6' }}>ÖSYM net simülasyonu</strong> ve <strong style={{ color: '#c4b5fd' }}>birebir uzman koçluk</strong> seansları ile hayalindeki üniversiteye veya liseye ulaş.
        </p>

        {/* Action Button Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '4rem' }}>
          <button
            onClick={() => onOpenAuth('register')}
            style={{
              padding: '1.1rem 2.4rem', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 10px 35px rgba(99, 102, 241, 0.5)',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 45px rgba(236, 72, 153, 0.6)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 35px rgba(99, 102, 241, 0.5)'; }}
          >
            <Zap size={20} />
            <span>Hemen Ücretsiz Başla</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={scrollToPricing}
            style={{
              padding: '1.1rem 2.2rem', borderRadius: 16, border: '1.5px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(30, 41, 59, 0.6)', color: '#e2e8f0', fontWeight: 700, fontSize: '1.05rem',
              cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(15px)',
              display: 'flex', alignItems: 'center', gap: '0.6rem'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)'; e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Award size={19} color="#38bdf8" />
            <span>VİP Paketleri İncele</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', color: '#cbd5e1', fontSize: '0.92rem', fontWeight: 600, marginBottom: '5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <CheckCircle2 size={18} color="#10b981" /> MEB & ÖSYM 2026 Müfredat Uyumu
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <CheckCircle2 size={18} color="#38bdf8" /> Kredi Kartı & İyzico/PayTR Güvencesi
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <CheckCircle2 size={18} color="#f472b6" /> 14 Gün Ücretsiz Deneme Fırsatı
          </span>
        </div>

        {/* Floating Mockup Preview Cards (Glassmorphism Showcase) */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem', marginTop: '1rem', textAlign: 'left'
        }}>
          {/* Card 1: ÖSYM Net Takibi */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 20, padding: '1.5rem',
            backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(56,189,248,0.15)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>🎯 ÖSYM Simülasyonu</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TYT - AYT</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: 'white', fontWeight: 800 }}>Hedef: Boğaziçi Bilgisayar Müh.</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.8rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>108.75</span>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>TYT Net Tahmini</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: 99 }} />
            </div>
          </div>

          {/* Card 2: Gamification Ağaç Evrimi */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 20, padding: '1.5rem',
            backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(16,185,129,0.15)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>🌳 Oyunlaştırma</span>
              <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>⭐ Seviye 7</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', my: '0.5rem' }}>
              <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 0 15px rgba(251,191,36,0.6))' }}>🌲✨</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24', fontWeight: 800 }}>Efsanevi Hayat Ağacı</h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>200+ saatlik muazzam odaklanma!</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a7f3d0', marginTop: '1rem', fontWeight: 600 }}>
              <span>Rozet: 24/24 Tamamlandı</span>
              <span>⚡ +500 XP Puanı</span>
            </div>
          </div>

          {/* Card 3: Canlı Birebir Koçluk */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 20, padding: '1.5rem',
            backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(236,72,153,0.15)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>📹 VİP Koçluk</span>
              <span style={{ fontSize: '0.8rem', color: '#f472b6', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} /> Canlı Seans
              </span>
            </div>
            <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.15rem', color: 'white', fontWeight: 800 }}>Dr. Zeynep Koç ile Görüşme</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>Haftalık TYT Matematik ve Duygu Durum (Mood) Analizi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
              <button style={{ flex: 1, padding: '0.5rem', borderRadius: 10, border: 'none', background: 'rgba(236,72,153,0.2)', color: '#f472b6', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Görüşmeye Bağlan 🚀</button>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Counter Bar Bottom */}
      <div style={{
        position: 'relative', zIndex: 5, width: '100%', maxWidth: 1150, margin: '5rem auto 0',
        background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24, padding: '2.5rem 2rem', backdropFilter: 'blur(20px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
      }}>
        {[
          { icon: TrendingUp, count: '%96', label: 'Hedef Lisans & Liseye Yerleşme', color: '#10b981' },
          { icon: Award, count: '+50.000', label: 'Çözülen Soru & Deneme Analizi', color: '#38bdf8' },
          { icon: Clock, count: '+120.000', label: 'Tamamlanan Odak Seansı (Saat)', color: '#8b5cf6' },
          { icon: Star, count: '4.9 / 5.0', label: 'Veli ve Öğrenci Memnuniyeti', color: '#fbbf24' },
        ].map((stat, idx) => {
          const IconC = stat.icon;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${stat.color}15`, border: `1px solid ${stat.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color,
                flexShrink: 0
              }}>
                <IconC size={26} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{stat.count}</div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 600 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroSection;
