import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Award, Users, Star, Clock } from 'lucide-react';
import AnimatedTreeSvg from '../AnimatedTreeSvg';

const HeroSection = ({ onOpenAuth }) => {
  const [treeHovered, setTreeHovered] = useState(false);
  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      padding: '4rem 5% 5rem',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at top center, rgba(224, 231, 255, 0.6) 0%, rgba(248, 250, 252, 1) 70%)',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* Background Soft Glowing Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 1
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '15%', width: 550, height: 550,
        background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1
      }} />

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1050, margin: '0 auto', width: '100%' }}>
        
        {/* Top Pill Badge (Inclusive) */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.5rem 1.25rem', borderRadius: 99,
          background: 'white', border: '1px solid rgba(30, 119, 150, 0.3)',
          color: '#1e7796', fontSize: '0.88rem', fontWeight: 700, marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(30, 119, 150, 0.12)'
        }}>
          <Sparkles size={16} color="#1e7796" />
          <span>YKS, LGS ve Tüm Öğrenciler İçin Akıllı Koçluk Devrimi!</span>
          <span style={{ background: '#1e7796', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 99, fontWeight: 800 }}>YENİ</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 4.4rem)',
          fontWeight: 900,
          lineHeight: 1.18,
          letterSpacing: '-0.035em',
          marginBottom: '1.5rem',
          color: '#0f172a',
          wordBreak: 'break-word'
        }}>
          Geleceğini Şimdiden <br />
          <span style={{
            color: '#1e7796',
            display: 'inline-block'
          }}>
            Akıllı Koçlukla İnşa Et!
          </span>
        </h1>

        {/* Subtitle (500 saat, inclusive for everyone) */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.22rem)',
          color: '#475569',
          lineHeight: 1.7,
          maxWidth: 780,
          margin: '0 auto 2.5rem',
          fontWeight: 500
        }}>
          Odaklanmanı zirveye taşıyan <strong style={{ color: '#1e7796' }}>Pomodoro tekniği</strong>, çalıştıkça büyüttüğün <strong style={{ color: '#1e7796' }}>500 saatlik öğrenme ağaçları</strong>, gerçek sonuç belgesi formatında <strong style={{ color: '#1e7796' }}>ÖSYM net simülasyonu</strong> ve <strong style={{ color: '#1e7796' }}>birebir uzman koçluk</strong> seansları ile ders çalışmak ve hedeflerine ulaşmak isteyen tüm öğrenciler için en gelişmiş takip altyapısı.
        </p>

        {/* Action Button Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '3.5rem' }}>
          <button
            onClick={() => onOpenAuth('register')}
            style={{
              padding: '1.05rem 2.4rem', borderRadius: 16, border: 'none',
              background: '#0f172a',
              color: 'white', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(15, 23, 42, 0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.3)'; }}
          >
            <Zap size={20} />
            <span>Hemen Ücretsiz Başla</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={scrollToPricing}
            style={{
              padding: '1.05rem 2.2rem', borderRadius: 16, border: '1px solid rgba(30, 119, 150, 0.3)',
              background: 'white', color: '#0f172a', fontWeight: 700, fontSize: '1.05rem',
              cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#1e7796'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'rgba(30, 119, 150, 0.3)'; }}
          >
            <Award size={19} color="#1e7796" />
            <span>Paketleri İncele</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', color: '#334155', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.55rem 1.1rem', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CheckCircle2 size={18} color="#1e7796" /> MEB & ÖSYM 2026 Müfredat Uyumu
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.55rem 1.1rem', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CheckCircle2 size={18} color="#1e7796" /> Tüm Ders Çalışanlara Özel Takip
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.55rem 1.1rem', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CheckCircle2 size={18} color="#1e7796" /> 14 Gün Ücretsiz Deneme Fırsatı
          </span>
        </div>

        {/* Floating Mockup Preview Cards (Light Glassmorphism Feature Showcase) */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem', marginTop: '1rem', textAlign: 'left'
        }}>
          {/* Card 1: ÖSYM Net Takibi */}
          <div style={{
            background: 'white',
            border: '1px solid #cbd5e1', borderRadius: 20, padding: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e7796', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(30, 119, 150, 0.12)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>🎯 ÖSYM Simülasyonu</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>TYT - AYT & LGS</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Hedef: Boğaziçi Bilgisayar Müh.</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.8rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e7796' }}>108.75</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>TYT Net Tahmini</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 99, marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: '#1e7796', borderRadius: 99 }} />
            </div>
          </div>

          {/* Card 2: Gamification Ağaç Evrimi */}
          <div style={{
            background: 'white',
            border: '1px solid #cbd5e1', borderRadius: 20, padding: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseEnter={() => setTreeHovered(true)}
          onMouseLeave={() => setTreeHovered(false)}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e7796', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(30, 119, 150, 0.12)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>🌳 Oyunlaştırma</span>
              <span style={{ fontSize: '0.8rem', color: '#1e7796', fontWeight: 800 }}>Seviye 10</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
              <div style={{ width: 72, height: 72, flexShrink: 0, filter: treeHovered ? 'drop-shadow(0 0 12px rgba(30, 119, 150, 0.4))' : 'none' }}>
                <AnimatedTreeSvg level={10} points={500} animated={true} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e7796', fontWeight: 800 }}>Zirve Ağacı</h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>500+ saatlik efsanevi odaklanma!</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#1e7796', marginTop: '1rem', fontWeight: 700 }}>
              <span>Rozet: 24/24 Tamamlandı</span>
              <span>+50.000 XP Puanı</span>
            </div>
          </div>

          {/* Card 3: Canlı Birebir Koçluk */}
          <div style={{
            background: 'white',
            border: '1px solid #cbd5e1', borderRadius: 20, padding: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e7796', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(30, 119, 150, 0.12)', padding: '0.3rem 0.7rem', borderRadius: 8 }}>📹 VİP Koçluk</span>
              <span style={{ fontSize: '0.8rem', color: '#1e7796', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 800 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e7796', display: 'inline-block' }} /> Canlı Seans
              </span>
            </div>
            <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Dr. Zeynep Koç ile Görüşme</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>Haftalık Çalışma Haritası ve Duygu Durum Analizi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
              <button style={{ flex: 1, padding: '0.55rem', borderRadius: 10, border: '1px solid rgba(30, 119, 150, 0.3)', background: 'rgba(30, 119, 150, 0.08)', color: '#1e7796', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}>Görüşmeye Bağlan 🚀</button>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Counter Bar Bottom */}
      <div style={{
        position: 'relative', zIndex: 5, width: '100%', maxWidth: 1150, margin: '4.5rem auto 0',
        background: 'white', border: '1px solid #cbd5e1',
        borderRadius: 24, padding: '2.5rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
      }}>
        {[
          { icon: TrendingUp, count: '%96', label: 'Hedef Lisans & Liseye Yerleşme', color: '#1e7796' },
          { icon: Award, count: '+50.000', label: 'Çözülen Soru & Deneme Analizi', color: '#1e7796' },
          { icon: Clock, count: '500+ Saat', label: 'Odak ve Ağaç Evrimi', color: '#1e7796' },
          { icon: Star, count: '4.9 / 5.0', label: 'Veli ve Öğrenci Memnuniyeti', color: '#1e7796' },
        ].map((stat, idx) => {
          const IconC = stat.icon;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(30, 119, 150, 0.12)', border: '1px solid rgba(30, 119, 150, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e7796',
                flexShrink: 0
              }}>
                <IconC size={26} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{stat.count}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 700 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroSection;
