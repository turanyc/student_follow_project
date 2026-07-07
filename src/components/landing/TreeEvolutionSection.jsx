import React, { useState } from 'react';
import { Sparkles, Trophy, Clock, Star, Zap, Award, CheckCircle, ArrowRight } from 'lucide-react';

const treeLevels = [
  {
    level: 0,
    title: 'Tohum',
    icon: '🌱',
    req: '0 - 1 Saat',
    desc: 'Başarı yolculuğunun ilk tohumu toprağa düştü. Her şey küçük bir kararla başlar.',
    color: '#a7f3d0',
    borderColor: '#34d399',
    bgGradient: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
    perk: 'Temel Pomodoro ve Hedef Takip Kilidi Açıldı',
    xp: '+50 XP'
  },
  {
    level: 1,
    title: 'Filiz',
    icon: '🌿',
    req: '1 - 5 Saat',
    desc: 'İlk odaklanma seansların meyvesini veriyor. Filizin yeşerdi, toprağa tutunuyorsun.',
    color: '#6ee7b7',
    borderColor: '#10b981',
    bgGradient: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
    perk: 'İlk Odak Rozeti & Günlük İstatistik Görünümü',
    xp: '+150 XP'
  },
  {
    level: 2,
    title: 'Fidan',
    icon: '🪴',
    req: '5 - 20 Saat',
    desc: 'Düzenli çalışma alışkanlığı oturuyor. Fidanın rüzgarlara karşı güçlenmeye başladı.',
    color: '#34d399',
    borderColor: '#059669',
    bgGradient: 'radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%)',
    perk: 'Haftalık Koçluk Tavsiyesi Altyapısı',
    xp: '+300 XP'
  },
  {
    level: 3,
    title: 'Genç Ağaç',
    icon: '🌲',
    req: '20 - 50 Saat',
    desc: 'Ciddi bir emek ve irade göstergesi. Genç ağacın artık uzaktan bile fark ediliyor!',
    color: '#10b981',
    borderColor: '#047857',
    bgGradient: 'radial-gradient(circle, rgba(4, 120, 87, 0.22) 0%, transparent 70%)',
    perk: 'ÖSYM Net Simülasyonu Gelişmiş Modu',
    xp: '+600 XP'
  },
  {
    level: 4,
    title: 'Ulu Ağaç',
    icon: '🌳',
    req: '50 - 100 Saat',
    desc: '50 saati devirdin! Sen artık bir disiplin abidesisin. Köklerin derinde, gövden sarsılmaz.',
    color: '#059669',
    borderColor: '#065f46',
    bgGradient: 'radial-gradient(circle, rgba(6, 95, 70, 0.25) 0%, transparent 70%)',
    perk: 'Liderlik Tablosunda Özel Yeşil Aura',
    xp: '+1.000 XP'
  },
  {
    level: 5,
    title: 'Altın Hareli Bilge Ağaç',
    icon: '🌳☀️',
    req: '100 - 150 Saat',
    desc: '100 saatlik efsanevi odaklanma! Ağacının etrafında altın renkli bir ilim haresi parıldıyor.',
    color: '#eab308',
    borderColor: '#ca8a04',
    bgGradient: 'radial-gradient(circle, rgba(234, 179, 8, 0.28) 0%, transparent 70%)',
    perk: 'VİP Koç Soru-Cevap Önceliği & Altın Çerçeve',
    xp: '+2.500 XP',
    isLegendary: true
  },
  {
    level: 6,
    title: 'Kutsal Işıltılı Ağaç',
    icon: '🌳💫',
    req: '150 - 200 Saat',
    desc: '150 saati aşan muazzam bir azim. Ağacından kozmik ışıklar yükseliyor, platformda bir efsanesin.',
    color: '#f59e0b',
    borderColor: '#d97706',
    bgGradient: 'radial-gradient(circle, rgba(245, 158, 11, 0.32) 0%, transparent 70%)',
    perk: 'Canlı Birebir Koçluk Seansı İndirim & Yıldız Aura',
    xp: '+5.000 XP',
    isLegendary: true
  },
  {
    level: 7,
    title: 'Efsanevi Hayat Ağacı',
    icon: '🌲✨',
    req: '200+ Saat',
    desc: 'PLATFORMUN EN YÜCE SEVİYESİ! 200 saatin üzerinde mutlak konsantrasyon. Hayat ağacın sonsuza dek parlıyor!',
    color: '#fbbf24',
    borderColor: '#b45309',
    bgGradient: 'radial-gradient(circle, rgba(251, 191, 36, 0.38) 0%, transparent 70%)',
    perk: 'Tüm Özellikler Sınırsız & Efsanevi Şampiyon Rozeti',
    xp: '+10.000 XP',
    isLegendary: true
  }
];

