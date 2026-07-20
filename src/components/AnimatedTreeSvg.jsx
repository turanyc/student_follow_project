import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTreeSvg = ({ level = 0, points = 0, animated = true, className = "" }) => {
  const lvl = Number(level) || 0;
  const pts = Number(points) || 0;
  const isGold = lvl >= 5;
  const particleCount = Math.min(20, Math.max(3, Math.floor(pts || (lvl * 30 + 5))));

  return (
    <svg viewBox="-25 -25 250 240" width="100%" height="100%" style={{ overflow: 'visible' }} className={className || (animated && lvl > 1 ? "tree-sway" : "")}>
      <defs>
        <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="leafGradPremium" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="leafGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="leafGradSage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="leafGradDeepForest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="leafGradRoyalGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="leafGradGoldenForest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#4ade80" />
          <stop offset="70%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ground & Halo */}
      {isGold && (
        <ellipse cx="100" cy="180" rx="80" ry="14" fill="rgba(234, 179, 8, 0.25)" filter={animated ? "url(#glow)" : undefined} />
      )}
      <ellipse cx="100" cy="180" rx="60" ry="10" fill={isGold ? "rgba(202, 138, 4, 0.4)" : "rgba(16, 185, 129, 0.2)"} />

      {/* Dynamic Orbiting Energy Spheres reacting to level/points (Only when animated or render few static dots without filter) */}
      {animated && Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i * 360) / particleCount;
        const rad = (angle * Math.PI) / 180;
        const dist = 55 + (i % 3) * 20;
        const px = 100 + Math.cos(rad) * dist;
        const py = 100 + Math.sin(rad) * (dist * 0.7);
        return (
          <motion.circle
            key={`particle-${i}-${lvl}`}
            cx={px} cy={py} r={2.5 + (i % 3)}
            fill={isGold ? "#fbbf24" : "#10b981"}
            filter="url(#glow)"
            animate={{
              y: [0, -12, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.4, 0.8]
            }}
            transition={{
              duration: 2 + (i % 3) * 0.7,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        );
      })}
      {!animated && Array.from({ length: Math.min(4, particleCount) }).map((_, i) => {
        const angle = (i * 360) / 4;
        const rad = (angle * Math.PI) / 180;
        const dist = 60;
        const px = 100 + Math.cos(rad) * dist;
        const py = 100 + Math.sin(rad) * (dist * 0.7);
        return (
          <circle key={`static-particle-${i}`} cx={px} cy={py} r={2.5} fill={isGold ? "#fbbf24" : "#10b981"} opacity={0.6} />
        );
      })}

      {/* Dynamic Growth / Pulse wrapper */}
      <motion.g
        key={`tree-evolution-${lvl}`}
        initial={{ scale: animated ? 0.88 : 1, opacity: animated ? 0.8 : 1 }}
        animate={animated ? { scale: [0.94, 1.06, 1], rotate: [-1.5, 1.5, 0] } : undefined}
        style={{ originX: '100px', originY: '170px' }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* Level 0: Tohum (Seed) */}
        {lvl === 0 && (
          <motion.g animate={animated ? { y: [-2, 2, -2] } : undefined} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <circle cx="100" cy="175" r="14" fill="#a7f3d0" filter={animated ? "url(#glow)" : undefined} />
            <circle cx="100" cy="175" r="8" fill="#10b981" />
            <path d="M100 167 Q95 152 98 145 Q102 152 100 167" fill="url(#leafGrad)" />
          </motion.g>
        )}

        {/* Level 1: Filiz (Sprout) */}
        {lvl === 1 && (
          <motion.g animate={animated ? { rotate: [-3, 3, -3], y: [-3, 3, -3] } : undefined} style={{ originX: '100px', originY: '180px' }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
            <path d="M96 180 Q98 140 100 120" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <motion.path
              d="M98 140 Q70 125 65 145 Q80 155 98 140 Z"
              fill="url(#leafGrad)"
              filter={animated ? "url(#glow)" : undefined}
              animate={animated ? { rotate: [-4, 4, -4] } : undefined}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M100 125 Q130 105 138 125 Q120 140 100 125 Z"
              fill="url(#leafGradPremium)"
              filter={animated ? "url(#glow)" : undefined}
              animate={animated ? { rotate: [4, -4, 4] } : undefined}
              transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="100" cy="118" r="8" fill="#34d399" filter={animated ? "url(#glow)" : undefined} />
            <circle cx="100" cy="118" r="4" fill="#a7f3d0" />
          </motion.g>
        )}

        {/* Level 2: Fidan (Young Sapling) */}
        {lvl === 2 && (
          <motion.g animate={animated ? { rotate: [-2.5, 2.5, -2.5], y: [-3, 3, -3] } : undefined} style={{ originX: '100px', originY: '160px' }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            <path d="M94 180 L96 110 L104 110 L106 180 Z" fill="url(#trunkGrad)" />
            <path d="M96 145 Q78 130 68 132" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M104 135 Q122 120 132 122" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="100" cy="100" r="28" fill="url(#leafGradPremium)" filter={animated ? "url(#glow)" : undefined} />
            <circle cx="66" cy="130" r="18" fill="url(#leafGrad)" />
            <circle cx="134" cy="120" r="18" fill="url(#leafGrad)" />
            <circle cx="85" cy="90" r="15" fill="#34d399" opacity="0.85" />
            <circle cx="115" cy="90" r="15" fill="#34d399" opacity="0.85" />
          </motion.g>
        )}

        {/* Level 3: Genç Ağaç */}
        {lvl === 3 && (
          <motion.g initial={animated ? { opacity: 0, scale: 0.8 } : undefined} animate={animated ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1 }}>
            <path d="M92 180 L94 90 L106 90 L108 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-2.5, 2.5, -2.5], y: [-2, 2, -2] } : undefined} style={{ originX: '100px', originY: '130px' }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
              <path d="M94 120 Q80 100 70 100" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M106 130 Q120 110 130 110" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="100" cy="80" r="35" fill="url(#leafGradPremium)" />
              <circle cx="65" cy="95" r="20" fill="url(#leafGrad)" />
              <circle cx="135" cy="105" r="20" fill="url(#leafGrad)" />
            </motion.g>
          </motion.g>
        )}

        {/* Level 4: Gür Ağaç */}
        {lvl === 4 && (
          <motion.g initial={animated ? { opacity: 0 } : undefined} animate={animated ? { opacity: 1 } : undefined} transition={{ duration: 1.2 }}>
            <path d="M90 180 L92 60 L108 60 L110 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-2.2, 2.2, -2.2], y: [-2.5, 2.5, -2.5] } : undefined} style={{ originX: '100px', originY: '120px' }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <path d="M92 140 Q60 110 50 100" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M108 120 Q140 90 150 80" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M96 90 Q70 60 60 50" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M104 80 Q130 50 140 40" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="100" cy="50" r="45" fill="url(#leafGradPremium)" />
              <circle cx="50" cy="80" r="35" fill="url(#leafGrad)" />
              <circle cx="150" cy="70" r="35" fill="url(#leafGrad)" />
              <circle cx="65" cy="45" r="30" fill="url(#leafGradPremium)" />
              <circle cx="135" cy="40" r="30" fill="url(#leafGradPremium)" />
            </motion.g>
          </motion.g>
        )}

        {/* Level 5: Köklü Çınar (Deep-Rooted Plane Tree with Strong Root Base & Unified Emerald Canopy) */}
        {lvl === 5 && (
          <motion.g initial={animated ? { opacity: 0 } : undefined} animate={animated ? { opacity: 1 } : undefined} transition={{ duration: 1.5 }}>
            {/* Prominent spreading roots base */}
            <path d="M75 180 Q85 130 90 60 L110 60 Q115 130 125 180 Z" fill="url(#trunkGrad)" />
            <path d="M78 165 Q55 175 40 180 M122 165 Q145 175 160 180" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <motion.g animate={animated ? { rotate: [-1.8, 1.8, -1.8], y: [-2.5, 2.5, -2.5] } : undefined} style={{ originX: '100px', originY: '110px' }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
              <circle cx="100" cy="70" r="82" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 6" filter={animated ? "url(#glow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 70" to="360 100 70" dur="20s" repeatCount="indefinite" />}
              </circle>
              {/* Main plane tree branches */}
              <path d="M90 120 Q55 95 40 85" stroke="url(#trunkGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M110 120 Q145 95 160 85" stroke="url(#trunkGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
              {/* Unified broad emerald plane tree crown */}
              <circle cx="100" cy="55" r="58" fill="url(#leafGradPremium)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="50" cy="72" r="44" fill="url(#leafGradDeepForest)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="150" cy="72" r="44" fill="url(#leafGradDeepForest)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="100" cy="22" r="36" fill="url(#leafGradGold)" opacity="0.85" filter={animated ? "url(#goldGlow)" : undefined} />
            </motion.g>
            {/* Rising golden sparks from roots */}
            {animated ? [
              { cx: 75, cy: 35 }, { cx: 125, cy: 35 }, { cx: 55, cy: 55 }, { cx: 145, cy: 60 },
              { cx: 95, cy: 20 }, { cx: 70, cy: 80 }, { cx: 130, cy: 85 }
            ].map((s, idx) => (
              <circle key={idx} cx={s.cx} cy={s.cy} r={idx % 2 === 0 ? "4.5" : "3.5"} fill="#fef08a" filter="url(#goldGlow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + idx * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )) : [
              { cx: 75, cy: 35 }, { cx: 125, cy: 35 }, { cx: 55, cy: 55 }, { cx: 145, cy: 60 }
            ].map((s, idx) => (
              <circle key={idx} cx={s.cx} cy={s.cy} r="3" fill="#fef08a" opacity="0.8" />
            ))}
          </motion.g>
        )}

        {/* Level 6: Asırlık Çınar (Century Monument Plane Tree with Multi-Branch Structure & Tiered Golden-Green Cloud Canopies) */}
        {lvl === 6 && (
          <motion.g initial={animated ? { opacity: 0 } : undefined} animate={animated ? { opacity: 1 } : undefined} transition={{ duration: 1.5 }}>
            <path d="M82 180 L86 65 L114 65 L118 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-2, 2, -2], y: [-3, 3, -3] } : undefined} style={{ originX: '100px', originY: '110px' }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
              {/* Dual intersecting rings */}
              <ellipse cx="100" cy="75" rx="96" ry="54" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="10 6" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 75" to="360 100 75" dur="22s" repeatCount="indefinite" />}
              </ellipse>
              <circle cx="100" cy="75" r="80" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 8" filter={animated ? "url(#glow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="360 100 75" to="0 100 75" dur="16s" repeatCount="indefinite" />}
              </circle>
              {/* Multi-branched ancient crown skeleton */}
              <path d="M88 115 Q55 85 38 68" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M112 115 Q145 85 162 68" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M96 85 Q75 55 60 40" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M104 85 Q125 55 140 40" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M100 90 L100 35" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              {/* Distinct tiered cloud-like foliage clusters on every branch tip */}
              <circle cx="100" cy="32" r="42" fill="url(#leafGradGoldenForest)" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="55" cy="45" r="38" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="145" cy="45" r="38" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="28" cy="72" r="34" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="172" cy="72" r="34" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="100" cy="65" r="44" fill="url(#leafGradDeepForest)" filter={animated ? "url(#glow)" : undefined} />
            </motion.g>
            {/* Golden amber drops drifting from ancient branches */}
            {animated ? [
              { cx: 30, cy: 35 }, { cx: 170, cy: 35 }, { cx: 100, cy: -5 }, { cx: 60, cy: 55 },
              { cx: 140, cy: 55 }, { cx: 20, cy: 85 }, { cx: 180, cy: 85 }, { cx: 85, cy: 20 },
              { cx: 115, cy: 20 }, { cx: 100, cy: 45 }
            ].map((s, idx) => (
              <circle key={idx} cx={s.cx} cy={s.cy} r="4" fill="#fef08a" filter="url(#goldGlow)">
                <animate attributeName="r" values="2;6.5;2" dur={`${1.2 + idx * 0.2}s`} repeatCount="indefinite" />
              </circle>
            )) : [
              { cx: 30, cy: 35 }, { cx: 170, cy: 35 }, { cx: 100, cy: -5 }, { cx: 60, cy: 55 }
            ].map((s, idx) => (
              <circle key={idx} cx={s.cx} cy={s.cy} r="3.5" fill="#fef08a" opacity="0.8" />
            ))}
          </motion.g>
        )}

        {/* Level 7: Bilge Ağaç (Symmetrical Golden-Dome Wisdom Bonsai Tree) */}
        {lvl === 7 && (
          <motion.g initial={animated ? { opacity: 0, scale: 0.9 } : undefined} animate={animated ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1.8 }}>
            <path d="M84 180 L88 40 L112 40 L116 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-1.8, 1.8, -1.8], y: [-2.5, 2.5, -2.5] } : undefined} style={{ originX: '100px', originY: '110px' }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
              {/* Wisdom rings */}
              <circle cx="100" cy="80" r="95" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="12 6" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 80" to="360 100 80" dur="25s" repeatCount="indefinite" />}
              </circle>
              <circle cx="100" cy="80" r="75" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 8" filter={animated ? "url(#glow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="360 100 80" to="0 100 80" dur="18s" repeatCount="indefinite" />}
              </circle>
              {/* Curved scholar branches */}
              <path d="M88 130 Q45 90 25 75" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M112 120 Q155 90 175 75" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M92 80 Q65 45 50 35" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M108 70 Q135 45 150 35" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              {/* Central emerald dome with pure golden wisdom spheres on branch tips */}
              <circle cx="100" cy="50" r="62" fill="url(#leafGradSage)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="32" cy="65" r="46" fill="url(#leafGradGold)" opacity="0.95" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="168" cy="65" r="46" fill="url(#leafGradGold)" opacity="0.95" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="62" cy="28" r="38" fill="url(#leafGradPremium)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="138" cy="28" r="38" fill="url(#leafGradPremium)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="100" cy="12" r="34" fill="#fde047" opacity="0.85" filter={animated ? "url(#goldGlow)" : undefined} />
            </motion.g>
            {/* Ascending sparks of wisdom */}
            {animated ? [
              { cx: 30, cy: 30 }, { cx: 170, cy: 35 }, { cx: 100, cy: 5 }, { cx: 60, cy: 60 },
              { cx: 140, cy: 65 }, { cx: 20, cy: 100 }, { cx: 180, cy: 95 }, { cx: 85, cy: 20 },
              { cx: 115, cy: 20 }, { cx: 50, cy: 110 }, { cx: 150, cy: 110 }
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.cx}, ${p.cy})`}>
                <circle r="4.2" fill="#fef08a" filter="url(#goldGlow)">
                  <animate attributeName="r" values="2;6;2" dur={`${1.2 + idx * 0.2}s`} repeatCount="indefinite" />
                </circle>
                <path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke="#fbbf24" strokeWidth="1.6">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="180" dur={`${3 + idx * 0.5}s`} repeatCount="indefinite" />
                </path>
              </g>
            )) : [
              { cx: 30, cy: 30 }, { cx: 170, cy: 35 }, { cx: 100, cy: 5 }, { cx: 60, cy: 60 }, { cx: 140, cy: 65 }
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={p.cy} r="3" fill="#fef08a" opacity="0.8" />
            ))}
          </motion.g>
        )}

        {/* Level 8: Orman Ruhu (Weeping Forest Guardian with Cascading Foliage & Golden Spirit Core) */}
        {lvl === 8 && (
          <motion.g initial={animated ? { opacity: 0, scale: 0.85 } : undefined} animate={animated ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1.8 }}>
            <path d="M80 180 L85 35 L115 35 L120 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-2, 2, -2], y: [-3.5, 3.5, -3.5] } : undefined} style={{ originX: '100px', originY: '110px' }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
              {/* Guardian orbits */}
              <ellipse cx="100" cy="80" rx="108" ry="60" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="14 6" filter={animated ? "url(#emeraldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 80" to="360 100 80" dur="20s" repeatCount="indefinite" />}
              </ellipse>
              <circle cx="100" cy="80" r="86" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="6 6" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="360 100 80" to="0 100 80" dur="14s" repeatCount="indefinite" />}
              </circle>
              {/* Ancient knotted root trunk structure */}
              <path d="M85 130 Q25 85 12 70" stroke="url(#trunkGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M115 120 Q175 75 188 60" stroke="url(#trunkGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M88 80 Q45 35 30 25" stroke="url(#trunkGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M112 70 Q155 25 170 15" stroke="url(#trunkGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
              
              {/* THE GOLDEN SPIRIT CORE (Heart of the Forest) pulsing at the center of trunk */}
              <circle cx="100" cy="110" r="16" fill="#fbbf24" filter="url(#goldGlow)">
                {animated && <animate attributeName="r" values="14;19;14" dur="2.2s" repeatCount="indefinite" />}
              </circle>
              <circle cx="100" cy="110" r="9" fill="#ffffff" filter="url(#goldGlow)" />
              
              {/* Cascading weeping willow emerald canopy layers */}
              <ellipse cx="100" cy="38" rx="80" ry="46" fill="url(#leafGradDeepForest)" filter={animated ? "url(#emeraldGlow)" : undefined} />
              {/* Drooping weeping clusters on sides */}
              <ellipse cx="32" cy="68" rx="42" ry="58" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <ellipse cx="168" cy="60" rx="42" ry="58" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <ellipse cx="64" cy="24" rx="45" ry="36" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              <ellipse cx="136" cy="24" rx="45" ry="36" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="100" cy="5" r="38" fill="#fde047" opacity="0.85" filter={animated ? "url(#goldGlow)" : undefined} />
            </motion.g>
            {/* Dancing forest spirit fireflies */}
            {animated ? [
              { cx: 25, cy: 25 }, { cx: 175, cy: 30 }, { cx: 100, cy: -5 }, { cx: 55, cy: 55 },
              { cx: 145, cy: 60 }, { cx: 15, cy: 95 }, { cx: 185, cy: 90 }, { cx: 80, cy: 15 },
              { cx: 120, cy: 15 }, { cx: 45, cy: 105 }, { cx: 155, cy: 105 }, { cx: 100, cy: 45 }
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.cx}, ${p.cy})`}>
                <circle r="4.5" fill="#fef08a" filter="url(#goldGlow)">
                  <animate attributeName="r" values="2;7.5;2" dur={`${1 + idx * 0.18}s`} repeatCount="indefinite" />
                </circle>
                <path d="M -7 0 L 7 0 M 0 -7 L 0 7" stroke="#fbbf24" strokeWidth="1.8">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${2.5 + idx * 0.4}s`} repeatCount="indefinite" />
                </path>
              </g>
            )) : [
              { cx: 25, cy: 25 }, { cx: 175, cy: 30 }, { cx: 100, cy: -5 }, { cx: 55, cy: 55 }, { cx: 145, cy: 60 }
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={p.cy} r="3" fill="#fef08a" opacity="0.8" />
            ))}
          </motion.g>
        )}

        {/* Level 9: Hayat Ağacı (Wide-Canopy Yggdrasil Tree of Life - Horizontal Spread) */}
        {lvl === 9 && (
          <motion.g initial={animated ? { opacity: 0, scale: 0.85 } : undefined} animate={animated ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1.8 }}>
            <path d="M78 180 L84 35 L116 35 L122 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-1.8, 1.8, -1.8], y: [-3, 3, -3] } : undefined} style={{ originX: '100px', originY: '110px' }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
              {/* Horizontal orbiting elliptical halos */}
              <ellipse cx="100" cy="75" rx="125" ry="48" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="14 8" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 75" to="360 100 75" dur="20s" repeatCount="indefinite" />}
              </ellipse>
              <ellipse cx="100" cy="75" rx="105" ry="62" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="8 6" filter={animated ? "url(#glow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="360 100 75" to="0 100 75" dur="15s" repeatCount="indefinite" />}
              </ellipse>
              {/* Massive spreading branches */}
              <path d="M84 130 Q15 85 -5 70" stroke="url(#trunkGrad)" strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M116 130 Q185 85 205 70" stroke="url(#trunkGrad)" strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M88 85 Q35 40 15 30" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M112 85 Q165 40 185 30" stroke="url(#trunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M96 60 Q70 15 65 5" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M104 60 Q130 15 135 5" stroke="url(#trunkGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
              {/* Wide horizontally layered canopy clusters */}
              <ellipse cx="100" cy="50" rx="88" ry="56" fill="url(#leafGradDeepForest)" filter={animated ? "url(#glow)" : undefined} />
              <ellipse cx="22" cy="68" rx="60" ry="42" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <ellipse cx="178" cy="68" rx="60" ry="42" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <ellipse cx="58" cy="25" rx="50" ry="38" fill="url(#leafGradGoldenForest)" filter={animated ? "url(#goldGlow)" : undefined} />
              <ellipse cx="142" cy="25" rx="50" ry="38" fill="url(#leafGradGoldenForest)" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="100" cy="12" r="42" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
            </motion.g>
            {/* Golden fruits and energy orbs scattered across the wide canopy */}
            {animated ? [
              { cx: 10, cy: 35 }, { cx: 190, cy: 35 }, { cx: 100, cy: -12 }, { cx: 50, cy: 65 },
              { cx: 150, cy: 65 }, { cx: -5, cy: 75 }, { cx: 205, cy: 75 }, { cx: 72, cy: 15 },
              { cx: 128, cy: 15 }, { cx: 35, cy: 95 }, { cx: 165, cy: 95 }, { cx: 100, cy: 45 }, { cx: 100, cy: 80 }
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.cx}, ${p.cy})`}>
                <circle r="4.8" fill="#fef08a" filter="url(#goldGlow)">
                  <animate attributeName="r" values="2.5;7.5;2.5" dur={`${1 + idx * 0.15}s`} repeatCount="indefinite" />
                </circle>
                <path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke="#fbbf24" strokeWidth="2">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="180" dur={`${2 + idx * 0.3}s`} repeatCount="indefinite" />
                </path>
              </g>
            )) : [
              { cx: 10, cy: 35 }, { cx: 190, cy: 35 }, { cx: 100, cy: -12 }, { cx: 50, cy: 65 }, { cx: 150, cy: 65 }
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={p.cy} r="3.5" fill="#fef08a" opacity="0.8" />
            ))}
          </motion.g>
        )}

        {/* Level 10: Zirve Ağacı (Vertical Sacred Tiered Golden-Emerald Peak Tree with Crown Halo) */}
        {lvl >= 10 && (
          <motion.g initial={animated ? { opacity: 0, scale: 0.8 } : undefined} animate={animated ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 2 }}>
            <path d="M74 180 L80 20 L120 20 L126 180 Z" fill="url(#trunkGrad)" />
            <motion.g animate={animated ? { rotate: [-1.5, 1.5, -1.5], y: [-4, 4, -4] } : undefined} style={{ originX: '100px', originY: '100px' }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}>
              {/* Grand multi-directional intersecting orbits */}
              <circle cx="100" cy="75" r="118" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="18 8" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 75" to="360 100 75" dur="24s" repeatCount="indefinite" />}
              </circle>
              <ellipse cx="100" cy="75" rx="132" ry="52" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" filter={animated ? "url(#emeraldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="360 100 75" to="0 100 75" dur="16s" repeatCount="indefinite" />}
              </ellipse>
              <ellipse cx="100" cy="75" rx="55" ry="128" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="6 12" filter={animated ? "url(#goldGlow)" : undefined}>
                {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 75" to="-360 100 75" dur="20s" repeatCount="indefinite" />}
              </ellipse>
              {/* Ascending upward branch structure */}
              <path d="M80 130 Q30 90 10 75" stroke="url(#trunkGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M120 130 Q170 90 190 75" stroke="url(#trunkGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M84 90 Q45 50 30 35" stroke="url(#trunkGrad)" strokeWidth="13" strokeLinecap="round" fill="none" />
              <path d="M116 90 Q155 50 170 35" stroke="url(#trunkGrad)" strokeWidth="13" strokeLinecap="round" fill="none" />
              <path d="M92 50 Q75 10 70 -5" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M108 50 Q125 10 130 -5" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              
              {/* Tier 1 (Base Tier): Wide dense emerald foundation */}
              <ellipse cx="100" cy="85" rx="88" ry="46" fill="url(#leafGradDeepForest)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="28" cy="78" r="48" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              <circle cx="172" cy="78" r="48" fill="url(#leafGradRoyalGreen)" filter={animated ? "url(#glow)" : undefined} />
              
              {/* Tier 2 (Middle Tier): Ascending golden-emerald canopy */}
              <ellipse cx="100" cy="45" rx="72" ry="44" fill="url(#leafGradGoldenForest)" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="45" cy="40" r="44" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="155" cy="40" r="44" fill="url(#leafGradGold)" opacity="0.9" filter={animated ? "url(#goldGlow)" : undefined} />
              
              {/* Tier 3 (Peak Tier): Pure luminous golden pinnacle */}
              <circle cx="100" cy="5" r="46" fill="url(#leafGradGold)" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="75" cy="-5" r="32" fill="#fde047" opacity="0.95" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="125" cy="-5" r="32" fill="#fde047" opacity="0.95" filter={animated ? "url(#goldGlow)" : undefined} />
              <circle cx="100" cy="-25" r="36" fill="#fef08a" filter={animated ? "url(#goldGlow)" : undefined} />
              
              {/* Sacred Peak Crown Emblem & Halo atop the summit */}
              <g transform="translate(100, -45)">
                <circle r="18" fill="rgba(254, 240, 138, 0.4)" filter="url(#goldGlow)">
                  <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <polygon points="0,-18 6,-6 18,-6 9,2 13,15 0,7 -13,15 -9,2 -18,-6 -6,-6" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" filter="url(#goldGlow)">
                  {animated && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite" />}
                </polygon>
              </g>
            </motion.g>
            {/* Luminous sacred sparks surrounding the pinnacle tree */}
            {animated ? [
              { cx: 10, cy: 10 }, { cx: 190, cy: 10 }, { cx: 100, cy: -50 }, { cx: 40, cy: -20 },
              { cx: 160, cy: -20 }, { cx: 5, cy: 60 }, { cx: 195, cy: 60 }, { cx: 65, cy: 20 },
              { cx: 135, cy: 20 }, { cx: 30, cy: 105 }, { cx: 170, cy: 105 }, { cx: 100, cy: 30 },
              { cx: 100, cy: 70 }, { cx: 100, cy: 110 }
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.cx}, ${p.cy})`}>
                <circle r="5.2" fill="#ffffff" filter="url(#goldGlow)">
                  <animate attributeName="r" values="2;9;2" dur={`${0.8 + idx * 0.12}s`} repeatCount="indefinite" />
                </circle>
                <path d="M -9 0 L 9 0 M 0 -9 L 0 9" stroke="#fbbf24" strokeWidth="2.4">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="180" dur={`${1.5 + idx * 0.25}s`} repeatCount="indefinite" />
                </path>
              </g>
            )) : [
              { cx: 10, cy: 10 }, { cx: 190, cy: 10 }, { cx: 100, cy: -50 }, { cx: 40, cy: -20 }, { cx: 160, cy: -20 }
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={p.cy} r="4" fill="#ffffff" opacity="0.9" />
            ))}
          </motion.g>
        )}
      </motion.g>
    </svg>
  );
};

export default AnimatedTreeSvg;
