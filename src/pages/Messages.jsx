import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Messages = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // The person being chatted with
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Koç isen öğrencilerini çek, Öğrenci isen direkt koçunu ayarla
  useEffect(() => {
    if (!currentUser || !userRole) return;

    if (userRole === 'coach') {
      // Tek koç olduğu için tüm öğrencileri çek
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const studs = [];
        snapshot.forEach(doc => studs.push({ id: doc.id, ...doc.data() }));
        setStudents(studs);
        if (studs.length > 0 && !selectedUser) setSelectedUser(studs[0]);
      });
      return () => unsubscribe();
    } else if (userRole === 'student') {
      // Öğrenci, koçunun ID'sini kendi verisinden bulmalı
      getDoc(doc(db, 'users', currentUser.uid)).then(docSnap => {
        if (docSnap.exists() && docSnap.data().coachId) {
          setSelectedUser({ id: docSnap.data().coachId, name: 'Koç' });
        }
      });
    }
  }, [currentUser, userRole]);

  // Seçili kullanıcıya göre mesajları çek
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    // Mesajları her iki tarafa göre filtrele (senderId veya receiverId eşleşmeli)
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          (data.senderId === currentUser.uid && data.receiverId === selectedUser.id) ||
          (data.senderId === selectedUser.id && data.receiverId === currentUser.uid)
        ) {
          msgs.push({ id: docSnap.id, ...data });
        }
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !selectedUser) return;
    
    const text = input;
    setInput('');
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: text,
        senderId: currentUser.uid,
        receiverId: selectedUser.id,
        senderRole: userRole,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Mesaj gönderilemedi", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Mesaj gönderilirken bir hata oluştu.',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h2>{userRole === 'student' ? 'Koç ile Mesajlaşma' : 'Öğrencilerle Mesajlaşma'}</h2>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '1rem', overflow: 'hidden' }}>
        
        {/* Coach: Student List Sidebar */}
        {userRole === 'coach' && (
          <div className="card glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>Öğrenciler</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {students.map(stud => (
                <button 
                  key={stud.id} 
                  className={`btn ${selectedUser?.id === stud.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setSelectedUser(stud)}
                >
                  <User size={16} /> {stud.name || stud.email}
                </button>
              ))}
              {students.length === 0 && <p className="text-muted" style={{fontSize:'0.8rem'}}>Öğrenci bulunamadı.</p>}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <strong>{selectedUser ? (userRole === 'coach' ? selectedUser.name : 'Koçunuz') : 'Kişi seçilmedi'}</strong> ile mesajlaşıyorsunuz
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!selectedUser && <div style={{margin: 'auto', color: 'var(--text-muted)'}}>Lütfen mesajlaşmak için bir kişi seçin.</div>}
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUser.uid;
              return (
                <div key={msg.id} style={{
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  backgroundColor: isMine ? 'var(--primary-color)' : 'var(--secondary-color)',
                  color: isMine ? 'white' : 'var(--text-main)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  maxWidth: '70%',
                  borderBottomRightRadius: isMine ? 0 : 'var(--radius-lg)',
                  borderBottomLeftRadius: !isMine ? 0 : 'var(--radius-lg)',
                }}>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                    {msg.createdAt ? new Date(msg.createdAt.toMillis()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color-alt)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Mesajınızı yazın..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1 }}
                disabled={!selectedUser}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} disabled={!selectedUser}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Messages;
