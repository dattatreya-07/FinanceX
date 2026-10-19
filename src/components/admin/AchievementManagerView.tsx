import React, { useState } from 'react';
import { Sparkles, Plus, Edit3, Trash2, Award, Flame, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Achievement } from '../../types/schema';

interface AchievementManagerViewProps {
  achievements: Achievement[];
  onSaveAchievement: (ach: Achievement) => void;
  onDeleteAchievement: (achId: number) => void;
}

export const AchievementManagerView: React.FC<AchievementManagerViewProps> = ({
  achievements,
  onSaveAchievement,
  onDeleteAchievement
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'STREAK' | 'LEARNING' | 'TRADING' | 'EXAM' | 'COMMUNITY'>('LEARNING');
  const [xpReward, setXpReward] = useState(150);

  const openCreateModal = () => {
    setEditingAch(null);
    setName('');
    setDescription('');
    setCategory('LEARNING');
    setXpReward(150);
    setIsModalOpen(true);
  };

  const openEditModal = (a: Achievement) => {
    setEditingAch(a);
    setName(a.achievement_name);
    setDescription(a.description);
    setCategory(a.category || 'LEARNING');
    setXpReward(a.xp_reward || 100);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Achievement = {
      achievement_id: editingAch ? editingAch.achievement_id : Date.now(),
      achievement_name: name.trim(),
      description: description.trim(),
      category,
      xp_reward: Number(xpReward)
    };

    onSaveAchievement(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="achievement-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Gamification & Achievement Badges
          </h1>
          <p className="text-xs text-slate-500">
            Define XP incentives tied to real student milestones (lessons completed, streak targets, NISM pass marks).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Badge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => (
          <div
            key={ach.achievement_id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 dark:bg-[#00E599]/20 dark:text-[#00E599]">
                  {ach.category || 'LEARNING'}
                </span>
                <span className="text-xs font-mono font-bold text-pink-600 dark:text-[#00E599]">
                  +{ach.xp_reward || 100} XP
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {ach.achievement_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => openEditModal(ach)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Badge</span>
              </button>

              <button
                onClick={() => onDeleteAchievement(ach.achievement_id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {editingAch ? 'Edit Achievement' : 'Create New Badge'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SPAN Margin Master"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Condition Description *</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trigger condition when student scores > 90% in derivatives assessment..."
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="LEARNING">Learning</option>
                    <option value="STREAK">Streak</option>
                    <option value="TRADING">Trading</option>
                    <option value="EXAM">Exam</option>
                    <option value="COMMUNITY">Community</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">XP Points</label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
