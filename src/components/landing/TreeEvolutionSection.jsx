import React, { useState } from 'react';
import { Sparkles, Trophy, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedTreeSvg from '../AnimatedTreeSvg';

const treeLevels = [
  {
    level: 0,
    title: 'Tohum',
    icon: '🌱',
    req: '0 - 1 Saat',
    desc: 'Başarı yolculuğunun ilk tohumu toprağa düştü. Her şey küçük bir kararla başlar.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.12) 0%, transparent 70%)',
    perk: 'Temel Pomodoro ve Hedef Takip Kilidi Açıldı',
    xp: '+50 XP'
  },
  {
    level: 1,
    title: 'Filiz Formu',
    icon: '🌿',
    req: '1 - 5 Saat',
    desc: 'İlk odaklanma seansların meyvesini veriyor. Filizin yeşerdi, toprağa tutunuyorsun.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.12) 0%, transparent 70%)',
    perk: 'İlk Odak Rozeti & Günlük İstatistik Görünümü',
    xp: '+150 XP'
  },
  {
    level: 2,
    title: 'Fidan Formu',
    icon: '🪴',
    req: '5 - 20 Saat',
    desc: 'Düzenli çalışma alışkanlığı oturuyor. Fidanın rüzgarlara karşı güçlenmeye başladı.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.12) 0%, transparent 70%)',
    perk: 'Haftalık Koçluk Tavsiyesi Altyapısı',
    xp: '+300 XP'
  },
  {
    level: 3,
    title: 'Genç Ağaç',
    icon: '🌲',
    req: '20 - 50 Saat',
    desc: 'Ciddi bir emek ve irade göstergesi. Genç ağacın artık uzaktan bile fark ediliyor!',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.15) 0%, transparent 70%)',
    perk: 'ÖSYM Net Simülasyonu Gelişmiş Modu',
    xp: '+600 XP'
  },
  {
    level: 4,
    title: 'Gür Ağaç',
    icon: '🌳',
    req: '50 - 100 Saat',
    desc: '50 saati devirdin! Sen artık bir disiplin abidesisin. Köklerin derinde, gövden sarsılmaz.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.15) 0%, transparent 70%)',
    perk: 'Liderlik Tablosunda Özel Seçkin Aura',
    xp: '+1.000 XP'
  },
  {
    level: 5,
    title: 'Köklü Çınar',
    icon: '🌳',
    req: '100 - 150 Saat',
    desc: '100 saatlik efsanevi odaklanma! Ağacının etrafında zarif bir ilim haresi parıldıyor.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.18) 0%, transparent 70%)',
    perk: 'VİP Koç Soru-Cevap Önceliği & Çerçeve',
    xp: '+2.500 XP'
  },
  {
    level: 6,
    title: 'Asırlık Çınar',
    icon: '🌳',
    req: '150 - 200 Saat',
    desc: '150 saati aşan muazzam bir azim. Ağacın sağlamlığıyla platformda ilham veriyor.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.18) 0%, transparent 70%)',
    perk: 'Canlı Birebir Koçluk Seansı Avantajları',
    xp: '+5.000 XP'
  },
  {
    level: 7,
    title: 'Bilge Ağaç',
    icon: '🌲',
    req: '200 - 300 Saat',
    desc: '200 saatin üzerinde mutlak konsantrasyon. Hayat ağacın bilgi ve iradeyle göz kamaştırıyor!',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.2) 0%, transparent 70%)',
    perk: 'Tüm Özellikler & Şampiyon Rozeti',
    xp: '+10.000 XP'
  },
  {
    level: 8,
    title: 'Orman Ruhu',
    icon: '🌲',
    req: '300 - 400 Saat',
    desc: '300 saatlik muazzam odaklanma! Ağacın artık derin disiplinin ve başarının simgesi.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.22) 0%, transparent 70%)',
    perk: 'Zirve Başarı Rozeti & Özel Görünüm',
    xp: '+15.000 XP'
  },
  {
    level: 9,
    title: 'Hayat Ağacı',
    icon: '🌳',
    req: '400 - 500 Saat',
    desc: '400 saati deviren sarsılmaz irade! Başarı ve istikrarın platformdaki en güçlü temsilcisisin.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.25) 0%, transparent 70%)',
    perk: 'Usta Unvanı & VİP Koçluk Sınırsız Öncelik',
    xp: '+25.000 XP'
  },
  {
    level: 10,
    title: 'Zirve Ağacı',
    icon: '👑',
    req: '500+ Saat',
    desc: 'PLATFORMUN MUTLAK VE SONSUZ ZİRVESİ! 500 saati aşan muhteşem bir disiplin ve başarı öyküsü.',
    color: '#1e7796',
    borderColor: '#1e7796',
    bgGradient: 'radial-gradient(circle, rgba(30, 119, 150, 0.28) 0%, transparent 70%)',
    perk: 'Platformun En Üst Düzey Başarı Şerefi',
    xp: '+50.000 XP'
  }
];

