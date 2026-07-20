import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoadingMotivation = ({ onFinish, userName }) => {
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName 
    || userName 
    || (currentUser?.email?.split('@')[0]) 
    || 'Değerli Üyemiz';

  useEffect(() => {
    const t = setTimeout(() => {
      onFinish?.();
    }, 1500);

    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100000,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        borderRadius: 24,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        maxWidth: 460,
        width: '100%'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em'
        }}>
          Hoşgeldiniz
        </h1>
        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
          fontWeight: 700,
          color: '#0284c7',
          margin: 0
        }}>
          {displayName}
        </p>
      </div>
    </div>
  );
};

export default LoadingMotivation;
