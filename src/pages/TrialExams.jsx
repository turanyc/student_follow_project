import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Plus, ClipboardList, RotateCcw, ChevronDown, ChevronUp, Star, Flame, Target, BookOpen, PenTool } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, updateDoc, arrayUnion, arrayRemove, getDoc, serverTimestamp
} from 'firebase/firestore';

// Sabit "En Çok Çıkan Sorular" listesi (YKS & LGS)
const FREQUENT_QUESTIONS = [
  // YKS Konuları
  { id: 'fq1', category: 'Matematik', topic: 'Sayılar ve İşlemler', exam: 'TYT' },
  { id: 'fq2', category: 'Matematik', topic: 'Oran - Orantı', exam: 'TYT' },
  { id: 'fq3', category: 'Matematik', topic: 'Kümeler', exam: 'TYT' },
  { id: 'fq4', category: 'Matematik', topic: 'Mantık', exam: 'TYT' },
  { id: 'fq5', category: 'Matematik', topic: 'Olasılık', exam: 'TYT' },
  { id: 'fq6', category: 'Matematik', topic: 'Permütasyon - Kombinasyon', exam: 'TYT' },
  { id: 'fq7', category: 'Matematik', topic: 'İkinci Dereceden Denklemler', exam: 'TYT' },
  { id: 'fq8', category: 'Matematik', topic: 'Trigonometri', exam: 'AYT' },
  { id: 'fq9', category: 'Matematik', topic: 'Türev', exam: 'AYT' },
  { id: 'fq10', category: 'Matematik', topic: 'İntegral', exam: 'AYT' },
  { id: 'fq11', category: 'Türkçe', topic: 'Paragraf Soruları', exam: 'TYT' },
  { id: 'fq12', category: 'Türkçe', topic: 'Sözcükte Anlam', exam: 'TYT' },
  { id: 'fq13', category: 'Türkçe', topic: 'Noktalama İşaretleri', exam: 'TYT' },
  { id: 'fq14', category: 'Türkçe', topic: 'Cümle Bilgisi', exam: 'TYT' },
  { id: 'fq15', category: 'Türkçe', topic: 'Deyim ve Atasözleri', exam: 'TYT' },
  { id: 'fq16', category: 'Fen Bilimleri', topic: 'Kuvvet ve Hareket', exam: 'TYT' },
  { id: 'fq17', category: 'Fen Bilimleri', topic: 'Elektrik', exam: 'TYT' },
  { id: 'fq18', category: 'Fen Bilimleri', topic: 'Optik', exam: 'TYT' },
  { id: 'fq19', category: 'Fen Bilimleri', topic: 'Kimyasal Tepkimeler', exam: 'TYT' },
  { id: 'fq20', category: 'Fen Bilimleri', topic: 'Hücre Biyolojisi', exam: 'TYT' },
  { id: 'fq21', category: 'Sosyal Bilimler', topic: 'Tarih: Türkiye Cumhuriyeti', exam: 'TYT' },
  { id: 'fq22', category: 'Sosyal Bilimler', topic: 'Coğrafya: İklim', exam: 'TYT' },
  { id: 'fq23', category: 'Sosyal Bilimler', topic: 'Felsefe: Bilgi Kuramı', exam: 'TYT' },
  { id: 'fq24', category: 'Sosyal Bilimler', topic: 'Din Kültürü: Temel Kavramlar', exam: 'TYT' },
  // LGS Konuları
  { id: 'lgs1', category: 'Matematik', topic: 'Çarpanlar ve Katlar', exam: 'LGS' },
  { id: 'lgs2', category: 'Matematik', topic: 'Üslü İfadeler', exam: 'LGS' },
  { id: 'lgs3', category: 'Matematik', topic: 'Kareköklü İfadeler', exam: 'LGS' },
  { id: 'lgs4', category: 'Matematik', topic: 'Veri Analizi', exam: 'LGS' },
  { id: 'lgs5', category: 'Matematik', topic: 'Doğrusal Denklemler', exam: 'LGS' },
  { id: 'lgs6', category: 'Türkçe', topic: 'Sözcükte Anlam (LGS)', exam: 'LGS' },
  { id: 'lgs7', category: 'Türkçe', topic: 'Paragrafta Anlam ve Ana Düşünce', exam: 'LGS' },
  { id: 'lgs8', category: 'Türkçe', topic: 'Cümlenin Ögeleri ve Fiilimsi', exam: 'LGS' },
  { id: 'lgs9', category: 'Fen Bilimleri', topic: 'Mevsimlerin Oluşumu', exam: 'LGS' },
  { id: 'lgs10', category: 'Fen Bilimleri', topic: 'DNA ve Genetik Kod', exam: 'LGS' },
  { id: 'lgs11', category: 'Fen Bilimleri', topic: 'Basınç ve Madde Döngüleri', exam: 'LGS' },
  { id: 'lgs12', category: 'İnkılap Tarihi', topic: 'Bir Kahraman Doğuyor', exam: 'LGS' },
  { id: 'lgs13', category: 'İnkılap Tarihi', topic: 'Milli Uyanış: Bağımsızlık Yolunda Adımlar', exam: 'LGS' },
  { id: 'lgs14', category: 'Din Kültürü', topic: 'Kader İnancı ve Zekat', exam: 'LGS' },
  { id: 'lgs15', category: 'İngilizce', topic: 'Friendship / Teen Life / In the Kitchen', exam: 'LGS' },
];

