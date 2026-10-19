/**
 * FINANCEX — Supabase 34-Table Database TypeScript Schema Definitions
 * Derived strictly from the authoritative FinanceX 34-table database specification.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          account_status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
          knowledge_level_id: string | null;
          current_streak: number;
          longest_streak: number;
          xp_points: number;
          avatar_url: string | null;
          social_links: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone_number?: string | null;
          account_status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
          knowledge_level_id?: string | null;
          current_streak?: number;
          longest_streak?: number;
          xp_points?: number;
          avatar_url?: string | null;
          social_links?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          account_status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
          knowledge_level_id?: string | null;
          current_streak?: number;
          longest_streak?: number;
          xp_points?: number;
          avatar_url?: string | null;
          social_links?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_levels: {
        Row: {
          id: string;
          level_name: string;
          min_score: number;
          max_score: number;
          badge_color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          level_name: string;
          min_score: number;
          max_score: number;
          badge_color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          level_name?: string;
          min_score?: number;
          max_score?: number;
          badge_color?: string | null;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          achievement_name: string;
          description: string;
          icon_url: string | null;
          category: string | null;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          achievement_name: string;
          description: string;
          icon_url?: string | null;
          category?: string | null;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          achievement_name?: string;
          description?: string;
          icon_url?: string | null;
          category?: string | null;
          xp_reward?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          goal_title: string;
          target_date: string;
          status: 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'PAUSED';
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_title: string;
          target_date: string;
          status?: 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'PAUSED';
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_title?: string;
          target_date?: string;
          status?: 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'PAUSED';
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          topic_name: string;
          difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_name: string;
          difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          topic_name?: string;
          difficulty_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          certification_name: string;
          governing_body: string | null;
          validity_years: number | null;
          prerequisites: string | null;
          badge_icon: string | null;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certification_name: string;
          governing_body?: string | null;
          validity_years?: number | null;
          prerequisites?: string | null;
          badge_icon?: string | null;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          certification_name?: string;
          governing_body?: string | null;
          validity_years?: number | null;
          prerequisites?: string | null;
          badge_icon?: string | null;
          summary?: string | null;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          course_title: string;
          description: string | null;
          price: number;
          certification_id: string | null;
          level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
          author: string | null;
          image_url: string | null;
          estimated_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_title: string;
          description?: string | null;
          price?: number;
          certification_id?: string | null;
          level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
          author?: string | null;
          image_url?: string | null;
          estimated_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_title?: string;
          description?: string | null;
          price?: number;
          certification_id?: string | null;
          level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
          author?: string | null;
          image_url?: string | null;
          estimated_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          topic_id: string;
          title: string;
          description: string | null;
          order_index: number;
          estimated_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          topic_id: string;
          title: string;
          description?: string | null;
          order_index?: number;
          estimated_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          topic_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          estimated_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_content: {
        Row: {
          id: string;
          lesson_id: string;
          content_type: string;
          content_url: string | null;
          raw_body: string | null;
          display_order: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          content_type: string;
          content_url?: string | null;
          raw_body?: string | null;
          display_order?: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          content_type?: string;
          content_url?: string | null;
          raw_body?: string | null;
          display_order?: number;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      lesson_resources: {
        Row: {
          id: string;
          lesson_id: string;
          resource_title: string;
          resource_url: string;
          resource_type: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          resource_title: string;
          resource_url: string;
          resource_type?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          resource_title?: string;
          resource_url?: string;
          resource_type?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress_percent: number;
          last_position: number | null;
          started_at: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress_percent?: number;
          last_position?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress_percent?: number;
          last_position?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          topic_id: string;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: 'A' | 'B' | 'C' | 'D';
          difficulty: 'EASY' | 'MEDIUM' | 'HARD';
          explanation: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: 'A' | 'B' | 'C' | 'D';
          difficulty: 'EASY' | 'MEDIUM' | 'HARD';
          explanation: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          question_text?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_option?: 'A' | 'B' | 'C' | 'D';
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
          explanation?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          topic_id: string | null;
          course_id: string | null;
          title: string;
          quiz_type: 'DAILY' | 'TOPIC' | 'COURSE' | 'PRACTICE';
          active_date: string | null;
          passing_score_percent: number;
          time_limit_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id?: string | null;
          course_id?: string | null;
          title: string;
          quiz_type?: 'DAILY' | 'TOPIC' | 'COURSE' | 'PRACTICE';
          active_date?: string | null;
          passing_score_percent?: number;
          time_limit_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string | null;
          course_id?: string | null;
          title?: string;
          quiz_type?: 'DAILY' | 'TOPIC' | 'COURSE' | 'PRACTICE';
          active_date?: string | null;
          passing_score_percent?: number;
          time_limit_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          quiz_id: string;
          question_id: string;
          question_order: number;
          mark: number;
        };
        Insert: {
          quiz_id: string;
          question_id: string;
          question_order?: number;
          mark?: number;
        };
        Update: {
          quiz_id?: string;
          question_id?: string;
          question_order?: number;
          mark?: number;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_marks: number;
          correct_answers: number;
          total_questions: number;
          started_at: string;
          completed_at: string;
          time_spent_seconds: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_marks: number;
          correct_answers: number;
          total_questions: number;
          started_at?: string;
          completed_at?: string;
          time_spent_seconds?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          score?: number;
          total_marks?: number;
          correct_answers?: number;
          total_questions?: number;
          started_at?: string;
          completed_at?: string;
          time_spent_seconds?: number;
        };
      };
      quiz_attempt_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option: string | null;
          is_correct: boolean;
          marks_awarded: number;
          answered_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_option?: string | null;
          is_correct?: boolean;
          marks_awarded?: number;
          answered_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          selected_option?: string | null;
          is_correct?: boolean;
          marks_awarded?: number;
          answered_at?: string;
        };
      };
      mock_exams: {
        Row: {
          id: string;
          certification_id: string;
          course_id: string | null;
          certification_series: string;
          title: string;
          total_time_minutes: number;
          total_marks: number;
          passing_percentage: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          certification_id: string;
          course_id?: string | null;
          certification_series: string;
          title: string;
          total_time_minutes: number;
          total_marks: number;
          passing_percentage: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          certification_id?: string;
          course_id?: string | null;
          certification_series?: string;
          title?: string;
          total_time_minutes?: number;
          total_marks?: number;
          passing_percentage?: number;
          created_at?: string;
        };
      };
      mock_exam_questions: {
        Row: {
          exam_id: string;
          question_id: string;
          question_order: number;
          mark: number;
          negative_mark: number;
        };
        Insert: {
          exam_id: string;
          question_id: string;
          question_order?: number;
          mark?: number;
          negative_mark?: number;
        };
        Update: {
          exam_id?: string;
          question_id?: string;
          question_order?: number;
          mark?: number;
          negative_mark?: number;
        };
      };
      mock_exam_attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          score: number;
          passed: boolean;
          accuracy_percent: number;
          time_spent_seconds: number;
          started_at: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          score: number;
          passed: boolean;
          accuracy_percent: number;
          time_spent_seconds?: number;
          started_at?: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          score?: number;
          passed?: boolean;
          accuracy_percent?: number;
          time_spent_seconds?: number;
          started_at?: string;
          completed_at?: string;
        };
      };
      mock_exam_attempt_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option: string | null;
          is_correct: boolean;
          marks_awarded: number;
          answered_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_option?: string | null;
          is_correct?: boolean;
          marks_awarded?: number;
          answered_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          selected_option?: string | null;
          is_correct?: boolean;
          marks_awarded?: number;
          answered_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          certification_id: string;
          certificate_number: string;
          issued_at: string;
          expires_at: string | null;
          certificate_url: string | null;
          verification_status: 'ISSUED' | 'VERIFIED' | 'REVOKED';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          certification_id: string;
          certificate_number: string;
          issued_at?: string;
          expires_at?: string | null;
          certificate_url?: string | null;
          verification_status?: 'ISSUED' | 'VERIFIED' | 'REVOKED';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          certification_id?: string;
          certificate_number?: string;
          issued_at?: string;
          expires_at?: string | null;
          certificate_url?: string | null;
          verification_status?: 'ISSUED' | 'VERIFIED' | 'REVOKED';
          created_at?: string;
        };
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          certification_id: string;
          title: string;
          status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
          start_date: string;
          target_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          certification_id: string;
          title: string;
          status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
          start_date: string;
          target_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          certification_id?: string;
          title?: string;
          status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
          start_date?: string;
          target_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_plan_items: {
        Row: {
          id: string;
          study_plan_id: string;
          sequence_no: number;
          item_type: 'LESSON' | 'QUIZ' | 'MOCK_EXAM' | 'REVISION';
          reference_id: string | null;
          completion_status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
          due_date: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          study_plan_id: string;
          sequence_no: number;
          item_type: 'LESSON' | 'QUIZ' | 'MOCK_EXAM' | 'REVISION';
          reference_id?: string | null;
          completion_status?: 'PENDING' | 'COMPLETED' | 'SKIPPED';
          due_date?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          study_plan_id?: string;
          sequence_no?: number;
          item_type?: 'LESSON' | 'QUIZ' | 'MOCK_EXAM' | 'REVISION';
          reference_id?: string | null;
          completion_status?: 'PENDING' | 'COMPLETED' | 'SKIPPED';
          due_date?: string | null;
          completed_at?: string | null;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_type: 'USER' | 'AI';
          message_text: string;
          timestamp: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_type: 'USER' | 'AI';
          message_text: string;
          timestamp?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_type?: 'USER' | 'AI';
          message_text?: string;
          timestamp?: string;
          metadata?: Json | null;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          recommendation_type: 'REVIEW_WEAK_CONCEPT' | 'TAKE_MOCK_EXAM' | 'PRACTICE_SIMULATION' | 'NEXT_MODULE';
          insight_text: string;
          generated_at: string;
          is_dismissed: boolean;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          recommendation_type: 'REVIEW_WEAK_CONCEPT' | 'TAKE_MOCK_EXAM' | 'PRACTICE_SIMULATION' | 'NEXT_MODULE';
          insight_text: string;
          generated_at?: string;
          is_dismissed?: boolean;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string | null;
          recommendation_type?: 'REVIEW_WEAK_CONCEPT' | 'TAKE_MOCK_EXAM' | 'PRACTICE_SIMULATION' | 'NEXT_MODULE';
          insight_text?: string;
          generated_at?: string;
          is_dismissed?: boolean;
          metadata?: Json | null;
        };
      };
      discussion_threads: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          title: string;
          body: string;
          status: 'ACTIVE' | 'CLOSED' | 'PINNED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          title: string;
          body: string;
          status?: 'ACTIVE' | 'CLOSED' | 'PINNED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string | null;
          title?: string;
          body?: string;
          status?: 'ACTIVE' | 'CLOSED' | 'PINNED';
          created_at?: string;
          updated_at?: string;
        };
      };
      discussion_replies: {
        Row: {
          id: string;
          thread_id: string;
          user_id: string;
          message_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          user_id: string;
          message_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          user_id?: string;
          message_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          priority: 'NORMAL' | 'HIGH';
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          priority?: 'NORMAL' | 'HIGH';
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          priority?: 'NORMAL' | 'HIGH';
          action_url?: string | null;
          created_at?: string;
        };
      };
      instruments: {
        Row: {
          id: string;
          symbol: string;
          name: string;
          instrument_type: 'EQUITY' | 'BOND' | 'MUTUAL_FUND';
          topic_id: string | null;
          currency: 'INR' | 'USD';
          simulated_price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          symbol: string;
          name: string;
          instrument_type: 'EQUITY' | 'BOND' | 'MUTUAL_FUND';
          topic_id?: string | null;
          currency?: 'INR' | 'USD';
          simulated_price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          symbol?: string;
          name?: string;
          instrument_type?: 'EQUITY' | 'BOND' | 'MUTUAL_FUND';
          topic_id?: string | null;
          currency?: 'INR' | 'USD';
          simulated_price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      demo_accounts: {
        Row: {
          id: string;
          user_id: string;
          virtual_balance: number;
          currency: 'INR' | 'USD';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          virtual_balance?: number;
          currency?: 'INR' | 'USD';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          virtual_balance?: number;
          currency?: 'INR' | 'USD';
          created_at?: string;
          updated_at?: string;
        };
      };
      demo_holdings: {
        Row: {
          id: string;
          demo_account_id: string;
          instrument_id: string;
          quantity: number;
          avg_buy_price: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          demo_account_id: string;
          instrument_id: string;
          quantity: number;
          avg_buy_price: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          demo_account_id?: string;
          instrument_id?: string;
          quantity?: number;
          avg_buy_price?: number;
          updated_at?: string;
        };
      };
      demo_transactions: {
        Row: {
          id: string;
          demo_account_id: string;
          instrument_id: string;
          transaction_type: 'BUY' | 'SELL';
          quantity: number;
          price_per_unit: number;
          total_value: number;
          executed_at: string;
        };
        Insert: {
          id?: string;
          demo_account_id: string;
          instrument_id: string;
          transaction_type: 'BUY' | 'SELL';
          quantity: number;
          price_per_unit: number;
          total_value: number;
          executed_at?: string;
        };
        Update: {
          id?: string;
          demo_account_id?: string;
          instrument_id?: string;
          transaction_type?: 'BUY' | 'SELL';
          quantity?: number;
          price_per_unit?: number;
          total_value?: number;
          executed_at?: string;
        };
      };
    };
  };
}
