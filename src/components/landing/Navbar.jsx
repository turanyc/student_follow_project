import React from 'react';
import { Target, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';

const Navbar = ({ onOpenAuth, onOpenRoadmap }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 15, 25, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1rem 6%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: 'pulse 3s infinite'
          }} />
          <Target size={24} color="white" style={{ position: 'relative', zIndex: 2 }} />
        </div>
        <div>
          <h1 style={{
            margin: 0, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            EduKoç <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 6, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.4)', fontWeight: 700 }}>PRO</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em', display: 'block' }}>
            YKS & LGS TAKİP ALTYAPISI
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        fontSize: '0.92rem',
        fontWeight: 600,
        color: '#cbd5e1'
      }} className="nav-links-desktop">
        <span 
          onClick={() => scrollToSection('features')} 
          style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          onMouseOver={e => e.currentTarget.style.color = '#38bdf8'}
          onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
        >
          ✨ Özellikler
        </span>
        <span 
          onClick={() => scrollToSection('gamification')} 
          style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          onMouseOver={e => e.currentTarget.style.color = '#10b981'}
          onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
        >
          🌳 Ağaç Evrimi
        </span>
        <span 
          onClick={() => scrollToSection('pricing')} 
          style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          onMouseOver={e => e.currentTarget.style.color = '#ec4899'}
          onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
        >
          💎 Paketler & Fiyatlar
        </span>
        <span 
          onClick={onOpenRoadmap} 
          style={{
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.8rem', borderRadius: 8, background: 'rgba(245, 158, 11, 0.12)',
            color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.85rem'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          title="Türkiye Online Ödeme Altyapısı Yol Haritası"
        >
          <ShieldCheck size={15} /> Ödeme Altyapısı Rehberi
        </span>
      </nav>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => onOpenAuth('login')}
          style={{
            padding: '0.65rem 1.3rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.04)', color: 'white', fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
        >
          Giriş Yap
        </button>
        <button
          onClick={() => onOpenAuth('register')}
          style={{
            padding: '0.65rem 1.4rem', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', color: 'white',
            fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.25s',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 72, 153, 0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)'; }}
        >
          <span>Ücretsiz Deneyin</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
