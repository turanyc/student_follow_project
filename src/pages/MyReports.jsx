import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, TrendingDown, BookOpen, CheckCircle, BarChart2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Analytics from './Analytics';

const TABS = [
  { id: 'trial-reports', label: 'Deneme Raporlarım', icon: FileText },
  { id: 'analytics',     label: 'İstatistik & Analiz', icon: TrendingUp },
];

const MyReports = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trial-reports');
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const examsRef = collection(db, 'users', currentUser.uid, 'trialExams');
    const q = query(examsRef, orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  // ── Analiz: Tüm denemelerdeki revisedTopics'i çapraz analiz et ──
  const analyzeWeakTopics = () => {
    const topicMap = {}; // { topicName: { count, exams: [{ title, date }] } }

    exams.forEach(exam => {
      const topics = exam.revisedTopics || [];
      topics.forEach(topicName => {
        if (!topicMap[topicName]) {
          topicMap[topicName] = { count: 0, exams: [] };
        }
        topicMap[topicName].count += 1;
        topicMap[topicName].exams.push({
          title: exam.title,
          date: exam.date,
          examType: exam.examType || 'yks',
          examSubType: exam.examSubType || 'tyt'
        });
      });
    });

    // Sadece 2+ denemede tekrar edenleri al ve sayıya göre sırala
    const recurring = Object.entries(topicMap)
      .filter(([, data]) => data.count >= 2)
      .sort((a, b) => b[1].count - a[1].count);

    // Tüm konuları (1 kez dahil) de derslere göre grupla
    const allTopics = Object.entries(topicMap)
      .sort((a, b) => b[1].count - a[1].count);

    return { recurring, allTopics, topicMap };
  };

  const { recurring, allTopics } = analyzeWeakTopics();

  // Konuları kategorilere ayır (basit heuristik)
  const categorizeTopics = (topicList) => {
    const categories = {};
    topicList.forEach(([name, data]) => {
      // Basit bir kategorizasyon
      let cat = 'Diğer';
      const lower = name.toLowerCase();
      if (lower.includes('matematik') || lower.includes('sayı') || lower.includes('denklem') || lower.includes('fonksiyon') || lower.includes('geometri') || lower.includes('olasılık') || lower.includes('permütasyon') || lower.includes('kombinasyon') || lower.includes('türev') || lower.includes('integral') || lower.includes('logaritma') || lower.includes('matris') || lower.includes('limit') || lower.includes('polinomlar') || lower.includes('çarpanlar') || lower.includes('üslü') || lower.includes('kareköklü') || lower.includes('oran') || lower.includes('yüzde') || lower.includes('mantık') || lower.includes('kümeler')) {
        cat = 'Matematik';
      } else if (lower.includes('paragraf') || lower.includes('sözcük') || lower.includes('cümle') || lower.includes('anlatım') || lower.includes('noktalama') || lower.includes('yazım') || lower.includes('deyim') || lower.includes('türkçe') || lower.includes('fiil') || lower.includes('edebiyat')) {
        cat = 'Türkçe / Edebiyat';
      } else if (lower.includes('fizik') || lower.includes('kuvvet') || lower.includes('hareket') || lower.includes('elektrik') || lower.includes('optik') || lower.includes('dalga') || lower.includes('enerji') || lower.includes('basınç') || lower.includes('ısı')) {
        cat = 'Fizik';
      } else if (lower.includes('kimya') || lower.includes('tepkime') || lower.includes('mol') || lower.includes('asit') || lower.includes('baz') || lower.includes('element') || lower.includes('periyodik') || lower.includes('karışım')) {
        cat = 'Kimya';
      } else if (lower.includes('biyoloji') || lower.includes('hücre') || lower.includes('dna') || lower.includes('genetik') || lower.includes('ekoloji') || lower.includes('solunum') || lower.includes('fotosentez') || lower.includes('sinir') || lower.includes('hormon')) {
        cat = 'Biyoloji';
      } else if (lower.includes('fen') || lower.includes('madde') || lower.includes('atom') || lower.includes('mevsim')) {
        cat = 'Fen Bilimleri';
      } else if (lower.includes('tarih') || lower.includes('inkılap') || lower.includes('kahraman') || lower.includes('milli') || lower.includes('atatürk') || lower.includes('osmanlı') || lower.includes('cumhuriyet')) {
        cat = 'Tarih / İnkılap';
      } else if (lower.includes('coğrafya') || lower.includes('iklim') || lower.includes('nüfus') || lower.includes('bölge') || lower.includes('harita')) {
        cat = 'Coğrafya';
      } else if (lower.includes('felsefe') || lower.includes('mantık') || lower.includes('psikoloji') || lower.includes('sosyoloji')) {
        cat = 'Felsefe Grubu';
      } else if (lower.includes('din') || lower.includes('zekat') || lower.includes('kader') || lower.includes('namaz') || lower.includes('ibadet')) {
        cat = 'Din Kültürü';
      } else if (lower.includes('ingilizce') || lower.includes('english') || lower.includes('friendship') || lower.includes('grammar')) {
        cat = 'İngilizce';
      }
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push([name, data]);
    });
    return categories;
  };

  const categorizedRecurring = categorizeTopics(recurring);
  const categorizedAll = categorizeTopics(allTopics);

  const getSeverityColor = (count) => {
    if (count >= 4) return { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', badge: '#ef4444' };
    if (count >= 3) return { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', badge: '#f97316' };
    return { bg: '#fefce8', border: '#fde047', text: '#ca8a04', badge: '#eab308' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={28} color="#6366f1" /> Raporlarım
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color-alt)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
              style={{
                background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : activeTab === 'trial-reports' && (
        <div>
          {/* Özet İstatistikler */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <FileText size={28} color="#6366f1" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#6366f1' }}>{exams.length}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam Deneme</p>
            </div>
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <TrendingDown size={28} color="#ef4444" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{recurring.length}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tekrar Eden Zayıf Konu</p>
            </div>
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <AlertTriangle size={28} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>{allTopics.length}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam İşaretlenen Konu</p>
            </div>
          </div>

          {/* KRİTİK UYARI — Tekrar eden konular */}
          {recurring.length > 0 ? (
            <div className="card glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={20} /> Dikkat! Sürekli Yanlış Yapılan Konular
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
                Aşağıdaki konuları birden fazla denemede yanlış yaptığın tespit edildi. Bu konulara özellikle çalışmalısın!
              </p>

              {Object.entries(categorizedRecurring).map(([category, topics]) => (
                <div key={category} style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                    <BookOpen size={16} color="#6366f1" /> {category}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {topics.map(([topicName, data]) => {
                      const severity = getSeverityColor(data.count);
                      const isExpanded = expandedTopic === topicName;
                      return (
                        <div key={topicName}>
                          <div
                            onClick={() => setExpandedTopic(isExpanded ? null : topicName)}
                            style={{
                              padding: '0.875rem 1rem',
                              background: severity.bg,
                              border: `1.5px solid ${severity.border}`,
                              borderRadius: 12,
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                              <AlertTriangle size={18} color={severity.text} />
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{topicName}</p>
                                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: severity.text, fontWeight: 600 }}>
                                  ⚠️ {data.count} denemede yanlış yapılmış — Bu konuya mutlaka çalışmalısın!
                                </p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem',
                                fontWeight: 800, background: severity.badge, color: 'white'
                              }}>
                                {data.count}x
                              </span>
                              {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                            </div>
                          </div>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ overflow: 'hidden', marginTop: '0.3rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}
                            >
                              <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Bu konunun işaretlendiği denemeler:</p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                {data.exams.map((ex, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                    <CheckCircle size={14} color="#ef4444" />
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{ex.title}</span>
                                    <span style={{ color: '#94a3b8' }}>({ex.date})</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : exams.length > 0 ? (
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
              <CheckCircle size={40} color="#10b981" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ color: '#10b981' }}>Harika! Tekrar Eden Zayıf Konu Yok 🎉</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Denemelerinde aynı konuyu birden fazla kez yanlış yapmamışsın. Bu harika bir ilerleme!
              </p>
            </div>
          ) : (
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem', marginBottom: '2rem' }}>
              <FileText size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
              <h3>Henüz Deneme Kaydı Yok</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                "Deneme Netleri" sayfasından deneme sonuçlarınızı ekleyip konularınızı işaretlediğinizde burada analiz raporlarınız oluşacaktır.
              </p>
            </div>
          )}

          {/* TÜM İŞARETLENEN KONULAR — Ders bazlı */}
          {allTopics.length > 0 && (
            <div className="card glass-panel">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <BookOpen size={20} color="#6366f1" /> Tüm İşaretlenen Konular (Ders Bazlı)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                Denemelerinizde "eksik/yanlış" olarak işaretlediğiniz tüm konular aşağıda listelenmiştir.
              </p>
              {Object.entries(categorizedAll).map(([category, topics]) => (
                <div key={category} style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.9rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    📚 {category}
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 8, background: '#e0e7ff', color: '#4338ca' }}>
                      {topics.length} konu
                    </span>
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {topics.map(([name, data]) => (
                      <span
                        key={name}
                        style={{
                          padding: '0.35rem 0.75rem', borderRadius: 16, fontSize: '0.78rem',
                          fontWeight: 700,
                          border: `1.5px solid ${data.count >= 2 ? '#fca5a5' : '#cbd5e1'}`,
                          background: data.count >= 2 ? '#fef2f2' : '#f8fafc',
                          color: data.count >= 2 ? '#dc2626' : '#475569',
                          display: 'flex', alignItems: 'center', gap: '0.35rem'
                        }}
                      >
                        {name}
                        {data.count >= 2 && (
                          <span style={{
                            padding: '0.05rem 0.35rem', borderRadius: 8, fontSize: '0.65rem',
                            fontWeight: 900, background: '#ef4444', color: 'white'
                          }}>
                            {data.count}x
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* İstatistik & Analiz Tabı */}
      {activeTab === 'analytics' && (
        <div style={{ marginTop: '1rem' }}>
          <Analytics />
        </div>
      )}
    </motion.div>
  );
};

export default MyReports;