const categoryColors = {
  'Matematik': '#6366f1',
  'Türkçe': '#10b981',
  'Fen Bilimleri': '#f59e0b',
  'Sosyal Bilimler': '#ef4444',
  'İnkılap Tarihi': '#ef4444',
  'İngilizce': '#3b82f6',
  'Din Kültürü': '#8b5cf6'
};

const TrialExams = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'history' | 'frequent'
  const [expandedExam, setExpandedExam] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [editingExamId, setEditingExamId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [examType, setExamType] = useState('yks'); // 'yks' or 'lgs'

  // Form states for adding exam
  const [formData, setFormData] = useState({
    title: '',
    mathCorrect: '', mathWrong: '',
    turkishCorrect: '', turkishWrong: '',
    scienceCorrect: '', scienceWrong: '',
    socialCorrect: '', socialWrong: '',
    inkilapCorrect: '', inkilapWrong: '',
    englishCorrect: '', englishWrong: '',
    dinCorrect: '', dinWrong: ''
  });

  const isLgs = examType === 'lgs';
  const ratio = isLgs ? 3 : 4;

  const calcNet = (correct, wrong) => {
    const c = Number(correct) || 0;
    const w = Number(wrong) || 0;
    return Math.max(0, c - w / ratio);
  };

  const mathNet = calcNet(formData.mathCorrect, formData.mathWrong);
  const turkishNet = calcNet(formData.turkishCorrect, formData.turkishWrong);
  const scienceNet = calcNet(formData.scienceCorrect, formData.scienceWrong);
  const socialNet = calcNet(formData.socialCorrect, formData.socialWrong);
  const inkilapNet = calcNet(formData.inkilapCorrect, formData.inkilapWrong);
  const englishNet = calcNet(formData.englishCorrect, formData.englishWrong);
  const dinNet = calcNet(formData.dinCorrect, formData.dinWrong);

  const totalNet = isLgs 
    ? (mathNet + turkishNet + scienceNet + inkilapNet + englishNet + dinNet)
    : (mathNet + turkishNet + scienceNet + socialNet);

  useEffect(() => {
    if (!currentUser) return;

    const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
    const q = query(examsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = [];
      snapshot.forEach(docSnap => {
        examsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setExams(examsData);
      setLoading(false);
    });

    // Load user data for examType and completed topics
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const uData = userDoc.data();
          if (uData.examType) setExamType(uData.examType);
          setCompletedTopics(uData.completedFrequentTopics || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingTopics(false);
    };
    loadUserData();

    return () => unsubscribe();
  }, [currentUser]);

  const handleSave = async () => {
    if (!formData.title || !currentUser) return;

    const newExam = {
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      examType: examType,
      total: parseFloat(totalNet.toFixed(2)),
      math: parseFloat(mathNet.toFixed(2)),
      turkish: parseFloat(turkishNet.toFixed(2)),
      science: parseFloat(scienceNet.toFixed(2)),
      social: parseFloat(socialNet.toFixed(2)),
      inkilap: parseFloat(inkilapNet.toFixed(2)),
      english: parseFloat(englishNet.toFixed(2)),
      din: parseFloat(dinNet.toFixed(2)),
      mathCorrect: Number(formData.mathCorrect) || 0, mathWrong: Number(formData.mathWrong) || 0,
      turkishCorrect: Number(formData.turkishCorrect) || 0, turkishWrong: Number(formData.turkishWrong) || 0,
      scienceCorrect: Number(formData.scienceCorrect) || 0, scienceWrong: Number(formData.scienceWrong) || 0,
      socialCorrect: Number(formData.socialCorrect) || 0, socialWrong: Number(formData.socialWrong) || 0,
      inkilapCorrect: Number(formData.inkilapCorrect) || 0, inkilapWrong: Number(formData.inkilapWrong) || 0,
      englishCorrect: Number(formData.englishCorrect) || 0, englishWrong: Number(formData.englishWrong) || 0,
      dinCorrect: Number(formData.dinCorrect) || 0, dinWrong: Number(formData.dinWrong) || 0,
      revisedTopics: [],
      createdAt: new Date().toISOString()
    };

    try {
      const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
      await addDoc(examsRef, newExam);

      setFormData({
        title: '',
        mathCorrect: '', mathWrong: '',
        turkishCorrect: '', turkishWrong: '',
        scienceCorrect: '', scienceWrong: '',
        socialCorrect: '', socialWrong: '',
        inkilapCorrect: '', inkilapWrong: '',
        englishCorrect: '', englishWrong: '',
        dinCorrect: '', dinWrong: ''
      });

      Swal.fire({
        icon: 'success',
        title: 'Harika!',
        text: `Deneme kaydedildi. (${examType.toUpperCase()} - Toplam: ${totalNet.toFixed(2)} Net)`,
        confirmButtonColor: 'var(--success-color)'
      });
      setActiveTab('history');
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Sınav kaydedilirken bir hata oluştu.' });
    }
  };

  const handleEditExam = (exam) => {
    setEditingExamId(exam.id);
    setEditFormData({
      title: exam.title,
      mathCorrect: exam.mathCorrect || 0, mathWrong: exam.mathWrong || 0,
      turkishCorrect: exam.turkishCorrect || 0, turkishWrong: exam.turkishWrong || 0,
      scienceCorrect: exam.scienceCorrect || 0, scienceWrong: exam.scienceWrong || 0,
      socialCorrect: exam.socialCorrect || 0, socialWrong: exam.socialWrong || 0,
      inkilapCorrect: exam.inkilapCorrect || 0, inkilapWrong: exam.inkilapWrong || 0,
      englishCorrect: exam.englishCorrect || 0, englishWrong: exam.englishWrong || 0,
      dinCorrect: exam.dinCorrect || 0, dinWrong: exam.dinWrong || 0,
    });
  };

  const handleUpdateExam = async (examId) => {
    const calcN = (c, w) => parseFloat(Math.max(0, Number(c) - Number(w) / ratio).toFixed(2));
    const mNet = calcN(editFormData.mathCorrect, editFormData.mathWrong);
    const tNet = calcN(editFormData.turkishCorrect, editFormData.turkishWrong);
    const sNet = calcN(editFormData.scienceCorrect, editFormData.scienceWrong);
    const socNet = calcN(editFormData.socialCorrect, editFormData.socialWrong);
    const iNet = calcN(editFormData.inkilapCorrect, editFormData.inkilapWrong);
    const eNet = calcN(editFormData.englishCorrect, editFormData.englishWrong);
    const dNet = calcN(editFormData.dinCorrect, editFormData.dinWrong);
    
    const totNet = isLgs 
      ? parseFloat((mNet + tNet + sNet + iNet + eNet + dNet).toFixed(2))
      : parseFloat((mNet + tNet + sNet + socNet).toFixed(2));

    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'trialExams', examId), {
        title: editFormData.title,
        math: mNet, turkish: tNet, science: sNet, social: socNet,
        inkilap: iNet, english: eNet, din: dNet,
        total: totNet,
        mathCorrect: Number(editFormData.mathCorrect), mathWrong: Number(editFormData.mathWrong),
        turkishCorrect: Number(editFormData.turkishCorrect), turkishWrong: Number(editFormData.turkishWrong),
        scienceCorrect: Number(editFormData.scienceCorrect), scienceWrong: Number(editFormData.scienceWrong),
        socialCorrect: Number(editFormData.socialCorrect), socialWrong: Number(editFormData.socialWrong),
        inkilapCorrect: Number(editFormData.inkilapCorrect), inkilapWrong: Number(editFormData.inkilapWrong),
        englishCorrect: Number(editFormData.englishCorrect), englishWrong: Number(editFormData.englishWrong),
        dinCorrect: Number(editFormData.dinCorrect), dinWrong: Number(editFormData.dinWrong),
        updatedAt: new Date().toISOString()
      });
      setEditingExamId(null);
      Swal.fire({ icon: 'success', title: 'Güncellendi!', text: `Yeni Toplam Net: ${totNet}`, timer: 1800, showConfirmButton: false });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Güncelleme sırasında bir hata oluştu.' });
    }
  };

  const handleToggleRevisedTopic = async (examId, topic) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    const alreadyRevised = (exam.revisedTopics || []).includes(topic);
    try {
      const examRef = doc(db, 'users', currentUser.uid, 'trialExams', examId);
      await updateDoc(examRef, {
        revisedTopics: alreadyRevised ? arrayRemove(topic) : arrayUnion(topic)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFrequentTopic = async (topicId) => {
    const isCompleted = completedTopics.includes(topicId);
    const newList = isCompleted
      ? completedTopics.filter(t => t !== topicId)
      : [...completedTopics, topicId];
    setCompletedTopics(newList);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        completedFrequentTopics: newList
      });
      if (!isCompleted) {
        const topicInfo = FREQUENT_QUESTIONS.find(q => q.id === topicId);
        if (topicInfo) {
          await addDoc(collection(db, 'users', currentUser.uid, 'topicCompletions'), {
            topicId,
            topicTitle: topicInfo.topic,
            category: topicInfo.category,
            exam: topicInfo.exam,
            completedAt: new Date().toISOString(),
            timestamp: serverTimestamp()
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sınav türüne göre ders alanlarını belirle
  const subjectFields = isLgs ? [
    { label: 'Türkçe', keyC: 'turkishCorrect', keyW: 'turkishWrong', net: turkishNet, color: '#10b981', max: 20 },
    { label: 'Matematik', keyC: 'mathCorrect', keyW: 'mathWrong', net: mathNet, color: '#6366f1', max: 20 },
    { label: 'Fen Bilimleri', keyC: 'scienceCorrect', keyW: 'scienceWrong', net: scienceNet, color: '#f59e0b', max: 20 },
    { label: 'İnkılap Tarihi', keyC: 'inkilapCorrect', keyW: 'inkilapWrong', net: inkilapNet, color: '#ef4444', max: 10 },
    { label: 'İngilizce', keyC: 'englishCorrect', keyW: 'englishWrong', net: englishNet, color: '#3b82f6', max: 10 },
    { label: 'Din Kültürü', keyC: 'dinCorrect', keyW: 'dinWrong', net: dinNet, color: '#8b5cf6', max: 10 },
  ] : [
    { label: 'Matematik', keyC: 'mathCorrect', keyW: 'mathWrong', net: mathNet, color: '#6366f1', max: 40 },
    { label: 'Türkçe', keyC: 'turkishCorrect', keyW: 'turkishWrong', net: turkishNet, color: '#10b981', max: 40 },
    { label: 'Fen Bilimleri', keyC: 'scienceCorrect', keyW: 'scienceWrong', net: scienceNet, color: '#f59e0b', max: 20 },
    { label: 'Sosyal Bilimler', keyC: 'socialCorrect', keyW: 'socialWrong', net: socialNet, color: '#ef4444', max: 20 },
  ];

  // Filtrele: LGS öğrencisine sadece LGS, YKS öğrencisine TYT/AYT göster
  const filteredFrequentQuestions = FREQUENT_QUESTIONS.filter(q => isLgs ? q.exam === 'LGS' : (q.exam === 'TYT' || q.exam === 'AYT'));

  const groupedFrequent = filteredFrequentQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const completedCount = completedTopics.filter(id => filteredFrequentQuestions.some(q => q.id === id)).length;
  const totalTopics = filteredFrequentQuestions.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PenTool size={28} color="#6366f1" /> Deneme Netleri ({examType.toUpperCase()})
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            {isLgs ? 'MEB kuralı gereği 3 yanlış 1 doğruyu götürür.' : 'ÖSYM kuralı gereği 4 yanlış 1 doğruyu götürür.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.35rem', borderRadius: 14, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          {[
            { id: 'add', label: '+ Yeni Deneme Ekle', icon: <Plus size={16} /> },
            { id: 'history', label: 'Geçmiş Denemeler', icon: <ClipboardList size={16} /> },
            { id: 'frequent', label: 'Sık Çıkan Konular', icon: <Star size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700,
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99,102,241,0.25)' : 'none'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ---- YENİ DENEME EKLE ---- */}
        {activeTab === 'add' && (
          <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="card glass-panel" style={{ alignSelf: 'start', padding: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem', color: '#1e293b' }}>
                  <Plus size={20} color="#6366f1" /> Yeni {examType.toUpperCase()} Denemesi Ekle
                </h3>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Deneme Adı & Yayın</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={isLgs ? "Örn: Özdebir LGS Deneme 1" : "Örn: Özdebir TYT Deneme 1"}
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ marginTop: '0.4rem' }}
                  />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: isLgs ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                  {subjectFields.map(({ label, keyC, keyW, net, color, max }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: `1.5px solid ${color}30`,
                      borderRadius: 14,
                      padding: '1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color }}>{label}</span>
                        <span style={{
                          background: `${color}15`, color, padding: '0.2rem 0.6rem',
                          borderRadius: 6, fontSize: '0.85rem', fontWeight: 800
                        }}>
                          {net.toFixed(2)} Net
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>✅ Doğru ({max} soru)</label>
                          <input
                            type="number" min="0" max={max}
                            className="input-field"
                            placeholder="0"
                            value={formData[keyC]}
                            onChange={e => setFormData({ ...formData, [keyC]: e.target.value })}
                            style={{ marginTop: '0.25rem', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>❌ Yanlış</label>
                          <input
                            type="number" min="0" max={max}
                            className="input-field"
                            placeholder="0"
                            value={formData[keyW]}
                            onChange={e => setFormData({ ...formData, [keyW]: e.target.value })}
                            style={{ marginTop: '0.25rem', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ marginTop: '1.5rem', width: '100%', fontSize: '1rem', padding: '0.9rem', background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 800 }}
                  disabled={!formData.title}
                >
                  <CheckCircle size={18} /> Denemeyi Kaydet ({totalNet.toFixed(2)} Net)
                </button>
              </div>

              {/* Preview */}
              <div className="card glass-panel" style={{ alignSelf: 'start', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem', color: '#1e293b' }}>📊 Anlık Net Dağılım Önizlemesi</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {subjectFields.map(({ label, net, color, max }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                        <span style={{ color, fontWeight: 700 }}>{label}</span>
                        <span style={{ fontWeight: 800, color: '#334155' }}>{net.toFixed(2)} / {max}</span>
                      </div>
                      <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <motion.div
                          animate={{ width: `${Math.min(100, Math.max(0, (net / max) * 100))}%` }}
                          style={{ height: '100%', background: color, borderRadius: 5 }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  ))}

                  <div style={{
                    marginTop: '1.5rem', padding: '1.75rem',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: 20, textAlign: 'center', boxShadow: '0 10px 30px rgba(99,102,241,0.3)'
                  }}>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 700 }}>TOPLAM HESAPLANAN NET</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '3.5rem', fontWeight: 900, color: 'white' }}>
                      {totalNet.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {isLgs ? '90 Soru Üzerinden (LGS / 3 Yanlış 1 Doğru)' : '120 Soru Üzerinden (TYT / 4 Yanlış 1 Doğru)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- GEÇMİŞ DENEMELER ---- */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: '#1e293b' }}>📋 Geçmiş {examType.toUpperCase()} Denemeleri & Analizi</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : exams.length === 0 ? (
                  <p className="text-muted" style={{ textAlign: 'center', padding: '3rem', fontSize: '1rem' }}>
                    Henüz bir deneme kaydetmediniz. Hemen "+ Yeni Deneme Ekle" sekmesinden ilk denemenizi girin!
                  </p>
                ) : exams.map(exam => {
                  const examIsLgs = exam.examType === 'lgs' || exam.inkilap !== undefined || exam.english !== undefined;
                  const eSubjects = examIsLgs ? [
                    { label: 'Tür', val: exam.turkish, color: '#10b981', keyC: 'turkishCorrect', keyW: 'turkishWrong' },
                    { label: 'Mat', val: exam.math, color: '#6366f1', keyC: 'mathCorrect', keyW: 'mathWrong' },
                    { label: 'Fen', val: exam.science, color: '#f59e0b', keyC: 'scienceCorrect', keyW: 'scienceWrong' },
                    { label: 'İnk', val: exam.inkilap, color: '#ef4444', keyC: 'inkilapCorrect', keyW: 'inkilapWrong' },
                    { label: 'İng', val: exam.english, color: '#3b82f6', keyC: 'englishCorrect', keyW: 'englishWrong' },
                    { label: 'Din', val: exam.din, color: '#8b5cf6', keyC: 'dinCorrect', keyW: 'dinWrong' },
                  ] : [
                    { label: 'Mat', val: exam.math, color: '#6366f1', keyC: 'mathCorrect', keyW: 'mathWrong' },
                    { label: 'Tür', val: exam.turkish, color: '#10b981', keyC: 'turkishCorrect', keyW: 'turkishWrong' },
                    { label: 'Fen', val: exam.science, color: '#f59e0b', keyC: 'scienceCorrect', keyW: 'scienceWrong' },
                    { label: 'Sos', val: exam.social, color: '#ef4444', keyC: 'socialCorrect', keyW: 'socialWrong' },
                  ];

                  return (
                    <div key={exam.id} style={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      {editingExamId === exam.id ? (
                        /* Edit Mode */
                        <div style={{ padding: '1.5rem', background: '#f8fafc' }}>
                          <h4 style={{ color: '#d97706', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            ✏️ Deneme Düzenleniyor ({examIsLgs ? 'LGS' : 'YKS'})
                          </h4>
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Deneme Adı</label>
                            <input type="text" className="input-field" value={editFormData.title}
                              onChange={e => setEditFormData(p => ({ ...p, title: e.target.value }))}
                              style={{ marginTop: '0.3rem' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: examIsLgs ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {eSubjects.map(({ label, keyC, keyW, color }) => (
                              <div key={label} style={{ background: `${color}10`, border: `1.5px solid ${color}30`, borderRadius: 12, padding: '0.85rem' }}>
                                <p style={{ margin: '0 0 0.5rem', fontWeight: 800, color, fontSize: '0.85rem' }}>{label}</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <input type="number" min="0" className="input-field" placeholder="D" value={editFormData[keyC]}
                                    onChange={e => setEditFormData(p => ({ ...p, [keyC]: e.target.value }))}
                                    style={{ fontSize: '0.85rem', padding: '0.4rem', textAlign: 'center', fontWeight: 700 }} />
                                  <input type="number" min="0" className="input-field" placeholder="Y" value={editFormData[keyW]}
                                    onChange={e => setEditFormData(p => ({ ...p, [keyW]: e.target.value }))}
                                    style={{ fontSize: '0.85rem', padding: '0.4rem', textAlign: 'center', fontWeight: 700 }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-primary" onClick={() => handleUpdateExam(exam.id)} style={{ flex: 1, background: '#10b981' }}>✅ Güncelle ve Kaydet</button>
                            <button className="btn btn-secondary" onClick={() => setEditingExamId(null)} style={{ flex: 1 }}>İptal</button>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '1.25rem 1.5rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            cursor: 'pointer', flexWrap: 'wrap', gap: '1rem'
                          }}
                          onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 800 }}>{exam.title}</h4>
                              <span style={{ background: examIsLgs ? '#fef3c7' : '#e0e7ff', color: examIsLgs ? '#d97706' : '#4f46e5', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>
                                {examIsLgs ? 'LGS' : 'YKS'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{exam.date}</span>
                            {exam.updatedAt && <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '0.6rem', fontWeight: 700 }}>✏️ Düzenlendi</span>}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1.2rem', textAlign: 'center' }}>
                              {eSubjects.map(({ label, val, color }) => (
                                <div key={label}>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
                                  <br />
                                  <strong style={{ color, fontSize: '1rem' }}>{val || 0}</strong>
                                </div>
                              ))}
                            </div>
                            <div style={{ textAlign: 'right', minWidth: 80, borderLeft: '1px solid #f1f5f9', paddingLeft: '1.2rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOPLAM NET</span>
                              <br />
                              <strong style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 900 }}>{exam.total}</strong>
                            </div>
                            <button
                              className="btn btn-secondary"
                              style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f8fafc' }}
                              onClick={e => { e.stopPropagation(); handleEditExam(exam); setExpandedExam(null); }}
                            >
                              ✏️ Düzenle
                            </button>
                            {expandedExam === exam.id ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                          </div>
                        </div>
                      )}

                      {/* Expanded: Revize Edilecek Konular */}
                      <AnimatePresence>
                        {expandedExam === exam.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}
                          >
                            <div style={{ padding: '1.5rem' }}>
                              <h5 style={{ margin: '0 0 0.5rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                                <RotateCcw size={16} color="#6366f1" /> Bu Denemeden Çıkarılan Eksik / Revize Edilecek Konular
                              </h5>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem' }}>
                                Yanlış yaptığınız veya tekrar etmeniz gereken konuları işaretleyin.
                              </p>

                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {filteredFrequentQuestions.map(q => {
                                  const isRevised = (exam.revisedTopics || []).includes(q.topic);
                                  return (
                                    <button
                                      key={q.id}
                                      onClick={() => handleToggleRevisedTopic(exam.id, q.topic)}
                                      style={{
                                        padding: '0.4rem 0.85rem', borderRadius: 20, fontSize: '0.8rem',
                                        cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700,
                                        border: `1.5px solid ${isRevised ? '#6366f1' : '#cbd5e1'}`,
                                        background: isRevised ? 'rgba(99,102,241,0.15)' : 'white',
                                        color: isRevised ? '#4338ca' : '#475569',
                                        display: 'flex', alignItems: 'center', gap: '0.35rem'
                                      }}
                                    >
                                      <span>{q.topic} ({q.category})</span>
                                      {isRevised && <CheckCircle size={14} color="#6366f1" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- SIK ÇIKAN KONULAR ---- */}
        {activeTab === 'frequent' && (
          <motion.div key="frequent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>⭐ {examType.toUpperCase()} Sınavında En Çok Çıkan Konular</h3>
                  <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    Tamamlama: {completedCount} / {totalTopics} konu
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  padding: '0.6rem 1.25rem', borderRadius: 20, color: 'white', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                }}>
                  <Flame size={18} /> İlerleme: %{Math.round((completedCount / (totalTopics || 1)) * 100)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {Object.entries(groupedFrequent).map(([category, questions]) => {
                  const color = categoryColors[category] || '#6366f1';
                  const catCompleted = questions.filter(q => completedTopics.includes(q.id)).length;

                  return (
                    <div key={category} style={{
                      background: 'white', border: `1.5px solid ${color}30`,
                      borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, color, fontWeight: 800 }}>{category}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{catCompleted} / {questions.length}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {questions.map(q => {
                          const isDone = completedTopics.includes(q.id);
                          return (
                            <div
                              key={q.id}
                              onClick={() => handleToggleFrequentTopic(q.id)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                                background: isDone ? 'rgba(16,185,129,0.08)' : '#f8fafc',
                                border: `1px solid ${isDone ? '#10b981' : '#e2e8f0'}`,
                                transition: 'all 0.2s'
                              }}
                            >
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isDone ? '#065f46' : '#334155', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {q.topic}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#e0e7ff', color: '#4f46e5', padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                                  {q.exam}
                                </span>
                                {isDone ? <CheckCircle size={18} color="#10b981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #cbd5e1' }} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default TrialExams;
