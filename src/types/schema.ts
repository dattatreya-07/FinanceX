/**
 * FINANCEX - Schema Type Definitions
 * Exact mapping of all 34 LOCKED database tables
 */

// 1. USER
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  account_status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  knowledge_level_id: number;
  current_streak: number;
  longest_streak: number;
  social_links: string[]; // Multi-valued
  avatar_url?: string;
  xp_points?: number;
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
  user_id: number;
  achievement_id: number;
  earned_at: string; // ISO date
}

// 4. USER_SOCIAL_LINK
export interface UserSocialLink {
  social_link_id: number;
  user_id: number;
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
  user_id: number;
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
}

// 10. QUIZ
export interface Quiz {
  quiz_id: number;
  topic_id: number;
  title: string;
  passing_score_percent?: number;
  time_limit_mins?: number;
  total_questions?: number;
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
  user_id: number;
  type: 'STREAK_WARNING' | 'EXAM_REMINDER' | 'ACHIEVEMENT_UNLOCKED' | 'AI_SUGGESTION' | 'COMMUNITY_REPLY';
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
  priority?: 'NORMAL' | 'HIGH';
}

// 24. DEMO_ACCOUNT
export interface DemoAccount {
  demo_account_id: number;
  user_id: number; // Unique
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
  attempt_id: number;
  user_id: number;
  exam_id: number;
  score: number;
  passed: 'YES' | 'NO';
  completed_at: string;
  time_spent_mins?: number;
  accuracy_percent?: number;
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
  | 'figma-blueprint';
