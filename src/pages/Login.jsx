import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingMotivation from '../components/LoadingMotivation';

// Modular Landing Page Components
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import TreeEvolutionSection from '../components/landing/TreeEvolutionSection';
import ContactSection from '../components/landing/PricingSection';
import AuthModal from '../components/landing/AuthModal';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  
  const [showMotivation, setShowMotivation] = useState(false);
  const [targetRole, setTargetRole] = useState(null);

  // Landing Page Interactive Modals State
  const [authMode, setAuthMode] = useState(null); // null, 'login', or 'register'

  // If already logged in, show motivation first then redirect
  useEffect(() => {
    if (currentUser) {
      const effectiveRole = userRole;
      if (effectiveRole) {
        const shown = sessionStorage.getItem('motivationShown');
        if (!shown) {
          setTargetRole(effectiveRole);
          setShowMotivation(true);
        } else {
          navigate(effectiveRole === 'student' ? '/student' : '/coach');
        }
      }
    }
  }, [currentUser, userRole, navigate]);

  const handleMotivationFinish = () => {
    sessionStorage.setItem('motivationShown', 'true');
    const isNew = sessionStorage.getItem('newStudentRegistered');
    const roleToNavigate = targetRole || userRole || 'student';
    if (isNew && roleToNavigate === 'student') {
      sessionStorage.removeItem('newStudentRegistered');
      navigate('/student/discovery?onboarding=1');
    } else {
      navigate(roleToNavigate === 'student' ? '/student' : '/coach');
    }
  };

  const handleAuthSuccess = (navRole) => {
    setAuthMode(null);
    const roleToUse = navRole || userRole || 'student';
    setTargetRole(roleToUse);
    setShowMotivation(true);
  };

  if (showMotivation) {
    return <LoadingMotivation onFinish={handleMotivationFinish} userName={currentUser?.displayName || currentUser?.email?.split('@')[0]} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
      color: '#0f172a',
      fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Bar */}
      <Navbar 
        onOpenAuth={(mode) => setAuthMode(mode)} 
      />

      {/* Main Hero Showcase */}
      <HeroSection 
        onOpenAuth={(mode) => setAuthMode(mode)} 
      />

      {/* 9 Major Project Features Showcase */}
      <FeatureShowcase 
        onOpenAuth={(mode) => setAuthMode(mode)} 
      />

      {/* Gamification Tree Evolution Visualizer */}
      <TreeEvolutionSection 
        onOpenAuth={(mode) => setAuthMode(mode)} 
      />

      {/* Contact Section (replaces Pricing) */}
      <ContactSection 
        onOpenAuth={(mode) => setAuthMode(mode)} 
      />

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        textAlign: 'center',
        padding: '3rem 6%',
        color: '#64748b',
        fontSize: '0.88rem',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: 700, color: '#334155' }}>
          <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Ana Sayfa</span>
          <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Özellikler</span>
          <span onClick={() => document.getElementById('gamification')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Ağaç Evrimi</span>
          <span onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>İletişim</span>
        </div>
        <div style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: 600 }}>
          © 2026 EduKoç PRO. YKS (TYT-AYT), LGS ve Tüm Öğrenciler İçin Yeni Nesil Koçluk ve Takip Altyapısı. Tüm Hakları Saklıdır.
        </div>
      </footer>

      {/* Glassmorphic Authentication Modal (Login & Register) */}
      {authMode && (
        <AuthModal 
          initialMode={authMode} 
          onClose={() => setAuthMode(null)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
};

export default Login;
