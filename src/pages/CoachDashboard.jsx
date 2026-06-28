import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Video, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const CoachDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [events, setEvents] = useState([]);

  // Yeni Etkinlik Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);

  useEffect(() => {
    // Tüm öğrencileri getir (sistemde tek koç olduğu için hepsini alıyoruz)
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studs = [];
      querySnapshot.forEach((docSnap) => {
        studs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setStudents(studs);
    });

    // Etkinlikleri getir
    const eq = query(collection(db, 'events'), where('coachId', '==', currentUser?.uid || ''), orderBy('date', 'asc'));
    const unsubscribeEvents = onSnapshot(eq, (querySnapshot) => {
      const evts = [];
      querySnapshot.forEach((docSnap) => {
        evts.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEvents(evts);
    });

    return () => {
      unsubscribe();
      unsubscribeEvents();
    };
  }, [currentUser]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    setCreatingEvent(true);

    try {
      await addDoc(collection(db, 'events'), {
        title: newEventTitle,
        date: newEventDate,
        coachId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewEventTitle('');
      setNewEventDate('');
      Swal.fire({
        icon: 'success',
        title: 'Etkinlik Duyuruldu!',
        text: 'Etkinlik tüm öğrencilerinize başarıyla iletildi.',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Etkinlik oluşturulamadı.',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleSendRecommendation = async (studentId) => {
    const recText = recommendations[studentId];
    if (!recText || !recText.trim()) return;

    try {
      await updateDoc(doc(db, 'users', studentId), {
        coachRecommendation: recText
      });
      setRecommendations({ ...recommendations, [studentId]: '' });
      Swal.fire({
        icon: 'success',
        title: 'Tavsiye Gönderildi!',
        text: 'Tavsiyeniz öğrenciye başarıyla iletildi.',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Tavsiye gönderilemedi.',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="card glass-panel" style={{ width: '250px', borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Koç Paneli</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }}><Users size={18} /> Anasayfa</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/messages')}><MessageSquare size={18} /> Özel Mesajlar</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/video-call')}><Video size={18} /> Görüşmeler</button>
        </nav>
        <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', color: 'var(--danger-color)' }} onClick={handleLogout}><LogOut size={18} /> Çıkış Yap</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ marginBottom: '2rem' }}>Öğrenci ve Etkinlik Yönetimi</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Yeni Etkinlik Oluşturma Formu */}
          <div className="card" style={{ border: '1px solid var(--success-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)' }}>
              <Calendar size={20} /> Yeni Etkinlik Duyur
            </h3>
            <form onSubmit={handleCreateEvent} style={{ marginTop: '1rem' }}>
              <div className="input-group">
                <input type="text" required className="input-field" placeholder="Etkinlik Adı (Örn: Matematik Soru Çözümü)" value={newEventTitle} onChange={(e)=>setNewEventTitle(e.target.value)} />
              </div>
              <div className="input-group">
                <input type="datetime-local" required className="input-field" value={newEventDate} onChange={(e)=>setNewEventDate(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-success" disabled={creatingEvent} style={{ width: '100%' }}>
                {creatingEvent ? 'Oluşturuluyor...' : 'Tüm Öğrencilere Duyur'}
              </button>
            </form>
            
            <div style={{ marginTop: '1rem', maxHeight: '100px', overflowY: 'auto' }}>
              <strong style={{ fontSize: '0.8rem' }}>Aktif Etkinlikler:</strong>
              {events.map(ev => (
                <div key={ev.id} style={{ fontSize: '0.8rem', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  {ev.title} ({new Date(ev.date).toLocaleString('tr-TR')})
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '1rem' }}>Öğrencilerim</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {students.length === 0 && <p className="text-muted">Henüz kayıtlı öğrenciniz yok. Yukarıdan oluşturabilirsiniz.</p>}

          {/* Student List */}
          {students.map(student => (
            <div key={student.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{student.name || student.email}</h3>
                <span className={`status-badge ${student.status === 'studying' ? 'status-studying' : 'status-not-studying'}`}>
                  {student.status === 'studying' ? 'Çalışıyor' : 'Çalışmıyor'}
                </span>
              </div>
              
              <div style={{ marginTop: '1.5rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  <strong>Son Çalışma Notu:</strong> <br/>
                  {student.lastNote || <span className="text-muted">Henüz not girilmemiş.</span>}
                </p>
              </div>
              
              {student.coachRecommendation && (
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--primary-color)' }}>
                  <strong>Aktif Tavsiyeniz:</strong> {student.coachRecommendation}
                </p>
              )}
              
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Yeni Tavsiye Ver / Görev Ata:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Örn: Paragraf çözmelisin..." 
                    value={recommendations[student.id] || ''}
                    onChange={(e) => setRecommendations({ ...recommendations, [student.id]: e.target.value })}
                  />
                  <button className="btn btn-primary" onClick={() => handleSendRecommendation(student.id)}>Gönder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