const TreeEvolutionSection = ({ onOpenAuth }) => {
  const [selectedTree, setSelectedTree] = useState(treeLevels[10]); // Default show top level
  const [hoveredLevel, setHoveredLevel] = useState(null);

  return (
    <section id="gamification" style={{
      padding: '6rem 5%',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      position: 'relative',
      color: '#0f172a',
      borderTop: '1px solid #e2e8f0'
    }}>
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 900, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto 4rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 99, background: '#d1fae5',
          color: '#059669', fontSize: '0.82rem', fontWeight: 800, marginBottom: '1rem',
          border: '1px solid #a7f3d0'
        }}>
          <Trophy size={14} color="#d97706" /> OYUNLAŞTIRMA & GÖRSEL EVRİM
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
          lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 1.2rem',
          color: '#0f172a'
        }}>
          Çalıştıkça Büyüyen Dijital Eşlikçin: <br />
          <span style={{
            background: 'linear-gradient(135deg, #059669, #10b981, #d97706, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            11 Seviyeli Öğrenme Ağacı Evrimi
          </span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
          Ders çalışmayı sıkıcı bir zorunluluk olmaktan çıkarıp heyecan verici bir oyuna dönüştürdük. Her Pomodoro seansında saatlerin birikir, ağacın evrim geçirir!
        </p>
      </div>

      {/* Main Container: Selected Spotlight Top, 11-Level Grid Below */}
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 5 }}>

        {/* Interactive Spotlight Hero Card */}
        <div style={{
          background: 'white',
          border: `2px solid ${selectedTree.borderColor}`,
          borderRadius: 30, padding: '3.5rem 3rem',
          boxShadow: `0 20px 50px rgba(0,0,0,0.06), 0 0 40px ${selectedTree.color}15`,
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

          {/* Left: Giant Animated Tree Illustration & Badge */}
          <div style={{ textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {selectedTree.isLegendary ? (
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1e1b4b',
                fontWeight: 900, fontSize: '0.82rem', padding: '0.4rem 1.25rem', borderRadius: 99,
                boxShadow: '0 4px 15px rgba(251,191,36,0.3)', letterSpacing: '0.05em',
                marginBottom: '0.5rem', zIndex: 50, position: 'relative'
              }}>
                ⭐ EFSANEVİ SEVİYE ⭐
              </div>
            ) : (
              <div style={{ height: '32px', marginBottom: '0.5rem' }} />
            )}
            <div style={{
              width: '100%',
              maxWidth: '300px',
              height: '280px',
              margin: '0.5rem auto 1.5rem',
              filter: `drop-shadow(0 14px 30px ${selectedTree.color}45)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10
            }}>
              <AnimatedTreeSvg level={selectedTree.level} points={selectedTree.level * 45 + 5} animated={true} />
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>
              GEREKLİ ÇALIŞMA SÜRESİ: <span style={{ color: selectedTree.color, fontWeight: 900 }}>{selectedTree.req}</span>
            </div>
          </div>

          {/* Right: Detailed Breakdown */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{
                padding: '0.35rem 0.85rem', borderRadius: 8, background: 'rgba(30, 119, 150, 0.12)',
                color: '#1e7796', fontWeight: 800, fontSize: '0.8rem', border: '1px solid rgba(30, 119, 150, 0.3)'
              }}>
                SEVİYE {selectedTree.level}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#1e7796', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={16} color="#1e7796" /> {selectedTree.xp} Bonus
              </span>
            </div>

            <h3 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem', lineHeight: 1.15 }}>
              {selectedTree.title}
            </h3>

            <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 500 }}>
              {selectedTree.desc}
            </p>

            <button
              onClick={() => onOpenAuth('register')}
              style={{
                padding: '0.95rem 2rem', borderRadius: 14, border: 'none',
                background: '#0f172a',
                color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.3s', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)',
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

        {/* 11-Level Selection Grid (Click to view) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1.5rem' }}>
            👉 TÜM SEVİYELERİ İNCELEMEK İÇİN TIKLAYIN 👈
          </h4>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '1.25rem'
        }}>
          {treeLevels.map((t) => {
            const isSelected = selectedTree.level === t.level;
            const isHovered = hoveredLevel === t.level;
            const isAnimated = isSelected || isHovered;

            return (
              <div
                key={t.level}
                onClick={() => setSelectedTree(t)}
                onMouseEnter={() => setHoveredLevel(t.level)}
                onMouseLeave={() => setHoveredLevel(null)}
                style={{
                  flex: '1 1 calc(16.666% - 1.25rem)',
                  minWidth: '175px',
                  maxWidth: '210px',
                  padding: '1.5rem 1.2rem', borderRadius: 20,
                  background: isSelected ? '#f1f5f9' : 'white',
                  border: `2px solid ${isSelected ? '#1e7796' : '#e2e8f0'}`,
                  cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                  boxShadow: isSelected ? '0 10px 30px rgba(30, 119, 150, 0.22)' : '0 2px 8px rgba(0,0,0,0.02)',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
                onMouseOver={e => !isSelected && (e.currentTarget.style.borderColor = '#1e7796')}
                onMouseOut={e => !isSelected && (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <div style={{
                  width: '110px',
                  height: '110px',
                  margin: '0 auto 0.5rem',
                  filter: isAnimated ? 'drop-shadow(0 6px 14px rgba(30, 119, 150, 0.28))' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AnimatedTreeSvg level={t.level} points={t.level * 45 + 5} animated={isAnimated} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#1e7796', fontWeight: 800, textTransform: 'uppercase' }}>
                  SEVİYE {t.level}
                </div>
                <h5 style={{ margin: '0.2rem 0 0.4rem', fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{t.title}</h5>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, display: 'block' }}>{t.req}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TreeEvolutionSection;
