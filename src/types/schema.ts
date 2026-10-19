/**
 * FINANCEX - Schema Type Definitions
 * Exact mapping of all 34 LOCKED database tables
 */

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'INSTRUCTOR' | 'REVIEWER' | 'ANALYST' | 'MODERATOR' | 'INSTITUTION_ADMIN';

export interface UploadedUserCertificate {
  id: string;
  certificate_name: string;
  issuing_organization: string; // e.g. NISM, NPTEL, SEBI, CFA, NSE Academy, Unstop
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
  file_name?: string;
  file_size_bytes?: number;
  verification_status: 'PENDING' | 'VERIFIED' | 'SELF_ATTESTED';
}

// 1. USER
export interface User {
  user_id: string | number;
  full_name: string;
  email: string;
  phone_number: string;
  account_status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  role?: UserRole;
  knowledge_level_id: number;
  current_streak: number;
  longest_streak: number;
  social_links: string[]; // Multi-valued
  avatar_url?: string;
  xp_points?: number;
  headline?: string;
  bio?: string;
  organization?: string;
  target_certifications?: string[];
  uploaded_certificates?: UploadedUserCertificate[];
}

// 2. ACHIEVEMENT
export interface Achievement {
  achievement_id: number;
  achievement_name: string;
  description: string;
  icon_name?: string;
  category?: 'STREAK' | 'LEARNING' | 'TRADING' | 'EXAM' | 'COMMUNITY';
  xp_reward?: number;
}

// 3. USER_ACHIEVEMENT
export interface UserAchievement {
  user_id: string | number;
  achievement_id: number;
  earned_at: string; // ISO date
}

// 4. USER_SOCIAL_LINK
export interface UserSocialLink {
  social_link_id: number;
  user_id: string | number;
  platform: 'TWITTER' | 'LINKEDIN' | 'GITHUB' | 'YOUTUBE' | 'WEBSITE';
  url: string;
}

// 5. KNOWLEDGE_LEVEL
export interface KnowledgeLevel {
  level_id: number;
  level_name: string; // e.g. "Novice Saver", "Market Explorer", "Derivative Analyst", "Chartered Sage"
  min_score: number;
  max_score: number;
  badge_color?: string;
}

// 6. GOAL
export interface Goal {
  goal_id: number;
  user_id: string | number;
  goal_title: string;
  target_date: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'PAUSED';
  current_progress_percent?: number;
  category?: 'CERTIFICATION' | 'STREAK' | 'SIMULATION' | 'LESSONS';
}

// 7. TOPIC
export interface Topic {
  topic_id: number;
  topic_name: string;
  difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  icon?: string;
  description?: string;
}

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

// 8. COURSE
export interface Course {
  course_id: number;
  course_title: string;
  price: number;
  certification_id: number | null; // Nullable
  rating?: number;
  total_lessons?: number;
  estimated_hours?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  image_url?: string;
  description?: string;
  author?: string;
  status?: ContentStatus;
  language?: 'en' | 'ta';
  topic_id?: number;
  learning_outcomes?: string[];
  prerequisites?: string[];
}

// 9. LESSON
export interface Lesson {
  lesson_id: number;
  course_id: number;
  topic_id: number;
  title: string;
  resource_links: string[]; // Multi-valued
  estimated_mins?: number;
  is_completed?: boolean;
  order_index?: number;
  description?: string;
  status?: ContentStatus;
  language?: 'en' | 'ta';
}

// 10. QUIZ
export interface Quiz {
  quiz_id: number;
  topic_id: number;
  title: string;
  passing_score_percent?: number;
  time_limit_mins?: number;
  total_questions?: number;
  course_id?: number;
  status?: ContentStatus;
}

// 11. MOCK_EXAM
export interface MockExam {
  exam_id: number;
  course_id: number;
  title: string;
  duration_minutes?: number;
  total_marks?: number;
  passing_percentage?: number;
  negative_marking?: number; // e.g. 0.25
  exam_code?: string;
  status?: ContentStatus;
  instructions?: string;
}

