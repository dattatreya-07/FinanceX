import React, { useState } from 'react';
import { 
  Bell, 
  Flame, 
  Award, 
  BrainCircuit, 
  Clock, 
  MessageSquare, 
  CheckCheck, 
  CheckCircle2
} from 'lucide-react';
import { Notification, AppNavView } from '../../types/schema';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: number) => void;
  onNavigate: (view: AppNavView) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const iconMap: Record<string, React.ReactNode> = {
    STREAK_WARNING: <Flame className="w-5 h-5 text-amber-500" />,
    ACHIEVEMENT_UNLOCKED: <Award className="w-5 h-5 text-amber-500 dark:text-yellow-400" />,
    AI_SUGGESTION: <BrainCircuit className="w-5 h-5 text-pink-600 dark:text-[#FF2E7E]" />,
    EXAM_REMINDER: <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    COMMUNITY_REPLY: <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-[#00E599]" />
  };

  const filtered = filterType === 'ALL'
    ? notifications
    : filterType === 'UNREAD'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6" id="notifications-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF2E7E] text-white">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time streak alerts, examination countdowns, AI study recommendations, and community interaction.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'UNREAD', 'STREAK_WARNING', 'ACHIEVEMENT_UNLOCKED', 'AI_SUGGESTION', 'EXAM_REMINDER'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap cursor-pointer ${
              filterType === t
                ? 'bg-[#FF2E7E] text-white dark:bg-[#00E599] dark:text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.notification_id}
            onClick={() => onToggleRead(item.notification_id)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 shadow-xs theme-transition ${
              !item.read
                ? 'bg-white border-pink-200 hover:border-pink-300 dark:bg-[#0E1524] dark:border-[#00E599]/30 dark:hover:border-[#00E599]/50'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800/80 dark:hover:border-slate-700 opacity-75'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 border ${
              !item.read ? 'bg-pink-50 border-pink-100 dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
            }`}>
              {iconMap[item.type] || <Bell className="w-5 h-5 text-slate-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm font-bold truncate ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.title}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {item.created_at}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>

            <div className="shrink-0 pt-1">
              {!item.read ? (
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF2E7E] dark:bg-[#00E599] animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-slate-400 dark:text-slate-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
