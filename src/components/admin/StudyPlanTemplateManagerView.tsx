import React, { useState } from 'react';
import { CalendarDays, Plus, Edit3, Trash2, Clock, Award, Layers } from 'lucide-react';
import { StudyPlanTemplate, Certification } from '../../types/schema';

interface StudyPlanTemplateManagerViewProps {
  templates: StudyPlanTemplate[];
  certifications: Certification[];
  onSaveTemplate: (tpl: StudyPlanTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const StudyPlanTemplateManagerView: React.FC<StudyPlanTemplateManagerViewProps> = ({
  templates,
  certifications,
  onSaveTemplate,
  onDeleteTemplate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<StudyPlanTemplate | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [certId, setCertId] = useState<number | undefined>(certifications[0]?.certification_id);
  const [weeks, setWeeks] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);

  const openCreateModal = () => {
    setEditingTpl(null);
    setTitle('');
    setDescription('');
    setCertId(certifications[0]?.certification_id);
    setWeeks(6);
    setHoursPerWeek(8);
    setIsModalOpen(true);
  };

  const openEditModal = (t: StudyPlanTemplate) => {
    setEditingTpl(t);
    setTitle(t.title);
    setDescription(t.description);
    setCertId(t.target_certification_id);
    setWeeks(t.duration_weeks);
    setHoursPerWeek(t.recommended_hours_per_week);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: StudyPlanTemplate = {
      template_id: editingTpl ? editingTpl.template_id : `tpl-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      target_certification_id: certId,
      duration_weeks: Number(weeks),
      recommended_hours_per_week: Number(hoursPerWeek),
      weekly_schedule: editingTpl?.weekly_schedule || [
        { week: 1, title: 'Foundations & Market Microstructure', focus_topic_ids: [1], lesson_ids: [1, 2], quiz_ids: [1], mock_exam_ids: [] },
        { week: 2, title: 'Derivative Pricing & Margining', focus_topic_ids: [2], lesson_ids: [3, 4], quiz_ids: [2], mock_exam_ids: [] },
        { week: 3, title: 'Regulatory Compliance & Code of Ethics', focus_topic_ids: [3], lesson_ids: [5], quiz_ids: [3], mock_exam_ids: [1] }
      ],
      status: 'PUBLISHED'
    };

    onSaveTemplate(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="study-plan-template-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Admin Study-Plan Templates
          </h1>
          <p className="text-xs text-slate-500">
            Define structured preparation roadmaps that learners can adopt and customize for NISM certifications.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Roadmap Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => {
          const cert = certifications.find(c => c.certification_id === tpl.target_certification_id);

          return (
            <div
              key={tpl.template_id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]">
                    {tpl.duration_weeks} WEEKS ROADMAP
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ~{tpl.recommended_hours_per_week}h / week
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {tpl.description}
                  </p>
                </div>

                {cert && (
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-pink-600 dark:text-[#00E599] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cert.certification_name}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(tpl)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Schedule</span>
                </button>

                <button
                  onClick={() => onDeleteTemplate(tpl.template_id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {editingTpl ? 'Edit Roadmap Template' : 'Create Roadmap Template'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Roadmap Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NISM Series VIII Preparation — 6 Weeks"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Certification</label>
                <select
                  value={certId || ''}
                  onChange={(e) => setCertId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <option value="">General Prep</option>
                  {certifications.map((c) => (
                    <option key={c.certification_id} value={c.certification_id}>{c.certification_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="1"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hours / Week</label>
                  <input
                    type="number"
                    min="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
