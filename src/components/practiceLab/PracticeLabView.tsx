import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2
} from 'lucide-react';
import { 
  Instrument, 
  DemoAccount, 
  DemoHolding, 
  DemoTransaction,
  AppNavView 
} from '../../types/schema';

interface PracticeLabViewProps {
  demoAccount: DemoAccount;
  instruments: Instrument[];
  holdings: DemoHolding[];
  transactions: DemoTransaction[];
  onExecuteTrade: (trade: {
    instrumentId: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => void;
  onNavigate: (view: AppNavView) => void;
}

export const PracticeLabView: React.FC<PracticeLabViewProps> = ({
  demoAccount,
  instruments,
  holdings,
  transactions,
  onExecuteTrade,
  onNavigate
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instruments[0]);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedInstrument.simulated_price);
  const [showTradeSuccess, setShowTradeSuccess] = useState(false);

  // Live price ticker simulation jitter effect
  const [livePrice, setLivePrice] = useState(selectedInstrument.simulated_price);

  useEffect(() => {
    setLivePrice(selectedInstrument.simulated_price);
    setLimitPrice(selectedInstrument.simulated_price);
  }, [selectedInstrument]);

  // Simulated tick every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * (selectedInstrument.simulated_price * 0.002);
      setLivePrice((prev) => +(prev + delta).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedInstrument]);

