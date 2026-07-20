import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Clock, Timer, Info, ArrowRight, ChevronLeft, Zap, Brain, Gamepad2, RefreshCw, Sparkles } from 'lucide-react';

// ── Web Audio API sound generator ──────────────────────────────────────────
const playBeep = (type = 'start') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const sequences = {
      start: [{ freq: 523, dur: 0.12 }, { freq: 659, dur: 0.15 }],
      workDone: [
        { freq: 880, dur: 0.18 }, { freq: 660, dur: 0.12 },
        { freq: 880, dur: 0.25 }, { freq: 1047, dur: 0.35 }
      ],
      breakDone: [
        { freq: 440, dur: 0.12 }, { freq: 523, dur: 0.12 },
        { freq: 659, dur: 0.12 }, { freq: 880, dur: 0.28 }
      ],
    };
    const notes = sequences[type] || sequences.start;
    let time = ctx.currentTime + 0.05;
    notes.forEach(({ freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.35, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.start(time);
      osc.stop(time + dur + 0.05);
      time += dur + 0.04;
    });
  } catch (e) {
    console.warn('Ses çalınamadı:', e);
  }
};

// ── Study Methods Configuration ────────────────────────────────────────────
const STUDY_METHODS = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    emoji: '🍅',
    icon: Timer,
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfter: 4,
    color: '#ef4444',
    colorLight: '#fef2f2',
    colorMid: '#fee2e2',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    gradientLight: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    tagline: 'Klasik Odaklanma Tekniği',
    shortDesc: '25 dk çalış, 5 dk mola. 4 turda 15 dk uzun mola.',
  },
  {
    id: 'flowtime',
    name: 'Flowtime',
    emoji: '🌊',
    icon: Zap,
    workMinutes: 45,
    breakMinutes: 8,
    longBreakMinutes: 15,
    longBreakAfter: 3,
    color: '#3b82f6',
    colorLight: '#eff6ff',
    colorMid: '#dbeafe',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    gradientLight: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    tagline: 'Akış Zamanı Tekniği',
    shortDesc: '45 dk derin odak, 8 dk mola. Doğal ritmine uy.',
  },
  {
    id: 'animedoro',
    name: 'Animedoro',
    emoji: '🎮',
    icon: Gamepad2,
    workMinutes: 50,
    breakMinutes: 20,
    longBreakMinutes: 30,
    longBreakAfter: 3,
    color: '#8b5cf6',
    colorLight: '#f5f3ff',
    colorMid: '#ede9fe',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    gradientLight: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    tagline: 'Ödül Odaklı Çalışma',
    shortDesc: '50 dk çalış, 20 dk ödül molası. Dizi/oyun/müzik.',
  },
  {
    id: 'rule5217',
    name: '52/17 Kuralı',
    emoji: '⚡',
    icon: Brain,
    workMinutes: 52,
    breakMinutes: 17,
    longBreakMinutes: 25,
    longBreakAfter: 3,
    color: '#f59e0b',
    colorLight: '#fffbeb',
    colorMid: '#fef3c7',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    gradientLight: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    tagline: 'Ritmik Verimlilik',
    shortDesc: '52 dk odak, 17 dk tam dinlenme. Bilimsel ritim.',
  },
  {
    id: 'spaced',
    name: 'Aralıklı Tekrar',
    emoji: '🧠',
    icon: RefreshCw,
    workMinutes: 30,
    breakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfter: 4,
    color: '#10b981',
    colorLight: '#ecfdf5',
    colorMid: '#d1fae5',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    gradientLight: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    tagline: 'Spaced Repetition',
    shortDesc: '30 dk tekrar seansı, 5 dk mola. Ezber ve dil için.',
  },
];

