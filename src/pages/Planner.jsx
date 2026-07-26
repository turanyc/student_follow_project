import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Calendar as CalendarIcon, Clock, TrendingUp, Plus, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Planner = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState('daily'); // daily, weekly, monthly, yearly
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('study');

  useEffect(() => {
    if (!currentUser) return;

    const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
    const qTasks = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const fetchedTasks = [];
      snapshot.forEach(docSnap => {
        fetchedTasks.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTasks(fetchedTasks);
      setLoading(false);
    });

    const goalsRef = collection(db, 'users', currentUser.uid, 'goals');
    const qGoals = query(goalsRef, orderBy('createdAt', 'desc'));
    
    const unsubGoals = onSnapshot(qGoals, (snapshot) => {
      const fetchedGoals = [];
      snapshot.forEach(docSnap => {
        fetchedGoals.push({ id: docSnap.id, isGoal: true, ...docSnap.data() });
      });
      setGoals(fetchedGoals);
    });

    return () => {
      unsubTasks();
      unsubGoals();
    };
  }, [currentUser]);

  const toggleItem = async (item) => {
    if (!currentUser) return;
    try {
      if (item.isGoal) {
        const itemRef = doc(db, 'users', currentUser.uid, 'goals', item.id);
        await updateDoc(itemRef, { completed: !item.completed });
      } else {
        const itemRef = doc(db, 'users', currentUser.uid, 'tasks', item.id);
        await updateDoc(itemRef, { completed: !item.completed });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentUser) return;

    try {
      const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
      await addDoc(tasksRef, {
        title: newTaskTitle,
        type: newTaskType,
        periodType: view, // Save the task under the active tab
        completed: false,
        isFrequent: false,
        createdAt: new Date().toISOString()
      });
      setNewTaskTitle('');
    } catch (error) {
      console.error(error);
      Swal.fire('Hata', 'Görev eklenirken bir hata oluştu.', 'error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks based on view
  const filteredTasks = tasks.filter(t => (t.periodType || 'daily') === view);
  
  // Goals that have targetDate == today are added to the daily view
  const filteredGoals = view === 'daily' ? goals.filter(g => g.targetDate === todayStr) : [];
  
  const displayItems = [...filteredTasks, ...filteredGoals];

  const completedCount = displayItems.filter(t => t.completed).length;
  const completionRate = displayItems.length > 0 ? Math.round((completedCount / displayItems.length) * 100) : 0;

  const pieData = [
    { name: 'Tamamlanan', value: completedCount },
    { name: 'Kalan', value: displayItems.length - completedCount }
  ];
  const COLORS = ['var(--success-color)', 'rgba(255,255,255,0.1)'];

  const tabs = [
    { id: 'daily', label: 'Günlük' },
    { id: 'weekly', label: 'Haftalık' },
    { id: 'monthly', label: 'Aylık' },
    { id: 'yearly', label: 'Yıllık' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Çalışma Planı & Görevler</h1>
        
        <div style={{ display: 'flex', background: 'var(--bg-color-alt)', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`btn ${view === tab.id ? 'btn-primary' : ''}`} 
              style={{ background: view === tab.id ? 'var(--primary-color)' : 'transparent', color: view === tab.id ? 'white' : 'var(--text-muted)' }}
              onClick={() => setView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '2rem' }}>
        
        {/* Task List */}
        <div className="card glass-panel" style={{ minHeight: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3><CalendarIcon size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {tabs.find(t => t.id === view)?.label} Görevlerim</h3>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Yeni görev ekle..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            <select className="input-field" value={newTaskType} onChange={(e) => setNewTaskType(e.target.value)} style={{ width: '160px', flex: '0 0 auto' }}>
              <option value="study">Konu Çalışması</option>
              <option value="practice">Soru Çözümü</option>
              <option value="other">Diğer / Genel</option>
            </select>
            <button type="submit" className="btn btn-primary"><Plus size={18} /></button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? <p>Yükleniyor...</p> : displayItems.length === 0 ? <p className="text-muted">Bu periyot için henüz hiç göreviniz yok. Yeni bir görev ekleyin!</p> : displayItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleItem(item)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '1rem', 
                  background: item.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${item.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: item.completed ? 'scale(0.99)' : 'scale(1)'
                }}
              >
                <div style={{ color: item.completed ? 'var(--success-color)' : 'var(--text-muted)', marginRight: '1rem' }}>
                  {item.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-muted)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.isGoal && <Target size={14} color="#f59e0b" />}
                    {item.title}
                  </h4>
                  {item.isGoal && (
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '0.2rem', display: 'block' }}>Hedeflerden eklendi (Bugün: {item.targetDate})</span>
                  )}
                  {item.isFrequent && (
                     <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>
                       🔥 En Çok Çıkan Soru Tipi
                     </span>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {item.isGoal ? 'Hedef' : (item.type === 'study' ? 'Konu' : item.type === 'practice' ? 'Soru Çözümü' : 'Diğer')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card glass-panel" style={{ textAlign: 'center' }}>
            <h3>{tabs.find(t => t.id === view)?.label} Tamamlama Oranı</h3>
            <div style={{ height: '200px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>%{completionRate}</span>
              </div>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{completedCount} / {displayItems.length} Görev Tamamlandı</p>
          </div>

          <div className="card glass-panel" style={{ background: '#1e7796', color: 'white', border: 'none', boxShadow: '0 8px 24px rgba(30, 119, 150, 0.25)' }}>
            <h3 style={{ color: '#ffd48d', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}><TrendingUp size={20} /> Hedef İstatistiği</h3>
            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
              {displayItems.length > 0 ? (
                completedCount > 0 ? (
                  `Bu listendeki hedeflerinin %${Math.round((completedCount / displayItems.length) * 100)} kısmını başarıyla tamamladın. Hızını kesme, ağacın büyüyor ve kök salıyor!`
                ) : (
                  'Henüz bu periyottaki görevlerinden tamamladığın bulunmuyor. İlk görevini tamamlayarak hedeflerine hızla yaklaş ve ağacını yeşert!'
                )
              ) : (
                'Şu anda listelenecek bir görevin bulunmuyor. Yeni görevler ekleyerek başarı yüzdeni canlı olarak artırıp ağacını besleyebilirsin!'
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Planner;
