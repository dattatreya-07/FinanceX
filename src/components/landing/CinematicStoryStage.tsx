import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Compass, Award, CheckCircle2, Zap, DollarSign, Activity, Lock, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CinematicStoryStageProps {
  isAuthenticated: boolean;
  onOpenSignUp: () => void;
  onEnterApp: () => void;
  onScrollToDemo: () => void;
  onProgressChange?: (progress: number, activeChapter: number) => void;
}

interface ChapterConfig {
  id: number;
  totalFrames: number;
  startP: number;
  endP: number;
  peakP: number;
  fadeInP: number;
  fadeOutP: number;
}

const CHAPTERS: ChapterConfig[] = [
  { id: 1, totalFrames: 200, startP: 0.00, endP: 0.13, peakP: 0.06, fadeInP: 0.02, fadeOutP: 0.11 },
  { id: 2, totalFrames: 250, startP: 0.15, endP: 0.28, peakP: 0.21, fadeInP: 0.17, fadeOutP: 0.26 },
  { id: 3, totalFrames: 250, startP: 0.30, endP: 0.43, peakP: 0.36, fadeInP: 0.32, fadeOutP: 0.41 },
  { id: 4, totalFrames: 200, startP: 0.45, endP: 0.58, peakP: 0.51, fadeInP: 0.47, fadeOutP: 0.56 },
  { id: 5, totalFrames: 200, startP: 0.60, endP: 0.73, peakP: 0.66, fadeInP: 0.62, fadeOutP: 0.71 },
  { id: 6, totalFrames: 200, startP: 0.75, endP: 0.87, peakP: 0.81, fadeInP: 0.77, fadeOutP: 0.85 },
  { id: 7, totalFrames: 200, startP: 0.89, endP: 1.00, peakP: 0.94, fadeInP: 0.91, fadeOutP: 0.98 },
];

function formatFrameFilename(index: number): string {
  const padded = String(Math.max(1, Math.round(index))).padStart(3, '0');
  return `ezgif-frame-${padded}.jpg`;
}

// Global frame cache
const GLOBAL_FRAME_CACHE = new Map<string, HTMLImageElement>();

if (typeof window !== 'undefined') {
  CHAPTERS.forEach(ch => {
    const key = `${ch.id}_1`;
    const img = new Image();
    img.src = `/assets/${ch.id}/${formatFrameFilename(1)}`;
    GLOBAL_FRAME_CACHE.set(key, img);
  });
}

