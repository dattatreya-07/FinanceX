import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DiscussionThread, DiscussionReply, User } from '../types/schema';

export const PERSISTENT_COMMUNITY_THREADS_KEY = 'financex_persistent_community_threads';
export const PERSISTENT_COMMUNITY_REPLIES_KEY = 'financex_persistent_community_replies';
const LOCAL_UPVOTES_KEY = 'financex_user_upvotes';

export const INITIAL_PRESEEDED_THREADS: DiscussionThread[] = [
  {
    thread_id: 101,
    user_id: 1,
    topic_id: 1,
    title: 'How to calculate Modified Duration when bond coupons are semi-annual (NISM Series XV Ch 3)?',
    content: 'In NISM Series XV Chapter 3 and Fixed Income examinations, the formula for Modified Duration is Macaulay Duration / (1 + YTM/n). Can someone clarify whether we divide YTM by 2 when coupon frequency is semi-annual? Does the percentage price change formula use clean or dirty price?',
    tags: ['NISM_SERIES_XV', 'BOND_VALUATION', 'FIXED_INCOME'],
    upvotes_count: 14,
    replies_count: 2,
    is_solved: true,
    is_pinned: true,
    created_at: '2 hours ago',
    author_name: 'Rajesh Mehta',
    author_role: 'NISM Series XV Certified Analyst',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    thread_id: 102,
    user_id: 2,
    topic_id: 8,
    title: 'Interpreting 3-Stage vs 5-Stage DuPont ROE: What if Net Margin drops but ROE increases?',
    content: 'During financial statement analysis for auto companies, what are the primary red flags if a company reports an increase in Return on Equity from 18% to 24%, but DuPont breakdown reveals Net Margin fell from 12% to 7% while Financial Leverage increased from 1.5x to 3.4x?',
    tags: ['DUPONT_ANALYSIS', 'FINANCIAL_RATIOS', 'EQUITY_RESEARCH'],
    upvotes_count: 28,
    replies_count: 3,
    is_solved: true,
    is_pinned: false,
    created_at: '5 hours ago',
    author_name: 'Priya Sharma',
    author_role: 'Equity Research Associate',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    thread_id: 103,
    user_id: 3,
    topic_id: 14,
    title: 'SEBI (Research Analysts) Regulations, 2014: Personal trading restrictions (30-day vs 5-day rule)',
    content: 'Can someone summarize the exact statutory prohibition periods under Regulation 16? If an analyst covers TCS and is writing an earnings update note, can they sell their personal holdings during the blackout period?',
    tags: ['SEBI_REGULATIONS', 'COMPLIANCE', 'ETHICS'],
    upvotes_count: 19,
    replies_count: 1,
    is_solved: false,
    is_pinned: false,
    created_at: 'Yesterday',
    author_name: 'Vikram Malhotra',
    author_role: 'Compliance & Risk Officer',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_PRESEEDED_REPLIES: DiscussionReply[] = [
  {
    reply_id: 201,
    thread_id: 101,
    user_id: 2,
    content: 'Yes, exactly! If the bond pays semi-annual coupons, n = 2. So if YTM is 7.0%, the denominator is (1 + 0.07 / 2) = 1.035. The percentage price change is -Modified Duration * Delta YTM. In market trade settlement, the full invoice price is the Dirty Price (Clean Price + Accrued Interest).',
    upvotes: 9,
    is_accepted_answer: true,
    created_at: '1 hour ago',
    author_name: 'Priya Sharma',
    author_role: 'Equity Research Associate'
  },
  {
    reply_id: 202,
    thread_id: 102,
    user_id: 1,
    content: 'That is a textbook corporate leverage red flag! In DuPont analysis, ROE = Net Margin * Asset Turnover * Leverage. If margin collapses from 12% to 7%, operating efficiency is deteriorating. The ROE rise was manufactured entirely by piling on debt (Leverage Multiplier jumping to 3.4x). In an economic downturn, high debt service could cause insolvency.',
    upvotes: 18,
    is_accepted_answer: true,
    created_at: '3 hours ago',
    author_name: 'Rajesh Mehta',
    author_role: 'NISM Series XV Certified Analyst'
  },
  {
    reply_id: 203,
    thread_id: 103,
    user_id: 2,
    content: 'Under Regulation 16 of SEBI (Research Analysts) Regulations, 2014: An analyst cannot trade in the subject company within 30 days prior to publishing the report, and cannot trade within 5 days after publication. Personal trading contrary to recommendation is strictly prohibited except in dire personal emergencies with prior Compliance Officer approval.',
    upvotes: 12,
    is_accepted_answer: true,
    created_at: '18 hours ago',
    author_name: 'Priya Sharma',
    author_role: 'Equity Research Associate'
  }
];

function getLocalUpvotes(userId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`${LOCAL_UPVOTES_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUpvotes(userId: string, upvotes: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_UPVOTES_KEY}_${userId}`, JSON.stringify(upvotes));
  } catch {}
}

