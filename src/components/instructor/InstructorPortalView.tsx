import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Plus, 
  Calendar, 
  GraduationCap, 
  BarChart3,
  Layers,
  HelpCircle,
  FileText,
  Activity,
  Flag,
  Check
} from 'lucide-react';
import { 
  User as UserType, 
  CourseEnrollmentRecord, 
  LMSAssignment, 
  LMSAssignmentSubmission, 
  InstructorPrivateNote,
  InstructorIntervention,
  LearnerActivityEvent,
  AppNavView,
  CourseBatch,
  InstructorProfile
} from '../../types/schema';
import { lmsService } from '../../services/lmsService';

interface InstructorPortalViewProps {
  currentUser: UserType;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export type InstructorTab = 'dashboard' | 'learners' | 'grading' | 'courses' | 'announcements';

export const InstructorPortalView: React.FC<InstructorPortalViewProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<InstructorTab>('dashboard');
  const [enrollments, setEnrollments] = useState<CourseEnrollmentRecord[]>([]);
  const [submissions, setSubmissions] = useState<LMSAssignmentSubmission[]>([]);
  const [batches, setBatches] = useState<CourseBatch[]>([]);
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [activity, setActivity] = useState<LearnerActivityEvent[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'name' | 'progress' | 'quiz' | 'last_active'>('last_active');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Panels
  type DossierTab = 'overview' | 'courses' | 'assessments' | 'assignments' | 'activity' | 'notes' | 'interventions';
  const [selectedLearnerDetail, setSelectedLearnerDetail] = useState<CourseEnrollmentRecord | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<DossierTab>('overview');
  const [learnerNotes, setLearnerNotes] = useState<InstructorPrivateNote[]>([]);
  const [learnerInterventions, setLearnerInterventions] = useState<InstructorIntervention[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newInterventionTitle, setNewInterventionTitle] = useState('');
  const [newInterventionDesc, setNewInterventionDesc] = useState('');
  const [newInterventionType, setNewInterventionType] = useState<InstructorIntervention['type']>('TUTORING');
  const [evaluatingSubmission, setEvaluatingSubmission] = useState<LMSAssignmentSubmission | null>(null);
  const [evalScore, setEvalScore] = useState<number>(90);
  const [evalFeedback, setEvalFeedback] = useState<string>('');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcementsList, setAnnouncementsList] = useState<Array<{ id: string; title: string; body: string; date: string }>>([
    {
      id: 'ann-1',
      title: 'Mid-Term Quantitative Bond Drill Reminder',
      body: 'All students enrolled in NISM XV are required to submit the Chapter 3 Bond Pricing drill before Sunday 23:59 IST.',
      date: '2026-11-03'
    }
  ]);

  // Load state and subscribe
  useEffect(() => {
    const refreshData = () => {
      setEnrollments(lmsService.getEnrollments());
      setSubmissions(lmsService.getSubmissions());
      setBatches(lmsService.getBatches());
      setInstructors(lmsService.getInstructors());
      setActivity(lmsService.getActivityEvents(10));
    };

    refreshData();
    return lmsService.subscribe(refreshData);
  }, []);

