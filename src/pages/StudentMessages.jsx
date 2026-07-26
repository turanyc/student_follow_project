import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, UserCheck, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc
} from 'firebase/firestore';

const StudentMessages = () => {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [coachInfo, setCoachInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch coach info if assigned
  useEffect(() => {
    const fetchCoach = async () => {
      if (!userData?.coachId) {
        setLoading(false);
        return;
      }
      try {
        const coachDoc = await getDoc(doc(db, 'users', userData.coachId));
        if (coachDoc.exists()) {
          setCoachInfo({ id: coachDoc.id, ...coachDoc.data() });
        }
      } catch (err) {
        console.warn('Coach fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [userData?.coachId]);

  // Listen to messages between student and coach in real-time
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'messages'),
      where('receiverId', 'in', [currentUser.uid, userData?.coachId || 'coach']),
      orderBy('createdAt', 'asc')
    );

    // Fallback: search messages where senderId or receiverId matches currentUser
    const qAll = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(qAll, (snap) => {
      const allMsgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filter for this student and their coach
      const relevant = allMsgs.filter(m => 
        (m.senderId === currentUser.uid) || (m.receiverId === currentUser.uid)
      );
      setMessages(relevant);
      setLoading(false);
    }, (err) => {
      console.warn('Chat snapshot error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, userData?.coachId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;
    const text = inputText.trim();
    setInputText('');

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: currentUser.uid,
        senderName: userData?.name || currentUser.displayName || 'Öğrenci',
        receiverId: userData?.coachId || 'coach',
        senderRole: 'student',
        createdAt: serverTimestamp()
      });

      // Send notification to coach if coachId exists
      if (userData?.coachId) {
        await addDoc(collection(db, 'notifications'), {
          userId: userData.coachId,
          userName: userData?.name || 'Öğrenci',
          message: `💬 ${userData?.name || 'Öğrenci'}: "${text}"`,
          isRead: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '100%', maxWidth: '1000px', margin: '0 auto',
        fontFamily: "'Outfit', sans-serif", paddingBottom: '2rem'
      }}
    >
      {/* Üst Kart */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: 22, padding: '1.5rem 2rem', color: 'white',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.3)', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#c7d2fe', marginBottom: '0.6rem' }}>
            <Sparkles size={14} color="#818cf8" /> Canlı Koç Mesajlaşma Hattı
          </div>
          <h1 style={{ margin: '0 0 0.3rem 0', fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>
            Mesajlarım & Koç Sohbeti 💬
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#c7d2fe' }}>
            Koçunuzun gönderdiği tavsiyeleri görün ve anlık mesajlaşın.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'white' }}>
            👨‍🏫
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>Atanmış Koçunuz</span>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#38bdf8' }}>
              {coachInfo?.name || 'Menutu Koçluk Ekibi'}
            </p>
          </div>
        </div>
      </div>

      {/* Mesajlaşma Kutu Alanı */}
      <div style={{
        background: '#ffffff', borderRadius: 22, border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '580px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Mesaj Listesi */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem', background: '#f8fafc' }}>
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b' }}>
              <MessageSquare size={44} color="#94a3b8" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>Henüz Mesajlaşma Başlamadı</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Koçunuza ilk mesajınızı aşağıdan yazarak sohbeti başlatabilirsiniz.</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === currentUser.uid;
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', marginBottom: '0.2rem', padding: '0 0.3rem' }}>
                    {isMine ? 'Siz' : coachInfo?.name || 'Koçunuz'}
                  </span>
                  <div style={{
                    padding: '0.85rem 1.15rem', borderRadius: 16,
                    borderTopRightRadius: isMine ? 4 : 16,
                    borderTopLeftRadius: isMine ? 16 : 4,
                    background: isMine ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#ffffff',
                    color: isMine ? '#ffffff' : '#0f172a',
                    border: isMine ? 'none' : '1px solid #cbd5e1',
                    fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.45,
                    boxShadow: isMine ? '0 4px 14px rgba(99,102,241,0.25)' : '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem', padding: '0 0.3rem' }}>
                    {msg.createdAt?.toMillis ? new Date(msg.createdAt.toMillis()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Şimdi'}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Barı */}
        <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.25rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Koçunuza bir mesaj yazın..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{
              flex: 1, padding: '0.8rem 1.1rem', borderRadius: 14, border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem', fontWeight: 600, outline: 'none', background: '#f8fafc'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              padding: '0.8rem 1.4rem', borderRadius: 14, border: 'none',
              background: inputText.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e2e8f0',
              color: inputText.trim() ? 'white' : '#94a3b8', fontWeight: 800, fontSize: '0.9rem',
              cursor: inputText.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <Send size={16} /> Gönder
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default StudentMessages;
