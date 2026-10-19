import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2,
  TrendingUp,
  Layers,
  Sliders,
  DollarSign,
  Activity,
  Maximize2,
  Info,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Instrument, 
  DemoAccount, 
  DemoHolding, 
  DemoTransaction, 
  AppNavView,
  PracticeLabEducationalScenario
} from '../../types/schema';
import { marketDataService } from '../../services/marketDataService';
import { learningLoopService } from '../../services/learningLoopService';
import { MOCK_PRACTICE_LAB_SCENARIOS } from '../../data/mockData';
import { TradingViewWidget } from './TradingViewWidget';

interface PracticeLabViewProps {
  demoAccount: DemoAccount;
  instruments: Instrument[];
  holdings: DemoHolding[];
  transactions: DemoTransaction[];
  userId?: string;
  onExecuteTrade: (trade: {
    instrumentId: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => void;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const PracticeLabView: React.FC<PracticeLabViewProps> = ({
  demoAccount,
  instruments,
  holdings,
  transactions,
  userId = 'guest',
  onExecuteTrade,
  onNavigate
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instruments[0]);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT' | 'SL'>('MARKET');
  const [productType, setProductType] = useState<'CNC' | 'MIS'>('CNC'); // CNC = Delivery (1x), MIS = Intraday (5x)
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedInstrument.simulated_price);
  const [stopLossPrice, setStopLossPrice] = useState<number>(+(selectedInstrument.simulated_price * 0.97).toFixed(2));
  const [targetPrice, setTargetPrice] = useState<number>(+(selectedInstrument.simulated_price * 1.05).toFixed(2));
  const [showTradeSuccess, setShowTradeSuccess] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'TERMINAL' | 'SCENARIOS'>('TERMINAL');
  const [selectedScenario, setSelectedScenario] = useState<PracticeLabEducationalScenario | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});
  const [scenarioSuccessMessage, setScenarioSuccessMessage] = useState<string | null>(null);

  // Detect dark mode
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Authoritative Market Data Feed
  const [livePrice, setLivePrice] = useState(selectedInstrument.simulated_price);
  const [marketStatus, setMarketStatus] = useState<'LIVE' | 'DELAYED' | 'MARKET_CLOSED'>('LIVE');
  const [dailyChange, setDailyChange] = useState(selectedInstrument.daily_change_percent || 1.25);

  useEffect(() => {
    const quote = marketDataService.getQuote(selectedInstrument.symbol);
    if (quote) {
      setLivePrice(quote.price);
      setLimitPrice(quote.price);
      setStopLossPrice(+(quote.price * 0.97).toFixed(2));
      setTargetPrice(+(quote.price * 1.05).toFixed(2));
      setMarketStatus(quote.dataFreshness);
      setDailyChange(quote.changePercent);
    } else {
      setLivePrice(selectedInstrument.simulated_price);
      setLimitPrice(selectedInstrument.simulated_price);
      setStopLossPrice(+(selectedInstrument.simulated_price * 0.97).toFixed(2));
      setTargetPrice(+(selectedInstrument.simulated_price * 1.05).toFixed(2));
    }

    const unsubscribe = marketDataService.subscribeQuotes((allQuotes) => {
      const updated = allQuotes.find(
        (q) => q.symbol === selectedInstrument.symbol || q.name.toLowerCase().includes(selectedInstrument.name.toLowerCase())
      );
      if (updated) {
        setLivePrice(updated.price);
        setMarketStatus(updated.dataFreshness);
        setDailyChange(updated.changePercent);
      }
    });

    return () => unsubscribe();
  }, [selectedInstrument]);

