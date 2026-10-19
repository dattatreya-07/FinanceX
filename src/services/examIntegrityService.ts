import { 
  ExamIntegritySession, 
  IntegrityAnomalyEvent 
} from '../types/schema';

const INTEGRITY_SESSIONS_STORAGE_KEY = 'financex_exam_integrity_sessions';

const STATUTORY_INTEGRITY_DISCLAIMER = 
  'SIMULATED REGULATORY INTEGRITY MONITORING: FinanceX tracks browser session events (fullscreen retention, focus state, velocity metrics) strictly for compliance readiness and simulated exam discipline training. This is not official government-certified biometric proctoring.';

export const examIntegrityService = {
  /**
   * Initialize a new simulated proctoring integrity session
   */
  startIntegritySession(examId: number, userId: string | number): ExamIntegritySession {
    const session: ExamIntegritySession = {
      session_id: `integrity-${Date.now()}-${examId}`,
      exam_id: examId,
      user_id: userId,
      started_at: new Date().toISOString(),
      tab_switch_count: 0,
      fullscreen_exit_count: 0,
      velocity_anomalies_count: 0,
      integrity_score_pct: 100,
      is_invalidated: false,
      events: [],
      disclaimer: STATUTORY_INTEGRITY_DISCLAIMER
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(INTEGRITY_SESSIONS_STORAGE_KEY);
        const existing: ExamIntegritySession[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(INTEGRITY_SESSIONS_STORAGE_KEY, JSON.stringify([session, ...existing]));
      } catch (err) {
        console.warn('Error saving integrity session:', err);
      }
    }

    return session;
  },

  /**
   * Log an integrity anomaly event (tab switch, blur, velocity anomaly)
   */
  logIntegrityEvent(
    session: ExamIntegritySession,
    eventType: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'VELOCITY_ANOMALY' | 'KEYBOARD_RESTRICTION',
    details: string,
    questionId?: number
  ): ExamIntegritySession {
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let deduction = 5;

    if (eventType === 'FULLSCREEN_EXIT') {
      session.fullscreen_exit_count += 1;
      severity = 'HIGH';
      deduction = 15;
    } else if (eventType === 'TAB_SWITCH') {
      session.tab_switch_count += 1;
      severity = 'MEDIUM';
      deduction = 8;
    } else if (eventType === 'VELOCITY_ANOMALY') {
      session.velocity_anomalies_count += 1;
      severity = 'MEDIUM';
      deduction = 10;
    }

    const event: IntegrityAnomalyEvent = {
      event_id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      event_type: eventType,
      details,
      question_id: questionId,
      severity
    };

    session.events.push(event);
    session.integrity_score_pct = Math.max(0, session.integrity_score_pct - deduction);

    // If 3+ fullscreen exits or score < 40%, flag exam invalidation
    if (session.fullscreen_exit_count >= 3 || session.integrity_score_pct < 40) {
      session.is_invalidated = true;
    }

    // Persist updated session
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(INTEGRITY_SESSIONS_STORAGE_KEY);
        if (raw) {
          const list: ExamIntegritySession[] = JSON.parse(raw);
          const updated = list.map((s) => s.session_id === session.session_id ? session : s);
          localStorage.setItem(INTEGRITY_SESSIONS_STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Error updating integrity session:', err);
      }
    }

    return session;
  },

  /**
   * Finalize and seal the integrity session
   */
  finalizeIntegritySession(session: ExamIntegritySession): ExamIntegritySession {
    session.completed_at = new Date().toISOString();
    return session;
  },

  /**
   * Detect velocity anomaly (question answered in under 4 seconds on non-trivial questions)
   */
  isVelocityAnomaly(timeSpentSeconds: number, questionTextLength: number): boolean {
    // If complex numerical question (>60 chars) answered in < 4 seconds, flag anomaly
    return timeSpentSeconds < 4 && questionTextLength > 60;
  }
};
