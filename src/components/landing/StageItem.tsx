import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'motion/react';
import { StageFrameCanvas } from './StageFrameCanvas';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Award, TrendingUp, DollarSign } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StageItemProps {
  stageId: number; // 1 to 7
  totalFrames: number; // 200 or 250
  minHeightClass?: string;
  isAuthenticated: boolean;
  onOpenSignUp: () => void;
  onEnterApp: () => void;
  onScrollToDemo?: () => void;
}

export const StageItem: React.FC<StageItemProps> = ({
  stageId,
  totalFrames,
  minHeightClass = 'min-h-[160vh]',
  isAuthenticated,
  onOpenSignUp,
  onEnterApp,
  onScrollToDemo,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Framer Motion native useScroll targeting this specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [progressVal, setProgressVal] = useState<number>(0);
  const smoothProgressRef = useRef<number>(0);

  // Momentum lerp loop on requestAnimationFrame to eliminate micro-stuttering
  useEffect(() => {
    let animId: number;

    const updateSmoothProgress = () => {
      const target = scrollYProgress.get();
      const diff = target - smoothProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        smoothProgressRef.current += diff * 0.22;
      } else {
        smoothProgressRef.current = target;
      }

      const p = Math.max(0, Math.min(1, smoothProgressRef.current));
      setProgressVal(p);

      const f = Math.max(1, Math.min(totalFrames, Math.round(1 + p * (totalFrames - 1))));
      setCurrentFrame(f);

      animId = requestAnimationFrame(updateSmoothProgress);
    };

    animId = requestAnimationFrame(updateSmoothProgress);
    return () => cancelAnimationFrame(animId);
  }, [scrollYProgress, totalFrames]);

  // Synchronized text opacity and vertical translate transforms with strict trigger bounds
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.82, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15, 0.82, 1], [25, 0, 0, -20]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0.4, 1, 1, 0.4]);

  return (
    <section ref={sectionRef} className={`relative w-full ${minHeightClass}`}>
      {/* STICKY VIEWPORT (Pins at top-0 h-screen while scrolling through this section's height) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden theme-transition">
        {/* Layer 0: Frame Canvas */}
        <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0 w-full h-full z-0">
          <StageFrameCanvas
            folderIndex={stageId}
            totalFrames={totalFrames}
            currentFrame={currentFrame}
            opacity={1.0}
          />
        </motion.div>

        {/* Layer 10: Clean Consumer Narrative Layer (No telemetry overlays) */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pointer-events-none select-none">
          {/* Center Stage Narrative */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative my-auto w-full z-20 flex flex-col items-center justify-center text-center"
          >
            {/* ================= STAGE 1 — OVERVIEW ================= */}
            {stageId === 1 && (
              <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 dark:bg-[#FF2E7E]/15 border border-pink-200 dark:border-[#FF2E7E]/40 text-pink-700 dark:text-[#FF2E7E] font-mono text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E]" />
                  FINANCEX ACADEMY
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Learn Finance. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E7E] via-rose-500 to-[#00E599]">
                    Understand Money.
                  </span> <br />
                  Build Freedom.
                </h1>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                  FinanceX turns financial education into an interactive journey through money, markets, trading, risk and financial decision-making.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-4 pointer-events-auto">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-md dark:shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {onScrollToDemo && (
                    <button
                      onClick={onScrollToDemo}
                      className="px-7 py-3.5 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Explore FinanceX
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ================= STAGE 2 — EVOLUTION OF MONEY ================= */}
            {stageId === 2 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-emerald-700 dark:text-[#00E599] uppercase font-bold px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-[#00E599]/15 border border-emerald-200 dark:border-[#00E599]/40">
                  THE EVOLUTION OF MONEY
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Money Has Always Evolved.
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto text-center font-mono font-bold text-xs">
                  <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${progressVal >= 0.1 ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'}`}>
                    <span>BARTER</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Goods for goods</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${progressVal >= 0.28 ? 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500/40 text-yellow-900 dark:text-yellow-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'}`}>
                    <span>COINS</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Precious metals</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${progressVal >= 0.46 ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'}`}>
                    <span>PAPER MONEY</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Fiat currency</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${progressVal >= 0.64 ? 'bg-cyan-100 dark:bg-cyan-500/20 border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'}`}>
                    <span>DIGITAL MONEY</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Electronic ledgers</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${progressVal >= 0.80 ? 'bg-pink-100 dark:bg-pink-500/20 border-pink-300 dark:border-pink-500/40 text-pink-900 dark:text-pink-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'}`}>
                    <span>MODERN SYSTEMS</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Algorithmic web</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
                  From exchanging goods to digital transactions, money evolved because people needed a better way to store, exchange and measure value.
                </p>
              </div>
            )}

            {/* ================= STAGE 3 — FINANCIAL FREEDOM ================= */}
            {stageId === 3 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase font-bold px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/40">
                  FINANCIAL FREEDOM
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Financial Freedom Is Not Luck.
                </h2>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Financial freedom means having enough financial knowledge, assets and control over your decisions to reduce dependence on a single source of income.
                </p>
                <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 max-w-xl mx-auto shadow-sm">
                  FinanceX helps you understand markets, investing, risk and financial decisions through structured learning and simulation.
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Knowledge</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Income</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Investing</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-[#00E599]">Risk Management</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#FF2E7E] text-white">Financial Freedom</span>
                </div>
              </div>
            )}

            {/* ================= STAGE 4 — CRUSH THE MONEY ================= */}
            {stageId === 4 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-[#FF2E7E] uppercase font-bold px-4 py-1.5 rounded-full bg-pink-50 dark:bg-[#FF2E7E]/15 border border-pink-200 dark:border-[#FF2E7E]/40">
                  THE CRITICAL SHIFT
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Don't Let Money Control You.
                </h2>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
                  Understand it. Manage it. Make better decisions with it.
                </p>
                <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-950/85 border border-pink-200 dark:border-rose-500/30 shadow-xl max-w-xl mx-auto space-y-3">
                  <div className="text-2xl sm:text-4xl font-display font-black text-[#FF2E7E]">
                    MONEY IS A TOOL. NOT THE DESTINATION.
                  </div>
                </div>
              </div>
            )}

            {/* ================= STAGE 5 — THE 1% ================= */}
            {stageId === 5 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-purple-600 dark:text-purple-400 uppercase font-bold px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/40">
                  THE 1% MINDSET
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Think Like the 1%.
                </h2>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  The difference is not simply how much money someone has. It is how they understand opportunity, risk, discipline and long-term decisions.
                </p>
                <div className="flex flex-wrap justify-center gap-3 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  {['Knowledge', 'Risk', 'Strategy', 'Discipline', 'Execution'].map((item, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STAGE 6 — WEALTH + RISK ================= */}
            {stageId === 6 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-cyan-600 dark:text-cyan-400 uppercase font-bold px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/40">
                  WEALTH & RISK
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Wealth Without Risk Is an Illusion.
                </h2>
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
                  Every financial opportunity carries risk. The goal is not to eliminate risk, but to understand, measure and manage it.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-2 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  <span className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">Risk</span>
                  <span>→</span>
                  <span className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">Analysis</span>
                  <span>→</span>
                  <span className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">Decision</span>
                  <span>→</span>
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950">Outcome</span>
                </div>
              </div>
            )}

            {/* ================= STAGE 7 — MINDSET + SKILLS ================= */}
            {stageId === 7 && (
              <div className="max-w-4xl space-y-6">
                <span className="text-xs font-mono tracking-widest text-emerald-700 dark:text-[#00E599] uppercase font-bold px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-[#00E599]/15 border border-emerald-200 dark:border-[#00E599]/40">
                  TRADING MINDSET & SKILLS
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white">
                  Master the Mind Before the Market.
                </h2>
                <div className="flex flex-wrap justify-center gap-3 font-mono font-bold text-xs sm:text-sm">
                  {['DISCIPLINE', 'PATIENCE', 'FOCUS', 'CONSISTENCY', 'MINDSET'].map((item, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
                      {item}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl sm:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight pt-2">
                  Knowledge gives you the tools. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-500 to-[#FF2E7E] dark:from-[#00E599] dark:via-cyan-400 dark:to-[#FF2E7E]">
                    Discipline gives you the edge.
                  </span>
                </h3>
                <div className="pt-2 flex justify-center gap-4 pointer-events-auto">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-4 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-md dark:shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter FinanceX Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
