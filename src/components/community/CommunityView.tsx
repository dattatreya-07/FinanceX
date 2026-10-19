import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Send, 
  Search, 
  Plus, 
  X,
  User as UserIcon,
  ShieldCheck,
  Award
} from 'lucide-react';
import { DiscussionThread, DiscussionReply, AppNavView, User } from '../../types/schema';
import { PublicProfileModal, PublicProfileData } from '../profile/PublicProfileModal';

interface CommunityViewProps {
  threads: DiscussionThread[];
  replies: DiscussionReply[];
  currentUser?: User;
  onNavigate: (view: AppNavView) => void;
}

const STORAGE_THREADS_KEY = 'financex_persistent_community_threads';
const STORAGE_REPLIES_KEY = 'financex_persistent_community_replies';
const STORAGE_LIKES_KEY = 'financex_persistent_community_likes';

// Realistic pre-seeded institutional NISM community threads
const DEFAULT_PERSISTENT_THREADS: DiscussionThread[] = [
  {
    thread_id: 101,
    user_id: 1,
    topic_id: 1,
    title: 'How to calculate Modified Duration when bond coupons are semi-annual (NISM Series XV Ch 3)?',
    content: 'In NISM Series XV Chapter 3 and Fixed Income examinations, the formula for Modified Duration is Macaulay Duration / (1 + YTM/n). Can someone clarify whether we divide YTM by 2 when coupon frequency is semi-annual? Does the percentage price change formula use clean or dirty price?',
    tags: ['NISM_SERIES_XV', 'BOND_VALUATION'],
    upvotes_count: 14,
    replies_count: 2,
    is_solved: true,
    created_at: '2 hours ago'
  },
  {
    thread_id: 102,
    user_id: 2,
    topic_id: 8,
    title: 'Interpreting 3-Stage vs 5-Stage DuPont ROE: What if Net Margin drops but ROE increases?',
    content: 'During financial statement analysis for auto companies, what are the primary red flags if a company reports an increase in Return on Equity from 18% to 24%, but DuPont breakdown reveals Net Margin fell from 12% to 7% while Financial Leverage increased from 1.5x to 3.4x?',
    tags: ['DUPONT_ANALYSIS', 'FINANCIAL_RATIOS'],
    upvotes_count: 28,
    replies_count: 3,
    is_solved: true,
    created_at: '5 hours ago'
  },
  {
    thread_id: 103,
    user_id: 3,
    topic_id: 14,
    title: 'SEBI (Research Analysts) Regulations, 2014: Personal trading restrictions (30-day vs 5-day rule)',
    content: 'Can someone summarize the exact statutory prohibition periods under Regulation 16? If an analyst covers TCS and is writing an earnings update note, can they sell their personal holdings during the blackout period?',
    tags: ['SEBI_REGULATIONS', 'COMPLIANCE'],
    upvotes_count: 19,
    replies_count: 1,
    is_solved: false,
    created_at: 'Yesterday'
  }
];

