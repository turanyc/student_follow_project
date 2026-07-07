import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, Plus, Trash2, Check, Star, ChevronRight, Award, Calendar, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, updateDoc, query, orderBy, serverTimestamp, increment
} from 'firebase/firestore';
import Swal from 'sweetalert2';

const Goals = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [resources, setResources] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [todayCount, setTodayCount] = useState('');
  const [loading, setLoading] = useState(true);

  const lgsSubjects = ['Türkçe', 'Matematik', 'Fen Bilimleri', 'T.C. İnkılap Tarihi ve Atatürkçülük', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi'];
  const yksSubjects = ['TYT Türkçe', 'TYT Matematik', 'TYT Fen Bilimleri', 'TYT Sosyal Bilimler', 'AYT Matematik', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji', 'AYT Edebiyat', 'AYT Tarih', 'AYT Coğrafya'];
  const subjects = userData?.examType === 'lgs' ? lgsSubjects : yksSubjects;

  // New forms state
  const [newGoal, setNewGoal] = useState({ title: '', targetDate: '', description: '' });
  const [newResource, setNewResource] = useState({ name: '', type: 'book', subject: '', targetDate: '' });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState('goals');

  useEffect(() => {
    if (!currentUser) return;

    // User data
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setQuestionCount(data.totalQuestionCount || 0);
        const subList = data.examType === 'lgs' ? lgsSubjects : yksSubjects;
        if (!selectedSubject) setSelectedSubject(subList[0]);
        if (!newResource.subject) setNewResource(prev => ({ ...prev, subject: subList[0] }));
      }
    });

    // Goals
    const goalsRef = collection(db, 'users', currentUser.uid, 'goals');
    const gq = query(goalsRef, orderBy('createdAt', 'desc'));
    const unsubGoals = onSnapshot(gq, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Resources
    const resRef = collection(db, 'users', currentUser.uid, 'resources');
    const rq = query(resRef, orderBy('createdAt', 'desc'));
    const unsubRes = onSnapshot(rq, (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // Solved Questions History
    const sqRef = collection(db, 'users', currentUser.uid, 'solvedQuestions');
    const sqq = query(sqRef, orderBy('createdAt', 'desc'));
    const unsubSq = onSnapshot(sqq, (snap) => {
      setSolvedQuestions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUser(); unsubGoals(); unsubRes(); unsubSq(); };
  }, [currentUser]);

  const handleAddGoal = async () => {
    if (!newGoal.title || !currentUser) return;
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'goals'), {
        ...newGoal,
        completed: false,
        coachAdvice: '',
        createdAt: serverTimestamp()
      });
      setNewGoal({ title: '', targetDate: '', description: '' });
      Swal.fire({ icon: 'success', title: 'Hedef Eklendi!', timer: 1500, showConfirmButton: false });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.name || !currentUser) return;
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'resources'), {
        ...newResource,
        subject: newResource.subject || subjects[0],
        createdAt: serverTimestamp()
      });
      setNewResource({ name: '', type: 'book', subject: subjects[0] || 'Matematik', targetDate: '' });
      Swal.fire({ icon: 'success', title: 'Kaynak Eklendi!', timer: 1500, showConfirmButton: false });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGoal = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'goals', id));
  };

  const handleDeleteResource = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'resources', id));
  };

  const handleToggleGoal = async (id, completed) => {
    await updateDoc(doc(db, 'users', currentUser.uid, 'goals', id), { completed: !completed });
  };

  const handleAddQuestions = async () => {
    const count = Number(todayCount);
    if (!count || count < 1 || !currentUser) return;
    const subj = selectedSubject || subjects[0];
    const today = new Date().toISOString().split('T')[0];
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'solvedQuestions'), {
        subject: subj,
        count: count,
        date: today,
        createdAt: serverTimestamp()
      });
      const newTotal = questionCount + count;
      await updateDoc(doc(db, 'users', currentUser.uid), {
        totalQuestionCount: increment(count)
      });
      setTodayCount('');
      Swal.fire({
        icon: 'success',
        title: `+${count} Soru Eklendi!`,
        text: `${subj} dersinden soru kaydı başarılı! Toplam: ${newTotal} soru 🎉`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSolvedQuestion = async (id, count) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'solvedQuestions', id));
    if (count && questionCount >= count) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        totalQuestionCount: increment(-count)
      });
    }
  };

  const resourceTypeIcon = {
    book: '📚',
    video: '🎥',
    test: '📝',
    online: '💻',
    other: '📌'
  };

  const completedGoals = goals.filter(g => g.completed).length;

  // Calculate subject breakdown
  const subjectTotals = {};
  subjects.forEach(s => { subjectTotals[s] = 0; });
  solvedQuestions.forEach(item => {
    const s = item.subject || 'Diğer';
    subjectTotals[s] = (subjectTotals[s] || 0) + (item.count || 0);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ fontFamily: 'Outfit, sans-serif', paddingBottom: '3rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: 800 }}>
            🎯 Hedeflerim, Kaynaklarım & Soru Takibi
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b' }}>
            {userData?.examType?.toUpperCase() || 'YKS'} müfredatına uygun ders bazlı takip ve planlama.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.35rem', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          {[
            { id: 'goals', label: '🎯 Hedefler' },
            { id: 'resources', label: '📚 Kaynaklar' },
            { id: 'questions', label: '📊 Soru Sayacı' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                padding: '0.55rem 1.2rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeTab === t.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeTab === t.id ? 'white' : '#64748b',
                fontWeight: activeTab === t.id ? 700 : 600, fontSize: '0.9rem',
                boxShadow: activeTab === t.id ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ---- HEDEFLER ---- */}
        {activeTab === 'goals' && (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

              {/* Add Goal Form */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, alignSelf: 'start' }}>
                <h3 style={{ margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 800 }}>
                  <Plus size={20} color="#6366f1" /> Yeni Hedef Belirle
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Hedef Başlığı</label>
                    <input type="text" className="input-field" placeholder="Örn: YKS'de ilk 1000'e gir"
                      value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Açıklama / Detaylar</label>
                    <textarea className="input-field" rows={3} placeholder="Hedefin detayları..." style={{ resize: 'vertical' }}
                      value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Hedef Tarihi</label>
                    <input type="date" className="input-field"
                      value={newGoal.targetDate} onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })} />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddGoal} disabled={!newGoal.title} style={{ marginTop: '0.5rem', fontWeight: 800 }}>
                    Hedefi Kaydet
                  </button>
                </div>
              </div>

              {/* Goals List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>Hedeflerim ({completedGoals}/{goals.length})</h3>
                </div>

                {loading ? <p style={{ color: '#64748b' }}>Yükleniyor...</p> : goals.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 20 }}>
                    <Target size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                    <p style={{ color: '#64748b', fontWeight: 600, margin: 0 }}>Henüz hedef eklemedin. Bir hedef belirle ve çalışmaya başla!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {goals.map(goal => (
                      <div key={goal.id} className="card" style={{
                        padding: '1.25rem 1.5rem', background: 'white',
                        border: '1px solid #e2e8f0', borderRadius: 16,
                        borderLeft: `5px solid ${goal.completed ? '#10b981' : '#6366f1'}`,
                        opacity: goal.completed ? 0.8 : 1, transition: 'all 0.2s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <button
                                onClick={() => handleToggleGoal(goal.id, goal.completed)}
                                style={{
                                  width: 26, height: 26, borderRadius: '50%', border: `2px solid ${goal.completed ? '#10b981' : '#cbd5e1'}`,
                                  background: goal.completed ? '#10b981' : 'transparent',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0, transition: 'all 0.2s'
                                }}
                              >
                                {goal.completed && <Check size={16} color="white" />}
                              </button>
                              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 800, textDecoration: goal.completed ? 'line-through' : 'none' }}>
                                {goal.title}
                              </h4>
                            </div>
                            {goal.description && (
                              <p style={{ margin: '0.5rem 0 0 2.4rem', fontSize: '0.88rem', color: '#64748b' }}>
                                {goal.description}
                              </p>
                            )}
                            {goal.targetDate && (
                              <p style={{ margin: '0.4rem 0 0 2.4rem', fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
                                🗓 Hedef Tarihi: {goal.targetDate}
                              </p>
                            )}
                            {goal.coachAdvice && (
                              <div style={{
                                margin: '0.75rem 0 0 2.4rem', padding: '0.75rem 1rem',
                                background: 'rgba(99,102,241,0.08)', borderRadius: 10,
                                borderLeft: '3px solid #6366f1'
                              }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase' }}>
                                  💬 Koç Tavsiyesi
                                </p>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
                                  {goal.coachAdvice}
                                </p>
                              </div>
                            )}
                          </div>
                          <button onClick={() => handleDeleteGoal(goal.id)} style={{
                            background: 'transparent', border: 'none', color: '#94a3b8',
                            cursor: 'pointer', padding: '0.4rem', borderRadius: 8
                          }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- KAYNAKLAR ---- */}
        {activeTab === 'resources' && (
          <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Add Resource Form */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, alignSelf: 'start' }}>
                <h3 style={{ margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 800 }}>
                  <BookOpen size={20} color="#10b981" /> Yeni Kaynak Ekle
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Hangi Dersten?</label>
                    <select className="input-field" value={newResource.subject} onChange={e => setNewResource({ ...newResource, subject: e.target.value })}>
                      {subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Kaynak Adı</label>
                    <input type="text" className="input-field" placeholder="Örn: 3D TYT Matematik Soru Bankası"
                      value={newResource.name} onChange={e => setNewResource({ ...newResource, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Kaynak Türü</label>
                    <select className="input-field" value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
                      <option value="book">📚 Kitap / Soru Bankası</option>
                      <option value="video">🎥 Video Oynatma Listesi</option>
                      <option value="test">📝 Deneme / Test Seti</option>
                      <option value="online">💻 Online Eğitim Platformu</option>
                      <option value="other">📌 Diğer Kaynaklar</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Bitirme Hedef Tarihi</label>
                    <input type="date" className="input-field"
                      value={newResource.targetDate} onChange={e => setNewResource({ ...newResource, targetDate: e.target.value })} />
                  </div>
                  <button className="btn btn-success" onClick={handleAddResource} disabled={!newResource.name} style={{ marginTop: '0.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    + Kaynağı Kütüphaneme Ekle
                  </button>
                </div>
              </div>

              {/* Resources Grid */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20 }}>
                <h3 style={{ margin: '0 0 1.25rem', color: '#1e293b', fontWeight: 800 }}>Kütüphanem & Kaynaklarım ({resources.length})</h3>
                {resources.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 16 }}>
                    <BookOpen size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                    <p style={{ color: '#64748b', fontWeight: 600, margin: 0 }}>Henüz kaynak eklemedin. Çalıştığın kitap veya videoları buraya ekle!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {resources.map(r => (
                      <div key={r.id} style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16,
                        padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        position: 'relative', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            <span style={{
                              padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800,
                              background: 'rgba(16,185,129,0.15)', color: '#059669'
                            }}>
                              {r.subject || 'Genel'}
                            </span>
                            <button onClick={() => handleDeleteResource(r.id)} style={{
                              background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem'
                            }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{resourceTypeIcon[r.type] || '📚'}</span>
                            <div>
                              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{r.name}</p>
                              <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
                                {r.type === 'book' ? 'Kitap' : r.type === 'video' ? 'Video Ders' : r.type === 'test' ? 'Deneme' : 'Online'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {r.targetDate && (
                          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontSize: '0.75rem', fontWeight: 700 }}>
                            <Calendar size={14} /> Bitirme Hedefi: {r.targetDate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- SORU SAYACI & DERS DAĞILIMI ---- */}
        {activeTab === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            
            {/* Top Stat Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: 'white', borderRadius: 24, textAlign: 'center', boxShadow: '0 10px 25px rgba(79,70,229,0.3)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, margin: 0 }}>
                  TOPLAM ÇÖZÜLEN SORU SAYISI
                </p>
                <p style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0.5rem 0 0', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>
                  {questionCount.toLocaleString('tr-TR')}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>Zirveye doğru adım adım!</p>
              </div>

              {/* Add Question Card */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ margin: '0 0 1rem', color: '#1e293b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={20} color="#10b981" /> Çözülen Soru Kaydı Ekle
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <select className="input-field" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ flex: '1 1 160px', fontWeight: 700 }}>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="number" min="1"
                    className="input-field"
                    placeholder="Soru Sayısı"
                    value={todayCount}
                    onChange={e => setTodayCount(e.target.value)}
                    style={{ flex: '1 1 110px', fontWeight: 700 }}
                  />
                  <button className="btn btn-success" onClick={handleAddQuestions} disabled={!todayCount} style={{ fontWeight: 800, padding: '0.65rem 1.25rem' }}>
                    + Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Breakdown Grid */}
            <div className="card" style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 24, marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: '#1e293b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={22} color="#6366f1" /> Derslere Göre Çözülen Soru Dağılımı ({userData?.examType?.toUpperCase() || 'YKS'})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {subjects.map(subj => {
                  const cnt = subjectTotals[subj] || 0;
                  return (
                    <div key={subj} style={{
                      padding: '1.1rem', background: cnt > 0 ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#f8fafc',
                      border: `1.5px solid ${cnt > 0 ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: 16,
                      textAlign: 'center', transition: 'all 0.2s'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: cnt > 0 ? '#1d4ed8' : '#64748b', fontWeight: 700 }}>
                        {subj}
                      </span>
                      <strong style={{ display: 'block', fontSize: '1.6rem', color: cnt > 0 ? '#1e3a8a' : '#94a3b8', fontWeight: 900, marginTop: '0.35rem', fontFamily: 'monospace' }}>
                        {cnt.toLocaleString('tr-TR')}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>soru çözüldü</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Solved History & Milestones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* History */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20 }}>
                <h3 style={{ margin: '0 0 1.25rem', color: '#1e293b', fontWeight: 800 }}>Son Çözülen Soru Kayıtları</h3>
                {solvedQuestions.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Henüz soru kaydı girmediniz.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {solvedQuestions.slice(0, 25).map(item => (
                      <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9',
                        borderRadius: 12
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ padding: '0.2rem 0.65rem', borderRadius: 12, background: 'rgba(99,102,241,0.12)', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 800 }}>
                            {item.subject}
                          </span>
                          <div>
                            <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>+{item.count} Soru</strong>
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8' }}>{item.date}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteSolvedQuestion(item.id, item.count)} style={{
                          background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem'
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div className="card" style={{ padding: '1.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20 }}>
                <h3 style={{ margin: '0 0 1.25rem', color: '#1e293b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="#f59e0b" /> Soru Çözüm Kilometre Taşları
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {[
                    { label: '🔥 Başlangıç Rütbesi', count: 1000 },
                    { label: '🚀 Amatör Odaklanma', count: 5000 },
                    { label: '⚡ İleri Düzey Çözücü', count: 10000 },
                    { label: '🎯 Soru Uzmanı', count: 25000 },
                    { label: '🏆 Master Soru Canavarı', count: 50000 },
                    { label: '👑 Efsanevi Zirve Savaşçısı', count: 100000 }
                  ].map(({ label, count }) => {
                    const pct = Math.min(100, Math.round((questionCount / count) * 100));
                    const achieved = pct >= 100;
                    return (
                      <div key={label} style={{ padding: '0.75rem 1rem', background: achieved ? '#ecfdf5' : '#f8fafc', border: `1px solid ${achieved ? '#a7f3d0' : '#f1f5f9'}`, borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                          <span style={{ color: achieved ? '#059669' : '#334155' }}>
                            {achieved ? '✅ ' : ''}{label}
                          </span>
                          <span style={{ color: '#64748b' }}>{questionCount.toLocaleString('tr-TR')} / {count.toLocaleString('tr-TR')}</span>
                        </div>
                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            style={{ height: '100%', background: achieved ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #6366f1, #4f46e5)', borderRadius: 4 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default Goals;
