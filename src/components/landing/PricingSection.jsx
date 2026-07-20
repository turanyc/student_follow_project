import React from 'react';
import { MessageCircle, Mail, Phone, ArrowRight, Sparkles, Send } from 'lucide-react';

const ContactSection = ({ onOpenAuth }) => {
  return (
    <section id="contact" style={{
      padding: '6rem 5%',
      background: '#ffffff',
      position: 'relative',
      color: '#0f172a',
      borderTop: '1px solid #e2e8f0'
    }}>
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '30%', right: '10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 750, margin: '0 auto 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1.1rem', borderRadius: 99, background: '#cffafe',
          color: '#0891b2', fontSize: '0.82rem', fontWeight: 800, marginBottom: '1.2rem',
          border: '1px solid #a5f3fc'
        }}>
          <Sparkles size={14} /> KOÇLUK HİZMETİ
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: '#0f172a'
        }}>
          Profesyonel Koçluk İçin <br />
          <span style={{
            background: 'linear-gradient(135deg, #0891b2, #6366f1, #9333ea)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Bizimle İletişime Geçin
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
          YKS, LGS ve düzenli ders çalışıp hedefine odaklanan tüm öğrenciler için profesyonel koçluk desteği almak, kişiselleştirilmiş çalışma planı oluşturmak ve hedeflerinize en verimli şekilde ulaşmak için ekibimizle iletişime geçin.
        </p>
      </div>

      {/* Contact Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1
      }}>
        
        {/* WhatsApp Card */}
        <div 
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: 24, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.04)', transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.12)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.04)'; }}
          onClick={() => window.open('https://wa.me/905551234567', '_blank')}
        >
          <div style={{
            width: 70, height: 70, borderRadius: 20,
            background: '#d1fae5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #a7f3d0'
          }}>
            <MessageCircle size={32} color="#059669" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              WhatsApp İletişim
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              Hızlı yanıt almak için WhatsApp üzerinden bize ulaşın. Koçluk paketleri hakkında detaylı bilgi alın.
            </p>
          </div>
          <button style={{
            width: '100%', padding: '0.9rem', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
            transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
          }}>
            <MessageCircle size={18} /> WhatsApp'tan Yazın
          </button>
        </div>

        {/* Email Card */}
        <div 
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: 24, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.04)', transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.12)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.04)'; }}
          onClick={() => window.open('mailto:info@edukoc.com', '_blank')}
        >
          <div style={{
            width: 70, height: 70, borderRadius: 20,
            background: '#e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #c7d2fe'
          }}>
            <Mail size={32} color="#4f46e5" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              E-Posta İle Ulaşın
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              Detaylı sorularınız ve kurumsal başvurularınız için e-posta gönderin, 24 saat içinde dönüş yapalım.
            </p>
          </div>
          <button style={{
            width: '100%', padding: '0.9rem', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: '0 6px 20px rgba(99,102,241,0.25)',
            transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
          }}>
            <Mail size={18} /> E-Posta Gönderin
          </button>
        </div>

        {/* Phone Card */}
        <div 
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: 24, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: '1.5rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.04)', transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#9333ea'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(147,51,234,0.12)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.04)'; }}
          onClick={() => window.open('tel:+905551234567', '_blank')}
        >
          <div style={{
            width: 70, height: 70, borderRadius: 20,
            background: '#f3e8ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #e9d5ff'
          }}>
            <Phone size={32} color="#7e22ce" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Telefon İle Arayın
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              Doğrudan koçluk ekibimizi arayarak hızlı bilgi alın. Hafta içi 09:00-18:00 arasında hizmetinizdeyiz.
            </p>
          </div>
          <button style={{
            width: '100%', padding: '0.9rem', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
            color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: '0 6px 20px rgba(147,51,234,0.25)',
            transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
          }}>
            <Phone size={18} /> Hemen Arayın
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