// 12. CERTIFICATION
export interface Certification {
  certification_id: number;
  certification_name: string;
  exam_id: number;
  governing_body?: 'NISM' | 'NCFM' | 'CFA INSTITUTE' | 'SEBI' | 'FINANCEX ACADEMY';
  validity_years?: number;
  prerequisites?: string;
  badge_icon?: string;
  summary?: string;
  status?: ContentStatus;
  is_official?: boolean;
}

// 13. CERTIFICATE
export interface Certificate {
  certificate_id: number;
  user_id: number;
  certification_id: number;
  certificate_number: string;
  issued_at?: string;
  verification_url?: string;
  recipient_name?: string;
  score_achieved?: number;
}

// 14. AI_CONVERSATION
export interface AIConversation {
  conversation_id: number;
  user_id: number;
  topic_id: number | null; // Nullable
  title?: string;
  created_at?: string;
}

// 15. AI_MESSAGE
export interface AIMessage {
  message_id: number;
  conversation_id: number;
  sender_type: 'USER' | 'AI';
  content?: string;
  created_at?: string;
  suggested_actions?: string[];
  formula?: string;
}

// 16. AI_RECOMMENDATION
export interface AIRecommendation {
  recommandation_id: number;
  user_id: number;
  topic_id: number;
  recommandation_type: 'REVIEW_WEAK_CONCEPT' | 'TAKE_MOCK_EXAM' | 'PRACTICE_SIMULATION' | 'NEXT_MODULE';
  reason?: string;
  action_label?: string;
  target_url?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

// 17. STUDY_PLAN
export interface StudyPlan {
  study_plan_id: number;
  user_id: number;
  certification_id: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  start_date?: string;
  target_exam_date?: string;
  daily_commitment_mins?: number;
  completion_rate_percent?: number;
}

// 18. STUDY_PLAN_ITEM
export interface StudyPlanItem {
  item_id: number;
  study_plan_id: number;
  lesson_id: number | null;
  quiz_id: number | null;
  exam_id: number | null;
  sequence_no: number;
  is_completed?: boolean;
  scheduled_day?: number;
  title?: string;
  item_type?: 'LESSON' | 'QUIZ' | 'MOCK_EXAM' | 'REVISION';
}

// 19. DISCUSSION_THREAD
export interface DiscussionThread {
  thread_id: number;
  user_id: number;
  topic_id: number;
  title: string;
  tags: string[]; // Multi-valued
  content?: string;
  created_at?: string;
  upvotes_count?: number;
  replies_count?: number;
  is_pinned?: boolean;
  is_solved?: boolean;
}

// 20. DISCUSSION_REPLY
export interface DiscussionReply {
  reply_id: number;
  thread_id: number;
  user_id: number;
  content?: string;
  created_at?: string;
  upvotes?: number;
  is_accepted_answer?: boolean;
}

// 21. TAG
export interface Tag {
  tag_id: number;
  tag_name: string;
}

// 22. DISCUSSION_THREAD_TAG
export interface DiscussionThreadTag {
  thread_id: number;
  tag_id: number;
}

// 23. NOTIFICATION
export interface Notification {
  notification_id: number;
  user_id: string | number;
  type: 'STREAK_WARNING' | 'EXAM_REMINDER' | 'ACHIEVEMENT_UNLOCKED' | 'AI_SUGGESTION' | 'COMMUNITY_REPLY' | 'ALERT';
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
  priority?: 'NORMAL' | 'HIGH';
}

// 24. DEMO_ACCOUNT
export interface DemoAccount {
  demo_account_id: number;
  user_id: string | number; // Unique
  virtual_balance: number;
  currency: 'INR' | 'USD';
  initial_capital?: number;
}

// 25. INSTRUMENT
export interface Instrument {
  instrument_id: number;
  symbol: string;
  instrument_type: 'EQUITY' | 'BOND' | 'MUTUAL_FUND';
  topic_id: number | null; // Nullable
  simulated_price: number;
  name?: string;
  daily_change_percent?: number;
  beta?: number;
  pe_ratio?: number;
  yield_percent?: number;
  historical_prices?: number[];
  category_tag?: string;
}

// 26. DEMO_HOLDING
export interface DemoHolding {
  holding_id: number;
  demo_account_id: number;
  instrument_id: number;
  quantity: number;
  avg_buy_price: number;
}

// 27. DEMO_TRANSACTION
export interface DemoTransaction {
  demo_transaction_id: number;
  demo_account_id: number;
  instrument_id: number;
  transaction_type: 'BUY' | 'SELL';
  quantity: number;
  price_per_unit: number;
  timestamp?: string;
}

// 28. QUIZ_ATTEMPT
export interface QuizAttempt {
  attempt_id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  completed_at: string;
  total_questions?: number;
  correct_answers?: number;
}

// 29. MOCK_EXAM_ATTEMPT
export interface MockExamAttempt {
  attempt_id: number | string;
  user_id: number | string;
  exam_id: number | string;
  score: number;
  passed: 'YES' | 'NO';
  completed_at: string;
  time_spent_mins?: number;
  accuracy_percent?: number;
  violation_count?: number;
  topic_breakdown?: Record<string, { topic: string; total: number; correct: number; percentage: number }>;
  time_taken_seconds?: number;
}

// 29B. COURSE_RATING
export interface CourseRating {
  id: string;
  course_id: number | string;
  user_id: string;
  rating: number; // 1 to 5
  review?: string;
  created_at: string;
  user_name?: string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  is_correct?: boolean;
}

// 30. QUESTION
export interface Question {
  question_id: number;
  topic_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation: string;
}

// 31. QUIZ_QUESTION
export interface QuizQuestion {
  quiz_id: number;
  question_id: number;
  question_order: number;
  mark: number;
}

// 32. MOCK_EXAM_QUESTION
export interface MockExamQuestion {
  quiz_id: number; // Represents exam_id / quiz_id
  question_id: number;
  question_order: number;
  mark: number;
}

// 33. LESSON_CONTENT
export interface LessonContent {
  content_id: number;
  lesson_id: number;
  content_type: 'MARKDOWN_TEXT' | 'VIDEO' | 'INTERACTIVE_CALCULATOR' | 'FLOWCHART';
  content_url: string;
  raw_body?: string;
  key_takeaways?: string[];
  formulas?: { label: string; formula: string; explanation: string }[];
}

// 34. LESSON_RESOURCE
export interface LessonResource {
  resource_id: number;
  lesson_id: number;
  resource_title: string;
  resource_url: string;
  resource_type?: 'PDF_CHEAT_SHEET' | 'EXCEL_MODEL' | 'SEBI_CIRCULAR' | 'EXTERNAL_ARTICLE';
  display_order?: number;
}

// 35. CONTENT_AUDIT_LOG
export interface ContentAuditLog {
  id: string;
  admin_id: string | number;
  admin_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'UPLOAD' | 'DUPLICATE' | 'IMPORT' | 'EXPORT' | 'APPROVE' | 'REJECT';
  entity_type: 'COURSE' | 'TOPIC' | 'LESSON' | 'LESSON_CONTENT' | 'RESOURCE' | 'QUESTION' | 'QUIZ' | 'MOCK_EXAM' | 'CERTIFICATION' | 'ACHIEVEMENT' | 'STUDY_PLAN_TEMPLATE' | 'ANNOUNCEMENT' | 'USER' | 'REPORT' | 'INSTITUTION';
  entity_id: string | number;
  entity_title?: string;
  details?: Record<string, any>;
  created_at: string;
}

// 36. ANNOUNCEMENT
export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: 'ALL_USERS' | 'COURSE_LEARNERS' | 'CERTIFICATION_LEARNERS' | 'ADMINS';
  target_id?: string | number;
  status: 'DRAFT' | 'PUBLISHED' | 'EXPIRED';
  created_at: string;
  expires_at?: string;
}

