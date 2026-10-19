import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Target, 
  Sliders, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  BrainCircuit, 
  X,
  Check,
  Calendar as CalendarIcon
} from 'lucide-react';
import { StudyPlan, AppNavView, User } from '../../types/schema';

interface StudyPlansViewProps {
  studyPlans: StudyPlan[];
  currentUser?: User;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export interface CalendarStudyEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  timeSlot?: string;
  title: string;
  type: 'LESSON' | 'MATH' | 'QUIZ' | 'SIMULATION' | 'AI_REVIEW' | 'MOCK_EXAM';
  duration: string;
  targetView: AppNavView;
  module: string;
  isCompleted?: boolean;
}

// Initial NISM Series XV Calendar Schedule mapped across current month
function generateInitialCalendarEvents(): CalendarStudyEvent[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const pad = (n: number) => n.toString().padStart(2, '0');
  const makeDate = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

  return [
    { id: 'ev-1', dateStr: makeDate(1), timeSlot: '09:00 AM', title: 'Ch 1: Intro to Research Analyst Profession', type: 'LESSON', duration: '35 mins', targetView: 'learn', module: 'NISM XV Ch 1' },
    { id: 'ev-2', dateStr: makeDate(3), timeSlot: '10:30 AM', title: 'Ch 2: Securities Market Structure & Intermediaries', type: 'LESSON', duration: '40 mins', targetView: 'learn', module: 'NISM XV Ch 2' },
    { id: 'ev-3', dateStr: makeDate(5), timeSlot: '02:00 PM', title: 'Ch 3: Terminology & Bond Duration Mechanics', type: 'MATH', duration: '45 mins', targetView: 'learn', module: 'NISM XV Ch 3' },
    { id: 'ev-4', dateStr: makeDate(7), timeSlot: '04:00 PM', title: 'Diagnostic Quiz 1: Market Fundamentals', type: 'QUIZ', duration: '20 mins', targetView: 'quizzes', module: 'Checkpoint 1' },
    { id: 'ev-5', dateStr: makeDate(9), timeSlot: '11:00 AM', title: 'Ch 4: Research Fundamentals & Top-Down Flow', type: 'LESSON', duration: '45 mins', targetView: 'learn', module: 'NISM XV Ch 4' },
    { id: 'ev-6', dateStr: makeDate(11), timeSlot: '09:30 AM', title: 'Ch 5: Macroeconomic Indicators & RBI Policies', type: 'LESSON', duration: '50 mins', targetView: 'learn', module: 'NISM XV Ch 5' },
    { id: 'ev-7', dateStr: makeDate(13), timeSlot: '03:00 PM', title: 'Ch 6: Porter 5 Forces & Industry Life Cycles', type: 'LESSON', duration: '50 mins', targetView: 'learn', module: 'NISM XV Ch 6' },
    { id: 'ev-8', dateStr: makeDate(15), timeSlot: '05:00 PM', title: 'Mid-Month Diagnostic Revision & AI Weakness Review', type: 'AI_REVIEW', duration: '30 mins', targetView: 'ai-tutor', module: 'AI Diagnostic' },
    { id: 'ev-9', dateStr: makeDate(17), timeSlot: '10:00 AM', title: 'Ch 7: Business Moats & Corporate Governance', type: 'LESSON', duration: '45 mins', targetView: 'learn', module: 'NISM XV Ch 7' },
    { id: 'ev-10', dateStr: makeDate(19), timeSlot: '02:30 PM', title: 'Ch 8: DuPont 3-Stage ROE & Financial Analysis', type: 'MATH', duration: '60 mins', targetView: 'learn', module: 'NISM XV Ch 8' },
    { id: 'ev-11', dateStr: makeDate(21), timeSlot: '11:00 AM', title: 'Practice Lab: TradingView Valuation & Ratios', type: 'SIMULATION', duration: '45 mins', targetView: 'practice-lab', module: 'Trading Lab' },
    { id: 'ev-12', dateStr: makeDate(23), timeSlot: '09:00 AM', title: 'Ch 9: Corporate Actions, Splits, Bonus & TERP', type: 'LESSON', duration: '40 mins', targetView: 'learn', module: 'NISM XV Ch 9' },
    { id: 'ev-13', dateStr: makeDate(25), timeSlot: '03:30 PM', title: 'Ch 10: DCF, WACC & Relative Valuation', type: 'MATH', duration: '65 mins', targetView: 'calculators', module: 'NISM XV Ch 10' },
    { id: 'ev-14', dateStr: makeDate(27), timeSlot: '10:00 AM', title: 'Ch 14: SEBI RA 2014 & Code of Conduct', type: 'LESSON', duration: '55 mins', targetView: 'learn', module: 'NISM XV Ch 14' },
    { id: 'ev-15', dateStr: makeDate(29), timeSlot: '02:00 PM', title: 'Ch 15: Technical Analysis Patterns & Indicators', type: 'LESSON', duration: '60 mins', targetView: 'learn', module: 'NISM XV Ch 15' },
    { id: 'ev-16', dateStr: makeDate(30), timeSlot: '06:00 PM', title: 'Official Full Mock Examination (100 Marks, 120 Mins)', type: 'MOCK_EXAM', duration: '120 mins', targetView: 'mock-exams', module: '100M Final Mock' }
  ];
}

