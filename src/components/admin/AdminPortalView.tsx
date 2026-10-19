import React, { useState, useEffect } from 'react';
import { 
  User, 
  Course, 
  Topic, 
  Lesson, 
  LessonContent, 
  LessonResource, 
  Question, 
  Quiz, 
  MockExam, 
  Certification, 
  Achievement, 
  StudyPlanTemplate, 
  Announcement, 
  ContentAuditLog,
  AdminDashboardMetrics,
  AppNavView
} from '../../types/schema';
import { adminService } from '../../services/adminService';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboardView } from './AdminDashboardView';
import { EnterpriseGovernanceView } from './EnterpriseGovernanceView';
import { InstitutionalAnalyticsView } from './InstitutionalAnalyticsView';
import { CourseManagerView } from './CourseManagerView';
import { CourseStructureBuilder } from './CourseStructureBuilder';
import { LessonEditorView } from './LessonEditorView';
import { QuestionBankView } from './QuestionBankView';
import { QuizExamManagerView } from './QuizExamManagerView';
import { CertificationManagerView } from './CertificationManagerView';
import { AchievementManagerView } from './AchievementManagerView';
import { StudyPlanTemplateManagerView } from './StudyPlanTemplateManagerView';
import { AnnouncementsManagerView } from './AnnouncementsManagerView';
import { LearnerManagerView } from './LearnerManagerView';
import { AuditLogsView } from './AuditLogsView';
import { AdminPreviewModal } from './AdminPreviewModal';

interface AdminPortalViewProps {
  currentUser: User;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  lessonContents: LessonContent[];
  lessonResources: LessonResource[];
  quizzes: Quiz[];
  questions: Question[];
  mockExams: MockExam[];
  certifications: Certification[];
  achievements: Achievement[];
  learners: User[];
  onNavigate: (view: AppNavView) => void;
  onUpdateLearners?: (learners: User[]) => void;
  // State Mutators
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateLessons: (lessons: Lesson[]) => void;
  onUpdateLessonContents: (contents: LessonContent[]) => void;
  onUpdateLessonResources: (resources: LessonResource[]) => void;
  onUpdateQuestions: (questions: Question[]) => void;
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  onUpdateMockExams: (exams: MockExam[]) => void;
  onUpdateCertifications: (certs: Certification[]) => void;
  onUpdateAchievements: (achievements: Achievement[]) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  courses,
  topics,
  lessons,
  lessonContents,
  lessonResources,
  quizzes,
  questions,
  mockExams,
  certifications,
  achievements,
  learners,
  onNavigate,
  onUpdateLearners,
  onUpdateCourses,
  onUpdateLessons,
  onUpdateLessonContents,
  onUpdateLessonResources,
  onUpdateQuestions,
  onUpdateQuizzes,
  onUpdateMockExams,
  onUpdateCertifications,
  onUpdateAchievements
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [learnersList, setLearnersList] = useState<User[]>(learners);

