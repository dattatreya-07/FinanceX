import { 
  CohortBenchmark, 
  CohortDimension, 
  CohortPercentileDistribution, 
  CohortAnalyticsFilter 
} from '../types/schema';
import { MOCK_CERTIFICATIONS, MOCK_TOPICS } from '../data/mockData';

// Minimum sample size required to display statistical distribution (Privacy threshold)
const MIN_COHORT_PRIVACY_THRESHOLD = 5;

// Calibrated institutional cohort benchmark seed data
const SEED_COHORT_BENCHMARKS: CohortBenchmark[] = [
  {
    cohort_id: 'cohort-nism-8-all',
    cohort_name: 'All NISM Series VIII Candidates (2026)',
    dimension: 'CERTIFICATION_STREAM',
    certification_id: 1,
    certification_name: 'NISM Series VIII: Equity Derivatives',
    total_learners_n: 148,
    is_privacy_suppressed: false,
    average_accuracy_pct: 74.5,
    pass_rate_pct: 68.2,
    average_readiness_score: 72,
    percentiles: {
      p25: 62.0,
      p50: 75.0,
      p75: 86.0,
      p90: 94.0,
      mean: 74.5,
      std_dev: 12.4
    },
    top_weak_topic_ids: [2, 3],
    top_weak_topic_names: ['Option Greeks & Volatility Sensitivity', 'Fixed Income & Debt Securities Analysis']
  },
  {
    cohort_id: 'cohort-nism-15-all',
    cohort_name: 'All NISM Series XV Candidates (2026)',
    dimension: 'CERTIFICATION_STREAM',
    certification_id: 2,
    certification_name: 'NISM Series XV: Research Analyst',
    total_learners_n: 94,
    is_privacy_suppressed: false,
    average_accuracy_pct: 71.8,
    pass_rate_pct: 62.5,
    average_readiness_score: 69,
    percentiles: {
      p25: 58.0,
      p50: 72.0,
      p75: 83.0,
      p90: 91.0,
      mean: 71.8,
      std_dev: 13.1
    },
    top_weak_topic_ids: [4, 5],
    top_weak_topic_names: ['Corporate Valuation & DCF Modeling', 'Macroeconomics & Monetary Policy']
  },
  {
    cohort_id: 'cohort-batch-mumbai-26',
    cohort_name: 'Mumbai Financial Institute — Batch Q1 2026',
    dimension: 'INSTITUTIONAL_BATCH',
    certification_id: 1,
    certification_name: 'NISM Series VIII: Equity Derivatives',
    total_learners_n: 36,
    is_privacy_suppressed: false,
    average_accuracy_pct: 79.2,
    pass_rate_pct: 77.8,
    average_readiness_score: 78,
    percentiles: {
      p25: 70.0,
      p50: 80.0,
      p75: 89.0,
      p90: 96.0,
      mean: 79.2,
      std_dev: 10.2
    },
    top_weak_topic_ids: [3],
    top_weak_topic_names: ['Option Greeks & Volatility Sensitivity']
  },
  {
    cohort_id: 'cohort-small-pilot',
    cohort_name: 'Executive Pilot Trainees (Confidential Small Group)',
    dimension: 'INSTITUTIONAL_BATCH',
    certification_id: 1,
    certification_name: 'NISM Series VIII: Equity Derivatives',
    total_learners_n: 3, // N < 5 -> Must be privacy suppressed!
    is_privacy_suppressed: true,
    average_accuracy_pct: 0,
    pass_rate_pct: 0,
    average_readiness_score: 0,
    percentiles: {
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      mean: 0,
      std_dev: 0
    },
    top_weak_topic_ids: [],
    top_weak_topic_names: []
  },
  {
    cohort_id: 'cohort-mastery-proficient',
    cohort_name: 'Proficient Mastery Cohort (Score 70-89%)',
    dimension: 'MASTERY_BAND',
    total_learners_n: 82,
    is_privacy_suppressed: false,
    average_accuracy_pct: 78.4,
    pass_rate_pct: 82.0,
    average_readiness_score: 81,
    percentiles: {
      p25: 72.0,
      p50: 78.0,
      p75: 85.0,
      p90: 88.0,
      mean: 78.4,
      std_dev: 6.5
    },
    top_weak_topic_ids: [2],
    top_weak_topic_names: ['Option Greeks & Volatility Sensitivity']
  }
];

function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

export const cohortAnalyticsService = {
  /**
   * Fetch all institutional cohort benchmarks with optional dimension filtering
   */
  getCohortBenchmarks(filter?: CohortAnalyticsFilter): CohortBenchmark[] {
    let list = [...SEED_COHORT_BENCHMARKS];

    if (filter?.dimension) {
      list = list.filter((c) => c.dimension === filter.dimension);
    }
    if (filter?.certificationId) {
      list = list.filter((c) => c.certification_id === filter.certificationId);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      list = list.filter((c) => 
        c.cohort_name.toLowerCase().includes(q) ||
        (c.certification_name && c.certification_name.toLowerCase().includes(q))
      );
    }

    return list;
  },

  /**
   * Compute privacy-preserving percentile standing for an individual learner
   * Guarantees zero peer PII is disclosed
   */
  getLearnerPercentileStanding(
    userScore: number,
    certificationId: number = 1
  ): {
    percentileRank: number;
    topPercentile: number;
    cohortMean: number;
    cohortMedian: number;
    performanceTier: 'TOP_TIER' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'DEVELOPING';
    summaryMessage: string;
  } {
    const benchmark = SEED_COHORT_BENCHMARKS.find(
      (c) => c.certification_id === certificationId && !c.is_privacy_suppressed
    ) || SEED_COHORT_BENCHMARKS[0];

    const mean = benchmark.percentiles.mean;
    const stdDev = benchmark.percentiles.std_dev || 12;

    // Normal distribution approximation for percentile rank
    const z = (userScore - mean) / stdDev;
    let rank = Math.round(50 * (1 + erf(z / Math.SQRT2)));
    rank = Math.max(1, Math.min(99, rank));

    const topPct = 100 - rank;

    let tier: 'TOP_TIER' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'DEVELOPING' = 'AVERAGE';
    if (rank >= 85) {
      tier = 'TOP_TIER';
    } else if (rank >= 60) {
      tier = 'ABOVE_AVERAGE';
    } else if (rank >= 40) {
      tier = 'AVERAGE';
    } else {
      tier = 'DEVELOPING';
    }

    const summaryMessage = rank >= 50
      ? `Your score of ${userScore}% places you in the Top ${topPct}% (p${rank}) across all ${benchmark.cohort_name}.`
      : `Your score of ${userScore}% places you in the ${rank}th percentile of ${benchmark.cohort_name}. Targeted adaptive practice recommended.`;

    return {
      percentileRank: rank,
      topPercentile: topPct,
      cohortMean: mean,
      cohortMedian: benchmark.percentiles.p50,
      performanceTier: tier,
      summaryMessage
    };
  }
};
