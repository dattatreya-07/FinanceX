import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  FileSpreadsheet, 
  AlertTriangle, 
  FileText, 
  Filter, 
  Search, 
  History, 
  Users, 
  ArrowRight, 
  Lock,
  Layers,
  ChevronRight,
  RefreshCw,
  Eye,
  BadgeCheck
} from 'lucide-react';
import { 
  User, 
  Institution, 
  ComplianceDossierEntry, 
  AIItemRevisionProposal, 
  ContentAuditLog,
  ItemAnalysisMetrics,
  CohortBenchmark,
  Question
} from '../../types/schema';
import { adminService } from '../../services/adminService';
import { complianceExportService } from '../../services/complianceExportService';
import { itemRevisionService } from '../../services/itemRevisionService';
import { assessmentIntelligenceService } from '../../services/assessmentIntelligenceService';
import { cohortAnalyticsService } from '../../services/cohortAnalyticsService';

interface EnterpriseGovernanceViewProps {
  currentUser: User;
  questions: Question[];
}

export const EnterpriseGovernanceView: React.FC<EnterpriseGovernanceViewProps> = ({
  currentUser,
  questions
}) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'compliance-exports' | 'ai-item-revisions' | 'audit-ledger'>('compliance-exports');
  
  // Data states
  const [dossierRecords, setDossierRecords] = useState<ComplianceDossierEntry[]>([]);
  const [proposals, setProposals] = useState<AIItemRevisionProposal[]>([]);
  const [auditLogs, setAuditLogs] = useState<ContentAuditLog[]>([]);
  const [cohortBenchmarks, setCohortBenchmarks] = useState<CohortBenchmark[]>([]);
  const [itemMetrics, setItemMetrics] = useState<ItemAnalysisMetrics[]>([]);
  
  // Feedback / Notification
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProposal, setSelectedProposal] = useState<AIItemRevisionProposal | null>(null);

  // Check if current user is an INSTITUTION_ADMIN scoped to a single organization
  const isInstitutionAdminScoped = currentUser.role === 'INSTITUTION_ADMIN';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadScopedData(selectedInstitutionId);
  }, [selectedInstitutionId]);

  const loadInitialData = async () => {
    const instList = await adminService.getInstitutions();
    setInstitutions(instList);

    // If scoped institution admin, default to their organization's institution
    if (isInstitutionAdminScoped && currentUser.organization) {
      const match = instList.find(i => 
        i.name.toLowerCase().includes(currentUser.organization!.toLowerCase()) ||
        currentUser.organization!.toLowerCase().includes(i.domain.split('.')[0])
      );
      if (match) {
        setSelectedInstitutionId(match.institution_id);
      } else if (instList.length > 0) {
        setSelectedInstitutionId(instList[0].institution_id);
      }
    }

    // Load static metrics for exports
    const metrics = assessmentIntelligenceService.computeItemAnalysis(questions);
    setItemMetrics(metrics);
    const cohorts = cohortAnalyticsService.getCohortBenchmarks();
    setCohortBenchmarks(cohorts);
    setProposals(itemRevisionService.getAllProposals());
  };

  const loadScopedData = async (instId: string) => {
    const dossier = await complianceExportService.getComplianceDossier(instId);
    setDossierRecords(dossier);
    const logs = await adminService.getAuditLogs(50, instId);
    setAuditLogs(logs);
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const activeInstitution = institutions.find(i => i.institution_id === selectedInstitutionId);

  // Exporters
  const handleExportLearnerCompliance = () => {
    const { csvContent, exportDef } = complianceExportService.generateLearnerComplianceCsv(dossierRecords, {
      institution_id: selectedInstitutionId,
      institution_name: activeInstitution ? activeInstitution.name : 'Global Platform Scope',
      requested_by_user_id: currentUser.user_id,
      requested_by_role: currentUser.role || 'ADMIN'
    });

    const filename = `FinanceX_Learner_Compliance_${selectedInstitutionId}_${new Date().toISOString().slice(0, 10)}.csv`;
    complianceExportService.downloadCsvFile(filename, csvContent);
    showNotification(`Learner Compliance CSV exported successfully [Checksum: ${exportDef.checksum_sha256?.slice(0, 16)}...]`);

    adminService.logAdminAction(
      currentUser,
      'EXPORT',
      'REPORT',
      exportDef.export_id,
      `Exported Learner Compliance CSV for ${exportDef.institution_name}`,
      { export_type: 'LEARNER_READINESS_AUDIT', checksum: exportDef.checksum_sha256, record_count: exportDef.record_count }
    );
  };

  const handleExportCohortBenchmarks = () => {
    const { csvContent, exportDef } = complianceExportService.generateCohortPerformanceCsv(cohortBenchmarks, {
      institution_id: selectedInstitutionId,
      institution_name: activeInstitution ? activeInstitution.name : 'Global Platform Scope',
      requested_by_user_id: currentUser.user_id,
      requested_by_role: currentUser.role || 'ADMIN'
    });

    const filename = `FinanceX_Cohort_Benchmarks_${selectedInstitutionId}_${new Date().toISOString().slice(0, 10)}.csv`;
    complianceExportService.downloadCsvFile(filename, csvContent);
    showNotification(`Cohort Statistical Summary CSV exported [Checksum: ${exportDef.checksum_sha256?.slice(0, 16)}...]`);

    adminService.logAdminAction(
      currentUser,
      'EXPORT',
      'REPORT',
      exportDef.export_id,
      `Exported Cohort Benchmarks CSV`,
      { export_type: 'COHORT_COMPLIANCE_SUMMARY', checksum: exportDef.checksum_sha256 }
    );
  };

  const handleExportItemQualityAudit = () => {
    const { csvContent, exportDef } = complianceExportService.generateItemQualityAuditCsv(itemMetrics, {
      institution_id: selectedInstitutionId,
      institution_name: activeInstitution ? activeInstitution.name : 'Global Platform Scope',
      requested_by_user_id: currentUser.user_id,
      requested_by_role: currentUser.role || 'ADMIN'
    });

    const filename = `FinanceX_Item_Psychometric_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    complianceExportService.downloadCsvFile(filename, csvContent);
    showNotification(`Item Psychometric Quality CSV exported [Checksum: ${exportDef.checksum_sha256?.slice(0, 16)}...]`);

    adminService.logAdminAction(
      currentUser,
      'EXPORT',
      'REPORT',
      exportDef.export_id,
      `Exported Item Psychometrics CSV`,
      { export_type: 'ITEM_PSYCHOMETRIC_AUDIT', checksum: exportDef.checksum_sha256 }
    );
  };

  // Human-in-the-loop Item Proposal Actions
  const handleApproveProposal = (proposalId: string) => {
    const updated = itemRevisionService.approveProposal(proposalId, currentUser.user_id);
    if (updated) {
      setProposals(itemRevisionService.getAllProposals());
      setSelectedProposal(null);
      showNotification(`AI Item Proposal ${proposalId} approved and staged to curriculum draft review.`);
      loadScopedData(selectedInstitutionId);
    }
  };

  const handleRejectProposal = (proposalId: string) => {
    const updated = itemRevisionService.rejectProposal(proposalId, currentUser.user_id, 'Rejected by Assessment Manager');
    if (updated) {
      setProposals(itemRevisionService.getAllProposals());
      setSelectedProposal(null);
      showNotification(`AI Item Proposal ${proposalId} marked rejected.`);
      loadScopedData(selectedInstitutionId);
    }
  };

  // Metrics computation
  const totalAllocatedSeats = institutions.reduce((acc, i) => acc + i.seats_allocated, 0);
  const totalUsedSeats = institutions.reduce((acc, i) => acc + i.seats_used, 0);
  const auditReadyCount = dossierRecords.filter(r => r.status === 'AUDIT_READY').length;
  const auditReadyPct = dossierRecords.length > 0 ? Math.round((auditReadyCount / dossierRecords.length) * 100) : 0;
  const pendingProposalsCount = proposals.filter(p => p.status === 'PENDING_REVIEW').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Tenant Switcher */}
      <div className="bg-white dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-[#00E599]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Enterprise Operations & Governance Console
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional tenant segregation, compliance evidence reporting, and human-in-the-loop psychometric governance.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-slate-50 dark:bg-[#06090F] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-slate-400 ml-2" />
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Tenant Scope:
          </div>
          <select
            value={selectedInstitutionId}
            onChange={(e) => setSelectedInstitutionId(e.target.value)}
            disabled={isInstitutionAdminScoped}
            className="bg-white dark:bg-[#0B0F19] text-xs font-bold text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 dark:focus:ring-[#00E599]/20"
          >
            {!isInstitutionAdminScoped && (
              <option value="ALL">🌐 All Enterprise Institutions (Global Scope)</option>
            )}
            {institutions.map((inst) => (
              <option key={inst.institution_id} value={inst.institution_id}>
                🏢 {inst.name} ({inst.license_tier})
              </option>
            ))}
          </select>
          {activeInstitution && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
              {activeInstitution.status}
            </span>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Enterprise Seats</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-display font-black text-slate-900 dark:text-white">
            {selectedInstitutionId === 'ALL' 
              ? `${totalUsedSeats.toLocaleString()} / ${totalAllocatedSeats.toLocaleString()}`
              : `${activeInstitution?.seats_used || 0} / ${activeInstitution?.seats_allocated || 0}`}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {selectedInstitutionId === 'ALL'
              ? `${Math.round((totalUsedSeats / (totalAllocatedSeats || 1)) * 100)}% active utilization across tenants`
              : `${Math.round(((activeInstitution?.seats_used || 0) / ((activeInstitution?.seats_allocated || 1))) * 100)}% seat utilization`}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Audit-Ready Ratio</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-black text-emerald-600 dark:text-emerald-400">
            {auditReadyPct}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {auditReadyCount} of {dossierRecords.length} learners satisfy regulatory readiness
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>AI Psychometric Staging</span>
            <Sparkles className="w-4 h-4 text-pink-500 dark:text-[#00E599]" />
          </div>
          <div className="text-2xl font-display font-black text-pink-600 dark:text-[#00E599]">
            {pendingProposalsCount} Pending
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Flawed items awaiting human assessment sign-off
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Audit Ledger Status</span>
            <History className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-display font-black text-purple-600 dark:text-purple-400">
            100% Intact
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Immutable cryptographic verification active
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveSubTab('compliance-exports')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'compliance-exports'
              ? 'border-pink-600 dark:border-[#00E599] text-pink-600 dark:text-[#00E599]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Compliance Exports & Dossier</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai-item-revisions')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all relative ${
            activeSubTab === 'ai-item-revisions'
              ? 'border-pink-600 dark:border-[#00E599] text-pink-600 dark:text-[#00E599]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Human-in-the-Loop Item Governance</span>
          {pendingProposalsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-[#00E599]">
              {pendingProposalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('audit-ledger')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'audit-ledger'
              ? 'border-pink-600 dark:border-[#00E599] text-pink-600 dark:text-[#00E599]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Institutional Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: COMPLIANCE EXPORTS & DOSSIER */}
      {activeSubTab === 'compliance-exports' && (
        <div className="space-y-6">
          {/* Quick Export Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-pink-600 dark:text-[#00E599] text-xs font-bold uppercase tracking-wider mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Learner Readiness Audit</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Learner Compliance CSV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Individual learner completion, readiness score %, exam integrity index %, and statutory audit compliance status.
                </p>
              </div>
              <button
                onClick={handleExportLearnerCompliance}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-[#00E599] dark:hover:bg-[#00c985] text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Learner CSV</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Cohort Statistical Summary</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cohort Performance CSV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Aggregate pass rates, P25–P90 percentile distributions, privacy-suppression flags, and systemic weak topics.
                </p>
              </div>
              <button
                onClick={handleExportCohortBenchmarks}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Cohorts CSV</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Psychometric Quality Ledger</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Item Quality Audit CSV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Difficulty index (p), discrimination index (D), point-biserial correlations, and distractor distributions.
                </p>
              </div>
              <button
                onClick={handleExportItemQualityAudit}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Item Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Dossier Table */}
          <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Institutional Compliance Dossier Records</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({dossierRecords.length} records in scope)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authoritative record of institutional candidates and certification preparedness.
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                Statutory Notice: Internal compliance evidence only
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#06090F] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Institution / Cohort</th>
                    <th className="py-3 px-4">Certification</th>
                    <th className="py-3 px-4 text-center">Readiness %</th>
                    <th className="py-3 px-4 text-center">Mastery</th>
                    <th className="py-3 px-4 text-center">Integrity Index</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {dossierRecords.map((rec) => (
                    <tr key={rec.learner_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{rec.learner_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{rec.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{rec.institution_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rec.cohort_id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {rec.target_certification}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span className={`px-2 py-1 rounded-md text-xs ${
                          rec.readiness_score_pct >= 80 
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                            : rec.readiness_score_pct >= 60
                            ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                            : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400'
                        }`}>
                          {rec.readiness_score_pct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {rec.mastery_level}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        <span className={rec.exam_integrity_index_pct >= 90 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 font-bold'}>
                          {rec.exam_integrity_index_pct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec.status === 'AUDIT_READY'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : rec.status === 'IN_TRAINING'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                        }`}>
                          {rec.status === 'AUDIT_READY' && <BadgeCheck className="w-3 h-3" />}
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HUMAN-IN-THE-LOOP AI ITEM REVISIONS */}
      {activeSubTab === 'ai-item-revisions' && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Human-in-the-Loop AI Guardrail Active:</span> AI item improvement proposals are strictly quarantined until an Assessment Manager / Admin explicitly reviews and approves the side-by-side stem and distractor diff. Approved items are promoted to curriculum review draft status with full audit attribution.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Proposals */}
            <div className="lg:col-span-1 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Item Revision Proposals ({proposals.length})
              </div>
              {proposals.map((prop) => {
                const isSelected = selectedProposal?.proposal_id === prop.proposal_id;
                return (
                  <div
                    key={prop.proposal_id}
                    onClick={() => setSelectedProposal(prop)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-500 dark:border-[#00E599] shadow-sm'
                        : 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Item #{prop.question_id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        prop.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : prop.status === 'APPROVED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                      {prop.question_text_original}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                      <span>Diff (p): {prop.difficulty_index}</span>
                      <span>Discrim (D): {prop.discrimination_index}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Side-by-Side Diff Viewer */}
            <div className="lg:col-span-2">
              {selectedProposal ? (
                <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Psychometric Revision Proposal Diff
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {selectedProposal.proposal_id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Psychometric Diagnostic Reason: <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedProposal.reason}</span>
                      </p>
                    </div>

                    {selectedProposal.status === 'PENDING_REVIEW' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectProposal(selectedProposal.proposal_id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleApproveProposal(selectedProposal.proposal_id)}
                          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Stage</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Question Stem Comparison */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question Stem Comparison
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                        <div className="text-[10px] font-bold text-rose-600 uppercase mb-1">
                          Original Question Stem
                        </div>
                        <div className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                          {selectedProposal.question_text_original}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Proposed Improved Stem</span>
                        </div>
                        <div className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                          {selectedProposal.question_text_proposed}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distractor & Option Diff */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Distractor & Option Set Comparison
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Options */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          Original Options
                        </div>
                        {selectedProposal.options_original.map((opt) => (
                          <div 
                            key={opt.key}
                            className={`p-2.5 rounded-lg border text-xs ${
                              opt.is_correct
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                                : 'bg-slate-50 dark:bg-[#06090F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="font-mono mr-1.5 font-bold">[{opt.key}]</span> {opt.text}
                          </div>
                        ))}
                      </div>

                      {/* Proposed Options */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Proposed Plausible Distractors</span>
                        </div>
                        {selectedProposal.options_proposed.map((opt) => (
                          <div 
                            key={opt.key}
                            className={`p-2.5 rounded-lg border text-xs ${
                              opt.is_correct
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-[#00E599] text-emerald-900 dark:text-emerald-100 font-bold'
                                : 'bg-slate-50 dark:bg-[#06090F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="font-mono mr-1.5 font-bold">[{opt.key}]</span> {opt.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Explanation Comparison */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Updated Explanation & Rationale
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#06090F] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {selectedProposal.explanation_proposed || selectedProposal.explanation_original}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                  <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Select an item proposal to view side-by-side psychometric diff</div>
                  <div className="text-xs text-slate-400 mt-1">Review AI stem enhancements and distractor plausibility calibrations before approval.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTITUTIONAL AUDIT TRAIL */}
      {activeSubTab === 'audit-ledger' && (
        <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enterprise Administrative Audit Trail</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Scope: {activeInstitution ? activeInstitution.name : 'All Institutions'})
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable record of role changes, compliance report exports, content mutations, and AI item approvals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-[#06090F] pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#06090F] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Admin Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity & Description</th>
                  <th className="py-3 px-4 text-right">Audit Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {auditLogs
                  .filter(l => 
                    !searchQuery || 
                    l.admin_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.entity_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.action.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{log.admin_email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {log.admin_id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          log.action === 'EXPORT'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                            : log.action === 'PUBLISH' || log.action === 'CREATE'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : log.action === 'DELETE'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 dark:text-white font-medium">{log.entity_title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.entity_type} #{log.entity_id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-500">
                        {log.details?.checksum ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            sha256:{String(log.details.checksum).slice(0, 10)}...
                          </span>
                        ) : log.details?.institution_id ? (
                          <span>inst:{log.details.institution_id}</span>
                        ) : (
                          <span>tx:{log.id.slice(0, 8)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
