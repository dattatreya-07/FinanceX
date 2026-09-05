import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  FlaskConical, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  CheckCircle2, 
  Menu, 
  X, 
  Flame, 
  Zap, 
  Heart, 
  ChevronRight, 
  BarChart3
} from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';
import { ThemeToggle } from '../layout/ThemeToggle';
import { User } from '../../types/schema';
import { CinematicStoryStage } from './CinematicStoryStage';

interface LandingPageViewProps {
  isAuthenticated: boolean;
  user?: User;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onEnterApp: () => void;
  onNavigateCourse?: (courseId: number) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  isAuthenticated,
  user,
  onOpenSignIn,
  onOpenSignUp,
  onEnterApp,
  onNavigateCourse
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'week' | 'month'>('week');
  const [sliderValue, setSliderValue] = useState(125693);

  const marketTickerItems = [
    { symbol: 'NIFTY 50', price: '24,812.40', change: '+0.84%', up: true },
    { symbol: 'SENSEX', price: '81,332.10', change: '+0.62%', up: true },
    { symbol: 'BANK NIFTY', price: '52,140.85', change: '+1.02%', up: true },
    { symbol: 'USD/INR', price: '₹83.62', change: '-0.14%', up: false },
    { symbol: 'GOLD (10g)', price: '₹72,450', change: '+0.38%', up: true },
    { symbol: 'NASDAQ 100', price: '17,940.20', change: '+0.71%', up: true },
    { symbol: 'BTC/USD', price: '$64,280.00', change: '+2.45%', up: true },
    { symbol: 'CRUDE OIL', price: '$76.20', change: '-0.80%', up: false },
    { symbol: 'NISM VIII (F&O)', price: 'INDEX SIM', change: '+1.15%', up: true },
  ];

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 selection:bg-[#FF2E7E] selection:text-white font-sans antialiased theme-transition">
      {/* 1. FIXED TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#07090E]/90 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/80 theme-transition shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <FinanceXLogo size="md" variant="full" animated={true} />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#FF2E7E] dark:hover:text-white transition-colors cursor-pointer"
            >
              The Story
            </button>
            <button 
              onClick={() => scrollToSection('demo')}
              className="hover:text-[#FF2E7E] dark:hover:text-white transition-colors cursor-pointer"
            >
              Interactive Demo
            </button>
            <button 
              onClick={() => scrollToSection('learn')}
              className="hover:text-[#FF2E7E] dark:hover:text-white transition-colors cursor-pointer"
            >
              Curriculum
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#FF2E7E] dark:hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle variant="compact" />

            {isAuthenticated ? (
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-[#00E599] dark:to-[#00B377] text-white dark:text-slate-950 font-bold text-xs hover:brightness-110 shadow-sm dark:shadow-[0_0_20px_rgba(0,229,153,0.35)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Open FinanceX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenSignIn}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={onOpenSignUp}
                  className="px-5 py-2.5 rounded-full bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-sm dark:shadow-[0_0_20px_rgba(255,46,126,0.4)] transition-all duration-200 cursor-pointer"
                >
                  Get started
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle variant="compact" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] px-4 py-6 space-y-4 shadow-xl"
            >
              <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <button 
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-left py-2 hover:text-[#FF2E7E] dark:hover:text-white"
                >
                  The Story
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="text-left py-2 hover:text-[#FF2E7E] dark:hover:text-white"
                >
                  Interactive Demo
                </button>
                <button 
                  onClick={() => scrollToSection('learn')}
                  className="text-left py-2 hover:text-[#FF2E7E] dark:hover:text-white"
                >
                  Curriculum
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 hover:text-[#FF2E7E] dark:hover:text-white"
                >
                  How It Works
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onEnterApp();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-[#00E599] dark:to-[#00B377] text-white dark:text-slate-950 font-bold text-xs text-center shadow-md"
                  >
                    Open FinanceX Dashboard →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenSignIn();
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-slate-900 font-semibold text-xs text-center"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenSignUp();
                      }}
                      className="w-full py-3 rounded-xl bg-[#FF2E7E] text-white font-bold text-xs text-center shadow-md"
                    >
                      Get started
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INFINITE MARKET TICKER */}
        <div className="bg-slate-100/90 dark:bg-[#05070B] border-t border-b border-slate-200 dark:border-slate-800/80 py-2 overflow-hidden select-none theme-transition">
          <div className="flex items-center gap-2 max-w-7xl mx-auto px-4 mb-0.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-700 dark:text-[#00E599] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00E599] animate-pulse" />
              LIVE SIMULATED MARKET TICKER
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">• REAL-TIME CAPITAL MARKETS</span>
          </div>

          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="inline-flex gap-8 animate-marquee">
              {[...marketTickerItems, ...marketTickerItems, ...marketTickerItems].map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-slate-800 dark:text-slate-300">{item.symbol}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.price}</span>
                  <span className={`font-bold flex items-center gap-0.5 ${item.up ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                    {item.up ? '▲' : '▼'} {item.change}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 ml-4">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. CONTINUOUS CINEMATIC STORY STAGE (CHAPTERS 1 TO 7) */}
      <div id="story" className="relative w-full">
        <CinematicStoryStage
          isAuthenticated={isAuthenticated}
          onOpenSignUp={onOpenSignUp}
          onEnterApp={onEnterApp}
          onScrollToDemo={() => scrollToSection('demo')}
        />
      </div>

      {/* 3. INTERACTIVE BENTO DASHBOARD DISPLAY */}
      <section id="demo" className="py-20 bg-white dark:bg-[#05070B] border-t border-b border-slate-200 dark:border-slate-800 relative z-30 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40">
                  LIVE INTERFACE DEMO
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Interactive Financial Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white mt-2">
                Visual Analytics Built for Serious Aspirants
              </h2>
            </div>

            <button
              onClick={isAuthenticated ? onEnterApp : onOpenSignUp}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition flex items-center gap-2 self-start md:self-auto shadow-sm cursor-pointer"
            >
              <span>Test Drive Full Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 Cols): Top Courses & Learner Trends Flower Chart */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Top Courses */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 theme-transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Courses</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">178 total courses available</p>
                  </div>
                  <span className="text-slate-400 text-xs">•••</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-500/30">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">AI for beginners</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">+120 new learners</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">4,120</div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/30">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Derivatives & Options Greeks</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">+82 joined recently</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">3,780</div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-500/30">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Portfolio Construction & Risk</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">+12 active now</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">2,980</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Learner Trends (Radial Flower Chart Gauge) */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 theme-transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Learner Trends</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 dark:text-[#00E599]">6-PETAL RADIAL</span>
                </div>

                <div className="relative py-4 flex items-center justify-center">
                  <div className="relative w-60 h-60 flex items-center justify-center">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-22 h-22 rounded-full bg-emerald-50 dark:bg-gradient-to-b dark:from-emerald-500/30 dark:to-slate-900/90 border border-emerald-200 dark:border-emerald-500/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-emerald-800 dark:text-slate-400">Engagement</span>
                      <span className="text-xs font-bold text-emerald-950 dark:text-white font-mono">87%</span>
                    </div>
                    <div className="absolute top-6 right-1 w-22 h-22 rounded-full bg-teal-50 dark:bg-gradient-to-bl dark:from-teal-500/30 dark:to-slate-900/90 border border-teal-200 dark:border-teal-500/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-teal-800 dark:text-slate-400">Consistency</span>
                      <span className="text-xs font-bold text-teal-950 dark:text-white font-mono">89%</span>
                    </div>
                    <div className="absolute bottom-6 right-1 w-22 h-22 rounded-full bg-purple-50 dark:bg-gradient-to-tl dark:from-purple-500/30 dark:to-slate-900/90 border border-purple-200 dark:border-purple-500/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-purple-800 dark:text-slate-400">Motivation</span>
                      <span className="text-xs font-bold text-purple-950 dark:text-white font-mono">38%</span>
                    </div>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-22 h-22 rounded-full bg-slate-100 dark:bg-gradient-to-t dark:from-slate-700/40 dark:to-slate-900/90 border border-slate-300 dark:border-slate-600/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-slate-600 dark:text-slate-400">Completion</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">21%</span>
                    </div>
                    <div className="absolute bottom-6 left-1 w-22 h-22 rounded-full bg-rose-50 dark:bg-gradient-to-tr dark:from-rose-500/30 dark:to-slate-900/90 border border-rose-200 dark:border-rose-500/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-rose-800 dark:text-slate-400">Retention</span>
                      <span className="text-xs font-bold text-rose-950 dark:text-white font-mono">39%</span>
                    </div>
                    <div className="absolute top-6 left-1 w-22 h-22 rounded-full bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-500/30 dark:to-slate-900/90 border border-cyan-200 dark:border-cyan-500/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 shadow-sm">
                      <span className="text-[9px] text-cyan-800 dark:text-slate-400">Focus time</span>
                      <span className="text-xs font-bold text-cyan-950 dark:text-white font-mono">90%</span>
                    </div>
                    <div className="relative z-10 w-11 h-11 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 text-[#FF2E7E] fill-[#FF2E7E]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Learners On Platform & Top Learners Table */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 3: Learners On The Platform */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 theme-transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold text-base">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Learners On The Platform</span>
                  </div>
                  <button className="px-3.5 py-1 rounded-full bg-white dark:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200 dark:border-transparent shadow-xs cursor-pointer">
                    Full Stats
                  </button>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-display">
                    {sliderValue.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">learners on the platform</span>
                    <span className="text-cyan-700 dark:text-cyan-400 font-bold">20% closer to your goal</span>
                  </div>
                </div>

                {/* Gradient Progress Slider */}
                <div className="space-y-2">
                  <div className="relative w-full h-8 rounded-xl bg-gradient-to-r from-rose-400 via-cyan-400 to-emerald-400 p-0.5 flex items-center overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 right-0 bg-slate-200/90 dark:bg-slate-900/90 transition-all duration-300"
                      style={{ left: `${(sliderValue / 200000) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1 bottom-1 w-1.5 bg-white rounded-full shadow-[0_0_10px_#FFFFFF] cursor-pointer"
                      style={{ left: `calc(${(sliderValue / 200000) * 100}% - 3px)` }}
                    />
                    <div className="relative z-10 w-full px-3 flex justify-between text-[10px] font-mono font-bold text-slate-950 pointer-events-none">
                      <span>10k</span>
                      <span className="text-slate-700 dark:text-slate-400">200k</span>
                    </div>
                  </div>
                </div>

                {/* Daily user activity matrix */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Daily user activity</span>
                    <div className="flex gap-8 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span>June</span>
                      <span>July</span>
                      <span>August</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-24 gap-1 pt-1">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 rounded-xs ${
                          i % 7 === 0 ? 'bg-[#FF2E7E]' :
                          i % 5 === 0 ? 'bg-emerald-400' :
                          i % 3 === 0 ? 'bg-cyan-400' :
                          i % 2 === 0 ? 'bg-purple-300 dark:bg-purple-900/60' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Top Learners Table */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 theme-transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Learners</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Competitive global cohort</p>
                  </div>

                  <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                    <button
                      onClick={() => setActiveLeaderboardTab('week')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        activeLeaderboardTab === 'week' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setActiveLeaderboardTab('month')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        activeLeaderboardTab === 'month' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    { rank: 1, name: 'Aarav Mehta', xp: '18,420 XP', streak: '42d', role: 'FRM Part II', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                    { rank: 2, name: 'Priya Sharma', xp: '16,890 XP', streak: '38d', role: 'NISM VIII Prep', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
                    { rank: 3, name: 'Vikramaditya Roy', xp: '14,350 XP', streak: '29d', role: 'CFA Level 1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
                  ].map((l) => (
                    <div key={l.rank} className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                          l.rank === 1 ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30' :
                          l.rank === 2 ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' :
                          'bg-orange-100 text-orange-800 dark:bg-amber-700/20 dark:text-amber-500'
                        }`}>
                          {l.rank}
                        </span>
                        <img src={l.avatar} alt={l.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{l.name}</div>
                          <div className="text-[10px] text-slate-500">{l.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-xs font-bold text-emerald-700 dark:text-[#00E599]">{l.xp}</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{l.streak} 🔥</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE CAPABILITIES GRID */}
      <section id="learn" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#00E599]/10 dark:text-[#00E599] dark:border-[#00E599]/30 text-xs font-mono font-bold mb-3">
            BUILT FOR MASTERY
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
            Everything you need to master capital markets
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            From fundamental accounting to exotic option Greeks and stochastic volatility simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-pink-600 dark:text-[#FF2E7E]" />,
              title: "120+ Structured Lessons",
              desc: "Deep-dive bite-sized curriculum covering NISM, CFA, Equity Research, Fixed Income, and Quantitative Trading.",
              badge: "Accredited Tracks",
              badgeColor: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-[#FF2E7E]/20 dark:text-[#FF2E7E] dark:border-[#FF2E7E]/40"
            },
            {
              icon: <FlaskConical className="w-6 h-6 text-emerald-600 dark:text-[#00E599]" />,
              title: "Interactive Practice Lab",
              desc: "Execute paper trades in real-time order books. Test Delta-Hedging, Iron Condors, and Bond Duration risk-free.",
              badge: "₹10L Sim Capital",
              badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40"
            },
            {
              icon: <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
              title: "24/7 AI Financial Tutor",
              desc: "Get instant step-by-step mathematical explanations for complex formulas, yield curves, and derivatives payoff.",
              badge: "Powered by AI",
              badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40"
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
              title: "Timed Mock Exams",
              desc: "Official NISM Series VIII and CFA simulation mode with negative marking, time constraints, and sectional pass criteria.",
              badge: "92% Pass Rate",
              badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
            }
          ].map((card, i) => (
            <div 
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#0C101C] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl hover:border-pink-300 dark:hover:border-slate-700 transition duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:scale-110 transition">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs font-bold text-pink-600 dark:text-[#FF2E7E] group-hover:translate-x-1 transition">
                <span>Explore module</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW FINANCE-X WORKS (THE 4-STEP LOOP) */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-[#06080F] border-t border-b border-slate-200 dark:border-slate-800/80 relative z-30 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
              The Proven 4-Stage Mastery Loop
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm">
              How thousands of learners convert abstract finance theory into certified market execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { num: '01', title: 'Interactive Concept', desc: 'Read concise conceptual modules with dynamic formula calculators and payoff charts.' },
              { num: '02', title: 'Paper Trade Lab', desc: 'Immediately apply the theory with ₹10,00,000 in simulated capital across real instruments.' },
              { num: '03', title: 'AI-Evaluated Quizzes', desc: 'Answer targeted questions with instant AI remediation for any conceptual gaps.' },
              { num: '04', title: 'Timed Mock Exam', desc: 'Clear full-length regulatory mock exams and earn verified verifiable certifications.' }
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#0F1422] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg relative">
                <div className="text-3xl font-mono font-black text-pink-500/20 dark:text-[#FF2E7E]/30 mb-2">{step.num}</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-emerald-50 dark:from-[#0F1424] dark:via-[#161B30] dark:to-[#0F1424] border border-pink-200 dark:border-slate-700/80 shadow-xl text-center space-y-6 theme-transition">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-[#FF2E7E]/20 dark:text-[#FF2E7E] border border-pink-300 dark:border-[#FF2E7E]/40 inline-block">
              YOUR FINANCIAL JOURNEY STARTS WITH UNDERSTANDING
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white max-w-2xl mx-auto">
              Ready to accelerate your finance career?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
              Learn finance. Understand markets. Build better decisions with FinanceX.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 rounded-2xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-sm shadow-md dark:shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Open FinanceX Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={onOpenSignUp}
                    className="px-8 py-4 rounded-2xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-sm shadow-md dark:shadow-[0_0_25px_rgba(255,46,126,0.4)] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get Started Free Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenSignIn}
                    className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#05070B] text-xs text-slate-600 dark:text-slate-400 relative z-30 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FinanceXLogo size="sm" variant="full" />
            <span className="text-[11px] text-slate-400">© 2026 FinanceX Academy. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">The Story</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Interactive Demo</button>
            <button onClick={() => scrollToSection('learn')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Curriculum</button>
            <button onClick={onOpenSignIn} className="text-pink-600 dark:text-[#FF2E7E] cursor-pointer">Sign in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