export const CinematicStoryStage: React.FC<CinematicStoryStageProps> = ({
  isAuthenticated,
  onOpenSignUp,
  onEnterApp,
  onScrollToDemo,
  onProgressChange,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Master scroll progress 0.0 -> 1.0
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollProgressRef = useRef<number>(0);
  const smoothedProgressRef = useRef<number>(0);

  const loadingSetRef = useRef<Set<string>>(new Set());

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Frame loading helper
  const loadFrame = useCallback((chapterId: number, frameNum: number): Promise<HTMLImageElement> => {
    const chapter = CHAPTERS.find(c => c.id === chapterId) || CHAPTERS[0];
    const validFrame = Math.max(1, Math.min(chapter.totalFrames, Math.round(frameNum)));
    const key = `${chapterId}_${validFrame}`;

    if (GLOBAL_FRAME_CACHE.has(key)) {
      return Promise.resolve(GLOBAL_FRAME_CACHE.get(key)!);
    }

    if (loadingSetRef.current.has(key)) {
      return new Promise((resolve) => {
        const check = () => {
          if (GLOBAL_FRAME_CACHE.has(key)) {
            resolve(GLOBAL_FRAME_CACHE.get(key)!);
          } else {
            setTimeout(check, 20);
          }
        };
        check();
      });
    }

    loadingSetRef.current.add(key);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `/assets/${chapterId}/${formatFrameFilename(validFrame)}`;
      img.onload = () => {
        GLOBAL_FRAME_CACHE.set(key, img);
        loadingSetRef.current.delete(key);
        resolve(img);
      };
      img.onerror = () => {
        loadingSetRef.current.delete(key);
        reject(new Error(`Failed frame ${validFrame} for chapter ${chapterId}`));
      };
    });
  }, []);

  // Preload keyframes for all chapters
  useEffect(() => {
    CHAPTERS.forEach(ch => {
      for (let f = 1; f <= Math.min(30, ch.totalFrames); f++) {
        loadFrame(ch.id, f).catch(() => {});
      }
    });

    const loadBackground = async () => {
      for (const ch of CHAPTERS) {
        for (let f = 1; f <= ch.totalFrames; f += 3) {
          await loadFrame(ch.id, f).catch(() => {});
        }
      }
      for (const ch of CHAPTERS) {
        for (let f = 2; f <= ch.totalFrames; f += 3) {
          await loadFrame(ch.id, f).catch(() => {});
        }
      }
    };

    const timer = setTimeout(loadBackground, 150);
    return () => clearTimeout(timer);
  }, [loadFrame]);

  // Master scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      scrollProgressRef.current = rawProgress;
      setScrollProgress(rawProgress);

      let currentCh = 1;
      for (const ch of CHAPTERS) {
        if (rawProgress >= ch.startP && rawProgress <= ch.endP) {
          currentCh = ch.id;
          break;
        } else if (rawProgress > ch.endP) {
          currentCh = Math.min(7, ch.id + 1);
        }
      }
      onProgressChange?.(rawProgress, currentCh);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Dynamic priority preloader
  useEffect(() => {
    CHAPTERS.forEach(ch => {
      if (scrollProgress >= ch.startP - 0.05 && scrollProgress <= ch.endP + 0.05) {
        const localT = Math.max(0, Math.min(1, (scrollProgress - ch.startP) / (ch.endP - ch.startP)));
        const centerFrame = Math.round(1 + localT * (ch.totalFrames - 1));
        const start = Math.max(1, centerFrame - 15);
        const end = Math.min(ch.totalFrames, centerFrame + 25);
        for (let f = start; f <= end; f++) {
          loadFrame(ch.id, f).catch(() => {});
        }
      }
    });
  }, [scrollProgress, loadFrame]);

  // Active canvas chapter computation
  const getActiveCanvasChapters = useCallback((p: number) => {
    const active: { chapter: ChapterConfig; opacity: number; frame: number }[] = [];

    CHAPTERS.forEach(ch => {
      const chapterRange = ch.endP - ch.startP;
      const paddedStart = Math.max(0, ch.startP - 0.03);
      const paddedEnd = Math.min(1, ch.endP + 0.03);

      if (p >= paddedStart && p <= paddedEnd) {
        const localT = Math.max(0, Math.min(1, (p - ch.startP) / chapterRange));
        const frame = Math.max(1, Math.min(ch.totalFrames, Math.round(1 + localT * (ch.totalFrames - 1))));

        let opacity = 1.0;
        if (p < ch.startP && ch.id > 1) {
          opacity = Math.max(0, (p - paddedStart) / 0.03);
        } else if (p > ch.endP && ch.id < 7) {
          opacity = Math.max(0, 1 - (p - ch.endP) / 0.03);
        }

        active.push({ chapter: ch, opacity, frame });
      }
    });

    if (active.length === 0) {
      if (p <= 0.05) {
        active.push({ chapter: CHAPTERS[0], opacity: 1, frame: 1 });
      } else {
        const last = CHAPTERS[CHAPTERS.length - 1];
        active.push({ chapter: last, opacity: 1, frame: last.totalFrames });
      }
    }

    return active;
  }, []);

  // Main Canvas Render Loop (60fps double-buffered frame blending)
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        animId = requestAnimationFrame(renderLoop);
        return;
      }

      // Momentum lerp
      const targetP = scrollProgressRef.current;
      const diff = targetP - smoothedProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        smoothedProgressRef.current += diff * 0.22;
      } else {
        smoothedProgressRef.current = targetP;
      }

      const p = smoothedProgressRef.current;
      const activeCanvasChapters = getActiveCanvasChapters(p);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth || window.innerWidth;
      const displayH = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) {
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Base background fill
      ctx.fillStyle = isDark ? '#07090E' : '#F8F9FA';
      ctx.fillRect(0, 0, displayW, displayH);

      // Draw active canvas frames
      activeCanvasChapters.forEach(({ chapter, opacity, frame }) => {
        if (opacity <= 0.005) return;

        const key = `${chapter.id}_${frame}`;
        let img = GLOBAL_FRAME_CACHE.get(key);

        if (!img) {
          let closestDiff = Infinity;
          for (let f = 1; f <= chapter.totalFrames; f++) {
            const candidateKey = `${chapter.id}_${f}`;
            if (GLOBAL_FRAME_CACHE.has(candidateKey)) {
              const d = Math.abs(f - frame);
              if (d < closestDiff) {
                closestDiff = d;
                img = GLOBAL_FRAME_CACHE.get(candidateKey);
              }
            }
          }
        }

        if (!img || !img.complete || img.naturalWidth === 0) {
          img = GLOBAL_FRAME_CACHE.get('1_1');
        }

        if (img && img.complete && img.naturalWidth > 0) {
          const imgW = img.naturalWidth;
          const imgH = img.naturalHeight;
          const scale = Math.max(displayW / imgW, displayH / imgH);
          const renderW = imgW * scale;
          const renderH = imgH * scale;
          const offsetX = (displayW - renderW) / 2;
          const offsetY = (displayH - renderH) / 2;

          ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        }
      });

      // Edge-Only Vignette Gradient Overlay (middle is transparent to preserve image contrast)
      ctx.globalAlpha = 1.0;
      const gradient = ctx.createLinearGradient(0, 0, 0, displayH);

      if (isDark) {
        gradient.addColorStop(0, 'rgba(7, 9, 14, 0.0)');
        gradient.addColorStop(0.25, 'rgba(7, 9, 14, 0.0)');
        gradient.addColorStop(0.85, 'rgba(7, 9, 14, 0.0)');
        gradient.addColorStop(1, 'rgba(7, 9, 14, 0.85)');
      } else {
        gradient.addColorStop(0, 'rgba(248, 249, 250, 0.0)');
        gradient.addColorStop(0.25, 'rgba(248, 249, 250, 0.0)');
        gradient.addColorStop(0.85, 'rgba(248, 249, 250, 0.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.85)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayW, displayH);

      ctx.restore();
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [getActiveCanvasChapters, isDark]);

  // Non-overlapping chapter text states
  const chapterTextStates = useMemo(() => {
    const p = scrollProgress;
    const states: Record<number, { opacity: number; y: number; isVisible: boolean }> = {};

    CHAPTERS.forEach(ch => {
      let opacity = 0;

      if (p >= ch.startP && p <= ch.endP) {
        if (p < ch.fadeInP) {
          opacity = (p - ch.startP) / (ch.fadeInP - ch.startP);
        } else if (p <= ch.fadeOutP) {
          opacity = 1.0;
        } else {
          opacity = Math.max(0, 1 - (p - ch.fadeOutP) / (ch.endP - ch.fadeOutP));
        }
      }

      const isVisible = opacity > 0.001;
      const finalOpacity = isVisible ? Math.min(1, Math.max(0, opacity)) : 0;
      const y = prefersReducedMotion ? 0 : (1 - finalOpacity) * 20;

      states[ch.id] = { opacity: finalOpacity, y, isVisible };
    });

    return states;
  }, [scrollProgress, prefersReducedMotion]);

  // Shared ultra-glossy transparent glassmorphic card style (partially transparent in both light and dark mode)
  const glossyCardStyle = "w-full p-6 sm:p-10 rounded-3xl bg-white/45 dark:bg-slate-950/60 border border-white/50 dark:border-white/15 shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_0_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-5 transition-all duration-200";
  const glossyPillStyle = "px-3 py-1 rounded-lg bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md";

  return (
    <div ref={containerRef} className="relative h-[680vh] w-full">
      {/* SINGLE MASTER STICKY VIEWPORT CONTAINER - Full bleed, no top partition */}
      <div className="sticky top-0 h-screen w-full overflow-hidden theme-transition flex flex-col justify-center items-center pt-0 pb-6">
        {/* Layer 0: Master Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-0 pointer-events-none"
        />

        {/* Layer 10: Glossy Transparent Glassmorphic Narrative Card Layer */}
        <div className="relative z-10 w-full my-auto max-w-4xl mx-auto px-4 sm:px-6 pointer-events-none select-none">
          <div className="relative w-full flex items-center justify-center">

            {/* ================= CHAPTER 1 — MONEY / OVERVIEW ================= */}
            {chapterTextStates[1].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[1].opacity,
                  transform: `translateY(${chapterTextStates[1].y}px)`,
                  pointerEvents: chapterTextStates[1].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[1].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[1].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 dark:bg-[#FF2E7E]/20 border border-pink-500/40 dark:border-[#FF2E7E]/50 text-pink-700 dark:text-[#FF2E7E] font-mono text-xs font-bold shadow-xs backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E]" />
                  FINANCEX ACADEMY
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-slate-950 dark:text-white tracking-tight leading-tight">
                  Money Moves <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E7E] via-rose-500 to-[#00E599]">
                    Everything.
                  </span>
                </h1>
                <p className="text-sm sm:text-lg text-slate-800 dark:text-slate-200 max-w-xl leading-relaxed font-semibold">
                  Understand money. Understand markets. Understand the decisions behind them.
                </p>
                <div className="flex flex-wrap justify-center gap-2 font-mono text-xs text-slate-900 dark:text-slate-200 font-semibold pt-1">
                  <span className={glossyPillStyle}>Finance</span>
                  <span className={glossyPillStyle}>Markets</span>
                  <span className={glossyPillStyle}>Trading</span>
                  <span className={glossyPillStyle}>Investing</span>
                  <span className={`${glossyPillStyle} text-emerald-700 dark:text-[#00E599]`}>Risk</span>
                  <span className={`${glossyPillStyle} text-[#FF2E7E]`}>Decisions</span>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-lg dark:shadow-[0_0_25px_rgba(255,46,126,0.5)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onScrollToDemo}
                    className="px-7 py-3.5 rounded-full bg-white/30 dark:bg-slate-900/40 border border-white/50 dark:border-white/20 hover:border-white text-slate-900 dark:text-white font-bold text-xs backdrop-blur-md transition cursor-pointer shadow-xs"
                  >
                    Explore FinanceX
                  </button>
                </div>
              </div>
            )}

            {/* ================= CHAPTER 2 — EVOLUTION OF MONEY ================= */}
            {chapterTextStates[2].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[2].opacity,
                  transform: `translateY(${chapterTextStates[2].y}px)`,
                  pointerEvents: chapterTextStates[2].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[2].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[2].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-emerald-800 dark:text-[#00E599] uppercase font-bold px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 backdrop-blur-md">
                  THE EVOLUTION OF VALUE
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Money Has Always Evolved.
                </h2>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 max-w-xl leading-relaxed font-semibold">
                  Every generation created better ways to exchange, store and measure value.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 w-full max-w-3xl mx-auto text-center font-mono font-bold text-xs">
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.15 ? 'bg-amber-400/30 border-amber-400/60 text-amber-950 dark:text-amber-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>BARTER</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Goods</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.17 ? 'bg-yellow-400/30 border-yellow-400/60 text-yellow-950 dark:text-yellow-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>COINS</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Metals</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.19 ? 'bg-emerald-400/30 border-emerald-400/60 text-emerald-950 dark:text-emerald-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>PAPER</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Fiat</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.21 ? 'bg-blue-400/30 border-blue-400/60 text-blue-950 dark:text-blue-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>BANKING</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Banks</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.23 ? 'bg-cyan-400/30 border-cyan-400/60 text-cyan-950 dark:text-cyan-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>DIGITAL</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Electronic</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${scrollProgress >= 0.25 ? 'bg-pink-400/30 border-pink-400/60 text-pink-950 dark:text-pink-300 shadow-sm' : 'bg-white/20 dark:bg-slate-900/30 border-white/30 dark:border-white/10 opacity-50'}`}>
                    <span>MODERN</span>
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 font-normal mt-0.5">Algos</p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= CHAPTER 3 — FINANCIAL FREEDOM ================= */}
            {chapterTextStates[3].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[3].opacity,
                  transform: `translateY(${chapterTextStates[3].y}px)`,
                  pointerEvents: chapterTextStates[3].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[3].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[3].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-amber-800 dark:text-amber-400 uppercase font-bold px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 backdrop-blur-md">
                  FINANCIAL FREEDOM
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Financial Freedom Is Built.
                </h2>
                <p className="text-sm sm:text-lg text-slate-800 dark:text-slate-200 max-w-xl leading-relaxed font-semibold">
                  Freedom begins with understanding how your money works.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-2 font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                  <span className={glossyPillStyle}>Knowledge</span>
                  <span>→</span>
                  <span className={glossyPillStyle}>Income</span>
                  <span>→</span>
                  <span className={glossyPillStyle}>Investing</span>
                  <span>→</span>
                  <span className={`${glossyPillStyle} text-emerald-700 dark:text-[#00E599]`}>Risk Management</span>
                  <span>→</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-[#FF2E7E] text-white shadow-md">Financial Freedom</span>
                </div>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  FinanceX turns financial concepts into practical learning, simulation and decision-making.
                </p>
              </div>
            )}

            {/* ================= CHAPTER 4 — BREAK MONEY MINDSET ================= */}
            {chapterTextStates[4].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[4].opacity,
                  transform: `translateY(${chapterTextStates[4].y}px)`,
                  pointerEvents: chapterTextStates[4].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[4].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[4].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-[#FF2E7E] uppercase font-bold px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/40 backdrop-blur-md">
                  THE CRITICAL SHIFT
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Don't Let Money Control You.
                </h2>
                <p className="text-sm sm:text-lg text-slate-800 dark:text-slate-200 max-w-xl font-semibold">
                  Understand it. Manage it. Make better decisions with it.
                </p>
                <div className="p-5 rounded-2xl bg-pink-500/15 border border-pink-500/30 backdrop-blur-md text-xl sm:text-3xl font-display font-black text-[#FF2E7E] shadow-sm">
                  MONEY IS A TOOL. NOT THE DESTINATION.
                </div>
              </div>
            )}

            {/* ================= CHAPTER 5 — THE 1% ================= */}
            {chapterTextStates[5].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[5].opacity,
                  transform: `translateY(${chapterTextStates[5].y}px)`,
                  pointerEvents: chapterTextStates[5].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[5].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[5].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-purple-800 dark:text-purple-300 uppercase font-bold px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/40 backdrop-blur-md">
                  THE 1% MINDSET
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Think Beyond the 1%.
                </h2>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 max-w-xl leading-relaxed font-semibold">
                  The real advantage is not simply having more money. It is understanding opportunity, risk, discipline and decisions.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5 font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                  {['KNOWLEDGE', 'RISK', 'STRATEGY', 'DISCIPLINE', 'EXECUTION'].map((item, idx) => (
                    <span key={idx} className={glossyPillStyle}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ================= CHAPTER 6 — WEALTH & RISK ================= */}
            {chapterTextStates[6].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[6].opacity,
                  transform: `translateY(${chapterTextStates[6].y}px)`,
                  pointerEvents: chapterTextStates[6].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[6].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[6].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-cyan-800 dark:text-cyan-300 uppercase font-bold px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 backdrop-blur-md">
                  WEALTH & RISK
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Wealth Always Has Risk.
                </h2>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 max-w-xl font-semibold">
                  The goal isn't to eliminate risk. It's to understand it, measure it and manage it.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-2 font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                  <span className={glossyPillStyle}>OPPORTUNITY</span>
                  <span>↓</span>
                  <span className={glossyPillStyle}>RISK</span>
                  <span>↓</span>
                  <span className={glossyPillStyle}>ANALYSIS</span>
                  <span>↓</span>
                  <span className={glossyPillStyle}>DECISION</span>
                  <span>↓</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white dark:text-slate-950 shadow-md">OUTCOME</span>
                </div>
              </div>
            )}

            {/* ================= CHAPTER 7 — MINDSET ================= */}
            {chapterTextStates[7].isVisible && (
              <div
                style={{
                  opacity: chapterTextStates[7].opacity,
                  transform: `translateY(${chapterTextStates[7].y}px)`,
                  pointerEvents: chapterTextStates[7].opacity > 0.5 ? 'auto' : 'none',
                  display: chapterTextStates[7].isVisible ? 'flex' : 'none',
                  visibility: chapterTextStates[7].isVisible ? 'visible' : 'hidden'
                }}
                className={glossyCardStyle}
              >
                <span className="text-xs font-mono tracking-widest text-emerald-800 dark:text-[#00E599] uppercase font-bold px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 backdrop-blur-md">
                  TRADING MINDSET
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 dark:text-white">
                  Master Your Mind Before the Market.
                </h2>
                <div className="flex flex-wrap justify-center gap-2.5 font-mono font-bold text-xs sm:text-sm">
                  {['DISCIPLINE', 'PATIENCE', 'FOCUS', 'CONSISTENCY', 'MINDSET'].map((item, idx) => (
                    <span key={idx} className={glossyPillStyle}>
                      {item}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-3xl font-display font-black text-slate-950 dark:text-white leading-tight pt-1">
                  Knowledge + Discipline + Mindset = <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-500 to-[#FF2E7E] dark:from-[#00E599] dark:via-cyan-400 dark:to-[#FF2E7E]">
                    Better Financial Decisions.
                  </span>
                </h3>
                <div className="pt-2 flex justify-center gap-4 pointer-events-auto">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-lg dark:shadow-[0_0_25px_rgba(255,46,126,0.5)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter FinanceX Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
