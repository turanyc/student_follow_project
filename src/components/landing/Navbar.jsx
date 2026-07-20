import React, { useState } from 'react';
import { Target, ArrowRight, Menu, X } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <style>{`
        .hamburger-btn {
          display: none !important;
        }
        @media (max-width: 900px) {
          .nav-links-desktop, .nav-buttons-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 4%',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Centered container aligned perfectly with Hero section and below components */}
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand Logo with Hamburger Button Right Next To It */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '0.5rem', borderRadius: 10, border: '1px solid #cbd5e1',
                background: '#f8fafc', color: '#0f172a', cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center'
              }}
              title="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              title="Menutu Koçluk - Ana Sayfa"
            >
              <img
                src="/menutu_logo_.png"
                alt="Menutu Koçluk"
                style={{ height: 68, width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Desktop Navigation Links (No Emojis) */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            color: '#334155'
          }} className="nav-links-desktop">
            <span
              onClick={() => scrollToSection('features')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#0e7490'}
              onMouseOut={e => e.currentTarget.style.color = '#334155'}
            >
              Özellikler
            </span>
            <span
              onClick={() => scrollToSection('gamification')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#10b981'}
              onMouseOut={e => e.currentTarget.style.color = '#334155'}
            >
              Ağaç Evrimi
            </span>
            <span
              onClick={() => scrollToSection('gamification')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#f59e0b'}
              onMouseOut={e => e.currentTarget.style.color = '#334155'}
            >
              Anlık Çalışma Haritan
            </span>
            <span
              onClick={() => scrollToSection('contact')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#0f766e'}
              onMouseOut={e => e.currentTarget.style.color = '#334155'}
            >
              İletişim
            </span>
          </nav>

          {/* Desktop Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }} className="nav-buttons-desktop">
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 10, border: '1px solid #cbd5e1',
                background: 'white', color: '#0f172a', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              style={{
                padding: '0.6rem 1.3rem', borderRadius: 10, border: 'none',
                background: '#0f172a', color: 'white',
                fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 23, 42, 0.3)'; }}
            >
              <span>Kaydol</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (No Emojis) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '68px',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #cbd5e1',
          padding: '1.25rem 5%',
          zIndex: 999,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div
            onClick={() => scrollToSection('features')}
            style={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            Özellikler
          </div>
          <div
            onClick={() => scrollToSection('gamification')}
            style={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            Ağaç Evrimi
          </div>
          <div
            onClick={() => scrollToSection('gamification')}
            style={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            Anlık Çalışma Haritan
          </div>
          <div
            onClick={() => scrollToSection('contact')}
            style={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            İletişim
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.4rem 0', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid #cbd5e1',
                background: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none',
                background: '#0f172a', color: 'white',
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <span>Kaydol</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