export const communityService = {
  /**
   * Synchronously retrieve current initial threads from local cache or seed data
   */
  getInitialThreads(): DiscussionThread[] {
    if (typeof window === 'undefined') return INITIAL_PRESEEDED_THREADS;
    try {
      const raw = localStorage.getItem(PERSISTENT_COMMUNITY_THREADS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(PERSISTENT_COMMUNITY_THREADS_KEY, JSON.stringify(INITIAL_PRESEEDED_THREADS));
    } catch (e) {
      console.warn('Failed reading initial threads from localStorage:', e);
    }
    return INITIAL_PRESEEDED_THREADS;
  },

  /**
   * Synchronously retrieve current initial replies from local cache or seed data
   */
  getInitialReplies(): DiscussionReply[] {
    if (typeof window === 'undefined') return INITIAL_PRESEEDED_REPLIES;
    try {
      const raw = localStorage.getItem(PERSISTENT_COMMUNITY_REPLIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(PERSISTENT_COMMUNITY_REPLIES_KEY, JSON.stringify(INITIAL_PRESEEDED_REPLIES));
    } catch (e) {
      console.warn('Failed reading initial replies from localStorage:', e);
    }
    return INITIAL_PRESEEDED_REPLIES;
  },

  /**
   * Fetch discussion threads with real upvote and reply counts
   */
  async getThreads(): Promise<DiscussionThread[]> {
    const localThreads = this.getInitialThreads();

    if (!isSupabaseConfigured) {
      return localThreads;
    }

    try {
      const { data, error } = await supabase
        .from('discussion_threads')
        .select(`
          *,
          discussion_replies(count),
          discussion_upvotes(count)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return localThreads;
      }

      const remoteThreads: DiscussionThread[] = data.map((t: any, idx: number) => ({
        thread_id: t.id ? Number(t.id) || (idx + 1000) : idx + 1000,
        user_id: 1,
        topic_id: Number(t.topic_id) || 1,
        title: t.title,
        tags: Array.isArray(t.tags) && t.tags.length > 0 ? t.tags : ['NISM_SERIES_XV', 'RESEARCH'],
        content: t.body,
        created_at: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recently',
        upvotes_count: t.discussion_upvotes?.[0]?.count || 0,
        replies_count: t.discussion_replies?.[0]?.count || 0,
        is_pinned: t.status === 'PINNED',
        is_solved: false,
        author_name: t.author_name || 'Community Member',
        author_role: 'NISM Candidate'
      }));

      // Combine local created threads with remote threads, avoiding duplicates
      const seenIds = new Set<number>();
      const combined: DiscussionThread[] = [];

      for (const th of [...localThreads, ...remoteThreads]) {
        if (!seenIds.has(th.thread_id)) {
          seenIds.add(th.thread_id);
          combined.push(th);
        }
      }

      return combined;
    } catch (err) {
      console.warn('Error fetching discussion threads from Supabase, using local:', err);
      return localThreads;
    }
  },

  /**
   * Fetch replies for a thread
   */
  async getReplies(threadId: number): Promise<DiscussionReply[]> {
    const localReplies = this.getInitialReplies();
    const filteredLocal = localReplies.filter((r) => r.thread_id === threadId);

    if (!isSupabaseConfigured) {
      return filteredLocal.length > 0 ? filteredLocal : localReplies;
    }

    try {
      const { data: allThreads } = await supabase.from('discussion_threads').select('id').order('created_at', { ascending: false });
      const targetThreadUuid = allThreads?.[threadId - 1]?.id || String(threadId);

      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('thread_id', targetThreadUuid)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return filteredLocal;
      }

      const remoteReplies: DiscussionReply[] = data.map((r: any, idx: number) => ({
        reply_id: r.id ? Number(r.id) || (idx + 1000) : idx + 1000,
        thread_id: threadId,
        user_id: 1,
        content: r.message_text,
        created_at: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        upvotes: 0,
        is_accepted_answer: false,
        author_name: r.author_name || 'Research Peer',
        author_role: 'FinanceX Learner'
      }));

      return [...filteredLocal, ...remoteReplies];
    } catch (err) {
      console.warn('Error fetching replies:', err);
      return filteredLocal;
    }
  },

  /**
   * Create new discussion thread and immediately reflect across the platform
   */
  async createThread(params: {
    title: string;
    content: string;
    tags?: string[];
    user?: User;
    topicId?: number;
  }): Promise<DiscussionThread> {
    const threadId = Date.now();
    const newThread: DiscussionThread = {
      thread_id: threadId,
      user_id: params.user?.user_id ? Number(params.user.user_id) || 1 : 1,
      topic_id: params.topicId || 1,
      title: params.title.trim(),
      content: params.content.trim(),
      tags: params.tags && params.tags.length > 0 ? params.tags : ['NISM_SERIES_XV'],
      upvotes_count: 1,
      replies_count: 0,
      is_pinned: false,
      is_solved: false,
      created_at: 'Just now',
      author_name: params.user?.full_name || 'New Learner',
      author_role: 'NISM Series XV Candidate',
      author_avatar: params.user?.avatar_url
    };

    // Save locally
    if (typeof window !== 'undefined') {
      try {
        const existing = this.getInitialThreads();
        const updated = [newThread, ...existing.filter((t) => t.thread_id !== threadId)];
        localStorage.setItem(PERSISTENT_COMMUNITY_THREADS_KEY, JSON.stringify(updated));

        // Auto-like for author
        const currentUserId = String(params.user ? params.user.email || params.user.user_id : 'guest_learner');
        const likeKey = `${currentUserId}_thread_${threadId}`;
        const likes = getLocalUpvotes(currentUserId);
        likes[likeKey] = true;
        saveLocalUpvotes(currentUserId, likes);

        // Dispatch platform-wide sync event
        window.dispatchEvent(new CustomEvent('financex-threads-updated', { detail: newThread }));
      } catch (e) {
        console.error('Failed saving thread to localStorage:', e);
      }
    }

    // Try Supabase sync in background
    if (isSupabaseConfigured && params.user) {
      try {
        await supabase.from('discussion_threads').insert({
          user_id: params.user.user_id,
          topic_id: String(params.topicId || 1),
          title: params.title.trim(),
          body: params.content.trim(),
          status: 'ACTIVE'
        });
      } catch (err) {
        console.warn('Supabase thread sync notice (local copy saved):', err);
      }
    }

    return newThread;
  },

  /**
   * Add reply to a thread and update thread counters
   */
  async createReply(threadId: number, content: string, user?: User): Promise<DiscussionReply> {
    const newReply: DiscussionReply = {
      reply_id: Date.now(),
      thread_id: threadId,
      user_id: user?.user_id ? Number(user.user_id) || 1 : 1,
      content: content.trim(),
      created_at: 'Just now',
      upvotes: 0,
      is_accepted_answer: false,
      author_name: user?.full_name || 'New Learner',
      author_role: 'NISM Series XV Candidate',
      author_avatar: user?.avatar_url
    };

    if (typeof window !== 'undefined') {
      try {
        // Save reply
        const existingReplies = this.getInitialReplies();
        const updatedReplies = [...existingReplies, newReply];
        localStorage.setItem(PERSISTENT_COMMUNITY_REPLIES_KEY, JSON.stringify(updatedReplies));

        // Increment reply count on thread
        const existingThreads = this.getInitialThreads();
        const updatedThreads = existingThreads.map((t) =>
          t.thread_id === threadId ? { ...t, replies_count: (t.replies_count || 0) + 1 } : t
        );
        localStorage.setItem(PERSISTENT_COMMUNITY_THREADS_KEY, JSON.stringify(updatedThreads));

        // Dispatch platform event
        window.dispatchEvent(new CustomEvent('financex-threads-updated', { detail: { reply: newReply, threadId } }));
      } catch (e) {
        console.error('Failed saving reply locally:', e);
      }
    }

    // Try Supabase sync
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('discussion_replies').insert({
          thread_id: String(threadId),
          user_id: user.user_id,
          message_text: content.trim()
        });
      } catch (err) {
        console.warn('Supabase reply sync notice:', err);
      }
    }

    return newReply;
  },

  /**
   * Fetch threads upvoted by the current user
   */
  async getUserUpvotedThreads(userId: string): Promise<Record<string, boolean>> {
    if (!userId) return {};
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('discussion_upvotes')
          .select('thread_id')
          .eq('user_id', userId);

        if (!error && data) {
          const map: Record<string, boolean> = {};
          data.forEach((row: any) => {
            map[row.thread_id] = true;
          });
          return map;
        }
      } catch (err) {
        console.warn('Error fetching user upvotes:', err);
      }
    }
    return getLocalUpvotes(userId);
  },

  /**
   * Toggle user-specific upvote on a discussion thread
   */
  async toggleUpvote(threadId: string | number, userId: string): Promise<{ isUpvoted: boolean }> {
    const threadKey = String(threadId);
    if (!userId) return { isUpvoted: false };

    if (isSupabaseConfigured) {
      try {
        const { data: allThreads } = await supabase.from('discussion_threads').select('id').order('created_at', { ascending: false });
        const targetThreadUuid = allThreads?.[Number(threadId) - 1]?.id || threadKey;

        // Check if exists
        const { data: existing } = await supabase
          .from('discussion_upvotes')
          .select('thread_id')
          .eq('thread_id', targetThreadUuid)
          .eq('user_id', userId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('discussion_upvotes')
            .delete()
            .eq('thread_id', targetThreadUuid)
            .eq('user_id', userId);
          return { isUpvoted: false };
        } else {
          await supabase
            .from('discussion_upvotes')
            .insert({
              thread_id: targetThreadUuid,
              user_id: userId
            });
          return { isUpvoted: true };
        }
      } catch (err) {
        console.warn('Error toggling database upvote:', err);
      }
    }

    // Local fallback
    const local = getLocalUpvotes(userId);
    const newState = !local[threadKey];
    local[threadKey] = newState;
    saveLocalUpvotes(userId, local);
    return { isUpvoted: newState };
  }
};
