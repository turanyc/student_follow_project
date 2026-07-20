import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Calendar, Zap, ShieldCheck } from 'lucide-react';
import StudyHeatmapCalendar from '../components/StudyHeatmapCalendar';
import { useAuth } from '../context/AuthContext';

const StudyMapPage = () => {
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Outfit, sans-serif' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, fontSize: '1.85rem', fontWeight: 900, color: '#1e293b' }}>
            <Flame size={34} color="#f59e0b" /> <span>Anlık Çalışma Haritan & Isı Takvimi</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
            Her gün tamamladığın pomodorolar, seanslar ve test saatleri bu canlı matriste anlık olarak ışıldar!
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.6rem 1.1rem', borderRadius: 14 }}>
          <Sparkles size={20} color="#059669" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46' }}>Canlı Gerçek Zamanlı Takip</span>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <StudyHeatmapCalendar studentId={currentUser?.uid} studentName={currentUser?.displayName || 'Öğrenci'} isCoachView={false} />
      </div>

      {/* Info / Legend Summary Banner */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontWeight: 800, fontSize: '1.4rem' }}>
            🔥
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>İstikrar Serisi (Streak)</h4>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Arka arkaya çalıştığın her gün serini büyütür ve ağacını güçlendirir.</p>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800, fontSize: '1.4rem' }}>
            ⚡
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>Anlık Renk Koyuluğu</h4>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>1 saat ve üzeri çalışmalarda zümrüt yeşili, 4 saat ve üzerindeki günlerde ise altın efsaneliği aktif olur.</p>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea', fontWeight: 800, fontSize: '1.4rem' }}>
            🍅
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>Koç ve Panel Görünürlüğü</h4>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Buradaki tüm çalışma eforun hem koç panelinde hem de evrim haritanda anlık senkronize edilir.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyMapPage;
