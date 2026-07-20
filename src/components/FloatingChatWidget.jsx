import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, CheckCheck, Smile, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, where, limit, getDoc, doc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const FloatingChatWidget = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Öğrenci ise koçunu bul, koç ise öğrencilerini listele
  useEffect(() => {
    if (!currentUser) return;

    if (userRole === 'coach') {
      const q = query(collection(db, 'users'), where('role', '==', 'student'), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setStudents(list);
        if (list.length > 0 && !selectedUser) {
          setSelectedUser(list[0]);
        }
      });
      return () => unsubscribe();
    } else {
      const fallbackCoach = () => {
        const q = query(collection(db, 'users'), where('role', '==', 'coach'), limit(1));
        onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const firstCoach = snapshot.docs[0];
            setSelectedUser({ id: firstCoach.id, name: firstCoach.data().name || 'Uzman Koç', ...firstCoach.data() });
          } else {
            setSelectedUser({ id: 'coach_default', name: 'Uzman Koç' });
          }
        });
      };

      getDoc(doc(db, 'users', currentUser.uid)).then(docSnap => {
        if (docSnap.exists() && docSnap.data().coachId) {
          getDoc(doc(db, 'users', docSnap.data().coachId)).then(coachSnap => {
            if (coachSnap.exists()) {
              setSelectedUser({ id: coachSnap.id, name: coachSnap.data().name || 'Uzman Koç', ...coachSnap.data() });
            } else {
              fallbackCoach();
            }
          });
        } else {
          fallbackCoach();
        }
      });
    }
  }, [currentUser, userRole]);

  // Mesajları Dinle (WhatsApp / Facebook Akışı)
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (userRole === 'student') {
          if (data.senderId === currentUser.uid || data.receiverId === currentUser.uid) {
            msgs.push({ id: docSnap.id, ...data });
          }
        } else {
          if (
            data.senderId === selectedUser.id ||
            data.receiverId === selectedUser.id ||
            (data.senderId === currentUser.uid && data.receiverId === selectedUser.id) ||
            (data.senderId === selectedUser.id && data.receiverId === currentUser.uid)
          ) {
            msgs.push({ id: docSnap.id, ...data });
          }
        }
      });
      setMessages(msgs.reverse());
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser, userRole]);

  // Otomatik aşağı kaydır
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [messages, isOpen, selectedUser]);

  // Yazma efekti simülasyonu
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !selectedUser) return;

    const text = input;
    setInput('');
    setIsTyping(false);

    let targetReceiverId = selectedUser.id;
    if (userRole === 'student' && messages.length > 0) {
      const lastCoachMsg = [...messages].reverse().find(m => (m.senderRole === 'coach' || m.senderId !== currentUser.uid) && m.senderId);
      if (lastCoachMsg?.senderId) targetReceiverId = lastCoachMsg.senderId;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        text: text,
        senderId: currentUser.uid,
        receiverId: targetReceiverId,
        senderRole: userRole,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Mesaj gönderilemedi", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999999, fontFamily: 'Outfit, -apple-system, sans-serif' }}>
      
      {/* Facebook Messenger Tarzı Yüzen Balon Buton */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: 62, height: 62, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00a884, #128c7e)',
              border: '3px solid white',
              boxShadow: '0 8px 30px rgba(0, 168, 132, 0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer', position: 'relative'
            }}
          >
            <MessageCircle size={30} fill="white" />
            {/* Çevrimiçi / Bildirim Rozeti */}
            <span style={{
              position: 'absolute', top: 2, right: 2, width: 14, height: 14,
              borderRadius: '50%', background: '#25d366', border: '2px solid white',
              animation: 'pulse 2s infinite'
            }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Facebook Tarzı Küçük Blok - WhatsApp Temalı Sohbet Penceresi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            style={{
              width: '90vw', maxWidth: 380, height: isMinimized ? 64 : 540,
              background: '#efeae2',
              borderRadius: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: '1.5px solid rgba(0, 168, 132, 0.3)',
              position: 'relative'
            }}
          >
            {/* WhatsApp Header (Koyu Yeşil Şık Bar) */}
            <div style={{
              background: 'linear-gradient(135deg, #075e54, #008069)',
              padding: '0.85rem 1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {userRole === 'coach' && students.length > 1 ? (
                  <select
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const found = students.find(s => s.id === e.target.value);
                      if (found) setSelectedUser(found);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 10, padding: '0.35rem 0.6rem', fontSize: '0.85rem', fontWeight: 700, outline: 'none'
                    }}
                  >
                    {students.map(s => <option key={s.id} value={s.id} style={{color:'#0f172a'}}>{s.name || s.email}</option>)}
                  </select>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#25d366',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: '1.1rem', color: '#075e54', border: '2px solid rgba(255,255,255,0.8)',
                      position: 'relative'
                    }}>
                      {(selectedUser?.name || 'K').charAt(0).toUpperCase()}
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '1.5px solid white' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.01em' }}>
                        {selectedUser?.name || 'Uzman Koç'}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        {isTyping ? (
                          <span style={{ color: '#86efac', fontWeight: 800 }}>Yazıyor...</span>
                        ) : (
                          <>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                            Çevrimiçi (WhatsApp Temalı)
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button 
                  onClick={() => navigate('/messages')} 
                  title="Tam Ekran Aç"
                  style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '0.4rem', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Sparkles size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '0.4rem', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* WhatsApp Duvar Kağıdı Deseni ve Sohbet Alanı */}
            {!isMinimized && (
              <div style={{
                flex: 1, overflowY: 'auto', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                background: '#efeae2',
                backgroundImage: `radial-gradient(#cac4ba 1px, transparent 1px), radial-gradient(#cac4ba 1px, #efeae2 1px)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}>
                <div style={{
                  alignSelf: 'center', background: 'rgba(225, 245, 254, 0.9)', color: '#0288d1',
                  padding: '0.35rem 0.85rem', borderRadius: 12, fontSize: '0.74rem', fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)', border: '1px solid #b3e5fc', textAlign: 'center'
                }}>
                  🔒 Mesajlarınız EduKoç PRO & WhatsApp uçtan uca şifreleme konsepti ile korunur.
                </div>

                {messages.length === 0 && (
                  <div style={{ margin: 'auto', textAlign: 'center', color: '#667781', fontSize: '0.88rem', fontWeight: 600 }}>
                    Henüz mesaj yok. Hemen bir mesaj gönderin! 👋
                  </div>
                )}

                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.uid;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        background: isMine ? '#d9fdd3' : '#ffffff',
                        color: '#0f172a',
                        padding: '0.65rem 0.95rem',
                        borderRadius: 14,
                        borderTopRightRadius: isMine ? 2 : 14,
                        borderTopLeftRadius: !isMine ? 2 : 14,
                        maxWidth: '82%',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        border: isMine ? '2px solid #10b981' : '2px solid #cbd5e1',
                        position: 'relative'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.45, wordBreak: 'break-word', fontWeight: 700, color: '#0f172a' }}>
                        {msg.text}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                          {msg.createdAt ? new Date(msg.createdAt.toMillis()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Az önce'}
                        </span>
                        {isMine && <CheckCheck size={15} color="#10b981" strokeWidth={2.5} />}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Yazma Animasyonu (Typing Animation / 3 zıplayan nokta) */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      alignSelf: 'flex-start', background: '#ffffff', padding: '0.65rem 1rem',
                      borderRadius: 16, borderTopLeftRadius: 2, border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#008069', marginRight: '0.3rem' }}>Yazılıyor</span>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#008069' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#008069' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#008069' }} />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* WhatsApp Input Alt Bar */}
            {!isMinimized && (
              <form onSubmit={handleSend} style={{
                background: '#f0f2f5', padding: '0.65rem 0.8rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                borderTop: '1px solid rgba(0,0,0,0.08)'
              }}>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#54656f', cursor: 'pointer', padding: '0.2rem' }}>
                  <Smile size={22} />
                </button>
                <input
                  type="text"
                  placeholder="Bir mesaj yazın..."
                  value={input}
                  onChange={handleInputChange}
                  style={{
                    flex: 1, padding: '0.65rem 1rem', borderRadius: 20, border: '1px solid #d1d7db',
                    background: '#ffffff', color: '#111b21', fontSize: '0.9rem', outline: 'none',
                    fontWeight: 500
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    width: 42, height: 42, borderRadius: '50%', border: 'none',
                    background: input.trim() ? '#00a884' : '#cbd5e1', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                    boxShadow: input.trim() ? '0 2px 8px rgba(0, 168, 132, 0.4)' : 'none'
                  }}
                >
                  <Send size={18} style={{ marginLeft: 2 }} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatWidget;
