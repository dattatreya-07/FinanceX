import { 
  Question, 
  ItemAnalysisMetrics, 
  QuestionQualityStatus, 
  DistractorDistribution 
} from '../types/schema';
import { MOCK_QUESTIONS, MOCK_TOPICS } from '../data/mockData';

export const assessmentIntelligenceService = {
  /**
   * Compute deterministic psychometric item analysis metrics for question bank
   */
  computeItemAnalysis(
    questions: Question[] = MOCK_QUESTIONS,
    options?: {
      minAttemptsThreshold?: number;
      customLogs?: Array<{ question_id: number; selected_option: string; is_correct: boolean; total_exam_score: number }>;
    }
  ): ItemAnalysisMetrics[] {
    return questions.map((q) => {
      const topic = MOCK_TOPICS.find((t) => t.topic_id === q.topic_id) || MOCK_TOPICS[0];

      // Use empirical attempt logs if provided, or deterministic calibrated simulation
      let totalAttempts = 48;
      let correctAttempts = 36;
      let pUpper = 0.90;
      let pLower = 0.50;
      let distractor: DistractorDistribution = { A: 10, B: 15, C: 70, D: 5 };

      if (options?.customLogs && options.customLogs.length > 0) {
        const qLogs = options.customLogs.filter((l) => l.question_id === q.question_id);
        if (qLogs.length > 0) {
          totalAttempts = qLogs.length;
          correctAttempts = qLogs.filter((l) => l.is_correct).length;
          
          // Sort by total exam score to get upper 27% and lower 27%
          const sorted = [...qLogs].sort((a, b) => b.total_exam_score - a.total_exam_score);
          const groupSize = Math.max(1, Math.round(sorted.length * 0.27));
          const upperGroup = sorted.slice(0, groupSize);
          const lowerGroup = sorted.slice(sorted.length - groupSize);

          pUpper = upperGroup.filter((l) => l.is_correct).length / upperGroup.length;
          pLower = lowerGroup.filter((l) => l.is_correct).length / lowerGroup.length;

          // Distractor counts
          const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
          qLogs.forEach((l) => {
            if (counts[l.selected_option] !== undefined) counts[l.selected_option]++;
          });
          distractor = {
            A: Math.round((counts.A / totalAttempts) * 100),
            B: Math.round((counts.B / totalAttempts) * 100),
            C: Math.round((counts.C / totalAttempts) * 100),
            D: Math.round((counts.D / totalAttempts) * 100)
          };
        }
      } else {
        // Calibrated deterministic baseline by difficulty
        if (q.difficulty === 'EASY') {
          totalAttempts = 64;
          correctAttempts = 56;
          pUpper = 0.98;
          pLower = 0.76;
          distractor = { A: 8, B: 88, C: 2, D: 2 };
        } else if (q.difficulty === 'HARD') {
          totalAttempts = 52;
          correctAttempts = 22;
          pUpper = 0.68;
          pLower = 0.18;
          distractor = { A: 42, B: 24, C: 18, D: 16 };
        } else {
          // MEDIUM
          totalAttempts = 58;
          correctAttempts = 41;
          pUpper = 0.88;
          pLower = 0.44;
          distractor = { A: 12, B: 71, C: 11, D: 6 };
        }
      }

      // 1. Difficulty Index (p-value: 0.00 - 1.00)
      const pValue = parseFloat((correctAttempts / (totalAttempts || 1)).toFixed(2));

      // 2. Discrimination Index (D = pUpper - pLower: -1.00 to +1.00)
      const dIndex = parseFloat((pUpper - pLower).toFixed(2));

      // 3. Point-Biserial Approximation (r_pbi)
      const rPbi = parseFloat((dIndex * 0.82).toFixed(2));

      // 4. Quality Status Determination
      let qualityStatus: QuestionQualityStatus = 'GOOD';
      let recommendation = 'Item is operating normally with healthy discrimination.';
      let isFlagged = false;

      if (pValue > 0.95) {
        qualityStatus = 'TOO_EASY';
        recommendation = 'Question has >95% success rate. Consider introducing more complex analytical distractors.';
        isFlagged = true;
      } else if (pValue < 0.20) {
        qualityStatus = 'TOO_HARD';
        recommendation = 'Question has <20% success rate. Check for ambiguous wording or missing prerequisites.';
        isFlagged = true;
      } else if (dIndex < 0.0) {
        qualityStatus = 'NEEDS_REVISION';
        recommendation = 'Negative discrimination index (lower scorers outperformed top scorers). High risk of key error or deceptive distractor.';
        isFlagged = true;
      } else if (dIndex < 0.20) {
        qualityStatus = 'POOR_DISCRIMINATION';
        recommendation = 'Low discrimination index (D < 0.20). Does not effectively differentiate proficient from struggling candidates.';
        isFlagged = true;
      } else if (dIndex >= 0.40) {
        qualityStatus = 'EXCELLENT';
        recommendation = 'High psychometric validity. Strong positive discrimination separating top and bottom performers.';
      } else if (dIndex >= 0.30) {
        qualityStatus = 'GOOD';
        recommendation = 'Standard high-performing item suitable for official mock exams.';
      } else {
        qualityStatus = 'FAIR';
        recommendation = 'Marginal discrimination. Review distractor plausibility.';
      }

      return {
        question_id: q.question_id,
        question_text: q.question_text,
        topic_id: q.topic_id,
        topic_name: topic.topic_name,
        difficulty: q.difficulty,
        total_attempts: totalAttempts,
        correct_attempts: correctAttempts,
        difficulty_index_p: pValue,
        discrimination_index_d: dIndex,
        point_biserial_r: rPbi,
        distractor_distribution: distractor,
        quality_status: qualityStatus,
        recommendation,
        is_flagged_for_review: isFlagged
      };
    });
  },

  /**
   * Generate high-level summary metrics of question bank health
   */
  getQuestionAnalysisSummary(metrics: ItemAnalysisMetrics[]): {
    totalQuestions: number;
    excellentCount: number;
    flaggedCount: number;
    averageDifficultyP: number;
    averageDiscriminationD: number;
    healthyItemRatioPct: number;
  } {
    if (!metrics || metrics.length === 0) {
      return {
        totalQuestions: 0,
        excellentCount: 0,
        flaggedCount: 0,
        averageDifficultyP: 0,
        averageDiscriminationD: 0,
        healthyItemRatioPct: 0
      };
    }

    const total = metrics.length;
    const excellent = metrics.filter((m) => m.quality_status === 'EXCELLENT').length;
    const flagged = metrics.filter((m) => m.is_flagged_for_review).length;
    const avgP = metrics.reduce((sum, m) => sum + m.difficulty_index_p, 0) / total;
    const avgD = metrics.reduce((sum, m) => sum + m.discrimination_index_d, 0) / total;
    const healthyRatio = Math.round(((total - flagged) / total) * 100);

    return {
      totalQuestions: total,
      excellentCount: excellent,
      flaggedCount: flagged,
      averageDifficultyP: parseFloat(avgP.toFixed(2)),
      averageDiscriminationD: parseFloat(avgD.toFixed(2)),
      healthyItemRatioPct: healthyRatio
    };
  }
};
