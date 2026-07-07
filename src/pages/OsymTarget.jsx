import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Target, CheckCircle, AlertCircle, Award, BookOpen, Calculator, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const OsymTarget = ({ studentId: propStudentId, readOnly = false }) => {
  const { currentUser } = useAuth();
  const targetUid = propStudentId || currentUser?.uid;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Default state for YKS
  const [yksData, setYksData] = useState({
    // Identity & Meta
    tcNo: '12345678900',
    targetDate: '2026-07-15',
    // TYT
    tyt_turkce_d: 35, tyt_turkce_y: 4,
    tyt_sosyal_d: 16, tyt_sosyal_y: 3,
    tyt_mat_d: 32, tyt_mat_y: 5,
    tyt_fen_d: 17, tyt_fen_y: 2,
    // AYT 1
    ayt_tde_d: 21, ayt_tde_y: 2,
    ayt_tar1_d: 8, ayt_tar1_y: 1,
    ayt_cog1_d: 5, ayt_cog1_y: 1,
    // AYT 2
    ayt_tar2_d: 9, ayt_tar2_y: 1,
    ayt_cog2_d: 10, ayt_cog2_y: 1,
    ayt_fels_d: 10, ayt_fels_y: 2,
    ayt_dkab_d: 5, ayt_dkab_y: 0,
    // AYT Mat & Fen
    ayt_mat_d: 34, ayt_mat_y: 3,
    ayt_fizik_d: 12, ayt_fizik_y: 2,
    ayt_kimya_d: 11, ayt_kimya_y: 1,
    ayt_biyo_d: 12, ayt_biyo_y: 1,
    // YDT
    ydt_ing_d: 72, ydt_ing_y: 6,
    // OBP
    diplomaNotu: 92.5, obp: 462.5, okulKodu: '340123', okulTuru: '11003', alanKodu: '9008', dalNo: '0',
    // Scores & Ranks
    tyt_puan: 465.25, tyt_sira: 15400, tyt_yer_puan: 511.50, tyt_yer_sira: 12800,
    say_puan: 485.40, say_sira: 8500, say_yer_puan: 531.65, say_yer_sira: 7100,
    soz_puan: 440.10, soz_sira: 19000, soz_yer_puan: 486.35, soz_yer_sira: 16500,
    ea_puan: 470.80, ea_sira: 9200, ea_yer_puan: 517.05, ea_yer_sira: 8100,
    dil_puan: 490.50, dil_sira: 3500, dil_yer_puan: 536.75, dil_yer_sira: 2900,
  });

  // Default state for LGS
  const [lgsData, setLgsData] = useState({
    tcNo: '12345678900',
    targetDate: '2026-06-10',
    // Sozel
    lgs_turkce_d: 18, lgs_turkce_y: 2,
    lgs_inkilap_d: 10, lgs_inkilap_y: 0,
    lgs_din_d: 10, lgs_din_y: 0,
    lgs_ing_d: 9, lgs_ing_y: 1,
    // Sayisal
    lgs_mat_d: 17, lgs_mat_y: 2,
    lgs_fen_d: 19, lgs_fen_y: 1,
    // OBP
    sinif6_ybp: 94.5, sinif7_ybp: 96.0, sinif8_ybp: 97.5, lgs_obp: 96.0,
    // Score & Percentile
    lgs_puan: 478.50, lgs_genel_yuzdelik: 0.85, lgs_il_yuzdelik: 0.92
  });

  useEffect(() => {
    if (!targetUid) return;

    // Load user profile for name & examType
    const unsubUser = onSnapshot(doc(db, 'users', targetUid), (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });

    // Load OSYM target
    const unsubTarget = onSnapshot(doc(db, 'users', targetUid, 'osymTarget', 'targetData'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.yks) setYksData(prev => ({ ...prev, ...data.yks }));
        if (data.lgs) setLgsData(prev => ({ ...prev, ...data.lgs }));
      }
      setLoading(false);
    });

    return () => { unsubUser(); unsubTarget(); };
  }, [targetUid]);

  const examType = userData?.examType || 'yks';
  const isLgs = examType === 'lgs';

  // Net calculations
  const calcNet = (d, y, ratio = 4) => {
    const net = Number(d || 0) - Number(y || 0) / ratio;
    return Math.max(0, parseFloat(net.toFixed(2)));
  };

  const handleYksChange = (field, value) => {
    setYksData(prev => ({ ...prev, [field]: value === '' ? '' : Number(value) }));
  };

  const handleLgsChange = (field, value) => {
    setLgsData(prev => ({ ...prev, [field]: value === '' ? '' : Number(value) }));
  };

  const handleSave = async () => {
    if (!targetUid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', targetUid, 'osymTarget', 'targetData'), {
        examType: examType,
        yks: yksData,
        lgs: lgsData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Swal.fire({
        icon: 'success',
        title: 'Hedef Tablosu Kaydedildi!',
        text: 'Sınav hedef netleriniz, puanlarınız ve sıralamalarınız güncellendi.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Hedefler kaydedilirken bir sorun oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Styles for authentic official table look
  const tableStyle = {
    width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem',
    background: 'white', border: '2px solid #1e293b', fontSize: '0.85rem'
  };
  const thStyle = {
    background: '#f1f5f9', border: '1px solid #1e293b', padding: '0.45rem',
    fontWeight: 800, color: '#0f172a', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.75rem'
  };
  const tdStyle = {
    border: '1px solid #64748b', padding: '0.35rem', textAlign: 'center', color: '#1e293b'
  };
  const inputStyle = {
    width: '100%', maxWidth: '56px', padding: '0.25rem', textAlign: 'center',
    border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 700,
    fontSize: '0.85rem', background: '#f8fafc', color: '#0f172a'
  };
  const netBadgeStyle = {
    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '4px',
    background: '#eef2ff', color: '#4f46e5', fontWeight: 800, fontSize: '0.85rem', border: '1px solid #c7d2fe'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Top Bar with Info and Save */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: 'white', padding: '1.25rem 1.5rem', borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: isLgs ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Award size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>
              {isLgs ? 'MEB 2026 - LGS Sonuç & Hedef Simülasyonu' : 'ÖSYM 2026 - YKS Sonuç & Hedef Simülasyonu'}
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
              Resmi sonuç belgesi formatında hedef netleriniz, puanlarınız ve Türkiye sıralama simülasyonunuz.
            </p>
          </div>
        </div>

        {!readOnly && (
          <button 
            className="btn btn-primary" 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: '0.75rem 1.75rem', background: isLgs ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.95rem' }}
          >
            {saving ? 'Kaydediliyor...' : <><Save size={18} /> Hedef Tablomu Kaydet</>}
          </button>
        )}
      </div>

      {/* Official Sheet Container */}
      <div style={{
        background: '#ffffff', border: '3px solid #0f172a', padding: '2.5rem',
        borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative'
      }}>
        
        {/* Official Document Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', margin: '0 0 0.3rem', fontFamily: 'serif' }}>
            {isLgs ? 'T.C. MİLLÎ EĞİTİM BAKANLIĞI' : 'ÖSYM'}
          </h1>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#334155', margin: '0 0 0.5rem' }}>
            {isLgs ? '2026 - LGS HEDEF VE SONUÇ SİMÜLASYONU' : '2026 - YKS HEDEF VE SONUÇ SİMÜLASYONU'}
          </h2>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.3rem 0.8rem', borderRadius: 4, border: '1px solid #cbd5e1' }}>
            BİREYSEL HEDEF VE KARİYER PLANLAMA BELGESİ
          </span>
        </div>

        {/* Student Identity Box */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
          <table style={{ borderCollapse: 'collapse', border: '2px solid #0f172a', width: '380px', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ background: '#f1f5f9', fontWeight: 800, border: '1px solid #0f172a', padding: '0.4rem 0.8rem', width: '160px' }}>T.C. KİMLİK NUMARASI</td>
                <td style={{ border: '1px solid #0f172a', padding: '0.4rem 0.8rem', fontWeight: 700 }}>
                  <input 
                    type="text" 
                    value={isLgs ? lgsData.tcNo : yksData.tcNo} 
                    onChange={e => isLgs ? setLgsData({...lgsData, tcNo: e.target.value}) : setYksData({...yksData, tcNo: e.target.value})}
                    disabled={readOnly}
                    style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 800, outline: 'none' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ background: '#f1f5f9', fontWeight: 800, border: '1px solid #0f172a', padding: '0.4rem 0.8rem' }}>ADI VE SOYADI</td>
                <td style={{ border: '1px solid #0f172a', padding: '0.4rem 0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                  {userData?.name || 'ÖĞRENCİ ADI SOYADI'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── YKS VIEW ─── */}
        {!isLgs ? (
          <div>
            {/* Table 1: TYT */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              1. TYT TESTLERİNDEKİ DOĞRU VE YANLIŞ SAYILARI (4 Yanlış 1 Doğruyu Götürür)
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle} colSpan={3}>TÜRKÇE (40 Soru)</th>
                  <th style={thStyle} colSpan={3}>SOSYAL BİLİMLER (20 Soru)</th>
                  <th style={thStyle} colSpan={3}>TEMEL MATEMATİK (40 Soru)</th>
                  <th style={thStyle} colSpan={3}>FEN BİLİMLERİ (20 Soru)</th>
                </tr>
                <tr>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Doğru</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Yanlış</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e0e7ff', color:'#4338ca'}}>Net</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Doğru</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Yanlış</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e0e7ff', color:'#4338ca'}}>Net</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Doğru</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Yanlış</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e0e7ff', color:'#4338ca'}}>Net</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Doğru</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e2e8f0'}}>Yanlış</th>
                  <th style={{...thStyle, fontSize:'0.7rem', background:'#e0e7ff', color:'#4338ca'}}>Net</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Turkce */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_turkce_d} onChange={e => handleYksChange('tyt_turkce_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_turkce_y} onChange={e => handleYksChange('tyt_turkce_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.tyt_turkce_d, yksData.tyt_turkce_y)}</span></td>
                  {/* Sosyal */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_sosyal_d} onChange={e => handleYksChange('tyt_sosyal_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_sosyal_y} onChange={e => handleYksChange('tyt_sosyal_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.tyt_sosyal_d, yksData.tyt_sosyal_y)}</span></td>
                  {/* Mat */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_mat_d} onChange={e => handleYksChange('tyt_mat_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_mat_y} onChange={e => handleYksChange('tyt_mat_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.tyt_mat_d, yksData.tyt_mat_y)}</span></td>
                  {/* Fen */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_fen_d} onChange={e => handleYksChange('tyt_fen_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.tyt_fen_y} onChange={e => handleYksChange('tyt_fen_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.tyt_fen_d, yksData.tyt_fen_y)}</span></td>
                </tr>
                {/* TYT Total Summary Row */}
                <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                  <td colSpan={6} style={{...tdStyle, textAlign:'right', paddingRight:'1rem'}}>TOPLAM TYT NETİ:</td>
                  <td colSpan={6} style={{...tdStyle, textAlign:'left', paddingLeft:'1rem', color:'#4f46e5', fontSize:'1rem'}}>
                    {(calcNet(yksData.tyt_turkce_d, yksData.tyt_turkce_y) + calcNet(yksData.tyt_sosyal_d, yksData.tyt_sosyal_y) + calcNet(yksData.tyt_mat_d, yksData.tyt_mat_y) + calcNet(yksData.tyt_fen_d, yksData.tyt_fen_y)).toFixed(2)} NET
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Table 2: AYT */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              2. AYT TESTLERİNDEKİ DOĞRU VE YANLIŞ SAYILARI
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle} colSpan={9}>TÜRK DİLİ VE EDEBİYATI - SOSYAL BİLİMLER - 1</th>
                  <th style={thStyle} colSpan={3}>YDT</th>
                </tr>
                <tr>
                  <th style={thStyle} colSpan={3}>TÜRK DİLİ VE EDEBİYATI (24)</th>
                  <th style={thStyle} colSpan={3}>TARİH - 1 (10)</th>
                  <th style={thStyle} colSpan={3}>COĞRAFYA - 1 (6)</th>
                  <th style={thStyle} colSpan={3}>YABANCI DİL (80)</th>
                </tr>
                <tr>
                  {['Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net'].map((t, i) => (
                    <th key={i} style={{...thStyle, fontSize:'0.7rem', background: t==='Net' ? '#e0e7ff' : '#e2e8f0', color: t==='Net' ? '#4338ca' : '#0f172a'}}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* TDE */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tde_d} onChange={e => handleYksChange('ayt_tde_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tde_y} onChange={e => handleYksChange('ayt_tde_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_tde_d, yksData.ayt_tde_y)}</span></td>
                  {/* Tar1 */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tar1_d} onChange={e => handleYksChange('ayt_tar1_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tar1_y} onChange={e => handleYksChange('ayt_tar1_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_tar1_d, yksData.ayt_tar1_y)}</span></td>
                  {/* Cog1 */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_cog1_d} onChange={e => handleYksChange('ayt_cog1_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_cog1_y} onChange={e => handleYksChange('ayt_cog1_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_cog1_d, yksData.ayt_cog1_y)}</span></td>
                  {/* YDT Ing */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ydt_ing_d} onChange={e => handleYksChange('ydt_ing_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ydt_ing_y} onChange={e => handleYksChange('ydt_ing_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ydt_ing_d, yksData.ydt_ing_y)}</span></td>
                </tr>
              </tbody>
            </table>

            {/* Table 2.1: AYT Sosyal 2 & Sayısal */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle} colSpan={6}>MATEMATİK VE FEN BİLİMLERİ (SAYISAL)</th>
                  <th style={thStyle} colSpan={6}>SOSYAL BİLİMLER - 2 (SÖZEL)</th>
                </tr>
                <tr>
                  <th style={thStyle} colSpan={3}>MATEMATİK (40)</th>
                  <th style={thStyle} colSpan={3}>FİZİK (14)</th>
                  <th style={thStyle} colSpan={3}>TARİH - 2 (11)</th>
                  <th style={thStyle} colSpan={3}>COĞRAFYA - 2 (11)</th>
                </tr>
                <tr>
                  {['Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net'].map((t, i) => (
                    <th key={i} style={{...thStyle, fontSize:'0.7rem', background: t==='Net' ? '#e0e7ff' : '#e2e8f0', color: t==='Net' ? '#4338ca' : '#0f172a'}}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Mat */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_mat_d} onChange={e => handleYksChange('ayt_mat_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_mat_y} onChange={e => handleYksChange('ayt_mat_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_mat_d, yksData.ayt_mat_y)}</span></td>
                  {/* Fizik */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_fizik_d} onChange={e => handleYksChange('ayt_fizik_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_fizik_y} onChange={e => handleYksChange('ayt_fizik_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_fizik_d, yksData.ayt_fizik_y)}</span></td>
                  {/* Tar2 */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tar2_d} onChange={e => handleYksChange('ayt_tar2_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_tar2_y} onChange={e => handleYksChange('ayt_tar2_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_tar2_d, yksData.ayt_tar2_y)}</span></td>
                  {/* Cog2 */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_cog2_d} onChange={e => handleYksChange('ayt_cog2_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_cog2_y} onChange={e => handleYksChange('ayt_cog2_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_cog2_d, yksData.ayt_cog2_y)}</span></td>
                </tr>
                {/* Second row of Sayisal & Sozel 2 */}
                <tr>
                  <th style={thStyle} colSpan={3}>KİMYA (13)</th>
                  <th style={thStyle} colSpan={3}>BİYOLOJİ (13)</th>
                  <th style={thStyle} colSpan={3}>FELSEFE GRUBU (12)</th>
                  <th style={thStyle} colSpan={3}>DKAB / İLAVE FELS. (6)</th>
                </tr>
                <tr>
                  {/* Kimya */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_kimya_d} onChange={e => handleYksChange('ayt_kimya_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_kimya_y} onChange={e => handleYksChange('ayt_kimya_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_kimya_d, yksData.ayt_kimya_y)}</span></td>
                  {/* Biyo */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_biyo_d} onChange={e => handleYksChange('ayt_biyo_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_biyo_y} onChange={e => handleYksChange('ayt_biyo_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_biyo_d, yksData.ayt_biyo_y)}</span></td>
                  {/* Fels */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_fels_d} onChange={e => handleYksChange('ayt_fels_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_fels_y} onChange={e => handleYksChange('ayt_fels_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_fels_d, yksData.ayt_fels_y)}</span></td>
                  {/* DKAB */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_dkab_d} onChange={e => handleYksChange('ayt_dkab_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={yksData.ayt_dkab_y} onChange={e => handleYksChange('ayt_dkab_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(yksData.ayt_dkab_d, yksData.ayt_dkab_y)}</span></td>
                </tr>
              </tbody>
            </table>

            {/* Table 3: OBP & Diploma */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              3. OKUL VE ORTAÖĞRETİM BAŞARI PUANI BİLGİLERİ
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>DİPLOMA NOTU</th>
                  <th style={thStyle}>ORTAÖĞRETİM BAŞARI PUANI (OBP)</th>
                  <th style={thStyle}>OKUL KODU</th>
                  <th style={thStyle}>OKUL TÜRÜ KODU</th>
                  <th style={thStyle}>ALAN KODU</th>
                  <th style={thStyle}>DAL NO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><input type="number" step="0.1" style={{...inputStyle, maxWidth:'80px'}} disabled={readOnly} value={yksData.diplomaNotu} onChange={e => {
                    const dip = Number(e.target.value);
                    setYksData({...yksData, diplomaNotu: dip, obp: dip * 5});
                  }} /></td>
                  <td style={{...tdStyle, fontWeight:800, color:'#4f46e5'}}>{yksData.obp}</td>
                  <td style={tdStyle}><input type="text" style={{...inputStyle, maxWidth:'80px'}} disabled={readOnly} value={yksData.okulKodu} onChange={e => setYksData({...yksData, okulKodu: e.target.value})} /></td>
                  <td style={tdStyle}><input type="text" style={{...inputStyle, maxWidth:'80px'}} disabled={readOnly} value={yksData.okulTuru} onChange={e => setYksData({...yksData, okulTuru: e.target.value})} /></td>
                  <td style={tdStyle}><input type="text" style={{...inputStyle, maxWidth:'80px'}} disabled={readOnly} value={yksData.alanKodu} onChange={e => setYksData({...yksData, alanKodu: e.target.value})} /></td>
                  <td style={tdStyle}><input type="text" style={{...inputStyle, maxWidth:'60px'}} disabled={readOnly} value={yksData.dalNo} onChange={e => setYksData({...yksData, dalNo: e.target.value})} /></td>
                </tr>
              </tbody>
            </table>

            {/* Table 4: Puan ve Sıralama */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              4. SINAV VE YERLEŞTİRME PUANLARI VE BAŞARI SIRALARI HEDEFLERİ
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{...thStyle, width:'10%'}}>PUAN TÜRÜ</th>
                  <th style={{...thStyle, width:'18%', background:'#e0e7ff', color:'#3730a3'}}>HAM PUAN</th>
                  <th style={{...thStyle, width:'18%', background:'#e0e7ff', color:'#3730a3'}}>HAM BAŞARI SIRASI</th>
                  <th style={{...thStyle, width:'18%', background:'#ecfdf5', color:'#065f46'}}>YERLEŞTİRME PUANI</th>
                  <th style={{...thStyle, width:'18%', background:'#ecfdf5', color:'#065f46'}}>YER. BAŞARI SIRASI</th>
                  <th style={{...thStyle, width:'18%'}}>EK PUANLI SIRALAMA</th>
                </tr>
              </thead>
              <tbody>
                {['tyt','say','soz','ea','dil'].map((type) => {
                  const label = type.toUpperCase();
                  return (
                    <tr key={type}>
                      <td style={{...tdStyle, fontWeight:800, background:'#f8fafc'}}>{label}</td>
                      <td style={tdStyle}><input type="number" step="0.01" style={{...inputStyle, maxWidth:'90px'}} disabled={readOnly} value={yksData[`${type}_puan`]} onChange={e => handleYksChange(`${type}_puan`, e.target.value)} /></td>
                      <td style={tdStyle}><input type="number" style={{...inputStyle, maxWidth:'90px', fontWeight:800, color:'#4338ca'}} disabled={readOnly} value={yksData[`${type}_sira`]} onChange={e => handleYksChange(`${type}_sira`, e.target.value)} /></td>
                      <td style={tdStyle}><input type="number" step="0.01" style={{...inputStyle, maxWidth:'90px'}} disabled={readOnly} value={yksData[`${type}_yer_puan`]} onChange={e => handleYksChange(`${type}_yer_puan`, e.target.value)} /></td>
                      <td style={tdStyle}><input type="number" style={{...inputStyle, maxWidth:'90px', fontWeight:800, color:'#059669'}} disabled={readOnly} value={yksData[`${type}_yer_sira`]} onChange={e => handleYksChange(`${type}_yer_sira`, e.target.value)} /></td>
                      <td style={tdStyle}>---</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ─── LGS VIEW ─── */
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              1. LGS SÖZEL VE SAYISAL BÖLÜM TESTLERİ (3 Yanlış 1 Doğruyu Götürür)
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle} colSpan={3}>TÜRKÇE (20 Soru)</th>
                  <th style={thStyle} colSpan={3}>MATEMATİK (20 Soru)</th>
                  <th style={thStyle} colSpan={3}>FEN BİLİMLERİ (20 Soru)</th>
                </tr>
                <tr>
                  {['Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net'].map((t, i) => (
                    <th key={i} style={{...thStyle, fontSize:'0.7rem', background: t==='Net' ? '#e0e7ff' : '#e2e8f0', color: t==='Net' ? '#4338ca' : '#0f172a'}}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Turkce */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_turkce_d} onChange={e => handleLgsChange('lgs_turkce_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_turkce_y} onChange={e => handleLgsChange('lgs_turkce_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_turkce_d, lgsData.lgs_turkce_y, 3)}</span></td>
                  {/* Mat */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_mat_d} onChange={e => handleLgsChange('lgs_mat_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_mat_y} onChange={e => handleLgsChange('lgs_mat_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_mat_d, lgsData.lgs_mat_y, 3)}</span></td>
                  {/* Fen */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_fen_d} onChange={e => handleLgsChange('lgs_fen_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_fen_y} onChange={e => handleLgsChange('lgs_fen_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_fen_d, lgsData.lgs_fen_y, 3)}</span></td>
                </tr>
              </tbody>
            </table>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle} colSpan={3}>T.C. İNKILAP TARİHİ (10 Soru)</th>
                  <th style={thStyle} colSpan={3}>YABANCI DİL / İNG. (10 Soru)</th>
                  <th style={thStyle} colSpan={3}>DİN KÜLTÜRÜ VE AHLAK B. (10 Soru)</th>
                </tr>
                <tr>
                  {['Doğru','Yanlış','Net','Doğru','Yanlış','Net','Doğru','Yanlış','Net'].map((t, i) => (
                    <th key={i} style={{...thStyle, fontSize:'0.7rem', background: t==='Net' ? '#e0e7ff' : '#e2e8f0', color: t==='Net' ? '#4338ca' : '#0f172a'}}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Inkilap */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_inkilap_d} onChange={e => handleLgsChange('lgs_inkilap_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_inkilap_y} onChange={e => handleLgsChange('lgs_inkilap_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_inkilap_d, lgsData.lgs_inkilap_y, 3)}</span></td>
                  {/* Ing */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_ing_d} onChange={e => handleLgsChange('lgs_ing_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_ing_y} onChange={e => handleLgsChange('lgs_ing_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_ing_d, lgsData.lgs_ing_y, 3)}</span></td>
                  {/* Din */}
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_din_d} onChange={e => handleLgsChange('lgs_din_d', e.target.value)} /></td>
                  <td style={tdStyle}><input type="number" style={inputStyle} disabled={readOnly} value={lgsData.lgs_din_y} onChange={e => handleLgsChange('lgs_din_y', e.target.value)} /></td>
                  <td style={{...tdStyle, background:'#f8fafc'}}><span style={netBadgeStyle}>{calcNet(lgsData.lgs_din_d, lgsData.lgs_din_y, 3)}</span></td>
                </tr>
                {/* LGS Total Summary Row */}
                <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                  <td colSpan={6} style={{...tdStyle, textAlign:'right', paddingRight:'1rem'}}>TOPLAM LGS NETİ (90 Soru):</td>
                  <td colSpan={3} style={{...tdStyle, textAlign:'center', color:'#d97706', fontSize:'1rem'}}>
                    {(calcNet(lgsData.lgs_turkce_d, lgsData.lgs_turkce_y, 3) + calcNet(lgsData.lgs_mat_d, lgsData.lgs_mat_y, 3) + calcNet(lgsData.lgs_fen_d, lgsData.lgs_fen_y, 3) + calcNet(lgsData.lgs_inkilap_d, lgsData.lgs_inkilap_y, 3) + calcNet(lgsData.lgs_ing_d, lgsData.lgs_ing_y, 3) + calcNet(lgsData.lgs_din_d, lgsData.lgs_din_y, 3)).toFixed(2)} NET
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Table 2: OBP */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              2. ORTAOKUL BAŞARI PUANI BİLGİLERİ (OBP)
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>6. SINIF YIL SONU PUANI</th>
                  <th style={thStyle}>7. SINIF YIL SONU PUANI</th>
                  <th style={thStyle}>8. SINIF YIL SONU PUANI</th>
                  <th style={{...thStyle, background:'#ecfdf5', color:'#065f46'}}>ORTAOKUL BAŞARI PUANI (OBP)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><input type="number" step="0.1" style={inputStyle} disabled={readOnly} value={lgsData.sinif6_ybp} onChange={e => {
                    const v = Number(e.target.value);
                    setLgsData({...lgsData, sinif6_ybp: v, lgs_obp: ((v + lgsData.sinif7_ybp + lgsData.sinif8_ybp)/3).toFixed(2)});
                  }} /></td>
                  <td style={tdStyle}><input type="number" step="0.1" style={inputStyle} disabled={readOnly} value={lgsData.sinif7_ybp} onChange={e => {
                    const v = Number(e.target.value);
                    setLgsData({...lgsData, sinif7_ybp: v, lgs_obp: ((lgsData.sinif6_ybp + v + lgsData.sinif8_ybp)/3).toFixed(2)});
                  }} /></td>
                  <td style={tdStyle}><input type="number" step="0.1" style={inputStyle} disabled={readOnly} value={lgsData.sinif8_ybp} onChange={e => {
                    const v = Number(e.target.value);
                    setLgsData({...lgsData, sinif8_ybp: v, lgs_obp: ((lgsData.sinif6_ybp + lgsData.sinif7_ybp + v)/3).toFixed(2)});
                  }} /></td>
                  <td style={{...tdStyle, fontWeight:800, color:'#059669', fontSize:'1.1rem'}}>{lgsData.lgs_obp}</td>
                </tr>
              </tbody>
            </table>

            {/* Table 3: Puan & Yuzdelik */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', color: '#0f172a' }}>
              3. MERKEZÎ SINAV HEDEF PUANI VE YÜZDELİK DİLİMLER
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{...thStyle, background:'#fffbeb', color:'#92400e'}}>LGS HEDEF PUANI (500 ÜZERİNDEN)</th>
                  <th style={{...thStyle, background:'#ecfdf5', color:'#065f46'}}>GENEL YÜZDELİK DİLİM HEDEFİ</th>
                  <th style={{...thStyle, background:'#ecfdf5', color:'#065f46'}}>İL YÜZDELİK DİLİM HEDEFİ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>
                    <input type="number" step="0.01" style={{...inputStyle, maxWidth:'120px', fontSize:'1.1rem', color:'#d97706'}} disabled={readOnly} value={lgsData.lgs_puan} onChange={e => handleLgsChange('lgs_puan', e.target.value)} />
                  </td>
                  <td style={tdStyle}>
                    % <input type="number" step="0.01" style={{...inputStyle, maxWidth:'90px', fontWeight:800, color:'#059669'}} disabled={readOnly} value={lgsData.lgs_genel_yuzdelik} onChange={e => handleLgsChange('lgs_genel_yuzdelik', e.target.value)} />
                  </td>
                  <td style={tdStyle}>
                    % <input type="number" step="0.01" style={{...inputStyle, maxWidth:'90px', fontWeight:800, color:'#059669'}} disabled={readOnly} value={lgsData.lgs_il_yuzdelik} onChange={e => handleLgsChange('lgs_il_yuzdelik', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Document Stamp & Save */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', borderTop: '2px solid #0f172a', paddingTop: '1.5rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Bu belge bireysel hedef izleme sistemi tarafından üretilmiştir. Resmi belge yerine geçmez.
            </p>
          </div>
          {!readOnly && (
            <button 
              className="btn btn-primary" 
              onClick={handleSave} 
              disabled={saving}
              style={{ padding: '0.8rem 2.2rem', background: isLgs ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '1rem', fontWeight: 800 }}
            >
              {saving ? 'Kaydediliyor...' : <><Save size={18} /> Hedefleri Kaydet & Güncelle</>}
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default OsymTarget;