  useEffect(() => {
    setLearnersList(learners);
  }, [learners]);
  const [auditLogs, setAuditLogs] = useState<ContentAuditLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-init-1',
      title: 'Official NISM Regulatory Syllabus 2026 Live',
      message: 'New simulated question banks for Series VIII & XV are now available for all enrolled learners.',
      audience: 'ALL_USERS',
      status: 'PUBLISHED',
      created_at: new Date().toISOString()
    }
  ]);
  const [templates, setTemplates] = useState<StudyPlanTemplate[]>([
    {
      template_id: 'tpl-nism-8',
      title: 'NISM Series VIII: Equity Derivatives — 6 Weeks',
      description: 'Comprehensive quantitative and regulatory preparation roadmap covering Options Greeks, SPAN margining, and SEBI circulars.',
      target_certification_id: 1,
      duration_weeks: 6,
      recommended_hours_per_week: 8,
      weekly_schedule: [
        { week: 1, title: 'Introduction to Derivatives & Microstructure', focus_topic_ids: [1], lesson_ids: [1, 2], quiz_ids: [1], mock_exam_ids: [] },
        { week: 2, title: 'Option Greeks & Volatility Surface', focus_topic_ids: [2], lesson_ids: [3, 4], quiz_ids: [2], mock_exam_ids: [] },
        { week: 3, title: 'SEBI Margining Framework & Final Mock', focus_topic_ids: [3], lesson_ids: [5], quiz_ids: [3], mock_exam_ids: [1] }
      ],
      status: 'PUBLISHED'
    }
  ]);

  // Active item in sub-editors
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.course_id || 1);
  const [editingLessonId, setEditingLessonId] = useState<number>(lessons[0]?.lesson_id || 1);

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'COURSE' | 'LESSON' | 'QUIZ' | 'EXAM'>('COURSE');
  const [previewItem, setPreviewItem] = useState<any>(null);

  // Load audit logs on mount
  useEffect(() => {
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  }, []);

  // Compute metrics
  const dashboardMetrics = adminService.computeDashboardMetrics(
    courses,
    lessons,
    lessonResources,
    quizzes,
    questions,
    mockExams,
    certifications,
    auditLogs,
    learners.length
  );

  // ---------------- Course Actions ----------------
  const handleSaveCourse = (updatedCourse: Course) => {
    const exists = courses.some(c => c.course_id === updatedCourse.course_id);
    const updated = exists
      ? courses.map(c => c.course_id === updatedCourse.course_id ? updatedCourse : c)
      : [updatedCourse, ...courses];

    onUpdateCourses(updated);
    adminService.logAdminAction(
      currentUser,
      exists ? 'UPDATE' : 'CREATE',
      'COURSE',
      updatedCourse.course_id,
      updatedCourse.course_title
    );
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleDuplicateCourse = (courseId: number) => {
    const original = courses.find(c => c.course_id === courseId);
    if (!original) return;

    const dupCourse: Course = {
      ...original,
      course_id: Date.now(),
      course_title: `${original.course_title} (Copy)`,
      status: 'DRAFT'
    };

    onUpdateCourses([dupCourse, ...courses]);
    adminService.logAdminAction(currentUser, 'DUPLICATE', 'COURSE', dupCourse.course_id, dupCourse.course_title);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleArchiveCourse = (courseId: number) => {
    const updated = courses.map(c => c.course_id === courseId ? { ...c, status: 'ARCHIVED' as const } : c);
    onUpdateCourses(updated);
    adminService.logAdminAction(currentUser, 'ARCHIVE', 'COURSE', courseId);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleTogglePublishCourse = (courseId: number) => {
    const course = courses.find(c => c.course_id === courseId);
    if (!course) return;

    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updated = courses.map(c => c.course_id === courseId ? { ...c, status: newStatus as any } : c);
    onUpdateCourses(updated);
    adminService.logAdminAction(
      currentUser, 
      newStatus === 'PUBLISHED' ? 'PUBLISH' : 'UNPUBLISH', 
      'COURSE', 
      courseId, 
      course.course_title
    );
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  // ---------------- Lesson Actions ----------------
  const handleSaveLesson = (
    updatedLesson: Lesson,
    updatedContent: Partial<LessonContent>,
    resources: LessonResource[],
    tamilData?: { title: string; content: string }
  ) => {
    // 1. Update Lessons
    const lessonExists = lessons.some(l => l.lesson_id === updatedLesson.lesson_id);
    const newLessons = lessonExists
      ? lessons.map(l => l.lesson_id === updatedLesson.lesson_id ? updatedLesson : l)
      : [...lessons, updatedLesson];
    onUpdateLessons(newLessons);

    // 2. Update Content
    const fullContent: LessonContent = {
      content_id: lessonContents.find(lc => lc.lesson_id === updatedLesson.lesson_id)?.content_id || Date.now(),
      lesson_id: updatedLesson.lesson_id,
      content_type: updatedContent.content_type || 'MARKDOWN_TEXT',
      content_url: updatedContent.content_url || '',
      raw_body: updatedContent.raw_body || '',
      formulas: updatedContent.formulas,
      key_takeaways: updatedContent.key_takeaways
    };

    const newContents = lessonContents.some(lc => lc.lesson_id === updatedLesson.lesson_id)
      ? lessonContents.map(lc => lc.lesson_id === updatedLesson.lesson_id ? fullContent : lc)
      : [...lessonContents, fullContent];
    onUpdateLessonContents(newContents);

    // 3. Update Resources
    const otherResources = lessonResources.filter(r => r.lesson_id !== updatedLesson.lesson_id);
    onUpdateLessonResources([...otherResources, ...resources]);

    adminService.logAdminAction(
      currentUser,
      lessonExists ? 'UPDATE' : 'CREATE',
      'LESSON',
      updatedLesson.lesson_id,
      updatedLesson.title
    );
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
    alert('Lesson content, formulas, and resources successfully saved to database!');
  };

  const handleReorderLesson = (lessonId: number, direction: 'UP' | 'DOWN') => {
    const lesson = lessons.find(l => l.lesson_id === lessonId);
    if (!lesson) return;

    const topicLessons = lessons
      .filter(l => l.topic_id === lesson.topic_id && l.course_id === lesson.course_id)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    const currIdx = topicLessons.findIndex(l => l.lesson_id === lessonId);
    const targetIdx = direction === 'UP' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= topicLessons.length) return;

    const targetLesson = topicLessons[targetIdx];
    const newLessons = lessons.map(l => {
      if (l.lesson_id === lesson.lesson_id) return { ...l, order_index: targetLesson.order_index || targetIdx + 1 };
      if (l.lesson_id === targetLesson.lesson_id) return { ...l, order_index: lesson.order_index || currIdx + 1 };
      return l;
    });

    onUpdateLessons(newLessons);
  };

  const handleAddLessonToTopic = (courseId: number, topicId: number) => {
    const newLesson: Lesson = {
      lesson_id: Date.now(),
      course_id: courseId,
      topic_id: topicId,
      title: 'New Educational Lesson',
      resource_links: [],
      estimated_mins: 15,
      status: 'DRAFT',
      order_index: lessons.filter(l => l.course_id === courseId && l.topic_id === topicId).length + 1
    };

    onUpdateLessons([...lessons, newLesson]);
    setEditingLessonId(newLesson.lesson_id);
    setCurrentTab('lessons');
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    onUpdateLessons(lessons.filter(l => l.lesson_id !== lessonId));
    adminService.logAdminAction(currentUser, 'DELETE', 'LESSON', lessonId);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  // ---------------- Question Bank Actions ----------------
  const handleSaveQuestion = (q: Question) => {
    const exists = questions.some(item => item.question_id === q.question_id);
    const updated = exists ? questions.map(item => item.question_id === q.question_id ? q : item) : [q, ...questions];
    onUpdateQuestions(updated);
    adminService.logAdminAction(currentUser, exists ? 'UPDATE' : 'CREATE', 'QUESTION', q.question_id, q.question_text.slice(0, 40));
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleDeleteQuestion = (qId: number) => {
    if (!confirm('Are you sure you want to delete this MCQ?')) return;
    onUpdateQuestions(questions.filter(q => q.question_id !== qId));
    adminService.logAdminAction(currentUser, 'DELETE', 'QUESTION', qId);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleDuplicateQuestion = (qId: number) => {
    const q = questions.find(item => item.question_id === qId);
    if (!q) return;
    const dup: Question = { ...q, question_id: Date.now(), question_text: `${q.question_text} (Copy)` };
    onUpdateQuestions([dup, ...questions]);
    adminService.logAdminAction(currentUser, 'DUPLICATE', 'QUESTION', dup.question_id);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleBulkImportQuestions = (imported: Question[]) => {
    onUpdateQuestions([...imported, ...questions]);
    adminService.logAdminAction(currentUser, 'IMPORT', 'QUESTION', 'bulk', `Imported ${imported.length} questions`);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
    alert(`Successfully imported ${imported.length} questions into Question Bank!`);
  };

  // ---------------- Quiz & Exam Actions ----------------
  const handleSaveQuiz = (quiz: Quiz, qIds: number[]) => {
    const exists = quizzes.some(q => q.quiz_id === quiz.quiz_id);
    const updated = exists ? quizzes.map(q => q.quiz_id === quiz.quiz_id ? quiz : q) : [quiz, ...quizzes];
    onUpdateQuizzes(updated);
    adminService.logAdminAction(currentUser, exists ? 'UPDATE' : 'CREATE', 'QUIZ', quiz.quiz_id, quiz.title);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const handleSaveMockExam = (exam: MockExam, qIds: number[]) => {
    const exists = mockExams.some(e => e.exam_id === exam.exam_id);
    const updated = exists ? mockExams.map(e => e.exam_id === exam.exam_id ? exam : e) : [exam, ...mockExams];
    onUpdateMockExams(updated);
    adminService.logAdminAction(currentUser, exists ? 'UPDATE' : 'CREATE', 'MOCK_EXAM', exam.exam_id, exam.title);
    adminService.getAuditLogs().then(logs => setAuditLogs(logs));
  };

  const currentEditingLesson = lessons.find(l => l.lesson_id === editingLessonId) || lessons[0];
  const currentEditingContent = lessonContents.find(lc => lc.lesson_id === (currentEditingLesson?.lesson_id || 1));
  const currentEditingResources = lessonResources.filter(lr => lr.lesson_id === (currentEditingLesson?.lesson_id || 1));

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onExitToLearnerApp={() => onNavigate('dashboard')}
      currentUser={currentUser}
    >
      {/* 1. Dashboard Tab */}
      {currentTab === 'dashboard' && (
        <AdminDashboardView
          metrics={dashboardMetrics}
          onNavigateTab={setCurrentTab}
          onQuickAction={(action) => {
            if (action === 'CREATE_COURSE') setCurrentTab('courses');
            else if (action === 'CREATE_LESSON') setCurrentTab('lessons');
            else if (action === 'CREATE_QUESTION') setCurrentTab('questions');
            else if (action === 'CREATE_QUIZ' || action === 'CREATE_EXAM') setCurrentTab('quizzes-exams');
          }}
        />
      )}

      {/* 1a. Enterprise & Compliance Governance Tab */}
      {currentTab === 'enterprise-governance' && (
        <EnterpriseGovernanceView
          currentUser={currentUser}
          questions={questions}
        />
      )}

      {/* 1b. Institutional Analytics Tab */}
      {currentTab === 'institutional-analytics' && (
        <InstitutionalAnalyticsView
          questions={questions}
          topics={topics}
          certifications={certifications}
        />
      )}

      {/* 2. Courses Tab */}
      {currentTab === 'courses' && (
        <CourseManagerView
          courses={courses}
          certifications={certifications}
          onSaveCourse={handleSaveCourse}
          onDuplicateCourse={handleDuplicateCourse}
          onArchiveCourse={handleArchiveCourse}
          onTogglePublish={handleTogglePublishCourse}
          onPreviewCourse={(c) => {
            setPreviewType('COURSE');
            setPreviewItem(c);
            setPreviewModalOpen(true);
          }}
          onOpenStructureBuilder={(cId) => {
            setSelectedCourseId(cId);
            setCurrentTab('structure');
          }}
        />
      )}

      {/* 3. Structure Builder Tab */}
      {currentTab === 'structure' && (
        <CourseStructureBuilder
          courses={courses}
          topics={topics}
          lessons={lessons}
          quizzes={quizzes}
          mockExams={mockExams}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onReorderLesson={handleReorderLesson}
          onAddLessonToTopic={handleAddLessonToTopic}
          onEditLesson={(l) => {
            setEditingLessonId(l.lesson_id);
            setCurrentTab('lessons');
          }}
          onDeleteLesson={handleDeleteLesson}
        />
      )}

      {/* 4. Lesson & Content Editor Tab */}
      {currentTab === 'lessons' && currentEditingLesson && (
        <LessonEditorView
          lesson={currentEditingLesson}
          lessonContent={currentEditingContent}
          lessonResources={currentEditingResources}
          courses={courses}
          topics={topics}
          onSaveLesson={handleSaveLesson}
          onPreview={() => {
            setPreviewType('LESSON');
            setPreviewItem(currentEditingLesson);
            setPreviewModalOpen(true);
          }}
        />
      )}

      {/* 5. Question Bank Tab */}
      {currentTab === 'questions' && (
        <QuestionBankView
          questions={questions}
          topics={topics}
          onSaveQuestion={handleSaveQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onDuplicateQuestion={handleDuplicateQuestion}
          onBulkImport={handleBulkImportQuestions}
        />
      )}

      {/* 6. Quizzes & Mock Exams Tab */}
      {currentTab === 'quizzes-exams' && (
        <QuizExamManagerView
          quizzes={quizzes}
          mockExams={mockExams}
          questions={questions}
          courses={courses}
          topics={topics}
          onSaveQuiz={handleSaveQuiz}
          onSaveMockExam={handleSaveMockExam}
          onDeleteQuiz={(qId) => onUpdateQuizzes(quizzes.filter(q => q.quiz_id !== qId))}
          onDeleteMockExam={(eId) => onUpdateMockExams(mockExams.filter(e => e.exam_id !== eId))}
          onPreviewQuiz={(q) => {
            setPreviewType('QUIZ');
            setPreviewItem(q);
            setPreviewModalOpen(true);
          }}
          onPreviewExam={(e) => {
            setPreviewType('EXAM');
            setPreviewItem(e);
            setPreviewModalOpen(true);
          }}
        />
      )}

      {/* 7. Certifications Tab */}
      {currentTab === 'certifications' && (
        <CertificationManagerView
          certifications={certifications}
          courses={courses}
          mockExams={mockExams}
          onSaveCertification={(c) => {
            const exists = certifications.some(item => item.certification_id === c.certification_id);
            onUpdateCertifications(exists ? certifications.map(item => item.certification_id === c.certification_id ? c : item) : [c, ...certifications]);
          }}
          onDeleteCertification={(cId) => onUpdateCertifications(certifications.filter(c => c.certification_id !== cId))}
        />
      )}

      {/* 8. Achievements Tab */}
      {currentTab === 'achievements' && (
        <AchievementManagerView
          achievements={achievements}
          onSaveAchievement={(a) => {
            const exists = achievements.some(item => item.achievement_id === a.achievement_id);
            onUpdateAchievements(exists ? achievements.map(item => item.achievement_id === a.achievement_id ? a : item) : [a, ...achievements]);
          }}
          onDeleteAchievement={(aId) => onUpdateAchievements(achievements.filter(a => a.achievement_id !== aId))}
        />
      )}

      {/* 9. Study Plan Templates Tab */}
      {currentTab === 'study-plans' && (
        <StudyPlanTemplateManagerView
          templates={templates}
          certifications={certifications}
          onSaveTemplate={(t) => {
            const exists = templates.some(item => item.template_id === t.template_id);
            setTemplates(exists ? templates.map(item => item.template_id === t.template_id ? t : item) : [t, ...templates]);
          }}
          onDeleteTemplate={(tId) => setTemplates(templates.filter(t => t.template_id !== tId))}
        />
      )}

      {/* 10. Platform Announcements Tab */}
      {currentTab === 'announcements' && (
        <AnnouncementsManagerView
          announcements={announcements}
          onSaveAnnouncement={(ann) => setAnnouncements([ann, ...announcements])}
          onDeleteAnnouncement={(annId) => setAnnouncements(announcements.filter(a => a.id !== annId))}
        />
      )}

      {/* 11. Learners Tab */}
      {currentTab === 'learners' && (
        <LearnerManagerView
          learners={learnersList}
          certificates={[]}
          currentUser={currentUser}
          onUpdateLearnerRole={(uid, newRole) => {
            const updated = learnersList.map(l => String(l.user_id) === String(uid) ? { ...l, role: newRole } : l);
            setLearnersList(updated);
            onUpdateLearners?.(updated);
            adminService.getAuditLogs().then(logs => setAuditLogs(logs));
          }}
        />
      )}

      {/* 12. Audit Logs Tab */}
      {currentTab === 'audit-logs' && (
        <AuditLogsView auditLogs={auditLogs} />
      )}

      {/* Preview Modal */}
      <AdminPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewType={previewType}
        course={previewType === 'COURSE' ? previewItem : undefined}
        lesson={previewType === 'LESSON' ? previewItem : undefined}
        lessonContent={previewType === 'LESSON' ? currentEditingContent : undefined}
        lessonResources={previewType === 'LESSON' ? currentEditingResources : undefined}
        quiz={previewType === 'QUIZ' ? previewItem : undefined}
        questions={previewType === 'QUIZ' ? questions.filter(q => q.topic_id === previewItem?.topic_id) : undefined}
        mockExam={previewType === 'EXAM' ? previewItem : undefined}
      />
    </AdminLayout>
  );
};
