import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Plus, ClipboardList, RotateCcw, ChevronDown, ChevronUp, Star, Flame, Target, BookOpen, PenTool, CheckSquare } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, updateDoc, arrayUnion, arrayRemove, getDoc, serverTimestamp
} from 'firebase/firestore';
import { getTopicsForExam, groupTopicsBySubject, findSubjectOfTopic } from '../data/curriculumData';

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
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'history' | 'frequent'
  const [expandedExam, setExpandedExam] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [editingExamId, setEditingExamId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [examType, setExamType] = useState('yks'); // 'yks' or 'lgs'
  const [selectedYksCategory, setSelectedYksCategory] = useState('TYT'); // 'TYT' or 'AYT'
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'TYT' | 'AYT'
  const [frequentFilter, setFrequentFilter] = useState('TYT'); // 'TYT' | 'AYT'

  // Form states for adding exam
  const [formData, setFormData] = useState({
    title: '',
    mathCorrect: '', mathWrong: '',
    turkishCorrect: '', turkishWrong: '',
    scienceCorrect: '', scienceWrong: '',
    socialCorrect: '', socialWrong: '',
    inkilapCorrect: '', inkilapWrong: '',
    englishCorrect: '', englishWrong: '',
    dinCorrect: '', dinWrong: '',
    aytMatCorrect: '', aytMatWrong: '',
    fizikCorrect: '', fizikWrong: '',
    kimyaCorrect: '', kimyaWrong: '',
    biyoCorrect: '', biyoWrong: '',
    tdeCorrect: '', tdeWrong: '',
    tar1Correct: '', tar1Wrong: '',
    cog1Correct: '', cog1Wrong: '',
    revisedTopics: []
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

  const aytMatNet = calcNet(formData.aytMatCorrect, formData.aytMatWrong);
  const fizikNet = calcNet(formData.fizikCorrect, formData.fizikWrong);
  const kimyaNet = calcNet(formData.kimyaCorrect, formData.kimyaWrong);
  const biyoNet = calcNet(formData.biyoCorrect, formData.biyoWrong);
  const tdeNet = calcNet(formData.tdeCorrect, formData.tdeWrong);
  const tar1Net = calcNet(formData.tar1Correct, formData.tar1Wrong);
  const cog1Net = calcNet(formData.cog1Correct, formData.cog1Wrong);

  const totalNet = isLgs 
    ? (mathNet + turkishNet + scienceNet + inkilapNet + englishNet + dinNet)
    : selectedYksCategory === 'AYT'
      ? (aytMatNet + fizikNet + kimyaNet + biyoNet + tdeNet + tar1Net + cog1Net)
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
    }, (err) => {
      console.error('Deneme sınavları alınamadı:', err);
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
      examSubType: isLgs ? 'lgs' : selectedYksCategory.toLowerCase(),
      total: parseFloat(totalNet.toFixed(2)),
      math: parseFloat((selectedYksCategory === 'AYT' && !isLgs ? aytMatNet : mathNet).toFixed(2)),
      turkish: parseFloat((selectedYksCategory === 'AYT' && !isLgs ? tdeNet : turkishNet).toFixed(2)),
      science: parseFloat(scienceNet.toFixed(2)),
      social: parseFloat(socialNet.toFixed(2)),
      inkilap: parseFloat(inkilapNet.toFixed(2)),
      english: parseFloat(englishNet.toFixed(2)),
      din: parseFloat(dinNet.toFixed(2)),
      aytMat: parseFloat(aytMatNet.toFixed(2)),
      fizik: parseFloat(fizikNet.toFixed(2)),
      kimya: parseFloat(kimyaNet.toFixed(2)),
      biyoloji: parseFloat(biyoNet.toFixed(2)),
      edebiyat: parseFloat(tdeNet.toFixed(2)),
      tarih1: parseFloat(tar1Net.toFixed(2)),
      cografya1: parseFloat(cog1Net.toFixed(2)),
      mathCorrect: Number(selectedYksCategory === 'AYT' && !isLgs ? formData.aytMatCorrect : formData.mathCorrect) || 0,
      mathWrong: Number(selectedYksCategory === 'AYT' && !isLgs ? formData.aytMatWrong : formData.mathWrong) || 0,
      turkishCorrect: Number(selectedYksCategory === 'AYT' && !isLgs ? formData.tdeCorrect : formData.turkishCorrect) || 0,
      turkishWrong: Number(selectedYksCategory === 'AYT' && !isLgs ? formData.tdeWrong : formData.turkishWrong) || 0,
      scienceCorrect: Number(formData.scienceCorrect) || 0, scienceWrong: Number(formData.scienceWrong) || 0,
      socialCorrect: Number(formData.socialCorrect) || 0, socialWrong: Number(formData.socialWrong) || 0,
      inkilapCorrect: Number(formData.inkilapCorrect) || 0, inkilapWrong: Number(formData.inkilapWrong) || 0,
      englishCorrect: Number(formData.englishCorrect) || 0, englishWrong: Number(formData.englishWrong) || 0,
      dinCorrect: Number(formData.dinCorrect) || 0, dinWrong: Number(formData.dinWrong) || 0,
      aytMatCorrect: Number(formData.aytMatCorrect) || 0, aytMatWrong: Number(formData.aytMatWrong) || 0,
      fizikCorrect: Number(formData.fizikCorrect) || 0, fizikWrong: Number(formData.fizikWrong) || 0,
      kimyaCorrect: Number(formData.kimyaCorrect) || 0, kimyaWrong: Number(formData.kimyaWrong) || 0,
      biyoCorrect: Number(formData.biyoCorrect) || 0, biyoWrong: Number(formData.biyoWrong) || 0,
      tdeCorrect: Number(formData.tdeCorrect) || 0, tdeWrong: Number(formData.tdeWrong) || 0,
      tar1Correct: Number(formData.tar1Correct) || 0, tar1Wrong: Number(formData.tar1Wrong) || 0,
      cog1Correct: Number(formData.cog1Correct) || 0, cog1Wrong: Number(formData.cog1Wrong) || 0,
      revisedTopics: formData.revisedTopics || [],
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
        dinCorrect: '', dinWrong: '',
        aytMatCorrect: '', aytMatWrong: '',
        fizikCorrect: '', fizikWrong: '',
        kimyaCorrect: '', kimyaWrong: '',
        biyoCorrect: '', biyoWrong: '',
        tdeCorrect: '', tdeWrong: '',
        tar1Correct: '', tar1Wrong: '',
        cog1Correct: '', cog1Wrong: '',
        revisedTopics: []
      });

      Swal.fire({
        icon: 'success',
        title: 'Harika!',
        text: `Deneme kaydedildi. (${isLgs ? 'LGS' : selectedYksCategory} - Toplam: ${totalNet.toFixed(2)} Net)`,
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

  const toggleFormRevisedTopic = (topicName) => {
    setFormData(prev => {
      const list = prev.revisedTopics || [];
      const exists = list.includes(topicName);
      return {
        ...prev,
        revisedTopics: exists ? list.filter(t => t !== topicName) : [...list, topicName]
      };
    });
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
  ] : selectedYksCategory === 'AYT' ? [
    { label: 'Matematik (AYT)', keyC: 'aytMatCorrect', keyW: 'aytMatWrong', net: aytMatNet, color: '#6366f1', max: 40 },
    { label: 'Fizik', keyC: 'fizikCorrect', keyW: 'fizikWrong', net: fizikNet, color: '#3b82f6', max: 14 },
    { label: 'Kimya', keyC: 'kimyaCorrect', keyW: 'kimyaWrong', net: kimyaNet, color: '#10b981', max: 13 },
    { label: 'Biyoloji', keyC: 'biyoCorrect', keyW: 'biyoWrong', net: biyoNet, color: '#f59e0b', max: 13 },
    { label: 'Edebiyat', keyC: 'tdeCorrect', keyW: 'tdeWrong', net: tdeNet, color: '#8b5cf6', max: 24 },
    { label: 'Tarih-1', keyC: 'tar1Correct', keyW: 'tar1Wrong', net: tar1Net, color: '#ef4444', max: 10 },
    { label: 'Coğrafya-1', keyC: 'cog1Correct', keyW: 'cog1Wrong', net: cog1Net, color: '#d97706', max: 6 },
  ] : [
    { label: 'Matematik (TYT)', keyC: 'mathCorrect', keyW: 'mathWrong', net: mathNet, color: '#6366f1', max: 40 },
    { label: 'Türkçe (TYT)', keyC: 'turkishCorrect', keyW: 'turkishWrong', net: turkishNet, color: '#10b981', max: 40 },
    { label: 'Fen Bilimleri (TYT)', keyC: 'scienceCorrect', keyW: 'scienceWrong', net: scienceNet, color: '#f59e0b', max: 20 },
    { label: 'Sosyal Bilimler (TYT)', keyC: 'socialCorrect', keyW: 'socialWrong', net: socialNet, color: '#ef4444', max: 20 },
  ];

  // Filtrele: Sadece öğrencinin girdiği sınava ve seçtiği sekmeye göre göster
  const filteredFrequentQuestions = FREQUENT_QUESTIONS.filter(q => {
    if (isLgs) return q.exam === 'LGS';
    return q.exam === frequentFilter;
  });

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
            {/* Sub-exam switcher for YKS students */}
            {!isLgs && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedYksCategory('TYT')}
                  style={{
                    padding: '0.6rem 1.25rem', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    border: selectedYksCategory === 'TYT' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: selectedYksCategory === 'TYT' ? '#6366f1' : 'white',
                    color: selectedYksCategory === 'TYT' ? 'white' : '#64748b',
                    boxShadow: selectedYksCategory === 'TYT' ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  📘 TYT Denemesi (120 Soru)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYksCategory('AYT')}
                  style={{
                    padding: '0.6rem 1.25rem', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    border: selectedYksCategory === 'AYT' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                    background: selectedYksCategory === 'AYT' ? '#8b5cf6' : 'white',
                    color: selectedYksCategory === 'AYT' ? 'white' : '#64748b',
                    boxShadow: selectedYksCategory === 'AYT' ? '0 4px 12px rgba(139,92,241,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  📙 AYT Denemesi (80+ Soru)
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', width: '100%' }}>
                <div className="card glass-panel" style={{ alignSelf: 'start', padding: '1.75rem', width: '100%' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem', color: '#1e293b' }}>
                    <Plus size={20} color="#6366f1" /> Yeni {isLgs ? 'LGS' : selectedYksCategory} Denemesi Ekle
                  </h3>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Deneme Adı & Yayın</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={isLgs ? "Örn: Özdebir LGS Deneme 1" : `Örn: Özdebir ${selectedYksCategory} Deneme 1`}
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
                <div className="card glass-panel" style={{ alignSelf: 'start', padding: '2rem', width: '100%' }}>
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
                        {isLgs ? '90 Soru Üzerinden (LGS / 3 Yanlış 1 Doğru)' : `${selectedYksCategory} Denemesi (4 Yanlış 1 Doğru)`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bu Denemede Tekrar Edilmesi / Çalışılması Gereken Konular Bölümü */}
              <div className="card glass-panel" style={{ width: '100%', padding: '1.75rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem', color: '#1e293b' }}>
                  <CheckSquare size={22} color="#f59e0b" /> Bu Denemede Tekrar Edilmesi / Çalışılması Gereken Konuları İşaretle
                </h3>
                <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                  Deneme analizini yaparken eksik hissettiğin veya yanlış yaptığın konuları buradan seçebilirsin. Seçtiğin konular deneme geçmişine eklenir ve koçun tarafından görülebilir.
                </p>

                {(() => {
                  const grp = isLgs ? 'LGS' : 'YKS';
                  const subTab = isLgs ? 'LGS' : selectedYksCategory;
                  const topics = getTopicsForExam(grp, subTab);
                  const selectedList = formData.revisedTopics || [];

                  if (!topics || topics.length === 0) return <p style={{ color: '#94a3b8' }}>Konular yüklenemedi.</p>;

                  const subjectsMap = {};
                  topics.forEach(t => {
                    const s = t.subject || 'Diğer';
                    if (!subjectsMap[s]) subjectsMap[s] = [];
                    subjectsMap[s].push(t);
                  });

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {Object.entries(subjectsMap).map(([subj, subjTopics]) => {
                        const selectedInSubj = subjTopics.filter(t => selectedList.includes(t.name)).length;
                        return (
                          <div key={subj} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                📚 {subj}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: 10, background: selectedInSubj > 0 ? '#fef3c7' : '#e2e8f0', color: selectedInSubj > 0 ? '#b45309' : '#64748b' }}>
                                {selectedInSubj} / {subjTopics.length} Seçildi
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.55rem' }}>
                              {subjTopics.map(t => {
                                const isSelected = selectedList.includes(t.name);
                                return (
                                  <div
                                    key={t.id}
                                    onClick={() => toggleFormRevisedTopic(t.name)}
                                    style={{
                                      padding: '0.6rem 0.85rem', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                                      background: isSelected ? '#fef3c7' : '#ffffff',
                                      border: `1.5px solid ${isSelected ? '#f59e0b' : '#cbd5e1'}`,
                                      display: 'flex', alignItems: 'center', gap: '0.6rem'
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}}
                                      style={{ cursor: 'pointer', accentColor: '#f59e0b', width: 16, height: 16 }}
                                    />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#b45309' : '#1e293b', wordBreak: 'break-word' }}>
                                      {t.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- GEÇMİŞ DENEMELER ---- */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="card glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>📋 Geçmiş {isLgs ? 'LGS' : 'YKS'} Denemeleri & Analizi</h3>
                
                {!isLgs && (
                  <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 10 }}>
                    {[
                      { id: 'all', label: 'Tümü' },
                      { id: 'TYT', label: 'TYT Denemeleri' },
                      { id: 'AYT', label: 'AYT Denemeleri' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setHistoryFilter(f.id)}
                        style={{
                          padding: '0.35rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: historyFilter === f.id ? '#6366f1' : 'transparent',
                          color: historyFilter === f.id ? 'white' : '#64748b',
                          fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : (() => {
                  // Filter strictly based on examType and sub-filter
                  const filteredExams = exams.filter(e => {
                    const eIsLgs = e.examType === 'lgs' || e.inkilap !== undefined || e.english !== undefined;
                    if (isLgs) return eIsLgs;
                    if (eIsLgs) return false;
                    if (historyFilter === 'all') return true;
                    if (historyFilter === 'TYT') return e.examSubType === 'tyt' || (!e.examSubType && !e.aytMat && !e.fizik);
                    if (historyFilter === 'AYT') return e.examSubType === 'ayt' || e.aytMat !== undefined || e.fizik !== undefined;
                    return true;
                  });

                  if (filteredExams.length === 0) {
                    return (
                      <p className="text-muted" style={{ textAlign: 'center', padding: '3rem', fontSize: '1rem' }}>
                        Bu kategoride henüz bir deneme kaydı yok. "+ Yeni Deneme Ekle" sekmesinden denemenizi ekleyebilirsiniz.
                      </p>
                    );
                  }

                  return filteredExams.map(exam => {
                    const examIsLgs = exam.examType === 'lgs' || exam.inkilap !== undefined || exam.english !== undefined;
                    const examIsAyt = exam.examSubType === 'ayt' || exam.aytMat !== undefined || exam.fizik !== undefined;
                    
                    const eSubjects = examIsLgs ? [
                      { label: 'Tür', val: exam.turkish, color: '#10b981', keyC: 'turkishCorrect', keyW: 'turkishWrong' },
                      { label: 'Mat', val: exam.math, color: '#6366f1', keyC: 'mathCorrect', keyW: 'mathWrong' },
                      { label: 'Fen', val: exam.science, color: '#f59e0b', keyC: 'scienceCorrect', keyW: 'scienceWrong' },
                      { label: 'İnk', val: exam.inkilap, color: '#ef4444', keyC: 'inkilapCorrect', keyW: 'inkilapWrong' },
                      { label: 'İng', val: exam.english, color: '#3b82f6', keyC: 'englishCorrect', keyW: 'englishWrong' },
                      { label: 'Din', val: exam.din, color: '#8b5cf6', keyC: 'dinCorrect', keyW: 'dinWrong' },
                    ] : examIsAyt ? [
                      { label: 'Mat', val: exam.aytMat !== undefined ? exam.aytMat : exam.math, color: '#6366f1', keyC: 'aytMatCorrect', keyW: 'aytMatWrong' },
                      { label: 'Fiz', val: exam.fizik, color: '#3b82f6', keyC: 'fizikCorrect', keyW: 'fizikWrong' },
                      { label: 'Kim', val: exam.kimya, color: '#10b981', keyC: 'kimyaCorrect', keyW: 'kimyaWrong' },
                      { label: 'Biy', val: exam.biyoloji, color: '#f59e0b', keyC: 'biyoCorrect', keyW: 'biyoWrong' },
                      { label: 'Ede', val: exam.edebiyat !== undefined ? exam.edebiyat : exam.turkish, color: '#8b5cf6', keyC: 'tdeCorrect', keyW: 'tdeWrong' },
                      { label: 'Tar', val: exam.tarih1, color: '#ef4444', keyC: 'tar1Correct', keyW: 'tar1Wrong' },
                      { label: 'Coğ', val: exam.cografya1, color: '#d97706', keyC: 'cog1Correct', keyW: 'cog1Wrong' },
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
                          <div style={{ flex: '1 1 auto', minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 800 }}>{exam.title}</h4>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{exam.date}</span>
                            {exam.updatedAt && <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '0.6rem', fontWeight: 700 }}>✏️ Düzenlendi</span>}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', maxWidth: '100%', flex: '1 1 auto', justifyContent: 'flex-end', WebkitOverflowScrolling: 'touch' }}>
                            <div style={{ display: 'flex', gap: '1.2rem', textAlign: 'center', flexShrink: 0 }}>
                              {eSubjects.map(({ label, val, color }) => (
                                <div key={label}>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
                                  <br />
                                  <strong style={{ color, fontSize: '1rem' }}>{val || 0}</strong>
                                </div>
                              ))}
                            </div>
                            <div style={{ textAlign: 'right', minWidth: 90, borderLeft: '1px solid #f1f5f9', paddingLeft: '1.2rem', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOPLAM NET</span>
                              <br />
                              <strong style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 900 }}>{exam.total}</strong>
                            </div>
                            <button
                              className="btn btn-secondary"
                              style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f8fafc', flexShrink: 0 }}
                              onClick={e => { e.stopPropagation(); handleEditExam(exam); setExpandedExam(null); }}
                            >
                              ✏️ Düzenle
                            </button>
                            <div style={{ flexShrink: 0 }}>
                              {expandedExam === exam.id ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                            </div>
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
                                <RotateCcw size={16} color="#6366f1" /> Bu Denemeden Çıkarılan Eksik / Revize Edilecek Konular (Derslere Göre)
                              </h5>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem' }}>
                                Yanlış yaptığınız veya tekrar etmeniz gereken konuları işaretleyin. Koçunuz da bu listeyi ders bazlı görüntüleyecektir.
                              </p>

                              {(() => {
                                const grp = isLgs ? 'LGS' : 'YKS';
                                const subTab = isLgs ? 'LGS' : (exam.examType?.toUpperCase() === 'AYT' ? 'AYT' : 'TYT');
                                const allTopics = getTopicsForExam(grp, subTab);
                                const currentList = exam.revisedTopics || [];
                                
                                // Hem müfredattaki konuları hem de varsa önceden eklenmiş farklı konuları birleştirelim
                                const combinedTopics = [...allTopics];
                                currentList.forEach(tName => {
                                  if (!combinedTopics.some(x => x.name === tName)) {
                                    combinedTopics.push({ id: `custom_${tName}`, name: tName, subject: findSubjectOfTopic(tName) });
                                  }
                                });

                                const subjectsMap = {};
                                combinedTopics.forEach(t => {
                                  const s = t.subject || findSubjectOfTopic(t.name) || 'Diğer';
                                  if (!subjectsMap[s]) subjectsMap[s] = [];
                                  subjectsMap[s].push(t);
                                });

                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Object.entries(subjectsMap).map(([subj, subjTopics]) => {
                                      const selectedInSubj = subjTopics.filter(t => currentList.includes(t.name));
                                      return (
                                        <div key={subj} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>📚 {subj}</span>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 8, background: selectedInSubj.length > 0 ? '#e0e7ff' : '#f1f5f9', color: selectedInSubj.length > 0 ? '#4338ca' : '#64748b' }}>
                                              {selectedInSubj.length} Seçildi
                                            </span>
                                          </div>
                                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                            {subjTopics.map(q => {
                                              const isRevised = currentList.includes(q.name);
                                              return (
                                                <button
                                                  key={q.id || q.name}
                                                  onClick={() => handleToggleRevisedTopic(exam.id, q.name)}
                                                  style={{
                                                    padding: '0.35rem 0.75rem', borderRadius: 16, fontSize: '0.78rem',
                                                    cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700,
                                                    border: `1.5px solid ${isRevised ? '#6366f1' : '#cbd5e1'}`,
                                                    background: isRevised ? 'rgba(99,102,241,0.15)' : '#f8fafc',
                                                    color: isRevised ? '#4338ca' : '#475569',
                                                    display: 'flex', alignItems: 'center', gap: '0.35rem'
                                                  }}
                                                >
                                                  <span>{q.name}</span>
                                                  {isRevised && <CheckCircle size={13} color="#6366f1" />}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                });
              })()}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default TrialExams;
