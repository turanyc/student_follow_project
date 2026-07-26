import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, GraduationCap, MapPin, Award, BookOpen,
  Sparkles, CheckCircle, ChevronDown, RefreshCw, X, Eye, ArrowUpDown,
  Building2, Hash, Layers
} from 'lucide-react';
import { UNIVERSITY_DATA } from '../data/universityData';

const UniSearchRobot = ({ isCoachView = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreType, setSelectedScoreType] = useState('Tümü'); // 'Tümü' | 'SAY' | 'EA' | 'SÖZ' | 'DİL'
  const [selectedUniType, setSelectedUniType] = useState('Tümü');   // 'Tümü' | 'Devlet' | 'Vakıf' | 'KKTC'
  const [selectedBurs, setSelectedBurs] = useState('Tümü');         // 'Tümü' | 'Burslu' | '%50 İndirimli' | 'Ücretli' | 'Devlet'
  const [selectedDil, setSelectedDil] = useState('Tümü');           // 'Tümü' | 'Türkçe' | 'İngilizce' | 'Almanca' | 'Fransızca'
  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [maxRank, setMaxRank] = useState(0); // 0 means no limit
  const [sortBy, setSortBy] = useState('sira-asc'); // 'sira-asc' | 'sira-desc' | 'puan-desc' | 'puan-asc' | 'uni-asc'
  const [displayLimit, setDisplayLimit] = useState(50);
  const [selectedDetailModal, setSelectedDetailModal] = useState(null);

  // Extract unique city list dynamically
  const cityList = useMemo(() => {
    const set = new Set(UNIVERSITY_DATA.map(item => item.sehir));
    return ['Tümü', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'))];
  }, []);

  // 1. Önbelleğe alınmış Fuse.js Fuzzy Search Motoru (threshold: 0.3)
  const fuse = useMemo(() => {
    return new Fuse(UNIVERSITY_DATA, {
      keys: ['uni', 'bolum', 'sehir', 'fakulte'],
      threshold: 0.3,
      ignoreLocation: true
    });
  }, []);

  // 2. Çoklu Filtreleme ve Sıralama (useMemo ile yüksek performans)
  const filteredResults = useMemo(() => {
    let result = [...UNIVERSITY_DATA];

    // Real-time Fuzzy Search
    if (searchQuery.trim()) {
      const searchHits = fuse.search(searchQuery.trim());
      result = searchHits.map(hit => hit.item);
    }

    // Filtreler
    if (selectedScoreType !== 'Tümü') {
      result = result.filter(item => item.puanTuru === selectedScoreType);
    }
    if (selectedUniType !== 'Tümü') {
      result = result.filter(item => item.tur === selectedUniType);
    }
    if (selectedBurs !== 'Tümü') {
      result = result.filter(item => item.burs === selectedBurs);
    }
    if (selectedDil !== 'Tümü') {
      result = result.filter(item => item.dil === selectedDil);
    }
    if (selectedCity !== 'Tümü') {
      result = result.filter(item => item.sehir === selectedCity);
    }
    if (maxRank > 0) {
      result = result.filter(item => item.sira <= maxRank);
    }

    // Sıralama
    if (sortBy === 'sira-asc') {
      result.sort((a, b) => a.sira - b.sira);
    } else if (sortBy === 'sira-desc') {
      result.sort((a, b) => b.sira - a.sira);
    } else if (sortBy === 'puan-desc') {
      result.sort((a, b) => b.puan - a.puan);
    } else if (sortBy === 'puan-asc') {
      result.sort((a, b) => a.puan - b.puan);
    } else if (sortBy === 'uni-asc') {
      result.sort((a, b) => a.uni.localeCompare(b.uni, 'tr'));
    }

    return result;
  }, [fuse, searchQuery, selectedScoreType, selectedUniType, selectedBurs, selectedDil, selectedCity, maxRank, sortBy]);

  // 3. Render Optimizasyonu: Tarayıcı kitlenmesini engellemek için ilk limit kadar kart gösterimi (.slice(0, 50))
  const visibleResults = useMemo(() => {
    return filteredResults.slice(0, displayLimit);
  }, [filteredResults, displayLimit]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedScoreType('Tümü');
    setSelectedUniType('Tümü');
    setSelectedBurs('Tümü');
    setSelectedDil('Tümü');
    setSelectedCity('Tümü');
    setMaxRank(0);
    setSortBy('sira-asc');
    setDisplayLimit(50);
  };

  const getScoreBadgeColor = (type) => {
    switch (type) {
      case 'SAY': return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
      case 'EA':  return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'SÖZ': return { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' };
      case 'DİL': return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
      case 'TYT': return { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' };
      default:   return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Outfit, sans-serif', paddingBottom: '3rem' }}
    >
      {/* ── ÜST BAŞLIK BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: 24, padding: '2rem 2.5rem', color: 'white',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.3)', marginBottom: '1.75rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem', color: '#818cf8' }}>
              <Sparkles size={14} color="#818cf8" /> {isCoachView ? 'Koçluk Paneli • Akıllı Tercih Robotu' : 'YÖK Atlas Akıllı Üniversite & Bölüm Arama Motoru'}
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Akıllı Üniversite ve Bölüm Filtreleme Robotu 🏛️
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#c7d2fe', maxWidth: '680px', lineHeight: 1.5 }}>
              YÖK Atlas tarzı anlık (real-time fuzzy) arama motoru ile taban puanları, başarı sıralamalarını, şehir, burs ve eğitim dili seçeneklerini saniyeler içinde filtreleyin!
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 20,
            padding: '1.1rem 1.6rem', textAlign: 'center', minWidth: '220px'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>Eşleşen Program Sayısı</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1.1, marginTop: '0.2rem' }}>
              {filteredResults.length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>bölüm</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.3rem' }}>
              Görüntülenen: <strong>{visibleResults.length}</strong> kart (DOM Optimize)
            </span>
          </div>
        </div>
      </div>

      {/* ── AKILLI ARAMA & ÇOKLU FİLTRELEME PANELİ ── */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '1.75rem' }}>
        
        {/* Arama Barı ve Sıralama Dropdown */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#6366f1" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Üniversite veya bölüm adı yazın (örn: Boğaziçi bilgisayar, tıpkı YÖK Atlas)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: searchQuery ? '0.75rem 2.6rem 0.75rem 2.75rem' : '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 14, border: '1.5px solid #cbd5e1', fontSize: '0.92rem',
                fontWeight: 600, outline: 'none', background: '#f8fafc', transition: 'all 0.2s'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="#64748b" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem', borderRadius: 14, border: '1px solid #cbd5e1',
                fontSize: '0.88rem', fontWeight: 700, background: '#f8fafc', color: '#1e293b',
                outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="sira-asc">Başarı Sıralaması (Önce En İyi)</option>
              <option value="sira-desc">Başarı Sıralaması (Azalan)</option>
              <option value="puan-desc">Taban Puan (Önce En Yüksek)</option>
              <option value="puan-asc">Taban Puan (Artan)</option>
              <option value="uni-asc">Üniversite Adına Göre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Çoklu Filtreleme Buton Grupları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.1rem' }}>
          
          {/* Puan Türü */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', minWidth: '85px' }}>Puan Türü:</span>
            {['Tümü', 'SAY', 'EA', 'SÖZ', 'DİL', 'TYT'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedScoreType(type)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: selectedScoreType === type ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  background: selectedScoreType === type ? '#6366f1' : '#f8fafc',
                  color: selectedScoreType === type ? '#ffffff' : '#64748b'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Üniversite Türü */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', minWidth: '85px' }}>Üni Türü:</span>
            {['Tümü', 'Devlet', 'Vakıf', 'KKTC'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedUniType(type)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: selectedUniType === type ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: selectedUniType === type ? '#10b981' : '#f8fafc',
                  color: selectedUniType === type ? '#ffffff' : '#64748b'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Burs / Ücret Durumu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', minWidth: '85px' }}>Burs Durumu:</span>
            {['Tümü', 'Burslu', '%50 İndirimli', 'Ücretli', 'Devlet'].map(burs => (
              <button
                key={burs}
                onClick={() => setSelectedBurs(burs)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: selectedBurs === burs ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  background: selectedBurs === burs ? '#f59e0b' : '#f8fafc',
                  color: selectedBurs === burs ? '#ffffff' : '#64748b'
                }}
              >
                {burs}
              </button>
            ))}
          </div>

          {/* Eğitim Dili & Şehir Seçimi & Filtre Sıfırla */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', minWidth: '85px' }}>Eğitim Dili:</span>
              {['Tümü', 'Türkçe', 'İngilizce', 'Fransızca', 'Almanca'].map(dil => (
                <button
                  key={dil}
                  onClick={() => setSelectedDil(dil)}
                  style={{
                    padding: '0.4rem 0.9rem', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.15s',
                    border: selectedDil === dil ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    background: selectedDil === dil ? '#3b82f6' : '#f8fafc',
                    color: selectedDil === dil ? '#ffffff' : '#64748b'
                  }}
                >
                  {dil}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <MapPin size={16} color="#6366f1" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569' }}>Şehir:</span>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{
                  padding: '0.4rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1',
                  fontSize: '0.82rem', fontWeight: 700, background: '#f8fafc', color: '#1e293b', outline: 'none'
                }}
              >
                {cityList.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <button
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.4rem 0.85rem', borderRadius: 10, border: '1px solid #fecaca',
                  background: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.78rem',
                  cursor: 'pointer', transition: 'all 0.2s', marginLeft: '0.5rem'
                }}
              >
                <RefreshCw size={13} /> Sıfırla
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── BÖLÜM LİSTESİ VE KARTLAR ── */}
      {visibleResults.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <GraduationCap size={48} color="#94a3b8" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ color: '#1e293b', margin: '0 0 0.5rem' }}>Eşleşen Üniversite / Bölüm Bulunamadı</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Filtreleri esneterek veya farklı bir arama kelimesi yazarak tekrar deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {visibleResults.map(item => {
              const badge = getScoreBadgeColor(item.puanTuru);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}
                  onClick={() => setSelectedDetailModal(item)}
                  style={{
                    background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0',
                    padding: '1.35rem', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: badge.text }} />

                  <div>
                    {/* Üst Etiketler */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 900,
                        background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`
                      }}>
                        {item.puanTuru}
                      </span>

                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <span style={{ padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                          {item.tur}
                        </span>
                        {item.burs !== 'Devlet' && (
                          <span style={{ padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#fef3c7', color: '#b45309' }}>
                            {item.burs}
                          </span>
                        )}
                        <span style={{ padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: '#e0e7ff', color: '#4338ca' }}>
                          {item.dil}
                        </span>
                      </div>
                    </div>

                    {/* Üniversite ve Bölüm Adı */}
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>
                      {item.uni}
                    </h3>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#4f46e5' }}>
                      {item.bolum}
                    </p>
                    <p style={{ margin: '0.2rem 0 1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                      {item.fakulte} • <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.sehir}
                    </p>
                  </div>

                  {/* Sıralama ve Puan Kutusu */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 0.95rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>BAŞARI SIRALAMASI</span>
                      <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                        #{item.sira.toLocaleString('tr-TR')}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>TABAN PUAN</span>
                      <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#10b981', fontFamily: 'monospace' }}>
                        {item.puan.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Render Optimizasyon Butonu (Limit Artırma) */}
          {filteredResults.length > displayLimit && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setDisplayLimit(prev => prev + 50)}
                style={{
                  padding: '0.85rem 2rem', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  fontWeight: 800, fontSize: '0.92rem', boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                  transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <ChevronDown size={18} /> Daha Fazla Bölüm Göster ({filteredResults.length - displayLimit} daha var)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── DETAY MODALI (YÖK ATLAS STYLE) ── */}
      <AnimatePresence>
        {selectedDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDetailModal(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
              zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff', borderRadius: 24, padding: '2rem',
                maxWidth: '550px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedDetailModal(null)}
                style={{
                  position: 'absolute', top: 20, right: 20, background: '#f1f5f9',
                  border: 'none', borderRadius: '50%', width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b'
                }}
              >
                <X size={18} />
              </button>

              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 900,
                background: getScoreBadgeColor(selectedDetailModal.puanTuru).bg,
                color: getScoreBadgeColor(selectedDetailModal.puanTuru).text,
                display: 'inline-block', marginBottom: '0.75rem'
              }}>
                {selectedDetailModal.puanTuru} Programı
              </span>

              <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                {selectedDetailModal.uni}
              </h2>
              <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>
                {selectedDetailModal.bolum}
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.88rem', color: '#64748b' }}>
                {selectedDetailModal.fakulte} • {selectedDetailModal.sehir}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>BAŞARI SIRALAMASI</span>
                  <strong style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 900 }}>#{selectedDetailModal.sira.toLocaleString('tr-TR')}</strong>
                </div>
                <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, display: 'block' }}>TABAN PUAN</span>
                  <strong style={{ fontSize: '1.3rem', color: '#10b981', fontWeight: 900 }}>{selectedDetailModal.puan.toFixed(2)}</strong>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>KONTENJAN</span>
                  <strong style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 800 }}>{selectedDetailModal.kontenjan} Kişi</strong>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>EĞİTİM DİLİ</span>
                  <strong style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 800 }}>{selectedDetailModal.dil}</strong>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={16} /> YÖK Atlas Tercih Bilgisi:
                </p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#78350f', lineHeight: 1.4 }}>
                  Bu program {selectedDetailModal.tur} üniversitesi statüsünde olup {selectedDetailModal.burs} seçeneği sunmaktadır.
                </p>
              </div>

              <button
                onClick={() => setSelectedDetailModal(null)}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: 14, border: 'none',
                  background: '#1e293b', color: 'white', fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Kapat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UniSearchRobot;
