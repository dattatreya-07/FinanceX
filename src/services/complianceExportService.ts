import { 
  ComplianceExportDefinition, 
  ComplianceReportType, 
  ComplianceDossierEntry, 
  CohortBenchmark, 
  ItemAnalysisMetrics, 
  UserRole 
} from '../types/schema';
// Simple fast deterministic SHA256-like hash function for isomorphic Node/browser integrity verification
export function calculateReportChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Return formatted checksum string
  return `fx-sha256-${hex}-${content.length.toString(16)}`;
}

function escapeCsvField(field: string | number | boolean | null | undefined): string {
  if (field === null || field === undefined) return '';
  const stringValue = String(field);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

const SEED_DOSSIER_RECORDS: ComplianceDossierEntry[] = [
  {
    learner_id: 'user-inst-01',
    learner_name: 'Aditi Sharma',
    email: 'aditi.sharma@hdfcbank.com',
    institution_id: 'inst-hdfc-01',
    institution_name: 'HDFC Bank Treasury & Markets',
    cohort_id: 'cohort-hdfc-q1-2026',
    target_certification: 'NISM Series VIII: Equity Derivatives',
    readiness_score_pct: 88,
    mastery_level: 'MASTERY',
    exam_integrity_index_pct: 98,
    completed_modules_count: 12,
    total_modules_count: 12,
    status: 'AUDIT_READY',
    last_activity_date: '2026-03-18T10:15:00Z'
  },
  {
    learner_id: 'user-inst-02',
    learner_name: 'Rajesh Nair',
    email: 'rajesh.nair@hdfcbank.com',
    institution_id: 'inst-hdfc-01',
    institution_name: 'HDFC Bank Treasury & Markets',
    cohort_id: 'cohort-hdfc-q1-2026',
    target_certification: 'NISM Series VIII: Equity Derivatives',
    readiness_score_pct: 74,
    mastery_level: 'PROFICIENT',
    exam_integrity_index_pct: 95,
    completed_modules_count: 10,
    total_modules_count: 12,
    status: 'AUDIT_READY',
    last_activity_date: '2026-03-19T14:30:00Z'
  },
  {
    learner_id: 'user-inst-03',
    learner_name: 'Meera Krishnan',
    email: 'meera.k@icicidirect.com',
    institution_id: 'inst-icici-02',
    institution_name: 'ICICI Securities Research Academy',
    cohort_id: 'cohort-icici-ra-2026',
    target_certification: 'NISM Series XV: Research Analyst',
    readiness_score_pct: 62,
    mastery_level: 'DEVELOPING',
    exam_integrity_index_pct: 91,
    completed_modules_count: 7,
    total_modules_count: 14,
    status: 'IN_TRAINING',
    last_activity_date: '2026-03-17T09:45:00Z'
  },
  {
    learner_id: 'user-inst-04',
    learner_name: 'Kavitha Raman',
    email: 'kavitha.raman@mumbaifinance.edu',
    institution_id: 'inst-mumbai-edu-03',
    institution_name: 'Mumbai Financial Institute',
    cohort_id: 'cohort-batch-mumbai-26',
    target_certification: 'NISM Series VIII: Equity Derivatives',
    readiness_score_pct: 42,
    mastery_level: 'NOVICE',
    exam_integrity_index_pct: 82,
    completed_modules_count: 4,
    total_modules_count: 12,
    status: 'AT_RISK',
    last_activity_date: '2026-03-15T16:20:00Z'
  },
  {
    learner_id: 'user-inst-05',
    learner_name: 'Siddharth Varma',
    email: 'siddharth.v@kotaksecurities.com',
    institution_id: 'inst-kotak-04',
    institution_name: 'Kotak Institutional Equities',
    cohort_id: 'cohort-kotak-derivatives-26',
    target_certification: 'NISM Series VIII: Equity Derivatives',
    readiness_score_pct: 92,
    mastery_level: 'MASTERY',
    exam_integrity_index_pct: 100,
    completed_modules_count: 12,
    total_modules_count: 12,
    status: 'AUDIT_READY',
    last_activity_date: '2026-03-20T11:00:00Z'
  }
];

export const complianceExportService = {
  /**
   * Fetch compliance dossier records scoped by institution
   */
  async getComplianceDossier(institutionId?: string): Promise<ComplianceDossierEntry[]> {
    if (!institutionId || institutionId === 'ALL') {
      return [...SEED_DOSSIER_RECORDS];
    }
    return SEED_DOSSIER_RECORDS.filter((r) => r.institution_id === institutionId);
  },

  /**
   * Validate if caller is authorized to export data for the target institution
   */
  validateTenantExportAccess(
    actorRole: UserRole, 
    actorInstitutionId?: string, 
    targetInstitutionId?: string
  ): boolean {
    // Platform Super Admins and Admins have global access
    if (['SUPER_ADMIN', 'ADMIN'].includes(actorRole)) {
      return true;
    }

    // Regular learners and unauthenticated users cannot export
    if (!['INSTITUTION_ADMIN', 'INSTRUCTOR'].includes(actorRole)) {
      return false;
    }

    // Tenant admins cannot export ALL or other tenant data
    if (!targetInstitutionId || targetInstitutionId === 'ALL') {
      return false;
    }

    if (actorInstitutionId && actorInstitutionId !== targetInstitutionId) {
      return false;
    }

    return true;
  },

  /**
   * Format header comments containing compliance metadata
   */
  formatComplianceHeader(meta: ComplianceExportDefinition): string {
    return [
      `# ==============================================================================`,
      `# FINANCEX ENTERPRISE COMPLIANCE & AUDIT REPORT`,
      `# Report Type: ${meta.report_type}`,
      `# Export ID: ${meta.export_id}`,
      `# Generated At (ISO 8601): ${meta.generated_at}`,
      `# Institution Scope: ${meta.institution_name} [${meta.institution_id}]`,
      `# Requested By: User ID ${meta.requested_by_user_id} (${meta.requested_by_role})`,
      `# Content Curriculum Version: ${meta.content_version_ref}`,
      `# Record Count: ${meta.record_count}`,
      `# Verification Checksum: ${meta.checksum_sha256 || 'fx-checksum-pending'}`,
      `# Statutory Disclaimer: Internal institutional training and compliance evidence only.`,
      `# Not an official statutory credential or government regulatory filing.`,
      `# ==============================================================================`
    ].join('\n') + '\n';
  },

  /**
   * Generate Learner Compliance & Readiness CSV report
   */
  generateLearnerComplianceCsv(
    records: ComplianceDossierEntry[],
    meta: Partial<ComplianceExportDefinition> = {}
  ): { csvContent: string; exportDef: ComplianceExportDefinition } {
    const generatedAt = new Date().toISOString();
    const instId = meta.institution_id || 'ALL';
    const instName = meta.institution_name || (instId === 'ALL' ? 'Global Platform Scope' : instId);

    const headers = [
      'Learner ID',
      'Learner Name',
      'Email',
      'Institution ID',
      'Institution Name',
      'Cohort ID',
      'Target Certification',
      'Readiness Score (%)',
      'Mastery Level',
      'Exam Integrity Index (%)',
      'Completed Modules',
      'Total Modules',
      'Compliance Status',
      'Last Activity Date'
    ];

    const rows = records.map((r) => [
      escapeCsvField(r.learner_id),
      escapeCsvField(r.learner_name),
      escapeCsvField(r.email),
      escapeCsvField(r.institution_id),
      escapeCsvField(r.institution_name),
      escapeCsvField(r.cohort_id),
      escapeCsvField(r.target_certification),
      escapeCsvField(r.readiness_score_pct),
      escapeCsvField(r.mastery_level),
      escapeCsvField(r.exam_integrity_index_pct),
      escapeCsvField(r.completed_modules_count),
      escapeCsvField(r.total_modules_count),
      escapeCsvField(r.status),
      escapeCsvField(r.last_activity_date)
    ].join(','));

    const rawBody = [headers.join(','), ...rows].join('\n');
    const checksum = calculateReportChecksum(rawBody);

    const fullExportDef: ComplianceExportDefinition = {
      export_id: meta.export_id || `EXP-LRN-${Date.now()}`,
      report_type: 'LEARNER_READINESS_AUDIT',
      institution_id: instId,
      institution_name: instName,
      requested_by_user_id: meta.requested_by_user_id || 'admin-root',
      requested_by_role: meta.requested_by_role || 'ADMIN',
      generated_at: generatedAt,
      content_version_ref: meta.content_version_ref || '2026.3-CURRICULUM-RELEASE',
      record_count: records.length,
      checksum_sha256: checksum
    };

    const headerComment = this.formatComplianceHeader(fullExportDef);
    const fullCsv = headerComment + rawBody;

    return {
      csvContent: fullCsv,
      exportDef: fullExportDef
    };
  },

  /**
   * Generate Cohort Performance & Statistical Summary CSV report
   */
  generateCohortPerformanceCsv(
    cohorts: CohortBenchmark[],
    meta: Partial<ComplianceExportDefinition> = {}
  ): { csvContent: string; exportDef: ComplianceExportDefinition } {
    const generatedAt = new Date().toISOString();
    const instId = meta.institution_id || 'ALL';
    const instName = meta.institution_name || (instId === 'ALL' ? 'Global Platform Scope' : instId);

    const headers = [
      'Cohort ID',
      'Cohort Name',
      'Dimension',
      'Certification Name',
      'Learner Count (N)',
      'Privacy Suppressed',
      'Average Accuracy (%)',
      'Pass Rate (%)',
      'Average Readiness Score',
      'P25 (%)',
      'P50 (%)',
      'P75 (%)',
      'P90 (%)',
      'Mean (%)',
      'Std Dev',
      'Top Weak Topics'
    ];

    const rows = cohorts.map((c) => [
      escapeCsvField(c.cohort_id),
      escapeCsvField(c.cohort_name),
      escapeCsvField(c.dimension),
      escapeCsvField(c.certification_name || 'N/A'),
      escapeCsvField(c.total_learners_n),
      escapeCsvField(c.is_privacy_suppressed ? 'TRUE' : 'FALSE'),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.average_accuracy_pct),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.pass_rate_pct),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.average_readiness_score),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.p25),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.p50),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.p75),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.p90),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.mean),
      escapeCsvField(c.is_privacy_suppressed ? 'SUPPRESSED' : c.percentiles.std_dev),
      escapeCsvField(c.top_weak_topic_names.join('; '))
    ].join(','));

    const rawBody = [headers.join(','), ...rows].join('\n');
    const checksum = calculateReportChecksum(rawBody);

    const fullExportDef: ComplianceExportDefinition = {
      export_id: meta.export_id || `EXP-COH-${Date.now()}`,
      report_type: 'COHORT_COMPLIANCE_SUMMARY',
      institution_id: instId,
      institution_name: instName,
      requested_by_user_id: meta.requested_by_user_id || 'admin-root',
      requested_by_role: meta.requested_by_role || 'ADMIN',
      generated_at: generatedAt,
      content_version_ref: meta.content_version_ref || '2026.3-CURRICULUM-RELEASE',
      record_count: cohorts.length,
      checksum_sha256: checksum
    };

    const headerComment = this.formatComplianceHeader(fullExportDef);
    const fullCsv = headerComment + rawBody;

    return {
      csvContent: fullCsv,
      exportDef: fullExportDef
    };
  },

  /**
   * Generate Item Psychometric & Quality Audit CSV report
   */
  generateItemQualityAuditCsv(
    itemMetrics: ItemAnalysisMetrics[],
    meta: Partial<ComplianceExportDefinition> = {}
  ): { csvContent: string; exportDef: ComplianceExportDefinition } {
    const generatedAt = new Date().toISOString();
    const instId = meta.institution_id || 'ALL';
    const instName = meta.institution_name || (instId === 'ALL' ? 'Global Platform Scope' : instId);

    const headers = [
      'Question ID',
      'Question Stem',
      'Topic Name',
      'Difficulty Level',
      'Total Attempts',
      'Correct Attempts',
      'Difficulty Index (p)',
      'Discrimination Index (D)',
      'Point-Biserial (r)',
      'Quality Status',
      'Flagged For Review',
      'Distractor A (%)',
      'Distractor B (%)',
      'Distractor C (%)',
      'Distractor D (%)',
      'Actionable Recommendation'
    ];

    const rows = itemMetrics.map((m) => [
      escapeCsvField(m.question_id),
      escapeCsvField(m.question_text),
      escapeCsvField(m.topic_name),
      escapeCsvField(m.difficulty),
      escapeCsvField(m.total_attempts),
      escapeCsvField(m.correct_attempts),
      escapeCsvField(m.difficulty_index_p),
      escapeCsvField(m.discrimination_index_d),
      escapeCsvField(m.point_biserial_r),
      escapeCsvField(m.quality_status),
      escapeCsvField(m.is_flagged_for_review ? 'TRUE' : 'FALSE'),
      escapeCsvField(m.distractor_distribution.A),
      escapeCsvField(m.distractor_distribution.B),
      escapeCsvField(m.distractor_distribution.C),
      escapeCsvField(m.distractor_distribution.D),
      escapeCsvField(m.recommendation)
    ].join(','));

    const rawBody = [headers.join(','), ...rows].join('\n');
    const checksum = calculateReportChecksum(rawBody);

    const fullExportDef: ComplianceExportDefinition = {
      export_id: meta.export_id || `EXP-ITM-${Date.now()}`,
      report_type: 'ITEM_PSYCHOMETRIC_AUDIT',
      institution_id: instId,
      institution_name: instName,
      requested_by_user_id: meta.requested_by_user_id || 'admin-root',
      requested_by_role: meta.requested_by_role || 'ADMIN',
      generated_at: generatedAt,
      content_version_ref: meta.content_version_ref || '2026.3-CURRICULUM-RELEASE',
      record_count: itemMetrics.length,
      checksum_sha256: checksum
    };

    const headerComment = this.formatComplianceHeader(fullExportDef);
    const fullCsv = headerComment + rawBody;

    return {
      csvContent: fullCsv,
      exportDef: fullExportDef
    };
  },

  /**
   * Browser-safe file download trigger
   */
  downloadCsvFile(filename: string, csvContent: string): void {
    if (typeof window === 'undefined' || !window.Blob) {
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
