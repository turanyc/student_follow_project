import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, User, ArrowLeft, Check, CheckCheck, Smile, 
  Paperclip, Phone, Video, MoreVertical, Search, ShieldCheck, 
  MessageCircle, Sparkles, Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, where, limit, getDoc, doc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Messages = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'chat'
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Öğrenci veya Koç Listesini Yükle
  useEffect(() => {
    if (!currentUser) return;

    if (userRole === 'coach') {
      const q = query(collection(db, 'users'), where('role', '==', 'student'), limit(100));
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

  // Mesajları Dinle (WhatsApp & Facebook Akışı)
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(200));
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Ben yazarken typing animasyonu çıkmasın! (Sadece input güncellenir)
  const handleInputChange = (e) => {
    setInput(e.target.value);
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

      // Eğer karşı taraf canlı olarak sekmedeyse veya yanıt verecekse (Simülasyon/Canlı akış), 
      // karşı taraf yazıyor hissi için kısa bir süre karşı tarafın typing animasyonunu aktif edebiliriz:
      if (selectedUser.id !== currentUser.uid) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
          }, 3500);
        }, 1200);
      }
    } catch (error) {
      console.error("Mesaj gönderilemedi", error);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Mesaj gönderilirken bir hata oluştu.',
        confirmButtonColor: '#1e7796'
      });
    }
  };

  const filteredStudents = students.filter(stud => 
    (stud.name || stud.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', padding: '1rem', background: '#e1e7ec', fontFamily: 'Outfit, -apple-system, sans-serif' }}>
      <style>{`
        .wa-container {
          display: flex;
          flex: 1;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05);
        }
        .wa-sidebar {
          width: 340px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        .wa-chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }
        @media (max-width: 768px) {
          .wa-sidebar {
            width: 100% !important;
            display: ${mobileView === 'sidebar' && userRole === 'coach' ? 'flex' : 'none'};
          }
          .wa-chat-area {
            display: ${mobileView === 'chat' || userRole !== 'coach' ? 'flex' : 'none'};
          }
        }
        /* Özel Scrollbar */
        .wa-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .wa-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(30, 119, 150, 0.25);
          border-radius: 4px;
        }
      `}</style>

      {/* Üst Yönlendirme ve Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button 
            onClick={() => {
              if (mobileView === 'chat' && userRole === 'coach') {
                setMobileView('sidebar');
              } else {
                navigate(-1);
              }
            }} 
            style={{
              background: 'white', border: '1px solid #cbd5e1', borderRadius: 12,
              padding: '0.5rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              cursor: 'pointer', fontWeight: 700, color: '#0f172a', transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={18} /> {mobileView === 'chat' && userRole === 'coach' ? 'Kişiler' : 'Geri Dön'}
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              {userRole === 'student' ? 'Koç ile Mesajlaşma (Şifreli İletişim)' : 'Öğrenci Sohbet Paneli'}
            </h1>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              Uçtan uca şifreli, Facebook & WhatsApp konseptli şık koçluk iletişim hattı
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', padding: '0.45rem 0.9rem', borderRadius: 99, border: '1px solid #bae6fd' }}>
          <ShieldCheck size={18} color="#1e7796" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e7796' }}>Menutu Güvenli Hat</span>
        </div>
      </div>

      {/* Ana WhatsApp / Facebook Messenger Konteyner */}
      <div className="wa-container">
        
        {/* Sol Sidebar (Sadece Koçlar İçin Kişi Listesi) */}
        {userRole === 'coach' && (
          <div className="wa-sidebar">
            <div style={{ padding: '1.1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Mesajlar ({students.length})</h3>
                <MessageCircle size={20} color="#1e7796" />
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Öğrenci ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: 12,
                    border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.88rem', outline: 'none', color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <div className="wa-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {filteredStudents.map(stud => {
                const isSelected = selectedUser?.id === stud.id;
                return (
                  <div
                    key={stud.id}
                    onClick={() => {
                      setSelectedUser(stud);
                      setMobileView('chat');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem',
                      padding: '0.85rem 1.1rem', cursor: 'pointer', transition: 'all 0.2s',
                      background: isSelected ? '#f1f5f9' : 'transparent',
                      borderBottom: '1px solid #f1f5f9', position: 'relative'
                    }}
                  >
                    {isSelected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#1e7796' }} />}
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%', background: '#1e7796',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0
                    }}>
                      {(stud.name || stud.email || 'Ö').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stud.name || stud.email?.split('@')[0]}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: '#1e7796', fontWeight: 700 }}>Aktif</span>
                      </div>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        👉 Sohbeti görüntüle
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredStudents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.88rem' }}>
                  Öğrenci bulunamadı.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sağ Sohbet Alanı */}
        <div className="wa-chat-area">
          
          {/* WhatsApp Header Bar (Yeşilsiz, Koçluk Temalı) */}
          <div style={{
            padding: '0.9rem 1.5rem', background: 'linear-gradient(135deg, #0f172a, #1e7796)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: '#ffd48d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0f172a', fontWeight: 900, fontSize: '1.25rem', border: '2px solid white'
              }}>
                {(selectedUser?.name || 'K').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedUser ? (selectedUser.name || selectedUser.email?.split('@')[0]) : 'Koçunuz / Öğrenci'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                  {isTyping ? (
                    <span style={{ color: '#ffd48d', fontWeight: 800 }}>{selectedUser?.name || 'Koç'} yazıyor...</span>
                  ) : (
                    <>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
                      Çevrimiçi (Şifreli Hat)
                    </>
                  )}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '0.5rem', color: 'white', cursor: 'pointer' }}>
                <Phone size={18} />
              </button>
              <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '0.5rem', color: 'white', cursor: 'pointer' }}>
                <Video size={18} />
              </button>
              <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '0.5rem', color: 'white', cursor: 'pointer' }}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Mesaj Akışı ve Duvar Kağıdı Deseni */}
          <div className="wa-scroll" style={{
            flex: 1, overflowY: 'auto', padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}>
            <div style={{
              alignSelf: 'center', background: '#e0f2fe', color: '#0f172a',
              padding: '0.5rem 1.2rem', borderRadius: 12, fontSize: '0.8rem', fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: '1px solid #bae6fd', textAlign: 'center',
              maxWidth: 550
            }}>
              ✨ Bu sohbet, öğrencilerin hedeflerine ulaşmalarını desteklemek amacıyla WhatsApp & Facebook Messenger akışıyla tasarlandı.
            </div>

            {messages.length === 0 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
                Henüz mesaj bulunmuyor. İlk mesajınızı hemen göndererek konuşmayı başlatın! 🚀
              </div>
            )}

            {messages.map((msg) => {
              const isMine = msg.senderId === currentUser.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    background: isMine ? '#e0f2fe' : '#ffffff',
                    color: '#0f172a',
                    padding: '0.75rem 1.15rem',
                    borderRadius: 16,
                    borderTopRightRadius: isMine ? 3 : 16,
                    borderTopLeftRadius: !isMine ? 3 : 16,
                    maxWidth: '72%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: isMine ? '2px solid #1e7796' : '2px solid #cbd5e1',
                    position: 'relative'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.96rem', lineHeight: 1.5, wordBreak: 'break-word', fontWeight: 700, color: '#0f172a' }}>
                    {msg.text}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                      {msg.createdAt ? new Date(msg.createdAt.toMillis()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Az önce'}
                    </span>
                    {isMine && <CheckCheck size={16} color="#1e7796" strokeWidth={2.5} />}
                  </div>
                </motion.div>
              );
            })}

            {/* Yazma Animasyonu (Sadece karşı taraf yazarken çalışır) */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  alignSelf: 'flex-start', background: '#ffffff', padding: '0.75rem 1.25rem',
                  borderRadius: 18, borderTopLeftRadius: 3, border: '1.5px solid #1e7796',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '0.45rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e7796', marginRight: '0.4rem' }}>
                  {selectedUser?.name || 'Koç'} yazıyor
                </span>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1e7796' }} />
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1e7796' }} />
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1e7796' }} />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp / Facebook Input Bar */}
          <form onSubmit={handleSend} style={{
            padding: '0.85rem 1.25rem', background: '#f1f5f9', borderTop: '1px solid rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <button type="button" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem' }}>
              <Smile size={24} />
            </button>
            <button type="button" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem' }}>
              <Paperclip size={22} />
            </button>
            
            <input
              type="text"
              placeholder="Bir mesaj yazın..."
              value={input}
              onChange={handleInputChange}
              style={{
                flex: 1, padding: '0.75rem 1.25rem', borderRadius: 24, border: '1px solid #cbd5e1',
                background: '#ffffff', color: '#0f172a', fontSize: '0.95rem', outline: 'none',
                fontWeight: 600, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
              }}
              disabled={!selectedUser}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!selectedUser || !input.trim()}
              style={{
                width: 46, height: 46, borderRadius: '50%', border: 'none',
                background: input.trim() ? 'linear-gradient(135deg, #1e7796, #0f172a)' : '#cbd5e1',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                boxShadow: input.trim() ? '0 4px 14px rgba(30, 119, 150, 0.45)' : 'none'
              }}
            >
              <Send size={20} style={{ marginLeft: 2 }} />
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Messages;
