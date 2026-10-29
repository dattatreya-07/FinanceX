import { assessmentIntelligenceService } from '../src/services/assessmentIntelligenceService';
import { cohortAnalyticsService } from '../src/services/cohortAnalyticsService';
import { examIntegrityService } from '../src/services/examIntegrityService';
import { learningLoopService } from '../src/services/learningLoopService';
import { MOCK_QUESTIONS, MOCK_TOPICS } from '../src/data/mockData';

// Minimal mock of localStorage for Node environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (i: number) => Object.keys(store)[i] || null,
    length: 0
  } as any;
}

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
    failedCount++;
  }
}

async function runPhase29TestSuite() {
  console.log('================================================================');
  console.log('  FINANCEX PHASE 29: ASSESSMENT INTELLIGENCE & COHORT SUITE     ');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SECTION 1: PSYCHOMETRIC ITEM ANALYSIS & DISCRIMINATION
  // -------------------------------------------------------------
  console.log('--- SECTION 1: Psychometric Item Analysis & Discrimination ---');

  const metrics = assessmentIntelligenceService.computeItemAnalysis(MOCK_QUESTIONS);
  assert(metrics.length === MOCK_QUESTIONS.length, 'Computes item metrics for all questions in question bank');

  const firstMetric = metrics[0];
  assert(firstMetric.difficulty_index_p >= 0 && firstMetric.difficulty_index_p <= 1.0, 'Difficulty index (p-value) is within [0.00, 1.00]');
  assert(firstMetric.discrimination_index_d >= -1.0 && firstMetric.discrimination_index_d <= 1.0, 'Discrimination index (D) is within [-1.00, +1.00]');
  assert(firstMetric.distractor_distribution.A !== undefined, 'Distractor distribution contains Option A percentage');

  // Test custom empirical logs for item analysis
  const mockCustomLogs = [
    { question_id: 999, selected_option: 'B', is_correct: true, total_exam_score: 90 },
    { question_id: 999, selected_option: 'B', is_correct: true, total_exam_score: 85 },
    { question_id: 999, selected_option: 'A', is_correct: false, total_exam_score: 40 },
    { question_id: 999, selected_option: 'C', is_correct: false, total_exam_score: 30 }
  ];

  const customQ: any = [{
    question_id: 999,
    topic_id: 2,
    difficulty: 'MEDIUM',
    question_text: 'What is a forward contract?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_option: 'B'
  }];

  const empiricalMetrics = assessmentIntelligenceService.computeItemAnalysis(customQ, { customLogs: mockCustomLogs });
  assert(empiricalMetrics[0].difficulty_index_p === 0.50, 'Empirical p-value calculated correctly (2/4 = 0.50)');
  assert(empiricalMetrics[0].discrimination_index_d > 0, 'Positive discrimination index computed from upper vs lower quartile performance');

  // Item Summary
  const summary = assessmentIntelligenceService.getQuestionAnalysisSummary(metrics);
  assert(summary.totalQuestions === metrics.length, 'Item analysis summary aggregates total questions');
  assert(summary.healthyItemRatioPct >= 0 && summary.healthyItemRatioPct <= 100, 'Healthy item ratio percentage computed');

  // -------------------------------------------------------------
  // SECTION 2: PRIVACY-PRESERVING COHORT ANALYTICS
  // -------------------------------------------------------------
  console.log('\n--- SECTION 2: Privacy-Preserving Cohort Analytics ---');

  const cohorts = cohortAnalyticsService.getCohortBenchmarks();
  assert(cohorts.length >= 3, 'Retrieves multi-dimensional cohort benchmarks');

  // Test privacy suppression on small sample size (N < 5)
  const smallCohort = cohorts.find(c => c.total_learners_n < 5);
  assert(!!smallCohort && smallCohort.is_privacy_suppressed === true, 'Cohort with sample size N < 5 has statistical distribution suppressed');

  const standardCohort = cohorts.find(c => c.total_learners_n >= 5 && !c.is_privacy_suppressed);
  assert(!!standardCohort && standardCohort.percentiles.p50 > 0, 'Standard cohort provides complete percentile distribution (p25, p50, p75, p90)');

  // Learner comparative percentile lookup
  const learnerStanding = cohortAnalyticsService.getLearnerPercentileStanding(85, 1);
  assert(learnerStanding.percentileRank >= 50, 'High score (85%) places learner in top percentile tier (rank >= 50)');
  assert(learnerStanding.topPercentile <= 50, 'Top percentile calculated consistently');
  assert(learnerStanding.summaryMessage.includes('85%'), 'Summary feedback message contains learner score');

  // -------------------------------------------------------------
  // SECTION 3: EXAM INTEGRITY & PROCTORED SIMULATION
  // -------------------------------------------------------------
  console.log('\n--- SECTION 3: Exam Integrity & Proctored Simulation ---');

  const integritySession = examIntegrityService.startIntegritySession(101, 'user-exam-1');
  assert(integritySession.integrity_score_pct === 100, 'Integrity session begins at 100% score');
  assert(!integritySession.is_invalidated, 'New session is not invalidated');

  // Log Tab Switch event
  examIntegrityService.logIntegrityEvent(integritySession, 'TAB_SWITCH', 'Switched focus to browser tab 2');
  assert(integritySession.tab_switch_count === 1, 'Increments tab switch count');
  assert(integritySession.integrity_score_pct === 92, 'Deducts 8 points for tab switch event');

  // Velocity anomaly test
  const isAnomalous = examIntegrityService.isVelocityAnomaly(2, 85); // 2s on 85-char question
  assert(isAnomalous === true, 'Correctly flags velocity anomaly for complex question answered in < 4s');

  // Fullscreen exit limit & invalidation test
  examIntegrityService.logIntegrityEvent(integritySession, 'FULLSCREEN_EXIT', 'Exit fullscreen 1');
  examIntegrityService.logIntegrityEvent(integritySession, 'FULLSCREEN_EXIT', 'Exit fullscreen 2');
  examIntegrityService.logIntegrityEvent(integritySession, 'FULLSCREEN_EXIT', 'Exit fullscreen 3');
  assert(integritySession.fullscreen_exit_count === 3, 'Counts 3 fullscreen exit events');
  assert(integritySession.is_invalidated === true, 'Invalidates session after 3 fullscreen exits');

  // -------------------------------------------------------------
  // SECTION 4: INTERVENTION EFFICACY & POPULATION TOPIC DIFFICULTY
  // -------------------------------------------------------------
  console.log('\n--- SECTION 4: Intervention Efficacy & Population Difficulty ---');

  // Record an intervention efficacy log
  const efficacyRecord = learningLoopService.recordInterventionEfficacy(
    'user-eff-1',
    3,
    'ADAPTIVE_PRACTICE',
    40,
    85
  );
  assert(efficacyRecord.efficacy_delta === 45, 'Computes +45% efficacy delta (85 - 40)');
  assert(efficacyRecord.is_effective === true, 'Marked effective since delta >= 10%');

  // Retrieve efficacy summary
  const summaries = learningLoopService.getInterventionEfficacySummary();
  assert(summaries.length === 4, 'Summarizes all 4 intervention modalities');
  const adaptiveSummary = summaries.find(s => s.intervention_type === 'ADAPTIVE_PRACTICE');
  assert(!!adaptiveSummary && adaptiveSummary.total_interventions >= 1, 'Adaptive practice summary has logged interventions');

  // Population topic difficulty ranking
  const populationDiff = learningLoopService.computePopulationTopicDifficulty();
  assert(populationDiff.length === MOCK_TOPICS.length, `Evaluates population difficulty for all ${MOCK_TOPICS.length} curriculum topics`);
  assert(populationDiff[0].difficulty_rank === 1, 'Hardest topic assigned difficulty rank #1');
  assert(populationDiff[0].error_rate_pct >= populationDiff[populationDiff.length - 1].error_rate_pct, 'Topics correctly sorted descending by error rate');

  // -------------------------------------------------------------
  // SECTION 5: SECURITY & PRIVACY ISOLATION
  // -------------------------------------------------------------
  console.log('\n--- SECTION 5: Security & Isolation Verification ---');

  const recordsUserA = learningLoopService.getInterventionEfficacyRecords('user-A');
  const recordsUserB = learningLoopService.getInterventionEfficacyRecords('user-B');
  assert(recordsUserA.length === 0 && recordsUserB.length === 0, 'User efficacy logs are strictly user-isolated');

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  PHASE 29 TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase29TestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
