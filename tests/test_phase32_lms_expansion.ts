/**
 * FINANCEX PHASE 32 — COMPLETE MULTI-ROLE LMS TEST SUITE
 * Test-Driven Development (TDD) for Learner, Instructor & Admin Workflows.
 */

import { lmsService } from '../src/services/lmsService';
import { CourseEnrollmentRecord, LMSAssignmentSubmission } from '../src/types/schema';

function assert(description: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    console.error(`  ❌ [FAIL] ${description} ${details ? `(${details})` : ''}`);
    throw new Error(`Test failed: ${description} - ${details || ''}`);
  }
}

async function runLmsTestSuite() {
  console.log('================================================================');
  console.log('  FINANCEX PHASE 32 — COMPLETE MULTI-ROLE LMS TEST MATRIX       ');
  console.log('================================================================');

  // Reset state to clean deterministic baseline before tests
  lmsService.resetDemoData();

  // -------------------------------------------------------------
  // SUITE 1: Centralized Demo Data & Institutional Metrics
  // -------------------------------------------------------------
  console.log('\n--- Section 1: Centralized Deterministic Demo State ---');
  const instructors = lmsService.getInstructors();
  assert('Instructors seed loaded with 4 certified faculty members', instructors.length === 4);
  assert('Lead faculty Dr. R. Subramanian assigned to Course 3 (NISM XV)', instructors[0].assigned_course_ids.includes(3));

  const batches = lmsService.getBatches();
  assert('Active cohorts loaded across all 4 financial disciplines', batches.length >= 4);

  const initialStats = lmsService.getInstitutionStats();
  assert('Computes total learners and enrollments accurately', initialStats.totalEnrollments >= 8);
  assert('Initial pending evaluations tracked consistently', initialStats.pendingEvaluations === 2);

  // -------------------------------------------------------------
  // SUITE 2: Learner Enrollment & Progress Workflow
  // -------------------------------------------------------------
  console.log('\n--- Section 2: Learner Course Enrollment Workflow ---');
  const enrollResult = lmsService.enrollLearner('learner-002', 1, 'batch-deriv-2026-a');
  assert('Learner successfully enrolls in Course 1 batch', enrollResult.success === true && !!enrollResult.enrollment);
  
  const updatedEnrollments = lmsService.getLearnerEnrollments('learner-002');
  const newlyEnrolled = updatedEnrollments.find(e => e.course_id === 1);
  assert('Enrollment reflected in learner course records', newlyEnrolled !== undefined);
  assert('Initial progress is initialized cleanly at 0%', newlyEnrolled?.progress_pct === 0);

  // Negative test: Duplicate enrollment prevention
  const duplicateEnrollResult = lmsService.enrollLearner('learner-002', 1, 'batch-deriv-2026-a');
  assert('Rejects duplicate enrollment in the same course', duplicateEnrollResult.success === false);

  // -------------------------------------------------------------
  // SUITE 3: Assignment Submission & Financial Model Upload
  // -------------------------------------------------------------
  console.log('\n--- Section 3: Assignment Submission Workflow ---');
  const pendingBefore = lmsService.getInstitutionStats().pendingEvaluations;

  const submitResult = lmsService.submitAssignment({
    assignment_id: 'asg-val-01',
    assignment_title: 'Unlevered Free Cash Flow (FCFF) Projection',
    course_id: 4,
    course_title: 'Advanced Financial Statement Analysis & DCF Valuation',
    learner_id: 'learner-007',
    learner_name: 'Vikramaditya Bose',
    learner_email: 'vikram.bose@sample.edu',
    batch_id: 'batch-val-2026-w',
    content_text: 'Discrete 5-year FCFF forecast completed with WACC = 10.4% and terminal growth rate g = 4.5%. Enterprise Value = ₹4,850 Cr.',
    quantitative_work: {
      assumptions: { wacc: 10.4, terminal_growth: 4.5, exit_ebitda_multiple: 14.0 },
      calculated_metrics: { enterprise_value_cr: 4850, equity_value_per_share: 840 },
      financial_model_output: 'FCFF discrete discounting with half-year mid-year convention applied.'
    },
    max_score: 100
  });

  assert('Learner submits quantitative assignment successfully', submitResult.success === true && !!submitResult.submission);
  assert('New submission starts in SUBMITTED status', submitResult.submission?.status === 'SUBMITTED');

  const pendingAfterSubmit = lmsService.getInstitutionStats().pendingEvaluations;
  assert('Pending evaluations count increments on assignment submission', pendingAfterSubmit === pendingBefore + 1);

  // -------------------------------------------------------------
  // SUITE 4: Instructor Grading & Shared-State Synchronization
  // -------------------------------------------------------------
  console.log('\n--- Section 4: Instructor Evaluation & Cross-Role Sync ---');
  const submissionToGrade = submitResult.submission!;
  
  const gradeResult = lmsService.evaluateSubmission(
    submissionToGrade.submission_id,
    'inst-004',
    'Rajeshwar Sen',
    96,
    'Outstanding DCF modeling. Mid-year discounting was properly formulated and sensitivity table provided.',
    {
      'FCFF Derivation from EBIT': 34,
      'WACC Computation': 34,
      'Sensitivity Table & Football Field': 28
    }
  );

  assert('Instructor successfully evaluates submission', gradeResult.success === true && !!gradeResult.submission);
  assert('Submission transitions to GRADED status', gradeResult.submission?.status === 'GRADED');
  assert('Grade captures evaluator instructor ID and feedback', gradeResult.submission?.evaluator_name === 'Rajeshwar Sen');

  // Multi-Dashboard Reactivity Verifications:
  // 1. Pending evaluation decreases
  const pendingAfterGrade = lmsService.getInstitutionStats().pendingEvaluations;
  assert('Pending evaluations count decrements by 1 after grading', pendingAfterGrade === pendingAfterSubmit - 1);

  // 2. Learner course performance & enrollment reflects grade
  const learnerEnrollments = lmsService.getLearnerEnrollments('learner-007');
  const dcfEnrollment = learnerEnrollments.find(e => e.course_id === 4);
  assert('Learner course enrollment reflects assignment grade', dcfEnrollment !== undefined && dcfEnrollment.assignment_avg_score >= 95);

  // 3. Activity ledger records evaluation
  const recentEvents = lmsService.getActivityEvents(5);
  const evaluationEvent = recentEvents.find(e => e.type === 'ASSIGNMENT_GRADED');
  assert('Activity log records assignment evaluation event', evaluationEvent !== undefined);

  // -------------------------------------------------------------
  // SUITE 5: Course Completion & Certificate Issuance
  // -------------------------------------------------------------
  console.log('\n--- Section 5: Course Completion & Certificate Generation ---');
  const completeResult = lmsService.completeCourseEnrollment('learner-002', 3);
  assert('Completing all course requirements marks enrollment as COMPLETED', completeResult.success === true);
  assert('Automatically generates deterministic sample certificate ID', completeResult.enrollment?.certificate_id?.startsWith('FX-CERT-') === true);
  assert('Enrollment progress reached 100%', completeResult.enrollment?.progress_pct === 100);

  // Digital Certificate Cryptographic Verification Engine
  const validVerification = lmsService.verifyCertificate('FX-CERT-2026-0814');
  assert('Validates genuine certificate ID from registry', validVerification.isValid === true && validVerification.status === 'AUTHENTICATED');
  assert('Verification returns cryptographic SHA256 checksum', validVerification.digitalChecksum?.startsWith('SHA256:') === true);
  assert('Verification returns correct recipient and course', validVerification.learnerName === 'Sameer Joshi' && validVerification.courseTitle.includes('Mutual Fund'));

  const invalidVerification = lmsService.verifyCertificate('FX-FAKE-2026-9999');
  assert('Rejects non-existent or counterfeit certificate ID', invalidVerification.isValid === false && invalidVerification.status === 'NOT_FOUND');

  // -------------------------------------------------------------
  // SUITE 6: Institutional Reports & CSV Generation
  // -------------------------------------------------------------
  console.log('\n--- Section 6: Institutional Reporting & CSV Export ---');
  const enrollmentCsv = lmsService.exportReportCSV('ENROLLMENT');
  assert('Enrollment CSV contains standard CSV headers', enrollmentCsv.includes('Enrollment ID,Learner Name,Email,Course,Batch,Status'));
  assert('Enrollment CSV includes sample learner records', enrollmentCsv.includes('Alex Rivera') && enrollmentCsv.includes('learner@financex.com'));

  // PII Privacy Masking in CSV exports (DPDP & GDPR Compliance)
  const maskedEnrollmentCsv = lmsService.exportReportCSV('ENROLLMENT', { maskPII: true });
  assert('Masked CSV indicates privacy enforced mode in header', maskedEnrollmentCsv.includes('Privacy Mode: ENFORCED (PII Masked)'));
  assert('Masked CSV redacts learner email addresses', !maskedEnrollmentCsv.includes('learner@financex.com') && maskedEnrollmentCsv.includes('l***r@financex.com'));

  const instructorCsv = lmsService.exportReportCSV('INSTRUCTOR');
  assert('Instructor report includes faculty ratings and course allocations', instructorCsv.includes('Dr. R. Subramanian') && instructorCsv.includes('Rating'));

  // -------------------------------------------------------------
  // SUITE 7: Demo Data Reset Integrity
  // -------------------------------------------------------------
  console.log('\n--- Section 7: Reset Demo Data Guarantee ---');
  lmsService.resetDemoData();
  const resetStats = lmsService.getInstitutionStats();
  assert('Reset returns pending evaluations to deterministic seed count (2)', resetStats.pendingEvaluations === 2);

  console.log('\n================================================================');
  console.log('  ALL 22 PHASE 32 LMS TESTS PASSED SUCCESSFULLY (100% GREEN)    ');
  console.log('================================================================\n');
}

runLmsTestSuite().catch((err) => {
  console.error('\nLMS Test Suite execution encountered fatal error:', err);
  process.exit(1);
});

