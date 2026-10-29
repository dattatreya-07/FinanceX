import { adminService } from '../src/services/adminService';
import { complianceExportService, calculateReportChecksum } from '../src/services/complianceExportService';
import { itemRevisionService } from '../src/services/itemRevisionService';
import { assessmentIntelligenceService } from '../src/services/assessmentIntelligenceService';
import { cohortAnalyticsService } from '../src/services/cohortAnalyticsService';
import { MOCK_QUESTIONS } from '../src/data/mockData';
import { User, Question } from '../src/types/schema';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
  }
}

async function runPhase30EnterpriseGovernanceTests() {
  console.log('================================================================');
  console.log('FINANCEX PHASE 30 — ENTERPRISE GOVERNANCE & COMPLIANCE TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST GROUP 1: Multi-Tenant Architecture & Scoped RBAC
  // -------------------------------------------------------------
  console.log('🔷 1. MULTI-TENANT ARCHITECTURE & SCOPED RBAC');
  
  const superAdminUser: User = {
    user_id: 'usr-super-01',
    full_name: 'Chief Compliance Officer',
    email: 'cco@financex.internal',
    phone_number: '+919876543210',
    account_status: 'ACTIVE',
    role: 'SUPER_ADMIN',
    knowledge_level_id: 3,
    current_streak: 10,
    longest_streak: 20,
    social_links: []
  };

  const institutionAdminUser: User = {
    user_id: 'usr-inst-adm-01',
    full_name: 'HDFC Training Director',
    email: 'director.training@hdfcbank.com',
    phone_number: '+919876543211',
    account_status: 'ACTIVE',
    role: 'INSTITUTION_ADMIN',
    organization: 'HDFC Bank Treasury & Markets',
    knowledge_level_id: 2,
    current_streak: 5,
    longest_streak: 10,
    social_links: []
  };

  const learnerUser: User = {
    user_id: 'usr-lrn-01',
    full_name: 'Aditi Sharma',
    email: 'aditi.sharma@hdfcbank.com',
    phone_number: '+919876543212',
    account_status: 'ACTIVE',
    role: 'USER',
    organization: 'HDFC Bank Treasury & Markets',
    knowledge_level_id: 1,
    current_streak: 3,
    longest_streak: 5,
    social_links: []
  };

  assert(
    adminService.hasAdminPrivileges(superAdminUser),
    'SUPER_ADMIN has full administrative authorization'
  );

  assert(
    adminService.hasAdminPrivileges(institutionAdminUser),
    'INSTITUTION_ADMIN has tenant administration authorization'
  );

  assert(
    !adminService.hasAdminPrivileges(learnerUser),
    'Regular USER / LEARNER is denied administrative authorization'
  );

  const institutions = await adminService.getInstitutions();
  assert(
    institutions.length >= 4,
    `Retrieved ${institutions.length} enterprise tenant institutions`
  );

  const hdfc = institutions.find(i => i.institution_id === 'inst-hdfc-01');
  assert(
    hdfc !== undefined && hdfc.license_tier === 'ENTERPRISE' && hdfc.seats_allocated > 0,
    'HDFC Bank institution correctly loaded with enterprise license tier and seat allocation'
  );

  // Cross-tenant data isolation test
  const globalDossier = await complianceExportService.getComplianceDossier('ALL');
  const hdfcDossier = await complianceExportService.getComplianceDossier('inst-hdfc-01');
  const iciciDossier = await complianceExportService.getComplianceDossier('inst-icici-02');

  assert(
    globalDossier.length >= hdfcDossier.length && hdfcDossier.length > 0,
    'Global dossier contains all institutional candidate records'
  );

  assert(
    hdfcDossier.every(r => r.institution_id === 'inst-hdfc-01'),
    'HDFC scoped query contains strictly HDFC candidate records'
  );

  assert(
    iciciDossier.every(r => r.institution_id === 'inst-icici-02'),
    'ICICI scoped query contains strictly ICICI candidate records'
  );

  const crossTenantLeakage = hdfcDossier.some(r => r.institution_id === 'inst-icici-02');
  assert(
    !crossTenantLeakage,
    'Zero cross-tenant data leakage between distinct institutional scopes'
  );

  // -------------------------------------------------------------
  // TEST GROUP 2: Compliance CSV Exports & Cryptographic Integrity
  // -------------------------------------------------------------
  console.log('\n🔷 2. COMPLIANCE CSV EXPORTS & AUDIT INTEGRITY');

  // 2a. Learner Compliance CSV
  const learnerExport = complianceExportService.generateLearnerComplianceCsv(hdfcDossier, {
    institution_id: 'inst-hdfc-01',
    institution_name: 'HDFC Bank Treasury & Markets',
    requested_by_user_id: institutionAdminUser.user_id,
    requested_by_role: 'INSTITUTION_ADMIN'
  });

  assert(
    learnerExport.csvContent.includes('# FINANCEX ENTERPRISE COMPLIANCE & AUDIT REPORT'),
    'Learner compliance CSV contains standard compliance metadata header banner'
  );

  assert(
    learnerExport.csvContent.includes('# Report Type: LEARNER_READINESS_AUDIT'),
    'Learner compliance CSV specifies exact Report Type in audit metadata'
  );

  assert(
    learnerExport.csvContent.includes('Learner ID,Learner Name,Email,Institution ID'),
    'Learner compliance CSV includes standard tabular CSV column headers'
  );

  assert(
    Boolean(learnerExport.exportDef.checksum_sha256?.startsWith('fx-sha256-')),
    `Report generated deterministic verification checksum: ${learnerExport.exportDef.checksum_sha256}`
  );

  // 2b. Cohort Performance CSV
  const cohorts = cohortAnalyticsService.getCohortBenchmarks();
  const cohortExport = complianceExportService.generateCohortPerformanceCsv(cohorts, {
    institution_id: 'ALL',
    institution_name: 'Global Platform Scope',
    requested_by_user_id: superAdminUser.user_id,
    requested_by_role: 'SUPER_ADMIN'
  });

  assert(
    cohortExport.csvContent.includes('# Report Type: COHORT_COMPLIANCE_SUMMARY'),
    'Cohort statistical CSV specifies COHORT_COMPLIANCE_SUMMARY report type'
  );

  assert(
    cohortExport.csvContent.includes('Cohort ID,Cohort Name,Dimension,Certification Name'),
    'Cohort statistical CSV includes percentile and dimension headers'
  );

  // 2c. Item Psychometric Audit CSV
  const itemMetrics = assessmentIntelligenceService.computeItemAnalysis(MOCK_QUESTIONS);
  const itemExport = complianceExportService.generateItemQualityAuditCsv(itemMetrics, {
    institution_id: 'ALL',
    institution_name: 'Global Platform Scope',
    requested_by_user_id: superAdminUser.user_id,
    requested_by_role: 'SUPER_ADMIN'
  });

  assert(
    itemExport.csvContent.includes('# Report Type: ITEM_PSYCHOMETRIC_AUDIT'),
    'Item quality audit CSV specifies ITEM_PSYCHOMETRIC_AUDIT report type'
  );

  assert(
    itemExport.csvContent.includes('Difficulty Index (p),Discrimination Index (D),Point-Biserial (r)'),
    'Item quality audit CSV includes psychometric measurement columns'
  );

  // Checksum stability test
  const contentA = 'ColA,ColB\n123,456';
  const checksumA1 = calculateReportChecksum(contentA);
  const checksumA2 = calculateReportChecksum(contentA);
  const checksumB = calculateReportChecksum('ColA,ColB\n123,457');

  assert(
    checksumA1 === checksumA2,
    'Report checksum calculation is strictly deterministic'
  );

  assert(
    checksumA1 !== checksumB,
    'Report checksum changes when underlying audit content changes'
  );

  // -------------------------------------------------------------
  // TEST GROUP 3: Human-in-the-Loop AI Item Revision Workflow
  // -------------------------------------------------------------
  console.log('\n🔷 3. HUMAN-IN-THE-LOOP AI ITEM REVISION WORKFLOW');

  const allProposals = itemRevisionService.getAllProposals();
  assert(
    allProposals.length >= 2,
    `Loaded ${allProposals.length} item revision proposals in repository`
  );

  const pendingProposals = itemRevisionService.getPendingProposals();
  assert(
    pendingProposals.every(p => p.status === 'PENDING_REVIEW'),
    'All pending proposals have status PENDING_REVIEW'
  );

  // Generate new revision proposal for a flawed question
  const sampleQuestion: Question = {
    question_id: 999,
    topic_id: 1,
    question_text: 'What is the payoff of a long call option at expiration?',
    option_a: 'Max(0, S - X)',
    option_b: 'Max(0, X - S)',
    option_c: 'S + X',
    option_d: 'S - X',
    correct_option: 'A',
    difficulty: 'EASY',
    explanation: 'Long call payoff is Max(0, S - X).'
  };

  const sampleFlawedMetric = {
    question_id: 999,
    question_text: sampleQuestion.question_text,
    topic_id: 1,
    topic_name: 'Derivatives',
    difficulty: 'EASY' as const,
    total_attempts: 100,
    correct_attempts: 96,
    difficulty_index_p: 0.96, // Flawed: too easy
    discrimination_index_d: 0.12, // Flawed: low discrimination
    point_biserial_r: 0.10,
    distractor_distribution: { A: 96, B: 2, C: 1, D: 1 },
    quality_status: 'TOO_EASY' as const,
    recommendation: 'Too easy; enhance distractors',
    is_flagged_for_review: true
  };

  const newProposal = itemRevisionService.generateRevisionProposal(sampleQuestion, sampleFlawedMetric);

  assert(
    newProposal.status === 'PENDING_REVIEW',
    'Generated AI revision proposal starts strictly in PENDING_REVIEW status (No silent auto-publishing)'
  );

  assert(
    newProposal.question_text_proposed.length > 0 && newProposal.options_proposed.length === 4,
    'AI proposal provides updated question stem and balanced distractor set'
  );

  assert(
    newProposal.reason.includes('high pass rate') || newProposal.reason.includes('discrimination'),
    'AI proposal provides clear psychometric diagnostic justification'
  );

  // Human-in-the-loop Approval Action
  const approvedProposal = itemRevisionService.approveProposal(newProposal.proposal_id, 'assessor-admin-01');
  assert(
    approvedProposal !== null && approvedProposal.status === 'APPROVED',
    'Assessment manager approval successfully transitions proposal to APPROVED state'
  );

  assert(
    approvedProposal?.reviewed_by_user_id === 'assessor-admin-01' && Boolean(approvedProposal?.reviewed_at),
    'Approval captures reviewer user ID and ISO timestamp'
  );

  // Human-in-the-loop Rejection Action
  const rejectTestProposal = itemRevisionService.generateRevisionProposal({
    ...sampleQuestion,
    question_id: 998
  }, sampleFlawedMetric);

  const rejected = itemRevisionService.rejectProposal(rejectTestProposal.proposal_id, 'assessor-admin-01', 'Stem lacks clarity');
  assert(
    rejected !== null && rejected.status === 'REJECTED' && rejected.reason.includes('Stem lacks clarity'),
    'Assessment manager rejection transitions proposal to REJECTED state with explanation'
  );

  // -------------------------------------------------------------
  // TEST GROUP 4: Immutable Administrative Audit Trail & Ledger
  // -------------------------------------------------------------
  console.log('\n🔷 4. IMMUTABLE ADMINISTRATIVE AUDIT TRAIL');

  await adminService.logAdminAction(
    superAdminUser,
    'EXPORT',
    'REPORT',
    'EXP-COMP-TEST-01',
    'Compliance export test execution',
    { institution_id: 'inst-hdfc-01', checksum: learnerExport.exportDef.checksum_sha256 }
  );

  const recentLogs = await adminService.getAuditLogs(10);
  assert(
    recentLogs.length > 0,
    `Audit ledger active with ${recentLogs.length} recent log entries`
  );

  const latestLog = recentLogs[0];
  assert(
    latestLog.action === 'EXPORT' && latestLog.entity_type === 'REPORT',
    'Latest audit entry records export mutation accurately'
  );

  const hdfcScopedLogs = await adminService.getAuditLogs(10, 'inst-hdfc-01');
  assert(
    hdfcScopedLogs.length > 0 && hdfcScopedLogs.every(l => l.details?.institution_id === 'inst-hdfc-01' || l.admin_email.includes('hdfcbank.com')),
    'Audit logs correctly filter by institutional tenant scope'
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`PHASE 30 TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (passedTests === totalTests) {
    console.log('🎉 ALL PHASE 30 ENTERPRISE GOVERNANCE & COMPLIANCE TESTS PASSED (100% GREEN)');
  } else {
    console.error(`⚠️ ${totalTests - passedTests} TESTS FAILED`);
  }
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase30EnterpriseGovernanceTests().catch((err) => {
  console.error('Fatal error during Phase 30 test execution:', err);
  process.exit(1);
});
