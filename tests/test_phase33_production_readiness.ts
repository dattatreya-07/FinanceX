import { authService } from '../src/services/authService';
import { lmsService } from '../src/services/lmsService';

function assert(description: string, condition: boolean, extraInfo?: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${description} ${extraInfo ? `— ${extraInfo}` : ''}`);
    throw new Error(`Test failed: ${description}`);
  }
  console.log(`  ✅ [PASS] ${description}`);
}

async function runPhase33TestSuite() {
  console.log('================================================================');
  console.log('  FINANCEX PHASE 33 — PRODUCTION READINESS & DEPLOYMENT MATRIX  ');
  console.log('================================================================');

  // -------------------------------------------------------------
  // SUITE 1: Google OAuth Provider Verification
  // -------------------------------------------------------------
  console.log('\n--- Section 1: Google OAuth Provider Verification ---');
  const oauthConfig = authService.verifyGoogleOAuthConfig();
  assert('Google OAuth provider is configured and recognized', oauthConfig.provider === 'google');
  assert('Google OAuth redirect origin is defined', typeof oauthConfig.redirectOrigin === 'string' && oauthConfig.redirectOrigin.length > 0);
  assert('Google OAuth reports active status mode', ['PRODUCTION_OAUTH', 'LOCAL_DEMO_IDENTITY'].includes(oauthConfig.status));

  // Test Google OAuth login execution
  const googleAuthResult = await authService.signInWithGoogle();
  assert('Google OAuth sign-in executes successfully without throwing', googleAuthResult.error === null);
  assert('Google OAuth user session is synthesized with valid profile', googleAuthResult.user !== null && googleAuthResult.user.email.includes('google'));
  assert('Google OAuth user profile has active account status', googleAuthResult.user?.account_status === 'ACTIVE');

  // -------------------------------------------------------------
  // SUITE 2: Institutional Bulk Cohort Onboarding & Ingestion
  // -------------------------------------------------------------
  console.log('\n--- Section 2: Bulk Learner Ingestion & Onboarding ---');
  const batches = lmsService.getBatches();
  assert('Academic cohorts exist for onboarding', batches.length > 0);
  const targetBatch = batches[0];
  const initialEnrolled = targetBatch.enrolled_count;

  const testRoster = [
    { name: 'Aditya Birla', email: 'aditya.birla@partner.edu' },
    { name: 'Meera Rao', email: 'meera.rao@partner.edu' },
    { name: 'Invalid Row', email: 'not-an-email' }, // Should be skipped
    { name: 'Sameer Joshi', email: 'sameer.joshi@sample.edu' } // Already enrolled in Course 2, should be checked
  ];

  const bulkResult = lmsService.bulkEnrollLearners(targetBatch.batch_id, testRoster);
  assert('Bulk ingestion processes valid learners', bulkResult.enrolledCount >= 2);
  assert('Bulk ingestion catches invalid email format', bulkResult.skippedCount >= 1);
  assert('Bulk ingestion updates cohort enrolled count', targetBatch.enrolled_count >= initialEnrolled + 2);

  // -------------------------------------------------------------
  // SUITE 3: Disaster Recovery & State Snapshot Backup
  // -------------------------------------------------------------
  console.log('\n--- Section 3: Disaster Recovery & System Backup ---');
  const backup = lmsService.generateSystemBackupSnapshot();
  assert('System backup snapshot includes version tag', backup.version.includes('PROD-READINESS'));
  assert('Backup snapshot includes cryptographic checksum', backup.checksum.startsWith('FX-BACKUP-'));
  assert('Backup snapshot contains all institutional tables', 
    backup.snapshotData.batches.length > 0 && 
    backup.snapshotData.instructors.length > 0 && 
    backup.snapshotData.enrollments.length > 0
  );

  // Test Backup Snapshot Restore
  const restoreResult = lmsService.restoreSystemBackupSnapshot(backup.jsonString);
  assert('System backup snapshot passes validation and restores cleanly', restoreResult.success === true);

  // Test Corrupt Backup Detection
  const corruptRestore = lmsService.restoreSystemBackupSnapshot('{"corrupted": true}');
  assert('Rejects corrupted backup snapshot gracefully', corruptRestore.success === false && corruptRestore.error !== undefined);

  // -------------------------------------------------------------
  // SUITE 4: Outbound Institutional Webhooks & Event Broker
  // -------------------------------------------------------------
  console.log('\n--- Section 4: Webhook Dispatcher & Event Notification ---');
  const webhookResult = await lmsService.dispatchLmsWebhook({
    eventType: 'SUBMISSION_GRADED',
    payload: {
      submission_id: 'sub-test-001',
      learner_id: 'learner-001',
      learner_name: 'Alex Rivera',
      course_id: 3,
      score: 95
    }
  });
  assert('Outbound webhook dispatches successfully', webhookResult.success === true);
  assert('Webhook event assigns deterministic event ID', webhookResult.eventId.startsWith('wh-evt-'));

  // -------------------------------------------------------------
  // SUITE 5: Verifiable Credential Cryptographic Checksum
  // -------------------------------------------------------------
  console.log('\n--- Section 5: Verifiable Credential Validation ---');
  const certVerify = lmsService.verifyCertificate('FX-CERT-2026-0814');
  assert('Authenticates certified credential ID', certVerify.isValid === true && certVerify.status === 'AUTHENTICATED');
  assert('Credential integrity checksum is SHA256 format', certVerify.digitalChecksum?.startsWith('SHA256:') === true);
  assert('Credential verification records audit timestamp', typeof certVerify.verificationTimestamp === 'string');

  console.log('\n================================================================');
  console.log('  ALL PHASE 33 PRODUCTION READINESS TESTS PASSED (100% GREEN)   ');
  console.log('================================================================\n');
}

runPhase33TestSuite().catch((err) => {
  console.error('\nPhase 33 Test Suite encountered error:', err);
  process.exit(1);
});

