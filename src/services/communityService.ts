import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DiscussionThread, DiscussionReply } from '../types/schema';
import { MOCK_DISCUSSION_THREADS, MOCK_DISCUSSION_REPLIES } from '../data/mockData';

const LOCAL_UPVOTES_KEY = 'financex_user_upvotes';

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
   * Fetch discussion threads with real upvote and reply counts
   */
  async getThreads(): Promise<DiscussionThread[]> {
    if (!isSupabaseConfigured) return MOCK_DISCUSSION_THREADS;
    try {
      const { data, error } = await supabase
        .from('discussion_threads')
        .select(`
          *,
          discussion_replies(count),
          discussion_upvotes(count)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return MOCK_DISCUSSION_THREADS;

      return data.map((t: any, idx: number) => ({
        thread_id: idx + 1,
        user_id: 1,
        topic_id: 1,
        title: t.title,
        tags: ['Options', 'NISM', 'Greeks'],
        content: t.body,
        created_at: t.created_at,
        upvotes_count: t.discussion_upvotes?.[0]?.count || 0,
        replies_count: t.discussion_replies?.[0]?.count || 0,
        is_pinned: t.status === 'PINNED',
        is_solved: false
      }));
    } catch (err) {
      console.warn('Error fetching discussion threads:', err);
      return MOCK_DISCUSSION_THREADS;
    }
  },

  /**
   * Fetch replies for a thread
   */
  async getReplies(threadId: number): Promise<DiscussionReply[]> {
    if (!isSupabaseConfigured) return MOCK_DISCUSSION_REPLIES;
    try {
      const { data: allThreads } = await supabase.from('discussion_threads').select('id').order('created_at', { ascending: false });
      const targetThreadUuid = allThreads?.[threadId - 1]?.id || String(threadId);

      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('thread_id', targetThreadUuid)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) return MOCK_DISCUSSION_REPLIES;

      return data.map((r: any, idx: number) => ({
        reply_id: idx + 1,
        thread_id: threadId,
        user_id: 1,
        content: r.message_text,
        created_at: r.created_at,
        upvotes: 0,
        is_accepted_answer: false
      }));
    } catch (err) {
      console.warn('Error fetching replies:', err);
      return MOCK_DISCUSSION_REPLIES;
    }
  },

  /**
   * Create new thread
   */
  async createThread(userId: string, topicId: string, title: string, body: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('discussion_threads')
        .insert({
          user_id: userId,
          topic_id: topicId,
          title,
          body,
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating discussion thread:', err);
      return null;
    }
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
