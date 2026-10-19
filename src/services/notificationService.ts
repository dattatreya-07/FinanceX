import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Notification } from '../types/schema';

export const notificationService = {
  /**
   * Fetch user notifications strictly scoped to user_id
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return [];

      return data.map((n: any, idx: number) => ({
        notification_id: idx + 1,
        user_id: n.user_id || userId,
        type: n.type as any,
        title: n.title,
        message: n.message,
        read: n.is_read,
        created_at: n.created_at,
        priority: n.priority as any
      }));
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }
};
