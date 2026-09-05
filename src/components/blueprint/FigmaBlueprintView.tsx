import React, { useState } from 'react';
import { 
  Code2, 
  Key, 
  Link2, 
  Search, 
  Copy, 
  ChevronRight
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface SchemaTableDefinition {
  id: number;
  name: string;
  category: 'USERS & AUTH' | 'CURRICULUM & CONTENT' | 'EVALUATION & EXAMS' | 'AI & ADAPTIVE' | 'COMMUNITY' | 'SIMULATION & TRADING';
  pk: string;
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean; ref?: string; nullable?: boolean; multiValued?: boolean }[];
  description: string;
}

const LOCKED_34_TABLES: SchemaTableDefinition[] = [
  // USERS & AUTH
  {
    id: 1,
    name: 'USER',
    category: 'USERS & AUTH',
    pk: 'user_id',
    columns: [
      { name: 'user_id', type: 'INT', isPk: true },
      { name: 'full_name', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR(150)' },
      { name: 'phone_number', type: 'VARCHAR(20)' },
      { name: 'account_status', type: 'ENUM(ACTIVE, PENDING, SUSPENDED)' },
      { name: 'knowledge_level_id', type: 'INT', isFk: true, ref: 'KNOWLEDGE_LEVEL(level_id)' },
      { name: 'current_streak', type: 'INT' },
      { name: 'longest_streak', type: 'INT' },
      { name: 'social_links', type: 'TEXT[]', multiValued: true }
    ],
    description: 'Central user identity, multi-valued social links, active & longest streak counters.'
  },
  {
    id: 2,
    name: 'ACHIEVEMENT',
    category: 'USERS & AUTH',
    pk: 'achievement_id',
    columns: [
      { name: 'achievement_id', type: 'INT', isPk: true },
      { name: 'achievement_name', type: 'VARCHAR(100)' },
      { name: 'description', type: 'TEXT' }
    ],
    description: 'Master list of unlockable platform badges and milestones.'
  },
  {
    id: 3,
    name: 'USER_ACHIEVEMENT',
    category: 'USERS & AUTH',
    pk: 'user_id, achievement_id',
    columns: [
      { name: 'user_id', type: 'INT', isPk: true, isFk: true, ref: 'USER(user_id)' },
      { name: 'achievement_id', type: 'INT', isPk: true, isFk: true, ref: 'ACHIEVEMENT(achievement_id)' },
      { name: 'earned_at', type: 'TIMESTAMP' }
    ],
    description: 'M:N junction recording when users unlock badges.'
  },
  {
    id: 4,
    name: 'USER_SOCIAL_LINK',
    category: 'USERS & AUTH',
    pk: 'social_link_id',
    columns: [
      { name: 'social_link_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'platform', type: 'ENUM(TWITTER, LINKEDIN, GITHUB, YOUTUBE, WEBSITE)' },
      { name: 'url', type: 'VARCHAR(255)' }
    ],
    description: 'Relational representation for multi-valued user social profiles.'
  },
  {
    id: 5,
    name: 'KNOWLEDGE_LEVEL',
    category: 'USERS & AUTH',
    pk: 'level_id',
    columns: [
      { name: 'level_id', type: 'INT', isPk: true },
      { name: 'level_name', type: 'VARCHAR(50)' },
      { name: 'min_score', type: 'INT' },
      { name: 'max_score', type: 'INT' }
    ],
    description: 'Skill tiers from Novice Saver up to Chartered Master.'
  },
  {
    id: 6,
    name: 'GOAL',
    category: 'USERS & AUTH',
    pk: 'goal_id',
    columns: [
      { name: 'goal_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'goal_title', type: 'VARCHAR(150)' },
      { name: 'target_date', type: 'DATE' },
      { name: 'status', type: 'ENUM(IN_PROGRESS, COMPLETED, OVERDUE, PAUSED)' }
    ],
    description: 'Learner target milestones with progress tracking.'
  },

  // CURRICULUM & CONTENT
  {
    id: 7,
    name: 'TOPIC',
    category: 'CURRICULUM & CONTENT',
    pk: 'topic_id',
    columns: [
      { name: 'topic_id', type: 'INT', isPk: true },
      { name: 'topic_name', type: 'VARCHAR(100)' },
      { name: 'difficulty_level', type: 'ENUM(BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)' }
    ],
    description: 'Financial subjects (Options Greeks, Fixed Income, SEBI Regulations, etc.).'
  },
  {
    id: 8,
    name: 'COURSE',
    category: 'CURRICULUM & CONTENT',
    pk: 'course_id',
    columns: [
      { name: 'course_id', type: 'INT', isPk: true },
      { name: 'course_title', type: 'VARCHAR(150)' },
      { name: 'price', type: 'DECIMAL(10,2)' },
      { name: 'certification_id', type: 'INT', isFk: true, nullable: true, ref: 'CERTIFICATION(certification_id)' }
    ],
    description: 'Structured curriculums linked optionally to official regulatory exams.'
  },
  {
    id: 9,
    name: 'LESSON',
    category: 'CURRICULUM & CONTENT',
    pk: 'lesson_id',
    columns: [
      { name: 'lesson_id', type: 'INT', isPk: true },
      { name: 'course_id', type: 'INT', isFk: true, ref: 'COURSE(course_id)' },
      { name: 'topic_id', type: 'INT', isFk: true, ref: 'TOPIC(topic_id)' },
      { name: 'title', type: 'VARCHAR(150)' },
      { name: 'resource_links', type: 'TEXT[]', multiValued: true }
    ],
    description: 'Individual interactive lessons within a course.'
  },
  {
    id: 33,
    name: 'LESSON_CONTENT',
    category: 'CURRICULUM & CONTENT',
    pk: 'content_id',
    columns: [
      { name: 'content_id', type: 'INT', isPk: true },
      { name: 'lesson_id', type: 'INT', isFk: true, ref: 'LESSON(lesson_id)' },
      { name: 'content_type', type: 'ENUM(MARKDOWN_TEXT, VIDEO, INTERACTIVE_CALCULATOR, FLOWCHART)' },
      { name: 'content_url', type: 'VARCHAR(255)' }
    ],
    description: 'Multi-format multimedia payload container.'
  },
  {
    id: 34,
    name: 'LESSON_RESOURCE',
    category: 'CURRICULUM & CONTENT',
    pk: 'resource_id',
    columns: [
      { name: 'resource_id', type: 'INT', isPk: true },
      { name: 'lesson_id', type: 'INT', isFk: true, ref: 'LESSON(lesson_id)' },
      { name: 'resource_title', type: 'VARCHAR(150)' },
      { name: 'resource_url', type: 'VARCHAR(255)' }
    ],
    description: 'Downloadable financial models, PDF cheat sheets, and SEBI circulars.'
  },

  // EVALUATION & EXAMS
  {
    id: 10,
    name: 'QUIZ',
    category: 'EVALUATION & EXAMS',
    pk: 'quiz_id',
    columns: [
      { name: 'quiz_id', type: 'INT', isPk: true },
      { name: 'topic_id', type: 'INT', isFk: true, ref: 'TOPIC(topic_id)' },
      { name: 'title', type: 'VARCHAR(150)' }
    ],
    description: 'Checkpoint quizzes validating topic competence.'
  },
  {
    id: 11,
    name: 'MOCK_EXAM',
    category: 'EVALUATION & EXAMS',
    pk: 'exam_id',
    columns: [
      { name: 'exam_id', type: 'INT', isPk: true },
      { name: 'course_id', type: 'INT', isFk: true, ref: 'COURSE(course_id)' },
      { name: 'title', type: 'VARCHAR(150)' }
    ],
    description: 'Full-length simulated test-center exam engine.'
  },
  {
    id: 12,
    name: 'CERTIFICATION',
    category: 'EVALUATION & EXAMS',
    pk: 'certification_id',
    columns: [
      { name: 'certification_id', type: 'INT', isPk: true },
      { name: 'certification_name', type: 'VARCHAR(150)' },
      { name: 'exam_id', type: 'INT', isFk: true, ref: 'MOCK_EXAM(exam_id)' }
    ],
    description: 'Official credential specifications (NISM VIII, NISM XV, NCFM).'
  },
  {
    id: 13,
    name: 'CERTIFICATE',
    category: 'EVALUATION & EXAMS',
    pk: 'certificate_id',
    columns: [
      { name: 'certificate_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'certification_id', type: 'INT', isFk: true, ref: 'CERTIFICATION(certification_id)' },
      { name: 'certificate_number', type: 'VARCHAR(100)' }
    ],
    description: 'Issued verifiable credentials with cryptographic identifiers.'
  },
  {
    id: 28,
    name: 'QUIZ_ATTEMPT',
    category: 'EVALUATION & EXAMS',
    pk: 'attempt_id',
    columns: [
      { name: 'attempt_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'quiz_id', type: 'INT', isFk: true, ref: 'QUIZ(quiz_id)' },
      { name: 'score', type: 'DECIMAL(5,2)' },
      { name: 'completed_at', type: 'TIMESTAMP' }
    ],
    description: 'Historic quiz score records.'
  },
  {
    id: 29,
    name: 'MOCK_EXAM_ATTEMPT',
    category: 'EVALUATION & EXAMS',
    pk: 'attempt_id',
    columns: [
      { name: 'attempt_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'exam_id', type: 'INT', isFk: true, ref: 'MOCK_EXAM(exam_id)' },
      { name: 'score', type: 'DECIMAL(5,2)' },
      { name: 'passed', type: 'ENUM(YES, NO)' },
      { name: 'completed_at', type: 'TIMESTAMP' }
    ],
    description: 'Historic mock examination performance tracking.'
  },
  {
    id: 30,
    name: 'QUESTION',
    category: 'EVALUATION & EXAMS',
    pk: 'question_id',
    columns: [
      { name: 'question_id', type: 'INT', isPk: true },
      { name: 'topic_id', type: 'INT', isFk: true, ref: 'TOPIC(topic_id)' },
      { name: 'question_text', type: 'TEXT' },
      { name: 'option_a', type: 'VARCHAR(255)' },
      { name: 'option_b', type: 'VARCHAR(255)' },
      { name: 'option_c', type: 'VARCHAR(255)' },
      { name: 'option_d', type: 'VARCHAR(255)' },
      { name: 'correct_option', type: 'CHAR(1)' },
      { name: 'difficulty', type: 'ENUM(EASY, MEDIUM, HARD)' },
      { name: 'explanation', type: 'TEXT' }
    ],
    description: 'Centralized financial question item bank with mathematical explanations.'
  },
  {
    id: 31,
    name: 'QUIZ_QUESTION',
    category: 'EVALUATION & EXAMS',
    pk: 'quiz_id, question_id',
    columns: [
      { name: 'quiz_id', type: 'INT', isPk: true, isFk: true, ref: 'QUIZ(quiz_id)' },
      { name: 'question_id', type: 'INT', isPk: true, isFk: true, ref: 'QUESTION(question_id)' },
      { name: 'question_order', type: 'INT' },
      { name: 'mark', type: 'INT' }
    ],
    description: 'M:N mapping between quizzes and question bank.'
  },
  {
    id: 32,
    name: 'MOCK_EXAM_QUESTION',
    category: 'EVALUATION & EXAMS',
    pk: 'quiz_id, question_id',
    columns: [
      { name: 'quiz_id', type: 'INT', isPk: true, isFk: true, ref: 'MOCK_EXAM(exam_id)' },
      { name: 'question_id', type: 'INT', isPk: true, isFk: true, ref: 'QUESTION(question_id)' },
      { name: 'question_order', type: 'INT' },
      { name: 'mark', type: 'INT' }
    ],
    description: 'M:N mapping between full mock exams and questions.'
  },

  // AI & ADAPTIVE
  {
    id: 14,
    name: 'AI_CONVERSATION',
    category: 'AI & ADAPTIVE',
    pk: 'conversation_id',
    columns: [
      { name: 'conversation_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'topic_id', type: 'INT', isFk: true, nullable: true, ref: 'TOPIC(topic_id)' }
    ],
    description: 'Chat session container for AI Financial Tutoring.'
  },
  {
    id: 15,
    name: 'AI_MESSAGE',
    category: 'AI & ADAPTIVE',
    pk: 'message_id',
    columns: [
      { name: 'message_id', type: 'INT', isPk: true },
      { name: 'conversation_id', type: 'INT', isFk: true, ref: 'AI_CONVERSATION(conversation_id)' },
      { name: 'sender_type', type: 'ENUM(USER, AI)' },
      { name: 'content', type: 'TEXT' }
    ],
    description: 'Individual prompt and response exchanges.'
  },
  {
    id: 16,
    name: 'AI_RECOMMENDATION',
    category: 'AI & ADAPTIVE',
    pk: 'recommandation_id',
    columns: [
      { name: 'recommandation_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'topic_id', type: 'INT', isFk: true, ref: 'TOPIC(topic_id)' },
      { name: 'recommandation_type', type: 'ENUM(REVIEW_WEAK_CONCEPT, TAKE_MOCK_EXAM, PRACTICE_SIMULATION, NEXT_MODULE)' }
    ],
    description: 'Algorithmic study prompts generated from user test errors.'
  },
  {
    id: 17,
    name: 'STUDY_PLAN',
    category: 'AI & ADAPTIVE',
    pk: 'study_plan_id',
    columns: [
      { name: 'study_plan_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'certification_id', type: 'INT', isFk: true, ref: 'CERTIFICATION(certification_id)' },
      { name: 'status', type: 'ENUM(ACTIVE, COMPLETED, ABANDONED)' }
    ],
    description: 'High-level certification preparation roadmaps.'
  },
  {
    id: 18,
    name: 'STUDY_PLAN_ITEM',
    category: 'AI & ADAPTIVE',
    pk: 'item_id',
    columns: [
      { name: 'item_id', type: 'INT', isPk: true },
      { name: 'study_plan_id', type: 'INT', isFk: true, ref: 'STUDY_PLAN(study_plan_id)' },
      { name: 'lesson_id', type: 'INT', isFk: true, nullable: true, ref: 'LESSON(lesson_id)' },
      { name: 'quiz_id', type: 'INT', isFk: true, nullable: true, ref: 'QUIZ(quiz_id)' },
      { name: 'exam_id', type: 'INT', isFk: true, nullable: true, ref: 'MOCK_EXAM(exam_id)' },
      { name: 'sequence_no', type: 'INT' }
    ],
    description: 'Individual sequenced study milestones.'
  },
  {
    id: 23,
    name: 'NOTIFICATION',
    category: 'AI & ADAPTIVE',
    pk: 'notification_id',
    columns: [
      { name: 'notification_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'type', type: 'ENUM(STREAK_WARNING, EXAM_REMINDER, ACHIEVEMENT_UNLOCKED, AI_SUGGESTION, COMMUNITY_REPLY)' }
    ],
    description: 'System-wide push and in-app alerts.'
  },

  // COMMUNITY
  {
    id: 19,
    name: 'DISCUSSION_THREAD',
    category: 'COMMUNITY',
    pk: 'thread_id',
    columns: [
      { name: 'thread_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'topic_id', type: 'INT', isFk: true, ref: 'TOPIC(topic_id)' },
      { name: 'title', type: 'VARCHAR(200)' },
      { name: 'tags', type: 'TEXT[]', multiValued: true }
    ],
    description: 'User discussion posts and exam doubts.'
  },
  {
    id: 20,
    name: 'DISCUSSION_REPLY',
    category: 'COMMUNITY',
    pk: 'reply_id',
    columns: [
      { name: 'reply_id', type: 'INT', isPk: true },
      { name: 'thread_id', type: 'INT', isFk: true, ref: 'DISCUSSION_THREAD(thread_id)' },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' }
    ],
    description: 'Answers and peer feedback.'
  },
  {
    id: 21,
    name: 'TAG',
    category: 'COMMUNITY',
    pk: 'tag_id',
    columns: [
      { name: 'tag_id', type: 'INT', isPk: true },
      { name: 'tag_name', type: 'VARCHAR(50)' }
    ],
    description: 'Taxonomy keywords for forum search.'
  },
  {
    id: 22,
    name: 'DISCUSSION_THREAD_TAG',
    category: 'COMMUNITY',
    pk: 'thread_id, tag_id',
    columns: [
      { name: 'thread_id', type: 'INT', isPk: true, isFk: true, ref: 'DISCUSSION_THREAD(thread_id)' },
      { name: 'tag_id', type: 'INT', isPk: true, isFk: true, ref: 'TAG(tag_id)' }
    ],
    description: 'M:N relationship connecting threads with tags.'
  },

  // SIMULATION & TRADING
  {
    id: 24,
    name: 'DEMO_ACCOUNT',
    category: 'SIMULATION & TRADING',
    pk: 'demo_account_id',
    columns: [
      { name: 'demo_account_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true, ref: 'USER(user_id)' },
      { name: 'virtual_balance', type: 'DECIMAL(15,2)' },
      { name: 'currency', type: 'ENUM(INR, USD)' }
    ],
    description: 'User paper trading account (1:1 with USER).'
  },
  {
    id: 25,
    name: 'INSTRUMENT',
    category: 'SIMULATION & TRADING',
    pk: 'instrument_id',
    columns: [
      { name: 'instrument_id', type: 'INT', isPk: true },
      { name: 'symbol', type: 'VARCHAR(20)' },
      { name: 'instrument_type', type: 'ENUM(EQUITY, BOND, MUTUAL_FUND)' },
      { name: 'topic_id', type: 'INT', isFk: true, nullable: true, ref: 'TOPIC(topic_id)' },
      { name: 'simulated_price', type: 'DECIMAL(12,2)' }
    ],
    description: 'Tradable simulated assets (Reliance, Sovereign Bonds, Mutual Funds).'
  },
  {
    id: 26,
    name: 'DEMO_HOLDING',
    category: 'SIMULATION & TRADING',
    pk: 'holding_id',
    columns: [
      { name: 'holding_id', type: 'INT', isPk: true },
      { name: 'demo_account_id', type: 'INT', isFk: true, ref: 'DEMO_ACCOUNT(demo_account_id)' },
      { name: 'instrument_id', type: 'INT', isFk: true, ref: 'INSTRUMENT(instrument_id)' },
      { name: 'quantity', type: 'INT' },
      { name: 'avg_buy_price', type: 'DECIMAL(12,2)' }
    ],
    description: 'Active open positions in the paper trading portfolio.'
  },
  {
    id: 27,
    name: 'DEMO_TRANSACTION',
    category: 'SIMULATION & TRADING',
    pk: 'demo_transaction_id',
    columns: [
      { name: 'demo_transaction_id', type: 'INT', isPk: true },
      { name: 'demo_account_id', type: 'INT', isFk: true, ref: 'DEMO_ACCOUNT(demo_account_id)' },
      { name: 'instrument_id', type: 'INT', isFk: true, ref: 'INSTRUMENT(instrument_id)' },
      { name: 'transaction_type', type: 'ENUM(BUY, SELL)' },
      { name: 'quantity', type: 'INT' },
      { name: 'price_per_unit', type: 'DECIMAL(12,2)' }
    ],
    description: 'Simulated order execution ledger.'
  }
];

interface FigmaBlueprintViewProps {
  onNavigate: (view: AppNavView) => void;
}

export const FigmaBlueprintView: React.FC<FigmaBlueprintViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<SchemaTableDefinition>(LOCKED_34_TABLES[0]);

  const filteredTables = LOCKED_34_TABLES.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6" id="figma-blueprint-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              34-Table Architectural Schema Blueprint
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
              34/34 TABLES LOCKED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Complete database normalization mapping all 34 tables with strict primary keys, foreign keys, and multi-valued attributes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-xs"
        >
          Return to Dashboard
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0B0F19] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search schema tables, foreign keys, or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {['ALL', 'USERS & AUTH', 'CURRICULUM & CONTENT', 'EVALUATION & EXAMS', 'AI & ADAPTIVE', 'COMMUNITY', 'SIMULATION & TRADING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Left Table Directory & Right Table Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table Directory */}
        <div className="lg:col-span-5 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredTables.map((tbl) => {
            const isSelected = selectedTable.id === tbl.id;
            return (
              <div
                key={tbl.id}
                onClick={() => setSelectedTable(tbl)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between shadow-xs theme-transition ${
                  isSelected
                    ? 'bg-cyan-50/70 border-cyan-500 dark:bg-gradient-to-r dark:from-slate-900 dark:to-[#0C1E2E] dark:border-cyan-400/60 font-bold text-slate-900 dark:text-white shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono w-6 text-slate-400 dark:text-slate-500">
                    #{tbl.id.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {tbl.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {tbl.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tbl.columns.length} cols
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Table Inspector */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 theme-transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400 font-bold border border-cyan-200 dark:border-cyan-500/40">
                  TABLE #{selectedTable.id}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">
                  {selectedTable.category}
                </span>
              </div>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white mt-1">
                {selectedTable.name}
              </h2>
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Primary Key: <strong className="text-cyan-700 dark:text-cyan-400">{selectedTable.pk}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedTable.description}
          </p>

          {/* Columns Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="pb-2">Column Name</th>
                  <th className="pb-2">Data Type</th>
                  <th className="pb-2">Attributes / Foreign Keys</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {col.isPk && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {col.isFk && <Link2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2.5 text-cyan-700 dark:text-cyan-300 font-semibold">
                      {col.type}
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      {col.isPk && <span className="mr-2 text-amber-600 dark:text-yellow-400 font-bold">[PRIMARY KEY]</span>}
                      {col.isFk && <span className="mr-2 text-cyan-700 dark:text-cyan-400 font-bold">[FK → {col.ref}]</span>}
                      {col.multiValued && <span className="mr-2 text-pink-600 dark:text-[#FF2E7E] font-bold">[MULTI-VALUED]</span>}
                      {col.nullable && <span className="text-slate-400">[NULLABLE]</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DDL SQL Generation Box */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold">
                <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
                GENERATED POSTGRESQL DDL
              </span>
              <button
                onClick={() => {
                  const sql = `CREATE TABLE ${selectedTable.name.toLowerCase()} (\n${selectedTable.columns.map(c => `  ${c.name} ${c.type}${c.isPk ? ' PRIMARY KEY' : ''}`).join(',\n')}\n);`;
                  navigator.clipboard.writeText(sql);
                  alert('DDL copied to clipboard');
                }}
                className="text-xs text-emerald-600 dark:text-[#00E599] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy SQL</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 dark:text-slate-300 overflow-x-auto leading-relaxed shadow-xs">
{`CREATE TABLE ${selectedTable.name.toLowerCase()} (
${selectedTable.columns.map(c => `  ${c.name.padEnd(22, ' ')} ${c.type}${c.isPk ? ' PRIMARY KEY' : ''}${c.isFk ? ` REFERENCES ${c.ref?.toLowerCase()}` : ''}`).join(',\n')}
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
