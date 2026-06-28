import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Calendar as CalendarIcon, Clock, TrendingUp, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Planner = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState('daily'); // daily, weekly, monthly
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('study');

  useEffect(() => {
    if (!currentUser) return;

    const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = [];
      snapshot.forEach(docSnap => {
        fetchedTasks.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleTask = async (id, currentStatus) => {
    if (!currentUser) return;
    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', id);
      await updateDoc(taskRef, { completed: !currentStatus });
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

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const pieData = [
    { name: 'Tamamlanan', value: completedCount },
    { name: 'Kalan', value: tasks.length - completedCount }
  ];
  const COLORS = ['var(--success-color)', 'rgba(255,255,255,0.1)'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Çalışma Planı & Görevler</h1>
        
        <div style={{ display: 'flex', background: 'var(--bg-color-alt)', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${view === 'daily' ? 'btn-primary' : ''}`} 
            style={{ background: view === 'daily' ? 'var(--primary-color)' : 'transparent', color: view === 'daily' ? 'white' : 'var(--text-muted)' }}
            onClick={() => setView('daily')}
          >Tümü</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Task List */}
        <div className="card glass-panel" style={{ minHeight: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3><CalendarIcon size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Görevlerim</h3>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Yeni görev ekle..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ flex: 1 }}
            />
            <select className="input-field" value={newTaskType} onChange={(e) => setNewTaskType(e.target.value)} style={{ width: '150px' }}>
              <option value="study">Konu Çalışması</option>
              <option value="practice">Soru Çözümü</option>
              <option value="gamified">Oyunlaştırma</option>
            </select>
            <button type="submit" className="btn btn-primary"><Plus size={18} /></button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? <p>Yükleniyor...</p> : tasks.length === 0 ? <p className="text-muted">Henüz hiç göreviniz yok. Yeni bir görev ekleyin!</p> : tasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id, task.completed)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '1rem', 
                  background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${task.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: task.completed ? 'scale(0.99)' : 'scale(1)'
                }}
              >
                <div style={{ color: task.completed ? 'var(--success-color)' : 'var(--text-muted)', marginRight: '1rem' }}>
                  {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {task.title}
                  </h4>
                  {task.isFrequent && (
                     <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>
                       🔥 En Çok Çıkan Soru Tipi
                     </span>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {task.type === 'study' ? 'Konu' : task.type === 'practice' ? 'Soru Çözümü' : 'Diğer'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card glass-panel" style={{ textAlign: 'center' }}>
            <h3>Tamamlama Oranı</h3>
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
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{completedCount} / {tasks.length} Görev Tamamlandı</p>
          </div>

          <div className="card glass-panel" style={{ background: 'var(--gradient-primary)', color: 'white', border: 'none' }}>
            <h3><TrendingUp size={20} style={{ verticalAlign: 'middle' }}/> Hedef İstatistiği</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Bu hafta hedeflerine %15 daha yaklaştın. Hızını kesme, ağacın büyüyor!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Planner;
