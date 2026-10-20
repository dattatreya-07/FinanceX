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
  Award,
  Sparkles
} from 'lucide-react';
import { DiscussionThread, DiscussionReply, AppNavView, User } from '../../types/schema';
import { PublicProfileModal, PublicProfileData } from '../profile/PublicProfileModal';
import { communityService } from '../../services/communityService';

interface CommunityViewProps {
  threads: DiscussionThread[];
  replies: DiscussionReply[];
  currentUser?: User;
  onNavigate: (view: AppNavView) => void;
  onAddThread?: (thread: DiscussionThread) => void;
}

const STORAGE_LIKES_KEY = 'financex_persistent_community_likes';

export const CommunityView: React.FC<CommunityViewProps> = ({
  threads,
  replies,
  currentUser,
  onNavigate,
  onAddThread
}) => {
  // Load persistent threads initialized from communityService or prop
  const [threadList, setThreadList] = useState<DiscussionThread[]>(() => {
    const initial = communityService.getInitialThreads();
    return initial && initial.length > 0 ? initial : threads;
  });

  // Load persistent replies initialized from communityService
  const [replyList, setReplyList] = useState<DiscussionReply[]>(() => {
    const initial = communityService.getInitialReplies();
    return initial && initial.length > 0 ? initial : replies;
  });

  // Track likes per user per thread
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedThread, setSelectedThread] = useState<DiscussionThread>(
    () => threadList[0] || threads[0]
  );
  const [newReplyText, setNewReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('NISM_SERIES_XV');

  // Public Profile Modal State
  const [selectedUserProfile, setSelectedUserProfile] = useState<PublicProfileData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync with global event updates
  useEffect(() => {
    const handleGlobalUpdate = () => {
      const fresh = communityService.getInitialThreads();
      setThreadList(fresh);
      const freshReplies = communityService.getInitialReplies();
      setReplyList(freshReplies);
    };

    window.addEventListener('financex-threads-updated', handleGlobalUpdate);
    return () => window.removeEventListener('financex-threads-updated', handleGlobalUpdate);
  }, []);

  // Update selection if active thread changes or is deleted
  useEffect(() => {
    if (threadList.length > 0) {
      const currentExists = threadList.find((t) => t.thread_id === selectedThread.thread_id);
      if (!currentExists) {
        setSelectedThread(threadList[0]);
      }
    }
  }, [threadList, selectedThread.thread_id]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(userLikes));
    } catch {}
  }, [userLikes]);

  const currentUserId = currentUser ? currentUser.email || currentUser.user_id : 'guest_learner';

  const filteredThreads = threadList.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.author_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReplies = replyList.filter((r) => r.thread_id === selectedThread.thread_id);

  // Single-like toggle enforcement
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

    communityService.toggleUpvote(threadId, String(currentUserId));
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    const createdReply = await communityService.createReply(
      selectedThread.thread_id,
      newReplyText.trim(),
      currentUser
    );

    setReplyList((prev) => [...prev, createdReply]);
    setThreadList((prev) =>
      prev.map((t) =>
        t.thread_id === selectedThread.thread_id
          ? { ...t, replies_count: (t.replies_count || 0) + 1 }
          : t
      )
    );
    setSelectedThread((prev) => ({
      ...prev,
      replies_count: (prev.replies_count || 0) + 1
    }));
    setNewReplyText('');
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const created = await communityService.createThread({
      title: newQuestionTitle.trim(),
      content: newQuestionBody.trim(),
      tags: [newQuestionTag],
      user: currentUser,
      topicId: 1
    });

    const likeKey = `${currentUserId}_thread_${created.thread_id}`;
    setUserLikes((prev) => ({ ...prev, [likeKey]: true }));

    setThreadList((prev) => [created, ...prev.filter((t) => t.thread_id !== created.thread_id)]);
    setSelectedThread(created);
    
    if (onAddThread) {
      onAddThread(created);
    }

    setIsAskModalOpen(false);
    setNewQuestionTitle('');
    setNewQuestionBody('');
  };

  // Open profile modal helper
  const openAuthorProfile = (name: string, role?: string, org?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanName = name || 'Anonymous Analyst';
    const isCurrentUser = currentUser && currentUser.full_name === cleanName;

    setSelectedUserProfile({
      user_id: cleanName.toLowerCase().replace(/\s+/g, '-'),
      full_name: cleanName,
      headline: role || 'NISM Series XV Research Analyst Candidate',
      organization: org || (isCurrentUser ? 'FinanceX Member' : 'Indian Capital Markets Research'),
      location: 'Mumbai, Maharashtra, India',
      bio: isCurrentUser
        ? 'Active learner analyzing Indian equity valuations, derivatives strategies, and SEBI compliance guidelines.'
        : `Active FinanceX community contributor analyzing Indian capital markets, DCF intrinsic valuation models, and SEBI RA regulations.`,
      xp_points: isCurrentUser ? currentUser?.xp_points || 350 : 1250,
      current_streak: isCurrentUser ? currentUser?.current_streak || 1 : 7,
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
            Real peer discussions, NISM Series XV formula doubts, and valuation case analyses reflected instantly across FinanceX.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 self-start sm:self-auto cursor-pointer"
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
              placeholder="Search community doubts, topics & peers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* Threads List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No discussions found</p>
                <p className="text-[11px] text-slate-400">Be the first to start a discussion thread or ask a question!</p>
                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Start Discussion
                </button>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.thread_id === selectedThread.thread_id;
                const replyCount = replyList.filter((r) => r.thread_id === thread.thread_id).length;
                const isLiked = !!userLikes[`${currentUserId}_thread_${thread.thread_id}`];
                const authorDisplay = thread.author_name || (thread.user_id === Number(currentUser?.user_id) ? currentUser?.full_name : 'Analyst Candidate');

                return (
                  <div
                    key={thread.thread_id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-4 rounded-2xl border transition duration-200 cursor-pointer space-y-2 shadow-xs theme-transition ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-500/60 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800/80 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                        #{thread.tags?.[0] || 'NISM_SERIES_XV'}
                      </span>
                      <div className="flex items-center gap-2">
                        {thread.is_pinned && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                            PINNED
                          </span>
                        )}
                        {thread.is_solved && (
                          <span className="text-[10px] text-emerald-600 dark:text-[#00E599] flex items-center gap-1 font-mono font-bold">
                            <CheckCircle2 className="w-3 h-3" /> RESOLVED
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {thread.title}
                    </h3>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                          {authorDisplay?.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[110px]">{authorDisplay}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleToggleLikeThread(thread.thread_id, e)}
                          className={`flex items-center gap-1 transition cursor-pointer font-bold ${
                            isLiked ? 'text-emerald-600 dark:text-emerald-400' : 'hover:text-emerald-600'
                          }`}
                          title={isLiked ? 'Liked by you (Click to unlike)' : 'Click to like (1 like per user)'}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{thread.upvotes_count || 0}</span>
                        </button>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MessageSquare className="w-3 h-3" />
                          <span>{replyCount} replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 7 Cols: Active Thread Discussion Pane */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm theme-transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  #{selectedThread.tags?.[0] || 'NISM_SERIES_XV'}
                </span>
                {selectedThread.tags?.[1] && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold">
                    #{selectedThread.tags[1]}
                  </span>
                )}
              </div>
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
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${userLikes[`${currentUserId}_thread_${selectedThread.thread_id}`] ? 'fill-current' : ''}`} />
                <span>Upvote ({selectedThread.upvotes_count || 0})</span>
              </button>

              <button
                onClick={(e) => openAuthorProfile(
                  selectedThread.author_name || 'Rajesh Mehta',
                  selectedThread.author_role || 'Senior Research Analyst',
                  'FinanceX Research Community',
                  e
                )}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {(selectedThread.author_name || 'R').charAt(0).toUpperCase()}
                </div>
                <span>By {selectedThread.author_name || 'Rajesh Mehta'}</span>
              </button>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center justify-between">
              <span>COMMUNITY ANSWERS & MENTOR EXPLANATIONS ({activeReplies.length})</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans normal-case">
                Instant peer response
              </span>
            </div>

            {activeReplies.length === 0 ? (
              <div className="p-6 text-center bg-white dark:bg-[#0B0F19] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No replies yet. Be the first to share an answer or solution!
              </div>
            ) : (
              activeReplies.map((reply) => {
                const authorDisplay = reply.author_name || 'Certified Mentor / Scholar';
                return (
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
                          onClick={() => openAuthorProfile(authorDisplay, reply.author_role || 'Certified Mentor', 'FinanceX Academic Council')}
                          className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition cursor-pointer flex items-center gap-1"
                        >
                          <UserIcon className="w-3 h-3 text-emerald-600" />
                          <span>{authorDisplay}</span>
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
                );
              })
            )}

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="flex gap-2">
              <input
                type="text"
                placeholder="Write an institutional answer, formula clarification, or doubt resolution..."
                value={newReplyText}
                onChange={(e) => setNewReplyText(e.target.value)}
                className="flex-1 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xs"
              />
              <button
                type="submit"
                disabled={!newReplyText.trim()}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Start Discussion / Ask Doubt Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-slate-900 dark:text-white text-base">
                  Start New Discussion Thread
                </h3>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Category Tag
                </label>
                <select
                  value={newQuestionTag}
                  onChange={(e) => setNewQuestionTag(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="NISM_SERIES_XV">NISM Series XV (Research Analyst)</option>
                  <option value="EQUITY_VALUATION">Equity Valuation (DCF / Relative)</option>
                  <option value="DERIVATIVES_OPTIONS">Options Greeks & Strategies</option>
                  <option value="SEBI_REGULATIONS">SEBI Regulations & Compliance</option>
                  <option value="PORTFOLIO_RISK">Portfolio Management & VaR</option>
                  <option value="DUPONT_ANALYSIS">Financial Statement Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thread Title / Question <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to interpret negative EV/EBITDA in cyclical capital goods?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation / Context
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide background, formula context, or company examples so peers and mentors can answer accurately..."
                  value={newQuestionBody}
                  onChange={(e) => setNewQuestionBody(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  +50 XP for starting a peer discussion
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newQuestionTitle.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Thread</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
