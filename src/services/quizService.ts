import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Quiz, Question, QuizAttempt } from '../types/schema';
import { MOCK_QUIZZES, MOCK_QUESTIONS } from '../data/mockData';
import { TAMIL_QUESTIONS } from '../data/translations/tamilContent';

function getActiveLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('financex_language') || 'en';
  }
  return 'en';
}

import { NISM_SERIES_XV_QUESTIONS } from '../data/nismSeriesXVData';
import { NISM_XV_CHAPTERS } from '../data/nismFullCurriculum';

export const NISM_CHAPTER_QUIZZES: Quiz[] = NISM_XV_CHAPTERS.map((ch) => ({
  quiz_id: 100 + ch.chapterNumber,
  topic_id: ch.chapterNumber,
  title: `Chapter ${ch.chapterNumber}: ${ch.chapterTitle} Mastery`,
  passing_score_percent: 60,
  time_limit_mins: 15,
  total_questions: 5
}));

export const ALL_MASTER_QUIZZES: Quiz[] = [
  ...MOCK_QUIZZES,
  ...NISM_CHAPTER_QUIZZES
];

export const quizService = {
  /**
   * Fetch all available quizzes
   */
  async getQuizzes(): Promise<Quiz[]> {
    if (!isSupabaseConfigured) return ALL_MASTER_QUIZZES;
    try {
      const { data, error } = await supabase.from('quizzes').select('*');
      if (error || !data || data.length === 0) return ALL_MASTER_QUIZZES;
      const remote = data.map((q: any, idx: number) => ({
        quiz_id: idx + 1,
        topic_id: (idx % 4) + 1,
        title: q.title,
        passing_score_percent: Number(q.passing_score_percent || 70),
        time_limit_mins: q.time_limit_minutes || 10,
        total_questions: 5
      }));
      return [...remote, ...NISM_CHAPTER_QUIZZES];
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      return ALL_MASTER_QUIZZES;
    }
  },

  /**
   * Fetch questions for a specific quiz with language support
   */
  async getQuizQuestions(quizId: number): Promise<Question[]> {
    const lang = getActiveLanguage();
    let questions: Question[] = [];

    // 1. Check if this is a NISM XV Chapter Quiz (101 - 115)
    if (quizId >= 101 && quizId <= 115) {
      const chapterNumber = quizId - 100;
      const nismQuestions: Question[] = NISM_SERIES_XV_QUESTIONS
        .filter((q) => q.topic_id === chapterNumber)
        .map((q) => ({
          question_id: q.question_id,
          topic_id: q.topic_id,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option as 'A' | 'B' | 'C' | 'D',
          difficulty: (['EASY', 'MEDIUM', 'HARD'].includes(q.difficulty || '') ? q.difficulty : 'MEDIUM') as 'EASY' | 'MEDIUM' | 'HARD',
          explanation: q.explanation || ''
        }));

      // Also grab the review questions from NISM_XV_CHAPTERS for this chapter
      const chapterInfo = NISM_XV_CHAPTERS.find((c) => c.chapterNumber === chapterNumber);
      const reviewQuestions: Question[] = chapterInfo
        ? chapterInfo.reviewQuestions.map((rq) => ({
            question_id: rq.questionId,
            topic_id: chapterNumber,
            question_text: rq.questionText,
            option_a: rq.optionA,
            option_b: rq.optionB,
            option_c: rq.optionC,
            option_d: rq.optionD,
            correct_option: rq.correctOption,
            difficulty: (['EASY', 'MEDIUM', 'HARD'].includes(rq.difficulty) ? rq.difficulty : 'MEDIUM') as 'EASY' | 'MEDIUM' | 'HARD',
            explanation: rq.explanation
          }))
        : [];

      // Combine unique questions for this chapter
      const combined = [...nismQuestions, ...reviewQuestions];
      const seen = new Set<string>();
      questions = combined.filter((q) => {
        const textKey = q.question_text.slice(0, 40).toLowerCase();
        if (seen.has(textKey)) return false;
        seen.add(textKey);
        return true;
      });

      if (questions.length === 0) {
        questions = MOCK_QUESTIONS.slice(0, 5);
      }
    } else {
      // 2. Specialized Quizzes (Quiz 1: Greeks, Quiz 2: Futures, Quiz 3: Bonds)
      const targetTopic = quizId === 1 ? 3 : quizId === 2 ? 2 : 4;
      const filtered = MOCK_QUESTIONS.filter((q) => q.topic_id === targetTopic);
      questions = filtered.length > 0 ? filtered : MOCK_QUESTIONS.slice(0, 5);
    }

    if (lang === 'ta') {
      return questions.map(q => {
        const ta = TAMIL_QUESTIONS[q.question_id];
        if (ta) {
          return {
            ...q,
            question_text: ta.question_text,
            option_a: ta.option_a,
            option_b: ta.option_b,
            option_c: ta.option_c,
            option_d: ta.option_d,
            explanation: ta.explanation
          };
        }
        return q;
      });
    }

    return questions;
  },

  /**
   * Submit Quiz Attempt
   */
  async submitQuizAttempt(
    userId: string,
    quizId: string,
    score: number,
    totalMarks: number,
    correctCount: number,
    totalQuestions: number,
    timeSpentSeconds: number
  ): Promise<QuizAttempt | null> {
    if (!isSupabaseConfigured) {
      const mockAttempt: QuizAttempt = {
        attempt_id: Date.now(),
        user_id: 1,
        quiz_id: Number(quizId) || 1,
        score,
        total_questions: totalQuestions,
        correct_answers: correctCount,
        completed_at: new Date().toISOString()
      };
      return mockAttempt;
    }

    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          score,
          total_marks: totalMarks,
          correct_answers: correctCount,
          total_questions: totalQuestions,
          time_spent_seconds: timeSpentSeconds,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error inserting quiz attempt:', error);
        return null;
      }

      return {
        attempt_id: 1,
        user_id: 1,
        quiz_id: Number(quizId) || 1,
        score: data.score,
        total_questions: data.total_questions,
        correct_answers: data.correct_answers,
        completed_at: data.completed_at
      };
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
      return null;
    }
  }
};
