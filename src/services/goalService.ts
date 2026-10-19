import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Goal, StudyPlan } from '../types/schema';

export const goalService = {
  /**
   * Fetch user goals strictly scoped to user_id
   */
  async getGoals(userId: string): Promise<Goal[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return [];

      return data.map((g: any, idx: number) => ({
        goal_id: idx + 1,
        user_id: g.user_id || userId,
        goal_title: g.goal_title,
        target_date: g.target_date,
        status: g.status as any,
        current_progress_percent: Number(g.current_progress_percent || 0),
        category: g.category || 'CERTIFICATION'
      }));
    } catch (err) {
      console.error('Error fetching goals:', err);
      return [];
    }
  },

  /**
   * Create goal
   */
  async createGoal(userId: string, title: string, targetDate: string, category?: string) {
    if (!userId || userId === 'guest') return null;
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('goals').insert({
        user_id: userId,
        goal_title: title,
        target_date: targetDate,
        category: category || 'CERTIFICATION',
        status: 'IN_PROGRESS'
      }).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating goal:', err);
      return null;
    }
  },

  /**
   * Fetch study plans strictly scoped to user_id
   */
  async getStudyPlans(userId: string): Promise<StudyPlan[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return [];

      return data.map((sp: any, idx: number) => ({
        study_plan_id: idx + 1,
        user_id: sp.user_id || userId,
        certification_id: 1,
        status: sp.status as any,
        start_date: sp.start_date,
        target_exam_date: sp.target_date,
        daily_commitment_mins: Number(sp.daily_commitment_mins || 45),
        completion_rate_percent: Number(sp.completion_rate_percent || 0)
      }));
    } catch (err) {
      console.error('Error fetching study plans:', err);
      return [];
    }
  }
};
