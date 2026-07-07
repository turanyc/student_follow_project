import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

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

const WORK_SEC = 50 * 60;   // 50 dk
const BREAK_SEC = 10 * 60;  // 10 dk

const PomodoroTimer = forwardRef(({ onSessionStart, onSessionEnd, onSessionStop, onRunningChange }, ref) => {
  const [phase, setPhase] = useState('idle');       // idle | work | break | done
  const [secondsLeft, setSecondsLeft] = useState(WORK_SEC);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (onRunningChange) {
      onRunningChange(running);
    }
  }, [running, onRunningChange]);

  const totalSeconds = phase === 'break' ? BREAK_SEC : WORK_SEC;
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 70; // r=70

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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
    if (onSessionEnd) onSessionEnd();
    // Show browser notification if allowed
    if (Notification.permission === 'granted') {
      new Notification('⏸ Mola zamanı!', {
        body: '50 dk tamamlandı! 10 dakika mola ver.',
        icon: '/favicon.ico'
      });
    }
    setPhase('break');
    setSecondsLeft(BREAK_SEC);
  }, [stopTimer, onSessionEnd]);

  const handleBreakDone = useCallback(() => {
    stopTimer();
    playBeep('breakDone');
    notifiedRef.current = false;
    if (Notification.permission === 'granted') {
      new Notification('📚 Derse Dönme Zamanı!', {
        body: '10 dk mola bitti! Çalışmaya devam et.',
        icon: '/favicon.ico'
      });
    }
    setPhase('idle');
    setSecondsLeft(WORK_SEC);
  }, [stopTimer]);

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
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    playBeep('start');
    if (phase === 'idle') {
      setPhase('work');
      setSecondsLeft(WORK_SEC);
    }
    setRunning(true);
    if (onSessionStart) onSessionStart();
  };

  const handleReset = () => {
    stopTimer();
    setPhase('idle');
    setSecondsLeft(WORK_SEC);
    notifiedRef.current = false;
    if (onSessionStop) onSessionStop();
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      stopTimer();
      setPhase('idle');
      setSecondsLeft(WORK_SEC);
      notifiedRef.current = false;
    }
  }));

  const handlePause = () => {
    handleReset();
  };

  const handleStartBreak = () => {
    setRunning(true);
  };

  const phaseConfig = {
    idle:  { label: 'Hazır', color: '#6366f1', bg: 'rgba(99,102,241,0.06)', emoji: '🎯' },
    work:  { label: 'Çalışma', color: '#6366f1', bg: 'rgba(99,102,241,0.06)', emoji: '📚' },
    break: { label: 'Mola', color: '#10b981', bg: 'rgba(16,185,129,0.06)', emoji: '☕' },
  };
  const cfg = phaseConfig[phase] || phaseConfig.idle;

  return (
    <div className="card" style={{
      background: cfg.bg,
      border: `1.5px solid ${cfg.color}25`,
      textAlign: 'center',
      padding: '1.5rem 1rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {phase === 'break' ? <Coffee size={18} color={cfg.color} /> : <BookOpen size={18} color={cfg.color} />}
          <h3 style={{ margin: 0, fontSize: '1rem', color: cfg.color }}>
            Pomodoro — {cfg.label}
          </h3>
        </div>
        <span style={{
          background: `${cfg.color}15`, color: cfg.color,
          padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700
        }}>
          🍅 {pomodoroCount} tamamlandı
        </span>
      </div>

      {/* Circular Progress */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke={`${cfg.color}18`}
            strokeWidth="8"
          />
          {/* Progress */}
          <motion.circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke={cfg.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        {/* Center Text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2rem', lineHeight: 1 }}>{cfg.emoji}</span>
          <span style={{
            fontSize: '1.6rem', fontWeight: 800,
            color: cfg.color, fontFamily: 'monospace', letterSpacing: '0.05em'
          }}>
            {formatTime(secondsLeft)}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>
            {phase === 'work' ? '50 dk çalışma' : phase === 'break' ? '10 dk mola' : 'Pomodoro'}
          </span>
        </div>
      </div>

      {/* Phase info */}
      {phase === 'break' && !running && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 10, padding: '0.6rem 1rem', marginBottom: '0.75rem',
            fontSize: '0.85rem', color: '#059669', fontWeight: 600
          }}
        >
          ☕ Molaya başlamak için ▶ butonuna bas!
        </motion.div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!running ? (
          <button
            className="btn btn-primary"
            onClick={handleStart}
            style={{ flex: 1, minWidth: 140, background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 700 }}
          >
            <Play size={16} />
            {phase === 'idle' ? 'Pomodoroyu Başlat' : phase === 'break' ? 'Molaya Başla' : 'Devam Et'}
          </button>
        ) : (
          <>
            <button
              className="btn"
              onClick={handlePause}
              style={{ flex: 1, minWidth: 120, background: '#f59e0b', color: 'white', fontWeight: 700, border: 'none' }}
              title="Geçici olarak duraklat veya mola ver"
            >
              <Pause size={16} /> Mola Ver
            </button>
            <button
              className="btn"
              onClick={handleReset}
              style={{ flex: 1, minWidth: 140, background: '#ef4444', color: 'white', fontWeight: 700, border: 'none' }}
              title="Çalışmayı sonlandır ve kronometreyi sıfırla"
            >
              <RotateCcw size={15} /> Çalışmayı Sonlandır
            </button>
          </>
        )}
        {!running && (
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            title="Sıfırla"
            style={{ padding: '0.65rem 0.9rem', fontWeight: 700 }}
          >
            <RotateCcw size={15} /> Sıfırla
          </button>
        )}
      </div>

      {/* Tip */}
      <p style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
        {phase === 'idle' && 'Pomodoro: 50 dk çalış, 10 dk mola ver'}
        {phase === 'work' && running && '💪 Harika! Odaklanmaya devam et.'}
        {phase === 'work' && !running && '⏸ Duraklatıldı. Hazır olduğunda devam et.'}
        {phase === 'break' && running && '☕ Dinlen, gözlerini dinlendir.'}
        {phase === 'break' && !running && '✅ Çalışma bitti! Molanı hak ettin.'}
      </p>
    </div>
  );
});

export default PomodoroTimer;