// ── Method Selection Screen ────────────────────────────────────────────────
const MethodSelector = ({ onSelect, onGuide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.08))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99,
          padding: '0.4rem 1rem', marginBottom: '0.75rem',
          fontSize: '0.78rem', fontWeight: 700, color: '#6366f1'
        }}>
          <Sparkles size={14} /> ÇALIŞMA YÖNTEMİNİ SEÇ
        </div>
        <h3 style={{
          margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#1e293b',
          letterSpacing: '-0.02em'
        }}>
          Nasıl Çalışmak İstiyorsun?
        </h3>
        <p style={{ margin: '0.3rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
          Sana en uygun tekniği seç ve odaklanmaya başla
        </p>
      </div>

      {/* Method Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {STUDY_METHODS.map((method, idx) => {
          const IconComp = method.icon;
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.9rem 1rem', borderRadius: 16,
                background: method.colorLight,
                border: `1.5px solid ${method.color}25`,
                cursor: 'pointer', transition: 'all 0.25s',
                position: 'relative', overflow: 'hidden'
              }}
              whileHover={{ scale: 1.015, boxShadow: `0 6px 24px ${method.color}20` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(method)}
            >
              {/* Decorative glow */}
              <div style={{
                position: 'absolute', top: '50%', left: -30, transform: 'translateY(-50%)',
                width: 80, height: 80, borderRadius: '50%',
                background: `radial-gradient(circle, ${method.color}12, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: method.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px ${method.color}35`,
                flexShrink: 0, position: 'relative', zIndex: 1
              }}>
                <IconComp size={20} color="white" strokeWidth={2.5} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                    {method.emoji} {method.name}
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, color: method.color,
                    background: `${method.color}12`, padding: '0.15rem 0.45rem',
                    borderRadius: 6
                  }}>
                    {method.workMinutes}dk + {method.breakMinutes}dk
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  {method.shortDesc}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onGuide(method.id); }}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'white', border: `1.5px solid ${method.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: method.color, transition: 'all 0.2s'
                  }}
                  title="Bu yöntem nasıl çalışır?"
                >
                  <Info size={15} />
                </motion.button>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: method.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 2px 8px ${method.color}30`
                }}>
                  <Play size={14} color="white" fill="white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── Active Timer Screen ────────────────────────────────────────────────────
