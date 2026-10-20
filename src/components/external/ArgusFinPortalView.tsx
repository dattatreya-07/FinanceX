import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  Activity, 
  BarChart3, 
  Cpu, 
  TrendingUp, 
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface ArgusFinPortalViewProps {
  onNavigate: (view: AppNavView) => void;
}

export const ArgusFinPortalView: React.FC<ArgusFinPortalViewProps> = ({ onNavigate }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const argusUrl = 'https://argus-fin-orcin.vercel.app/en';

  const openInNewTab = () => {
    window.open(argusUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-[#07090E] p-4 overflow-hidden' : ''}`}>
      {/* Top Navigation & Header Card */}
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition transform active:scale-95 cursor-pointer"
            >
              <span>Launch Full Platform</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}</span>
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

      {/* Embedded Live Web Experience / Iframe */}
      <div className={`rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col ${isFullscreen ? 'h-[calc(100vh-230px)]' : 'h-[750px]'}`}>
        {/* Browser-like Toolbar */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-lg truncate">
            <span className="flex gap-1.5 items-center mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-mono flex-1 truncate">
              <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">{argusUrl}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIframeLoaded(false);
                const iframe = document.getElementById('argus-iframe') as HTMLIFrameElement;
                if (iframe) iframe.src = argusUrl;
              }}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Reload Frame"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={openInNewTab}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="relative flex-1 w-full h-full bg-slate-950">
          {!iframeLoaded && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090E] text-white z-10 gap-3">
              <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-xs font-mono text-emerald-300">Connecting to Argus Fin Secure Gateway...</p>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#07090E] text-white z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">Argus Fin Embedded Gateway</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Some third-party browsers restrict iframe embedding due to X-Frame-Options or Cross-Origin policies. You can launch the platform directly:
              </p>
              <button
                onClick={openInNewTab}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition cursor-pointer"
              >
                Open Argus Fin in New Tab
              </button>
            </div>
          ) : (
            <iframe
              id="argus-iframe"
              src={argusUrl}
              title="Argus Fin Platform"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          )}
        </div>
      </div>
    </div>
  );
};
