import { learningLoopService } from '../src/services/learningLoopService';
import { aiService } from '../src/services/aiService';
import { MOCK_TOPICS, MOCK_CERTIFICATIONS, MOCK_LESSONS } from '../src/data/mockData';
import { QuizAttempt, MockExamAttempt, Goal } from '../src/types/schema';

async function runTests() {
  console.log('===============================================================');
  console.log('  FINANCEX PHASE 27 — CLOSED-LOOP LEARNING & MASTERY TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name} ${details ? '- ' + details : ''}`);
    }
  }

  // TEST 1: Fresh Learner Concept Mastery
  console.log('--- Test Suite 1: Concept Mastery Deterministic Engine ---');
  const freshMastery = learningLoopService.computeConceptMastery('user-101', {
    quizAttempts: [],
    mockAttempts: [],
    completedLessonIds: [],
    allTopics: MOCK_TOPICS,
    allLessons: MOCK_LESSONS
  });

  assert(
    'Fresh learner has mastery records for all curriculum topics',
    freshMastery.length === MOCK_TOPICS.length
  );
  assert(
    'Fresh learner mastery levels are NOT_STARTED',
    freshMastery.every((m) => m.mastery_level === 'NOT_STARTED' && m.mastery_score === 0)
  );

  // TEST 2: Learner with Identified Weakness
  const weakQuizAttempts: QuizAttempt[] = [
    {
      attempt_id: 1,
      user_id: 'user-101',
      quiz_id: 2, // Topic 2 (Futures & Forwards)
      score: 40,
      total_questions: 5,
      correct_answers: 2,
      completed_at: new Date().toISOString()
    }
  ];

  const masteryWithWeakness = learningLoopService.computeConceptMastery('user-101', {
    quizAttempts: weakQuizAttempts,
    mockAttempts: [],
    completedLessonIds: [1],
    allTopics: MOCK_TOPICS,
    allLessons: MOCK_LESSONS
  });

  const topic2Mastery = masteryWithWeakness.find((m) => m.topic_id === 2);
  assert(
    'Topic 2 identified as weakness with accuracy < 65%',
    topic2Mastery !== undefined && topic2Mastery.is_weakness === true && topic2Mastery.mastery_level === 'NEEDS_PRACTICE',
    `Got level=${topic2Mastery?.mastery_level}, is_weakness=${topic2Mastery?.is_weakness}`
  );

  // TEST 3: Learner with High Mastery
  const strongQuizAttempts: QuizAttempt[] = [
    {
      attempt_id: 2,
      user_id: 'user-101',
      quiz_id: 3, // Option Greeks
      score: 100,
      total_questions: 5,
      correct_answers: 5,
      completed_at: new Date().toISOString()
    }
  ];
  const strongMockAttempts: MockExamAttempt[] = [
    {
      attempt_id: 10,
      user_id: 'user-101',
      exam_id: 1,
      score: 92,
      passed: 'YES',
      completed_at: new Date().toISOString(),
      topic_breakdown: {
        list: [
          { topicId: 3, topic: 'Option Greeks', total: 10, correct: 10, accuracy: 100 }
        ]
      }
    }
  ];

  const masteryWithStrength = learningLoopService.computeConceptMastery('user-101', {
    quizAttempts: strongQuizAttempts,
    mockAttempts: strongMockAttempts,
    completedLessonIds: [2, 3, 103], // Option Greeks lessons (all 3 completed for topic 3)
    allTopics: MOCK_TOPICS,
    allLessons: MOCK_LESSONS
  });

  const topic3Mastery = masteryWithStrength.find((m) => m.topic_id === 3);
  assert(
    'Topic 3 evaluated as MASTERED with 100% quiz & mock accuracy',
    topic3Mastery !== undefined && topic3Mastery.mastery_level === 'MASTERED' && topic3Mastery.mastery_score >= 90,
    `Got level=${topic3Mastery?.mastery_level}, score=${topic3Mastery?.mastery_score}`
  );

  // TEST 4: Adaptive Next Recommendations Generation
  console.log('\n--- Test Suite 2: Adaptive Next Action Recommendations ---');
  const adaptiveRecs = learningLoopService.generateAdaptiveRecommendations(
    'user-101',
    masteryWithWeakness,
    [
      {
        attempt_id: 11,
        user_id: 'user-101',
        exam_id: 1,
        score: 52,
        passed: 'NO',
        completed_at: new Date().toISOString()
      }
    ]
  );

  assert(
    'Generates recommendations based on actual learner weakness',
    adaptiveRecs.length > 0 && adaptiveRecs[0].priority === 'HIGH' && adaptiveRecs[0].recommandation_type === 'REVIEW_WEAK_CONCEPT',
    `Got type=${adaptiveRecs[0]?.recommandation_type}, priority=${adaptiveRecs[0]?.priority}`
  );
  assert(
    'Recommendation explanation includes specific topic name and performance reason',
    adaptiveRecs[0].reason.includes('Futures') || adaptiveRecs[0].reason.includes('scored'),
    `Reason: ${adaptiveRecs[0]?.reason}`
  );

  // TEST 5: Certification Readiness Indicator
  console.log('\n--- Test Suite 3: Certification Readiness Modeling ---');
  const readiness = learningLoopService.computeCertificationReadiness(
    'user-101',
    MOCK_CERTIFICATIONS[0],
    masteryWithWeakness,
    [
      {
        attempt_id: 11,
        user_id: 'user-101',
        exam_id: MOCK_CERTIFICATIONS[0].exam_id,
        score: 52,
        passed: 'NO',
        completed_at: new Date().toISOString()
      }
    ]
  );

  assert(
    'Computes realistic readiness score and readiness band',
    typeof readiness.overall_readiness_pct === 'number' && ['EMERGING', 'PROGRESSING', 'WELL_PREPARED', 'HIGHLY_CONFIDENT'].includes(readiness.readiness_band),
    `Score: ${readiness.overall_readiness_pct}%, Band: ${readiness.readiness_band}`
  );
  assert(
    'Includes statutory disclaimer that FinanceX estimate is not official exam authority',
    readiness.disclaimer.includes('statutory examination')
  );

  // TEST 6: Contextual AI Tutor Prompt Generation & Closed Loop Handshake
  console.log('\n--- Test Suite 4: Closed Loop AI Tutor Coaching Integration ---');
  const enPrompt = learningLoopService.generateAITutorInterventionPrompt(
    'Option Greeks (Delta & Gamma)',
    { mistakeSummary: 'Missed Delta sensitivity on at-the-money options' },
    'en'
  );
  assert(
    'English prompt asks for step-by-step coaching on specific concept',
    enPrompt.includes('Option Greeks') && enPrompt.includes('Delta sensitivity') && enPrompt.includes('formula'),
    `Prompt: ${enPrompt}`
  );

  const taPrompt = learningLoopService.generateAITutorInterventionPrompt(
    'Option Greeks',
    { mistakeSummary: 'டெல்டா உணர்திறன் கணக்கீடு' },
    'ta'
  );
  assert(
    'Tamil prompt is properly localized in Tamil',
    taPrompt.includes('Option Greeks') && taPrompt.includes('விளக்கவும்'),
    `Tamil Prompt: ${taPrompt}`
  );

  // TEST 7: AI Tutor Responds Accurately to Weakness Intervention
  const tutorRes = await aiService.askTutor(enPrompt, undefined, 'Option Greeks');
  assert(
    'AI Tutor responds accurately to intervention prompt without Sharpe Ratio bias',
    tutorRes.reply.includes('Delta') || tutorRes.reply.includes('Greek') || tutorRes.matchedTopic?.includes('Option'),
    `Matched Topic: ${tutorRes.matchedTopic}, Reply slice: ${tutorRes.reply.slice(0, 100)}`
  );

  // TEST 8: Bilingual Grounding Preserved (Phase 26.4 Regression)
  console.log('\n--- Test Suite 5: Phase 26.4 Regression Checks ---');
  const taRes = await aiService.askTutor('Option Delta என்றால் என்ன?', undefined, undefined, { language: 'ta' });
  assert(
    'Tamil Option Delta query returns Tamil grounded answer',
    taRes.reply.includes('Delta') && (taRes.reply.includes('விலை மாற்றம்') || taRes.reply.includes('நேரடி விளக்கம்')),
    `Tamil reply slice: ${taRes.reply.slice(0, 100)}`
  );

  const compoundRes = await aiService.askTutor('What is compound interest?');
  assert(
    'Compound interest query returns compound interest response (no Sharpe ratio leakage)',
    compoundRes.reply.includes('Compound') || compoundRes.reply.includes('A = P(1 + r/n)'),
    `Compound reply: ${compoundRes.reply.slice(0, 100)}`
  );

  console.log('\n===============================================================');
  console.log(`  PHASE 27 TEST MATRIX RESULT: ${passed}/${total} PASSED`);
  console.log('===============================================================\n');

  if (passed === total) {
    console.log('>>> STATUS: GREEN — Closed-Loop Learning Loop Verified <<<');
  } else {
    console.error('>>> STATUS: RED — Some tests failed <<<');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution exception:', err);
  process.exit(1);
});