export const StudyPlansView: React.FC<StudyPlansViewProps> = ({
  studyPlans,
  currentUser,
  onNavigate
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');

  // Persistence Key
  const storageKey = currentUser ? `financex_google_calendar_events_${currentUser.user_id}` : 'financex_google_calendar_events_guest';

  const [events, setEvents] = useState<CalendarStudyEvent[]>(() => {
    if (typeof window === 'undefined') return generateInitialCalendarEvents();
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : generateInitialCalendarEvents();
    } catch {
      return generateInitialCalendarEvents();
    }
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch {}
  }, [events, storageKey]);

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarStudyEvent | null>(null);
  
  // Create event modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'LESSON' | 'MATH' | 'QUIZ' | 'SIMULATION' | 'AI_REVIEW' | 'MOCK_EXAM'>('LESSON');
  const [newEventDuration, setNewEventDuration] = useState('45 mins');
  const [newEventTimeSlot, setNewEventTimeSlot] = useState('10:00 AM');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle completion
  const handleToggleComplete = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, isCompleted: !ev.isCompleted } : ev))
    );
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, isCompleted: !prev.isCompleted } : null));
    }
  };

  // Add event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    let targetView: AppNavView = 'learn';
    if (newEventType === 'QUIZ') targetView = 'quizzes';
    else if (newEventType === 'MOCK_EXAM') targetView = 'mock-exams';
    else if (newEventType === 'SIMULATION') targetView = 'practice-lab';
    else if (newEventType === 'AI_REVIEW') targetView = 'ai-tutor';
    else if (newEventType === 'MATH') targetView = 'calculators';

    const newEv: CalendarStudyEvent = {
      id: 'custom-' + Date.now(),
      dateStr: newEventDate,
      timeSlot: newEventTimeSlot,
      title: newEventTitle,
      type: newEventType,
      duration: newEventDuration,
      targetView,
      module: 'Custom Session',
      isCompleted: false
    };

    setEvents((prev) => [...prev, newEv]);
    setIsAddModalOpen(false);
    setNewEventTitle('');
  };

  // Calculate Month Grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  // Convert so Monday is index 0
  const startCol = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Progress stats
  const totalEvents = events.length;
  const completedEvents = events.filter((e) => e.isCompleted).length;
  const progressPercent = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  // Color helper for badges
  const getTypeBadgeStyle = (type: CalendarStudyEvent['type']) => {
    switch (type) {
      case 'LESSON':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
      case 'MATH':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-[#00E599] border-emerald-300 dark:border-emerald-500/30';
      case 'QUIZ':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
      case 'MOCK_EXAM':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/30 font-bold';
      case 'SIMULATION':
        return 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30';
      case 'AI_REVIEW':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const getEventDotColor = (type: CalendarStudyEvent['type']) => {
    switch (type) {
      case 'LESSON': return 'bg-blue-500';
      case 'MATH': return 'bg-emerald-500';
      case 'QUIZ': return 'bg-amber-500';
      case 'MOCK_EXAM': return 'bg-rose-500';
      case 'SIMULATION': return 'bg-cyan-500';
      case 'AI_REVIEW': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`;

  return (
    <div className="space-y-6" id="study-plans-view">
      {/* Google Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
        {/* Left: Branding & Month Navigator */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{monthNames[month]} {year}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NISM Series XV Certification Study Calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-0 sm:ml-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Previous Month"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 select-none">
              {monthNames[month].slice(0, 3)}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Next Month"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to current month pill when viewed month is different */}
          {(month !== new Date().getMonth() || year !== new Date().getFullYear()) && (
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition cursor-pointer"
            >
              Jump to Current Date
            </button>
          )}
        </div>

        {/* Right: Actions, View Toggle & Progress */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Progress pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Tracked:</span>
            <span className="font-bold text-emerald-600 dark:text-[#00E599]">{completedEvents}/{totalEvents} Done ({progressPercent}%)</span>
          </div>

          {/* Add Study Session CTA */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Session</span>
          </button>
        </div>
      </div>

      {/* Main Google Calendar Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm theme-transition">
        {/* Day Header Row (Mon to Sun) */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-center text-xs font-bold text-slate-600 dark:text-slate-400 font-mono py-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* 7-Column Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Previous month trailing days */}
          {Array.from({ length: startCol }).map((_, i) => {
            const prevDateNum = daysInPrevMonth - startCol + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 bg-slate-50/40 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600 select-none"
              >
                <span className="text-xs font-mono font-medium opacity-60">{prevDateNum}</span>
              </div>
            );
          })}

          {/* Current Month Active Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateNum = i + 1;
            const dateStr = `${year}-${pad(month + 1)}-${pad(dateNum)}`;
            const isToday = dateStr === todayStr;
            const dayEvents = events.filter((e) => e.dateStr === dateStr);

            return (
              <div
                key={`current-${dateNum}`}
                onClick={() => {
                  setNewEventDate(dateStr);
                  setIsAddModalOpen(true);
                }}
                className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition group flex flex-col justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 cursor-pointer ${
                  isToday ? 'bg-amber-50/30 dark:bg-amber-500/5' : ''
                }`}
              >
                {/* Cell Top Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-mono font-bold ${
                      isToday
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dateNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {dayEvents.filter(e => e.isCompleted).length}/{dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Chips List */}
                <div className="space-y-1 my-1 flex-1 overflow-hidden">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                      className={`px-2 py-1 rounded-lg border text-[11px] leading-tight flex items-center justify-between gap-1 transition ${
                        ev.isCompleted
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                          : getTypeBadgeStyle(ev.type)
                      }`}
                      title={ev.title}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getEventDotColor(ev.type)}`} />
                        <span className="truncate font-semibold">{ev.title}</span>
                      </div>
                      {ev.isCompleted && (
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Add hint on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-400 text-right">
                  + Add
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getTypeBadgeStyle(selectedEvent.type)}`}>
                  {selectedEvent.type} • {selectedEvent.module}
                </span>
                <h3 className={`text-base font-bold ${selectedEvent.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.dateStr}</span>
              </div>
              {selectedEvent.timeSlot && (
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Scheduled Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.timeSlot}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.duration}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Status:</span>
                <span className={`font-bold ${selectedEvent.isCompleted ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {selectedEvent.isCompleted ? 'Completed ✓' : 'Pending Study'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleToggleComplete(selectedEvent.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedEvent.isCompleted
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedEvent.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedEvent(null);
                  onNavigate(selectedEvent.targetView);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF5722]/20"
              >
                <span>Launch Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Study Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateEvent}
            className="w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5722]" />
                <span>Add Study Calendar Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Session Title / Syllabus Chapter
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 8: DuPont Analysis & Financial Statements"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={newEventTimeSlot}
                  onChange={(e) => setNewEventTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Session Type
                </label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="LESSON">Chapter Lesson</option>
                  <option value="MATH">Formulas & Ratios</option>
                  <option value="QUIZ">Topic Quiz</option>
                  <option value="MOCK_EXAM">Mock Examination</option>
                  <option value="SIMULATION">Trading Lab</option>
                  <option value="AI_REVIEW">AI Tutor Review</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Duration
                </label>
                <select
                  value={newEventDuration}
                  onChange={(e) => setNewEventDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="30 mins">30 mins</option>
                  <option value="45 mins">45 mins</option>
                  <option value="60 mins">60 mins</option>
                  <option value="90 mins">90 mins</option>
                  <option value="120 mins">120 mins (Full Mock)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold transition shadow-md shadow-[#FF5722]/20"
              >
                Schedule Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