  // When selected learner changes, load private notes & interventions
  useEffect(() => {
    if (selectedLearnerDetail) {
      setLearnerNotes(lmsService.getInstructorNotes(selectedLearnerDetail.learner_id));
      setLearnerInterventions(lmsService.getInterventions(selectedLearnerDetail.learner_id));
      setActiveDossierTab('overview');
    }
  }, [selectedLearnerDetail]);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  // KPI Metrics Calculations
  const totalStudents = enrollments.length;
  const activeStudents = enrollments.filter(e => e.status === 'ACTIVE').length;
  const atRiskStudents = enrollments.filter(e => e.status === 'AT_RISK').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'SUBMITTED').length;
  const completedStudents = enrollments.filter(e => e.status === 'COMPLETED').length;
  const avgQuiz = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + e.quiz_avg_score, 0) / enrollments.length)
    : 0;

  // Filtering Learners
  const filteredLearners = enrollments.filter(learner => {
    const matchesSearch = 
      learner.learner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learner.learner_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(learner.learner_id).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = selectedCourseFilter === 'ALL' || String(learner.course_id) === selectedCourseFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || learner.status === selectedStatusFilter;
    const matchesBatch = selectedBatchFilter === 'ALL' || learner.batch_id === selectedBatchFilter;

    return matchesSearch && matchesCourse && matchesStatus && matchesBatch;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') comparison = a.learner_name.localeCompare(b.learner_name);
    else if (sortField === 'progress') comparison = a.progress_pct - b.progress_pct;
    else if (sortField === 'quiz') comparison = a.quiz_avg_score - b.quiz_avg_score;
    else if (sortField === 'last_active') comparison = new Date(a.last_active_at).getTime() - new Date(b.last_active_at).getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage) || 1;
  const paginatedLearners = filteredLearners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearnerDetail || !newNoteText.trim()) return;

    lmsService.addInstructorNote(
      selectedLearnerDetail.learner_id,
      'inst-001',
      currentUser.full_name,
      selectedLearnerDetail.course_id,
      newNoteText.trim()
    );

    setLearnerNotes(lmsService.getInstructorNotes(selectedLearnerDetail.learner_id));
    setNewNoteText('');
    showToast('Instructor learning note saved.');
  };

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearnerDetail || !newInterventionTitle.trim()) return;
    const created = lmsService.createIntervention({
      learner_id: selectedLearnerDetail.learner_id,
      instructor_id: 'inst-001',
      instructor_name: currentUser.full_name,
      course_id: selectedLearnerDetail.course_id,
      type: newInterventionType,
      title: newInterventionTitle.trim(),
      description: newInterventionDesc.trim() || 'Instructor intervention created for learner support.',
      status: 'PENDING'
    });
    setLearnerInterventions(prev => [created, ...prev]);
    setNewInterventionTitle('');
    setNewInterventionDesc('');
    showToast(`Created intervention: ${created.title}`);
  };

  const handleResolveIntervention = (id: string) => {
    lmsService.resolveIntervention(id);
    setLearnerInterventions(prev => prev.map(i => i.intervention_id === id ? { ...i, status: 'RESOLVED' as const, resolved_at: new Date().toISOString() } : i));
    showToast('Intervention marked as resolved');
  };

  const handleOpenEvaluationModal = (sub: LMSAssignmentSubmission) => {
    setEvaluatingSubmission(sub);
    setEvalScore(sub.score || 90);
    setEvalFeedback(sub.instructor_feedback || 'Well-structured analysis with solid adherence to SEBI compliance standards.');
    setRubricScores(sub.rubric_scores || {
      'Mathematical Accuracy': 35,
      'Regulatory Interpretation': 30,
      'Presentation & Formatting': 25
    });
  };

  const handlePublishGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSubmission) return;

    const result = lmsService.evaluateSubmission(
      evaluatingSubmission.submission_id,
      'inst-001',
      currentUser.full_name,
      evalScore,
      evalFeedback,
      rubricScores
    );

    if (result.success) {
      setEvaluatingSubmission(null);
      showToast(`Evaluation published! Score of ${evalScore}/100 awarded.`);
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;

    setAnnouncementsList(prev => [
      {
        id: `ann-${Date.now()}`,
        title: announcementTitle.trim(),
        body: announcementBody.trim(),
        date: new Date().toISOString().substring(0, 10)
      },
      ...prev
    ]);
    setAnnouncementTitle('');
    setAnnouncementBody('');
    showToast('Course announcement published to all enrolled cohorts.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#022C22] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md text-xs font-mono font-bold tracking-wide ${
              currentUser.isDemoUser 
                ? 'bg-white/10 text-amber-300' 
                : 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser.isDemoUser 
                ? 'DEMO MODE — Sample learner records and progress' 
                : 'Academic Faculty Portal • Assigned Courses & Cohorts'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Instructor Course & Cohort Operations
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Welcome, {currentUser.full_name}. Oversee enrolled batches, monitor student risk factors, and grade quantitative valuation case studies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('grading')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Grade Submissions ({pendingSubmissions})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard' as InstructorTab, label: 'Dashboard & Metrics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'learners' as InstructorTab, label: 'Learner Monitoring', icon: <Users className="w-4 h-4" /> },
            { id: 'grading' as InstructorTab, label: `Submissions (${pendingSubmissions})`, icon: <FileCheck2 className="w-4 h-4" /> },
            { id: 'courses' as InstructorTab, label: 'Assigned Courses', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'announcements' as InstructorTab, label: 'Announcements', icon: <MessageSquare className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INSTRUCTOR DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total Enrolled</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalStudents}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Across 4 Batches</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Active Learners</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeStudents}</div>
              <div className="text-[10px] text-slate-500 mt-1">High Engagement</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-amber-300/40 dark:border-amber-900/40 bg-amber-50/20 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">At-Risk Learners</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{atRiskStudents}</div>
              <div className="text-[10px] text-amber-700/80 font-semibold mt-1">Needs Remediation</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Pending Evaluation</div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{pendingSubmissions}</div>
              <div className="text-[10px] text-slate-500 mt-1">Awaiting Review</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Completed</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{completedStudents}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Certified</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Quiz Average</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgQuiz}%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Passing Grade</div>
            </div>
          </div>

          {/* At-Risk Alerts & Action Recommendation */}
          {atRiskStudents > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200">
                    {atRiskStudents} Enrolled Learners Flagged for Low Performance
                  </div>
                  <p className="text-amber-800/80 dark:text-amber-300/80">
                    Learners like Rohan Kulkarni have fallen behind the weekly benchmark (&lt;50% syllabus coverage or missed bond pricing submissions).
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedStatusFilter('AT_RISK');
                  setActiveTab('learners');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer whitespace-nowrap"
              >
                Review At-Risk Students
              </button>
            </div>
          )}

          {/* Cohort Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Assigned Batches & Enrolment Progress</span>
              </h3>
              <div className="space-y-3">
                {batches.map(b => (
                  <div key={b.batch_id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>{b.batch_name}</span>
                      <span className="font-mono text-emerald-600">{b.enrolled_count} / {b.capacity} Students</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.course_title}
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.round((b.enrolled_count / b.capacity) * 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Recent Platform Activity Stream</span>
              </h3>
              <div className="space-y-3 text-xs">
                {activity.slice(0, 5).map(evt => (
                  <div key={evt.event_id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono text-[10px]">
                      {evt.type === 'ASSIGNMENT_SUBMIT' ? 'SUBMIT' : evt.type === 'ASSIGNMENT_GRADED' ? 'GRADED' : 'EVENT'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{evt.title}</div>
                      <div className="text-slate-500 text-[11px] truncate">{evt.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{evt.timestamp.substring(0, 16).replace('T', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEARNER MONITORING ROSTER (MAJOR FEATURE) */}
      {activeTab === 'learners' && (
        <div className="space-y-5">
          {/* Search, Filter & Sort Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by learner name, email, or student ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => { setSelectedCourseFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Courses</option>
                  <option value="3">NISM Series XV</option>
                  <option value="1">Equity Derivatives</option>
                  <option value="2">Mutual Funds V-A</option>
                  <option value="4">DCF Valuation</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="AT_RISK">At-Risk</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-hidden cursor-pointer"
                >
                  <option value="last_active">Sort: Last Active</option>
                  <option value="progress">Sort: Progress %</option>
                  <option value="quiz">Sort: Quiz Score</option>
                  <option value="name">Sort: Name</option>
                </select>

                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition cursor-pointer"
                  title="Toggle Asc/Desc"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Showing {paginatedLearners.length} of {filteredLearners.length} matching students</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>

          {/* Roster Table */}
          <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-mono">
                    <th className="py-3 px-4">Student Profile</th>
                    <th className="py-3 px-4">Course & Cohort</th>
                    <th className="py-3 px-4">Completion</th>
                    <th className="py-3 px-4 text-center">Lessons</th>
                    <th className="py-3 px-4 text-center">Quiz Avg</th>
                    <th className="py-3 px-4 text-center">Assignments</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedLearners.map((learner) => (
                    <tr 
                      key={learner.enrollment_id} 
                      onClick={() => setSelectedLearnerDetail(learner)}
                      className="hover:bg-emerald-50/40 dark:hover:bg-slate-850/60 transition cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={learner.learner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={learner.learner_name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{learner.learner_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{learner.learner_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{learner.course_title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{learner.batch_name}</div>
                      </td>
                      <td className="py-3 px-4 min-w-[120px]">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1 font-bold">
                          <span>{learner.progress_pct}%</span>
                          <span className="text-slate-400">{learner.learning_hours}h</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${learner.progress_pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${learner.progress_pct}%` }} 
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {learner.lessons_completed}/{learner.total_lessons}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {learner.quiz_avg_score > 0 ? `${learner.quiz_avg_score}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                        {learner.assignments_submitted}/{learner.total_assignments}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          learner.status === 'COMPLETED'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            : learner.status === 'AT_RISK'
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {learner.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLearnerDetail(learner);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white font-bold text-xs transition cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSIONS EVALUATION */}
      {activeTab === 'grading' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pending & Graded Student Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted quantitative models and assign rubric scores.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
              {pendingSubmissions} Awaiting Review
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => {
              const isGraded = sub.status === 'GRADED';
              return (
                <div
                  key={sub.submission_id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {sub.assignment_title}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isGraded 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Submitted by <strong className="text-slate-900 dark:text-white">{sub.learner_name}</strong> ({sub.learner_email}) • {sub.course_title}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 italic pt-1">
                      "{sub.content_text}"
                    </p>

                    {isGraded && (
                      <div className="pt-2 flex items-center gap-3 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                        <span>Score: {sub.score} / {sub.max_score}</span>
                        <span>• Evaluated by {sub.evaluator_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEvaluationModal(sub)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                        isGraded
                          ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isGraded ? 'Review / Edit Grade' : 'Evaluate & Score'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNED COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {batches.map(batch => (
            <div
              key={batch.batch_id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                    {batch.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {batch.course_title}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">{batch.batch_name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px]">Enrollment</div>
                  <div className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{batch.enrolled_count} / {batch.capacity}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px]">Duration</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{batch.start_date} to {batch.end_date}</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('learn')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Launch Lesson Editor
                </button>
                <button
                  onClick={() => {
                    setSelectedCourseFilter(String(batch.course_id));
                    setActiveTab('learners');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  View Enrolled Students
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Broadcast Course Announcement
            </h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                  placeholder="e.g. Chapter 4 Quiz Window Open"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Body Text *</label>
                <textarea
                  rows={4}
                  value={announcementBody}
                  onChange={(e) => setAnnouncementBody(e.target.value)}
                  required
                  placeholder="Provide announcement details, important instructions, or deadline alerts..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Published Course Announcements
            </h3>
            <div className="space-y-3">
              {announcementsList.map(a => (
                <div key={a.id} className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{a.title}</h4>
                    <span className="font-mono text-slate-400 text-[11px]">{a.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEARNER DETAIL DRAWER / MODAL (7-TAB COMPREHENSIVE DOSSIER) */}
      {selectedLearnerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header with Avatar & Identity */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedLearnerDetail.learner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={selectedLearnerDetail.learner_name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-600">
                    ID: {selectedLearnerDetail.learner_id} • Cohort: {selectedLearnerDetail.batch_name}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedLearnerDetail.learner_name}
                  </h2>
                  <div className="text-xs text-slate-500">{selectedLearnerDetail.learner_email}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLearnerDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7-Tab Navigation Bar */}
            <div className="flex overflow-x-auto gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold scrollbar-none">
              {(
                [
                  { id: 'overview', label: 'Overview' },
                  { id: 'courses', label: 'Courses & Progress' },
                  { id: 'assessments', label: 'Assessments & Grades' },
                  { id: 'assignments', label: 'Assignments' },
                  { id: 'activity', label: 'Learning Activity' },
                  { id: 'notes', label: 'Instructor Notes' },
                  { id: 'interventions', label: 'Interventions' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDossierTab(tab.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                    activeDossierTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'notes' && learnerNotes.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">
                      {learnerNotes.length}
                    </span>
                  )}
                  {tab.id === 'interventions' && learnerInterventions.filter(i => i.status !== 'RESOLVED').length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px]">
                      {learnerInterventions.filter(i => i.status !== 'RESOLVED').length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="space-y-5 text-xs min-h-[300px]">
              {/* TAB 1: OVERVIEW */}
              {activeDossierTab === 'overview' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Course Progress</div>
                      <div className="text-xl font-bold text-emerald-600 mt-1">{selectedLearnerDetail.progress_pct}%</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Quiz Average</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedLearnerDetail.quiz_avg_score}%</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Learning Hours</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedLearnerDetail.learning_hours}h</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Current Standing</div>
                      <div className="text-xl font-bold text-amber-500 mt-1">{selectedLearnerDetail.final_grade || 'B+'}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Academic Cohort Details</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
                      <div><strong className="text-slate-900 dark:text-white">Active Course:</strong> {selectedLearnerDetail.course_title}</div>
                      <div><strong className="text-slate-900 dark:text-white">Batch / Cohort:</strong> {selectedLearnerDetail.batch_name}</div>
                      <div><strong className="text-slate-900 dark:text-white">Enrollment Date:</strong> {selectedLearnerDetail.enrolled_at.substring(0, 10)}</div>
                      <div><strong className="text-slate-900 dark:text-white">Last Activity:</strong> {selectedLearnerDetail.last_active_at.substring(0, 10)}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-blue-950 dark:text-blue-300">Quick Faculty Actions</div>
                      <div className="text-slate-500 text-[11px]">Direct interventions or tutoring adjustments</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveDossierTab('interventions')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                      >
                        Create Intervention
                      </button>
                      <button
                        onClick={() => setActiveDossierTab('notes')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-bold transition cursor-pointer"
                      >
                        Add Private Note
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES & PROGRESS */}
              {activeDossierTab === 'courses' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedLearnerDetail.course_title}</h4>
                        <div className="text-slate-500 text-[11px] font-mono">Curriculum Track • Course ID: {selectedLearnerDetail.course_id}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00E599] font-bold text-[11px]">
                        {selectedLearnerDetail.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Syllabus Completion</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedLearnerDetail.progress_pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#00E599]"
                          style={{ width: `${selectedLearnerDetail.progress_pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <div><span className="text-slate-400">Chapters:</span> 15 NISM Chapters</div>
                      <div><span className="text-slate-400">Completed Modules:</span> {Math.round((selectedLearnerDetail.progress_pct / 100) * 15)} / 15</div>
                      <div><span className="text-slate-400">Certificate Status:</span> {selectedLearnerDetail.progress_pct >= 100 ? '✅ Issued' : '⏳ Pending Completion'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ASSESSMENTS & GRADES */}
              {activeDossierTab === 'assessments' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Competency & Topic Breakdown</h4>
                      <span className="font-mono text-emerald-600 font-bold">Overall Average: {selectedLearnerDetail.quiz_avg_score}%</span>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {[
                        { topic: 'Securities Markets & Regulatory Framework', score: Math.min(100, selectedLearnerDetail.quiz_avg_score + 4) },
                        { topic: 'Fundamental & Technical Analysis', score: selectedLearnerDetail.quiz_avg_score },
                        { topic: 'Valuation & Corporate Finance Models', score: Math.max(50, selectedLearnerDetail.quiz_avg_score - 8) },
                        { topic: 'Derivatives, Options Greeks & Risk Architecture', score: Math.max(45, selectedLearnerDetail.quiz_avg_score - 14) }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-700 dark:text-slate-300">{item.topic}</span>
                            <span className={`font-mono font-bold ${item.score < 65 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{item.score}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full ${item.score < 65 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ASSIGNMENTS & SUBMISSIONS */}
              {activeDossierTab === 'assignments' && (
                <div className="space-y-3 animate-fade-in">
                  {(() => {
                    const studentSubs = lmsService.getLearnerSubmissions(selectedLearnerDetail.learner_id);
                    if (studentSubs.length === 0) {
                      return (
                        <div className="p-6 text-center text-slate-400 italic rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                          No assignment submissions recorded for this learner yet.
                        </div>
                      );
                    }
                    return studentSubs.map((sub) => (
                      <div key={sub.submission_id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">{sub.assignment_title}</h5>
                            <div className="text-[11px] text-slate-500 font-mono">Submitted: {sub.submitted_at.substring(0, 10)}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sub.status === 'GRADED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {sub.status === 'GRADED' ? `Score: ${sub.score}/100` : 'Pending Evaluation'}
                          </span>
                        </div>
                        {sub.instructor_feedback && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                            <strong>Faculty Feedback:</strong> {sub.instructor_feedback}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* TAB 5: LEARNING ACTIVITY */}
              {activeDossierTab === 'activity' && (
                <div className="space-y-2.5 animate-fade-in max-h-72 overflow-y-auto">
                  {(() => {
                    const studentEvents = lmsService.getLearnerActivity(selectedLearnerDetail.learner_id);
                    if (studentEvents.length === 0) {
                      return (
                        <div className="p-6 text-center text-slate-400 italic rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                          No learning activity events logged for this learner.
                        </div>
                      );
                    }
                    return studentEvents.map((evt) => (
                      <div key={evt.event_id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 dark:text-white">{evt.title}</span>
                          <span className="font-mono text-slate-400 text-[10px]">{evt.timestamp.substring(0, 10)}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{evt.description}</p>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* TAB 6: INSTRUCTOR NOTES */}
              {activeDossierTab === 'notes' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-slate-500 text-[11px]">
                    Private notes are confidential to accredited instructors and are never visible to learners or unauthorized users.
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {learnerNotes.length === 0 ? (
                      <div className="text-slate-400 italic text-[11px] p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900">
                        No private notes recorded for this learner yet.
                      </div>
                    ) : (
                      learnerNotes.map((n) => (
                        <div key={n.note_id} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px]">
                          <div className="font-bold text-amber-900 dark:text-amber-300 flex justify-between">
                            <span>{n.instructor_name}</span>
                            <span className="font-mono text-slate-400">{n.created_at.substring(0, 10)}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 mt-1">{n.note_text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add private evaluation note or tutoring reminder..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Save Note
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: INTERVENTIONS & REMEDIATION */}
              {activeDossierTab === 'interventions' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-slate-500 text-[11px]">
                    Log targeted faculty interventions, tutoring sessions, and remediation workflows for struggling learners.
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {learnerInterventions.length === 0 ? (
                      <div className="text-slate-400 italic text-[11px] p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900">
                        No active interventions recorded for this learner.
                      </div>
                    ) : (
                      learnerInterventions.map((intv) => (
                        <div key={intv.intervention_id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                                {intv.type}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">{intv.title}</span>
                            </div>
                            {intv.status === 'RESOLVED' ? (
                              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3" /> Resolved
                              </span>
                            ) : (
                              <button
                                onClick={() => handleResolveIntervention(intv.intervention_id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition cursor-pointer"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">{intv.description}</p>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Logged by {intv.instructor_name} on {intv.created_at.substring(0, 10)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Intervention Form */}
                  <form onSubmit={handleAddIntervention} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 pt-2">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">Create New Intervention</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={newInterventionType}
                        onChange={(e) => setNewInterventionType(e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden"
                      >
                        <option value="TUTORING">1-on-1 Tutoring</option>
                        <option value="REMEDIAL_QUIZ">Remedial Valuation Drill</option>
                        <option value="DEADLINE_EXTENSION">Assignment Extension</option>
                        <option value="DIFFICULTY_FLAG">Flag Learning Difficulty</option>
                      </select>
                      <input
                        type="text"
                        required
                        value={newInterventionTitle}
                        onChange={(e) => setNewInterventionTitle(e.target.value)}
                        placeholder="Intervention title..."
                        className="sm:col-span-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterventionDesc}
                        onChange={(e) => setNewInterventionDesc(e.target.value)}
                        placeholder="Specific remediation instructions or learning gap notes..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedLearnerDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVALUATION / GRADING MODAL */}
      {evaluatingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  Faculty Evaluation Terminal
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {evaluatingSubmission.assignment_title}
                </h2>
                <div className="text-xs text-slate-500">
                  Student: {evaluatingSubmission.learner_name} ({evaluatingSubmission.learner_email})
                </div>
              </div>
              <button
                onClick={() => setEvaluatingSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Student's Submission Content */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Student Written Analytical Response</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {evaluatingSubmission.content_text}
                </p>
                {evaluatingSubmission.quantitative_work && (
                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600">
                    <div>Model Output: {evaluatingSubmission.quantitative_work.financial_model_output}</div>
                  </div>
                )}
              </div>

              {/* Grading Form */}
              <form onSubmit={handlePublishGrade} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Awarded Marks (Max: {evaluatingSubmission.max_score}) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={evaluatingSubmission.max_score}
                      value={evalScore}
                      onChange={(e) => setEvalScore(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base font-bold outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Qualitative Pedagogical Feedback *
                  </label>
                  <textarea
                    rows={4}
                    value={evalFeedback}
                    onChange={(e) => setEvalFeedback(e.target.value)}
                    required
                    placeholder="Provide constructive commentary on mathematical accuracy, regulatory interpretation, and areas for improvement..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEvaluatingSubmission(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Evaluation & Update Gradebook</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