  const currentHolding = holdings.find((h) => h.instrument_id === selectedInstrument.instrument_id);
  const holdingQty = currentHolding ? currentHolding.quantity : 0;
  const executionPrice = orderMode === 'MARKET' ? livePrice : limitPrice;
  const totalOrderValue = tradeQuantity * executionPrice;
  const canAfford = orderType === 'BUY' ? totalOrderValue <= demoAccount.virtual_balance : tradeQuantity <= holdingQty;

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
    return sum + (inst ? inst.simulated_price * h.quantity : 0);
  }, 0);

  const totalNetWorth = demoAccount.virtual_balance + holdingsValue;
  const totalGain = totalNetWorth - (demoAccount.initial_capital || 1000000);
  const totalGainPercent = (totalGain / (demoAccount.initial_capital || 1000000)) * 100;

  return (
    <div className="space-y-6" id="practice-lab-view">
      {/* Simulation Notice Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-cyan-500/30 shadow-xs theme-transition">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-cyan-500/20 text-emerald-800 dark:text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                EDUCATIONAL MARKET SIMULATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-bold">
                NO REAL MONEY INVOLVED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Practice cash-and-carry arbitrage, duration hedging, and position sizing in a real-time simulated sandbox.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ai-tutor')}
          className="text-xs font-bold text-pink-600 dark:text-[#00E599] hover:underline whitespace-nowrap cursor-pointer"
        >
          Ask AI for Arbitrage Ideas →
        </button>
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
            <span>₹{Math.abs(totalGain).toLocaleString('en-IN')} ({totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)</span>
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
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">INVESTED HOLDINGS</span>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
            ₹{holdingsValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{holdings.length} Active Positions</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">PORTFOLIO BETA & RISK</span>
          <div className="text-2xl font-mono font-black text-cyan-700 dark:text-cyan-400 mt-0.5">
            0.92 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Moderate)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Weighted Sensitivity</span>
        </div>
      </div>

      {/* Main Terminal Grid: Chart + Instrument List + Order Book */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Chart & Instrument Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Instrument Selector Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
            {instruments.map((inst) => {
              const isSelected = inst.instrument_id === selectedInstrument.instrument_id;
              const isPositive = (inst.daily_change_percent || 0) >= 0;

              return (
                <button
                  key={inst.instrument_id}
                  onClick={() => setSelectedInstrument(inst)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-pink-50 border border-pink-300 text-slate-900 font-bold shadow-xs dark:bg-slate-800 dark:border-[#00E599]/60 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{inst.symbol}</span>
                  <span className={`font-mono text-[10px] font-bold ${isPositive ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                    {isPositive ? '+' : ''}{inst.daily_change_percent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Chart Canvas Container */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 theme-transition">
            {/* Header with Price & Timeframe */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                    {selectedInstrument.name} ({selectedInstrument.symbol})
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {selectedInstrument.instrument_type}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-mono font-black text-slate-900 dark:text-white">
                    ₹{livePrice.toFixed(2)}
                  </span>
                  <span className={`text-xs font-mono font-bold flex items-center ${
                    (selectedInstrument.daily_change_percent || 0) >= 0 ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'
                  }`}>
                    {(selectedInstrument.daily_change_percent || 0) >= 0 ? '+' : ''}{selectedInstrument.daily_change_percent}% Today
                  </span>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      activeTimeframe === tf 
                        ? 'bg-white text-slate-900 font-bold shadow-xs dark:bg-slate-800 dark:text-[#00E599]' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Candlestick & Area Visualization */}
            <div className="h-64 w-full bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 relative flex flex-col justify-between overflow-hidden">
              {/* High/Low markers */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 z-10">
                <span>DAY HIGH: ₹{(livePrice * 1.015).toFixed(2)}</span>
                <span>VWAP: ₹{(livePrice * 0.998).toFixed(2)}</span>
                <span>DAY LOW: ₹{(livePrice * 0.985).toFixed(2)}</span>
              </div>

              {/* Simulated Candlesticks Row */}
              <div className="h-44 w-full flex items-end justify-between gap-2 px-2 z-10">
                {(selectedInstrument.historical_prices || [2920, 2935, 2910, 2950, 2975, 2960, 2984.5]).map((price, idx) => {
                  const isGreen = idx % 2 === 0;
                  const heightPercent = Math.min(95, Math.max(25, ((price - 2800) / 300) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer">
                      {/* Top Wick */}
                      <div className={`w-0.5 h-3 ${isGreen ? 'bg-emerald-500 dark:bg-[#00E599]' : 'bg-rose-500 dark:bg-[#FF2E7E]'}`} />
                      {/* Real Body */}
                      <div
                        className={`w-full max-w-[28px] rounded-xs transition-all duration-300 ${
                          isGreen
                            ? 'bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400 dark:bg-[#00E599]/80 dark:hover:bg-[#00E599] dark:border-[#00FFB2]'
                            : 'bg-rose-500/80 hover:bg-rose-500 border border-rose-400 dark:bg-[#FF2E7E]/80 dark:hover:bg-[#FF2E7E] dark:border-[#FF5599]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      {/* Bottom Wick */}
                      <div className={`w-0.5 h-3 ${isGreen ? 'bg-emerald-500 dark:bg-[#00E599]' : 'bg-rose-500 dark:bg-[#FF2E7E]'}`} />
                    </div>
                  );
                })}
              </div>

              {/* Bottom Time Axis */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 z-10 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <span>09:15 AM</span>
                <span>11:30 AM</span>
                <span>01:15 PM</span>
                <span>03:30 PM (MARKET CLOSE)</span>
              </div>
            </div>

            {/* Financial Metrics & Concept Explainers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">BETA (SENSITIVITY)</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{selectedInstrument.beta || 1.0}</span>
                <span className="text-[9px] text-slate-500 block">vs Nifty 50 Index</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">P/E MULTIPLE</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{selectedInstrument.pe_ratio || 'N/A'}</span>
                <span className="text-[9px] text-slate-500 block">Valuation Ratio</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">CATEGORY / SECTOR</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{selectedInstrument.category_tag}</span>
                <span className="text-[9px] text-slate-500 block">Asset Classification</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block">YOUR HOLDINGS</span>
                <span className="text-sm font-mono font-bold text-emerald-600 dark:text-[#00E599]">{holdingQty} Units</span>
                <span className="text-[9px] text-slate-500 block">₹{(holdingQty * livePrice).toFixed(0)} Value</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Order Entry Box & Active Holdings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Placement Box */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                ORDER EXECUTION
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-[#00E599]">NSE SIMULATOR</span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setOrderType('BUY')}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-xs dark:bg-[#00E599] dark:text-slate-950 dark:shadow-[0_0_15px_rgba(0,229,153,0.3)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                BUY / LONG
              </button>
              <button
                onClick={() => setOrderType('SELL')}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  orderType === 'SELL'
                    ? 'bg-[#FF2E7E] text-white shadow-xs dark:shadow-[0_0_15px_rgba(255,46,126,0.3)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3.5">
              {/* Order Mode (Market vs Limit) */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Order Mode</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderMode('MARKET')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer ${orderMode === 'MARKET' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
                  >
                    MARKET
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderMode('LIMIT')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer ${orderMode === 'LIMIT' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
                  >
                    LIMIT
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1 font-mono font-bold">QUANTITY (SHARES / UNITS)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                  <button
                    type="button"
                    onClick={() => setTradeQuantity(50)}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-mono font-bold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    50
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeQuantity(100)}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-mono font-bold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    100
                  </button>
                </div>
              </div>

              {/* Limit Price Input if Limit Mode */}
              {orderMode === 'LIMIT' && (
                <div>
                  <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1 font-mono font-bold">LIMIT PRICE (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                </div>
              )}

              {/* Order Calculation */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Unit Price:</span>
                  <span className="text-slate-900 dark:text-white font-bold">₹{executionPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-emerald-600 dark:text-[#00E599]">₹{totalOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Brokerage:</span>
                  <span>₹0.00 (Zero Fee Sandbox)</span>
                </div>
              </div>

              {/* Execute Button */}
              <button
                type="submit"
                disabled={!canAfford}
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  !canAfford
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : orderType === 'BUY'
                    ? 'bg-[#00E599] hover:bg-[#00B377] text-slate-950 shadow-sm'
                    : 'bg-[#FF2E7E] hover:bg-[#E61E6D] text-white shadow-sm'
                }`}
              >
                <span>
                  {!canAfford
                    ? orderType === 'BUY' ? 'Insufficient Virtual Funds' : 'Exceeds Current Position'
                    : `Execute Virtual ${orderType} (${tradeQuantity} Units)`}
                </span>
              </button>
            </form>

            {/* Success feedback toast */}
            <AnimatePresence>
              {showTradeSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-mono"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                  <span>Paper Trade Filled Instantly at ₹{executionPrice.toFixed(2)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Holdings Quick Summary */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                YOUR PORTFOLIO HOLDINGS
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-[#00E599] font-bold">{holdings.length} Assets</span>
            </div>

            <div className="space-y-2">
              {holdings.map((h) => {
                const inst = instruments.find((i) => i.instrument_id === h.instrument_id);
                if (!inst) return null;
                const pnl = (inst.simulated_price - h.avg_buy_price) * h.quantity;
                const pnlPct = ((inst.simulated_price - h.avg_buy_price) / h.avg_buy_price) * 100;

                return (
                  <div
                    key={h.holding_id}
                    onClick={() => setSelectedInstrument(inst)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-pink-300 dark:hover:border-slate-700 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{inst.symbol}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {h.quantity} Qty @ Avg ₹{h.avg_buy_price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">₹{(h.quantity * inst.simulated_price).toFixed(0)}</div>
                      <div className={`text-[10px] font-bold ${pnl >= 0 ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(0)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