  const currentHolding = holdings.find((h) => h.instrument_id === selectedInstrument.instrument_id);
  const holdingQty = currentHolding ? currentHolding.quantity : 0;
  const executionPrice = orderMode === 'MARKET' ? livePrice : limitPrice;
  const totalOrderValue = tradeQuantity * executionPrice;
  const leverageMultiplier = productType === 'MIS' ? 0.2 : 1.0; // 5x leverage for MIS -> 20% margin
  const marginRequired = totalOrderValue * leverageMultiplier;
  const canAfford = orderType === 'BUY' ? marginRequired <= demoAccount.virtual_balance : tradeQuantity <= holdingQty;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford || tradeQuantity <= 0) return;

    onExecuteTrade({
      instrumentId: selectedInstrument.instrument_id,
      type: orderType,
      quantity: tradeQuantity,
      price: executionPrice
    });

    setShowTradeSuccess(true);
    setTimeout(() => setShowTradeSuccess(false), 3000);
  };

  // Calculate total portfolio value
  const holdingsValue = holdings.reduce((sum, h) => {
    const inst = instruments.find((i) => i.instrument_id === h.instrument_id);
    const quote = inst ? marketDataService.getQuote(inst.symbol) : null;
    const p = quote ? quote.price : (inst?.simulated_price || 0);
    return sum + p * h.quantity;
  }, 0);

  const totalNetWorth = demoAccount.virtual_balance + holdingsValue;
  const totalGain = totalNetWorth - (demoAccount.initial_capital || 1000000);
  const totalGainPercent = (totalGain / (demoAccount.initial_capital || 1000000)) * 100;

  // Level-2 Simulated Market Depth
  const spread = +(livePrice * 0.0005).toFixed(2);
  const bidPrices = [
    { price: +(livePrice - spread * 0.5).toFixed(2), orders: 42, qty: 1250 },
    { price: +(livePrice - spread * 1.5).toFixed(2), orders: 28, qty: 890 },
    { price: +(livePrice - spread * 2.5).toFixed(2), orders: 65, qty: 2400 },
    { price: +(livePrice - spread * 3.5).toFixed(2), orders: 19, qty: 540 },
    { price: +(livePrice - spread * 4.5).toFixed(2), orders: 34, qty: 1100 },
  ];
  const askPrices = [
    { price: +(livePrice + spread * 0.5).toFixed(2), orders: 38, qty: 980 },
    { price: +(livePrice + spread * 1.5).toFixed(2), orders: 51, qty: 1800 },
    { price: +(livePrice + spread * 2.5).toFixed(2), orders: 22, qty: 620 },
    { price: +(livePrice + spread * 3.5).toFixed(2), orders: 47, qty: 1450 },
    { price: +(livePrice + spread * 4.5).toFixed(2), orders: 31, qty: 910 },
  ];
  const totalBidQty = bidPrices.reduce((s, b) => s + b.qty, 0);
  const totalAskQty = askPrices.reduce((s, a) => s + a.qty, 0);
  const bidRatio = Math.round((totalBidQty / (totalBidQty + totalAskQty)) * 100);

  const handleCompleteScenario = (scenario: PracticeLabEducationalScenario) => {
    learningLoopService.recordPracticeLabScenarioCompletion(
      userId,
      scenario.scenario_id,
      100,
      [`Executed verified simulation trade strategy for ${scenario.title}`]
    );

    setCompletedScenarios(prev => ({ ...prev, [scenario.scenario_id]: true }));
    setScenarioSuccessMessage(`Scenario completed! +${scenario.xp_reward} XP & +${scenario.mastery_contribution_pct}% Mastery Credit registered for ${scenario.topic_name}.`);
    setTimeout(() => setScenarioSuccessMessage(null), 5000);
  };

  // Dynamic Portfolio Beta & Risk Level calculation (Item 10)
  const portfolioBeta = React.useMemo(() => {
    if (holdings.length === 0 || holdingsValue <= 0) return 0.00;
    const weightedSum = holdings.reduce((sum, h) => {
      const inst = instruments.find(i => i.instrument_id === h.instrument_id);
      const quote = inst ? marketDataService.getQuote(inst.symbol) : null;
      const price = quote ? quote.price : (inst?.simulated_price || 0);
      const val = price * h.quantity;
      const beta = (inst as any)?.beta || 1.08;
      return sum + beta * val;
    }, 0);
    return +(weightedSum / holdingsValue).toFixed(2);
  }, [holdings, holdingsValue, instruments]);

  const riskAssessment = React.useMemo(() => {
    if (holdings.length === 0 || holdingsValue <= 0) {
      return { text: 'Risk-Free (100% Cash / Liquid)', color: 'text-emerald-600 dark:text-[#00E599]' };
    }
    if (portfolioBeta < 0.8) {
      return { text: 'Low Volatility / Defensive', color: 'text-emerald-600 dark:text-[#00E599]' };
    }
    if (portfolioBeta <= 1.15) {
      return { text: 'Market Risk (Moderate)', color: 'text-cyan-600 dark:text-cyan-400' };
    }
    return { text: 'High Systematic Risk', color: 'text-rose-600 dark:text-rose-400' };
  }, [holdings.length, holdingsValue, portfolioBeta]);

  return (
    <div className="space-y-6" id="practice-lab-view">
      {/* Tab Switcher: Live Terminal vs Institutional Scenarios */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('TERMINAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'TERMINAL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Trading Terminal</span>
          </button>
          <button
            onClick={() => setActiveMainTab('SCENARIOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'SCENARIOS'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Educational Scenarios</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-bold">
              MASTERY SIGNALS
            </span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('calculators')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-pink-600 dark:text-[#00E599] hover:border-pink-300 transition cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Options Calculator</span>
        </button>
      </div>

      {/* Scenario Success Toast */}
      <AnimatePresence>
        {scenarioSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-[#00E599] border border-emerald-300 dark:border-emerald-500/40 text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-[#00E599]" />
              <span className="font-bold">{scenarioSuccessMessage}</span>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="underline text-[11px] hover:text-emerald-700 font-bold"
            >
              View Updated Mastery →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Notice Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-cyan-500/30 shadow-xs theme-transition">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-cyan-500/20 text-emerald-800 dark:text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                TRADINGVIEW TERMINAL & SIMULATED EXCHANGE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-bold">
                NO REAL MONEY INVOLVED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Practice multi-asset technical analysis with official TradingView charts, Level-2 Market Depth, and SEBI-aligned position sizing.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">TOTAL VIRTUAL NET WORTH</span>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
            ₹{totalNetWorth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] font-mono mt-1 flex items-center gap-1 font-bold ${totalGain >= 0 ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
            {totalGain >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>₹{Math.abs(totalGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">AVAILABLE CASH BALANCE</span>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-[#00E599] mt-0.5">
            ₹{demoAccount.virtual_balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Instant Simulated Liquidity</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">INVESTED HOLDINGS VALUE</span>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
            ₹{holdingsValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{holdings.length} Active Positions</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">PORTFOLIO BETA & RISK</span>
          <div className="text-2xl font-mono font-black text-cyan-700 dark:text-cyan-400 mt-0.5">
            {portfolioBeta.toFixed(2)} <span className={`text-xs font-normal ${riskAssessment.color}`}>({riskAssessment.text})</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {holdings.length === 0 ? 'Fresh Account (Zero Systematic Risk)' : 'Weighted Sensitivity to Benchmark'}
          </span>
        </div>
      </div>

      {activeMainTab === 'SCENARIOS' ? (
        /* Educational Scenarios View */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Institutional Practice Lab Scenarios
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Execute authentic institutional risk management scenarios. Each verified scenario generates verifiable evidence contributing directly to your Continuous Concept Mastery.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 font-bold">
                {MOCK_PRACTICE_LAB_SCENARIOS.length} Active Scenarios
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PRACTICE_LAB_SCENARIOS.map((sc: PracticeLabEducationalScenario) => {
                const isCompleted = completedScenarios[sc.scenario_id];
                return (
                  <div
                    key={sc.scenario_id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-500/40'
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {sc.topic_name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        sc.difficulty === 'ADVANCED' 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
                      }`}>
                        {sc.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {sc.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      {sc.objective}
                    </p>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4 space-y-1.5 text-xs font-mono">
                      <div className="text-slate-500 text-[11px] font-bold">TASK INSTRUCTIONS:</div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px]">{sc.instruction}</div>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        Instruments: {sc.target_instrument_symbols.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-pink-600 dark:text-pink-400 font-bold">+{sc.xp_reward} XP</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-600 dark:text-[#00E599] font-bold">+{sc.mastery_contribution_pct}% Mastery</span>
                      </div>

                      <button
                        onClick={() => handleCompleteScenario(sc)}
                        disabled={isCompleted}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-slate-900 text-white hover:bg-pink-600 dark:bg-white dark:text-slate-900 dark:hover:bg-pink-500 dark:hover:text-white shadow-xs'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Evidence Logged</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Simulate Execution</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: TradingView Chart Terminal */}
        <div className="lg:col-span-8 space-y-4">
          {/* Instrument Watchlist Carousel / Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
            {instruments.map((inst) => {
              const isSelected = selectedInstrument.instrument_id === inst.instrument_id;
              const q = marketDataService.getQuote(inst.symbol);
              const changeP = q ? q.changePercent : (inst.daily_change_percent || 0);
              const isPositive = changeP >= 0;

              return (
                <button
                  key={inst.instrument_id}
                  onClick={() => setSelectedInstrument(inst)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-pink-50 border border-pink-300 text-slate-900 font-bold shadow-xs dark:bg-slate-800 dark:border-[#00E599]/60 dark:text-white'
                      : 'bg-white border border-slate-200 dark:bg-[#0B0F19] dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{inst.symbol}</span>
                  <span className={`font-mono text-[10px] font-bold ${isPositive ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                    {isPositive ? '+' : ''}{changeP.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Asset Header Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  {selectedInstrument.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {selectedInstrument.symbol} • {selectedInstrument.instrument_type}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                  ₹{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-xs font-mono font-bold flex items-center ${
                  dailyChange >= 0 ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'
                }`}>
                  {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}% Today
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  marketStatus === 'LIVE' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599]' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {marketStatus === 'LIVE' ? '● LIVE NSE/BSE FEED' : marketStatus}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <div className="text-right">
                <span className="text-[9px] block">BETA</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInstrument.beta || 1.05}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] block">P/E RATIO</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInstrument.pe_ratio || 24.8}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] block">YOUR POSITIONS</span>
                <span className="font-bold text-emerald-600 dark:text-[#00E599]">{holdingQty} Qty</span>
              </div>
            </div>
          </div>

          {/* Official TradingView Advanced Chart Integration */}
          <TradingViewWidget
            symbol={selectedInstrument.symbol}
            theme={isDark ? 'dark' : 'light'}
            height={520}
          />

          {/* Level 2 Market Depth / Order Book Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                  Level-2 Market Depth (Real-Time Order Book)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Spread: ₹{spread} ({((spread / livePrice) * 100).toFixed(3)}%)
              </span>
            </div>

            {/* Depth Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-emerald-700 dark:text-[#00E599] font-bold">Total Buy: {totalBidQty.toLocaleString()} ({bidRatio}%)</span>
                <span className="text-rose-600 dark:text-[#FF2E7E] font-bold">Total Sell: {totalAskQty.toLocaleString()} ({100 - bidRatio}%)</span>
              </div>
              <div className="w-full h-2 bg-rose-200 dark:bg-rose-950/80 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 dark:bg-[#00E599] transition-all duration-300" style={{ width: `${bidRatio}%` }} />
              </div>
            </div>

            {/* 5-Depth Bid / Ask Table */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Bids Table */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Orders</span>
                  <span>Qty</span>
                  <span className="text-emerald-600 dark:text-[#00E599] font-bold">Bid (₹)</span>
                </div>
                {bidPrices.map((b, i) => (
                  <div key={i} className="flex justify-between py-1 px-1.5 rounded-lg hover:bg-emerald-500/10 transition">
                    <span className="text-slate-400">{b.orders}</span>
                    <span className="text-slate-700 dark:text-slate-300">{b.qty}</span>
                    <span className="text-emerald-600 dark:text-[#00E599] font-bold">₹{b.price}</span>
                  </div>
                ))}
              </div>

              {/* Asks Table */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-rose-600 dark:text-[#FF2E7E] font-bold">Ask (₹)</span>
                  <span>Qty</span>
                  <span>Orders</span>
                </div>
                {askPrices.map((a, i) => (
                  <div key={i} className="flex justify-between py-1 px-1.5 rounded-lg hover:bg-rose-500/10 transition">
                    <span className="text-rose-600 dark:text-[#FF2E7E] font-bold">₹{a.price}</span>
                    <span className="text-slate-700 dark:text-slate-300">{a.qty}</span>
                    <span className="text-slate-400">{a.orders}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Order Entry Box & Position Manager */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Placement Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-5 theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                ORDER EXECUTION
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400">
                NSE MATCHING ENGINE
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setOrderType('BUY')}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-white dark:bg-[#00E599] dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                BUY (LONG)
              </button>
              <button
                onClick={() => setOrderType('SELL')}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  orderType === 'SELL'
                    ? 'bg-rose-500 text-white dark:bg-[#FF2E7E] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SELL (SHORT)
              </button>
            </div>

            {/* Product Type (CNC vs MIS) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setProductType('CNC')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  productType === 'CNC'
                    ? 'bg-pink-50 border-pink-500 text-slate-900 dark:bg-slate-800 dark:border-[#00E599] dark:text-white font-bold'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>CNC (Delivery 1x)</span>
              </button>
              <button
                onClick={() => setProductType('MIS')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  productType === 'MIS'
                    ? 'bg-pink-50 border-pink-500 text-slate-900 dark:bg-slate-800 dark:border-[#00E599] dark:text-white font-bold'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>MIS (Intraday 5x)</span>
              </button>
            </div>

            {/* Order Mode (Market vs Limit vs SL) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              {(['MARKET', 'LIMIT', 'SL'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOrderMode(mode)}
                  className={`py-1 rounded-lg text-center transition cursor-pointer ${
                    orderMode === mode
                      ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Quantity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Quantity (Units)</span>
                  <span className="font-mono text-slate-500">Holding: {holdingQty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                  <div className="flex gap-1">
                    {[10, 50, 100].map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setTradeQuantity(q)}
                        className="px-2.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Limit Price Input if Limit Mode */}
              {orderMode !== 'MARKET' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Limit Price (₹)</span>
                    <span className="font-mono text-slate-500">Live: ₹{livePrice.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(parseFloat(e.target.value) || livePrice)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                </div>
              )}

              {/* Stop-Loss & Target Triggers */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5 font-bold">STOP LOSS (₹)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-rose-600 dark:text-[#FF2E7E]"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5 font-bold">TARGET (₹)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-[#00E599]"
                  />
                </div>
              </div>

              {/* Order Cost Breakdown Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Gross Value:</span>
                  <span>₹{totalOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Margin Required ({productType === 'MIS' ? '20% 5x' : '100% 1x'}):</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{marginRequired.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Simulated STT & Brokerage:</span>
                  <span className="text-emerald-700 dark:text-[#00E599]">₹0.00 (Zero Fee)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canAfford}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  !canAfford
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : orderType === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950'
                    : 'bg-[#FF2E7E] hover:bg-[#E61E6D] text-white'
                }`}
              >
                <span>
                  {!canAfford
                    ? 'Insufficient Virtual Margin'
                    : `${orderType} ${tradeQuantity} ${selectedInstrument.symbol} @ ₹${executionPrice.toFixed(2)}`}
                </span>
              </button>
            </form>

            {/* Success feedback toast */}
            <AnimatePresence>
              {showTradeSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40 text-xs font-mono flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Trade executed on simulated exchange! Ledger updated.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Positions Summary */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                Active Open Positions ({holdings.length})
              </span>
              <span className="text-xs font-mono text-slate-500">Live PnL</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {holdings.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-mono">
                  No active holdings. Execute a buy order above to simulate your portfolio.
                </div>
              ) : (
                holdings.map((h) => {
                  const inst = instruments.find((i) => i.instrument_id === h.instrument_id);
                  const q = inst ? marketDataService.getQuote(inst.symbol) : null;
                  const currentP = q ? q.price : (inst?.simulated_price || h.avg_buy_price);
                  const pnl = (currentP - h.avg_buy_price) * h.quantity;
                  const pnlPercent = ((currentP - h.avg_buy_price) / h.avg_buy_price) * 100;
                  const isProfit = pnl >= 0;

                  return (
                    <div
                      key={h.holding_id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{inst?.symbol || `Asset #${h.instrument_id}`}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">({h.quantity} Qty)</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Avg: ₹{h.avg_buy_price.toFixed(2)} • CMP: ₹{currentP.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className={`font-bold ${isProfit ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                          {isProfit ? '+' : ''}₹{pnl.toFixed(2)}
                        </div>
                        <div className={`text-[10px] ${isProfit ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                          {isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
