import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const TrialExams = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
    const q = query(examsRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = [];
      snapshot.forEach(doc => {
        examsData.push({ id: doc.id, ...doc.data() });
      });
      setExams(examsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const [formData, setFormData] = useState({ title: '', math: '', turkish: '', science: '', social: '' });

  const handleSave = async () => {
    if(!formData.title || !currentUser) return;
    
    const mathNet = Number(formData.math) || 0;
    const turkishNet = Number(formData.turkish) || 0;
    const scienceNet = Number(formData.science) || 0;
    const socialNet = Number(formData.social) || 0;
    const totalNet = mathNet + turkishNet + scienceNet + socialNet;

    const newExam = {
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      math: mathNet,
      turkish: turkishNet,
      science: scienceNet,
      social: socialNet,
      total: totalNet,
      createdAt: new Date().toISOString()
    };

    try {
      const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
      await addDoc(examsRef, newExam);
      
      setFormData({ title: '', math: '', turkish: '', science: '', social: '' });
      
      Swal.fire({
        icon: 'success',
        title: 'Harika!',
        text: 'Deneme sonucun başarıyla kaydedildi.',
        confirmButtonColor: 'var(--success-color)'
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Sınav kaydedilirken bir hata oluştu.',
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Deneme Netleri</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div className="card glass-panel" style={{ alignSelf: 'start' }}>
          <h3><Plus size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Yeni Deneme Ekle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deneme Adı</label>
              <input type="text" className="input-field" placeholder="Örn: Özdebir TYT 1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Matematik (Net)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.math} onChange={e => setFormData({...formData, math: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Türkçe (Net)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.turkish} onChange={e => setFormData({...formData, turkish: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fen Bilimleri (Net)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.science} onChange={e => setFormData({...formData, science: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sosyal Bilimler (Net)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.social} onChange={e => setFormData({...formData, social: e.target.value})} />
              </div>
            </div>
            <button className="btn btn-success" onClick={handleSave} style={{ marginTop: '1rem', width: '100%' }}>Kaydet</button>
          </div>
        </div>

        {/* List */}
        <div className="card glass-panel">
          <h3>Geçmiş Denemeler</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? <p>Yükleniyor...</p> : exams.length === 0 ? <p className="text-muted">Henüz bir deneme kaydetmedin.</p> : exams.map(exam => (
                <div key={exam.id} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)',
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{exam.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exam.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
                    <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mat</span><br/><strong>{exam.math}</strong></div>
                    <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tür</span><br/><strong>{exam.turkish}</strong></div>
                    <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fen</span><br/><strong>{exam.science}</strong></div>
                    <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sos</span><br/><strong>{exam.social}</strong></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam Net</span><br/>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--success-color)' }}>{exam.total}</strong>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrialExams;
