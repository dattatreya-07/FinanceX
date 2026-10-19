import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MockExam, Certification, Certificate, MockExamAttempt } from '../types/schema';
import { 
  MOCK_EXAMS, 
  MOCK_QUESTIONS,
  MOCK_CERTIFICATIONS, 
  MOCK_CERTIFICATES, 
  MOCK_EXAM_ATTEMPTS 
} from '../data/mockData';
import { TAMIL_QUESTIONS } from '../data/translations/tamilContent';
import { NISM_SERIES_XV_QUESTIONS } from '../data/nismSeriesXVData';

function getActiveLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('financex_language') || 'en';
  }
  return 'en';
}

export const examService = {
  /**
   * Fetch all mock exams
   */
  async getMockExams(): Promise<MockExam[]> {
    if (!isSupabaseConfigured) return MOCK_EXAMS;
    try {
      const { data, error } = await supabase.from('mock_exams').select('*');
      if (error || !data || data.length === 0) return MOCK_EXAMS;
      return data.map((e: any, idx: number) => ({
        exam_id: idx + 1,
        course_id: 1,
        title: e.title,
        duration_minutes: e.total_time_minutes || 60,
        total_marks: Number(e.total_marks || 100),
        passing_percentage: Number(e.passing_percentage || 60),
        negative_marking: 0.25,
        exam_code: e.certification_series || 'NISM-VIII'
      }));
    } catch (err) {
      console.error('Error fetching mock exams:', err);
      return MOCK_EXAMS;
    }
  },

  /**
   * Fetch questions for mock exams with language support
   */
  async getExamQuestions(examId: number): Promise<any[]> {
    // If NISM Series XV Mock Exam (examId === 2 or NISM-XV)
    if (examId === 2) {
      return NISM_SERIES_XV_QUESTIONS;
    }

    const lang = getActiveLanguage();
    let questions: any[] = [];

    if (!isSupabaseConfigured) {
      questions = MOCK_QUESTIONS;
    } else {
      try {
        const { data, error } = await supabase.from('questions').select('*');
        if (error || !data || data.length === 0) {
          questions = MOCK_QUESTIONS;
        } else {
          questions = data.map((q: any, idx: number) => ({
            question_id: idx + 1,
            topic_id: 1,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option as 'A' | 'B' | 'C' | 'D',
            difficulty: q.difficulty || 'MEDIUM',
            explanation: q.explanation || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching exam questions:', err);
        questions = MOCK_QUESTIONS;
      }
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
   * Fetch certifications catalog
   */
  async getCertifications(): Promise<Certification[]> {
    if (!isSupabaseConfigured) return MOCK_CERTIFICATIONS;
    try {
      const { data, error } = await supabase.from('certifications').select('*');
      if (error || !data || data.length === 0) return MOCK_CERTIFICATIONS;
      return data.map((c: any, idx: number) => ({
        certification_id: idx + 1,
        certification_name: c.certification_name,
        exam_id: idx + 1,
        governing_body: c.governing_body || 'NISM',
        validity_years: c.validity_years || 3,
        prerequisites: c.prerequisites || 'None',
        summary: c.summary || ''
      }));
    } catch (err) {
      console.error('Error fetching certifications:', err);
      return MOCK_CERTIFICATIONS;
    }
  },

  /**
   * Fetch issued certificates for user (zero fake certificates)
   */
  async getCertificates(userId?: string | number): Promise<Certificate[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', String(userId));

      if (error || !data || data.length === 0) return [];
      return data.map((cert: any, idx: number) => ({
        certificate_id: idx + 1,
        user_id: cert.user_id,
        certification_id: idx + 1,
        certificate_number: cert.certificate_number,
        issued_at: cert.issued_at,
        verification_url: cert.certificate_url || 'https://financex.academy/verify',
        recipient_name: 'Learner',
        score_achieved: Number(cert.score_achieved || 85)
      }));
    } catch (err) {
      console.warn('Error fetching certificates:', err);
      return [];
    }
  },

  /**
   * Submit Mock Exam Attempt with Anti-Cheat Violations and Topic Breakdown
   */
  async submitMockExamAttempt(
    userId: string,
    examId: string,
    score: number,
    totalMarks: number,
    percentage: number,
    passed: boolean,
    timeSpentSeconds: number,
    violationCount?: number,
    topicBreakdown?: any
  ): Promise<MockExamAttempt | null> {
    const passedStr: 'YES' | 'NO' = passed ? 'YES' : 'NO';

    if (!isSupabaseConfigured) {
      const mockAttempt: MockExamAttempt = {
        attempt_id: Date.now(),
        user_id: userId,
        exam_id: Number(examId) || 1,
        score,
        passed: passedStr,
        completed_at: new Date().toISOString(),
        time_spent_mins: Math.round(timeSpentSeconds / 60),
        violation_count: violationCount || 0,
        topic_breakdown: topicBreakdown
      };
      return mockAttempt;
    }

    try {
      const { data: allExams } = await supabase.from('mock_exams').select('id').order('created_at', { ascending: true });
      const targetExamUuid = allExams?.[Number(examId) - 1]?.id || examId;

      const { data, error } = await supabase
        .from('mock_exam_attempts')
        .insert({
          user_id: userId,
          mock_exam_id: targetExamUuid,
          score,
          total_marks: totalMarks,
          percentage_achieved: percentage,
          passed,
          time_spent_seconds: timeSpentSeconds,
          violation_count: violationCount || 0,
          topic_breakdown: topicBreakdown || {},
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error || !data) {
        console.warn('Supabase insert mock exam attempt error, returning recorded state:', error);
      }

      return {
        attempt_id: data?.id || Date.now(),
        user_id: userId,
        exam_id: Number(examId) || 1,
        score: data ? data.score : score,
        passed: passedStr,
        completed_at: data ? data.completed_at : new Date().toISOString(),
        time_spent_mins: Math.round(timeSpentSeconds / 60),
        violation_count: violationCount || 0,
        topic_breakdown: topicBreakdown
      };
    } catch (err) {
      console.warn('Error submitting mock exam attempt:', err);
      return {
        attempt_id: Date.now(),
        user_id: userId,
        exam_id: Number(examId) || 1,
        score,
        passed: passedStr,
        completed_at: new Date().toISOString(),
        time_spent_mins: Math.round(timeSpentSeconds / 60),
        violation_count: violationCount || 0,
        topic_breakdown: topicBreakdown
      };
    }
  },

  async submitExamAttempt(
    userId: string,
    examId: string,
    score: number,
    totalMarks: number,
    percentage: number,
    passed: boolean,
    timeSpentSeconds: number,
    violationCount?: number,
    topicBreakdown?: any
  ): Promise<MockExamAttempt | null> {
    return this.submitMockExamAttempt(userId, examId, score, totalMarks, percentage, passed, timeSpentSeconds, violationCount, topicBreakdown);
  }
};
