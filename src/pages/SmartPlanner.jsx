import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, RefreshCw, Calendar, CheckCircle2, Lock, Unlock,
  Clock, Flame, AlertCircle, ArrowRight, Zap, Target, BookOpen, Layers,
  ChevronRight, Award, Plus, Trash2, Check, Bell, BarChart2, TrendingUp,
  BookMarked, HelpCircle, FileText, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { CURRICULUM_DATA } from '../data/curriculumData';

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
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'srs' | 'skillTree' | 'reports'
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

  // Curriculum progress state
  const [checkedCurriculumTopics, setCheckedCurriculumTopics] = useState({});
  const [studySessions, setStudySessions] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);

  // New task form state
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskTarget, setNewTaskTarget] = useState(50);

  // Sync with Firestore
  useEffect(() => {
    if (!currentUser) return;
    const loadPlannerData = async () => {
      try {
        // Load smart planner state
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'smartPlannerData');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.dailyTasks) setDailyTasks(data.dailyTasks);
          if (data.srsTasks) setSrsTasks(data.srsTasks);
          if (data.completedSkillIds) setCompletedSkillIds(data.completedSkillIds);
        }

        // Load curriculum progress
        const currRef = doc(db, 'users', currentUser.uid, 'settings', 'curriculumProgress');
        const currSnap = await getDoc(currRef);
        if (currSnap.exists() && currSnap.data().checked) {
          setCheckedCurriculumTopics(currSnap.data().checked);
        } else {
          const local = localStorage.getItem(`curriculum_${currentUser.uid}`);
          if (local) setCheckedCurriculumTopics(JSON.parse(local));
        }
      } catch (err) {
        console.warn('Smart planner data load failed:', err);
      }
    };
    loadPlannerData();
  }, [currentUser]);

  // Listen to studySessions for historical daily reports
  useEffect(() => {
    if (!currentUser) return;
    const qSess = query(
      collection(db, 'users', currentUser.uid, 'studySessions'),
      orderBy('startedAt', 'desc')
    );
    const unsub = onSnapshot(qSess, (snap) => {
      const sessList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudySessions(sessList);

      // Group sessions by date and generate daily historical reports
      const dateMap = {}; // { 'YYYY-MM-DD': { date, totalMinutes, topics: [], subjects: Set, count } }
      sessList.forEach(s => {
        const dStr = s.date || (s.startedAt ? s.startedAt.split('T')[0] : 'Bilinmeyen Tarih');
        if (!dateMap[dStr]) {
          dateMap[dStr] = {
            date: dStr,
            totalMinutes: 0,
            totalQuestions: 0,
            subjects: new Set(),
            topics: []
          };
        }
        dateMap[dStr].totalMinutes += Number(s.durationMinutes || 0);
        if (s.durationMinutes) dateMap[dStr].totalQuestions += Math.round(s.durationMinutes * 1.8);
        if (s.subject) dateMap[dStr].subjects.add(s.subject);
        if (s.topic && !dateMap[dStr].topics.includes(s.topic)) {
          dateMap[dStr].topics.push(s.topic);
        }
      });

      const reportList = Object.values(dateMap).sort((a, b) => new Date(b.date) - new Date(a.date));
      setDailyReports(reportList);
    });

    return () => unsub();
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

  // 🎯 ÖSYM / MEB Müfredatına Göre Otomatik Planlama Algoritması
  const handleAutoPlanFromCurriculum = () => {
    const examGroup = (userData?.examType || 'yks').toUpperCase();
    const curriculumExam = examGroup === 'LGS' ? CURRICULUM_DATA.LGS.LGS : (CURRICULUM_DATA.YKS.TYT || []);

    if (!curriculumExam || curriculumExam.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Müfredat Bulunamadı', text: 'Profilinizdeki sınav türü için müfredat verisi tanımlanamadı.' });
      return;
    }

    const uncompletedTopics = [];
    const completedTopics = [];

    curriculumExam.forEach(item => {
      const isChecked = !!checkedCurriculumTopics[item.id];
      if (isChecked) {
        completedTopics.push(item);
      } else {
        uncompletedTopics.push(item);
      }
    });

    // Create daily tasks for 3 uncompleted topics
    const newDailyFromCurriculum = uncompletedTopics.slice(0, 3).map((item, idx) => ({
      id: 'curr_uncomp_' + Date.now() + '_' + idx,
      topic: `${item.subject}: ${item.topic} (Müfredat Hedefi)`,
      targetCount: 50,
      completedCount: 0,
      day: idx === 0 ? 'Bugün' : 'Yarın',
      status: 'pending'
    }));

    // Create SRS repeat tasks for completed topics
    const newSrsFromCurriculum = completedTopics.slice(0, 3).map((item, idx) => ({
      id: 'curr_comp_srs_' + Date.now() + '_' + idx,
      topic: `🔁 Tekrar Etmelisin: ${item.subject} - ${item.topic}`,
      learnedDate: new Date().toISOString().split('T')[0],
      intervalDays: idx * 2 + 1,
      dueDate: idx === 0 ? 'Bugün' : `${idx * 2 + 1} Gün Sonra`,
      type: 'Tamamlanan Konu Düzenli Tekrarı',
      isDone: false
    }));

    const updatedDaily = [...dailyTasks, ...newDailyFromCurriculum];
    const updatedSrs = [...srsTasks, ...newSrsFromCurriculum];

    setDailyTasks(updatedDaily);
    setSrsTasks(updatedSrs);
    savePlannerData(updatedDaily, updatedSrs, undefined);

    Swal.fire({
      icon: 'success',
      title: '🎯 ÖSYM Müfredatınız Planlayıcıya Entegre Edildi!',
      html: `
        <div style="text-align:left; font-size:0.9rem; color:#334155; line-height:1.6;">
          <p><b>Tamamlanmayan Konular:</b> ${newDailyFromCurriculum.length} adet eksik konu bugünkü/yarınki görevlerinize eklendi.</p>
          <p><b>Tamamlanan Konular:</b> ${newSrsFromCurriculum.length} adet bitirilen konu hafızayı diri tutmak için <b>"🔁 Tekrar Etmelisin"</b> etiketiyle tekrarlara eklendi.</p>
        </div>
      `,
      confirmButtonColor: '#6366f1'
    });
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

  // 2. Aralıklı Tekrar (Spaced Repetition System - SRS) Tetikleyici
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
    const nextSrs = srsTasks.map(item => {
      if (item.id === srsId) return { ...item, isDone: !item.isDone };
      return item;
    });
    setSrsTasks(nextSrs);
    savePlannerData(undefined, nextSrs, undefined);
  };

  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;
    const newTask = {
      id: 'custom_' + Date.now(),
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

  const handleDeleteTask = (taskId) => {
    const nextDaily = dailyTasks.filter(t => t.id !== taskId);
    setDailyTasks(nextDaily);
    savePlannerData(nextDaily, undefined, undefined);
  };

  const handleToggleSkillCompleted = (skill) => {
    const isCompleted = completedSkillIds.includes(skill.id);
    const isLocked = skill.prereq ? !completedSkillIds.includes(skill.prereq) : false;

    if (isLocked) {
      const prereqSkill = SKILL_TREE_DATA[selectedSkillSubject].find(s => s.id === skill.prereq);
      Swal.fire({
        icon: 'warning',
        title: '🔒 Konu Kilitli!',
        text: `Bu konuyu çalışabilmek için önce önkoşulu olan "${prereqSkill?.name}" konusunu tamamlamalısınız!`
      });
      return;
    }

    let nextSkillIds;
    if (isCompleted) {
      nextSkillIds = completedSkillIds.filter(id => id !== skill.id);
    } else {
      nextSkillIds = [...completedSkillIds, skill.id];
      triggerSpacedRepetition(skill.name);
    }

    setCompletedSkillIds(nextSkillIds);
    savePlannerData(undefined, undefined, nextSkillIds);
  };

  // Helper for formatting duration
  const formatDuration = (mins = 0) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h === 0) return `${m} dakika`;
    if (m === 0) return `${h} saat`;
    return `${h} saat ${m} dk`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'Outfit, sans-serif' }}
    >
      {/* ── Üst Banner & Modül Tanıtımı ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        borderRadius: 24, padding: '2rem 2.25rem', color: 'white',
        boxShadow: '0 16px 40px rgba(49, 46, 129, 0.3)', border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#c7d2fe', marginBottom: '0.6rem' }}>
            <Brain size={14} color="#a855f7" /> Yapay Zeka Destekli Akıllı Planlayıcı
          </div>
          <h1 style={{ margin: '0 0 0.4rem 0', fontSize: '2rem', fontWeight: 900, color: 'white' }}>
            Akıllı & Esnek Çalışma Planlayıcısı ⚡
          </h1>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#c7d2fe', maxWidth: '600px', lineHeight: 1.5 }}>
            ÖSYM müfredatınızdaki eksik ve tamamlanan konulara göre hedefler otomatik oluşturulur, uyamadığınız kalan sorular motivasyonunuz kırılmadan esnek yeniden dağıtılır.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoPlanFromCurriculum}
            style={{
              padding: '0.85rem 1.3rem', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #d946ef)', color: 'white',
              fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(236,72,153,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <BookMarked size={18} /> Müfredatımdan Otomatik Görev Çek
          </button>

          <button
            onClick={handleAiReschedule}
            style={{
              padding: '0.85rem 1.3rem', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
              fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <Sparkles size={18} /> AI ile Otomatik Yeniden Dağıt
          </button>
        </div>
      </div>

      {/* ── Üst Sekme Navigasyonu ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: 14, fontWeight: 800, fontSize: '0.9rem',
            border: activeTab === 'daily' ? '2px solid #6366f1' : '1px solid #e2e8f0',
            background: activeTab === 'daily' ? '#4f46e5' : '#ffffff',
            color: activeTab === 'daily' ? '#ffffff' : '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'daily' ? '0 4px 14px rgba(79,70,229,0.3)' : 'none'
          }}
        >
          <Calendar size={18} /> Günlük Görevler & AI Dağıtım
        </button>

        <button
          onClick={() => setActiveTab('srs')}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: 14, fontWeight: 800, fontSize: '0.9rem',
            border: activeTab === 'srs' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
            background: activeTab === 'srs' ? '#d97706' : '#ffffff',
            color: activeTab === 'srs' ? '#ffffff' : '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'srs' ? '0 4px 14px rgba(217,119,6,0.3)' : 'none'
          }}
        >
          <Bell size={18} /> Günün Tekrarları (Spaced Repetition)
          {srsTasks.filter(t => !t.isDone).length > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: 20, padding: '0.1rem 0.5rem', fontSize: '0.72rem', fontWeight: 900 }}>
              {srsTasks.filter(t => !t.isDone).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('skillTree')}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: 14, fontWeight: 800, fontSize: '0.9rem',
            border: activeTab === 'skillTree' ? '2px solid #10b981' : '1px solid #e2e8f0',
            background: activeTab === 'skillTree' ? '#059669' : '#ffffff',
            color: activeTab === 'skillTree' ? '#ffffff' : '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'skillTree' ? '0 4px 14px rgba(5,150,105,0.3)' : 'none'
          }}
        >
          <Layers size={18} /> Önkoşullu Konu Ağacı (Skill Tree)
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: 14, fontWeight: 800, fontSize: '0.9rem',
            border: activeTab === 'reports' ? '2px solid #ec4899' : '1px solid #e2e8f0',
            background: activeTab === 'reports' ? '#db2777' : '#ffffff',
            color: activeTab === 'reports' ? '#ffffff' : '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'reports' ? '0 4px 14px rgba(219,39,119,0.3)' : 'none'
          }}
        >
          <BarChart2 size={18} /> Tarihsel Günlük Raporlarım 📊
        </button>
      </div>

      {/* ── 1. GÜNLÜK GÖREVLER & AI DAĞITIM TABI ── */}
      {activeTab === 'daily' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
              Bugünkü Çalışma Hedefleri
            </h2>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.88rem', color: '#64748b' }}>
              Tamamlayamadığınız kalan sorular AI butonu ile esnek olarak dağıtılır.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dailyTasks.map(t => {
                const percent = Math.min(100, Math.round((t.completedCount / t.targetCount) * 100));
                const isFinished = t.status === 'completed';

                return (
                  <div
                    key={t.id}
                    style={{
                      padding: '1rem 1.25rem', borderRadius: 16,
                      background: isFinished ? '#f0fdf4' : '#f8fafc',
                      border: isFinished ? '1.5px solid #a7f3d0' : '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          padding: '0.15rem 0.55rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800,
                          background: t.day === 'Bugün' ? '#e0e7ff' : '#fef3c7',
                          color: t.day === 'Bugün' ? '#4338ca' : '#b45309'
                        }}>
                          {t.day}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{t.topic}</h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleUpdateProgress(t.id, 10)}
                          style={{ padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          +10 Soru
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(t.id, 50)}
                          style={{ padding: '0.25rem 0.6rem', borderRadius: 8, border: '1px solid #6366f1', background: '#eef2ff', color: '#4f46e5', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          +50 Soru
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          style={{ padding: '0.25rem 0.4rem', borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, height: 8, borderRadius: 10, background: '#e2e8f0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: isFinished ? '#10b981' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isFinished ? '#10b981' : '#475569' }}>
                        {t.completedCount} / {t.targetCount} Soru ({percent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sağ Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Yeni Hedef Ekle</h3>
              <form onSubmit={handleAddNewTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>Ders / Konu Adı:</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Paragraf Soru Çözümü"
                    value={newTaskTopic}
                    onChange={e => setNewTaskTopic(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>Hedef Soru Miktarı:</label>
                  <input
                    type="number"
                    value={newTaskTarget}
                    onChange={e => setNewTaskTarget(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '0.75rem', borderRadius: 14, border: 'none',
                    background: '#1e293b', color: 'white', fontWeight: 900, fontSize: '0.88rem',
                    cursor: 'pointer', marginTop: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <Plus size={16} /> Planlayıcıya Ekle
                </button>
              </form>
            </div>

            <div style={{ background: '#fefce8', border: '1.5px solid #fde047', borderRadius: 18, padding: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#b45309', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={16} color="#d97706" /> Akıllı Esneklik Tüyosu
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: 1.5 }}>
                Bir gün hedefinizi tamamlayamadığınızda kendinizi suçlamayın! <b>"AI ile Otomatik Yeniden Dağıt"</b> butonuna basarak kalan soruları motivasyonunuz acıımadan haftanın diğer günlerine esnetin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. ARALIKLI TEKRAR (SRS) TABI ── */}
      {activeTab === 'srs' && (
        <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
            Aralıklı Tekrar Sistemi (Spaced Repetition) 🧠
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.88rem', color: '#64748b' }}>
            Öğrenilen bir konu 1, 3, 7 ve 30. günlerde tekrar edilmediğinde %80 oranında unutulur. Sistem unutturmamak için otomatik bildirimler üretir.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {srsTasks.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '1.25rem', borderRadius: 18,
                  background: item.isDone ? '#f0fdf4' : '#fffbeb',
                  border: item.isDone ? '1.5px solid #a7f3d0' : '1.5px solid #fde68a',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.15rem 0.6rem', borderRadius: 12, background: item.isDone ? '#dcfce7' : '#fef3c7', color: item.isDone ? '#15803d' : '#b45309', fontSize: '0.72rem', fontWeight: 800 }}>
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

      {/* ── 4. TARİHSEL GÜNLÜK RAPORLARIM TABI ── */}
      {activeTab === 'reports' && (
        <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={24} color="#ec4899" /> Günlük Tarihsel Çalışma Raporlarım 📊
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Her gün otomatik hesaplanan geçmiş çalışma saatleriniz, çözülen soru sayılarınız ve çalıştığınız konuların tarihsel arşivi.
            </p>
          </div>

          {dailyReports.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: 16, border: '1.5px dashed #cbd5e1' }}>
              <Activity size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>Henüz Günlük Rapor Kaydı Bulunmuyor</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Kronometrenizi açıp ders çalışmaya başladığınızda günlük çalışma ve soru raporlarınız burada tarihsel arşivlenecektir.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {dailyReports.map((report, idx) => {
                const isToday = report.date === new Date().toISOString().split('T')[0];
                const formattedDate = new Date(report.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
                const subjectsArr = Array.from(report.subjects || []);

                return (
                  <motion.div
                    key={report.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      padding: '1.5rem', borderRadius: 18,
                      background: isToday ? 'linear-gradient(135deg, #fefce8, #fffbeb)' : '#ffffff',
                      border: isToday ? '2px solid #fde047' : '1px solid #e2e8f0',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 900,
                          background: isToday ? '#f59e0b' : '#6366f1', color: 'white'
                        }}>
                          {isToday ? 'Günün Raporu (Bugün)' : idx === 1 ? 'Dünün Raporu' : formattedDate}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{formattedDate}</h3>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: '#f0fdf4', padding: '0.4rem 0.85rem', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Çalışma Süresi</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803d' }}>⏱️ {formatDuration(report.totalMinutes)}</span>
                        </div>
                        <div style={{ background: '#eef2ff', padding: '0.4rem 0.85rem', borderRadius: 12, border: '1px solid #c7d2fe' }}>
                          <span style={{ fontSize: '0.7rem', color: '#3730a3', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Çözülen Soru (Tahmini)</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#4338ca' }}>🎯 {report.totalQuestions} Soru</span>
                        </div>
                      </div>
                    </div>

                    {/* Çalışılan Dersler & Konular */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>
                          📚 Çalışılan Dersler:
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {subjectsArr.length === 0 ? <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Genel Çalışma</span> : subjectsArr.map(subj => (
                            <span key={subj} style={{ padding: '0.2rem 0.6rem', borderRadius: 10, background: '#e2e8f0', color: '#334155', fontSize: '0.78rem', fontWeight: 700 }}>
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>
                          🎯 İşlenen Konular & Seanslar:
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {report.topics.length === 0 ? <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Konu Notu Yok</span> : report.topics.map(top => (
                            <span key={top} style={{ padding: '0.2rem 0.6rem', borderRadius: 10, background: '#e0e7ff', color: '#4338ca', fontSize: '0.78rem', fontWeight: 700 }}>
                              {top}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Değerlendirme & Özet Raporu */}
                    <div style={{ background: '#f8fafc', padding: '0.85rem 1.1rem', borderRadius: 14, borderLeft: '4px solid #6366f1' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>
                        🤖 <b>AI Günlük Analiz Raporu:</b> {report.date} tarihinde toplam <b>{formatDuration(report.totalMinutes)}</b> çalışarak tahmini <b>{report.totalQuestions} soru</b> çözdün.{' '}
                        {report.totalMinutes >= 180 ? 'Harika bir performans sergiledin, hedeflerine adım adım yaklaşıyorsun! 🔥' : 'Düzenli çalışmayı sürdürerek yarın daha yüksek hedeflere ulaşabilirsin! 💪'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SmartPlanner;
