import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Flame, CheckCircle2, Circle, Search, Filter,
  Award, Sparkles, Target, Zap, ChevronDown, ChevronRight,
  TrendingUp, BarChart3, Star, CheckSquare, Layers
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { CURRICULUM_DATA } from '../data/curriculumData';

const OsymCurriculum = () => {
  const { currentUser } = useAuth();
  const [selectedExamGroup, setSelectedExamGroup] = useState('YKS'); // 'YKS' | 'LGS' | 'KPSS'
  const [selectedSubTab, setSelectedSubTab] = useState('TYT'); // 'TYT' | 'AYT' | 'LGS' | 'KPSS Lisans' | 'KPSS Önlisans' | 'KPSS Ortaöğretim'
  const [selectedSubject, setSelectedSubject] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedTopics, setCheckedTopics] = useState({});
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage/Firestore when currentUser is ready
  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'curriculumProgress');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().checked) {
          setCheckedTopics(docSnap.data().checked);
        } else {
          const local = localStorage.getItem(`curriculum_${currentUser.uid}`);
          if (local) setCheckedTopics(JSON.parse(local));
        }
      } catch (e) {
        console.warn('Müfredat verisi yüklenirken hata:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [currentUser]);

  // Update subtab defaults when exam group changes
  const handleExamGroupChange = (group) => {
    setSelectedExamGroup(group);
    if (group === 'YKS') setSelectedSubTab('TYT');
    else if (group === 'LGS') setSelectedSubTab('LGS');
    else if (group === 'KPSS') setSelectedSubTab('KPSS Lisans');
    setSelectedSubject('Tümü');
  };

  // Get active topic list based on group & subtab
  const activeTopics = useMemo(() => {
    if (selectedExamGroup === 'YKS') {
      return CURRICULUM_DATA.YKS[selectedSubTab] || [];
    } else if (selectedExamGroup === 'LGS') {
      return CURRICULUM_DATA.LGS.LGS || [];
    } else if (selectedExamGroup === 'KPSS') {
      return CURRICULUM_DATA.KPSS[selectedSubTab] || [];
    }
    return [];
  }, [selectedExamGroup, selectedSubTab]);

  // Extract unique subjects
  const availableSubjects = useMemo(() => {
    const set = new Set(activeTopics.map(t => t.subject));
    return ['Tümü', ...Array.from(set)];
  }, [activeTopics]);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return activeTopics.filter(t => {
      if (selectedSubject !== 'Tümü' && t.subject !== selectedSubject) return false;
      if (searchQuery.trim() && !t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
      return true;
    });
  }, [activeTopics, selectedSubject, searchQuery]);

  // Calculate overall & subject completion stats
  const stats = useMemo(() => {
    const total = activeTopics.length;
    const completed = activeTopics.filter(t => checkedTopics[t.id]).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  }, [activeTopics, checkedTopics]);

  // Toggle checkmark
  const toggleTopic = async (topicId) => {
    const next = { ...checkedTopics, [topicId]: !checkedTopics[topicId] };
    setCheckedTopics(next);
    if (currentUser) {
      localStorage.setItem(`curriculum_${currentUser.uid}`, JSON.stringify(next));
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'curriculumProgress');
        await setDoc(docRef, { checked: next, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {
        console.warn('Müfredat kaydedilemedi:', e);
      }
    }
  };

  const handleResetProgress = () => {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${selectedSubTab} müfredatındaki tüm işaretlemeleriniz sıfırlanacak!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Evet, Sıfırla',
      cancelButtonText: 'Vazgeç'
    }).then(async (res) => {
      if (res.isConfirmed) {
        const next = { ...checkedTopics };
        activeTopics.forEach(t => delete next[t.id]);
        setCheckedTopics(next);
        if (currentUser) {
          localStorage.setItem(`curriculum_${currentUser.uid}`, JSON.stringify(next));
          try {
            const docRef = doc(db, 'users', currentUser.uid, 'settings', 'curriculumProgress');
            await setDoc(docRef, { checked: next, updatedAt: new Date().toISOString() }, { merge: true });
          } catch (_) { }
        }
        Swal.fire({ icon: 'success', title: 'Sıfırlandı!', timer: 1200, showConfirmButton: false });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '100%', maxWidth: '1400px', margin: '0 auto',
        fontFamily: "'Inter', sans-serif", paddingBottom: '3rem'
      }}
    >
      {/* ── ÜST BAŞLIK VE HEDEF BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        borderRadius: 24, padding: '2rem 2.5rem', color: 'white',
        boxShadow: '0 12px 36px rgba(49, 46, 129, 0.25)', marginBottom: '2rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
              <Sparkles size={14} color="#fbbf24" /> ÖSYM & Resmi Sınav Müfredatları
            </div>
            <h1 style={{ margin: '0 0 0.6rem 0', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, color: "white" }}>
              ÖSYM & Resmi Sınav Müfredat Takibi
            </h1>
            <p style={{ margin: 0, fontSize: '0.96rem', color: '#c7d2fe', maxWidth: '650px', lineHeight: 1.5 }}>
              YKS (TYT-AYT), LGS ve KPSS (Önlisans, Lisans, Ortaöğretim) resmi müfredatlarını adım adım takip et, tamamladığın konuları işaretleyerek hedefine tam isabetle ilerle!
            </p>
          </div>

          {/* İlerleme ve Yüzde Kartı */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 20,
            padding: '1.25rem 1.75rem', minWidth: '240px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e7ff', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {selectedSubTab} Genel İlerlemem
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
              %{stats.pct}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#c7d2fe', marginTop: '0.35rem', fontWeight: 600 }}>
              {stats.completed} / {stats.total} konu tamamlandı
            </div>
            {/* Küçük İlerleme Çubuğu */}
            <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.2)', marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{ width: `${stats.pct}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #10b981)', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SINAV GRUBU VE ALT MÜFREDAT SEÇİM TABLARI ── */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.25rem 1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '1.75rem' }}>
        {/* Ana Sınav Grupları */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'YKS', label: 'YKS (TYT / AYT)', icon: Award, color: '#6366f1' },
            { id: 'LGS', label: 'LGS (Lise Geçiş)', icon: Target, color: '#10b981' },
            { id: 'KPSS', label: 'KPSS (Önlisans / Lisans / Ortaöğretim)', icon: BookOpen, color: '#f59e0b' }
          ].map(group => {
            const Icon = group.icon;
            const isSelected = selectedExamGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleExamGroupChange(group.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 1.4rem', borderRadius: 14, fontWeight: 800, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: isSelected ? 'linear-gradient(135deg, #1e293b, #334155)' : '#f8fafc',
                  color: isSelected ? 'white' : '#64748b',
                  boxShadow: isSelected ? '0 4px 12px rgba(30,41,59,0.2)' : 'none'
                }}
              >
                <Icon size={18} color={isSelected ? '#fbbf24' : group.color} />
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Alt Sınav (TYT, AYT, KPSS Lisans vs.) Tabları */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {selectedExamGroup === 'YKS' && [
              { id: 'TYT', label: 'TYT Konuları (1. Oturum)' },
              { id: 'AYT', label: 'AYT Konuları (2. Oturum)' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubTab(sub.id); setSelectedSubject('Tümü'); }}
                style={{
                  padding: '0.55rem 1.2rem', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: selectedSubTab === sub.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  background: selectedSubTab === sub.id ? '#eef2ff' : '#ffffff',
                  color: selectedSubTab === sub.id ? '#4338ca' : '#64748b'
                }}
              >
                {sub.label}
              </button>
            ))}

            {selectedExamGroup === 'LGS' && (
              <button
                style={{
                  padding: '0.55rem 1.2rem', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem',
                  border: '2px solid #10b981', background: '#ecfdf5', color: '#065f46'
                }}
              >
                LGS Resmi Sınav Konuları
              </button>
            )}

            {selectedExamGroup === 'KPSS' && [
              { id: 'KPSS Lisans', label: 'KPSS Lisans Müfredatı' },
              { id: 'KPSS Önlisans', label: 'KPSS Önlisans Müfredatı' },
              { id: 'KPSS Ortaöğretim', label: 'KPSS Ortaöğretim (Lise) Müfredatı' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubTab(sub.id); setSelectedSubject('Tümü'); }}
                style={{
                  padding: '0.55rem 1.2rem', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: selectedSubTab === sub.id ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  background: selectedSubTab === sub.id ? '#fffbeb' : '#ffffff',
                  color: selectedSubTab === sub.id ? '#b45309' : '#64748b'
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetProgress}
            style={{
              padding: '0.45rem 1rem', borderRadius: 10, border: '1px solid #fecaca',
              background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            İşaretlemeleri Sıfırla
          </button>
        </div>
      </div>

      {/* ── ARAMA, DERS FİLTRESİ VE SIK ÇIKAN TOGGLE ── */}
      <div style={{
        background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0',
        padding: '1.25rem 1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
      }}>
        {/* Dersler Pill Listesi */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
          {availableSubjects.map(sub => {
            const isSel = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  padding: '0.45rem 1rem', borderRadius: 12, fontWeight: 800, fontSize: '0.82rem',
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: isSel ? '#1e293b' : '#f1f5f9',
                  color: isSel ? '#ffffff' : '#64748b'
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Arama Barı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Konu adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem',
                borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem',
                fontWeight: 600, outline: 'none', background: '#f8fafc'
              }}
            />
          </div>
        </div>
      </div>

      {/* ── KONULAR VE CHECKLIST LİSTESİ ── */}
      {filteredTopics.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: 20, padding: '4rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <Target size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>Aradığınız Kriterlerde Konu Bulunamadı</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Filtreleri veya arama kelimenizi sıfırlayarak tekrar deneyebilirsiniz.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
          {filteredTopics.map((topic, idx) => {
            const isChecked = !!checkedTopics[topic.id];
            return (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                onClick={() => toggleTopic(topic.id)}
                style={{
                  background: isChecked ? '#f0fdf4' : '#ffffff',
                  border: isChecked ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                  borderRadius: 18, padding: '1.25rem 1.4rem', cursor: 'pointer',
                  position: 'relative', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <span style={{
                      fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.65rem',
                      borderRadius: 8, background: isChecked ? '#dcfce7' : '#f1f5f9',
                      color: isChecked ? '#15803d' : '#475569', textTransform: 'uppercase'
                    }}>
                      {topic.subject}
                    </span>
                  </div>

                  <h4 style={{
                    margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 800,
                    color: isChecked ? '#166534' : '#1e293b', lineHeight: 1.35,
                    textDecoration: isChecked ? 'line-through' : 'none'
                  }}>
                    {topic.name}
                  </h4>

                  {topic.note && (
                    <p style={{ margin: 0, fontSize: '0.82rem', color: isChecked ? '#15803d' : '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      💡 {topic.note}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: isChecked ? '1px solid #bbf7d0' : '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isChecked ? '#166534' : '#94a3b8' }}>
                    {isChecked ? '🎉 Konu Tamamlandı (Çalışıldı)' : '⏳ Henüz Çalışılmadı'}
                  </span>

                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isChecked ? '#10b981' : '#f8fafc',
                    border: isChecked ? 'none' : '2px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isChecked && <CheckCircle2 size={18} color="white" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OsymCurriculum;
