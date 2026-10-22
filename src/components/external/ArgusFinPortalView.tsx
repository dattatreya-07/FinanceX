import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  Activity, 
  BarChart3, 
  Cpu, 
  TrendingUp, 
  Layers,
  Zap,
  Sparkles,
  ArrowUpRight,
  PieChart,
  Sliders,
  Database,
  Lock,
  Scale,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface ArgusFinPortalViewProps {
  onNavigate: (view: AppNavView) => void;
}

export const ArgusFinPortalView: React.FC<ArgusFinPortalViewProps> = ({ onNavigate }) => {
  const argusUrl = 'https://argus-fin-orcin.vercel.app/en';

  const openInNewTab = () => {
    window.open(argusUrl, '_blank', 'noopener,noreferrer');
  };

  const corePillars = [
    {
      id: 'risk-analytics',
      title: 'Institutional Risk & VaR Analytics',
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      badge: 'QUANT ENGINE',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
      description: 'Parametric and historical Value at Risk (VaR) computed across 95% and 99% confidence intervals with Expected Shortfall (CVaR).',
      features: [
        '10,000-path Monte Carlo stress testing',
        'Historical tail risk & drawdown simulation',
        'Multi-asset portfolio beta & correlation matrix',
        'Liquidity-adjusted risk forecasting (L-VaR)'
      ]
    },
    {
      id: 'derivatives-greeks',
      title: 'Advanced Derivatives & Volatility Surfaces',
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      badge: 'MARKET DYNAMICS',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
      description: 'Real-time multi-strike Implied Volatility (IV) smile generation, term structure modeling, and continuous Option Greeks computation.',
      features: [
        'Real-time Black-Scholes & Binomial pricing',
        'Partial Greeks sensitivity: Δ, Γ, Θ, ν, ρ',
        'Multi-leg strategy payoff optimizer (Condors/Spreads)',
        'SPAN margin utilization & margin call forecasting'
      ]
    },
    {
      id: 'algorithmic-screening',
      title: 'Algorithmic Screening & Factor Models',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      badge: 'AI & SYSTEMATIC',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
      description: 'Systematic multi-factor equity screening leveraging Momentum, Value, Quality, and Low Volatility factors with forensic accounting.',
      features: [
        'DuPont 5-step ROE decomposition engine',
        'Beneish M-Score & Altman Z-Score forensic checks',
        'Momentum & Mean-Reversion statistical arbitrage',
        'Institutional order-flow & block deal tracker'
      ]
    },
    {
      id: 'regulatory-governance',
      title: 'Regulatory Grade Audit & Governance',
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      badge: 'COMPLIANCE',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30',
      description: 'Enterprise-grade compliance framework built for SEBI Research Analyst (RA) and Investment Adviser (RIA) statutory mandates.',
      features: [
        'Deterministic SHA-256 report verification checksums',
        'Immutable audit trails for recommendation rationale',
        'Multi-tenant institutional portfolio partitioning',
        'Automated SEBI statutory disclosure generation'
      ]
    }
  ];

  const synergyMatrix = [
    {
      aspect: 'Core Purpose',
      financex: 'Pedagogical Mastery & Certification Preparation (NISM/NCFM)',
      argusfin: 'Institutional Analytics, Risk Modeling & Execution Intelligence'
    },
    {
      aspect: 'Target Persona',
      financex: 'University students, research analyst trainees, retail learners',
      argusfin: 'Portfolio managers, quant quants, hedge funds, institutional desks'
    },
    {
      aspect: 'Execution Mode',
      financex: 'Simulated Paper Trading Lab (₹10,00,000 virtual capital)',
      argusfin: 'Live market telemetry, quantitative scanner & live strategy backtesting'
    },
    {
      aspect: 'Cognitive Engine',
      financex: 'Grounded RAG AI Tutor (Bilingual Tamil & English coaching)',
      argusfin: 'Multi-factor quantitative risk models & predictive volatility algorithms'
    },
    {
      aspect: 'Regulatory Scope',
      financex: 'NISM Series VIII & XV examination syllabus mastery',
      argusfin: 'SEBI RA/RIA statutory institutional compliance & audit reporting'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Top Navigation & Header Card (Kept intact as requested) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#032B25] via-[#064E3B] to-[#047857] p-6 text-white border border-amber-300/30 shadow-[0_12px_36px_rgba(4,120,87,0.25)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 text-xs font-mono text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
              <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold uppercase">
                Integrated Ecosystem Partner
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-md">
                <Globe className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight flex items-center gap-2">
                  <span>Argus Fin</span>
                  <span className="text-xs font-mono text-emerald-300 bg-white/15 px-2 py-0.5 rounded-md border border-white/20">
                    Live Platform
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                  Institutional financial analytics, risk forecasting, algorithmic modeling, and quantitative intelligence platform.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition transform active:scale-95 cursor-pointer border border-amber-200"
            >
              <span>Launch Argus Fin Platform</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center gap-2.5 text-xs text-white/90">
            <Activity className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Real-time Risk Metrics</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-white/90">
            <BarChart3 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Derivative Portfolio Feeds</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-white/90">
            <Cpu className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>AI Predictive Modeling</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-white/90">
            <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
            <span>Regulatory Grade Security</span>
          </div>
        </div>
      </div>

      {/* 2. Executive Overview: What is Argus Fin & Why it Powers the Ecosystem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ecosystem Overview
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
            The Institutional Intelligence Layer of the FinanceX Ecosystem
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            While <strong className="text-emerald-600 dark:text-emerald-400">FinanceX</strong> serves as your core learning, certification, and training terminal, <strong className="text-amber-500">Argus Fin</strong> is the enterprise-grade execution and quantitative intelligence suite. Designed for research analysts, portfolio managers, and institutional desks, Argus Fin transforms theoretical financial formulas into live market telemetry and predictive risk forecasts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">10,000+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Monte Carlo Simulations</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">&lt;15ms</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Calculation Latency</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40">
              <div className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">100%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">SEBI Audit Traceable</div>
            </div>
          </div>
        </div>

        {/* Quick Launch Card */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1526] to-[#042820] text-white border border-emerald-500/30 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Direct Cloud Gateway
              </span>
              <Globe className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <h3 className="text-lg font-bold">Access Live Terminal</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Launch Argus Fin in a secure, full-viewport session to access live algorithmic screeners, 3D volatility surfaces, and institutional portfolio tools.
            </p>
          </div>

          <div className="pt-6 space-y-2.5">
            <button
              onClick={openInNewTab}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              <span>Open Argus Fin Terminal</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-[11px] font-mono text-center text-slate-400 truncate">
              Hosted at: <span className="text-emerald-300">{argusUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Pillars & Capabilities of Argus Fin */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
            Core Quantitative Capabilities of Argus Fin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Four specialized engines built to power professional institutional research and risk forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {corePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {pillar.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {pillar.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Synergy Matrix: FinanceX vs Argus Fin */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ecosystem Alignment
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
            Synergy Matrix: FinanceX vs. Argus Fin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How the educational and professional platforms seamlessly integrate into a unified learning-to-execution pipeline.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-mono">
                <th className="py-3 px-4 font-bold">DIMENSION</th>
                <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">FINANCEX (TRAINING)</th>
                <th className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">ARGUS FIN (ANALYTICS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {synergyMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono">{row.aspect}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.financex}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">{row.argusfin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Call to Action Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#032B25] via-[#044E3B] to-[#047857] text-white border border-amber-300/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
            Ready to explore institutional tools?
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight">
            Seamlessly Transition from Theory to Real-World Modeling
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Master your NISM Series VIII and XV curriculum here in FinanceX, then test your quantitative formulas on the live Argus Fin platform.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
          <button
            onClick={openInNewTab}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer border border-amber-200"
          >
            <span>Launch Argus Fin</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