const ActiveTimer = ({ method, phase, secondsLeft, running, pomodoroCount, activeSeconds,
  onStart, onPause, onReset, onBack, todayStudyMinutes, formatTime, formatStudyTime, progress }) => {

  const circumferenceCard = 2 * Math.PI * 115;
  const circumferenceFocus = 2 * Math.PI * 155;
  const totalSeconds = phase === 'break' ? method.breakMinutes * 60 : method.workMinutes * 60;
  const todayTotalWithActive = todayStudyMinutes + (activeSeconds / 60);
  const IconComp = method.icon;

  const phaseConfig = {
    idle:  { label: 'Hazır',    emoji: '🎯', color: method.color },
    work:  { label: 'Çalışma', emoji: '📚', color: method.color },
    break: { label: 'Mola',    emoji: '☕', color: '#10b981' },
  };
  const cfg = phaseConfig[phase] || phaseConfig.idle;

  // ── ODAK (FOCUS) MODU: Çalışırken her yeri blurlayan tam ekran arayüz (createPortal) ──
  const focusOverlay = running && typeof document !== 'undefined' ? createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh',
        zIndex: 999999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(15, 23, 42, 0.75)',
        padding: '2rem'
      }}
    >
      {/* Üst Bilgi Rozeti */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        padding: '0.6rem 1.4rem', borderRadius: 30,
        color: 'white', fontWeight: 800, fontSize: '1rem',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        marginBottom: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        <span style={{ fontSize: '1.4rem' }}>{method.emoji}</span>
        <span>{method.name} — {cfg.label}</span>
        <span style={{ background: cfg.color, padding: '0.15rem 0.65rem', borderRadius: 12, fontSize: '0.8rem', marginLeft: '0.4rem' }}>
          {pomodoroCount} Seans
        </span>
      </div>

      {/* Devasa Kronometre (Focus Mode) */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5rem' }}>
        <svg width="360" height="360" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 25px ${cfg.color}50)` }}>
          <circle
            cx="180" cy="180" r="155" fill="none"
            stroke="rgba(255,255,255,0.12)" strokeWidth="14"
          />
          <motion.circle
            cx="180" cy="180" r="155" fill="none"
            stroke={cfg.color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={circumferenceFocus}
            strokeDashoffset={circumferenceFocus * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '3.2rem', lineHeight: 1, marginBottom: '0.2rem' }}>{cfg.emoji}</span>
          <span style={{
            fontSize: '5.2rem', fontWeight: 900,
            color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.04em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            {formatTime(secondsLeft)}
          </span>
          <span style={{ fontSize: '1.05rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.4rem' }}>
            {phase === 'work' ? `${method.workMinutes} dk tam odaklanma` : phase === 'break' ? `${method.breakMinutes} dk mola süresi` : method.name}
          </span>
        </div>
      </div>

      {/* Sadece Mola Ver Butonu */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 12px 35px rgba(245, 158, 11, 0.5)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onPause}
        style={{
          padding: '1.1rem 2.8rem', borderRadius: 50,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white', fontSize: '1.25rem', fontWeight: 800,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        <Pause size={24} fill="white" /> Mola Ver
      </motion.button>
    </motion.div>,
    document.body
  ) : null;

  // ── STANDART KART GÖRÜNÜMÜ ──
  return (
    <>
      {focusOverlay}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
      {/* Method Badge & Back */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.55rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0',
            background: 'white', color: '#475569',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)', transition: 'all 0.2s'
          }}
        >
          <ChevronLeft size={16} /> Yöntem Değiştir
        </motion.button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: 12,
          background: method.gradientLight,
          border: `1.5px solid ${method.color}35`
        }}>
          <IconComp size={16} color={method.color} />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: method.color }}>
            {method.name}
          </span>
        </div>
      </div>

      {/* Today's Study Time Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${method.color}12, ${method.color}06)`,
        border: `1.5px solid ${method.color}25`,
        borderRadius: 16, padding: '1rem 1.4rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: method.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${method.color}35`
        }}>
          <Clock size={22} color="white" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <span style={{
            fontSize: '0.78rem', color: '#64748b', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block'
          }}>
            Bugün Çalışılan Toplam Süre
          </span>
          <span style={{
            fontSize: '1.5rem', fontWeight: 900, color: method.color,
            fontFamily: 'monospace', letterSpacing: '0.03em'
          }}>
            {formatStudyTime(todayTotalWithActive)}
          </span>
        </div>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', padding: '0 0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {phase === 'break'
            ? <Coffee size={22} color={cfg.color} />
            : <BookOpen size={22} color={cfg.color} />
          }
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: cfg.color }}>
            {method.name} — {cfg.label}
          </h3>
        </div>
        <span style={{
          background: `${method.color}15`, color: method.color,
          padding: '0.35rem 0.9rem', borderRadius: 20,
          fontSize: '0.85rem', fontWeight: 800, border: `1px solid ${method.color}25`
        }}>
          {method.emoji} {pomodoroCount} seans tamamlandı
        </span>
      </div>

      {/* Circular Progress (Geniş & Büyük Kronometre) */}
      <div style={{
        position: 'relative', display: 'flex',
        justifyContent: 'center', marginBottom: '1.75rem', padding: '0.5rem 0'
      }}>
        <svg width="270" height="270" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="135" cy="135" r="115" fill="none"
            stroke={`${cfg.color}18`} strokeWidth="12"
          />
          <motion.circle
            cx="135" cy="135" r="115" fill="none"
            stroke={cfg.color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumferenceCard}
            strokeDashoffset={circumferenceCard * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2.6rem', lineHeight: 1, marginBottom: '0.15rem' }}>{cfg.emoji}</span>
          <span style={{
            fontSize: '3.5rem', fontWeight: 900,
            color: cfg.color, fontFamily: 'monospace', letterSpacing: '0.04em'
          }}>
            {formatTime(secondsLeft)}
          </span>
          <span style={{ fontSize: '0.92rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>
            {phase === 'work' ? `${method.workMinutes} dk çalışma süresi` : phase === 'break' ? `${method.breakMinutes} dk mola süresi` : method.name}
          </span>
        </div>
      </div>

      {/* Phase info when break & idle */}
      {phase === 'break' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 14, padding: '0.85rem 1.2rem', marginBottom: '1.25rem',
            fontSize: '0.98rem', color: '#059669', fontWeight: 700, textAlign: 'center'
          }}
        >
          ☕ Mola zamanı! Başlamak veya devam etmek için ▶ butonuna bas!
        </motion.div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '520px', margin: '0 auto' }}>
        <button
          className="btn btn-primary"
          onClick={onStart}
          style={{
            flex: 2, minWidth: 200, padding: '1rem 1.5rem',
            background: method.gradient, fontSize: '1.1rem',
            fontWeight: 800, border: 'none', color: 'white', borderRadius: 14,
            boxShadow: `0 6px 20px ${method.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            cursor: 'pointer'
          }}
        >
          <Play size={20} fill="white" />
          {phase === 'idle' ? 'Çalışmaya Başla' : phase === 'break' ? 'Molaya Başla' : 'Devam Et'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onReset}
          title="Sıfırla"
          style={{
            flex: 1, minWidth: 130, padding: '1rem', borderRadius: 14,
            fontWeight: 700, fontSize: '1rem', background: '#f1f5f9', color: '#475569',
            border: '1px solid #cbd5e1', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <RotateCcw size={18} /> Sıfırla
        </button>
      </div>

      {/* Tip */}
      <p style={{ margin: '1.2rem 0 0', fontSize: '0.88rem', color: '#64748b', textAlign: 'center', fontWeight: 500 }}>
        {phase === 'idle' && `${method.name}: ${method.workMinutes} dk çalış, ${method.breakMinutes} dk mola ver`}
        {phase === 'work' && '⏸ Duraklatıldı. Odaklanmaya hazır olduğunda devam et.'}
        {phase === 'break' && '✅ Çalışma seansı tamamlandı! Molanı hak ettin.'}
      </p>
    </motion.div>
  </>
  );
};

// ── Main PomodoroTimer Component ──────────────────────────────────────────
const PomodoroTimer = forwardRef(({ onSessionStart, onSessionEnd, onSessionStop, onRunningChange, todayStudyMinutes = 0, onNavigateGuide, onMethodChange }, ref) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const intervalRef = useRef(null);
  const notifiedRef = useRef(false);
  const activeIntervalRef = useRef(null);

  const workSec = selectedMethod ? selectedMethod.workMinutes * 60 : 25 * 60;
  const breakSec = selectedMethod ? selectedMethod.breakMinutes * 60 : 5 * 60;

  useEffect(() => {
    if (onRunningChange) onRunningChange(running);
  }, [running, onRunningChange]);

  useEffect(() => {
    if (onMethodChange) onMethodChange(selectedMethod);
  }, [selectedMethod, onMethodChange]);

  useEffect(() => {
    if (running && phase === 'work') {
      activeIntervalRef.current = setInterval(() => {
        setActiveSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(activeIntervalRef.current);
      if (phase === 'idle') setActiveSeconds(0);
    }
    return () => clearInterval(activeIntervalRef.current);
  }, [running, phase]);

  const totalSeconds = phase === 'break' ? breakSec : workSec;
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatStudyTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.round((totalMinutes % 1) * 60);
    if (h > 0) return `${h}sa ${m}dk ${s}sn`;
    return `${m}dk ${s}sn`;
  };

  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const handleWorkDone = useCallback(() => {
    stopTimer();
    playBeep('workDone');
    notifiedRef.current = false;
    setPomodoroCount(c => c + 1);
    if (onSessionEnd) onSessionEnd(selectedMethod, { completed: true, actualMinutes: selectedMethod?.workMinutes || 25 });
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification && typeof window.Notification.permission !== 'undefined' && window.Notification.permission === 'granted') {
        new window.Notification('⏸ Mola zamanı!', {
          body: `${selectedMethod?.workMinutes || 25} dk tamamlandı! ${selectedMethod?.breakMinutes || 5} dakika mola ver.`,
          icon: '/favicon.ico'
        });
      }
    } catch (e) { console.warn('Bildirim gönderilemedi:', e); }
    setPhase('break');
    setSecondsLeft(breakSec);
  }, [stopTimer, onSessionEnd, selectedMethod, breakSec]);

  const handleBreakDone = useCallback(() => {
    stopTimer();
    playBeep('breakDone');
    notifiedRef.current = false;
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification && typeof window.Notification.permission !== 'undefined' && window.Notification.permission === 'granted') {
        new window.Notification('📚 Derse Dönme Zamanı!', {
          body: `${selectedMethod?.breakMinutes || 5} dk mola bitti! Çalışmaya devam et.`,
          icon: '/favicon.ico'
        });
      }
    } catch (e) { console.warn('Bildirim gönderilemedi:', e); }
    setPhase('idle');
    setSecondsLeft(workSec);
    setActiveSeconds(0);
  }, [stopTimer, selectedMethod, workSec]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (phase === 'work') handleWorkDone();
          else if (phase === 'break') handleBreakDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase, handleWorkDone, handleBreakDone]);

  const handleStart = () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification && typeof window.Notification.permission !== 'undefined' && window.Notification.permission === 'default') {
        if (typeof window.Notification.requestPermission === 'function') {
          window.Notification.requestPermission().catch(() => {});
        }
      }
    } catch (e) { console.warn('Bildirim izni alınamadı:', e); }
    try { playBeep('start'); } catch (e) {}
    if (phase === 'idle') {
      setPhase('work');
      setSecondsLeft(workSec);
      setActiveSeconds(0);
    }
    setRunning(true);
    if (onSessionStart) {
      try { onSessionStart(); } catch (e) { console.error('onSessionStart hatası:', e); }
    }
  };

  const recordPartialIfAny = () => {
    if (phase === 'work' && activeSeconds >= 30) {
      const elapsedMins = parseFloat((activeSeconds / 60).toFixed(1));
      if (onSessionEnd && elapsedMins >= 0.5) {
        onSessionEnd(selectedMethod, { completed: false, actualMinutes: elapsedMins });
      }
    }
  };

  const handleReset = () => {
    recordPartialIfAny();
    stopTimer();
    setPhase('idle');
    setSecondsLeft(workSec);
    setActiveSeconds(0);
    notifiedRef.current = false;
    if (onSessionStop) onSessionStop();
  };

  const handlePause = () => {
    stopTimer();
    if (onSessionStop) onSessionStop();
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      recordPartialIfAny();
      stopTimer();
      setPhase('idle');
      setSecondsLeft(workSec);
      setActiveSeconds(0);
      notifiedRef.current = false;
    }
  }));

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setPhase('idle');
    setSecondsLeft(method.workMinutes * 60);
    setActiveSeconds(0);
    setPomodoroCount(0);
  };

  const handleBack = () => {
    if (running) return;
    recordPartialIfAny();
    handleReset();
    setSelectedMethod(null);
  };

  const handleGuide = (methodId) => {
    if (onNavigateGuide) onNavigateGuide(methodId);
  };

  const currentMethod = selectedMethod || STUDY_METHODS[0];

  return (
    <div className="card" style={{
      background: selectedMethod ? currentMethod.colorLight : '#fafbff',
      border: `1.5px solid ${selectedMethod ? `${currentMethod.color}25` : 'rgba(99,102,241,0.12)'}`,
      textAlign: 'center',
      padding: '1.5rem 1rem',
    }}>
      <AnimatePresence mode="wait">
        {!selectedMethod ? (
          <MethodSelector
            key="selector"
            onSelect={handleSelectMethod}
            onGuide={handleGuide}
          />
        ) : (
          <ActiveTimer
            key="timer"
            method={currentMethod}
            phase={phase}
            secondsLeft={secondsLeft}
            running={running}
            pomodoroCount={pomodoroCount}
            activeSeconds={activeSeconds}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onBack={handleBack}
            todayStudyMinutes={todayStudyMinutes}
            formatTime={formatTime}
            formatStudyTime={formatStudyTime}
            progress={progress}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export default PomodoroTimer;
export { STUDY_METHODS };