// 37. STUDY_PLAN_TEMPLATE
export interface StudyPlanTemplate {
  template_id: string;
  title: string;
  description: string;
  target_certification_id?: number;
  duration_weeks: number;
  recommended_hours_per_week: number;
  weekly_schedule: {
    week: number;
    title: string;
    focus_topic_ids: number[];
    lesson_ids: number[];
    quiz_ids: number[];
    mock_exam_ids: number[];
  }[];
  status: ContentStatus;
}

// Admin Dashboard KPI Metrics
export interface AdminDashboardMetrics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLessons: number;
  totalResources: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalMockExams: number;
  totalCertifications: number;
  totalLearners: number;
  recentAuditLogs: ContentAuditLog[];
  incompleteContent: {
    id: string | number;
    title: string;
    type: 'COURSE' | 'LESSON' | 'QUIZ' | 'EXAM';
    missing: string;
  }[];
}

// Global Frontend Navigation Views
export type AppNavView = 
  | 'landing'
  | 'dashboard'
  | 'learn'
  | 'courses'
  | 'certifications'
  | 'study-plans'
  | 'quizzes'
  | 'mock-exams'
  | 'practice-lab'
  | 'ai-tutor'
  | 'community'
  | 'goals'
  | 'achievements'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'money-evolution'
  | 'calculators'
  | 'arena'
  | 'figma-blueprint'
  | 'admin';

