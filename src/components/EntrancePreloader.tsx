import React, { useState, useEffect, useRef, useCallback } from 'react';

interface EntrancePreloaderProps {
  onComplete: () => void;
}

const TARGET_NAME = 'Saivinod Kotipalli';
const TARGET_ROLE = 'AWS DEVOPS ENGINEER • CLOUD ARCHITECT';
const GLYPHS = '01<>!@#$%^&*()_+=[]{}|;:~XΩ∑∆λψ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const EntrancePreloader: React.FC<EntrancePreloaderProps> = ({ onComplete }) => {
  // Phases: 'init' -> 'bloom' -> 'glitch' -> 'locked' -> 'beamSweep' -> 'complete'
  const [phase, setPhase] = useState<'init' | 'bloom' | 'glitch' | 'locked' | 'beamSweep' | 'complete'>('init');
  const [displayChars, setDisplayChars] = useState<
    { target: string; current: string; isLocked: boolean; isFlashing: boolean }[]
  >(() =>
    TARGET_NAME.split('').map((char) => ({
      target: char,
      current: char === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      isLocked: false,
      isFlashing: false,
    }))
  );
  const [progress, setProgress] = useState(0);
  const [beamActive, setBeamActive] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const completedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [onComplete]);

  // Reduced motion preference check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (rm) {
        handleFinish();
      }
    }
  }, [handleFinish]);

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFinish]);

  // Timeline Master Orchestration
  useEffect(() => {
    let isCancelled = false;

    // Phase 1: Bloom begins after brief init
    const tBloom = setTimeout(() => {
      if (!isCancelled) setPhase('bloom');
    }, 250);

    // Phase 2: Glitch transition begins
    const tGlitch = setTimeout(() => {
      if (!isCancelled) setPhase('glitch');
    }, 700);

    return () => {
      isCancelled = true;
      clearTimeout(tBloom);
      clearTimeout(tGlitch);
    };
  }, []);

  // Glitch Scramble Engine & Progress counter
  useEffect(() => {
    if (phase !== 'glitch') return;

    const startTime = performance.now();
    const glitchDuration = 1400; // total duration of glitch cipher convergence
    const totalChars = TARGET_NAME.length;

    let lastScramble = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawPct = Math.min(1, elapsed / glitchDuration);
      const easePct = rawPct; // linear progressive sweep
      setProgress(Math.round(easePct * 100));

      // Re-scramble unlocked characters every 35ms
      const shouldScramble = now - lastScramble > 35;
      if (shouldScramble) {
        lastScramble = now;
      }

      setDisplayChars((prev) => {
        return prev.map((item, idx) => {
          if (item.target === ' ') {
            return { ...item, current: ' ', isLocked: true };
          }

          // Individual character lock threshold (staggered with subtle organic noise)
          const charThreshold = (idx / totalChars) * 0.85 + 0.12;

          if (easePct >= charThreshold && !item.isLocked) {
            // Lock in character with flash
            return {
              ...item,
              current: item.target,
              isLocked: true,
              isFlashing: true,
            };
          }

          if (!item.isLocked && shouldScramble) {
            return {
              ...item,
              current: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            };
          }

          return item;
        });
      });

      // Clear flashes after brief burst
      if (shouldScramble) {
        setTimeout(() => {
          setDisplayChars((curr) =>
            curr.map((c) => (c.isFlashing ? { ...c, isFlashing: false } : c))
          );
        }, 80);
      }

      if (rawPct < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // Glitch complete -> Enter locked phase
        setDisplayChars(
          TARGET_NAME.split('').map((char) => ({
            target: char,
            current: char,
            isLocked: true,
            isFlashing: false,
          }))
        );
        setPhase('locked');

        // Transition to Beam Sweep after lock-in contemplation pause
        setTimeout(() => {
          setPhase('beamSweep');
          setBeamActive(true);

          // Once beam sweeps across the screen (approx 750ms), unveil the main page
          setTimeout(() => {
            handleFinish();
          }, 850);
        }, 550);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [phase, handleFinish]);

  return (
    <div
      className={`entrance-overlay ${phase} ${fadingOut ? 'fade-out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Entrance"
    >
      {/* Deep Space Background Atmosphere */}
      <div className="entrance-bg">
        <div className="entrance-grid" />
        <div className="entrance-radial-glow" />
        <div className="entrance-flare-h" />
      </div>

      {/* Top Status & Skip Control */}
      <div className="entrance-header">
        <div className="entrance-pill">
          <span className="entrance-dot" />
          <span className="entrance-sys-text">
            {phase === 'beamSweep'
              ? 'SYSTEM REVEAL // ACCESS GRANTED'
              : phase === 'locked'
              ? 'SYSTEM ONLINE // READY'
              : `SYS.INIT // PROTOCOL AWS-DEVOPS [${progress}%]`}
          </span>
        </div>
        <button
          type="button"
          className="entrance-skip-btn"
          onClick={handleFinish}
          aria-label="Skip entrance animation"
        >
          <span>Skip [Esc]</span>
          <span className="entrance-skip-icon">↗</span>
        </button>
      </div>

      {/* Center Cinematic Stage */}
      <div className="entrance-center">
        {/* Volumetric Optical Bloom Halo */}
        <div
          className={`entrance-bloom-halo ${
            phase === 'bloom' || phase === 'glitch' ? 'active' : ''
          } ${phase === 'locked' ? 'converged' : ''}`}
        />

        {/* Name with Randomized Letter Glitch & Focus Bloom */}
        <div className="entrance-name-wrap">
          <h1
            className={`entrance-name ${phase}`}
            aria-label={TARGET_NAME}
          >
            {displayChars.map((c, i) => (
              <span
                key={i}
                className={`entrance-char ${c.isLocked ? 'locked' : 'scrambling'} ${
                  c.isFlashing ? 'flash' : ''
                } ${c.target === ' ' ? 'space' : ''}`}
                style={{
                  animationDelay: `${i * 35}ms`,
                }}
              >
                {c.current}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle & Role Tagline */}
        <div className={`entrance-sub ${phase === 'locked' || phase === 'beamSweep' ? 'revealed' : ''}`}>
          <div className="entrance-role-line">
            <span className="entrance-role-bracket">[</span>
            <span className="entrance-role-text">{TARGET_ROLE}</span>
            <span className="entrance-role-bracket">]</span>
          </div>
          <div className="entrance-meta-row">
            <span>TERRAFORM • KUBERNETES • OBSERVABILITY</span>
            <span className="entrance-sep">•</span>
            <span>PROMETHEUS & GRAFANA</span>
          </div>
        </div>

        {/* Telemetry Progress Bar */}
        <div className="entrance-progress-bar">
          <div
            className="entrance-progress-fill"
            style={{ width: `${phase === 'locked' || phase === 'beamSweep' ? 100 : progress}%` }}
          />
        </div>
      </div>

      {/* SVG-based High-Intensity Anamorphic Light Beam */}
      {beamActive && (
        <div className="entrance-beam-container" aria-hidden="true">
          <svg
            className="entrance-beam-svg"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                <stop offset="25%" stopColor="#00e5ff" stopOpacity="0.15" />
                <stop offset="44%" stopColor="#00e5ff" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="56%" stopColor="#bd00ff" stopOpacity="0.75" />
                <stop offset="75%" stopColor="#bd00ff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#bd00ff" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="beamCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="20%" stopColor="#00e5ff" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#bd00ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
              </radialGradient>

              <filter id="beamFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Diagonal Anamorphic Light Blade */}
            <g className="beam-blade">
              {/* Diffuse wash polygon */}
              <polygon
                points="-400,0 450,0 850,1080 0,1080"
                fill="url(#beamGradient)"
                opacity="0.95"
              />
              {/* Laser Core */}
              <line
                x1="25"
                y1="0"
                x2="425"
                y2="1080"
                stroke="#ffffff"
                strokeWidth="6"
                filter="url(#beamFilter)"
              />
              {/* Secondary Glare Line */}
              <line
                x1="-50"
                y1="0"
                x2="350"
                y2="1080"
                stroke="#00e5ff"
                strokeWidth="2"
                opacity="0.7"
              />
              {/* Anamorphic Flare Oval at Viewport Center */}
              <ellipse
                cx="225"
                cy="540"
                rx="650"
                ry="80"
                transform="rotate(-24 225 540)"
                fill="url(#beamCoreGlow)"
                filter="url(#beamFilter)"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
