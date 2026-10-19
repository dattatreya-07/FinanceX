import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Compass, Award, CheckCircle2, Zap, BarChart2, Activity, Percent, DollarSign, Layers } from 'lucide-react';

interface StageOverlayProps {
  stage: number; // 1 to 7
  progress: number; // 0.0 to 1.0
  currentFrame: number;
  totalFrames: number;
  onEnterApp: () => void;
  onOpenSignUp: () => void;
  isAuthenticated: boolean;
}

export const CinematicStageOverlay: React.FC<StageOverlayProps> = ({
  stage,
  progress,
  currentFrame,
  totalFrames,
  onEnterApp,
  onOpenSignUp,
  isAuthenticated,
}) => {
  // Determine text phase to ensure continuous text display without blank gaps
  const p = Math.max(0, Math.min(1, progress));

  return (
    <div className="relative w-full h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pointer-events-none select-none z-20">
      {/* Top Header Badge Bar */}
      <div className="flex items-center justify-between w-full z-30">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200/90 dark:border-slate-800/90 text-xs font-mono text-slate-800 dark:text-slate-300 backdrop-blur-xl shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00E599] animate-pulse" />
          <span className="text-emerald-700 dark:text-[#00E599] font-bold">STAGE 0{stage}/07</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-700 dark:text-slate-300 font-mono font-semibold">FRAME {currentFrame}/{totalFrames}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-950/75 px-3.5 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-xl shadow-md">
          <span className="text-slate-500 dark:text-slate-400">SCROLL STORY</span>
          <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF2E7E] via-cyan-400 to-[#00E599] transition-all duration-150"
              style={{ width: `${Math.round(p * 100)}%` }}
            />
          </div>
          <span className="text-slate-900 dark:text-white font-bold">{Math.round(p * 100)}%</span>
        </div>
      </div>

      {/* Center Main Stage Content */}
      <div className="relative my-auto w-full z-30 flex flex-col items-center justify-center text-center">
        {/* ====================================================
            STAGE 1 — OVERVIEW
        ==================================================== */}
        {stage === 1 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.35 && (
              <motion.div
                key="s1-p1"
                initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2E7E]/15 border border-[#FF2E7E]/40 text-[#FF2E7E] font-mono text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E]" />
                  FINANCEX OVERVIEW
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-tight">
                  Money moves. Markets change. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E7E] via-rose-400 to-[#00E599]">
                    Knowledge compounds.
                  </span>
                </h1>
              </motion.div>
            )}

            {p > 0.35 && p <= 0.70 && (
              <motion.div
                key="s1-p2"
                initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.35 }}
                className="space-y-4 max-w-3xl mx-auto"
              >
                <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                  Master the mechanics of capital.
                </h2>
                <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
                  FinanceX is your gamified, AI-powered platform for learning finance, reading global markets, executing paper trades, and making superior financial decisions.
                </p>
              </motion.div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s1-p3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
                  Learn how money works. <br />
                  <span className="text-[#00E599]">Understand the markets.</span> <br />
                  <span className="text-[#FF2E7E]">Build better financial decisions.</span>
                </h2>
                <div className="pt-2 flex justify-center gap-4 pointer-events-auto">
                  <button
                    onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
                    className="px-8 py-3.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Learning Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 2 — EVOLUTION OF MONEY
        ==================================================== */}
        {stage === 2 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.25 && (
              <motion.div
                key="s2-p1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <span className="text-xs font-mono tracking-widest text-[#00E599] uppercase font-bold px-3 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/40">
                  STAGE 02: THE EVOLUTION OF MONEY
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-white">
                  Money wasn't always digital.
                </h2>
                <p className="text-lg text-slate-300 font-mono">
                  Every generation transformed how value was stored and exchanged.
                </p>
              </motion.div>
            )}

            {p > 0.25 && p <= 0.70 && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  THE 5 ERAS OF FINANCIAL EVOLUTION
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {[
                    { era: "BARTER", detail: "Direct commodity swap", highlight: p >= 0.25, badge: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
                    { era: "COINS", detail: "Minted precious metals", highlight: p >= 0.35, badge: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300" },
                    { era: "PAPER MONEY", detail: "Central bank fiat", highlight: p >= 0.45, badge: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
                    { era: "DIGITAL MONEY", detail: "Electronic ledgers & SWIFT", highlight: p >= 0.55, badge: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
                    { era: "MODERN SYSTEMS", detail: "AI & Algorithmic Markets", highlight: p >= 0.65, badge: "bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-[0_0_20px_rgba(255,46,126,0.35)]" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.85, y: 15 }}
                      animate={{ 
                        opacity: item.highlight ? 1 : 0.25, 
                        scale: item.highlight ? 1 : 0.9,
                        y: 0 
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-3.5 rounded-2xl border backdrop-blur-xl text-center space-y-1 ${item.badge}`}
                    >
                      <div className="text-xs font-mono font-bold">{item.era}</div>
                      <div className="text-[10px] opacity-80">{item.detail}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s2-p3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <h3 className="text-2xl sm:text-4xl font-display font-black text-white">
                  Today, money moves at the speed of algorithms.
                </h3>
                <p className="text-slate-300 text-sm font-mono">
                  Understanding this evolution is your first step toward mastering modern finance.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 3 — FINANCIAL FREEDOM
        ==================================================== */}
        {stage === 3 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.35 && (
              <motion.div
                key="s3-p1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40">
                  STAGE 03: FINANCIAL FREEDOM
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-white leading-tight">
                  What is financial freedom?
                </h2>
                <p className="text-2xl sm:text-3xl text-emerald-400 font-bold font-display">
                  It's not about luxury. It's about autonomy.
                </p>
              </motion.div>
            )}

            {p > 0.35 && p <= 0.70 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <p className="text-sm font-mono text-slate-300">
                  Understanding money, managing risk, investing wisely, and building long-term financial discipline are the foundations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  {[
                    { title: "Understand Money", desc: "Know accounting, cashflow, and valuation.", icon: <DollarSign className="w-5 h-5 text-emerald-400" /> },
                    { title: "Manage Risk", desc: "Protect downside before chasing returns.", icon: <ShieldCheck className="w-5 h-5 text-cyan-400" /> },
                    { title: "Build Discipline", desc: "Execute consistent long-term strategies.", icon: <Award className="w-5 h-5 text-purple-400" /> }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="p-5 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-xl space-y-2"
                    >
                      {item.icon}
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s3-p3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <h3 className="text-2xl sm:text-4xl font-display font-black text-[#00E599]">
                  FinanceX turns theory into practical execution.
                </h3>
                <p className="text-slate-300 text-xs font-mono">
                  Through structured lessons, paper trading lab simulations, AI tutoring, and timed regulatory mock exams.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 4 — BREAK / CRUSH THE MONEY
        ==================================================== */}
        {stage === 4 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.35 && (
              <motion.div
                key="s4-p1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <span className="text-xs font-mono tracking-widest text-[#FF2E7E] uppercase font-bold px-3 py-1 rounded-full bg-[#FF2E7E]/15 border border-[#FF2E7E]/40">
                  STAGE 04: BREAK OLD MYTHS
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-white">
                  Break old assumptions about money.
                </h2>
                <p className="text-xl text-rose-300 font-bold font-display">
                  Stop chasing speculation. Start building financial intelligence.
                </p>
              </motion.div>
            )}

            {p > 0.35 && p <= 0.70 && (
              <motion.div
                key="s4-p2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto p-6 rounded-3xl bg-slate-950/85 border border-rose-500/30 backdrop-blur-xl shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white">Deconstruct financial illusions.</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  When you understand market mechanics, derivatives pricing, and stochastic volatility, money ceases to be a mystery and becomes a controllable tool.
                </p>
              </motion.div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s4-p3"
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <div className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-white leading-none">
                  MONEY IS A TOOL.
                </div>
                <div className="text-2xl sm:text-4xl font-mono font-bold text-[#FF2E7E] tracking-widest uppercase">
                  NOT THE DESTINATION.
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 5 — THE 1%
        ==================================================== */}
        {stage === 5 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.35 && (
              <motion.div
                key="s5-p1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <span className="text-xs font-mono tracking-widest text-purple-400 uppercase font-bold px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40">
                  STAGE 05: THE 1% MINDSET
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-white">
                  The "1%" isn't about status.
                </h2>
                <p className="text-2xl sm:text-3xl text-purple-300 font-bold font-display">
                  It represents disciplined financial thinking.
                </p>
              </motion.div>
            )}

            {p > 0.35 && p <= 0.70 && (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  WHAT SEPARATES THE TOP 1% OF ASPIRANTS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="p-4 rounded-2xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-xl">
                    <span className="text-xs font-mono text-purple-400 font-bold">01</span>
                    <h4 className="text-sm font-bold text-white mt-1">Continuous Learning</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Master accounting, fixed income, and option Greeks.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-xl">
                    <span className="text-xs font-mono text-purple-400 font-bold">02</span>
                    <h4 className="text-sm font-bold text-white mt-1">Market Understanding</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Understand liquidity, market depth, and order books.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-xl">
                    <span className="text-xs font-mono text-purple-400 font-bold">03</span>
                    <h4 className="text-sm font-bold text-white mt-1">Emotional Neutrality</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Execute systematic risk rules without greed or panic.</p>
                  </div>
                </div>
              </div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s5-p3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <h3 className="text-2xl sm:text-4xl font-display font-black text-white">
                  Think differently. Trade intelligently. <br />
                  <span className="text-[#00E599]">Build deliberately with FinanceX.</span>
                </h3>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 6 — RICH WITH RISK
        ==================================================== */}
        {stage === 6 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.35 && (
              <motion.div
                key="s6-p1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40">
                  STAGE 06: RICH WITH RISK
                </span>
                <h2 className="text-4xl sm:text-6xl font-display font-black text-white">
                  Financial growth cannot be separated from risk.
                </h2>
              </motion.div>
            )}

            {p > 0.35 && p <= 0.70 && (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  THE RISK ARCHITECTURE LOOP
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800">
                    <span className="text-[#FF2E7E] font-bold">1. AWARENESS</span>
                    <p className="text-slate-300 mt-1">Identify max drawdown & VaR.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800">
                    <span className="text-cyan-400 font-bold">2. ANALYSIS</span>
                    <p className="text-slate-300 mt-1">Calculate Delta & Sharpe ratio.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800">
                    <span className="text-amber-400 font-bold">3. DECISION</span>
                    <p className="text-slate-300 mt-1">Sizing based on probability.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800">
                    <span className="text-[#00E599] font-bold">4. DISCIPLINE</span>
                    <p className="text-slate-300 mt-1">Enforce stop-loss unconditionally.</p>
                  </div>
                </div>
              </div>
            )}

            {p > 0.70 && (
              <motion.div
                key="s6-p3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <div className="text-3xl sm:text-5xl font-display font-black text-white">
                  Risk isn't the enemy.
                </div>
                <div className="text-2xl sm:text-4xl font-mono font-bold text-rose-500">
                  UNMANAGED RISK IS.
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ====================================================
            STAGE 7 — MINDSET & SKILLS
        ==================================================== */}
        {stage === 7 && (
          <div className="max-w-4xl space-y-6">
            {p <= 0.65 && (
              <div className="space-y-4">
                <span className="text-xs font-mono tracking-widest text-[#00E599] uppercase font-bold px-3 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/40">
                  STAGE 07: THE 5 PILLARS OF TRADING MASTERY
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto text-center font-mono">
                  {[
                    { name: "DISCIPLINE", quote: "Follow plan, not emotion", active: p >= 0.05 },
                    { name: "PATIENCE", quote: "Good trades require waiting", active: p >= 0.18 },
                    { name: "FOCUS", quote: "Ignore market noise", active: p >= 0.30 },
                    { name: "CONSISTENCY", quote: "Small actions compound", active: p >= 0.42 },
                    { name: "MINDSET", quote: "Decisions shape future", active: p >= 0.54 }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ 
                        opacity: item.active ? 1 : 0.25,
                        scale: item.active ? 1 : 0.95
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-xl space-y-1"
                    >
                      <div className="text-xs font-bold text-[#00E599]">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.quote}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {p > 0.65 && (
              <motion.div
                key="s7-p2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                  Knowledge gives you the tools. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E599] via-cyan-400 to-[#FF2E7E]">
                    Discipline gives you the edge.
                  </span>
                </h2>
                <p className="text-base text-slate-300 font-mono">
                  Build your financial edge with FinanceX.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Progress Footer Bar */}
      <div className="flex items-center justify-between w-full z-30 pt-4 border-t border-slate-800/60">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
          FINANCEX CINEMATIC STORY
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#00E599] font-bold">
          <span>{stage < 7 ? `CHAPTER 0${stage + 1} NEXT` : 'INTERACTIVE DEMO BELOW'}</span>
          <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