// Phase 27: Production Intelligence & Adaptive Learning Loop
export type MasteryLevel = 'NOT_STARTED' | 'LEARNING' | 'NEEDS_PRACTICE' | 'PROFICIENT' | 'MASTERED';

export interface ConceptMastery {
  topic_id: number;
  topic_name: string;
  category?: string;
  lessons_completed: number;
  lessons_total: number;
  lesson_completion_pct: number;
  quizzes_attempted: number;
  quiz_questions_attempted: number;
  quiz_questions_correct: number;
  quiz_accuracy_pct: number;
  mock_questions_attempted: number;
  mock_questions_correct: number;
  mock_accuracy_pct: number;
  mastery_score: number; // 0 - 100
  mastery_level: MasteryLevel;
  last_studied_at?: string;
  is_weakness: boolean;
  recommended_action?: string;
}

export type ReadinessBand = 'EMERGING' | 'PROGRESSING' | 'WELL_PREPARED' | 'HIGHLY_CONFIDENT';

export interface CertificationReadiness {
  certification_id: number;
  certification_name: string;
  overall_readiness_pct: number; // 0 - 100
  readiness_band: ReadinessBand;
  syllabus_coverage_pct: number;
  mastery_score_pct: number;
  mock_exam_average_pct: number;
  mock_exams_taken: number;
  weak_topic_names: string[];
  strong_topic_names: string[];
  recommended_focus: string;
  disclaimer: string;
}

export interface LearningWeaknessRemediation {
  topic_id: number;
  topic_name: string;
  mistake_summary: string;
  ai_coaching_prompt: string;
  recommended_lesson_id?: number;
  recommended_quiz_id?: number;
}

// Phase 28: Adaptive Practice, Spaced Learning & Continuous Mastery
export type SpacedReviewUrgency = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'MASTERED_MAINTENANCE';

export interface SpacedReviewSchedule {
  topic_id: number;
  topic_name: string;
  review_stage: number; // 1 to 5 (1d, 3d, 7d, 14d, 30d)
  interval_days: number;
  last_reviewed_at: string;
  next_review_due_at: string;
  is_due: boolean;
  days_overdue: number;
  consecutive_successes: number;
  urgency: SpacedReviewUrgency;
  recommended_questions_count: number;
}

export type AdaptivePracticeMode = 'REMEDIATION' | 'REINFORCEMENT' | 'CHALLENGE_MASTERY' | 'SPACED_RECALL';

