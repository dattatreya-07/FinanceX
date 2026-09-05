import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Landmark, 
  LineChart, 
  CreditCard, 
  Cpu, 
  Scale, 
  Repeat, 
  Layers
} from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';

interface MoneyEvolutionJourneyProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Chapter {
  id: number;
  number: string;
  title: string;
  era: string;
  subtitle: string;
  concept: string;
  problemSolved: string;
  icon: React.ReactNode;
  accentColor: string;
  interactiveWidgetType: 'barter' | 'commodity' | 'coin' | 'paper' | 'banking' | 'markets' | 'digital' | 'system' | 'welcome';
}

export const MoneyEvolutionJourney: React.FC<MoneyEvolutionJourneyProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Interactive state variables for widgets
  const [barterHasFish] = useState(true);
  const [barterNeedsWheat, setBarterNeedsWheat] = useState(false);
  const [bankingDeposit] = useState<number>(1000);
  const [reserveRatio, setReserveRatio] = useState<number>(10);

  const chapters: Chapter[] = [
    {
      id: 0,
      number: '01',
      title: 'Life Before Money',
      era: '10,000 BCE — The Ancient Barter System',
      subtitle: 'The Inefficiency of Direct Exchange',
      concept: 'Direct trade of commodities (e.g., swapping 5 fish for 1 sack of wheat) required a rare "Double Coincidence of Wants" and suffered from perishability and indivisibility.',
      problemSolved: 'Established the fundamental necessity for an agreed medium of exchange.',
      icon: <Repeat className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      accentColor: '#F59E0B',
      interactiveWidgetType: 'barter'
    },
    {
      id: 1,
      number: '02',
      title: 'Commodity Money',
      era: '3,000 BCE — Mesopotamian Grain & Cowrie Shells',
      subtitle: 'Universally Valued Physical Goods',
      concept: 'Societies adopted durable goods with intrinsic utility (salt, barley, cattle, obsidian, seashells) as standardized accounting units.',
      problemSolved: 'Provided common value measurement across tribal borders.',
      icon: <Scale className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      accentColor: '#10B981',
      interactiveWidgetType: 'commodity'
    },
    {
      id: 2,
      number: '03',
      title: 'Minted Coins & Bullion',
      era: '600 BCE — Kingdom of Lydia (Electrum Coins)',
      subtitle: 'Standardized Weight, Purity & State Seals',
      concept: 'King Alyattes minted uniform discs of gold and silver stamped with sovereign insignia, eliminating the tedious need to weigh and assay metal at every transaction.',
      problemSolved: 'Solved counterfeiting and drastically accelerated trade velocity.',
      icon: <Coins className="w-6 h-6 text-amber-500 dark:text-yellow-400" />,
      accentColor: '#EAB308',
      interactiveWidgetType: 'coin'
    },
    {
      id: 3,
      number: '04',
      title: 'Paper Money & Promissory Notes',
      era: '7th–11th Century CE — Song Dynasty Jiaozi & European Goldsmiths',
      subtitle: 'From Heavy Metal Bullion to Portable Claims',
      concept: 'Merchants deposited heavy gold into secure vaults and traded lightweight paper certificates of deposit, inaugurating representative and fiat currency.',
      problemSolved: 'Drastically reduced transit danger and enabled large-scale commerce.',
      icon: <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      accentColor: '#06B6D4',
      interactiveWidgetType: 'paper'
    },
    {
      id: 4,
      number: '05',
      title: 'Banking & Fractional Reserve Credit',
      era: '14th–17th Century — Medici Bank of Florence & Bank of England',
      subtitle: 'Mobilizing Idle Capital into Productive Investment',
      concept: 'Banks discovered that depositors do not withdraw all gold simultaneously, enabling them to issue credit and multiply money supply to fund innovation and industry.',
      problemSolved: 'Transformed static wealth into dynamic economic expansion.',
      icon: <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      accentColor: '#6366F1',
      interactiveWidgetType: 'banking'
    },
    {
      id: 5,
      number: '06',
      title: 'Securities & Capital Markets',
      era: '1602 CE — Amsterdam Stock Exchange & VOC',
      subtitle: 'Fractional Ownership, Debt & Risk Pooling',
      concept: 'The Dutch East India Company issued the world’s first tradeable equities and government bonds, democratizing capital formation and risk sharing.',
      problemSolved: 'Allowed monumental enterprises to be funded by everyday public investors.',
      icon: <LineChart className="w-6 h-6 text-emerald-600 dark:text-[#00E599]" />,
      accentColor: '#00E599',
      interactiveWidgetType: 'markets'
    },
    {
      id: 6,
      number: '07',
      title: 'Digital Money & Electronic Networks',
      era: '1970s–Present — SWIFT, Cards, RTGS & Real-Time UPI',
      subtitle: 'Money Dematerialized into Pure Information',
      concept: 'Physical cash replaced by encrypted database entries, optical fiber networks, and instant central settlement ledgers handling trillions per second.',
      problemSolved: 'Frictionless, borderless, instantaneous liquidity transfers.',
      icon: <CreditCard className="w-6 h-6 text-pink-600 dark:text-pink-500" />,
      accentColor: '#EC4899',
      interactiveWidgetType: 'digital'
    },
    {
      id: 7,
      number: '08',
      title: 'The Modern Financial Mesh',
      era: '21st Century — Central Banks, Derivatives, AI & Risk Engines',
      subtitle: 'A Multi-Trillion Dollar Interconnected Ecosystem',
      concept: 'Today’s financial world blends monetary policy, options hedging, sovereign debt yield curves, quantitative algorithms, and rigorous regulatory compliance (SEBI, SEC).',
      problemSolved: 'Precise pricing of time, future risk, and economic uncertainty.',
      icon: <Cpu className="w-6 h-6 text-rose-600 dark:text-[#FF2E7E]" />,
      accentColor: '#FF2E7E',
      interactiveWidgetType: 'system'
    },
    {
      id: 8,
      number: '09',
      title: 'Welcome to FinanceX',
      era: 'Now — Master Finance with AI, Simulations & Certifications',
      subtitle: 'From Financial Literacy to Professional Mastery',
      concept: '"Now that you know where finance came from, let’s master how it works."',
      problemSolved: 'Bridging abstract financial theory with live simulated execution and certified career credentials.',
      icon: <Sparkles className="w-6 h-6 text-emerald-600 dark:text-[#00E599]" />,
      accentColor: '#00E599',
      interactiveWidgetType: 'welcome'
    }
  ];

  const currentChapter = chapters[currentStep];

  const handleNext = () => {
    if (currentStep < chapters.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Render Interactive Micro-Widget for each chapter
  const renderWidget = (type: Chapter['interactiveWidgetType']) => {
    switch (type) {
      case 'barter':
        return (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                Interactive: Barter Dilemma
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Coincidence of Wants Test</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className={`p-4 rounded-2xl border transition-all ${barterHasFish ? 'border-amber-300 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-500/10' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'}`}>
                <div className="text-3xl mb-1">🐟</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200">You Offer: 5 Fish</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Perishes in 2 days</div>
              </div>
              <div className={`p-4 rounded-2xl border transition-all ${barterNeedsWheat ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-500/10' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'}`}>
                <div className="text-3xl mb-1">🌾</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200">Farmer Offers: Wheat</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{barterNeedsWheat ? 'Deal Accepted!' : 'Farmer wants Shoes, not Fish!'}</div>
              </div>
            </div>
            <button
              onClick={() => setBarterNeedsWheat(!barterNeedsWheat)}
              className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-500/30 transition cursor-pointer"
            >
              {barterNeedsWheat ? 'Reset Farmer Preference' : 'Simulate Finding a Fish-Seeking Farmer'}
            </button>
          </div>
        );

      case 'coin':
        return (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-yellow-400 uppercase font-bold">
              <Coins className="w-4 h-4" />
              <span>Lydian Lion Stater Assay</span>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-4 border-yellow-400 shadow-md flex items-center justify-center text-slate-950 font-black text-2xl">
              🦁
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-amber-700 dark:text-yellow-400">Guaranteed:</span> 55% Gold / 45% Silver Electrum disc. No scale needed!
            </div>
          </div>
        );

      case 'banking':
        const totalCreditCreated = Math.round(bankingDeposit * (100 / reserveRatio));
        return (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400 font-bold uppercase">
                Fractional Reserve Multiplier
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-[#00E599] font-bold">₹{totalCreditCreated.toLocaleString()} Total Money</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Initial Deposit: ₹{bankingDeposit}</span>
                <span>Reserve Requirement: {reserveRatio}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={reserveRatio}
                onChange={(e) => setReserveRatio(Number(e.target.value))}
                className="w-full accent-pink-600 dark:accent-indigo-500 cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">Vault Reserve</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">₹{Math.round(bankingDeposit * (reserveRatio / 100))}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">Lent to Businesses</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">₹{Math.round(bankingDeposit * (1 - reserveRatio / 100))}</span>
              </div>
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-700 dark:text-[#00E599] font-bold uppercase">
                VOC Amsterdam 1602: First Public Share
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                +18.4% Div Yield
              </span>
            </div>
            <div className="h-20 flex items-end justify-between gap-1 px-2 pt-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80">
              {[30, 45, 40, 60, 55, 75, 70, 90, 85, 100].map((val, idx) => (
                <div key={idx} className="flex-1 bg-gradient-to-t from-pink-500 to-rose-400 dark:from-emerald-600 dark:to-[#00E599] rounded-t-sm" style={{ height: `${val}%` }} />
              ))}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Instead of 1 merchant risking their entire fortune on 1 ship, 1,000 citizens pooled risk and shared spice profits.
            </p>
          </div>
        );

      case 'welcome':
        return (
          <div className="bg-gradient-to-br from-pink-50 via-white to-amber-50 dark:from-slate-900 dark:via-[#0B1320] dark:to-[#0A1828] border border-pink-200 dark:border-[#00E599]/30 rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-[#00E599]/10 border border-pink-200 dark:border-[#00E599]/40 flex items-center justify-center text-3xl">
              🎓
            </div>
            <div>
              <h4 className="font-display text-xl font-black text-slate-900 dark:text-white">Your Financial Journey Begins</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm">
                Get personalized certification paths (NISM / NCFM), interactive paper trading with ₹10L virtual capital, and 24/7 AI tutoring.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              {currentChapter.icon}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{currentChapter.subtitle}</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden theme-transition" id="money-evolution-journey">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 dark:bg-[#00E599]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-[#FF2E7E]/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto z-10">
        <div className="flex items-center gap-3">
          <FinanceXLogo size="sm" variant="compact" />
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:inline font-bold">
            The Evolution of Money
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition cursor-pointer font-bold"
          >
            Skip Story
          </button>
        </div>
      </div>

      {/* Progress Timeline Pills */}
      <div className="max-w-6xl w-full mx-auto my-4 z-10">
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setCurrentStep(idx)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-[#FF2E7E] dark:bg-[#00E599] shadow-xs'
                    : idx < currentStep
                    ? 'bg-slate-300 dark:bg-slate-600'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
              <span
                className={`text-[10px] font-mono transition-colors hidden sm:block ${
                  idx === currentStep ? 'text-[#FF2E7E] dark:text-[#00E599] font-bold' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {ch.number}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Story & Concept */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  CHAPTER {currentChapter.number}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{currentChapter.era}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {currentChapter.title}
              </h2>

              <p className="text-sm sm:text-base text-pink-600 dark:text-[#00E599] font-bold">
                {currentChapter.subtitle}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentChapter.concept}
              </p>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 mt-1 shadow-xs">
                <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-[#00E599] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white block mb-0.5 font-bold">Core Breakthrough:</strong>
                  {currentChapter.problemSolved}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Concept Card */}
            <div className="md:col-span-5 flex flex-col justify-center">
              {renderWidget(currentChapter.interactiveWidgetType)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/60 z-10">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentStep === 0
              ? 'opacity-30 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-bold">
          {currentStep + 1} of {chapters.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <span>{currentStep === chapters.length - 1 ? 'Start Personalization' : 'Next Chapter'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
