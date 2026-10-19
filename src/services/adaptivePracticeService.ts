import { 
  Question, 
  ConceptMastery, 
  AdaptivePracticeSession, 
  AdaptivePracticeMode, 
  LearningWeaknessRemediation 
} from '../types/schema';
import { MOCK_QUESTIONS, MOCK_TOPICS } from '../data/mockData';
import { spacedReviewService } from './spacedReviewService';
import { learningLoopService } from './learningLoopService';

export const adaptivePracticeService = {
  /**
   * Generate a targeted, difficulty-calibrated Adaptive Practice Session
   */
  generateAdaptiveSession(
    userId: string | number,
    topicId: number,
    mastery?: ConceptMastery,
    options?: {
      forceMode?: AdaptivePracticeMode;
      questionCount?: number;
      availableQuestions?: Question[];
    }
  ): AdaptivePracticeSession {
    const topic = MOCK_TOPICS.find((t) => t.topic_id === topicId) || MOCK_TOPICS[0];
    const allQuestions = options?.availableQuestions || MOCK_QUESTIONS;
    const topicQuestions = allQuestions.filter((q) => q.topic_id === topicId);
    const pool = topicQuestions.length > 0 ? topicQuestions : allQuestions;

    // 1. Determine Adaptive Mode
    let mode: AdaptivePracticeMode = options?.forceMode || 'REINFORCEMENT';
    let rationale = `Standard reinforcement practice on ${topic.topic_name}.`;

    if (!options?.forceMode && mastery) {
      if (mastery.mastery_level === 'NEEDS_PRACTICE' || mastery.is_weakness) {
        mode = 'REMEDIATION';
        rationale = `Targeted remediation to resolve identified gaps in ${topic.topic_name}. Foundational concept clarity questions selected.`;
      } else if (mastery.mastery_level === 'MASTERED' || mastery.mastery_level === 'PROFICIENT') {
        mode = 'CHALLENGE_MASTERY';
        rationale = `Advanced institutional scenarios and numerical calculations selected to maintain mastery on ${topic.topic_name}.`;
      } else if (mastery.mastery_level === 'LEARNING') {
        mode = 'REINFORCEMENT';
        rationale = `Structured reinforcement problems to advance your retention on ${topic.topic_name}.`;
      }
    }

    // 2. Select Questions based on Mode
    const targetCount = options?.questionCount || 4;
    let selected: Question[] = [];

    if (mode === 'REMEDIATION') {
      // Prioritize EASY questions, then MEDIUM
      const easy = pool.filter((q) => q.difficulty === 'EASY');
      const med = pool.filter((q) => q.difficulty === 'MEDIUM');
      selected = [...easy, ...med].slice(0, targetCount);
    } else if (mode === 'CHALLENGE_MASTERY') {
      // Prioritize HARD questions, then MEDIUM
      const hard = pool.filter((q) => q.difficulty === 'HARD');
      const med = pool.filter((q) => q.difficulty === 'MEDIUM');
      selected = [...hard, ...med].slice(0, targetCount);
    } else if (mode === 'SPACED_RECALL') {
      // Balanced diagnostic sample
      const med = pool.filter((q) => q.difficulty === 'MEDIUM');
      const rest = pool.filter((q) => q.difficulty !== 'MEDIUM');
      selected = [...med, ...rest].slice(0, targetCount);
    } else {
      // REINFORCEMENT
      const med = pool.filter((q) => q.difficulty === 'MEDIUM');
      const easy = pool.filter((q) => q.difficulty === 'EASY');
      const hard = pool.filter((q) => q.difficulty === 'HARD');
      selected = [...med, ...easy, ...hard].slice(0, targetCount);
    }

    // Fallback if not enough questions in pool
    if (selected.length < targetCount) {
      const remaining = allQuestions.filter((q) => !selected.some((s) => s.question_id === q.question_id));
      selected = [...selected, ...remaining.slice(0, targetCount - selected.length)];
    }

    return {
      session_id: `adaptive-${Date.now()}-${topicId}`,
      topic_id: topicId,
      topic_name: topic.topic_name,
      mode: mode,
      questions: selected,
      target_mastery_before: mastery?.mastery_score || 50,
      started_at: new Date().toISOString(),
      rationale: rationale
    };
  },

  /**
   * Evaluate Adaptive Practice Session Results and Emit Closed-Loop Signals
   */
  evaluateAdaptiveSession(
    userId: string | number,
    session: AdaptivePracticeSession,
    userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
  ): {
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    remediation?: LearningWeaknessRemediation;
    xpEarned: number;
    nextReviewDueAt: string;
  } {
    let correctCount = 0;
    const totalQuestions = session.questions.length || 1;

    session.questions.forEach((q) => {
      if (userAnswers[q.question_id] === q.correct_option) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= 75;

    // 1. Update Spaced Review Schedule
    const reviewResult = spacedReviewService.recordReviewOutcome(
      userId,
      session.topic_id,
      scorePercent,
      passed
    );

    // 2. Compute XP
    const xpEarned = correctCount * (session.mode === 'CHALLENGE_MASTERY' ? 40 : 25) + (passed ? 50 : 10);

    // 3. Build Remediation if failed
    let remediation: LearningWeaknessRemediation | undefined;
    if (!passed) {
      remediation = learningLoopService.buildQuizRemediation(
        `Adaptive Practice: ${session.topic_name}`,
        session.topic_name,
        scorePercent,
        correctCount,
        totalQuestions
      );
    }

    return {
      scorePercent,
      correctCount,
      totalQuestions,
      passed,
      remediation,
      xpEarned,
      nextReviewDueAt: reviewResult.nextDueAt
    };
  }
};
