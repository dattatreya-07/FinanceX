import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Send, 
  Search, 
  Plus
} from 'lucide-react';
import { DiscussionThread, DiscussionReply, AppNavView } from '../../types/schema';

interface CommunityViewProps {
  threads: DiscussionThread[];
  replies: DiscussionReply[];
  onNavigate: (view: AppNavView) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  threads,
  replies
}) => {
  const [selectedThread, setSelectedThread] = useState<DiscussionThread>(threads[0]);
  const [threadList, setThreadList] = useState<DiscussionThread[]>(threads);
  const [replyList, setReplyList] = useState<DiscussionReply[]>(replies);
  const [newReplyText, setNewReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('NISM_SERIES_VIII');

  const filteredThreads = threadList.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReplies = replyList.filter((r) => r.thread_id === selectedThread.thread_id);

  const handleUpvoteThread = (threadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreadList((prev) =>
      prev.map((t) => (t.thread_id === threadId ? { ...t, upvotes_count: (t.upvotes_count || 0) + 1 } : t))
    );
    if (selectedThread.thread_id === threadId) {
      setSelectedThread((prev) => ({ ...prev, upvotes_count: (prev.upvotes_count || 0) + 1 }));
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    const newReply: DiscussionReply = {
      reply_id: Date.now(),
      thread_id: selectedThread.thread_id,
      user_id: 101,
      content: newReplyText,
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
      user_id: 101,
      topic_id: 2,
      tags: [newQuestionTag],
      title: newQuestionTitle,
      content: newQuestionBody,
      upvotes_count: 1,
      replies_count: 0,
      is_solved: false,
      created_at: 'Just now'
    };

    setThreadList((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
    setIsAskModalOpen(false);
    setNewQuestionTitle('');
    setNewQuestionBody('');
  };

  return (
    <div className="space-y-6" id="community-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Learner Community & Doubt Clearing
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40">
              PEER & MENTOR NETWORK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Discuss complex exam questions, real market dynamics, and portfolio concepts.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question / Start Thread</span>
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
              placeholder="Search community doubts & discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599] shadow-xs"
            />
          </div>

          {/* Threads List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredThreads.map((thread) => {
              const isSelected = thread.thread_id === selectedThread.thread_id;
              const replyCount = replyList.filter((r) => r.thread_id === thread.thread_id).length;

              return (
                <div
                  key={thread.thread_id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 rounded-2xl border transition duration-200 cursor-pointer space-y-2 shadow-xs theme-transition ${
                    isSelected
                      ? 'bg-pink-50/70 border-[#FF2E7E] dark:bg-slate-900 dark:border-[#00E599]/60 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800/80 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 font-bold">
                      #{thread.tags?.[0] || 'GENERAL'}
                    </span>
                    {thread.is_solved && (
                      <span className="text-[10px] text-emerald-700 dark:text-[#00E599] flex items-center gap-1 font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3" /> RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {thread.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <button
                      onClick={(e) => handleUpvoteThread(thread.thread_id, e)}
                      className="flex items-center gap-1 hover:text-pink-600 dark:hover:text-[#00E599] transition cursor-pointer font-bold"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{thread.upvotes_count || 0}</span>
                    </button>
                    <div className="flex items-center gap-1">
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
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400 font-bold">
                #{selectedThread.tags?.[0] || 'GENERAL'}
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

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
              <button
                onClick={(e) => handleUpvoteThread(selectedThread.thread_id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-slate-900 border border-pink-200 dark:border-slate-800 hover:border-pink-400 dark:hover:border-[#00E599] text-pink-700 dark:text-[#00E599] transition font-bold cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Upvote ({selectedThread.upvotes_count || 0})</span>
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
                    ? 'bg-emerald-50/50 border-emerald-300 dark:bg-gradient-to-r dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 dark:border-[#00E599]/40'
                    : 'bg-white border-slate-200 dark:bg-[#0B0F19] dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Certified Mentor / Peer</span>
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
                className="flex-1 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599] shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:text-slate-950 font-bold text-xs dark:hover:bg-[#00B377] transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Reply</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl theme-transition">
            <h3 className="text-base font-display font-black text-slate-900 dark:text-white">
              Start Community Discussion
            </h3>

            <form onSubmit={handleCreateThread} className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">TOPIC TAG</label>
                <select
                  value={newQuestionTag}
                  onChange={(e) => setNewQuestionTag(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                >
                  <option value="NISM_SERIES_VIII">#NISM_SERIES_VIII (Derivatives)</option>
                  <option value="OPTIONS_GREEKS">#OPTIONS_GREEKS (Delta/Theta/Vega)</option>
                  <option value="SEBI_REGULATIONS">#SEBI_REGULATIONS (Compliance)</option>
                  <option value="PORTFOLIO_THEORY">#PORTFOLIO_THEORY (Beta/Sharpe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Why is ATM Gamma highest near expiration date?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-400 mb-1">DETAILS</label>
                <textarea
                  rows={4}
                  placeholder="Provide context, formulas or specific exam questions you need help with..."
                  value={newQuestionBody}
                  onChange={(e) => setNewQuestionBody(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 text-xs font-bold dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold dark:hover:bg-[#00B377] cursor-pointer shadow-xs"
                >
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