export interface AdaptiveQuestion extends Question {
  target_skill_type?: 'FORMULA_CALCULATION' | 'CONCEPTUAL_REASONING' | 'REGULATORY_COMPLIANCE' | 'SCENARIO_ANALYSIS';
  recommended_mode?: AdaptivePracticeMode;
}

export interface AdaptivePracticeSession {
  session_id: string;
  topic_id: number;
  topic_name: string;
  mode: AdaptivePracticeMode;
  questions: Question[];
  target_mastery_before: number;
  started_at: string;
  rationale: string;
}

export interface ConceptMasteryObservation {
  observation_id: string;
  user_id: string | number;
  topic_id: number;
  topic_name: string;
  timestamp: string;
  trigger_event: 'QUIZ_ATTEMPT' | 'MOCK_EXAM' | 'PRACTICE_LAB_EXERCISE' | 'SPACED_REVIEW' | 'AI_COACHING_REVISION';
  previous_score: number;
  new_score: number;
  score_delta: number;
  evidence_summary: string;
}

export type ScenarioRequiredAction = 
  | 'DELTA_HEDGE' 
  | 'STRADDLE_VOLATILITY' 
  | 'CASH_CARRY_ARBITRAGE' 
  | 'DURATION_IMMUNIZATION' 
  | 'PORTFOLIO_DIVERSIFICATION';

export interface PracticeLabEducationalScenario {
  scenario_id: string;
  title: string;
  topic_id: number;
  topic_name: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  objective: string;
  required_action: ScenarioRequiredAction;
  instruction: string;
  target_instrument_symbols: string[];
  xp_reward: number;
  mastery_contribution_pct: number;
  is_completed?: boolean;
  completed_at?: string;
}

// =========================================================================
// PHASE 29: EVIDENCE-DRIVEN ASSESSMENT INTELLIGENCE & COHORT ANALYTICS
// =========================================================================

export type QuestionQualityStatus = 
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR'
  | 'POOR_DISCRIMINATION'
  | 'TOO_EASY'
  | 'TOO_HARD'
  | 'NEEDS_REVISION';

export interface DistractorDistribution {
  A: number; // Percentage choosing Option A
  B: number;
  C: number;
  D: number;
}

export interface ItemAnalysisMetrics {
  question_id: number;
  question_text: string;
  topic_id: number;
  topic_name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  total_attempts: number;
  correct_attempts: number;
  difficulty_index_p: number; // p-value = Correct / Total (0.00 - 1.00)
  discrimination_index_d: number; // D = p(upper 27%) - p(lower 27%) (-1.00 to +1.00)
  point_biserial_r: number; // r_pbi correlation with total score (-1.00 to +1.00)
  distractor_distribution: DistractorDistribution;
  quality_status: QuestionQualityStatus;
  recommendation: string;
  is_flagged_for_review: boolean;
}

export type CohortDimension = 
  | 'CERTIFICATION_STREAM'
  | 'INSTITUTIONAL_BATCH'
  | 'MASTERY_BAND'
  | 'OVERALL_POPULATION';

export interface CohortPercentileDistribution {
  p25: number;
  p50: number; // Median
  p75: number;
  p90: number;
  mean: number;
  std_dev: number;
}

export interface CohortBenchmark {
  cohort_id: string;
  cohort_name: string;
  dimension: CohortDimension;
  certification_id?: number;
  certification_name?: string;
  total_learners_n: number;
  is_privacy_suppressed: boolean; // True if N < 5 to prevent de-anonymization
  average_accuracy_pct: number;
  pass_rate_pct: number;
  average_readiness_score: number;
  percentiles: CohortPercentileDistribution;
  top_weak_topic_ids: number[];
  top_weak_topic_names: string[];
}

export interface CohortAnalyticsFilter {
  dimension?: CohortDimension;
  certificationId?: number;
  minMastery?: number;
  searchQuery?: string;
}

