import React, { useState } from 'react';
import { 
  Bell, 
  TrendingUp, 
  RotateCcw, 
  Save, 
  Sparkles
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface SettingsViewProps {
  onResetPaperPortfolio: () => void;
  onNavigate: (view: AppNavView) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetPaperPortfolio
}) => {
  const [streakReminders, setStreakReminders] = useState(true);
  const [examCountdownAlerts, setExamCountdownAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [forumEmailNotifs, setForumEmailNotifs] = useState(false);
  const [paperCurrency, setPaperCurrency] = useState<'INR' | 'USD'>('INR');
  const [defaultSlippage, setDefaultSlippage] = useState<string>('0.05%');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="settings-view">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
            Account & System Preferences
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            CONFIG ENGINE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure notification thresholds, paper trading parameters, and personalized study pacing.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Paper Trading Simulation Config */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
          <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-[#00E599]" />
            <span>Practice Lab Simulation Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">TRADING CURRENCY</label>
              <select
                value={paperCurrency}
                onChange={(e) => setPaperCurrency(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
              >
                <option value="INR">INR (₹ - Indian Rupee / NSE / BSE)</option>
                <option value="USD">USD ($ - US Dollar / NYSE / Nasdaq)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">SIMULATED EXECUTION SLIPPAGE</label>
              <select
                value={defaultSlippage}
                onChange={(e) => setDefaultSlippage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
              >
                <option value="0.00%">0.00% (Zero Friction)</option>
                <option value="0.05%">0.05% (Institutional High Liquidity)</option>
                <option value="0.15%">0.15% (Retail Mid-Cap Spread)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Reset virtual capital back to default ₹10,00,000.00 and clear simulated order history.
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset your simulated portfolio to ₹10,00,000?')) {
                  onResetPaperPortfolio();
                  alert('Portfolio reset successfully.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Portfolio</span>
            </button>
          </div>
        </div>

        {/* Notifications & AI Pacing */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
          <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Notification & AI Tutor Alerts</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Daily Streak Preservation Alert (SMS / Web Notification)', state: streakReminders, setter: setStreakReminders, desc: 'Notifies at 8:00 PM if no daily quiz or lesson is logged.' },
              { label: 'Regulatory Mock Exam Countdown Reminders', state: examCountdownAlerts, setter: setExamCountdownAlerts, desc: 'Weekly milestone reminders for targeted NISM exam dates.' },
              { label: 'AI Tutor Adaptive Weak-Area Recommendations', state: aiSuggestions, setter: setAiSuggestions, desc: 'Smart prompts suggesting revision for topics with <70% quiz accuracy.' },
              { label: 'Community Discussion Upvote & Reply Alerts', state: forumEmailNotifs, setter: setForumEmailNotifs, desc: 'Notifies when someone answers your posted questions.' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.label}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={item.state}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 dark:text-[#00E599] focus:ring-pink-500 dark:focus:ring-[#00E599] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#00E599] flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-4 h-4" />
              Preferences saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes take effect immediately across all sessions.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