const DEFAULT_PERSISTENT_REPLIES: DiscussionReply[] = [
  {
    reply_id: 201,
    thread_id: 101,
    user_id: 2,
    content: 'Yes, exactly! If the bond pays semi-annual coupons, n = 2. So if YTM is 7.0%, the denominator is (1 + 0.07 / 2) = 1.035. The percentage price change is -Modified Duration * Delta YTM. In market trade settlement, the full invoice price is the Dirty Price (Clean Price + Accrued Interest).',
    upvotes: 9,
    is_accepted_answer: true,
    created_at: '1 hour ago'
  },
  {
    reply_id: 202,
    thread_id: 102,
    user_id: 1,
    content: 'That is a textbook corporate leverage red flag! In DuPont analysis, ROE = Net Margin * Asset Turnover * Leverage. If margin collapses from 12% to 7%, operating efficiency is deteriorating. The ROE rise was manufactured entirely by piling on debt (Leverage Multiplier jumping to 3.4x). In an economic downturn, high debt service could cause insolvency.',
    upvotes: 18,
    is_accepted_answer: true,
    created_at: '3 hours ago'
  },
  {
    reply_id: 203,
    thread_id: 103,
    user_id: 2,
    content: 'Under Regulation 16 of SEBI (Research Analysts) Regulations, 2014: An analyst cannot trade in the subject company within 30 days prior to publishing the report, and cannot trade within 5 days after publication. Personal trading contrary to recommendation is strictly prohibited except in dire personal emergencies with prior Compliance Officer approval.',
    upvotes: 12,
    is_accepted_answer: true,
    created_at: '18 hours ago'
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({
  threads,
  replies,
  currentUser,
  onNavigate
}) => {
  // Load persistent threads
  const [threadList, setThreadList] = useState<DiscussionThread[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_PERSISTENT_THREADS;
    try {
      const saved = localStorage.getItem(STORAGE_THREADS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PERSISTENT_THREADS;
    } catch {
      return DEFAULT_PERSISTENT_THREADS;
    }
  });

  // Load persistent replies
  const [replyList, setReplyList] = useState<DiscussionReply[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_PERSISTENT_REPLIES;
    try {
      const saved = localStorage.getItem(STORAGE_REPLIES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PERSISTENT_REPLIES;
    } catch {
      return DEFAULT_PERSISTENT_REPLIES;
    }
  });

  // Track likes per user per thread (Item 14: 1-like-per-user enforcement)
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedThread, setSelectedThread] = useState<DiscussionThread>(threadList[0] || DEFAULT_PERSISTENT_THREADS[0]);
  const [newReplyText, setNewReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('NISM_SERIES_XV');

  // Public Profile Modal State (Item 16)
  const [selectedUserProfile, setSelectedUserProfile] = useState<PublicProfileData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Save changes to localStorage for cross-account persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THREADS_KEY, JSON.stringify(threadList));
    } catch {}
  }, [threadList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPLIES_KEY, JSON.stringify(replyList));
    } catch {}
  }, [replyList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(userLikes));
    } catch {}
  }, [userLikes]);

  const currentUserId = currentUser ? currentUser.email || currentUser.user_id : 'guest_learner';

  const filteredThreads = threadList.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReplies = replyList.filter((r) => r.thread_id === selectedThread.thread_id);

  // Single-like toggle enforcement (Item 14)
  const handleToggleLikeThread = (threadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const likeKey = `${currentUserId}_thread_${threadId}`;
    const alreadyLiked = !!userLikes[likeKey];

    const delta = alreadyLiked ? -1 : 1;

    setThreadList((prev) =>
      prev.map((t) =>
        t.thread_id === threadId ? { ...t, upvotes_count: Math.max(0, (t.upvotes_count || 0) + delta) } : t
      )
    );

    if (selectedThread.thread_id === threadId) {
      setSelectedThread((prev) => ({
        ...prev,
        upvotes_count: Math.max(0, (prev.upvotes_count || 0) + delta)
      }));
    }

    setUserLikes((prev) => ({
      ...prev,
      [likeKey]: !alreadyLiked
    }));
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    const newReply: DiscussionReply = {
      reply_id: Date.now(),
      thread_id: selectedThread.thread_id,
      user_id: (currentUser?.user_id as any) || 101,
      content: newReplyText.trim(),
      upvotes: 0,
      is_accepted_answer: false,
      created_at: 'Just now'
    };

    setReplyList((prev) => [...prev, newReply]);
    setNewReplyText('');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newThread: DiscussionThread = {
      thread_id: Date.now(),
      user_id: (currentUser?.user_id as any) || 101,
      topic_id: 1,
      tags: [newQuestionTag],
      title: newQuestionTitle.trim(),
      content: newQuestionBody.trim(),
      upvotes_count: 1,
      replies_count: 0,
      is_solved: false,
      created_at: 'Just now'
    };

    // Auto-like own created thread
    const likeKey = `${currentUserId}_thread_${newThread.thread_id}`;
    setUserLikes((prev) => ({ ...prev, [likeKey]: true }));

    setThreadList((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
    setIsAskModalOpen(false);
    setNewQuestionTitle('');
    setNewQuestionBody('');
  };

  // Open profile modal helper (Item 16)
  const openAuthorProfile = (name: string, role: string, org: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedUserProfile({
      user_id: name.toLowerCase().replace(/\s+/g, '-'),
      full_name: name,
      headline: `${role} | NISM Series XV Research Analyst Candidate`,
      organization: org,
      location: 'Mumbai, Maharashtra, India',
      bio: `Active FinanceX community contributor analyzing Indian capital markets, DCF intrinsic valuation models, and SEBI RA regulations.`,
      xp_points: 1250,
      current_streak: 7,
      accuracy: '94%'
    });
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6" id="community-view">
      {/* LinkedIn-style Public Profile Modal */}
      <PublicProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={selectedUserProfile}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
              Learner Community & Doubt Clearing
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00E599] border border-emerald-200 dark:border-emerald-500/30">
              LIVE & VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real peer discussions, NISM Series XV formula doubts, and valuation case analyses persistent across all accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#FF5722]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Start Discussion Thread</span>
        </button>
      </div>

      {/* Main Grid: Threads List & Active Thread View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Threads List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search community doubts & formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF5722] shadow-xs"
            />
          </div>

          {/* Threads List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredThreads.map((thread) => {
              const isSelected = thread.thread_id === selectedThread.thread_id;
              const replyCount = replyList.filter((r) => r.thread_id === thread.thread_id).length;
              const isLiked = !!userLikes[`${currentUserId}_thread_${thread.thread_id}`];

              return (
                <div
                  key={thread.thread_id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 rounded-2xl border transition duration-200 cursor-pointer space-y-2 shadow-xs theme-transition ${
                    isSelected
                      ? 'bg-amber-50/50 border-[#FF5722] dark:bg-slate-900 dark:border-[#FF5722]/60 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800/80 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                      #{thread.tags?.[0] || 'NISM_SERIES_XV'}
                    </span>
                    {thread.is_solved && (
                      <span className="text-[10px] text-emerald-600 dark:text-[#00E599] flex items-center gap-1 font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3" /> RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {thread.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <button
                      onClick={(e) => handleToggleLikeThread(thread.thread_id, e)}
                      className={`flex items-center gap-1 transition cursor-pointer font-bold ${
                        isLiked ? 'text-[#FF5722]' : 'hover:text-[#FF5722]'
                      }`}
                      title={isLiked ? 'Liked by you (Click to unlike)' : 'Click to like (1 like per user)'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF5722]' : ''}`} />
                      <span>{thread.upvotes_count || 0}</span>
                    </button>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>{replyCount} replies</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Active Thread Discussion Pane */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm theme-transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                #{selectedThread.tags?.[0] || 'NISM_SERIES_XV'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Posted {selectedThread.created_at || 'Recently'}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white">
              {selectedThread.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {selectedThread.content}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
              <button
                onClick={(e) => handleToggleLikeThread(selectedThread.thread_id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition font-bold cursor-pointer ${
                  userLikes[`${currentUserId}_thread_${selectedThread.thread_id}`]
                    ? 'bg-[#FF5722]/15 text-[#FF5722] border-[#FF5722]/40'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#FF5722]'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${userLikes[`${currentUserId}_thread_${selectedThread.thread_id}`] ? 'fill-[#FF5722]' : ''}`} />
                <span>Upvote ({selectedThread.upvotes_count || 0})</span>
              </button>

              <button
                onClick={() => openAuthorProfile('Rajesh Mehta', 'Senior Research Analyst', 'Motilal Oswal')}
                className="text-[11px] text-[#FF5722] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>View Author Profile</span>
              </button>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
              COMMUNITY ANSWERS & MENTOR EXPLANATIONS ({activeReplies.length})
            </div>

            {activeReplies.map((reply) => (
              <div
                key={reply.reply_id}
                className={`p-4 rounded-2xl border space-y-2 text-xs shadow-xs theme-transition ${
                  reply.is_accepted_answer
                    ? 'bg-emerald-50/50 border-emerald-300 dark:bg-gradient-to-r dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 dark:border-emerald-500/40'
                    : 'bg-white border-slate-200 dark:bg-[#0B0F19] dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAuthorProfile('Dr. Ananya Sharma', 'Certified Financial Analyst & Faculty', 'FinanceX Academic Council')}
                      className="font-bold text-slate-900 dark:text-white hover:text-[#FF5722] transition cursor-pointer flex items-center gap-1"
                    >
                      <UserIcon className="w-3 h-3 text-[#FF5722]" />
                      <span>Certified Mentor / Scholar</span>
                    </button>
                    {reply.is_accepted_answer && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED ANSWER
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono">{reply.created_at || 'Recently'}</span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {reply.content}
                </p>
              </div>
            ))}

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Write your explanation or helpful answer..."
                value={newReplyText}
                onChange={(e) => setNewReplyText(e.target.value)}
                className="flex-1 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF5722] shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-md shadow-[#FF5722]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Reply</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ask Question / New Thread Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateThread}
            className="w-full max-w-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5722]" />
                <span>Post a Community Question</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Syllabus Tag / Category
              </label>
              <select
                value={newQuestionTag}
                onChange={(e) => setNewQuestionTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="NISM_SERIES_XV">NISM Series XV (Research Analyst)</option>
                <option value="VALUATION_DCF">DCF & Relative Valuation</option>
                <option value="FINANCIAL_ANALYSIS">Financial Analysis & DuPont</option>
                <option value="SEBI_REGULATIONS">SEBI RA Regulations 2014</option>
                <option value="TECHNICAL_ANALYSIS">Technical Analysis & Indicators</option>
                <option value="COMMODITIES">Commodities & Cost of Carry</option>
                <option value="NISM_SERIES_VIII">NISM Series VIII (Equity Derivatives)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Question Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How does Free Cash Flow to Firm (FCFF) treat working capital changes?"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Detailed Context & Formulas (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Include your specific calculation, numbers, or syllabus chapter details..."
                value={newQuestionBody}
                onChange={(e) => setNewQuestionBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAskModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold transition shadow-md shadow-[#FF5722]/20 cursor-pointer"
              >
                Publish Thread
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