export interface IntegrityAnomalyEvent {
  event_id: string;
  timestamp: string;
  event_type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'VELOCITY_ANOMALY' | 'KEYBOARD_RESTRICTION';
  details: string;
  question_id?: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ExamIntegritySession {
  session_id: string;
  exam_id: number;
  user_id: string | number;
  started_at: string;
  completed_at?: string;
  tab_switch_count: number;
  fullscreen_exit_count: number;
  velocity_anomalies_count: number;
  integrity_score_pct: number; // 0 - 100% (100 = flawless compliance)
  is_invalidated: boolean;
  events: IntegrityAnomalyEvent[];
  disclaimer: string;
}

export type InterventionType = 
  | 'AI_TUTOR_COACHING'
  | 'ADAPTIVE_PRACTICE'
  | 'SPACED_REVIEW'
  | 'PRACTICE_LAB_SCENARIO';

export interface InterventionEfficacyRecord {
  record_id: string;
  user_id: string | number;
  topic_id: number;
  topic_name: string;
  intervention_type: InterventionType;
  pre_score: number;
  post_score: number;
  efficacy_delta: number; // post - pre
  timestamp: string;
  is_effective: boolean; // delta >= 10
}

export interface PopulationTopicDifficulty {
  topic_id: number;
  topic_name: string;
  total_assessments_taken: number;
  average_accuracy_pct: number;
  error_rate_pct: number; // 100 - average_accuracy
  learners_needing_remediation_count: number;
  difficulty_rank: number; // 1 = hardest topic across population
}

// --------------------------------------------------------------------------
// PHASE 30: ENTERPRISE GOVERNANCE, INSTITUTIONAL OPERATIONS & COMPLIANCE INTELLIGENCE
// --------------------------------------------------------------------------

export interface Institution {
  institution_id: string;
  name: string;
  domain: string;
  license_tier: 'TRIAL' | 'ACADEMIC' | 'ENTERPRISE' | 'GOVERNMENT';
  seats_allocated: number;
  seats_used: number;
  created_at: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
}

export interface InstitutionalCohortMember {
  cohort_id: string;
  institution_id: string;
  user_id: string | number;
  user_name: string;
  email: string;
  role: 'LEARNER' | 'INSTRUCTOR' | 'INSTITUTION_ADMIN';
  enrolled_at: string;
  completion_pct: number;
  readiness_score: number;
}

export type ComplianceReportType = 
  | 'LEARNER_READINESS_AUDIT'
  | 'COHORT_COMPLIANCE_SUMMARY'
  | 'ITEM_PSYCHOMETRIC_AUDIT'
  | 'INSTITUTIONAL_DOSSIER';

export interface ComplianceExportDefinition {
  export_id: string;
  report_type: ComplianceReportType;
  institution_id: string;
  institution_name: string;
  requested_by_user_id: string | number;
  requested_by_role: UserRole;
  generated_at: string;
  content_version_ref: string;
  record_count: number;
  checksum_sha256?: string;
  csv_content?: string;
}

export interface AIItemRevisionProposal {
  proposal_id: string;
  question_id: number;
  question_text_original: string;
  question_text_proposed: string;
  options_original: QuestionOption[];
  options_proposed: QuestionOption[];
  explanation_original?: string;
  explanation_proposed?: string;
  discrimination_index: number;
  difficulty_index: number;
  reason: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  created_at: string;
  reviewed_by_user_id?: string | number;
  reviewed_at?: string;
}

export interface ComplianceDossierEntry {
  learner_id: string | number;
  learner_name: string;
  email: string;
  institution_id: string;
  institution_name: string;
  cohort_id: string;
  target_certification: string;
  readiness_score_pct: number;
  mastery_level: string;
  exam_integrity_index_pct: number;
  completed_modules_count: number;
  total_modules_count: number;
  status: 'AUDIT_READY' | 'IN_TRAINING' | 'AT_RISK';
  last_activity_date: string;
}
