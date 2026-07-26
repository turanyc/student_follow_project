import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, RefreshCw, Calendar, CheckCircle2, Lock, Unlock,
  Clock, Flame, AlertCircle, ArrowRight, Zap, Target, BookOpen, Layers,
  ChevronRight, Award, Plus, Trash2, Check, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

// ── Önkoşullu Konu Ağacı Haritası (Skill Tree Data) ──
const SKILL_TREE_DATA = {
  Matematik: [
    { id: 'm_temel', name: 'Temel Kavramlar & Sayılar', level: 1, prereq: null },
    { id: 'm_uslu', name: 'Üslü & Köklü Sayılar', level: 2, prereq: 'm_temel' },
    { id: 'm_fonk', name: 'Fonksiyonlar', level: 3, prereq: 'm_uslu' },
    { id: 'm_limit', name: 'Limit & Süreklilik', level: 4, prereq: 'm_fonk' },
    { id: 'm_turev', name: 'Türev & Uygulamaları', level: 5, prereq: 'm_limit' },
    { id: 'm_integral', name: 'İntegral & Alan', level: 6, prereq: 'm_turev' }
  ],
  Fizik: [
    { id: 'f_vektor', name: 'Vektörler & Kuvvet', level: 1, prereq: null },
    { id: 'f_hareket', name: 'İvmeli Hareket & Atışlar', level: 2, prereq: 'f_vektor' },
    { id: 'f_enerji', name: 'İş, Güç ve Enerji', level: 3, prereq: 'f_hareket' },
    { id: 'f_elektrik', name: 'Elektrik Alan & Potansiyel', level: 4, prereq: 'f_enerji' },
    { id: 'f_induksiyon', name: 'Manyetizma & İndüksiyon', level: 5, prereq: 'f_elektrik' }
  ],
  Türkçe: [
    { id: 't_sozcuk', name: 'Sözcükte Anlam', level: 1, prereq: null },
    { id: 't_cumle', name: 'Cümlede Anlam', level: 2, prereq: 't_sozcuk' },
    { id: 't_paragraf', name: 'Paragrafta Yapı & Ana Fikir', level: 3, prereq: 't_cumle' },
    { id: 't_dilbilgisi', name: 'Dil Bilgisi & Ögeler', level: 4, prereq: 't_paragraf' }
  ]
};

