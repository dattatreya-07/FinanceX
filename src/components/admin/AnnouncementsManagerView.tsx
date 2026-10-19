import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Send, Users, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Announcement } from '../../types/schema';

interface AnnouncementsManagerViewProps {
  announcements: Announcement[];
  onSaveAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (annId: string) => void;
}

export const AnnouncementsManagerView: React.FC<AnnouncementsManagerViewProps> = ({
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'ALL_USERS' | 'COURSE_LEARNERS' | 'CERTIFICATION_LEARNERS' | 'ADMINS'>('ALL_USERS');
  const [expiresAt, setExpiresAt] = useState('');

  const openCreateModal = () => {
    setTitle('');
    setMessage('');
    setAudience('ALL_USERS');
    setExpiresAt('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      audience,
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      expires_at: expiresAt || undefined
    };

    onSaveAnnouncement(newAnn);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="announcements-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Platform Announcements & Broadcasts
          </h1>
          <p className="text-xs text-slate-500">
            Publish targeted notifications to all learners or specific certification candidates with scheduled expiration.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {ann.audience.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]">
                  {ann.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {ann.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {ann.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                Create Broadcast Announcement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New NISM Series VIII Practice Simulation Released"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <option value="ALL_USERS">All Platform Learners</option>
                  <option value="COURSE_LEARNERS">Enrolled Course Learners</option>
                  <option value="CERTIFICATION_LEARNERS">NISM / CFA Aspirants</option>
                  <option value="ADMINS">Administrators Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Body *</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details of regulatory syllabus updates or mock exam schedules..."
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
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
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
