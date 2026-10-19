import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  ConceptMastery, 
  SpacedReviewSchedule, 
  SpacedReviewUrgency 
} from '../types/schema';
import { MOCK_TOPICS } from '../data/mockData';

const STAGE_INTERVALS: Record<number, number> = {
  1: 1,   // 1 Day
  2: 3,   // 3 Days
  3: 7,   // 7 Days
  4: 14,  // 14 Days
  5: 30   // 30 Days (Mastery Maintenance)
};

// Local storage key for user-specific spaced review state
function getStorageKey(userId: string | number): string {
  return `financex_spaced_schedule_${userId}`;
}

export const spacedReviewService = {
  /**
   * Compute Deterministic Spaced Review Schedules for all curriculum topics
   */
  computeSpacedReviewSchedule(
    userId: string | number,
    masteryList: ConceptMastery[],
    options?: {
      currentDateIso?: string;
      customReviewStates?: Record<number, { stage: number; lastReviewedAt: string; consecutiveSuccesses: number }>;
    }
  ): SpacedReviewSchedule[] {
    const now = options?.currentDateIso ? new Date(options.currentDateIso) : new Date();
    
    // Load stored review state if available
    let storedStates: Record<number, { stage: number; lastReviewedAt: string; consecutiveSuccesses: number }> = {};
    if (options?.customReviewStates) {
      storedStates = options.customReviewStates;
    } else if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (raw) storedStates = JSON.parse(raw);
      } catch (err) {
        console.warn('Failed to parse local spaced review schedule:', err);
      }
    }

    return masteryList.map((mastery) => {
      const topicId = mastery.topic_id;
      const stored = storedStates[topicId];

      let stage = stored?.stage || 1;
      let consecutiveSuccesses = stored?.consecutiveSuccesses || 0;
      let lastReviewedAt = stored?.lastReviewedAt || mastery.last_studied_at || new Date(now.getTime() - 2 * 86400000).toISOString();

      // Pedagogical Adaptation:
      // If concept is weak or needs practice, reset stage to 1 (urgent recall needed)
      if (mastery.mastery_level === 'NEEDS_PRACTICE' || mastery.is_weakness) {
        stage = 1;
        consecutiveSuccesses = 0;
      } else if (mastery.mastery_level === 'MASTERED' && stage < 4) {
        stage = 5;
        consecutiveSuccesses = Math.max(consecutiveSuccesses, 3);
      } else if (mastery.mastery_level === 'PROFICIENT' && stage < 3) {
        stage = 3;
      }

      const intervalDays = STAGE_INTERVALS[stage] || 1;
      const lastReviewedDate = new Date(lastReviewedAt);
      const nextDueMillis = lastReviewedDate.getTime() + intervalDays * 86400000;
      const nextDueDate = new Date(nextDueMillis);
      
      const diffDays = Math.floor((now.getTime() - nextDueMillis) / 86400000);
      const isDue = mastery.mastery_level !== 'NOT_STARTED' && (now.getTime() >= nextDueMillis || mastery.is_weakness);
      const daysOverdue = Math.max(0, diffDays);

      let urgency: SpacedReviewUrgency = 'UPCOMING';
      if (mastery.mastery_level === 'NOT_STARTED') {
        urgency = 'UPCOMING';
      } else if (daysOverdue > 0 || mastery.is_weakness) {
        urgency = 'OVERDUE';
      } else if (isDue) {
        urgency = 'DUE_TODAY';
      } else if (mastery.mastery_level === 'MASTERED') {
        urgency = 'MASTERED_MAINTENANCE';
      }

      return {
        topic_id: topicId,
        topic_name: mastery.topic_name,
        review_stage: stage,
        interval_days: intervalDays,
        last_reviewed_at: lastReviewedAt,
        next_review_due_at: nextDueDate.toISOString(),
        is_due: isDue,
        days_overdue: daysOverdue,
        consecutive_successes: consecutiveSuccesses,
        urgency: urgency,
        recommended_questions_count: stage >= 4 ? 3 : 5
      };
    });
  },

  /**
   * Filter and return topics that are currently due for spaced review
   */
  getDueReviews(userId: string | number, masteryList: ConceptMastery[]): SpacedReviewSchedule[] {
    const schedules = this.computeSpacedReviewSchedule(userId, masteryList);
    return schedules
      .filter((s) => s.is_due)
      .sort((a, b) => b.days_overdue - a.days_overdue);
  },

  /**
   * Record Completion of a Spaced Review Session & Update Interval
   */
  recordReviewOutcome(
    userId: string | number,
    topicId: number,
    scorePercent: number,
    passed: boolean
  ): { nextStage: number; nextIntervalDays: number; nextDueAt: string } {
    const now = new Date();
    let storedStates: Record<number, { stage: number; lastReviewedAt: string; consecutiveSuccesses: number }> = {};

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (raw) storedStates = JSON.parse(raw);
      } catch (err) {
        console.warn('Error reading stored review state:', err);
      }
    }

    const current = storedStates[topicId] || { stage: 1, lastReviewedAt: now.toISOString(), consecutiveSuccesses: 0 };
    let nextStage = current.stage;
    let consecutiveSuccesses = current.consecutiveSuccesses;

    if (passed && scorePercent >= 75) {
      nextStage = Math.min(5, current.stage + 1);
      consecutiveSuccesses += 1;
    } else {
      // Failure resets to Stage 1 (1 day review)
      nextStage = 1;
      consecutiveSuccesses = 0;
    }

    const nextIntervalDays = STAGE_INTERVALS[nextStage] || 1;
    const nextDueDate = new Date(now.getTime() + nextIntervalDays * 86400000);

    storedStates[topicId] = {
      stage: nextStage,
      lastReviewedAt: now.toISOString(),
      consecutiveSuccesses
    };

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(storedStates));
      } catch (err) {
        console.warn('Error saving review state to localStorage:', err);
      }
    }

    return {
      nextStage,
      nextIntervalDays,
      nextDueAt: nextDueDate.toISOString()
    };
  },

  /**
   * Fetch stored review states for a specific user
   */
  getSchedules(userId: string | number): Array<{ topicId: number; stage: number; lastReviewedAt: string; consecutiveSuccesses: number }> {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (raw) {
          const parsed: Record<number, { stage: number; lastReviewedAt: string; consecutiveSuccesses: number }> = JSON.parse(raw);
          return Object.entries(parsed).map(([topicId, data]) => ({
            topicId: Number(topicId),
            ...data
          }));
        }
      } catch (err) {
        console.warn('Error reading user schedules:', err);
      }
    }
    return [];
  }
};
