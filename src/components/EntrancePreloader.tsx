import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EntrancePreloaderProps {
  name: string;
  role: string;
  location: string;
  onComplete: () => void;
}

type SequencePhase = 'ignite' | 'bloom' | 'focus' | 'beam';

const GLITCH_GLYPHS = '01/_*+#<>[]{}—:=∆◊∑λΩ';

export const EntrancePreloader: React.FC<EntrancePreloaderProps> = ({
  name,
  role,
  location,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<SequencePhase>('ignite');
  const [isVisible, setIsVisible] = useState(true);

  const [firstName, ...restWords] = name.split(' ');
  const lastName = restWords.join(' ');

  // Displayed character arrays for the randomized letter-glitch effect
  const [displayFirst, setDisplayFirst] = useState<string[]>(() => [...firstName]);
  const [displayLast, setDisplayLast] = useState<string[]>(() => [...lastName]);
  const [glitchingFirst, setGlitchingFirst] = useState<boolean[]>(() =>
    Array(firstName.length).fill(false)
  );
  const [glitchingLast, setGlitchingLast] = useState<boolean[]>(() =>
    Array(lastName.length).fill(false)
  );

  // Main multi-phase timeline: ignite -> bloom (with glitch) -> focus -> SVG light beam sweep
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      setPhase('focus');
      setDisplayFirst([...firstName]);
      setDisplayLast([...lastName]);
      const t = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 250);
      }, 450);
      return () => clearTimeout(t);
    }

    const startTime = performance.now();
    const totalDuration = 3400; // 3.4s multi-phase orchestration including SVG beam sweep
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / totalDuration);

      // Counter reaches 100% right as focus locks (around 78% of total timeline)
      const countRaw = Math.min(1, raw / 0.78);
      const easedCount = 1 - Math.pow(1 - countRaw, 3.1);
      setProgress(Math.round(easedCount * 100));

      // Multi-phase state progression
      if (raw < 0.18) {
        setPhase('ignite');
      } else if (raw < 0.56) {
        setPhase('bloom');
      } else if (raw < 0.78) {
        setPhase('focus');
      } else {
        setPhase('beam');
      }

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 720);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [firstName, lastName, onComplete]);

  // Randomized letter-glitch effect during the bloom-to-sharp focus transition
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsedSec = (performance.now() - startTime) / 1000;

      // Update first name characters ('Saivinod')
      setDisplayFirst(
        [...firstName].map((targetChar, i) => {
          if (targetChar === ' ') return ' ';
          const charStart = 0.14 + i * 0.055;
          const lockTime = charStart + 0.92; // Locks into exact letter as sharp focus settles

          if (elapsedSec < charStart) {
            return GLITCH_GLYPHS[(i * 5) % GLITCH_GLYPHS.length];
          }
          if (elapsedSec < lockTime) {
            const progressToLock = (elapsedSec - charStart) / (lockTime - charStart);
            // Higher probability of random glyph early in bloom, tapering off to real letter
            if (Math.random() > progressToLock * 0.75) {
              const pool = GLITCH_GLYPHS + firstName.toUpperCase();
              return pool[Math.floor(Math.random() * pool.length)];
            }
          }
          return targetChar;
        })
      );

      setGlitchingFirst(
        [...firstName].map((_, i) => {
          const charStart = 0.14 + i * 0.055;
          const lockTime = charStart + 0.92;
          return elapsedSec >= charStart && elapsedSec < lockTime && Math.random() > 0.45;
        })
      );

      // Update last name characters ('Kotipalli')
      setDisplayLast(
        [...lastName].map((targetChar, i) => {
          if (targetChar === ' ') return ' ';
          const charStart = 0.52 + i * 0.055;
          const lockTime = charStart + 0.98;

          if (elapsedSec < charStart) {
            return GLITCH_GLYPHS[(i * 7 + 3) % GLITCH_GLYPHS.length];
          }
          if (elapsedSec < lockTime) {
            const progressToLock = (elapsedSec - charStart) / (lockTime - charStart);
            if (Math.random() > progressToLock * 0.75) {
              const pool = GLITCH_GLYPHS + lastName.toLowerCase();
              return pool[Math.floor(Math.random() * pool.length)];
            }
          }
          return targetChar;
        })
      );

      setGlitchingLast(
        [...lastName].map((_, i) => {
          const charStart = 0.52 + i * 0.055;
          const lockTime = charStart + 0.98;
          return elapsedSec >= charStart && elapsedSec < lockTime && Math.random() > 0.45;
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, [firstName, lastName]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 400);
  };

  // Vertical shift and optical lock based on current sequence phase
  const containerY =
    phase === 'ignite'
      ? 24
      : phase === 'bloom'
      ? 6
      : phase === 'focus'
      ? 0
      : -12;

  const containerScale =
    phase === 'ignite'
      ? 0.96
      : phase === 'bloom'
      ? 1.015
      : phase === 'focus'
      ? 1.0
      : 1.02;

  const isSharpLocked = phase === 'focus' || phase === 'beam';
  const isBeamSweeping = phase === 'beam';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="entrance-window"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(12px)',
            transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
          }}
          className={`entrance-overlay phase-${phase}`}
          role="dialog"
          aria-label={`${name} Portfolio Entrance`}
        >
          {/* Ambient radial glows & orbital SVG constellation */}
          <div className="entrance-bg" aria-hidden="true">
            <motion.div
              className="entrance-glow cyan"
              animate={{
                opacity: phase === 'bloom' ? 0.34 : isSharpLocked ? 0.22 : 0.14,
                scale: phase === 'bloom' ? 1.12 : 1,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="entrance-glow violet"
              animate={{
                opacity: phase === 'bloom' ? 0.32 : isSharpLocked ? 0.22 : 0.12,
                scale: phase === 'bloom' ? 1.1 : 1,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            <svg
              className="entrance-constellation"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="entGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.55" />
                </linearGradient>
                <radialGradient id="bloomCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.18" />
                  <stop offset="55%" stopColor="var(--violet)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Central optical aperture glow */}
              <motion.circle
                cx="600"
                cy="400"
                r="310"
                fill="url(#bloomCore)"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: phase === 'bloom' ? 1.15 : 1,
                  opacity: phase === 'bloom' ? 0.95 : 0.55,
                }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Concentric orbital precision rings */}
              <motion.circle
                cx="600"
                cy="400"
                r="230"
                fill="none"
                stroke="url(#entGrad1)"
                strokeWidth={isSharpLocked ? '1.1' : '0.7'}
                strokeDasharray="4 8"
                initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                animate={{
                  scale: isSharpLocked ? 1 : 0.95,
                  opacity: isSharpLocked ? 0.6 : 0.3,
                  rotate: phase === 'beam' ? 95 : 45,
                }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="600"
                cy="400"
                r="350"
                fill="none"
                stroke="rgba(236, 234, 228, 0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isSharpLocked ? 1 : 0.5 }}
                transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="600"
                cy="400"
                r="470"
                fill="none"
                stroke="rgba(236, 234, 228, 0.06)"
                strokeWidth="1"
                strokeDasharray="2 10"
                initial={{ scale: 1.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.2 }}
              />

              {/* Subtle architectural crosshairs */}
              <motion.line
                x1="120"
                y1="400"
                x2="1080"
                y2="400"
                stroke="rgba(236, 234, 228, 0.07)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.line
                x1="600"
                y1="80"
                x2="600"
                y2="720"
                stroke="rgba(236, 234, 228, 0.07)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Orbiting Cloud Nodes */}
              {[
                { cx: 370, cy: 400, label: 'AWS · VPC', color: 'var(--cyan)' },
                { cx: 830, cy: 400, label: 'AMAZON EKS', color: 'var(--violet)' },
                { cx: 600, cy: 170, label: 'TERRAFORM IaC', color: 'var(--cyan)' },
                { cx: 600, cy: 630, label: 'OBSERVABILITY · SRE', color: 'var(--ok)' },
              ].map((pt, idx) => (
                <motion.g
                  key={pt.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: isSharpLocked ? 1 : 0.55,
                    scale: isSharpLocked ? 1 : 0.9,
                  }}
                  transition={{ delay: 0.25 + idx * 0.12, duration: 0.75 }}
                >
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4"
                    fill="#07080b"
                    stroke={pt.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.cx + 10}
                    y={pt.cy + 3}
                    fill="rgba(236, 234, 228, 0.52)"
                    fontSize="9"
                    fontFamily="var(--mono)"
                    letterSpacing="0.14em"
                  >
                    {pt.label}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Top Bar inside Entrance Window */}
          <div className="entrance-top">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="entrance-brand"
            >
              <span className="entrance-monogram">SK</span>
              <span className="mono">PORTFOLIO EDITION · {new Date().getFullYear()}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="entrance-skip-wrap"
            >
              <span className="mono entrance-loc">{location}</span>
              <button
                type="button"
                onClick={handleSkip}
                className="entrance-skip mono"
                aria-label="Enter Portfolio Immediately"
              >
                Enter Now ↗
              </button>
            </motion.div>
          </div>

          {/* Multi-Phase Centerpiece: Staggered Letter Reveal + Glitch + Bloom-to-Sharp Focus */}
          <motion.div
            className="entrance-center"
            animate={{
              y: containerY,
              scale: containerScale,
              opacity: isBeamSweeping ? 0.15 : 1,
              filter: isBeamSweeping ? 'blur(10px) brightness(1.8)' : 'blur(0px) brightness(1)',
            }}
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Phase Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="entrance-pill"
            >
              <span className="dot" />
              <span className="mono">{role}</span>
              <span className="entrance-phase-tag mono">
                {phase === 'ignite'
                  ? '01 · IGNITE'
                  : phase === 'bloom'
                  ? '02 · GLITCH BLOOM'
                  : phase === 'focus'
                  ? '03 · FOCUS LOCK'
                  : '04 · BEAM REVEAL'}
              </span>
            </motion.div>

            {/* Multi-Phase Name Typography with Randomized Letter-Glitch */}
            <h1
              className={`entrance-title ${isSharpLocked ? 'is-sharp' : 'is-blooming'}`}
              aria-label={name}
            >
              {/* Line 1: Saivinod */}
              <span className="entrance-line1" aria-hidden="true">
                {displayFirst.map((char, i) => (
                  <motion.span
                    key={`fn-${i}`}
                    initial={{
                      opacity: 0,
                      y: '72%',
                      scale: 1.14,
                      filter: 'blur(22px) brightness(2.1)',
                    }}
                    animate={{
                      opacity: [0, 0.92, 1],
                      y: ['72%', '-5%', '0%'],
                      scale: [1.14, 1.03, 1],
                      filter: [
                        'blur(22px) brightness(2.1)',
                        'blur(6px) brightness(1.45)',
                        'blur(0px) brightness(1)',
                      ],
                    }}
                    transition={{
                      duration: 1.15,
                      times: [0, 0.62, 1],
                      delay: 0.12 + i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`entrance-char ${glitchingFirst[i] ? 'is-glitching' : ''}`}
                    data-glyph={char}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>

              {/* Line 2: Kotipalli */}
              <span className="entrance-line2" aria-hidden="true">
                {displayLast.map((char, i) => (
                  <motion.span
                    key={`ln-${i}`}
                    initial={{
                      opacity: 0,
                      y: '78%',
                      scale: 1.16,
                      filter: 'blur(26px) brightness(2.3)',
                    }}
                    animate={{
                      opacity: [0, 0.9, 1],
                      y: ['78%', '-4%', '0%'],
                      scale: [1.16, 1.04, 1],
                      filter: [
                        'blur(26px) brightness(2.3)',
                        'blur(7px) brightness(1.5)',
                        'blur(0px) brightness(1)',
                      ],
                    }}
                    transition={{
                      duration: 1.25,
                      times: [0, 0.64, 1],
                      delay: 0.5 + i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`entrance-char serif-accent ${
                      glitchingLast[i] ? 'is-glitching' : ''
                    }`}
                    data-glyph={char}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Optical Focus Line & Subtitle */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: isSharpLocked ? 1 : 0.65,
                scaleX: isSharpLocked ? 1 : 0.45,
              }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="entrance-rule"
            />

            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{
                opacity: isSharpLocked ? 1 : 0.4,
                y: isSharpLocked ? 0 : 8,
                filter: isSharpLocked ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="entrance-sub"
            >
              Site Reliability Engineering · Cloud Infrastructure · Terraform &amp; Kubernetes Automation
            </motion.p>
          </motion.div>

          {/* Bottom Progress & Phase Telemetry Bar */}
          <div className="entrance-bottom">
            <div className="entrance-progress-meta">
              <div className="entrance-phase-steps mono">
                <span className={phase === 'ignite' ? 'active' : 'done'}>01 IGNITE</span>
                <span className="sep">/</span>
                <span
                  className={
                    phase === 'bloom'
                      ? 'active'
                      : phase === 'focus' || phase === 'beam'
                      ? 'done'
                      : ''
                  }
                >
                  02 GLITCH BLOOM
                </span>
                <span className="sep">/</span>
                <span className={phase === 'focus' ? 'active' : phase === 'beam' ? 'done' : ''}>
                  03 SHARP FOCUS
                </span>
                <span className="sep">/</span>
                <span className={phase === 'beam' ? 'active' : ''}>04 BEAM REVEAL</span>
              </div>

              <span className="entrance-counter">
                {String(progress).padStart(2, '0')}
                <em>%</em>
              </span>
            </div>
            <div className="entrance-bar-track">
              <div
                className="entrance-bar-fill"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
          </div>

          {/* SVG Light Beam Sweep that cuts across the screen once the sequence finishes */}
          <svg
            className={`entrance-beam-svg ${isBeamSweeping ? 'active' : ''}`}
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="beamCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="22%" stopColor="var(--violet)" stopOpacity="0.38" />
                <stop offset="46%" stopColor="var(--cyan)" stopOpacity="0.88" />
                <stop offset="53%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="62%" stopColor="var(--cyan)" stopOpacity="0.72" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="beamWakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--bg)" stopOpacity="0.98" />
                <stop offset="72%" stopColor="var(--bg)" stopOpacity="0.92" />
                <stop offset="92%" stopColor="var(--cyan)" stopOpacity="0.38" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
              <filter id="beamGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="16" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Luminous trailing wake that floods the viewport into the main page tone */}
            <motion.polygon
              points="-1800,-200 100,-200 -150,1100 -2050,1100"
              fill="url(#beamWakeGrad)"
              initial={{ x: -200, opacity: 0 }}
              animate={
                isBeamSweeping
                  ? { x: 3400, opacity: [0, 1, 1] }
                  : { x: -200, opacity: 0 }
              }
              transition={{ duration: 0.82, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* Primary angled SVG light beam blade */}
            <motion.g
              filter="url(#beamGlowFilter)"
              initial={{ x: -450, opacity: 0 }}
              animate={
                isBeamSweeping
                  ? { x: 2350, opacity: [0, 1, 1, 0.9] }
                  : { x: -450, opacity: 0 }
              }
              transition={{ duration: 0.78, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* Wide cyan/violet aura */}
              <polygon
                points="-220,-200 220,-200 -40,1100 -480,1100"
                fill="url(#beamCoreGrad)"
              />
              {/* Razor-sharp white optical core */}
              <polygon
                points="-14,-200 18,-200 -242,1100 -274,1100"
                fill="#ffffff"
                opacity="0.95"
              />
              {/* Secondary harmonic refraction line */}
              <polygon
                points="46,-200 54,-200 -206,1100 -214,1100"
                fill="var(--cyan)"
                opacity="0.85"
              />
            </motion.g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
