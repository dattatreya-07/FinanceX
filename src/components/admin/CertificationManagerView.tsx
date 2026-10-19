import React, { useState } from 'react';
import { Award, Plus, Edit3, Trash2, CheckCircle2, ShieldCheck, Building2, BookOpen } from 'lucide-react';
import { Certification, Course, MockExam, ContentStatus } from '../../types/schema';

interface CertificationManagerViewProps {
  certifications: Certification[];
  courses: Course[];
  mockExams: MockExam[];
  onSaveCertification: (cert: Certification) => void;
  onDeleteCertification: (certId: number) => void;
}

export const CertificationManagerView: React.FC<CertificationManagerViewProps> = ({
  certifications,
  courses,
  mockExams,
  onSaveCertification,
  onDeleteCertification
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [name, setName] = useState('');
  const [governingBody, setGoverningBody] = useState<'NISM' | 'NCFM' | 'CFA INSTITUTE' | 'SEBI' | 'FINANCEX ACADEMY'>('NISM');
  const [validityYears, setValidityYears] = useState(3);
  const [prerequisites, setPrerequisites] = useState('Basic understanding of capital markets and high school mathematics.');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [isOfficial, setIsOfficial] = useState(true);

  const openCreateModal = () => {
    setEditingCert(null);
    setName('');
    setGoverningBody('NISM');
    setValidityYears(3);
    setPrerequisites('Basic understanding of Indian financial markets.');
    setSummary('');
    setStatus('PUBLISHED');
    setIsOfficial(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setName(cert.certification_name);
    setGoverningBody(cert.governing_body || 'NISM');
    setValidityYears(cert.validity_years || 3);
    setPrerequisites(cert.prerequisites || '');
    setSummary(cert.summary || '');
    setStatus(cert.status || 'PUBLISHED');
    setIsOfficial(cert.is_official !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Certification = {
      certification_id: editingCert ? editingCert.certification_id : Date.now(),
      certification_name: name.trim(),
      exam_id: editingCert?.exam_id || (mockExams[0]?.exam_id || 1),
      governing_body: governingBody,
      validity_years: Number(validityYears),
      prerequisites: prerequisites.trim(),
      summary: summary.trim(),
      status,
      is_official: isOfficial
    };

    onSaveCertification(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="certification-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Regulatory Certifications Manager
          </h1>
          <p className="text-xs text-slate-500">
            Define official certifications vs FinanceX preparatory pathways with statutory syllabus mapping.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification Track</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => {
          const associatedCourses = courses.filter(c => c.certification_id === cert.certification_id);

          return (
            <div
              key={cert.certification_id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300">
                    {cert.governing_body || 'NISM'}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    cert.is_official !== false
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]'
                  }`}>
                    {cert.is_official !== false ? 'OFFICIAL PREP' : 'ACADEMY CERT'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {cert.certification_name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {cert.summary || 'Statutory regulatory curriculum for Indian capital markets licensing.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-500 text-[10px]">ASSOCIATED PREP COURSES:</div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold">
                    {associatedCourses.length > 0 ? associatedCourses.map(c => c.course_title).join(', ') : 'Direct Examination Track'}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(cert)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Track</span>
                </button>

                <button
                  onClick={() => onDeleteCertification(cert.certification_id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {editingCert ? 'Edit Certification' : 'Create Certification Track'}
                </h3>
                <p className="text-xs text-slate-500">Distinguish official statutory bodies from preparatory badges.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NISM Series VIII: Equity Derivatives Certification"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Governing Body</label>
                  <select
                    value={governingBody}
                    onChange={(e) => setGoverningBody(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="NISM">NISM</option>
                    <option value="NCFM">NCFM</option>
                    <option value="SEBI">SEBI</option>
                    <option value="CFA INSTITUTE">CFA Institute</option>
                    <option value="FINANCEX ACADEMY">FinanceX Academy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Validity (Years)</label>
                  <input
                    type="number"
                    value={validityYears}
                    onChange={(e) => setValidityYears(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Prerequisites</label>
                <input
                  type="text"
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Syllabus Summary</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
