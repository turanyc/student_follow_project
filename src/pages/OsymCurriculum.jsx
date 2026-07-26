import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle2, Circle, Search, X,
  Award, Sparkles, Target, RefreshCw, CheckSquare, Layers, HelpCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { CURRICULUM_DATA, getSubjectColor } from '../data/curriculumData';

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

  const trLower = (str) => (str || '').replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();

  // Filter topics
  const filteredTopics = useMemo(() => {
    const q = trLower(searchQuery.trim());
    return activeTopics.filter(t => {
      if (selectedSubject !== 'Tümü' && t.subject !== selectedSubject) return false;
      if (q) {
        const nameMatch = trLower(t.name).includes(q);
        const subjMatch = trLower(t.subject).includes(q);
        if (!nameMatch && !subjMatch) return false;
      }
      return true;
    });
  }, [activeTopics, selectedSubject, searchQuery]);

  // Group topics by subject for clean section rendering
  const groupedFilteredTopics = useMemo(() => {
    const groups = {};
    filteredTopics.forEach(t => {
      if (!groups[t.subject]) groups[t.subject] = [];
      groups[t.subject].push(t);
    });
    return groups;
  }, [filteredTopics]);

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
        width: '100%', maxWidth: '1300px', margin: '0 auto',
        fontFamily: "'Outfit', sans-serif", paddingBottom: '3rem'
      }}
    >
      {/* ── ÜST BAŞLIK VE HEDEF BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: 22, padding: '1.75rem 2.25rem', color: 'white',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.3)', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: '#fbbf24' }}>
              <Sparkles size={14} color="#fbbf24" /> ÖSYM & Resmi Sınav Müfredat Takibi
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Müfredat & Konu İlerleme Haritası 📚
            </h1>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#c7d2fe', maxWidth: '650px', lineHeight: 1.5 }}>
              YKS, LGS ve KPSS resmi konularını sadeleştirilmiş çizgi listesinden kolayca takip et, tamamladığın her konuyu tek tıkla işaretle!
            </p>
          </div>

          {/* İlerleme ve Yüzde Kutusu */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 18,
            padding: '1.1rem 1.6rem', minWidth: '220px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e0e7ff', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              {selectedSubTab} Tamamlanma Oranı
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
              %{stats.pct}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c7d2fe', marginTop: '0.3rem', fontWeight: 600 }}>
              {stats.completed} / {stats.total} konu tamamlandı
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', marginTop: '0.65rem', overflow: 'hidden' }}>
              <div style={{ width: `${stats.pct}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #10b981)', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SINAV GRUBU VE ALT MÜFREDAT SEÇİM TABLARI ── */}
      <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', padding: '1.1rem 1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '1.25rem' }}>
        
        {/* Ana Sınav Grupları */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
          {[
            { id: 'YKS', label: 'YKS (TYT / AYT)', icon: Award, color: '#6366f1' },
            { id: 'LGS', label: 'LGS (Lise Geçiş)', icon: Target, color: '#10b981' },
            { id: 'KPSS', label: 'KPSS (Lisans / Önlisans / Lise)', icon: BookOpen, color: '#f59e0b' }
          ].map(group => {
            const Icon = group.icon;
            const isSelected = selectedExamGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleExamGroupChange(group.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.65rem 1.25rem', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: isSelected ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#f8fafc',
                  color: isSelected ? 'white' : '#64748b',
                  boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.2)' : 'none'
                }}
              >
                <Icon size={16} color={isSelected ? '#fbbf24' : group.color} />
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Alt Sınav Tabları & Sırfırla */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedExamGroup === 'YKS' && [
              { id: 'TYT', label: 'TYT Konuları' },
              { id: 'AYT', label: 'AYT Konuları' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubTab(sub.id); setSelectedSubject('Tümü'); }}
                style={{
                  padding: '0.45rem 1.1rem', borderRadius: 10, fontWeight: 800, fontSize: '0.84rem',
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
              <button style={{ padding: '0.45rem 1.1rem', borderRadius: 10, fontWeight: 800, fontSize: '0.84rem', border: '2px solid #10b981', background: '#ecfdf5', color: '#065f46' }}>
                LGS Sınav Konuları
              </button>
            )}

            {selectedExamGroup === 'KPSS' && [
              { id: 'KPSS Lisans', label: 'KPSS Lisans' },
              { id: 'KPSS Önlisans', label: 'KPSS Önlisans' },
              { id: 'KPSS Ortaöğretim', label: 'KPSS Ortaöğretim' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubTab(sub.id); setSelectedSubject('Tümü'); }}
                style={{
                  padding: '0.45rem 1.1rem', borderRadius: 10, fontWeight: 800, fontSize: '0.84rem',
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
              padding: '0.4rem 0.85rem', borderRadius: 10, border: '1px solid #fecaca',
              background: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.78rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Sıfırla
          </button>
        </div>
      </div>

      {/* ── ARAMA VE DERS FİLTRESİ ── */}
      <div style={{
        background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0',
        padding: '1rem 1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem'
      }}>
        {/* Dersler Pill Listesi */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', flex: 1 }}>
          {availableSubjects.map(sub => {
            const isSel = selectedSubject === sub;
            const subColors = getSubjectColor(sub);
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  padding: '0.4rem 0.95rem', borderRadius: 10, fontWeight: 800, fontSize: '0.8rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: isSel ? `2px solid ${subColors.main}` : '1px solid #e2e8f0',
                  background: isSel ? subColors.bg : '#f8fafc',
                  color: isSel ? subColors.text : '#64748b'
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Arama Barı */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Konu veya ders ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: searchQuery ? '0.55rem 2rem 0.55rem 2.2rem' : '0.55rem 0.9rem 0.55rem 2.2rem',
              borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.85rem',
              fontWeight: 600, outline: 'none', background: '#f8fafc'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── SADELEŞTİRİLMİŞ ÇİZGİ TARZI DERS/KONU LİSTESİ ── */}
      {Object.keys(groupedFilteredTopics).length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: 18, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <Target size={44} color="#94a3b8" style={{ margin: '0 auto 0.85rem auto', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>Aradığınız Kriterlerde Konu Bulunamadı</h3>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Filtreleri veya arama teriminizi değiştirerek tekrar deneyebilirsiniz.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Object.entries(groupedFilteredTopics).map(([subjectName, topicsList]) => {
            const subColors = getSubjectColor(subjectName);
            const completedCount = topicsList.filter(t => checkedTopics[t.id]).length;
            const subjectPct = Math.round((completedCount / topicsList.length) * 100);

            return (
              <div
                key={subjectName}
                style={{
                  background: '#ffffff', borderRadius: 16, border: `1px solid ${subColors.border}`,
                  overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                {/* Ders Başlığı Şeridi */}
                <div style={{
                  padding: '0.85rem 1.35rem', background: subColors.bg,
                  borderBottom: `1px solid ${subColors.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: subColors.main }} />
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: subColors.text }}>
                      {subjectName}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: subColors.text }}>
                      {completedCount} / {topicsList.length} (%{subjectPct})
                    </span>
                    <div style={{ width: 80, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${subjectPct}%`, height: '100%', background: subColors.main, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>

                {/* Konuların Tek Satır Çizgi Listesi */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {topicsList.map((topic, index) => {
                    const isChecked = !!checkedTopics[topic.id];
                    return (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.75rem 1.35rem', cursor: 'pointer',
                          background: isChecked ? '#f0fdf4' : index % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: index === topicsList.length - 1 ? 'none' : '1px solid #f1f5f9',
                          transition: 'background 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                          <span style={{
                            fontSize: '0.92rem', fontWeight: isChecked ? 700 : 600,
                            color: isChecked ? '#166534' : '#1e293b',
                            textDecoration: isChecked ? 'line-through' : 'none',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>
                            {topic.name}
                          </span>

                          {topic.isFrequent && (
                            <span style={{
                              padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800,
                              background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', flexShrink: 0
                            }}>
                              🔥 Sık Çıkan
                            </span>
                          )}

                          {topic.note && (
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', flexShrink: 0 }}>
                              💡 {topic.note}
                            </span>
                          )}
                        </div>

                        {/* Sade Checkbox */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0
                        }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isChecked ? '#166534' : '#94a3b8' }}>
                            {isChecked ? 'Tamamlandı' : 'Tamamla'}
                          </span>
                          <div style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: isChecked ? '#10b981' : '#ffffff',
                            border: isChecked ? 'none' : '2px solid #cbd5e1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {isChecked && <CheckCircle2 size={16} color="white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OsymCurriculum;
