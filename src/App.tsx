import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from './data/portfolioData';
import { buildHeroNetworkSvg, forProject } from './utils/vizEngine';
import { downloadResumePdf } from './utils/generateResumePdf';
import { LinuxLabPage } from './components/LinuxLabPage';
import { EntrancePreloader } from './components/EntrancePreloader';

const ICON = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const COMPETENCIES = [
  'Site Reliability Engineering (SRE)',
  'Cloud Monitoring & Observability',
  'Infrastructure Automation',
  'Infrastructure as Code (Terraform, CloudFormation)',
  'CI/CD Pipelines (Jenkins, GitHub Actions)',
  'Centralized Observability (Prometheus, Grafana)',
  'AWS Environment Management',
  'AWS Well-Architected Framework & MTTD Reduction',
];

const SUMMARY_HIGHLIGHTS = [
  'site reliability engineering (SRE)',
  'cloud monitoring',
  'infrastructure automation',
  'Infrastructure as Code',
  'CI/CD pipelines',
  'centralized observability',
  'AWS Well-Architected Framework',
  'Mean Time to Detect (MTTD)',
];

function renderAboutTokens(summary: string) {
  let processed = summary;
  SUMMARY_HIGHLIGHTS.forEach((h) => {
    processed = processed.replace(h, `§${h.replace(/ /g, '¦')}§`);
  });

  const parts = processed.split(/(\s+)/);
  let idx = 0;
  return parts.map((tok, pIdx) => {
    if (/^\s+$/.test(tok)) return tok;
    const isHl = tok.includes('§');
    const clean = tok.replace(/§/g, '').replace(/¦/g, ' ');
    if (isHl) {
      return (
        <React.Fragment key={pIdx}>
          {clean.split(' ').map((w, wIdx, arr) => {
            const currentIdx = idx++;
            return (
              <React.Fragment key={`${pIdx}-${wIdx}`}>
                <span className="wd hl" data-wd-idx={currentIdx}>
                  {w}
                </span>
                {wIdx < arr.length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    }
    const currentIdx = idx++;
    return (
      <span key={pIdx} className="wd" data-wd-idx={currentIdx}>
        {clean}
      </span>
    );
  });
}

function formatCodeBackticks(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} style={{ fontFamily: 'var(--mono)', fontSize: '.9em' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function App() {
  const P = portfolioData.personalInfo;
  const H = portfolioData.heroContent;
  const S = portfolioData.socialLinks;
  const E = portfolioData.experience;
  const Ed = portfolioData.education;

  // View state for embedded Linux Practice Lab vs Portfolio Home
  const [view, setView] = useState<'home' | 'linux-lab'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const s = window.location.search;
      const h = window.location.hash;
      if (
        p === '/linux-lab' ||
        p === '/linux-practice-lab' ||
        s.includes('view=linux-lab') ||
        h === '#linux-lab'
      ) {
        return 'linux-lab';
      }
    }
    return 'home';
  });

  // Theme state: 'auto' (scroll-driven light/dark tone) or 'dark' (forced dark) or 'light' (forced light)
  const [themeMode, setThemeMode] = useState<'auto' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sk_theme');
      if (saved === 'dark') return 'dark';
    }
    return 'auto';
  });

  const [showEntrance, setShowEntrance] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalProjectIndex, setModalProjectIndex] = useState<number | null>(null);

  // Contact form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroNetRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Sync popstate for Linux Lab navigation
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname;
      const s = window.location.search;
      const h = window.location.hash;
      if (
        p === '/linux-lab' ||
        p === '/linux-practice-lab' ||
        s.includes('view=linux-lab') ||
        h === '#linux-lab'
      ) {
        setView('linux-lab');
      } else {
        setView('home');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Theme sync
  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem('sk_theme', themeMode);
    window.dispatchEvent(new Event('themechange'));
  }, [themeMode]);

  // Body overflow lock for entrance window, mobile menu, or project modal
  useEffect(() => {
    if (showEntrance || mobileMenuOpen || modalProjectIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showEntrance, mobileMenuOpen, modalProjectIndex]);

  // Escape key handler for modal & mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalProjectIndex !== null) setModalProjectIndex(null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalProjectIndex, mobileMenuOpen]);

  // Focus close button when modal opens
  useEffect(() => {
    if (modalProjectIndex !== null) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [modalProjectIndex]);

  // Master Motion, SVG, & Scroll Storytelling Engine (from motion.js + viz.js)
  useEffect(() => {
    if (view !== 'home') return;

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FINE = window.matchMedia('(pointer:fine)').matches;
    const htmlRoot = document.documentElement;
    const container = rootRef.current;
    if (!container) return;

    // 1. Measure hero network lines
    if (heroNetRef.current) {
      heroNetRef.current.querySelectorAll<SVGPathElement>('.net-line').forEach((p) => {
        try {
          p.style.setProperty('--len', String(Math.ceil(p.getTotalLength())));
        } catch {
          p.style.setProperty('--len', '400');
        }
      });
    }

    // 2. Initialize project stages, wire lengths, and tooltips
    const tip = document.getElementById('tip');
    const cleanups: (() => void)[] = [];

    stageRefs.current.forEach((stageEl, idx) => {
      if (!stageEl) return;
      const proj = portfolioData.projects[idx];
      if (!proj) return;
      const v = forProject(proj, idx);
      if (v.init) v.init(stageEl);

      stageEl.querySelectorAll<SVGPathElement>('.wire').forEach((p) => {
        if (!p.classList.contains('dash')) {
          try {
            p.style.setProperty('--len', String(Math.ceil(p.getTotalLength())));
          } catch {
            p.style.setProperty('--len', '300');
          }
        }
      });

      if (tip) {
        stageEl.querySelectorAll<HTMLElement>('[data-tip]').forEach((g) => {
          const onEnter = () => {
            tip.textContent = g.dataset.tip || '';
            tip.classList.add('on');
          };
          const onMove = (e: PointerEvent) => {
            tip.style.left = e.clientX + 'px';
            tip.style.top = e.clientY + 'px';
          };
          const onLeave = () => {
            tip.classList.remove('on');
          };
          g.addEventListener('pointerenter', onEnter);
          g.addEventListener('pointermove', onMove);
          g.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            g.removeEventListener('pointerenter', onEnter);
            g.removeEventListener('pointermove', onMove);
            g.removeEventListener('pointerleave', onLeave);
          });
        });
      }

      // Stage 3D perspective tilt on hover (desktop only)
      if (FINE && !RM) {
        const inner = stageEl.querySelector<HTMLElement>('.stage-in');
        const card = stageEl.querySelector<HTMLElement>('.layer.card');
        const onPointerMove = (e: PointerEvent) => {
          const r = stageEl.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          if (inner) inner.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
          if (card) card.style.transform = `translateZ(60px) translate(${x * 10}px,${y * 10}px)`;
        };
        const onPointerLeave = () => {
          if (inner) inner.style.transform = '';
          if (card) card.style.transform = '';
        };
        stageEl.addEventListener('pointermove', onPointerMove);
        stageEl.addEventListener('pointerleave', onPointerLeave);
        cleanups.push(() => {
          stageEl.removeEventListener('pointermove', onPointerMove);
          stageEl.removeEventListener('pointerleave', onPointerLeave);
          if ((stageEl as any)._pause) (stageEl as any)._pause();
        });
      }
    });

    // 3. Split headlines into masked words (idempotent)
    container.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      if (el.dataset.splitDone === '1') return;
      el.dataset.splitDone = '1';
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', (el.textContent || '').trim());
      }
      let i = 0;
      const walk = (node: Node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            (n.textContent || '').split(/(\s+)/).forEach((tok) => {
              if (!tok) return;
              if (/^\s+$/.test(tok)) {
                frag.appendChild(document.createTextNode(' '));
                return;
              }
              const w = document.createElement('span');
              w.className = 'w';
              w.setAttribute('aria-hidden', 'true');
              const s = document.createElement('span');
              s.textContent = tok;
              s.style.transitionDelay = i++ * 70 + 'ms';
              w.appendChild(s);
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) {
            walk(n);
          }
        });
      };
      walk(el);
      el.classList.add('split');
    });

    // 4. Reveal observer
    const show = (el: HTMLElement) => {
      const d = +(el.dataset.delay || 0);
      if (d && !RM) {
        setTimeout(() => el.classList.add('in'), d);
      } else {
        el.classList.add('in');
      }
    };

    let io: IntersectionObserver | null = null;
    if (RM || !('IntersectionObserver' in window)) {
      container
        .querySelectorAll<HTMLElement>('[data-reveal],[data-split],.focus,.hero,.stage,.exp-card')
        .forEach((el) => el.classList.add('in'));
    } else {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              show(e.target as HTMLElement);
              io?.unobserve(e.target);
            }
          }),
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
      );
      container
        .querySelectorAll<HTMLElement>('[data-reveal],[data-split]')
        .forEach((el) => io?.observe(el));
      const exp = document.getElementById('expCard');
      if (exp) io.observe(exp);
    }

    // 5. Hero staged entrance (triggered once entrance window finishes)
    let heroTimer: ReturnType<typeof setTimeout> | null = null;
    if (!showEntrance) {
      const hero = document.getElementById('hero');
      const heroName = document.getElementById('heroName');
      heroTimer = setTimeout(() => {
        if (hero) {
          hero.classList.add('in');
          hero.querySelectorAll<HTMLElement>('[data-reveal]').forEach(show);
        }
        if (heroName) heroName.classList.add('in');
      }, 90);
    }

    // 6. Count-up for % metrics
    let cio: IntersectionObserver | null = null;
    if (!RM && 'IntersectionObserver' in window) {
      cio = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            cio?.unobserve(e.target);
            const el = e.target as HTMLElement;
            const end = parseFloat(el.textContent || '80');
            const t0 = performance.now();
            const dur = 1600;
            const step = (t: number) => {
              const p = Math.min(1, (t - t0) / dur);
              const k = 1 - Math.pow(1 - p, 4);
              el.textContent = Math.round(end * k) + '%';
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }),
        { threshold: 0.6 }
      );
      container.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => cio?.observe(el));
    }

    // 7. Stages play/pause offscreen SMIL
    let sio: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      sio = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            const st = e.target as HTMLElement;
            const svgs = st.querySelectorAll<SVGSVGElement>('svg');
            if (e.isIntersecting) {
              st.classList.add('in');
              svgs.forEach((s) => s.unpauseAnimations && s.unpauseAnimations());
              if ((st as any)._play) (st as any)._play();
            } else {
              svgs.forEach((s) => s.pauseAnimations && s.pauseAnimations());
              if ((st as any)._pause) (st as any)._pause();
            }
          }),
        { threshold: 0.25 }
      );
      stageRefs.current.forEach((s) => {
        if (s) sio?.observe(s);
      });
    }

    // 8. Scroll loop: progress, nav, tone transitions, parallax, about word scrub
    const nav = document.getElementById('nav');
    const prog = document.getElementById('progress');
    const toneEls = [...container.querySelectorAll<HTMLElement>('[data-tone]')];
    const navLinks = [...container.querySelectorAll<HTMLAnchorElement>('#navLinks a')];
    const sections = navLinks.map((a) => {
      const href = a.getAttribute('href');
      return href ? document.querySelector<HTMLElement>(href) : null;
    });
    const para = [...container.querySelectorAll<HTMLElement>('[data-speed]')];
    const words = [...container.querySelectorAll<HTMLElement>('#aboutText .wd')];
    const aboutText = document.getElementById('aboutText');
    const heroNet = document.getElementById('heroNet');
    const stageInner = stageRefs.current.map((s) => s?.querySelector<HTMLElement>('.layer.base'));

    let lastY = 0;
    let ticking = false;
    let curTone = '';

    function frame() {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight - vh;

      if (prog) {
        prog.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;
      }
      if (nav) {
        nav.classList.toggle('scrolled', y > 40);
        const mmOpen = document.getElementById('mobileMenu')?.classList.contains('open');
        nav.classList.toggle('hide', y > lastY && y > vh * 0.8 && !mmOpen);
      }
      lastY = y;

      // Section crossing 45% of viewport sets page tone (unless forced dark)
      let tone = 'light';
      if (htmlRoot.dataset.theme === 'dark') {
        tone = 'dark';
      } else {
        for (const el of toneEls) {
          const r = el.getBoundingClientRect();
          if (r.top <= vh * 0.45 && r.bottom > vh * 0.45) {
            tone = el.dataset.tone || 'light';
            break;
          }
        }
      }
      if (tone !== curTone) {
        htmlRoot.dataset.tone = tone;
        curTone = tone;
        const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.content = tone === 'dark' ? '#07080b' : '#f3f2ee';
        }
      }

      // Active nav link highlight
      let act = -1;
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top < vh * 0.4) act = i;
      });
      navLinks.forEach((a, i) => a.classList.toggle('active', i === act));

      if (RM) return;

      // Parallax
      para.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2 - vh / 2;
        const speed = +(el.dataset.speed || 0);
        el.style.transform = `translate3d(0,${c * speed}px,0)`;
      });
      if (heroNet && y < vh * 1.2) {
        heroNet.style.transform = `translate3d(0,${y * 0.18}px,0)`;
      }

      // About word-by-word scrub
      if (aboutText) {
        const r = aboutText.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height + vh * 0.2)));
        const n = Math.round(p * words.length);
        for (let i = 0; i < words.length; i++) {
          words[i].classList.toggle('on', i < n);
        }
      }

      // Project stage subtle perspective drift
      stageInner.forEach((l) => {
        if (!l) return;
        const r = l.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        l.style.transform = `translate3d(0,${c * -24}px,0)`;
      });
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    const onThemeChange = () => {
      curTone = '';
      frame();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('themechange', onThemeChange);
    if (RM) words.forEach((w) => w.classList.add('on'));
    frame();

    return () => {
      if (heroTimer) clearTimeout(heroTimer);
      io?.disconnect();
      cio?.disconnect();
      sio?.disconnect();
      cleanups.forEach((fn) => fn());
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('themechange', onThemeChange);
    };
  }, [view, showEntrance]);

  // Contact form validation & submission
  const isFormValid =
    firstName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(userEmail.trim()) &&
    message.trim().length > 0 &&
    consent;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || sending) return;

    const recip = P.emails.primary;
    setSending(true);
    setStatusAlert(null);

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || undefined,
      user_email: userEmail.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: userEmail.trim(),
      message: message.trim(),
      recipient: recip,
    };

    let ok = false;
    let msg = `Inquiry successfully delivered to ${recip}!`;

    try {
      const r = await fetch(`https://formsubmit.co/ajax/${recip}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[Portfolio Inquiry] New message from ${payload.name}`,
          _template: 'table',
          _captcha: 'false',
          name: payload.name,
          email: payload.email,
          message: payload.message,
          submitted_at: new Date().toLocaleString(),
        }),
      });
      const t = await r.text();
      let j: any = null;
      try {
        j = t ? JSON.parse(t) : null;
      } catch {
        // ignore JSON parse error
      }
      if (r.ok || (j && (j.success === 'true' || j.success === true))) {
        ok = true;
      }
    } catch (err) {
      console.warn('Direct web dispatch notice:', err);
    }

    setSending(false);
    if (ok) {
      setSentSuccess(true);
      setStatusAlert({ type: 'ok', text: msg });
      setFirstName('');
      setLastName('');
      setUserEmail('');
      setMessage('');
      setConsent(false);
      setTimeout(() => setSentSuccess(false), 4000);
    } else {
      setStatusAlert({
        type: 'err',
        text: `Unable to send inquiry automatically. Please email ${recip} directly.`,
      });
    }
  };

  const handleLaunchLab = () => {
    window.history.pushState({}, '', '/linux-lab');
    setView('linux-lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    window.history.pushState({}, '', '/');
    setView('home');
  };

  if (view === 'linux-lab') {
    return <LinuxLabPage onBackToPortfolio={handleBackToPortfolio} />;
  }

  const [firstNameWord, ...restNameWords] = P.name.split(' ');
  const lastNameWord = restNameWords.join(' ');
  const forcedDark = themeMode === 'dark';
  const activeModalProject =
    modalProjectIndex !== null ? portfolioData.projects[modalProjectIndex] : null;

  return (
    <div ref={rootRef}>
      {showEntrance && (
        <EntrancePreloader
          name={P.name}
          role="AWS DEVOPS ENGINEER"
          location={P.location}
          onComplete={() => setShowEntrance(false)}
        />
      )}
      <div className="progress" id="progress" />
      <div className="grain" aria-hidden="true" />
      <div className="tip" id="tip" role="status" />

      {/* ================= NAV ================= */}
      <header className="nav" id="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand" aria-label="Back to top">
            <span className="brand-mark">SK</span>
            <span>{P.name}</span>
          </a>
          <nav className="nav-links" id="navLinks" aria-label="Primary">
            {NAV_ITEMS.map((n) => (
              <a key={n.href} href={n.href}>
                {n.name}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <button
              type="button"
              className="icon-btn"
              id="themeBtn"
              onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'auto' : 'dark'))}
              aria-label={forcedDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={forcedDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {forcedDark ? ICON.sun : ICON.moon}
            </button>
            <a
              className="icon-btn hide-sm"
              href={S.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              {ICON.linkedin}
            </a>
            <a
              className="icon-btn hide-sm"
              href={S.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (VinodKotipalli)"
              title="GitHub: VinodKotipalli"
            >
              {ICON.github}
            </a>
            <a className="icon-btn solid hide-sm" href="#contact">
              <span className="lbl">Contact</span>
            </a>
            <button
              type="button"
              className="icon-btn menu-btn"
              id="menuBtn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        id="mobileMenu"
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className="icon-btn close"
          id="menuClose"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          Close
        </button>
        <div id="mobileLinks">
          {NAV_ITEMS.map((n, i) => (
            <a
              key={n.href}
              className="big"
              href={n.href}
              style={{ transitionDelay: `${80 + i * 50}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {n.name}
            </a>
          ))}
        </div>
        <div className="row">
          <a
            className="icon-btn"
            href={S.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            {ICON.linkedin}
          </a>
          <a
            className="icon-btn"
            href={S.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            {ICON.github}
          </a>
        </div>
      </div>

      <main id="top">
        {/* ================= HERO ================= */}
        <section className="hero" id="hero" data-tone="light" data-screen-label="01 Hero">
          <div className="watermark" aria-hidden="true" data-speed="-0.12">
            DEVOPS • CLOUD • SRE
          </div>
          <div className="hero-net" id="heroNet" ref={heroNetRef} aria-hidden="true">
            <div dangerouslySetInnerHTML={{ __html: buildHeroNetworkSvg() }} />
            <div className="fade-l" />
          </div>
          <div className="wrap" style={{ position: 'relative', width: '100%' }}>
            <div className="hero-top" data-reveal="fade" data-delay="80">
              <span className="pill">
                <span className="dot" />
                AWS DEVOPS ENGINEER
              </span>
              <span className="loc">
                <i />
                <span>{P.location}</span>
              </span>
            </div>

            <h1 className="focus" id="heroName" aria-label={P.name}>
              <span className="l1" aria-hidden="true">
                {[...firstNameWord].map((c, i) => (
                  <span key={i} className="c" style={{ transitionDelay: `${200 + i * 45}ms` }}>
                    {c === ' ' ? '\u00A0' : c}
                  </span>
                ))}
              </span>
              <span className="l2" aria-hidden="true">
                {[...lastNameWord].map((c, i) => (
                  <span key={i} className="c" style={{ transitionDelay: `${520 + i * 45}ms` }}>
                    {c === ' ' ? '\u00A0' : c}
                  </span>
                ))}
              </span>
            </h1>

            <div className="hero-role" data-reveal="fade" data-delay="900">
              <span className="bar" />
              <span>
                AWS DevOps <em>Engineer</em>
              </span>
            </div>

            <div className="hero-grid">
              <div>
                <p className="hero-sub" data-reveal data-delay="1100">
                  {H.subtitle}
                </p>
                <div className="chips" id="heroChips" data-reveal data-delay="1250">
                  <a className="chip" href={`mailto:${P.email}`}>
                    <span className="k">Email</span>
                    {P.email}
                  </a>
                  <a className="chip" href={`tel:${P.phone.replace(/\s+/g, '')}`}>
                    <span className="k">Tel</span>
                    {P.phone}
                  </a>
                  <a
                    className="chip"
                    href={S.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub: VinodKotipalli"
                  >
                    {ICON.github}
                    <span>GitHub Profile</span>
                  </a>
                  <span className="chip">
                    <span className="k">Now</span>TCS (June 2024 – Present)
                  </span>
                </div>
              </div>

              <div className="cta" id="heroCta" data-reveal data-delay="1400">
                <a className="btn primary" href={H.ctaPrimary.href}>
                  <span>{H.ctaPrimary.text}</span>
                  <span className="arr">↓</span>
                </a>
                <a className="btn" href={H.ctaSecondary.href}>
                  {H.ctaSecondary.text}
                </a>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => downloadResumePdf('Saivinod_Kotipalli_Resume.pdf')}
                >
                  {ICON.down}
                  <span>{H.ctaResume.text}</span>
                </button>
              </div>
            </div>

            <div className="hero-foot" data-reveal="fade" data-delay="1600">
              <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
                <span className="ln" />
                Scroll
              </a>
              <div className="hero-badges">
                <div className="badge">
                  <b>99.9%</b>
                  <span>UPTIME</span>
                </div>
                <div className="badge">
                  <b style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>
                    ∞
                  </b>
                  <span>OBSERVABILITY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section className="sec" id="about" data-tone="light" data-screen-label="02 About">
          <div className="wrap about-grid">
            <div className="about-side">
              <div className="eyebrow" data-reveal>
                ✦ Professional Summary
              </div>
              <h2 className="h-sec split" data-split>
                About <em>me</em>
              </h2>
            </div>
            <div>
              <p className="about-text" id="aboutText">
                {renderAboutTokens(P.summary)}
              </p>
              <ul className="hl-list" id="aboutHl">
                {COMPETENCIES.map((c, i) => (
                  <li key={c} data-reveal data-delay={(i % 2) * 80}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {c}
                  </li>
                ))}
              </ul>
              <div className="about-more" data-reveal>
                <a href="#experience" className="btn ghost">
                  <span>→</span>
                  <span>Experience</span>
                </a>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => downloadResumePdf('Saivinod_Kotipalli_Resume.pdf')}
                >
                  {ICON.down}
                  <span>Resume</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="sec" id="skills" data-tone="light" data-screen-label="03 Skills">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Skills &amp; Competencies
                </div>
                <h2 className="h-sec split" data-split>
                  Technical <em>skills</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                Enterprise DevOps practices, automated CI/CD pipelines, container orchestration, and comprehensive AWS infrastructure tools.
              </p>
            </div>
            <div className="skills-list" id="skillsList">
              {portfolioData.technicalSkills.map((g, i) => {
                const words = g.title.split(' ');
                const lastWord = words.pop();
                return (
                  <div
                    key={g.title}
                    className="sk-row"
                    data-reveal
                    data-delay={(i % 3) * 60}
                  >
                    <span className="sk-n">{String(i + 1).padStart(2, '0')}</span>
                    <div className="sk-t">
                      {words.length > 0 ? `${words.join(' ')} ` : ''}
                      <em>{lastWord}</em>
                    </div>
                    <div className="sk-items">
                      {g.skills.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section className="sec" id="experience" data-tone="dark" data-screen-label="04 Experience">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Career History
                </div>
                <h2 className="h-sec split" data-split>
                  Professional <em>experience</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                Enterprise AWS DevOps and cloud infrastructure experience building high-availability monitoring platforms and automated pipelines.
              </p>
            </div>
            <div className="exp-grid">
              <div className="exp-card" data-reveal="scale" id="expCard">
                <div className="tag">
                  <span className="pill">
                    <span className="dot" />
                    Full-Time Role
                  </span>
                </div>
                <h3 className="exp-role">{E.role}</h3>
                <div className="exp-co">{E.company}</div>
                <div className="exp-meta">
                  <div>
                    <span className="mono">Duration</span>🗓️ {E.duration}
                  </div>
                  <div>
                    <span className="mono">Location</span>
                    {E.location}
                  </div>
                </div>
                <div className="exp-time">
                  <i />
                </div>
              </div>
              <div>
                <div className="mono exp-list-h" data-reveal>
                  Key Responsibilities &amp; Deliverables:
                </div>
                <ol className="exp-list" id="expList">
                  {E.highlights.map((h, idx) => (
                    <li key={idx} data-reveal>
                      {h}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ACHIEVEMENTS ================= */}
        <section
          className="sec"
          id="achievements"
          data-tone="dark"
          data-screen-label="05 Achievements"
          style={{ paddingTop: 0 }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Impact &amp; Metrics
                </div>
                <h2 className="h-sec split" data-split>
                  Key <em>achievements</em>
                </h2>
              </div>
            </div>
            <div className="ach" id="achList">
              {portfolioData.achievements.map((a, i) => (
                <div key={a.title} className="ach-i" data-reveal data-delay={i * 120}>
                  <div className="ach-k mono">
                    <span>ACHIEVEMENT 0{i + 1}</span>
                    <span>✨</span>
                  </div>
                  <div className="ach-m">
                    {a.metric.includes('→') ? (
                      <>
                        {a.metric.split('→')[0]}
                        <em>→</em>
                        {a.metric.split('→')[1]}
                      </>
                    ) : a.metric.includes('%') ? (
                      <>
                        <span data-count>{a.metric.match(/\d+%/)?.[0]}</span>
                        {a.metric.replace(/\d+%/, '')}
                      </>
                    ) : (
                      a.metric
                    )}
                  </div>
                  <h4 className="ach-t">{a.title}</h4>
                  <p className="ach-d">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section className="sec" id="projects" data-tone="dark" data-screen-label="06 Projects">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Technical Projects
                </div>
                <h2 className="h-sec split" data-split>
                  Featured <em>projects</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                Production AWS multi-tier infrastructure, Amazon EKS Kubernetes orchestration, GitHub Actions CI/CD automation, Terraform remote state management, and full-stack observability.
              </p>
            </div>
            <div id="projList">
              {portfolioData.projects.map((p, i) => {
                const m = p.title.match(/^(\d+)\s*—\s*(.*)$/);
                const num = m ? m[1] : String(i + 1).padStart(2, '0');
                const name = m ? m[2] : p.title;
                const v = forProject(p, i);

                return (
                  <article
                    key={p.title}
                    className="proj"
                    data-screen-label={`Project ${num}`}
                  >
                    <div className="proj-copy">
                      <span className="proj-num" data-reveal="fade">
                        {num}
                      </span>
                      <div className="proj-cat" data-reveal>
                        <span className="mono" style={{ color: 'var(--fg-3)' }}>
                          {p.category}
                        </span>
                        <span className="ready">
                          <i />
                          Production Ready
                        </span>
                      </div>
                      <h3 className="split" data-split aria-label={p.title}>
                        {name}
                      </h3>
                      <p className="proj-sub" data-reveal>
                        {p.subtitle}
                      </p>
                      <p className="proj-desc" data-reveal>
                        {p.description}
                      </p>
                      <div className="tech" data-reveal>
                        {p.technologies.slice(0, 4).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {p.technologies.length > 4 && (
                          <span>+{p.technologies.length - 4}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="proj-open"
                        onClick={() => setModalProjectIndex(i)}
                        data-reveal
                      >
                        <span>View Architecture Details</span>
                        <span className="ar">↗</span>
                      </button>
                    </div>

                    <div
                      className="stage"
                      data-stage
                      data-reveal="fade"
                      ref={(el) => {
                        stageRefs.current[i] = el;
                      }}
                    >
                      <div className="stage-in">
                        <div
                          className="layer base"
                          dangerouslySetInnerHTML={{ __html: v.base }}
                        />
                        <div
                          className="layer card"
                          dangerouslySetInnerHTML={{ __html: v.card }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= LINUX LAB ================= */}
        <section
          className="sec"
          id="linux-practice-lab"
          data-tone="dark"
          data-screen-label="07 Linux Lab"
          style={{ paddingTop: 0 }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  <b>⌘</b> INTERACTIVE DEVOPS WORKSTATION
                </div>
                <h2 className="h-sec split" data-split>
                  Unlimited Linux <em>Practice Lab</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                A real-world, sandboxed Linux terminal emulator and command workstation embedded directly in this portfolio. Practice unlimited Linux commands with an interactive terminal shell and real-time execution.
              </p>
            </div>
            <div className="lab" data-reveal="scale">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '32px',
                }}
              >
                <div>
                  <div className="lab-tags">
                    <span>Unlimited Practice</span>
                    <span>100+ Curated DevOps Commands</span>
                    <span>xterm.js Full Shell</span>
                  </div>
                  <h3>
                    Real Shell Commands. Sandboxed Execution. <em>Free-form Practice.</em>
                  </h3>
                  <p>
                    Enjoy unlimited practice across networking, file operations, permissions, process triage, and log filtering directly inside a responsive, sandboxed terminal shell.
                  </p>
                </div>
              </div>
              <div className="term">
                <div className="layer-bar">
                  <span className="tl">
                    <i />
                    <i />
                    <i />
                  </span>
                  bash
                </div>
                <div className="term-body" id="termBody">
                  <span className="p">$</span> ss -tulpn | grep 80
                  <br />
                  <span style={{ color: 'var(--moon)' }}>
                    tcp  0  0 0.0.0.0:80  0.0.0.0:*  LISTEN  340/nginx
                  </span>
                  <br />
                  <span className="p">$</span> <span className="caret" />
                </div>
                <div className="term-env">
                  <span>Environment:</span>
                  <b>Ubuntu 24.04 LTS Noble</b>
                </div>
                <div className="term-foot">
                  <span>Interactive Command Runner</span>
                  <span className="mono">Zero Lockouts</span>
                </div>
                <button
                  type="button"
                  className="launch"
                  id="launch-linux-lab-button"
                  onClick={handleLaunchLab}
                >
                  <span>Launch Linux Practice Lab</span>
                  <span className="ar">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CERTIFICATIONS ================= */}
        <section
          className="sec"
          id="certifications"
          data-tone="light"
          data-screen-label="08 Certifications"
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Credentials &amp; Certifications (
                  <span id="certCount">{portfolioData.certificates.length}</span>)
                </div>
                <h2 className="h-sec split" data-split>
                  <em>Certifications</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                Official certifications validating solutions architecture, DevOps engineering, data engineering, and generative AI systems.
              </p>
            </div>
            <div className="cert-list" id="certList">
              {portfolioData.certificates.map((c, i) => (
                <div
                  key={c.code + c.name}
                  className="cert"
                  data-reveal
                  data-delay={(i % 3) * 60}
                >
                  <div className="cert-code">{c.code}</div>
                  <div>
                    <h3>{c.name}</h3>
                    <div className="iss">{c.issuer}</div>
                  </div>
                  <div>
                    {c.description && <p>{c.description}</p>}
                    <div className="sks">
                      {(c.skills || []).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="cert-date">
                    {c.issueDate ? `Issued ${c.issueDate}` : c.year}
                    {c.expiryDate && (
                      <>
                        <br />
                        Exp {c.expiryDate}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= EDUCATION ================= */}
        <section
          className="sec"
          id="education"
          data-tone="light"
          data-screen-label="09 Education"
          style={{ paddingTop: 0 }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Academic Background
                </div>
                <h2 className="h-sec split" data-split>
                  <em>Education</em>
                </h2>
              </div>
              <p className="lede" data-reveal>
                Formal foundations in Computer Science principles, algorithms, operating systems, and software engineering.
              </p>
            </div>
            <div className="edu" id="edu">
              <div data-reveal>
                <div className="mono edu-k">Graduation Degree</div>
                <h3>
                  B.Sc. <em>Computer Science</em>
                </h3>
                <div className="ins">
                  {Ed.institution} • {Ed.university}
                </div>
              </div>
              <div className="edu-meta" data-reveal data-delay="150">
                <div>
                  <span className="mono">Score</span>
                  <span className="edu-score">{Ed.percentage}</span>
                </div>
                <div>
                  <span className="mono">Duration</span>
                  <span>Duration: {Ed.duration}</span>
                </div>
                <div>
                  <span className="mono">Location</span>
                  <span>📍 {Ed.location}</span>
                </div>
                <div>
                  <span className="mono">Status</span>
                  <span className="done">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="sec" id="contact" data-tone="dark" data-screen-label="10 Contact">
          <div className="wrap">
            <h2 className="sr">Contact</h2>
            <div className="contact-head">
              <div>
                <div className="eyebrow" data-reveal>
                  ✦ Reach Me Directly
                </div>
                <h2 className="h-sec split" data-split>
                  Let&apos;s build <em>together</em>
                </h2>
              </div>
              <a
                className="btn"
                href={S.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
              >
                <span className="ic">{ICON.linkedin}</span>
                <span>LinkedIn</span>
              </a>
            </div>

            <form className="form" id="contactForm" onSubmit={handleContactSubmit} noValidate>
              <div className="form-row">
                <div className="field" data-reveal>
                  <label htmlFor="f1">First Name *</label>
                  <input
                    id="f1"
                    name="first_name"
                    placeholder="e.g. John"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <span className="bar" />
                </div>
                <div className="field" data-reveal data-delay="80">
                  <label htmlFor="f2">Last Name</label>
                  <input
                    id="f2"
                    name="last_name"
                    placeholder="e.g. Doe"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <span className="bar" />
                </div>
              </div>
              <div className="field" data-reveal>
                <label htmlFor="f3">Email Address *</label>
                <input
                  id="f3"
                  type="email"
                  name="user_email"
                  placeholder="e.g. name@company.com"
                  required
                  autoComplete="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <span className="bar" />
              </div>
              <div className="field" data-reveal>
                <label htmlFor="f4">Your Message *</label>
                <textarea
                  id="f4"
                  name="message"
                  placeholder="Describe your role inquiry, project requirement, or collaboration opportunity..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <span className="bar" />
              </div>
              <label className="consent" data-reveal>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I authorize direct email correspondence regarding professional AWS Cloud / DevOps opportunities.
                </span>
              </label>
              <div className="form-foot" data-reveal>
                <p className="direct">
                  Direct:{' '}
                  <a className="link-u" href={`mailto:${P.emails.primary}`}>
                    {P.emails.primary}
                  </a>
                </p>
                <button
                  type="submit"
                  className="btn primary"
                  id="sendBtn"
                  disabled={!isFormValid || sending}
                >
                  <span id="sendLbl">
                    {sending
                      ? 'Sending Message...'
                      : sentSuccess
                      ? 'Message Sent Successfully ✓'
                      : 'Send Inquiry'}
                  </span>
                  {sending ? (
                    <span className="spin" id="sendArr" />
                  ) : (
                    <span className="arr" id="sendArr">
                      →
                    </span>
                  )}
                </button>
              </div>
              <div id="formStatus" aria-live="polite">
                {statusAlert && (
                  <div className={`status ${statusAlert.type}`}>
                    <span>{statusAlert.type === 'ok' ? '⚡' : '⚠️'}</span>
                    <p>{statusAlert.text}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer" data-tone="dark" id="footer" data-screen-label="11 Footer">
        <div className="wrap">
          <div className="quotes">
            <div className="quote" data-reveal>
              <div className="k mono">
                <span>✦</span>
                <span>Architecting Tomorrow</span>
              </div>
              <blockquote>
                &ldquo;The best way to predict the future is to engineer it with precision and resilience.&rdquo;
              </blockquote>
              <p>Transforming bold visions into scalable, autonomous cloud systems.</p>
            </div>
            <div className="quote" data-reveal data-delay="120">
              <div className="k mono">
                <span>✦</span>
                <span>Limitless Innovation</span>
              </div>
              <blockquote>
                &ldquo;Driven by curiosity, fueled by relentless learning.&rdquo;
              </blockquote>
              <p>Every deployment is a step toward a smarter, more connected future.</p>
            </div>
            <div className="quote" data-reveal data-delay="240">
              <div className="k mono">
                <span>✦</span>
                <span>Building The Future</span>
              </div>
              <blockquote>
                &ldquo;The future belongs to those who build with purpose and passion.&rdquo;
              </blockquote>
            </div>
          </div>

          <p className="foot-name split" data-split data-speed="0.04">
            Saivinod <em>Kotipalli</em>
          </p>

          <div className="foot-row">
            <div className="foot-links">
              <a href="#contact" className="link-u">
                Get In Touch
              </a>
              <a
                className="link-u"
                href={S.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
              <a
                className="link-u"
                href={S.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore GitHub Profile
              </a>
            </div>
            <div className="foot-meta">
              <a className="link-u" href={`mailto:${P.emails.primary}`}>
                {P.emails.primary}
              </a>
              <div className="foot-social">
                <a
                  className="icon-btn"
                  href={S.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  {ICON.linkedin}
                </a>
                <a
                  className="icon-btn"
                  href={S.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  {ICON.github}
                </a>
                <a
                  className="icon-btn"
                  href={S.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  {ICON.instagram}
                </a>
                <a
                  className="icon-btn"
                  href={S.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  {ICON.whatsapp}
                </a>
              </div>
            </div>
          </div>

          <div
            className="foot-row"
            style={{ borderTop: 0, paddingTop: '16px', color: 'var(--fg-3)', fontSize: '13px' }}
          >
            <span id="copyright">{portfolioData.footerContent.copyright}</span>
            <span className="mono" style={{ fontSize: '10px' }}>
              Diagrams &amp; dashboards are illustrative · sample data
            </span>
          </div>
        </div>
      </footer>

      {/* ================= PROJECT MODAL ================= */}
      <div
        className={`modal ${activeModalProject ? 'open' : ''}`}
        id="modal"
        aria-hidden={!activeModalProject}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mTitle"
      >
        <div className="scrim" onClick={() => setModalProjectIndex(null)} />
        <div className="sheet" id="sheet">
          {activeModalProject && (
            <>
              <button
                ref={closeBtnRef}
                type="button"
                className="x"
                onClick={() => setModalProjectIndex(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="proj-cat">
                <span className="mono" style={{ color: 'var(--moon-3)' }}>
                  {activeModalProject.category}
                </span>
                <span className="ready">
                  <i />
                  Production Architecture
                </span>
              </div>
              <h3 id="mTitle">{activeModalProject.title}</h3>
              <p className="proj-sub">{activeModalProject.subtitle}</p>
              <h4>Overview &amp; Design Purpose</h4>
              <p style={{ color: 'var(--moon-2)', maxWidth: '72ch', margin: 0 }}>
                {activeModalProject.description}
              </p>
              <h4>
                Key Architecture Deliverables ({activeModalProject.highlights.length} Points)
              </h4>
              <ol className="hl">
                {activeModalProject.highlights.map((h, k) => (
                  <li key={k}>
                    <span>{String(k + 1).padStart(2, '0')}</span>
                    <span
                      style={{
                        fontFamily: 'inherit',
                        color: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      {formatCodeBackticks(h)}
                    </span>
                  </li>
                ))}
              </ol>
              <h4>Technologies &amp; Tools Applied</h4>
              <div className="tech">
                {activeModalProject.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a
                className="btn gh"
                href={S.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ICON.github}
                <span>Explore Source Code on GitHub</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
