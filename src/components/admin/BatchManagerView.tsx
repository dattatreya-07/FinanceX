import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Users, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  ChevronRight,
  BookOpen,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { CourseBatch, Course, InstructorProfile } from '../../types/schema';
import { lmsService } from '../../services/lmsService';

interface BatchManagerViewProps {
  courses: Course[];
}

export const BatchManagerView: React.FC<BatchManagerViewProps> = ({ courses }) => {
  const [batches, setBatches] = useState<CourseBatch[]>([]);
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [batchName, setBatchName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number>(3);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('inst-001');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [capacity, setCapacity] = useState<number>(50);

  // Bulk Ingestion State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkBatchId, setBulkBatchId] = useState<string>('');
  const [bulkCsvText, setBulkCsvText] = useState(
    'Aarav Sharma,aarav.sharma@partner.edu\nDiya Patel,diya.patel@partner.edu\nRohan Nair,rohan.nair@partner.edu'
  );

  useEffect(() => {
    setBatches(lmsService.getBatches());
    setInstructors(lmsService.getInstructors());
    return lmsService.subscribe(() => {
      setBatches(lmsService.getBatches());
      setInstructors(lmsService.getInstructors());
    });
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    const course = courses.find(c => c.course_id === selectedCourseId);
    const instructor = instructors.find(i => i.instructor_id === selectedInstructorId);

    lmsService.createBatch({
      batch_name: batchName.trim(),
      course_id: selectedCourseId,
      course_title: course?.course_title || 'NISM Certified Course',
      instructor_id: selectedInstructorId,
      instructor_name: instructor?.full_name || 'Dr. R. Subramanian',
      start_date: startDate,
      end_date: endDate,
      capacity,
      status: 'UPCOMING'
    });

    setIsCreateModalOpen(false);
    setBatchName('');
    showToast(`Batch "${batchName}" successfully configured!`);
  };

  const handleBulkIngest = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBatchId = bulkBatchId || (batches[0]?.batch_id ?? '');
    if (!targetBatchId) {
      alert('Please select a destination cohort.');
      return;
    }

    const lines = bulkCsvText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#'));

    const parsedLearners = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return {
        name: parts[0] || 'Enrolled Student',
        email: parts[1] || parts[0]
      };
    });

    if (parsedLearners.length === 0) {
      alert('No valid rows found to ingest.');
      return;
    }

    const result = lmsService.bulkEnrollLearners(targetBatchId, parsedLearners);
    setIsBulkModalOpen(false);
    showToast(`Bulk Onboarding complete: ${result.enrolledCount} enrolled, ${result.skippedCount} skipped.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-500" />
            <span>Academic Cohort & Batch Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize semester cohorts, schedule enrolment terms, and allocate faculty leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (batches.length > 0 && !bulkBatchId) setBulkBatchId(batches[0].batch_id);
              setIsBulkModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            <span>Bulk Ingest Roster (CSV)</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Cohort</span>
          </button>
        </div>
      </div>

      {/* Batches Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-mono">
                <th className="py-3 px-4">Cohort Name & Term</th>
                <th className="py-3 px-4">Associated Course</th>
                <th className="py-3 px-4">Faculty Lead</th>
                <th className="py-3 px-4">Enrolment Capacity</th>
                <th className="py-3 px-4">Term Dates</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {batches.map(batch => {
                const fillPct = Math.round((batch.enrolled_count / batch.capacity) * 100);
                return (
                  <tr key={batch.batch_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{batch.batch_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {batch.batch_id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {batch.course_title}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{batch.instructor_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex justify-between text-[11px] font-mono mb-1 font-bold">
                        <span>{batch.enrolled_count} / {batch.capacity} Students</span>
                        <span>{fillPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${fillPct}%` }} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {batch.start_date} → {batch.end_date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        batch.status === 'ACTIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Batch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600">Cohort Setup Wizard</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Create New Academic Batch
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Batch / Cohort Name *</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                  placeholder="e.g. NISM Series XV — Summer Executive Batch 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Course *</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.course_id} value={c.course_id}>{c.course_title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Faculty Lead *</label>
                  <select
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden cursor-pointer"
                  >
                    {instructors.map(i => (
                      <option key={i.instructor_id} value={i.instructor_id}>{i.full_name} ({i.title.split('—')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Seat Capacity *</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Cohort</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Roster Ingestion Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Bulk Student Roster Ingestion
                  </h2>
                  <p className="text-xs text-slate-500">
                    Onboard university cohorts or institutional enterprise learners via CSV.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkIngest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Destination Academic Cohort *
                </label>
                <select
                  value={bulkBatchId}
                  onChange={(e) => setBulkBatchId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {batches.map(b => (
                    <option key={b.batch_id} value={b.batch_id}>
                      {b.batch_name} ({b.course_title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Student Roster (CSV: Full Name, Email) *
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">One record per line</span>
                </div>
                <textarea
                  rows={6}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  required
                  placeholder="Full Name,email@institution.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Ingest & Enroll Learners</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

