import React, { useState } from 'react';
import { History, Search, ShieldCheck, Filter, Clock, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { ContentAuditLog } from '../../types/schema';

interface AuditLogsViewProps {
  auditLogs: ContentAuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = (log.entity_title && log.entity_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          log.admin_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.entity_id.toString().includes(searchQuery);
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entity_type === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6" id="audit-logs-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Regulatory Content Mutation Ledger (Audit Trail)
          </h1>
          <p className="text-xs text-slate-500">
            Immutable traceability of who created, edited, published, or uploaded educational assets.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40 self-start sm:self-auto">
          {auditLogs.length} Total Audit Entries
        </span>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by admin email, title, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="PUBLISH">Publish</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="UPLOAD">Upload</option>
            <option value="IMPORT">Import</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Entities</option>
            <option value="COURSE">Course</option>
            <option value="LESSON">Lesson</option>
            <option value="QUESTION">Question</option>
            <option value="QUIZ">Quiz</option>
            <option value="MOCK_EXAM">Mock Exam</option>
            <option value="RESOURCE">Resource</option>
            <option value="CERTIFICATION">Certification</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Action & Entity</th>
                <th className="p-4">Title / Identifier</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            log.action === 'PUBLISH' ? 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]' :
                            log.action === 'CREATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                            log.action === 'DELETE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                            log.action === 'UPLOAD' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {log.action}
                          </span>
                          <span className="font-mono text-slate-400 font-semibold">
                            {log.entity_type}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {log.entity_title || `#${log.entity_id}`}
                      </td>

                      <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                        {log.admin_email}
                      </td>

                      <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded JSON Inspector */}
                    {isExpanded && (
                      <tr className="bg-slate-50 dark:bg-slate-950/80">
                        <td colSpan={5} className="p-4">
                          <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#06090F] p-3 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                            {JSON.stringify(log, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
