import React, { useState } from 'react';
import { 
  Flame, 
  BrainCircuit, 
  TrendingUp, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  Coins, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Achievement, UserAchievement, AppNavView } from '../../types/schema';

interface AchievementsViewProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  onNavigate: (view: AppNavView) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  userAchievements
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const earnedMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua.earned_at]));

  const iconMap: Record<string, React.ReactNode> = {
    Flame: <Flame className="w-6 h-6 text-amber-500" />,
    BrainCircuit: <BrainCircuit className="w-6 h-6 text-pink-600 dark:text-[#FF2E7E]" />,
    TrendingUp: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-[#00E599]" />,
    Award: <Award className="w-6 h-6 text-amber-500 dark:text-yellow-400" />,
    MessageSquareCheck: <MessageSquare className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
    MessageSquare: <MessageSquare className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    Coins: <Coins className="w-6 h-6 text-amber-600 dark:text-amber-300" />,
    Zap: <Zap className="w-6 h-6 text-amber-500 dark:text-yellow-400" />
  };

  const filteredAchievements = selectedCategory === 'ALL'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const totalEarned = userAchievements.length;
  const totalXP = achievements
    .filter(a => earnedMap.has(a.achievement_id))
    .reduce((sum, a) => sum + (a.xp_reward || 0), 0);

  return (
    <div className="space-y-6" id="achievements-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Achievements & Badges
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-amber-200 dark:border-yellow-500/40">
              {totalEarned} / {achievements.length} UNLOCKED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Unlock distinguished badges across continuous study streaks, market simulations, and NISM examination mastery.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
              <strong className="text-emerald-600 dark:text-[#00E599]">{totalXP}</strong> XP Earned
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'STREAK', 'LEARNING', 'TRADING', 'EXAM', 'COMMUNITY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF2E7E] text-white dark:bg-[#00E599] dark:text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAchievements.map((item) => {
          const isUnlocked = earnedMap.has(item.achievement_id);
          const earnedDate = earnedMap.get(item.achievement_id);

          return (
            <div
              key={item.achievement_id}
              className={`p-5 rounded-3xl border transition relative flex flex-col justify-between space-y-4 shadow-xs theme-transition ${
                isUnlocked
                  ? 'bg-white border-pink-200 dark:bg-gradient-to-b dark:from-[#0F172A] dark:to-[#0A0D15] dark:border-[#00E599]/30'
                  : 'bg-slate-50 border-slate-200 opacity-60 dark:bg-[#080B12]/80 dark:border-slate-800/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isUnlocked 
                      ? 'bg-pink-50 border-pink-200 dark:bg-slate-800/90 dark:border-[#00E599]/40' 
                      : 'bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                  }`}>
                    {isUnlocked ? (iconMap[item.icon_name || 'Award'] || <Award className="w-6 h-6 text-amber-500" />) : <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" />}
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-slate-900 text-amber-700 dark:text-yellow-400 border border-amber-200 dark:border-slate-800">
                    +{item.xp_reward || 100} XP
                  </span>
                </div>

                <div>
                  <h3 className={`text-sm font-bold ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.achievement_name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                {isUnlocked ? (
                  <span className="text-emerald-600 dark:text-[#00E599] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked on {earnedDate}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked — Complete criteria
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
