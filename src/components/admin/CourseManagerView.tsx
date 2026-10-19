import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Archive, 
  BookOpen, 
  UploadCloud,
  FileText,
  Clock,
  Award
} from 'lucide-react';
import { Course, Certification, ContentStatus } from '../../types/schema';
import { mediaService } from '../../services/mediaService';

interface CourseManagerViewProps {
  courses: Course[];
  certifications: Certification[];
  onSaveCourse: (course: Course) => void;
  onDuplicateCourse: (courseId: number) => void;
  onArchiveCourse: (courseId: number) => void;
  onTogglePublish: (courseId: number) => void;
  onPreviewCourse: (course: Course) => void;
  onOpenStructureBuilder: (courseId: number) => void;
}

export const CourseManagerView: React.FC<CourseManagerViewProps> = ({
  courses,
  certifications,
  onSaveCourse,
  onDuplicateCourse,
  onArchiveCourse,
  onTogglePublish,
  onPreviewCourse,
  onOpenStructureBuilder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContentStatus>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  
  // Modal Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLevel, setFormLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [formHours, setFormHours] = useState(6);
  const [formPrice, setFormPrice] = useState(0);
  const [formAuthor, setFormAuthor] = useState('FinanceX Regulatory Academy');
  const [formCertId, setFormCertId] = useState<number | null>(null);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<ContentStatus>('DRAFT');

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormDescription('');
    setFormLevel('INTERMEDIATE');
    setFormHours(6);
    setFormPrice(0);
    setFormAuthor('FinanceX Regulatory Academy');
    setFormCertId(certifications[0]?.certification_id || null);
    setFormImageUrl('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800');
    setFormStatus('DRAFT');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormTitle(c.course_title);
    setFormDescription(c.description || '');
    setFormLevel(c.level || 'INTERMEDIATE');
    setFormHours(c.estimated_hours || 6);
    setFormPrice(c.price || 0);
    setFormAuthor(c.author || 'FinanceX Academy');
    setFormCertId(c.certification_id);
    setFormImageUrl(c.image_url || '');
    setFormStatus(c.status || 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await mediaService.uploadFile(file, {
        bucket: 'educational-assets',
        folder: 'courses',
        allowedMimeTypes: ['image/*']
      });
      setFormImageUrl(res.url);
    } catch (err: any) {
      alert(`Image upload error: ${err.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const updated: Course = {
      course_id: editingCourse ? editingCourse.course_id : Date.now(),
      course_title: formTitle.trim(),
      description: formDescription.trim(),
      level: formLevel,
      estimated_hours: Number(formHours),
      price: Number(formPrice),
      author: formAuthor.trim(),
      certification_id: formCertId,
      image_url: formImageUrl,
      status: formStatus,
      total_lessons: editingCourse?.total_lessons || 0,
      rating: editingCourse?.rating || 4.9
    };

    onSaveCourse(updated);
    setIsModalOpen(false);
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || (c.status || 'PUBLISHED') === statusFilter;
    const matchesLevel = levelFilter === 'ALL' || c.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6" id="course-manager-view">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">
            Course Catalog Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, publish, and structure regulatory finance courses and preparation tracks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by title, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Under Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => {
          const cert = certifications.find(cert => cert.certification_id === c.certification_id);
          const isPublished = (c.status || 'PUBLISHED') === 'PUBLISHED';

          return (
            <div
              key={c.course_id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    c.status === 'DRAFT' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' :
                    c.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' :
                    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40'
                  }`}>
                    {c.status || 'PUBLISHED'}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {c.level || 'INTERMEDIATE'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {c.course_title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {c.description || 'Comprehensive financial curriculum with hands-on practice.'}
                  </p>
                </div>

                {/* Metadata Pill */}
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
                    {c.total_lessons || 0} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{c.estimated_hours || 4}h
                  </span>
                  <span>{c.price === 0 ? 'FREE' : `₹${c.price}`}</span>
                </div>

                {cert && (
                  <div className="text-[10px] font-mono text-pink-600 dark:text-[#00E599] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cert.certification_name}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Edit Metadata"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateCourse(c.course_id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Duplicate Course"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPreviewCourse(c)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Simulate Learner Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenStructureBuilder(c.course_id)}
                    className="px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 dark:bg-[#00E599]/10 dark:hover:bg-[#00E599]/20 dark:text-[#00E599] text-[10px] font-bold transition cursor-pointer"
                    title="Open Structure Builder"
                  >
                    Build Tree
                  </button>
                </div>

                <button
                  onClick={() => onTogglePublish(c.course_id)}
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    isPublished
                      ? 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-400'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950'
                  }`}
                >
                  {isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {editingCourse ? 'Edit Course Settings' : 'Create New Course'}
                </h3>
                <p className="text-xs text-slate-500">Configure regulatory metadata, level, and certification mapping.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. NISM Series VIII: Equity Derivatives Masterclass"
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Syllabus Overview
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive coverage of Greek models, SEBI margining framework, and algorithmic trade mechanics..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Knowledge Level
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estimated Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Publishing Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REVIEW">Under Review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Certification Track Mapping
                  </label>
                  <select
                    value={formCertId || ''}
                    onChange={(e) => setFormCertId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  >
                    <option value="">None (Independent Module)</option>
                    {certifications.map((cert) => (
                      <option key={cert.certification_id} value={cert.certification_id}>
                        {cert.certification_name} ({cert.governing_body || 'NISM'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Thumbnail URL / Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center cursor-pointer">
                      <UploadCloud className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
