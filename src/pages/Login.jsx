import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingMotivation from '../components/LoadingMotivation';

// Modular Landing Page Components
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import TreeEvolutionSection from '../components/landing/TreeEvolutionSection';
import PricingSection from '../components/landing/PricingSection';
import PaymentRoadmapModal from '../components/landing/PaymentRoadmapModal';
import AuthModal from '../components/landing/AuthModal';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  
  const [showMotivation, setShowMotivation] = useState(false);
  const [targetRole, setTargetRole] = useState(null);

  // Landing Page Interactive Modals State
  const [authMode, setAuthMode] = useState(null); // null, 'login', or 'register'
  const [showRoadmap, setShowRoadmap] = useState(false);

  // If already logged in, show motivation first then redirect
  useEffect(() => {
    if (currentUser && userRole) {
      const shown = sessionStorage.getItem('motivationShown');
      if (!shown) {
        setTargetRole(userRole);
        setShowMotivation(true);
      } else {
        navigate(userRole === 'student' ? '/student' : '/coach');
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
    return <LoadingMotivation onFinish={handleMotivationFinish} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0b0f19',
      position: 'relative',
      overflowX: 'hidden',
      color: 'white',
      fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Bar */}
      <Navbar 
        onOpenAuth={(mode) => setAuthMode(mode)} 
        onOpenRoadmap={() => setShowRoadmap(true)} 
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

      {/* Pricing Packages & Payment Roadmap CTA */}
      <PricingSection 
        onOpenAuth={(mode) => setAuthMode(mode)} 
        onOpenRoadmap={() => setShowRoadmap(true)} 
      />

      {/* Footer */}
      <footer style={{
        background: '#050810',
        textAlign: 'center',
        padding: '3rem 6%',
        color: '#64748b',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: 600, color: '#94a3b8' }}>
          <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Ana Sayfa</span>
          <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Özellikler</span>
          <span onClick={() => document.getElementById('gamification')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Ağaç Evrimi</span>
          <span onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Paketler & Fiyatlar</span>
          <span onClick={() => setShowRoadmap(true)} style={{ cursor: 'pointer', color: '#fbbf24' }}>Ödeme Altyapısı Rehberi</span>
        </div>
        <div style={{ color: '#475569', fontSize: '0.8rem', maxWidth: 600 }}>
          © 2026 EduKoç PRO. YKS (TYT-AYT) ve LGS Yeni Nesil Öğrenci ve Koçluk Takip Altyapısı. Tüm Hakları Saklıdır.
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

      {/* Payment Gateway Integration Roadmap Modal */}
      {showRoadmap && (
        <PaymentRoadmapModal 
          onClose={() => setShowRoadmap(false)} 
        />
      )}
    </div>
  );
};

export default Login;
