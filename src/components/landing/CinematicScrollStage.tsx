import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, DollarSign, Award, CheckCircle2, TrendingUp, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CinematicScrollStageProps {
  isAuthenticated: boolean;
  onOpenSignUp: () => void;
  onEnterApp: () => void;
}

interface StageDefinition {
  id: number;
  totalFrames: number;
  startP: number;
  endP: number;
  peakP: number;
}

const STAGE_DEFS: StageDefinition[] = [
  { id: 1, totalFrames: 200, startP: 0.00, endP: 0.17, peakP: 0.06 },
  { id: 2, totalFrames: 250, startP: 0.12, endP: 0.32, peakP: 0.21 },
  { id: 3, totalFrames: 250, startP: 0.27, endP: 0.47, peakP: 0.36 },
  { id: 4, totalFrames: 200, startP: 0.42, endP: 0.62, peakP: 0.51 },
  { id: 5, totalFrames: 200, startP: 0.57, endP: 0.77, peakP: 0.66 },
  { id: 6, totalFrames: 200, startP: 0.72, endP: 0.90, peakP: 0.80 },
  { id: 7, totalFrames: 200, startP: 0.85, endP: 1.00, peakP: 0.94 },
];

function formatFrameFilename(index: number): string {
  const padded = String(Math.max(1, Math.round(index))).padStart(3, '0');
  return `ezgif-frame-${padded}.jpg`;
}

// Compute stage opacity with overlapping cross-fade
function computeStageOpacity(stageId: number, p: number): number {
  switch (stageId) {
    case 1:
      if (p <= 0.10) return 1.0;
      if (p <= 0.17) return Math.max(0, 1 - (p - 0.10) / 0.07);
      return 0;
    case 2:
      if (p < 0.12) return 0;
      if (p < 0.17) return (p - 0.12) / 0.05;
      if (p <= 0.25) return 1.0;
      if (p <= 0.32) return Math.max(0, 1 - (p - 0.25) / 0.07);
      return 0;
    case 3:
      if (p < 0.27) return 0;
      if (p < 0.32) return (p - 0.27) / 0.05;
      if (p <= 0.40) return 1.0;
      if (p <= 0.47) return Math.max(0, 1 - (p - 0.40) / 0.07);
      return 0;
    case 4:
      if (p < 0.42) return 0;
      if (p < 0.47) return (p - 0.42) / 0.05;
      if (p <= 0.55) return 1.0;
      if (p <= 0.62) return Math.max(0, 1 - (p - 0.55) / 0.07);
      return 0;
    case 5:
      if (p < 0.57) return 0;
      if (p < 0.62) return (p - 0.57) / 0.05;
      if (p <= 0.70) return 1.0;
      if (p <= 0.77) return Math.max(0, 1 - (p - 0.70) / 0.07);
      return 0;
    case 6:
      if (p < 0.72) return 0;
      if (p < 0.77) return (p - 0.72) / 0.05;
      if (p <= 0.85) return 1.0;
      if (p <= 0.90) return Math.max(0, 1 - (p - 0.85) / 0.05);
      return 0;
    case 7:
      if (p < 0.85) return 0;
      if (p < 0.90) return (p - 0.85) / 0.05;
      return 1.0;
    default:
      return 0;
  }
}

