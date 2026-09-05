import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Calendar,
  X
} from 'lucide-react';
import { Goal, AppNavView } from '../../types/schema';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (newGoal: Omit<Goal, 'goal_id'>) => void;
  onToggleGoalStatus: (goalId: number) => void;
  onNavigate: (view: AppNavView) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onToggleGoalStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetDate, setTargetDate] = useState('2026-09-30');
  const [category, setCategory] = useState<'CERTIFICATION' | 'STREAK' | 'SIMULATION' | 'LESSONS'>('CERTIFICATION');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    onAddGoal({
      user_id: 101,
      goal_title: goalTitle,
      target_date: targetDate,
      status: 'IN_PROGRESS',
      current_progress_percent: 10,
      category
    });
    setGoalTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="goals-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Target Milestones & Goals
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40">
              ADAPTIVE TRACKER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Keep your certification targets, daily study streaks, and virtual trading milestones strictly organized.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const isCompleted = goal.status === 'COMPLETED';
          const categoryColors = {
            CERTIFICATION: 'text-amber-800 border-amber-300 bg-amber-50 dark:text-yellow-400 dark:border-yellow-500/30 dark:bg-yellow-500/10',
            STREAK: 'text-amber-800 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10',
            SIMULATION: 'text-emerald-800 border-emerald-300 bg-emerald-50 dark:text-[#00E599] dark:border-[#00E599]/30 dark:bg-[#00E599]/10',
            LESSONS: 'text-cyan-800 border-cyan-300 bg-cyan-50 dark:text-cyan-400 dark:border-cyan-500/30 dark:bg-cyan-500/10'
          };

          return (
            <div
              key={goal.goal_id}
              className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-xs theme-transition ${
                isCompleted 
                  ? 'bg-slate-50 border-slate-200 opacity-80 dark:bg-slate-900/40 dark:border-slate-800' 
                  : 'bg-white border-slate-200 hover:border-pink-300 dark:bg-[#0B0F19] dark:border-slate-800 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[goal.category || 'CERTIFICATION']}`}>
                    {goal.category || 'CERTIFICATION'}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Target: {goal.target_date}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleGoalStatus(goal.goal_id)}
                    className={`mt-0.5 p-1 rounded-xl border transition cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-500 dark:bg-[#00E599] dark:text-slate-950 dark:border-[#00E599]'
                        : 'border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-700 dark:border-slate-700 dark:text-slate-500 dark:hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className={`text-base font-bold leading-snug ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {goal.goal_title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-pink-600 dark:text-[#00E599] font-bold">{goal.current_progress_percent || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 dark:from-[#00E599] dark:to-[#06B6D4] rounded-full transition-all duration-500"
                    style={{ width: `${goal.current_progress_percent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 theme-transition">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Target className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />
                Create New Goal
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">GOAL TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Greeks & Score >80% on Mock 2"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">TARGET DATE</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  >
                    <option value="CERTIFICATION">Certification</option>
                    <option value="STREAK">Streak</option>
                    <option value="SIMULATION">Simulation</option>
                    <option value="LESSONS">Lessons</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
