import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Percent, 
  Layers, 
  ArrowRight, 
  Info, 
  RefreshCw, 
  Sliders, 
  Activity,
  Zap,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface FinancialCalculatorsViewProps {
  onNavigate?: (view: AppNavView, payload?: any) => void;
}

// Math Utility Helpers for Black-Scholes & Statistics
function cdfNormal(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * y);
}

function pdfNormal(x: number): number {
  return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export const FinancialCalculatorsView: React.FC<FinancialCalculatorsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'nism-ratios' | 'black-scholes' | 'bond-duration' | 'capm-wacc' | 'dupont' | 'payoff'>('nism-ratios');

  // -------------------------------------------------------------
  // 0. NISM FUNDAMENTAL RATIOS STATE (Item 11)
  // -------------------------------------------------------------
  // P/E & PEG
  const [pePrice, setPePrice] = useState<number>(1450);
  const [peEps, setPeEps] = useState<number>(58);
  const [peGrowth, setPeGrowth] = useState<number>(18); // % annual growth

  // EV/EBITDA
  const [evMarketCap, setEvMarketCap] = useState<number>(28000); // Cr
  const [evDebt, setEvDebt] = useState<number>(4500); // Cr
  const [evCash, setEvCash] = useState<number>(1500); // Cr
  const [evEbitda, setEvEbitda] = useState<number>(3800); // Cr

  // PAT & Operating Margins
  const [revSales, setRevSales] = useState<number>(12000); // Cr
  const [revCogs, setRevCogs] = useState<number>(6500); // Cr
  const [revOpex, setRevOpex] = useState<number>(2200); // Cr
  const [revInterest, setRevInterest] = useState<number>(600); // Cr
  const [revTax, setRevTax] = useState<number>(675); // Cr

  // ROCE & P/B
  const [roceEbit, setRoceEbit] = useState<number>(3300); // Cr
  const [roceTotalAssets, setRoceTotalAssets] = useState<number>(18000); // Cr
  const [roceCurrentLiab, setRoceCurrentLiab] = useState<number>(3000); // Cr
  const [pbPrice, setPbPrice] = useState<number>(850);
  const [pbBvps, setPbBvps] = useState<number>(212.5);

  // Solvency & Liquidity (Debt/Equity, Interest Coverage, Current & Quick)
  const [covDebt, setCovDebt] = useState<number>(4500); // Cr
  const [covEquity, setCovEquity] = useState<number>(9000); // Cr
  const [covCurrAssets, setCovCurrAssets] = useState<number>(4200); // Cr
  const [covInventory, setCovInventory] = useState<number>(1200); // Cr

  // Gordon Growth Dividend Discount Model
  const [gordonD0, setGordonD0] = useState<number>(16.0); // Rs dividend
  const [gordonGrowth, setGordonGrowth] = useState<number>(6.5); // % growth
  const [gordonKe, setGordonKe] = useState<number>(11.5); // % cost of equity

  // -------------------------------------------------------------
  // 1. BLACK-SCHOLES STATE & CALCULATIONS
  // -------------------------------------------------------------
  const [bsSpot, setBsSpot] = useState<number>(24500); // e.g. NIFTY 50 Spot
  const [bsStrike, setBsStrike] = useState<number>(24500);
  const [bsDte, setBsDte] = useState<number>(30); // Days to expiry
  const [bsVol, setBsVol] = useState<number>(14.5); // % IV
  const [bsRate, setBsRate] = useState<number>(6.75); // % RBI repo / MIBOR rate

  const bsResults = useMemo(() => {
    const S = Math.max(0.01, bsSpot);
    const K = Math.max(0.01, bsStrike);
    const T = Math.max(0.001, bsDte / 365.0);
    const sigma = Math.max(0.001, bsVol / 100.0);
    const r = bsRate / 100.0;

    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = cdfNormal(d1);
    const Nd2 = cdfNormal(d2);
    const N_minus_d1 = cdfNormal(-d1);
    const N_minus_d2 = cdfNormal(-d2);
    const pdf_d1 = pdfNormal(d1);

    const callPrice = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    const putPrice = K * Math.exp(-r * T) * N_minus_d2 - S * N_minus_d1;

    // Greeks
    const callDelta = Nd1;
    const putDelta = Nd1 - 1.0;
    const gamma = pdf_d1 / (S * sigma * Math.sqrt(T));
    const callTheta = (-(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365.0;
    const putTheta = (-(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_minus_d2) / 365.0;
    const vega = (S * Math.sqrt(T) * pdf_d1 * 0.01); // 1% change in vol
    const callRho = (K * T * Math.exp(-r * T) * Nd2 * 0.01); // 1% change in rate
    const putRho = (-K * T * Math.exp(-r * T) * N_minus_d2 * 0.01);

    const moneyness = (S / K - 1) * 100;
    let moneynessText = 'At-The-Money (ATM)';
    if (moneyness > 3) moneynessText = 'In-The-Money (ITM)';
    else if (moneyness > 8) moneynessText = 'Deep ITM';
    else if (moneyness < -8) moneynessText = 'Deep OTM';
    else if (moneyness < -3) moneynessText = 'Out-of-The-Money (OTM)';

    return {
      d1,
      d2,
      callPrice: Math.max(0, callPrice),
      putPrice: Math.max(0, putPrice),
      callDelta,
      putDelta,
      gamma,
      callTheta,
      putTheta,
      vega,
      callRho,
      putRho,
      moneynessText,
      moneyness
    };
  }, [bsSpot, bsStrike, bsDte, bsVol, bsRate]);

  // -------------------------------------------------------------
  // 2. BOND YTM, MACAULAY & MODIFIED DURATION
  // -------------------------------------------------------------
  const [bondFace, setBondFace] = useState<number>(1000);
  const [bondCouponRate, setBondCouponRate] = useState<number>(7.25); // %
  const [bondYears, setBondYears] = useState<number>(5);
  const [bondPrice, setBondPrice] = useState<number>(985);
  const [bondFreq, setBondFreq] = useState<number>(2); // Semi-annual

  const bondResults = useMemo(() => {
    const F = bondFace;
    const C = (F * (bondCouponRate / 100)) / bondFreq;
    const n = bondYears * bondFreq;
    const P = bondPrice;

    // Approximate YTM solver using Newton-Raphson
    let y = (bondCouponRate / 100) / bondFreq; // initial guess per period
    for (let iter = 0; iter < 40; iter++) {
      let pv = 0;
      let dPv = 0;
      for (let t = 1; t <= n; t++) {
        pv += C / Math.pow(1 + y, t);
        dPv -= (t * C) / Math.pow(1 + y, t + 1);
      }
      pv += F / Math.pow(1 + y, n);
      dPv -= (n * F) / Math.pow(1 + y, n + 1);

      const diff = pv - P;
      if (Math.abs(diff) < 0.0001) break;
      if (Math.abs(dPv) < 1e-9) break;
      y = y - diff / dPv;
    }

    const annualYTM = y * bondFreq * 100;

    // Macaulay Duration & Convexity
    let sumWeightT = 0;
    let sumConvexity = 0;
    const schedule: Array<{ period: number; cf: number; pv: number; weight: number }> = [];

    for (let t = 1; t <= n; t++) {
      const isMaturity = t === n;
      const cf = isMaturity ? C + F : C;
      const pv = cf / Math.pow(1 + y, t);
      const weight = pv / P;
      const timeInYears = t / bondFreq;
      sumWeightT += timeInYears * pv;
      sumConvexity += (timeInYears * (timeInYears + 1 / bondFreq) * pv) / Math.pow(1 + y, 2);
      if (t <= 6 || isMaturity) {
        schedule.push({ period: t, cf, pv, weight: weight * 100 });
      }
    }

    const macDuration = sumWeightT / P;
    const modDuration = macDuration / (1 + y);
    const convexity = sumConvexity / P;

    // 50 bps shock impact
    const deltaY = 0.0050; // +50 bps
    const priceShockImpact = (-modDuration * deltaY + 0.5 * convexity * Math.pow(deltaY, 2)) * 100;

    return {
      annualYTM: isNaN(annualYTM) ? 0 : annualYTM,
      macDuration: isNaN(macDuration) ? 0 : macDuration,
      modDuration: isNaN(modDuration) ? 0 : modDuration,
      convexity: isNaN(convexity) ? 0 : convexity,
      priceShockImpact,
      schedule
    };
  }, [bondFace, bondCouponRate, bondYears, bondPrice, bondFreq]);

  // -------------------------------------------------------------
  // 3. CAPM & WACC CALCULATOR
  // -------------------------------------------------------------
  const [capmRf, setCapmRf] = useState<number>(6.85); // 10Y Indian G-Sec
  const [capmRm, setCapmRm] = useState<number>(12.50); // NIFTY 50 Hist CAGR
  const [capmBeta, setCapmBeta] = useState<number>(1.15); // Reliance / IT stock
  const [waccEquityVal, setWaccEquityVal] = useState<number>(80000); // in Cr
  const [waccDebtVal, setWaccDebtVal] = useState<number>(20000); // in Cr
  const [waccKd, setWaccKd] = useState<number>(8.50); // Pre-tax Cost of Debt %
  const [waccTax, setWaccTax] = useState<number>(25.0); // Corporate Tax Rate %

  const capmWaccResults = useMemo(() => {
    const erp = capmRm - capmRf;
    const ke = capmRf + capmBeta * erp;
    
    const totalCap = waccEquityVal + waccDebtVal;
    const we = totalCap > 0 ? waccEquityVal / totalCap : 0;
    const wd = totalCap > 0 ? waccDebtVal / totalCap : 0;
    const afterTaxKd = waccKd * (1 - waccTax / 100);
    const wacc = we * ke + wd * afterTaxKd;

    return {
      ke,
      erp,
      we: we * 100,
      wd: wd * 100,
      afterTaxKd,
      wacc
    };
  }, [capmRf, capmRm, capmBeta, waccEquityVal, waccDebtVal, waccKd, waccTax]);

  // -------------------------------------------------------------
  // 4. DUPONT 5-STEP ROE DECOMPOSITION
  // -------------------------------------------------------------
  const [dpNetIncome, setDpNetIncome] = useState<number>(15200); // Cr
  const [dpEbt, setDpEbt] = useState<number>(20300);
  const [dpEbit, setDpEbit] = useState<number>(24500);
  const [dpSales, setDpSales] = useState<number>(115000);
  const [dpAssets, setDpAssets] = useState<number>(180000);
  const [dpEquity, setDpEquity] = useState<number>(95000);

  const dupontResults = useMemo(() => {
    const taxBurden = dpEbt > 0 ? dpNetIncome / dpEbt : 0; // Net Income / EBT
    const interestBurden = dpEbit > 0 ? dpEbt / dpEbit : 0; // EBT / EBIT
    const ebitMargin = dpSales > 0 ? dpEbit / dpSales : 0; // EBIT / Sales
    const assetTurnover = dpAssets > 0 ? dpSales / dpAssets : 0; // Sales / Assets
    const leverage = dpEquity > 0 ? dpAssets / dpEquity : 0; // Assets / Equity

    const roe5Step = (taxBurden * interestBurden * ebitMargin * assetTurnover * leverage) * 100;
    const simpleRoe = dpEquity > 0 ? (dpNetIncome / dpEquity) * 100 : 0;

    return {
      taxBurden,
      interestBurden,
      ebitMargin: ebitMargin * 100,
      assetTurnover,
      leverage,
      roe5Step,
      simpleRoe
    };
  }, [dpNetIncome, dpEbt, dpEbit, dpSales, dpAssets, dpEquity]);

  // -------------------------------------------------------------
  // 5. STRATEGY PAYOFF VISUALIZER
  // -------------------------------------------------------------
  const [strategyPreset, setStrategyPreset] = useState<'bull-call' | 'bear-put' | 'straddle' | 'iron-condor'>('bull-call');
  const [currentUnderlying, setCurrentUnderlying] = useState<number>(24500);

  const strategyConfig = useMemo(() => {
    const S0 = currentUnderlying;
    switch (strategyPreset) {
      case 'bull-call':
        return {
          title: 'Bull Call Spread',
          description: 'Buy Lower Strike Call (ITM/ATM) & Sell Higher Strike Call (OTM) for defined-risk upside.',
          legs: [
            { type: 'CALL', action: 'BUY', strike: S0, premium: 240 },
            { type: 'CALL', action: 'SELL', strike: S0 + 400, premium: 70 }
          ],
          maxProfit: (400 - (240 - 70)),
          maxLoss: -(240 - 70),
          breakeven: [S0 + (240 - 70)]
        };
      case 'bear-put':
        return {
          title: 'Bear Put Spread',
          description: 'Buy Higher Strike Put & Sell Lower Strike Put for directional bearish leverage.',
          legs: [
            { type: 'PUT', action: 'BUY', strike: S0, premium: 220 },
            { type: 'PUT', action: 'SELL', strike: S0 - 400, premium: 65 }
          ],
          maxProfit: (400 - (220 - 65)),
          maxLoss: -(220 - 65),
          breakeven: [S0 - (220 - 65)]
        };
      case 'straddle':
        return {
          title: 'Long Straddle',
          description: 'Buy ATM Call & Buy ATM Put to profit from explosive volatility in either direction.',
          legs: [
            { type: 'CALL', action: 'BUY', strike: S0, premium: 240 },
            { type: 'PUT', action: 'BUY', strike: S0, premium: 220 }
          ],
          maxProfit: Infinity,
          maxLoss: -(240 + 220),
          breakeven: [S0 - (240 + 220), S0 + (240 + 220)]
        };
      case 'iron-condor':
        return {
          title: 'Iron Condor (Range Bound)',
          description: 'Market-neutral income strategy selling OTM Call spread & OTM Put spread with bounded risk.',
          legs: [
            { type: 'PUT', action: 'BUY', strike: S0 - 600, premium: 35 },
            { type: 'PUT', action: 'SELL', strike: S0 - 300, premium: 95 },
            { type: 'CALL', action: 'SELL', strike: S0 + 300, premium: 105 },
            { type: 'CALL', action: 'BUY', strike: S0 + 600, premium: 40 }
          ],
          maxProfit: (95 - 35) + (105 - 40),
          maxLoss: -(300 - ((95 - 35) + (105 - 40))),
          breakeven: [S0 - 300 - ((95 - 35) + (105 - 40)), S0 + 300 + ((95 - 35) + (105 - 40))]
        };
    }
  }, [strategyPreset, currentUnderlying]);

  // Generate 25 Payoff Data Points for SVG
  const payoffGraphPoints = useMemo(() => {
    const range = 1000;
    const step = 80;
    const points: Array<{ price: number; pnl: number }> = [];

    const minPrice = currentUnderlying - range;
    const maxPrice = currentUnderlying + range;

    for (let p = minPrice; p <= maxPrice; p += step) {
      let netPnl = 0;
      strategyConfig.legs.forEach(leg => {
        let intrinsic = 0;
        if (leg.type === 'CALL') {
          intrinsic = Math.max(0, p - leg.strike);
        } else {
          intrinsic = Math.max(0, leg.strike - p);
        }

        if (leg.action === 'BUY') {
          netPnl += (intrinsic - leg.premium);
        } else {
          netPnl += (leg.premium - intrinsic);
        }
      });
      points.push({ price: p, pnl: netPnl });
    }
    return points;
  }, [currentUnderlying, strategyConfig]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Institutional Sandbox
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Exact Mathematical Engines
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Calculator className="w-8 h-8 text-emerald-500" />
            Quantitative Financial Calculators
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-world derivatives pricing, fixed income duration & convexity, corporate valuation, and multi-leg options payoff engines aligned with NISM, CFA & FRM standards.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('practice-lab')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 w-fit"
          >
            <span>Live Trading Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveTab('nism-ratios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'nism-ratios'
              ? 'bg-[#FF5722] text-white shadow-md font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>NISM Fundamental Ratios (11 Models)</span>
        </button>

        <button
          onClick={() => setActiveTab('black-scholes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'black-scholes'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Black-Scholes & Greeks</span>
        </button>

        <button
          onClick={() => setActiveTab('bond-duration')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bond-duration'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Bond YTM & Duration</span>
        </button>

        <button
          onClick={() => setActiveTab('capm-wacc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'capm-wacc'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>CAPM & WACC</span>
        </button>

        <button
          onClick={() => setActiveTab('dupont')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'dupont'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5-Step DuPont ROE</span>
        </button>

        <button
          onClick={() => setActiveTab('payoff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'payoff'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Option Strategy Payoffs</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 0. NISM FUNDAMENTAL RATIOS TAB (Item 11) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'nism-ratios' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-mono">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>NISM Series XV Official Financial Ratio Suite with Step-by-Step Mathematical Formula Decomposition.</span>
            </span>
            <span className="font-bold">SEBI RA SYLLABUS CH 8 & 10</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. P/E & PEG Ratio */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
                    <span>Price-to-Earnings & PEG</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">VALUATION</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>P/E</strong> = Market Price / Diluted EPS</div>
                  <div><strong>PEG</strong> = (P/E Ratio) / Annual Earnings Growth Rate (%)</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Current Stock Price (₹):</label>
                    <input
                      type="number"
                      value={pePrice}
                      onChange={(e) => setPePrice(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Diluted EPS (₹):</label>
                    <input
                      type="number"
                      value={peEps}
                      onChange={(e) => setPeEps(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Expected Earnings Growth (%):</label>
                    <input
                      type="number"
                      value={peGrowth}
                      onChange={(e) => setPeGrowth(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FF5722]/10 border border-[#FF5722]/30 text-xs font-mono space-y-1">
                {(() => {
                  const pe = +(pePrice / peEps).toFixed(2);
                  const peg = +(pe / peGrowth).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">P/E Ratio:</span>
                        <span className="font-bold text-[#FF5722] text-sm">{pe}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">PEG Ratio:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{peg}x</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1">
                        {peg < 1.0 ? '✓ Undervalued relative to growth (< 1.0)' : 'Premium relative to growth (≥ 1.0)'}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 2. EV/EBITDA Calculator */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Enterprise Value / EBITDA</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">CAPITAL NEUTRAL</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>EV</strong> = Market Cap + Total Debt - Cash</div>
                  <div><strong>EV/EBITDA</strong> = EV / Annual EBITDA</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Market Cap (₹ Cr):</label>
                      <input
                        type="number"
                        value={evMarketCap}
                        onChange={(e) => setEvMarketCap(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Total Debt (₹ Cr):</label>
                      <input
                        type="number"
                        value={evDebt}
                        onChange={(e) => setEvDebt(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Cash & Liquid (₹ Cr):</label>
                      <input
                        type="number"
                        value={evCash}
                        onChange={(e) => setEvCash(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">EBITDA (₹ Cr):</label>
                      <input
                        type="number"
                        value={evEbitda}
                        onChange={(e) => setEvEbitda(Math.max(1, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1">
                {(() => {
                  const ev = evMarketCap + evDebt - evCash;
                  const evMultiple = +(ev / evEbitda).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Enterprise Value (EV):</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{ev.toLocaleString()} Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">EV/EBITDA Multiple:</span>
                        <span className="font-bold text-emerald-600 dark:text-[#00E599] text-sm">{evMultiple}x</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 3. PAT Margin & Profit Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>PAT Margin & Profitability</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">PROFITABILITY</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>PAT Margin</strong> = (Net Profit After Tax / Sales) × 100</div>
                  <div><strong>EBITDA Margin</strong> = (EBITDA / Sales) × 100</div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] text-slate-500">Revenue (₹ Cr):</span>
                    <input
                      type="number"
                      value={revSales}
                      onChange={(e) => setRevSales(Math.max(1, Number(e.target.value)))}
                      className="w-28 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] text-slate-500">COGS (₹ Cr):</span>
                    <input
                      type="number"
                      value={revCogs}
                      onChange={(e) => setRevCogs(Number(e.target.value))}
                      className="w-28 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] text-slate-500">Opex (₹ Cr):</span>
                    <input
                      type="number"
                      value={revOpex}
                      onChange={(e) => setRevOpex(Number(e.target.value))}
                      className="w-28 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] text-slate-500">Interest + Tax (₹ Cr):</span>
                    <input
                      type="number"
                      value={revInterest + revTax}
                      onChange={(e) => {
                        const total = Number(e.target.value);
                        setRevInterest(Math.round(total * 0.45));
                        setRevTax(Math.round(total * 0.55));
                      }}
                      className="w-28 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono space-y-1">
                {(() => {
                  const ebitda = revSales - revCogs - revOpex;
                  const pat = ebitda - revInterest - revTax;
                  const ebitdaMargin = +((ebitda / revSales) * 100).toFixed(2);
                  const patMargin = +((pat / revSales) * 100).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">EBITDA Margin:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{ebitdaMargin}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">PAT Margin (Net):</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{patMargin}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Net Profit After Tax:</span>
                        <span>₹{pat.toLocaleString()} Cr</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 4. ROCE & P/B Ratio */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>ROCE & Price-to-Book (P/B)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">EFFICIENCY</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>ROCE</strong> = EBIT / (Total Assets - Current Liabilities)</div>
                  <div><strong>P/B Ratio</strong> = Share Price / Book Value per Share</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">EBIT (₹ Cr):</label>
                      <input
                        type="number"
                        value={roceEbit}
                        onChange={(e) => setRoceEbit(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Total Assets (₹ Cr):</label>
                      <input
                        type="number"
                        value={roceTotalAssets}
                        onChange={(e) => setRoceTotalAssets(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Current Liab (₹ Cr):</label>
                      <input
                        type="number"
                        value={roceCurrentLiab}
                        onChange={(e) => setRoceCurrentLiab(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Book Value (₹):</label>
                      <input
                        type="number"
                        value={pbBvps}
                        onChange={(e) => setPbBvps(Math.max(1, Number(e.target.value)))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono space-y-1">
                {(() => {
                  const capitalEmployed = Math.max(1, roceTotalAssets - roceCurrentLiab);
                  const roce = +((roceEbit / capitalEmployed) * 100).toFixed(2);
                  const pb = +(pbPrice / pbBvps).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">ROCE:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">{roce}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">P/B Ratio (CMP ₹{pbPrice}):</span>
                        <span className="font-bold text-slate-900 dark:text-white">{pb}x</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 5. Solvency & Liquidity (Coverage, D/E, Current) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Solvency & Liquidity</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">SAFETY</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>Interest Coverage</strong> = EBIT / Interest</div>
                  <div><strong>Debt/Equity</strong> = Total Debt / Net Worth</div>
                  <div><strong>Current Ratio</strong> = Current Assets / Current Liabilities</div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Debt (₹ Cr):</label>
                      <input
                        type="number"
                        value={covDebt}
                        onChange={(e) => setCovDebt(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Equity (₹ Cr):</label>
                      <input
                        type="number"
                        value={covEquity}
                        onChange={(e) => setCovEquity(Math.max(1, Number(e.target.value)))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Current Assets:</label>
                      <input
                        type="number"
                        value={covCurrAssets}
                        onChange={(e) => setCovCurrAssets(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Inventory (₹ Cr):</label>
                      <input
                        type="number"
                        value={covInventory}
                        onChange={(e) => setCovInventory(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-1">
                {(() => {
                  const intCoverage = +(roceEbit / revInterest).toFixed(2);
                  const deRatio = +(covDebt / covEquity).toFixed(2);
                  const currentRatio = +(covCurrAssets / roceCurrentLiab).toFixed(2);
                  const quickRatio = +((covCurrAssets - covInventory) / roceCurrentLiab).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Interest Coverage:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{intCoverage}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Debt-to-Equity:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{deRatio}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Current / Quick:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{currentRatio}x / {quickRatio}x</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 6. Gordon Growth Dividend Discount Model */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Gordon Growth Model (DDM)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">INTRINSIC VALUE</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-3 text-[11px] font-mono space-y-1">
                  <div><strong>D₁</strong> = D₀ × (1 + g)</div>
                  <div><strong>P₀</strong> = D₁ / (Ke - g)</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Last Annual Dividend D₀ (₹):</label>
                    <input
                      type="number"
                      value={gordonD0}
                      onChange={(e) => setGordonD0(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Perpetual Dividend Growth Rate g (%):</label>
                    <input
                      type="number"
                      value={gordonGrowth}
                      onChange={(e) => setGordonGrowth(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Cost of Equity Ke (%):</label>
                    <input
                      type="number"
                      value={gordonKe}
                      onChange={(e) => setGordonKe(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-mono space-y-1">
                {(() => {
                  const d1 = gordonD0 * (1 + gordonGrowth / 100);
                  const denominator = (gordonKe - gordonGrowth) / 100;
                  const fairValue = denominator > 0 ? +(d1 / denominator).toFixed(2) : 'N/A (Ke <= g)';
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Expected Dividend (D₁):</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{d1.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Intrinsic Value (P₀):</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {typeof fairValue === 'number' ? `₹${fairValue.toLocaleString()}` : fairValue}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. BLACK-SCHOLES & GREEKS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'black-scholes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>Option Parameters</span>
              </h2>
              <button
                onClick={() => {
                  setBsSpot(24500);
                  setBsStrike(24500);
                  setBsDte(30);
                  setBsVol(14.5);
                  setBsRate(6.75);
                }}
                className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Underlying Spot */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Spot Price (S)</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">₹{bsSpot.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={40000}
                step={50}
                value={bsSpot}
                onChange={(e) => setBsSpot(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <input
                type="number"
                value={bsSpot}
                onChange={(e) => setBsSpot(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Strike Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Strike Price (K)</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">₹{bsStrike.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={40000}
                step={50}
                value={bsStrike}
                onChange={(e) => setBsStrike(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <input
                type="number"
                value={bsStrike}
                onChange={(e) => setBsStrike(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Days to Expiry */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Days to Expiration (DTE)</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">{bsDte} Days</span>
              </div>
              <input
                type="range"
                min={1}
                max={365}
                value={bsDte}
                onChange={(e) => setBsDte(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Implied Volatility */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Implied Volatility (IV %)</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">{bsVol}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                step={0.5}
                value={bsVol}
                onChange={(e) => setBsVol(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Risk-Free Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Risk-Free Interest Rate (r %)</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">{bsRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.25}
                value={bsRate}
                onChange={(e) => setBsRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Status Note */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Standard European Black-Scholes formula using continuous compounding and lognormal distribution of asset prices.
              </span>
            </div>
          </div>

          {/* Results & Greeks Display */}
          <div className="lg:col-span-7 space-y-6">
            {/* Call & Put Premium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Call Card */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      European Call Price (CE)
                    </span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
                      ₹{bsResults.callPrice.toFixed(2)}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {bsResults.moneynessText}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Delta (Δ): <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{bsResults.callDelta.toFixed(3)}</strong></span>
                  <span>Theta (Θ): <strong className="text-rose-500 font-mono">{bsResults.callTheta.toFixed(2)}/d</strong></span>
                </div>
              </div>

              {/* Put Card */}
              <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      European Put Price (PE)
                    </span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
                      ₹{bsResults.putPrice.toFixed(2)}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    {bsResults.moneyness < 0 ? 'ITM' : 'OTM'}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-500/20 flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Delta (Δ): <strong className="text-rose-600 dark:text-rose-400 font-mono">{bsResults.putDelta.toFixed(3)}</strong></span>
                  <span>Theta (Θ): <strong className="text-rose-500 font-mono">{bsResults.putTheta.toFixed(2)}/d</strong></span>
                </div>
              </div>
            </div>

            {/* Complete Greeks Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  First & Second Order Greeks
                </span>
                <span className="text-xs font-normal text-slate-400">d1: {bsResults.d1.toFixed(4)} | d2: {bsResults.d2.toFixed(4)}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Gamma (Γ)</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {bsResults.gamma.toFixed(5)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rate of Δ change</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Vega (ν)</div>
                  <div className="text-lg font-bold font-mono text-blue-500 mt-1">
                    {bsResults.vega.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Per +1% Volatility</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Call Rho (ρ)</div>
                  <div className="text-lg font-bold font-mono text-emerald-500 mt-1">
                    {bsResults.callRho.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Per +1% Int Rate</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Put Rho (ρ)</div>
                  <div className="text-lg font-bold font-mono text-rose-500 mt-1">
                    {bsResults.putRho.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Per +1% Int Rate</div>
                </div>
              </div>

              {/* Mathematical Explanation Alert */}
              <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> NISM Series VIII Key Takeaways
                </div>
                <p>
                  • <strong>Delta (Δ)</strong>: Measures directional sensitivity. Call Delta ranges from 0 to +1, while Put Delta ranges from -1 to 0.
                </p>
                <p>
                  • <strong>Theta (Θ)</strong>: Decay rate of option premium per calendar day. Theta decay accelerates exponentially in the final 30 days before expiration.
                </p>
                <p>
                  • <strong>Vega (ν)</strong>: Option sensitivity to market volatility changes. Maximum when options are strictly At-The-Money (ATM).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. BOND YTM & DURATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bond-duration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Percent className="w-4 h-4 text-emerald-500" />
              <span>Bond Parameters</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Face Value (₹)</label>
              <input
                type="number"
                value={bondFace}
                onChange={(e) => setBondFace(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Annual Coupon Rate (%)</label>
              <input
                type="number"
                step="0.05"
                value={bondCouponRate}
                onChange={(e) => setBondCouponRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Current Market Price (₹)</label>
              <input
                type="number"
                value={bondPrice}
                onChange={(e) => setBondPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Maturity (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={bondYears}
                  onChange={(e) => setBondYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Coupon Frequency</label>
                <select
                  value={bondFreq}
                  onChange={(e) => setBondFreq(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  <option value={1}>Annual (1/yr)</option>
                  <option value={2}>Semi-Annual (2/yr)</option>
                  <option value={4}>Quarterly (4/yr)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Yield to Maturity (YTM)</div>
                <div className="text-2xl font-black font-mono text-emerald-500 mt-2">
                  {bondResults.annualYTM.toFixed(2)}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {bondPrice < bondFace ? 'Trading at Discount' : bondPrice > bondFace ? 'Trading at Premium' : 'Trading at Par'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Macaulay Duration</div>
                <div className="text-2xl font-black font-mono text-cyan-500 mt-2">
                  {bondResults.macDuration.toFixed(2)} <span className="text-sm font-normal text-slate-400">yrs</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Weighted cash-flow time</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Modified Duration</div>
                <div className="text-2xl font-black font-mono text-purple-500 mt-2">
                  {bondResults.modDuration.toFixed(2)} <span className="text-sm font-normal text-slate-400">%</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Price sensitivity per 1% Δy</div>
              </div>
            </div>

            {/* Interest Rate Shock Box */}
            <div className="p-5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                Interest Rate Shock Simulation (+50 bps Shift in Yields)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Using Modified Duration ({bondResults.modDuration.toFixed(2)}) and Convexity ({bondResults.convexity.toFixed(2)}):
              </p>
              <div className="text-lg font-bold font-mono text-rose-500">
                Estimated Price Change: {bondResults.priceShockImpact.toFixed(2)}%
                <span className="text-xs text-slate-400 ml-2 font-normal">
                  (New Price ≈ ₹{(bondPrice * (1 + bondResults.priceShockImpact / 100)).toFixed(2)})
                </span>
              </div>
            </div>

            {/* Cash Flow Schedule preview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Cash Flow & Present Value Schedule</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-left">
                      <th className="pb-2">Period</th>
                      <th className="pb-2">Cash Flow (₹)</th>
                      <th className="pb-2">Discounted PV (₹)</th>
                      <th className="pb-2 text-right">Weight (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {bondResults.schedule.map((row) => (
                      <tr key={row.period} className="text-slate-700 dark:text-slate-300">
                        <td className="py-2">{row.period}</td>
                        <td className="py-2">₹{row.cf.toFixed(2)}</td>
                        <td className="py-2">₹{row.pv.toFixed(2)}</td>
                        <td className="py-2 text-right">{row.weight.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CAPM & WACC TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'capm-wacc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Capital Structure & Market Inputs</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Risk-Free Rate (Rf %)</label>
              <input
                type="number"
                step="0.1"
                value={capmRf}
                onChange={(e) => setCapmRf(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">e.g. 10-Yr Indian Benchmark G-Sec Yield</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Expected Market Return (Rm %)</label>
              <input
                type="number"
                step="0.25"
                value={capmRm}
                onChange={(e) => setCapmRm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">e.g. Long-term NIFTY 50 CAGR</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Asset Beta (β)</label>
              <input
                type="number"
                step="0.05"
                value={capmBeta}
                onChange={(e) => setCapmBeta(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Equity Value (₹ Cr)</label>
                <input
                  type="number"
                  value={waccEquityVal}
                  onChange={(e) => setWaccEquityVal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Debt (₹ Cr)</label>
                <input
                  type="number"
                  value={waccDebtVal}
                  onChange={(e) => setWaccDebtVal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Cost of Debt (Kd %)</label>
                <input
                  type="number"
                  step="0.25"
                  value={waccKd}
                  onChange={(e) => setWaccKd(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Tax Rate (Tc %)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waccTax}
                  onChange={(e) => setWaccTax(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Cost of Equity (Ke via CAPM)
                </span>
                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
                  {capmWaccResults.ke.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Rf ({capmRf}%) + β({capmBeta}) × ERP ({capmWaccResults.erp.toFixed(2)}%)
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                  Weighted Avg Cost of Capital (WACC)
                </span>
                <div className="text-3xl font-black font-mono text-emerald-500 mt-2">
                  {capmWaccResults.wacc.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Hurdle rate for corporate DCF valuation
                </div>
              </div>
            </div>

            {/* Structure Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Capital Weighting & After-Tax Breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Equity Weight: <strong>{capmWaccResults.we.toFixed(1)}%</strong></span>
                  <span>Debt Weight: <strong>{capmWaccResults.wd.toFixed(1)}%</strong></span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${capmWaccResults.we}%` }} className="bg-blue-500 h-full" />
                  <div style={{ width: `${capmWaccResults.wd}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">After-Tax Cost of Debt:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {capmWaccResults.afterTaxKd.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Equity Risk Premium (ERP):</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {capmWaccResults.erp.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. DUPONT 5-STEP ROE TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dupont' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>5-Step Extended DuPont ROE Decomposition Model</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Net Income (₹ Cr)</label>
                <input
                  type="number"
                  value={dpNetIncome}
                  onChange={(e) => setDpNetIncome(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">EBT (₹ Cr)</label>
                <input
                  type="number"
                  value={dpEbt}
                  onChange={(e) => setDpEbt(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">EBIT (₹ Cr)</label>
                <input
                  type="number"
                  value={dpEbit}
                  onChange={(e) => setDpEbit(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Sales / Revenue (₹ Cr)</label>
                <input
                  type="number"
                  value={dpSales}
                  onChange={(e) => setDpSales(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Total Assets (₹ Cr)</label>
                <input
                  type="number"
                  value={dpAssets}
                  onChange={(e) => setDpAssets(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Equity (₹ Cr)</label>
                <input
                  type="number"
                  value={dpEquity}
                  onChange={(e) => setDpEquity(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* 5 Factors Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">1. Tax Burden</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {dupontResults.taxBurden.toFixed(3)}x
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Net Income / EBT</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">2. Interest Burden</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {dupontResults.interestBurden.toFixed(3)}x
                </div>
                <div className="text-[10px] text-slate-500 mt-1">EBT / EBIT</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">3. Operating Margin</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {dupontResults.ebitMargin.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">EBIT / Sales</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">4. Asset Turnover</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {dupontResults.assetTurnover.toFixed(2)}x
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Sales / Assets</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">5. Leverage Multiplier</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {dupontResults.leverage.toFixed(2)}x
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Assets / Equity</div>
              </div>
            </div>

            {/* Summary ROE comparison */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                  Comprehensive 5-Step ROE
                </span>
                <div className="text-3xl font-black font-mono text-emerald-500 mt-1">
                  {dupontResults.roe5Step.toFixed(2)}%
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
                Deconstructs ROE to isolate whether high returns stem from strong operational margins, efficient asset utilization, or high financial gearing/leverage.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. OPTION STRATEGY PAYOFF VISUALIZER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'payoff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Multi-Leg Strategy Presets</span>
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStrategyPreset('bull-call')}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  strategyPreset === 'bull-call'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Bull Call Spread
              </button>

              <button
                onClick={() => setStrategyPreset('bear-put')}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  strategyPreset === 'bear-put'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Bear Put Spread
              </button>

              <button
                onClick={() => setStrategyPreset('straddle')}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  strategyPreset === 'straddle'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Long Straddle
              </button>

              <button
                onClick={() => setStrategyPreset('iron-condor')}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  strategyPreset === 'iron-condor'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Iron Condor
              </button>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Current Underlying (₹)</label>
              <input
                type="number"
                step="50"
                value={currentUnderlying}
                onChange={(e) => setCurrentUnderlying(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            {/* Legs List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Strategy Legs</span>
              {strategyConfig.legs.map((leg, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                      leg.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                    }`}>
                      {leg.action}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{leg.strike} {leg.type}</span>
                  </div>
                  <span className="font-mono text-slate-400">Prem: ₹{leg.premium}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{strategyConfig.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{strategyConfig.description}</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div>Max Profit: <strong className="text-emerald-500">₹{strategyConfig.maxProfit === Infinity ? 'Unlimited' : strategyConfig.maxProfit}</strong></div>
                <div>Max Loss: <strong className="text-rose-500">₹{strategyConfig.maxLoss}</strong></div>
              </div>
            </div>

            {/* SVG Interactive Payoff Curve */}
            <div className="h-64 w-full relative bg-slate-50 dark:bg-slate-950 rounded-xl p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Zero line */}
                <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="4 4" strokeWidth="1" />

                {/* Plot Payoff line */}
                {(() => {
                  const maxAbs = Math.max(...payoffGraphPoints.map(p => Math.abs(p.pnl)), 400);
                  const pathData = payoffGraphPoints.map((pt, i) => {
                    const x = (i / (payoffGraphPoints.length - 1)) * 500;
                    const y = 100 - (pt.pnl / maxAbs) * 80;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  return (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>₹{(currentUnderlying - 1000).toLocaleString()}</span>
                <span className="text-slate-900 dark:text-white font-bold">ATM ₹{currentUnderlying.toLocaleString()}</span>
                <span>₹{(currentUnderlying + 1000).toLocaleString()}</span>
              </div>
            </div>

            {/* Breakeven Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Breakeven Spot Price(s) at Expiry:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {strategyConfig.breakeven.map(b => `₹${Math.round(b)}`).join(' & ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FinancialCalculatorsView;
