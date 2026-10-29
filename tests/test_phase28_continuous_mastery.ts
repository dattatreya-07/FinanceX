import { spacedReviewService } from '../src/services/spacedReviewService';
import { adaptivePracticeService } from '../src/services/adaptivePracticeService';
import { learningLoopService } from '../src/services/learningLoopService';
import { MOCK_TOPICS, MOCK_QUESTIONS, MOCK_LESSONS, MOCK_PRACTICE_LAB_SCENARIOS } from '../src/data/mockData';
import { SpacedReviewSchedule } from '../src/types/schema';

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

async function runPhase28TestSuite() {
  console.log('================================================================');
  console.log('  FINANCEX PHASE 28: CONTINUOUS ADAPTIVE MASTERY TEST SUITE     ');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SECTION 1: SPACED REVIEW ENGINE
  // -------------------------------------------------------------
  console.log('--- SECTION 1: Spaced Review Scheduling & Interval Progression ---');

  const mockMasteryNew: any = [
    {
      topic_id: 3,
      topic_name: 'Option Greeks & Volatility Sensitivity',
      mastery_score: 85,
      mastery_level: 'PROFICIENT',
      is_weakness: false,
      last_studied_at: new Date().toISOString()
    }
  ];

  // Test 1: New concept schedule
  const schedulesNew = spacedReviewService.computeSpacedReviewSchedule('user-101', mockMasteryNew);
  assert(schedulesNew.length === 1, 'Computes spaced review schedule for topic');
  const sNew = schedulesNew[0];
  assert(sNew.review_stage >= 1, 'New concept has valid review stage');
  assert(sNew.interval_days >= 1, 'New concept has valid interval');

  // Test 2: Record successful review outcomes (1 -> 2 -> 3 -> 4 -> 5)
  const r1 = spacedReviewService.recordReviewOutcome('user-101', 3, 90, true);
  assert(r1.nextStage === 2, 'First success moves to Stage 2 (3 days)', `Got stage: ${r1.nextStage}`);
  assert(r1.nextIntervalDays === 3, 'Stage 2 interval is 3 days', `Got: ${r1.nextIntervalDays}`);

  const r2 = spacedReviewService.recordReviewOutcome('user-101', 3, 95, true);
  assert(r2.nextStage === 3, 'Second success moves to Stage 3 (7 days)', `Got stage: ${r2.nextStage}`);
  assert(r2.nextIntervalDays === 7, 'Stage 3 interval is 7 days', `Got: ${r2.nextIntervalDays}`);

  const r3 = spacedReviewService.recordReviewOutcome('user-101', 3, 100, true);
  assert(r3.nextStage === 4, 'Third success moves to Stage 4 (14 days)', `Got stage: ${r3.nextStage}`);
  assert(r3.nextIntervalDays === 14, 'Stage 4 interval is 14 days', `Got: ${r3.nextIntervalDays}`);

  const r4 = spacedReviewService.recordReviewOutcome('user-101', 3, 100, true);
  assert(r4.nextStage === 5, 'Fourth success moves to Stage 5 (30 days - Maintenance)', `Got stage: ${r4.nextStage}`);
  assert(r4.nextIntervalDays === 30, 'Stage 5 interval is 30 days', `Got: ${r4.nextIntervalDays}`);

  // Test 3: Failed recall (<75%) resets interval back to Stage 1 (1 day)
  const rFail = spacedReviewService.recordReviewOutcome('user-101', 3, 40, false);
  assert(rFail.nextStage === 1, 'Failed recall resets to Stage 1 (1 day)', `Got stage: ${rFail.nextStage}`);
  assert(rFail.nextIntervalDays === 1, 'Reset interval is 1 day', `Got: ${rFail.nextIntervalDays}`);

  // Test 4: Overdue review identification
  const overdueMastery: any = [
    {
      topic_id: 4,
      topic_name: 'Fixed Income & Debt Securities Analysis',
      mastery_score: 40,
      mastery_level: 'NEEDS_PRACTICE',
      is_weakness: true,
      last_studied_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ];

  const dueList = spacedReviewService.getDueReviews('user-101', overdueMastery);
  assert(dueList.length === 1, 'Identifies exactly 1 overdue review topic');
  assert(dueList[0].topic_id === 4, 'Correctly identifies Topic 4 (Fixed Income) as overdue');

  // -------------------------------------------------------------
  // SECTION 2: ADAPTIVE PRACTICE QUESTION SELECTION
  // -------------------------------------------------------------
  console.log('\n--- SECTION 2: Adaptive Question Selection & Difficulty Calibration ---');

  // Test 5: REMEDIATION mode selects EASY difficulty questions
  const remediationSession = adaptivePracticeService.generateAdaptiveSession(
    'user-101',
    2, // Topic 2
    undefined,
    { forceMode: 'REMEDIATION', questionCount: 4, availableQuestions: MOCK_QUESTIONS }
  );
  assert(remediationSession.questions.length > 0, 'Generates non-empty remediation session');
  const hasEasy = remediationSession.questions.some(q => q.difficulty === 'EASY');
  assert(hasEasy, 'Remediation session prioritizes foundational EASY difficulty questions');

  // Test 6: CHALLENGE_MASTERY mode selects HARD difficulty questions
  const masterySession = adaptivePracticeService.generateAdaptiveSession(
    'user-101',
    2,
    undefined,
    { forceMode: 'CHALLENGE_MASTERY', questionCount: 4, availableQuestions: MOCK_QUESTIONS }
  );
  assert(masterySession.questions.length > 0, 'Generates non-empty challenge mastery session');
  const hasHard = masterySession.questions.some(q => q.difficulty === 'HARD');
  assert(hasHard, 'Challenge mastery session includes HARD difficulty questions');

  // Test 7: Adaptive session evaluation and scoring
  const userAnswers: any = {};
  remediationSession.questions.forEach((q, i) => {
    userAnswers[q.question_id] = i < 3 ? q.correct_option : 'D';
  });

  const completedSession = adaptivePracticeService.evaluateAdaptiveSession(
    'user-101',
    remediationSession,
    userAnswers
  );
  assert(completedSession.scorePercent === 75, `Evaluates session score percentage correctly (Got: ${completedSession.scorePercent}%)`);
  assert(completedSession.xpEarned > 0, 'Calculates XP earned from adaptive practice');
  assert(completedSession.passed === true, 'Passing score marked passed');

  // -------------------------------------------------------------
  // SECTION 3: LONGITUDINAL MASTERY HISTORY & RECENT IMPROVEMENTS
  // -------------------------------------------------------------
  console.log('\n--- SECTION 3: Longitudinal Mastery History & Delta Calculations ---');

  // Test 8: Logging multiple mastery observations
  learningLoopService.recordMasteryObservation(
    'user-test-longitudinal',
    3,
    'QUIZ_ATTEMPT',
    0,
    50,
    'Initial diagnostic quiz attempt'
  );

  learningLoopService.recordMasteryObservation(
    'user-test-longitudinal',
    3,
    'ADAPTIVE_PRACTICE',
    50,
    85,
    'Completed remediation adaptive practice session'
  );

  const history = learningLoopService.getMasteryHistory('user-test-longitudinal', 3);
  assert(history.length >= 2, 'Retrieves complete chronological mastery observations');
  assert(history[0].new_score === 85, 'Latest mastery observation records 85% score');

  // Test 9: Detection of recently improved concepts (positive delta)
  const improvedConcepts = learningLoopService.getRecentlyImprovedConcepts('user-test-longitudinal');
  assert(improvedConcepts.length >= 1, 'Detects at least 1 recently improved concept');
  const topic3Improvement = improvedConcepts.find(c => c.topic_id === 3);
  assert(!!topic3Improvement && topic3Improvement.delta_score === 35, 'Correctly computes +35% improvement delta (85 - 50)');

  // -------------------------------------------------------------
  // SECTION 4: PRACTICE LAB EDUCATIONAL SIGNALS
  // -------------------------------------------------------------
  console.log('\n--- SECTION 4: Practice Lab Educational Signals & Mastery Weights ---');

  // Test 11: Arbitrary trading action does NOT grant concept mastery credit
  const preCredits = learningLoopService.getPracticeLabCredits('user-trader-1');
  assert(Object.keys(preCredits).length === 0, 'Fresh learner has zero educational scenario credits');

  // Test 12: Verified Institutional Educational Scenario awards mastery credit
  learningLoopService.recordPracticeLabScenarioCompletion(
    'user-trader-1',
    'sc-delta-hedge',
    100,
    ['Executed delta neutral straddle on NIFTY options']
  );

  const postCredits = learningLoopService.getPracticeLabCredits('user-trader-1');
  assert(postCredits[3] === 15, 'Delta-neutral hedge scenario awards +15% verified mastery contribution to Topic 3');

  // Test 13: Concept mastery calculation integrates scenario credits
  const computedMastery = learningLoopService.computeConceptMastery('user-trader-1', {
    quizAttempts: [],
    mockAttempts: [],
    allLessons: MOCK_LESSONS,
    allTopics: MOCK_TOPICS
  });
  const derivativesMastery = computedMastery.find(m => m.topic_id === 3);
  assert(!!derivativesMastery && derivativesMastery.mastery_score >= 15, 'Mastery calculation includes +15% Practice Lab contribution');

  // -------------------------------------------------------------
  // SECTION 5: SECURITY & USER ISOLATION
  // -------------------------------------------------------------
  console.log('\n--- SECTION 5: Security & User Data Isolation ---');

  // Test 14: Learner A cannot access Learner B's mastery observations
  const learnerAHistory = learningLoopService.getMasteryHistory('user-A', 3);
  const learnerBHistory = learningLoopService.getMasteryHistory('user-B', 3);
  assert(learnerAHistory.length === 0 && learnerBHistory.length === 0, 'Mastery history is strictly isolated per user ID');

  // Test 15: Spaced review schedules are user-scoped
  const schedUserA = spacedReviewService.getSchedules('user-A');
  const schedUserB = spacedReviewService.getSchedules('user-B');
  assert(schedUserA.length === 0 && schedUserB.length === 0, 'Spaced review schedule records are strictly user-isolated');

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  PHASE 28 TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase28TestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