const TreeEvolutionSection = ({ onOpenAuth }) => {
  const [selectedTree, setSelectedTree] = useState(treeLevels[7]); // Default show legendary

  return (
    <section id="gamification" style={{
      padding: '6rem 6%',
      background: 'linear-gradient(180deg, #0b0f19 0%, #111827 50%, #0b0f19 100%)',
      position: 'relative',
      color: 'white',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 900, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto 4rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 99, background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem',
          border: '1px solid rgba(16, 185, 129, 0.4)'
        }}>
          <Trophy size={14} color="#fbbf24" /> OYUNLAŞTIRMA & GÖRSEL EVRİM
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: 'white'
        }}>
          Çalıştıkça Büyüyen Dijital Eşlikçin: <br />
          <span style={{
            background: 'linear-gradient(135deg, #34d399, #10b981, #fbbf24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            8 Seviyeli Öğrenme Ağacı Evrimi
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          Ders çalışmayı sıkıcı bir zorunluluk olmaktan çıkarıp heyecan verici bir oyuna dönüştürdük. Her Pomodoro seansında saatlerin birikir, ağacın evrim geçirir!
        </p>
      </div>

      {/* Main Container: Selected Spotlight Top, 8-Level Grid Below */}
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        
        {/* Interactive Spotlight Hero Card */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
          border: `2px solid ${selectedTree.borderColor}`,
          borderRadius: 30, padding: '3.5rem 3rem',
          backdropFilter: 'blur(30px)',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${selectedTree.color}25`,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem', alignItems: 'center', marginBottom: '4.5rem',
          position: 'relative', overflow: 'hidden',
          transition: 'all 0.4s ease'
        }}>
          {/* Glowing Aura inside card */}
          <div style={{
            position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)',
            width: 450, height: 450, background: selectedTree.bgGradient,
            filter: 'blur(50px)', pointerEvents: 'none'
          }} />

          {/* Left: Giant Animated Emoji Tree Illustration & Badge */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            {selectedTree.isLegendary && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1e1b4b',
                fontWeight: 900, fontSize: '0.78rem', padding: '0.35rem 1rem', borderRadius: 99,
                boxShadow: '0 4px 15px rgba(251,191,36,0.6)', letterSpacing: '0.05em'
              }}>
                ⭐ EFSANEVİ SEVİYE ⭐
              </div>
            )}
            <div style={{
              fontSize: 'clamp(5rem, 12vw, 8.5rem)',
              margin: '1.5rem 0 1rem',
              filter: `drop-shadow(0 10px 30px ${selectedTree.color}70)`,
              display: 'inline-block',
              animation: selectedTree.isLegendary ? 'pulse 2.5s infinite' : 'none'
            }}>
              {selectedTree.icon}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>
              GEREKLİ ÇALIŞMA SÜRESİ: <span style={{ color: selectedTree.color, fontWeight: 900 }}>{selectedTree.req}</span>
            </div>
          </div>

          {/* Right: Detailed Breakdown */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{
                padding: '0.35rem 0.85rem', borderRadius: 8, background: `${selectedTree.color}20`,
                color: selectedTree.color, fontWeight: 800, fontSize: '0.8rem', border: `1px solid ${selectedTree.color}40`
              }}>
                SEVİYE {selectedTree.level}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={16} fill="#fbbf24" /> {selectedTree.xp} Bonus
              </span>
            </div>

            <h3 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', margin: '0 0 1rem', lineHeight: 1.15 }}>
              {selectedTree.title}
            </h3>

            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '2rem' }}>
              {selectedTree.desc}
            </p>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem 1.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                BU SEVİYENİN ÖZEL AVANTAJI:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: selectedTree.color, fontWeight: 700, fontSize: '1.05rem' }}>
                <CheckCircle size={20} color={selectedTree.color} />
                <span>{selectedTree.perk}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              style={{
                padding: '0.95rem 2rem', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${selectedTree.color}, #10b981)`,
                color: '#064e3b', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.3s', boxShadow: `0 8px 25px ${selectedTree.color}40`,
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Kendi Ağacını Büyütmeye Başla</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 8-Level Selection Grid (Click to view) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1.5rem' }}>
            👉 TÜM SEVİYELERİ İNCELEMEK İÇİN TIKLAYIN 👈
          </h4>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {treeLevels.map((t) => {
            const isSelected = selectedTree.level === t.level;
            return (
              <div
                key={t.level}
                onClick={() => setSelectedTree(t)}
                style={{
                  padding: '1.5rem 1.2rem', borderRadius: 20,
                  background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.5)',
                  border: `2px solid ${isSelected ? t.color : 'rgba(255, 255, 255, 0.08)'}`,
                  cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                  boxShadow: isSelected ? `0 10px 30px ${t.color}30` : 'none',
                  position: 'relative'
                }}
                onMouseOver={e => !isSelected && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                onMouseOut={e => !isSelected && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                {t.isLegendary && (
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem' }} title="Efsanevi Seviye">⭐</span>
                )}
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: `drop-shadow(0 4px 10px ${t.color}50)` }}>
                  {t.icon}
                </div>
                <div style={{ fontSize: '0.7rem', color: t.color, fontWeight: 800, textTransform: 'uppercase' }}>
                  SEVİYE {t.level}
                </div>
                <h5 style={{ margin: '0.2rem 0 0.4rem', fontSize: '1rem', color: 'white', fontWeight: 800 }}>{t.title}</h5>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block' }}>{t.req}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TreeEvolutionSection;