export const CinematicScrollStage: React.FC<CinematicScrollStageProps> = ({
  isAuthenticated,
  onOpenSignUp,
  onEnterApp,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Normalized scroll progress 0.000 to 1.000
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const progressRef = useRef<number>(0);

  // Asset cache: Map<`${stageId}_${frameNum}`, HTMLImageElement>
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadingSetRef = useRef<Set<string>>(new Set());

  // Asset loading verification status for debug bar
  const [loadedStages, setLoadedStages] = useState<Record<number, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false
  });

  // Single Frame Loader
  const loadFrame = useCallback((stageId: number, frameNum: number): Promise<HTMLImageElement> => {
    const stage = STAGE_DEFS.find(s => s.id === stageId) || STAGE_DEFS[0];
    const validFrame = Math.max(1, Math.min(stage.totalFrames, Math.round(frameNum)));
    const key = `${stageId}_${validFrame}`;

    if (imageCacheRef.current.has(key)) {
      return Promise.resolve(imageCacheRef.current.get(key)!);
    }

    if (loadingSetRef.current.has(key)) {
      return new Promise((resolve) => {
        const check = () => {
          if (imageCacheRef.current.has(key)) {
            resolve(imageCacheRef.current.get(key)!);
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
      img.src = `/assets/${stageId}/${formatFrameFilename(validFrame)}`;
      img.onload = () => {
        imageCacheRef.current.set(key, img);
        loadingSetRef.current.delete(key);
        setLoadedStages(prev => prev[stageId] ? prev : { ...prev, [stageId]: true });
        resolve(img);
      };
      img.onerror = () => {
        loadingSetRef.current.delete(key);
        reject(new Error(`Failed /assets/${stageId}/${formatFrameFilename(validFrame)}`));
      };
    });
  }, []);

  // Preload frames across all stages rapidly using chunked concurrency
  useEffect(() => {
    STAGE_DEFS.forEach(stage => {
      // Load first 25 frames immediately
      for (let f = 1; f <= Math.min(25, stage.totalFrames); f++) {
        loadFrame(stage.id, f).catch(() => {});
      }
    });

    // In background, load keyframes (every 2nd frame) for all stages
    const loadAllBackground = async () => {
      for (const stage of STAGE_DEFS) {
        for (let f = 1; f <= stage.totalFrames; f += 2) {
          await loadFrame(stage.id, f).catch(() => {});
        }
      }
      // Fill remaining intermediate frames
      for (const stage of STAGE_DEFS) {
        for (let f = 2; f <= stage.totalFrames; f += 2) {
          await loadFrame(stage.id, f).catch(() => {});
        }
      }
    };

    const timer = setTimeout(loadAllBackground, 200);
    return () => clearTimeout(timer);
  }, [loadFrame]);

  // Main Page Scroll Listener (Direct normalized progress computation)
  useEffect(() => {
    let frameId: number | null = null;

    const updateScrollProgress = () => {
      frameId = null;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        progressRef.current = 0;
        setScrollProgress(0);
        setActiveStageId(1);
        return;
      }

      const currentScroll = -rect.top;
      const rawP = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      progressRef.current = rawP;
      setScrollProgress(rawP);

      // Determine active stage ID for header indicator
      let currentId = 1;
      for (const s of STAGE_DEFS) {
        if (rawP >= s.startP && rawP <= s.endP) {
          currentId = s.id;
          break;
        }
      }
      if (rawP > 0.90) currentId = 7;
      setActiveStageId(currentId);
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  // Priority Preload around active scroll progress
  useEffect(() => {
    STAGE_DEFS.forEach(stage => {
      if (scrollProgress >= stage.startP && scrollProgress <= stage.endP) {
        const localT = (scrollProgress - stage.startP) / (stage.endP - stage.startP);
        const centerFrame = Math.round(1 + localT * (stage.totalFrames - 1));
        for (let f = Math.max(1, centerFrame - 15); f <= Math.min(stage.totalFrames, centerFrame + 25); f++) {
          loadFrame(stage.id, f).catch(() => {});
        }
      }
    });
  }, [scrollProgress, loadFrame]);

  // Canvas Render Loop (Runs on requestAnimationFrame, drawing active stage frames with smooth cross-fade)
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const p = progressRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth || window.innerWidth;
      const displayH = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) {
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Base background fill (theme aware)
      ctx.fillStyle = isDark ? '#07090E' : '#F7F7F4';
      ctx.fillRect(0, 0, displayW, displayH);

      // Render active stages based on overlapping opacity
      STAGE_DEFS.forEach(stage => {
        const opacity = computeStageOpacity(stage.id, p);
        if (opacity <= 0.005) return;

        // Calculate local frame
        const localT = Math.max(0, Math.min(1, (p - stage.startP) / (stage.endP - stage.startP)));
        const targetFrame = Math.max(1, Math.min(stage.totalFrames, Math.round(1 + localT * (stage.totalFrames - 1))));

        const key = `${stage.id}_${targetFrame}`;
        let img = imageCacheRef.current.get(key);

        // Fallback to nearest cached frame in this stage
        if (!img) {
          let closestDiff = Infinity;
          for (let f = 1; f <= stage.totalFrames; f++) {
            const candidateKey = `${stage.id}_${f}`;
            if (imageCacheRef.current.has(candidateKey)) {
              const diff = Math.abs(f - targetFrame);
              if (diff < closestDiff) {
                closestDiff = diff;
                img = imageCacheRef.current.get(candidateKey);
              }
            }
          }
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

      // Theme-Aware Gradient Overlay for crisp typography contrast
      ctx.globalAlpha = 1.0;
      const gradient = ctx.createLinearGradient(0, 0, 0, displayH);

      if (isDark) {
        gradient.addColorStop(0, 'rgba(7, 9, 14, 0.70)');
        gradient.addColorStop(0.25, 'rgba(7, 9, 14, 0.15)');
        gradient.addColorStop(0.75, 'rgba(7, 9, 14, 0.15)');
        gradient.addColorStop(1, 'rgba(7, 9, 14, 0.80)');
      } else {
        gradient.addColorStop(0, 'rgba(247, 247, 244, 0.85)');
        gradient.addColorStop(0.25, 'rgba(247, 247, 244, 0.25)');
        gradient.addColorStop(0.75, 'rgba(247, 247, 244, 0.25)');
        gradient.addColorStop(1, 'rgba(247, 247, 244, 0.90)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayW, displayH);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  // Compute opacities for all 7 text stages directly from progress
  const s1Opacity = computeStageOpacity(1, scrollProgress);
  const s2Opacity = computeStageOpacity(2, scrollProgress);
  const s3Opacity = computeStageOpacity(3, scrollProgress);
  const s4Opacity = computeStageOpacity(4, scrollProgress);
  const s5Opacity = computeStageOpacity(5, scrollProgress);
  const s6Opacity = computeStageOpacity(6, scrollProgress);
  const s7Opacity = computeStageOpacity(7, scrollProgress);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '700vh' }}
    >
      {/* STICKY CINEMATIC VIEWPORT (Stays pinned at top: 0 while scrolling through the 700vh distance) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 0: Master Cross-Fading Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-0 pointer-events-none"
        />

        {/* Layer 10: Narrative Content Layer (Continuous Overlapping Stages) */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pointer-events-none select-none">
          {/* Top Status & Debug Indicator */}
          <div className="flex items-center justify-between w-full z-20">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/85 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 backdrop-blur-xl shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
              <span className="text-[#00E599] font-bold">STAGE 0{activeStageId}/07</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="font-semibold">SCROLL TO ADVANCE</span>
            </div>

            {/* Live Progress & Asset Verification Status */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white/85 dark:bg-slate-950/85 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
              <span className="text-slate-500 dark:text-slate-400">PROGRESS: {(scrollProgress * 100).toFixed(1)}%</span>
              <div className="hidden sm:flex items-center gap-1.5 pl-2.5 border-l border-slate-200 dark:border-slate-700">
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <span
                    key={num}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      loadedStages[num]
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {num}✓
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center Stage Narrative Container */}
          <div className="relative my-auto w-full z-20 flex flex-col items-center justify-center text-center">

            {/* ================= STAGE 1 — OVERVIEW ================= */}
            {s1Opacity > 0.01 && (
              <div
                style={{
                  opacity: s1Opacity,
                  transform: `translateY(${(1 - s1Opacity) * 30}px) scale(${0.94 + s1Opacity * 0.06})`,
                  pointerEvents: s1Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF2E7E]/15 border border-[#FF2E7E]/40 text-[#FF2E7E] font-mono text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E]" />
                  STAGE 01: OVERVIEW
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  MONEY MOVES. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E7E] via-rose-500 to-[#00E599]">
                    MARKETS CHANGE.
                  </span> <br />
                  KNOWLEDGE COMPOUNDS.
                </h1>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                  FinanceX is where financial knowledge becomes practical skill through learning, practice, simulation, and analysis.
                </p>
                <div className="pt-2 flex justify-center gap-4">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Learning Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STAGE 2 — EVOLUTION OF MONEY ================= */}
            {s2Opacity > 0.01 && (
              <div
                style={{
                  opacity: s2Opacity,
                  transform: `translateY(${(1 - s2Opacity) * 30}px) scale(${0.94 + s2Opacity * 0.06})`,
                  pointerEvents: s2Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-[#00E599] uppercase font-bold px-3.5 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/40">
                  STAGE 02: THE EVOLUTION OF MONEY
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  THE EVOLUTION OF MONEY
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center font-mono font-bold text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 shadow-md backdrop-blur-md">
                    <span className="text-amber-500">BARTER</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-normal mt-1">Direct Exchange</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 shadow-md backdrop-blur-md">
                    <span className="text-yellow-500">COINS</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-normal mt-1">Precious Metals</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 shadow-md backdrop-blur-md">
                    <span className="text-emerald-500">PAPER MONEY</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-normal mt-1">Fiat Banking</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 shadow-md backdrop-blur-md">
                    <span className="text-[#FF2E7E]">DIGITAL MONEY</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-normal mt-1">Global Systems</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
                  Money evolved because people needed better ways to exchange, store, and transfer value. Today, value moves at the speed of light.
                </p>
              </div>
            )}

            {/* ================= STAGE 3 — FINANCIAL FREEDOM ================= */}
            {s3Opacity > 0.01 && (
              <div
                style={{
                  opacity: s3Opacity,
                  transform: `translateY(${(1 - s3Opacity) * 30}px) scale(${0.94 + s3Opacity * 0.06})`,
                  pointerEvents: s3Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-amber-500 uppercase font-bold px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40">
                  STAGE 03: FINANCIAL FREEDOM
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  FINANCIAL FREEDOM
                </h2>
                <p className="text-lg sm:text-2xl text-emerald-600 dark:text-emerald-400 font-bold max-w-2xl mx-auto">
                  Financial freedom is not simply having more money.
                </p>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  It is understanding money, managing risk, making informed decisions, and building sustainable financial habits.
                </p>
                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 max-w-xl mx-auto backdrop-blur-md shadow-md">
                  FinanceX helps turn financial knowledge into practical skills through learning, practice, simulation, and analysis.
                </div>
              </div>
            )}

            {/* ================= STAGE 4 — BREAK THE OLD MODEL ================= */}
            {s4Opacity > 0.01 && (
              <div
                style={{
                  opacity: s4Opacity,
                  transform: `translateY(${(1 - s4Opacity) * 30}px) scale(${0.94 + s4Opacity * 0.06})`,
                  pointerEvents: s4Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-[#FF2E7E] uppercase font-bold px-3.5 py-1 rounded-full bg-[#FF2E7E]/15 border border-[#FF2E7E]/40">
                  STAGE 04: THE CRITICAL SHIFT
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  BREAK THE OLD WAY OF THINKING ABOUT MONEY.
                </h2>
                <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-950/85 border border-rose-300 dark:border-rose-500/30 shadow-xl max-w-xl mx-auto space-y-3 backdrop-blur-md">
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Move from simply earning money to understanding how money works.
                  </p>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#FF2E7E]">
                    MONEY IS A TOOL. NOT THE DESTINATION.
                  </div>
                </div>
              </div>
            )}

            {/* ================= STAGE 5 — THE 1% ================= */}
            {s5Opacity > 0.01 && (
              <div
                style={{
                  opacity: s5Opacity,
                  transform: `translateY(${(1 - s5Opacity) * 30}px) scale(${0.94 + s5Opacity * 0.06})`,
                  pointerEvents: s5Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-purple-500 uppercase font-bold px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/40">
                  STAGE 05: MINDSET
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  THE 1%
                </h2>
                <p className="text-lg sm:text-2xl text-purple-600 dark:text-purple-300 font-bold max-w-xl mx-auto">
                  The 1% mindset is not about being rich. It is about thinking differently.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto font-mono text-xs text-left">
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 backdrop-blur-md shadow-sm">
                    <span className="text-purple-500 font-bold">01</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Learn continuously.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 backdrop-blur-md shadow-sm">
                    <span className="text-purple-500 font-bold">02</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Understand markets.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 backdrop-blur-md shadow-sm">
                    <span className="text-purple-500 font-bold">03</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Manage risk.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 backdrop-blur-md shadow-sm">
                    <span className="text-purple-500 font-bold">04</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Make disciplined decisions.</p>
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  FinanceX is built for that journey.
                </p>
              </div>
            )}

            {/* ================= STAGE 6 — RICH WITH RISK ================= */}
            {s6Opacity > 0.01 && (
              <div
                style={{
                  opacity: s6Opacity,
                  transform: `translateY(${(1 - s6Opacity) * 30}px) scale(${0.94 + s6Opacity * 0.06})`,
                  pointerEvents: s6Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-cyan-500 uppercase font-bold px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40">
                  STAGE 06: RISK MASTERY
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  RICH WITH RISK
                </h2>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
                  Every financial opportunity carries risk. Understand it. Measure it. Manage it.
                </p>
                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 max-w-lg mx-auto backdrop-blur-md shadow-md">
                  <span className="text-cyan-500 font-bold">Analysis</span> + <span className="text-emerald-500 font-bold">Risk Management</span> + <span className="text-[#FF2E7E] font-bold">Discipline</span> create better financial decisions.
                </div>
              </div>
            )}

            {/* ================= STAGE 7 — MINDSET ================= */}
            {s7Opacity > 0.01 && (
              <div
                style={{
                  opacity: s7Opacity,
                  transform: `translateY(${(1 - s7Opacity) * 30}px) scale(${0.94 + s7Opacity * 0.06})`,
                  pointerEvents: s7Opacity > 0.5 ? 'auto' : 'none'
                }}
                className="absolute inset-0 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
              >
                <span className="text-xs font-mono tracking-widest text-[#00E599] uppercase font-bold px-3.5 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/40">
                  STAGE 07: THE 5 PRINCIPLES
                </span>
                <div className="flex flex-wrap justify-center gap-3 font-mono font-bold text-xs sm:text-sm">
                  {['DISCIPLINE', 'PATIENCE', 'FOCUS', 'CONSISTENCY', 'MINDSET'].map((item, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-950/80 border border-white/60 dark:border-slate-800 text-slate-900 dark:text-white shadow-md backdrop-blur-md">
                      {item}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  KNOWLEDGE GIVES YOU THE TOOLS. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E599] via-cyan-400 to-[#FF2E7E]">
                    DISCIPLINE GIVES YOU THE EDGE.
                  </span>
                </h2>
                <div className="pt-2 flex justify-center gap-4">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF2E7E] to-[#E61E6D] dark:from-[#00E599] dark:to-[#00B377] text-white dark:text-slate-950 font-bold text-xs shadow-md dark:shadow-[0_0_25px_rgba(0,229,153,0.35)] transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Open FinanceX</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Interactive Navigation Indicator */}
          <div className="flex items-center justify-between w-full z-20 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              FINANCEX CINEMATIC DOCUSERIES
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#00E599] font-bold">
              <span>{activeStageId < 7 ? `STAGE 0${activeStageId + 1} NEXT` : 'INTERACTIVE DEMO BELOW'}</span>
              <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