const SmartPlanner = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'srs' | 'skillTree'
  const [selectedSkillSubject, setSelectedSkillSubject] = useState('Matematik');

  // Daily Tasks state
  const [dailyTasks, setDailyTasks] = useState([
    { id: 't1', topic: 'Paragrafta Ana Fikir', targetCount: 150, completedCount: 50, day: 'Bugün', status: 'pending' },
    { id: 't2', topic: 'Fonksiyonlar Soru Çözümü', targetCount: 60, completedCount: 60, day: 'Bugün', status: 'completed' },
    { id: 't3', topic: 'Fizik Optik Kırılma', targetCount: 40, completedCount: 0, day: 'Bugün', status: 'pending' },
    { id: 't4', topic: 'Kimya Gaz Yasaları', targetCount: 50, completedCount: 0, day: 'Yarın', status: 'pending' }
  ]);

  // Spaced Repetition (SRS) tasks state
  const [srsTasks, setSrsTasks] = useState([
    { id: 'srs1', topic: 'Türev Kuralları', learnedDate: '2026-07-25', intervalDays: 1, dueDate: 'Bugün', type: '1. Gün Tekrar Testi', isDone: false },
    { id: 'srs2', topic: 'Trigonometri Toplam-Fark', learnedDate: '2026-07-23', intervalDays: 3, dueDate: 'Bugün', type: '3. Gün Derinleştirme Tekrarı', isDone: false },
    { id: 'srs3', topic: 'Hücre Bölünmeleri', learnedDate: '2026-07-19', intervalDays: 7, dueDate: 'Yarın', type: '7. Gün Haftalık Mantık Tekrarı', isDone: false }
  ]);

  // Completed Skills for Skill Tree
  const [completedSkillIds, setCompletedSkillIds] = useState(['m_temel', 'f_vektor', 't_sozcuk']);

  // New task form state
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskTarget, setNewTaskTarget] = useState(50);

  // Sync with Firestore
  useEffect(() => {
    if (!currentUser) return;
    const loadPlannerData = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'smartPlannerData');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.dailyTasks) setDailyTasks(data.dailyTasks);
          if (data.srsTasks) setSrsTasks(data.srsTasks);
          if (data.completedSkillIds) setCompletedSkillIds(data.completedSkillIds);
        }
      } catch (err) {
        console.warn('Smart planner data load failed:', err);
      }
    };
    loadPlannerData();
  }, [currentUser]);

  const savePlannerData = async (newDaily, newSrs, newSkills) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'settings', 'smartPlannerData');
      await setDoc(docRef, {
        dailyTasks: newDaily !== undefined ? newDaily : dailyTasks,
        srsTasks: newSrs !== undefined ? newSrs : srsTasks,
        completedSkillIds: newSkills !== undefined ? newSkills : completedSkillIds,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Save planner data failed:', err);
    }
  };

  // 1. Dinamik AI Yeniden Planlama Algoritması
  const handleAiReschedule = () => {
    const uncompletedTasks = dailyTasks.filter(t => t.completedCount < t.targetCount);
    if (uncompletedTasks.length === 0) {
      Swal.fire({ icon: 'info', title: 'Tüm Görevler Tamam!', text: 'Bugünkü tüm çalışma hedeflerinizi tamamladınız, harika gidiyorsunuz! 🎉' });
      return;
    }

    let redistributedCount = 0;
    const days = ['Yarın', 'Çarşamba', 'Perşembe', 'Cuma'];
    let dayIndex = 0;

    const updatedTasks = dailyTasks.map(t => {
      const remaining = t.targetCount - t.completedCount;
      if (remaining > 0 && t.day === 'Bugün') {
        redistributedCount += remaining;
        const targetDay = days[dayIndex % days.length];
        dayIndex++;
        return {
          ...t,
          targetCount: t.completedCount > 0 ? t.completedCount : 0,
          status: t.completedCount > 0 ? 'completed' : 'rescheduled'
        };
      }
      return t;
    });

    // Add new redistributed tasks to remaining days
    uncompletedTasks.forEach((t, idx) => {
      const remaining = t.targetCount - t.completedCount;
      if (remaining > 0) {
        const targetDay = days[idx % days.length];
        updatedTasks.push({
          id: 'resched_' + Date.now() + '_' + idx,
          topic: `${t.topic} (AI Devam)`,
          targetCount: remaining,
          completedCount: 0,
          day: targetDay,
          status: 'pending'
        });
      }
    });

    setDailyTasks(updatedTasks);
    savePlannerData(updatedTasks, undefined, undefined);

    Swal.fire({
      icon: 'success',
      title: '🤖 AI Akıllı Yeniden Dağıtım Tamamlandı!',
      html: `Tamamlanamayan <strong>${redistributedCount} adet</strong> soru/hedef motivasyonunuz kırılmadan haftanın kalan günlerine (${days.slice(0, 2).join(', ')}) otomatik esnek olarak dağıtıldı!`,
      confirmButtonColor: '#6366f1'
    });
  };

  // Update Completed Question count for a task
  const handleUpdateProgress = (taskId, addAmount) => {
    const nextDaily = dailyTasks.map(t => {
      if (t.id === taskId) {
        const nextComp = Math.min(t.targetCount, Math.max(0, t.completedCount + addAmount));
        const isFinished = nextComp >= t.targetCount;

        // Auto trigger Spaced Repetition if just completed!
        if (isFinished && t.status !== 'completed') {
          triggerSpacedRepetition(t.topic);
        }

        return {
          ...t,
          completedCount: nextComp,
          status: isFinished ? 'completed' : 'pending'
        };
      }
      return t;
    });
    setDailyTasks(nextDaily);
    savePlannerData(nextDaily, undefined, undefined);
  };

  // 2. Aralıklı Tekrar (Spaced Repetition System - SRS) Tetikleyici (+1, +3, +7, +30 gün)
  const triggerSpacedRepetition = (topicName) => {
    const today = new Date().toISOString().split('T')[0];
    const newSrsItems = [
      { id: 'srs_' + Date.now() + '_1', topic: topicName, learnedDate: today, intervalDays: 1, dueDate: '1 Gün Sonra', type: '1. Gün Tekrar Testi', isDone: false },
      { id: 'srs_' + Date.now() + '_3', topic: topicName, learnedDate: today, intervalDays: 3, dueDate: '3 Gün Sonra', type: '3. Gün Derinleştirme Tekrarı', isDone: false },
      { id: 'srs_' + Date.now() + '_7', topic: topicName, learnedDate: today, intervalDays: 7, dueDate: '7 Gün Sonra', type: '7. Gün Haftalık Mantık Tekrarı', isDone: false },
      { id: 'srs_' + Date.now() + '_30', topic: topicName, learnedDate: today, intervalDays: 30, dueDate: '30 Gün Sonra', type: '30. Gün Kalıcı Hafıza Testi', isDone: false },
    ];

    const nextSrs = [...srsTasks, ...newSrsItems];
    setSrsTasks(nextSrs);
    savePlannerData(undefined, nextSrs, undefined);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `🧠 "${topicName}" öğrendiğin için 1, 3, 7 ve 30 günlük Spaced Repetition tekrarları otomatik takvime eklendi!`,
      showConfirmButton: false,
      timer: 3500
    });
  };

  const handleToggleSrsDone = (srsId) => {
    const nextSrs = srsTasks.map(item => item.id === srsId ? { ...item, isDone: !item.isDone } : item);
    setSrsTasks(nextSrs);
    savePlannerData(undefined, nextSrs, undefined);
  };

  // 3. Önkoşullu Konu Ağacı (Skill Tree) Etkileşimi
  const handleToggleSkillCompleted = (skill) => {
    // Check if prerequisite is met
    if (skill.prereq && !completedSkillIds.includes(skill.prereq)) {
      const prereqObj = SKILL_TREE_DATA[selectedSkillSubject].find(s => s.id === skill.prereq);
      Swal.fire({
        icon: 'error',
        title: '🔒 Kilitli Konu!',
        html: `<strong>"${skill.name}"</strong> konusunu açmak için önce önkoşulu olan <strong>"${prereqObj?.name || 'Önkoşul Konusu'}"</strong> konusunu tamamlamalısın!`,
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    let nextSkills;
    if (completedSkillIds.includes(skill.id)) {
      nextSkills = completedSkillIds.filter(id => id !== skill.id);
    } else {
      nextSkills = [...completedSkillIds, skill.id];
      triggerSpacedRepetition(skill.name);
    }
    setCompletedSkillIds(nextSkills);
    savePlannerData(undefined, undefined, nextSkills);
  };

  // Add new manual task
  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;
    const newTask = {
      id: 'task_' + Date.now(),
      topic: newTaskTopic.trim(),
      targetCount: Number(newTaskTarget) || 50,
      completedCount: 0,
      day: 'Bugün',
      status: 'pending'
    };
    const nextDaily = [newTask, ...dailyTasks];
    setDailyTasks(nextDaily);
    savePlannerData(nextDaily, undefined, undefined);
    setNewTaskTopic('');
    setNewTaskTarget(50);
  };

  const handleDeleteTask = (id) => {
    const nextDaily = dailyTasks.filter(t => t.id !== id);
    setDailyTasks(nextDaily);
    savePlannerData(nextDaily, undefined, undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '100%', maxWidth: '1350px', margin: '0 auto',
        fontFamily: "'Outfit', sans-serif", paddingBottom: '3.5rem'
      }}
    >
      {/* ── ÜST BAŞLIK VE AI BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: 24, padding: '2rem 2.5rem', color: 'white',
        boxShadow: '0 14px 40px rgba(15, 23, 42, 0.35)', marginBottom: '1.75rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.95rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem', color: '#818cf8' }}>
              <Brain size={15} color="#818cf8" /> Yapay Zeka Destekli Akıllı Planlayıcı
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Akıllı & Esnek Çalışma Planlayıcısı ⚡
            </h1>
            <p style={{ margin: 0, fontSize: '0.96rem', color: '#c7d2fe', maxWidth: '680px', lineHeight: 1.5 }}>
              Yetişmeyen hedefleri AI ile esnek olarak yeniden dağıtın, unutmamanız için Spaced Repetition (Aralıklı Tekrar) bildirimleri alın ve Önkoşullu Konu Ağacını çözün!
            </p>
          </div>

          <button
            onClick={handleAiReschedule}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.95rem 1.6rem', borderRadius: 16, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
              fontWeight: 800, fontSize: '0.92rem', boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
              transition: 'all 0.2s', flexShrink: 0
            }}
          >
            <Sparkles size={18} /> 🤖 AI ile Otomatik Yeniden Dağıt
          </button>
        </div>
      </div>

      {/* ── MODÜL SEÇİM SEKMELERİ ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'daily', label: '📅 Günlük Görevler & AI Dağıtım', icon: Calendar, color: '#6366f1' },
          { id: 'srs', label: '🔔 Günün Tekrarları (Spaced Repetition)', icon: Bell, color: '#f59e0b', badge: srsTasks.filter(s => !s.isDone).length },
          { id: 'skillTree', label: '🔒 Önkoşullu Konu Ağacı (Skill Tree)', icon: Layers, color: '#10b981' }
        ].map(tab => {
          const isSel = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.8rem 1.4rem', borderRadius: 16, fontWeight: 800, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                background: isSel ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#ffffff',
                color: isSel ? '#ffffff' : '#64748b',
                boxShadow: isSel ? '0 4px 16px rgba(15,23,42,0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
            >
              <Icon size={18} color={isSel ? '#fbbf24' : tab.color} />
              {tab.label}
              {tab.badge > 0 && (
                <span style={{
                  padding: '0.15rem 0.55rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 900,
                  background: '#ef4444', color: 'white', marginLeft: '0.3rem'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 1. GÜNLÜK GÖREVLER VE AI YENİDEN PLANLAMA ── */}
      {activeTab === 'daily' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          
          {/* Sol Kolon: Görev Listesi */}
          <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Bugünkü Çalışma Hedefleri</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>Tamamlayamadığınız kalan sorular AI butonu ile esnek olarak dağıtılır.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dailyTasks.map(task => {
                const pct = Math.round((task.completedCount / task.targetCount) * 100);
                const isDone = task.completedCount >= task.targetCount;
                return (
                  <motion.div
                    key={task.id}
                    layout
                    style={{
                      background: isDone ? '#f0fdf4' : task.status === 'rescheduled' ? '#fffbeb' : '#f8fafc',
                      border: isDone ? '1.5px solid #10b981' : task.status === 'rescheduled' ? '1px solid #fde68a' : '1px solid #e2e8f0',
                      borderRadius: 16, padding: '1.1rem 1.35rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span style={{ padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800, background: isDone ? '#dcfce7' : '#e0e7ff', color: isDone ? '#15803d' : '#3730a3' }}>
                          {task.day}
                        </span>
                        {task.status === 'rescheduled' && (
                          <span style={{ padding: '0.15rem 0.55rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#b45309' }}>
                            🤖 AI Yeniden Planlandı
                          </span>
                        )}
                        <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: isDone ? '#166534' : '#0f172a', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {task.topic}
                        </h4>
                      </div>

                      {/* İlerleme Çubuğu */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ flex: 1, height: 7, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: isDone ? '#10b981' : '#6366f1', transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', minWidth: '90px' }}>
                          {task.completedCount} / {task.targetCount} Soru
                        </span>
                      </div>
                    </div>

                    {/* Hızlı Butonlar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleUpdateProgress(task.id, 10)}
                        style={{ padding: '0.4rem 0.65rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        +10 Soru
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(task.id, 25)}
                        style={{ padding: '0.4rem 0.65rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        +25 Soru
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ padding: '0.4rem', borderRadius: 8, border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sağ Kolon: Yeni Görev Ekle & AI Tüyo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>Yeni Hedef Ekle</h3>
              <form onSubmit={handleAddNewTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Ders / Konu Adı:</label>
                  <input
                    type="text"
                    placeholder="Örn: Paragraf Soru Çözümü"
                    value={newTaskTopic}
                    onChange={e => setNewTaskTopic(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Hedef Soru Miktarı:</label>
                  <input
                    type="number"
                    value={newTaskTarget}
                    onChange={e => setNewTaskTarget(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem', borderRadius: 12, border: 'none', background: '#1e293b',
                    color: 'white', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <Plus size={16} /> Planlayıcıya Ekle
                </button>
              </form>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: 20, border: '1px solid #fde68a', padding: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.92rem', fontWeight: 900, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                💡 Akıllı Esneklik Tüyosu
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350f', lineHeight: 1.4 }}>
                Bir gün hedefinizi tamamlayamadığınızda kendinizi suçlamayın! <strong>"AI ile Otomatik Yeniden Dağıt"</strong> butonuna basarak kalan soruları motivasyonunuz bozulmadan haftanın diğer günlerine esnetin.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ── 2. ARALIKLI TEKRAR (SPACED REPETITION - SRS) ── */}
      {activeTab === 'srs' && (
        <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
              Aralıklı Tekrar (Spaced Repetition) Takvimi 🧠
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Tamamladığınız veya öğrendiğiniz her konu kalıcı hafızaya aktarılması için <strong>+1, +3, +7 ve +30 gün</strong> sonra otomatik olarak tekrar görevi olarak önünüze düşer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.1rem' }}>
            {srsTasks.map(item => (
              <div
                key={item.id}
                style={{
                  background: item.isDone ? '#f0fdf4' : '#ffffff',
                  border: item.isDone ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                  borderRadius: 16, padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#b45309' }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                      {item.dueDate}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 900, color: item.isDone ? '#166534' : '#0f172a', textDecoration: item.isDone ? 'line-through' : 'none' }}>
                    {item.topic}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                    Öğrenilme Tarihi: {item.learnedDate} (+{item.intervalDays} Gün Tekrarı)
                  </p>
                </div>

                <button
                  onClick={() => handleToggleSrsDone(item.id)}
                  style={{
                    marginTop: '1rem', width: '100%', padding: '0.6rem', borderRadius: 10, border: 'none',
                    background: item.isDone ? '#dcfce7' : '#1e293b',
                    color: item.isDone ? '#15803d' : '#ffffff',
                    fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  {item.isDone ? <Check size={16} /> : <CheckCircle2 size={16} />}
                  {item.isDone ? 'Tekrar Tamamlandı!' : 'Tekrar Testini Tamamla'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. ÖNKOŞULLU KONU AĞACI (SKILL TREE) ── */}
      {activeTab === 'skillTree' && (
        <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                Önkoşullu Konu Ağacı (Skill Tree) 🌳
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                Yanlış sırayla çalışıp vakit kaybetmeyin! Önkoşulu olan konular kilitlidir, önceki konu bitmeden kilitler açılmaz.
              </p>
            </div>

            {/* Ders Seçimi */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Object.keys(SKILL_TREE_DATA).map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSkillSubject(subj)}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: 12, fontWeight: 800, fontSize: '0.85rem',
                    border: selectedSkillSubject === subj ? '2px solid #6366f1' : '1px solid #cbd5e1',
                    background: selectedSkillSubject === subj ? '#eef2ff' : '#ffffff',
                    color: selectedSkillSubject === subj ? '#4338ca' : '#64748b', cursor: 'pointer'
                  }}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Yetenek Ağacı Düğümleri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
            {SKILL_TREE_DATA[selectedSkillSubject].map((skill, index) => {
              const isCompleted = completedSkillIds.includes(skill.id);
              const isLocked = skill.prereq ? !completedSkillIds.includes(skill.prereq) : false;
              const prereqSkill = skill.prereq ? SKILL_TREE_DATA[selectedSkillSubject].find(s => s.id === skill.prereq) : null;

              return (
                <React.Fragment key={skill.id}>
                  {index > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
                      <div style={{ width: 3, height: 28, background: isCompleted ? '#10b981' : '#cbd5e1' }} />
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: isLocked ? 1 : 1.01 }}
                    onClick={() => handleToggleSkillCompleted(skill)}
                    style={{
                      background: isCompleted ? '#f0fdf4' : isLocked ? '#f8fafc' : '#ffffff',
                      border: isCompleted ? '2px solid #10b981' : isLocked ? '1.5px dashed #cbd5e1' : '2px solid #6366f1',
                      borderRadius: 18, padding: '1.25rem 1.5rem', cursor: isLocked ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: isCompleted ? '0 4px 15px rgba(16,185,129,0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                      opacity: isLocked ? 0.65 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: isCompleted ? '#10b981' : isLocked ? '#e2e8f0' : '#e0e7ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isCompleted ? '#ffffff' : isLocked ? '#94a3b8' : '#4338ca',
                        fontWeight: 900, fontSize: '1.1rem'
                      }}>
                        {isCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={22} /> : skill.level}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                          SEVİYE {skill.level} • {selectedSkillSubject}
                        </span>
                        <h3 style={{ margin: '0.1rem 0 0', fontSize: '1.1rem', fontWeight: 900, color: isCompleted ? '#166534' : isLocked ? '#64748b' : '#0f172a' }}>
                          {skill.name}
                        </h3>
                        {isLocked && prereqSkill && (
                          <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                            🔒 Kilitli (Önkoşul: {prereqSkill.name})
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      style={{
                        padding: '0.55rem 1.1rem', borderRadius: 12, border: 'none',
                        background: isCompleted ? '#dcfce7' : isLocked ? '#e2e8f0' : '#6366f1',
                        color: isCompleted ? '#15803d' : isLocked ? '#94a3b8' : '#ffffff',
                        fontWeight: 800, fontSize: '0.82rem', cursor: isLocked ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCompleted ? 'Tamamlandı ✓' : isLocked ? 'Kilitli 🔒' : 'Tamamlandı İşaretle'}
                    </button>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SmartPlanner;
