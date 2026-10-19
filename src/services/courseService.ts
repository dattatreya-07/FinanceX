import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Course, Lesson, LessonContent, LessonResource, Topic } from '../types/schema';
import { 
  MOCK_COURSES, 
  MOCK_LESSONS, 
  MOCK_LESSON_CONTENTS, 
  MOCK_LESSON_RESOURCES, 
  MOCK_TOPICS 
} from '../data/mockData';
import { 
  TAMIL_COURSES, 
  TAMIL_TOPICS, 
  TAMIL_LESSONS, 
  TAMIL_LESSON_CONTENTS 
} from '../data/translations/tamilContent';
import { NISM_SERIES_XV_CHAPTERS } from '../data/nismSeriesXVData';
import { NISM_XV_CHAPTERS } from '../data/nismFullCurriculum';

function getActiveLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('financex_language') || 'en';
  }
  return 'en';
}

export const courseService = {
  /**
   * Fetch all courses with language support
   */
  async getCourses(): Promise<Course[]> {
    const lang = getActiveLanguage();
    let courses: Course[] = [];

    if (!isSupabaseConfigured) {
      courses = MOCK_COURSES;
    } else {
      try {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
        if (error || !data || data.length === 0) {
          courses = MOCK_COURSES;
        } else {
          courses = data.map((c: any, index: number) => ({
            course_id: index + 1,
            course_title: c.course_title,
            price: Number(c.price || 0),
            certification_id: c.certification_id ? 1 : null,
            description: c.description || '',
            author: c.author || 'FinanceX Faculty',
            image_url: c.image_url || '',
            estimated_hours: Number(c.estimated_hours || 10),
            level: c.level || 'INTERMEDIATE',
            rating: 4.9,
            total_lessons: index === 2 ? 15 : 12
          }));
        }
      } catch (err) {
        console.error('Error fetching courses from Supabase:', err);
        courses = MOCK_COURSES;
      }
    }

    if (lang === 'ta') {
      return courses.map(c => {
        const ta = TAMIL_COURSES[c.course_id];
        if (ta) {
          return { ...c, course_title: ta.course_title, description: ta.description };
        }
        return c;
      });
    }

    return courses;
  },

  /**
   * Fetch lessons for a given course with language support
   */
  async getLessons(courseId: number): Promise<Lesson[]> {
    const lang = getActiveLanguage();

    // If Course 3 (NISM Series XV: Research Analyst Certification)
    if (courseId === 3) {
      const nismLessons = NISM_XV_CHAPTERS.map((ch) => ({
        lesson_id: 100 + ch.chapterNumber,
        course_id: 3,
        topic_id: ch.chapterNumber,
        title: `Chapter ${ch.chapterNumber}: ${ch.chapterTitle}`,
        resource_links: [
          '/assets/nism-series-xv-workbook-feb-2026.pdf',
          'https://www.nism.ac.in/nism-series-xv-research-analyst-certification-examination/'
        ],
        estimated_mins: ch.estimatedMinutes,
        is_completed: false,
        order_index: ch.chapterNumber
      }));

      if (lang === 'ta') {
        return nismLessons.map(l => {
          const ta = TAMIL_LESSONS[l.lesson_id];
          if (ta) {
            return { ...l, title: ta.title };
          }
          return l;
        });
      }

      return nismLessons;
    }

    let lessons: Lesson[] = [];

    if (!isSupabaseConfigured) {
      lessons = MOCK_LESSONS.filter(l => l.course_id === courseId);
    } else {
      try {
        const { data: allCourses } = await supabase.from('courses').select('id').order('created_at', { ascending: true });
        const targetCourseUuid = allCourses?.[courseId - 1]?.id || `00000004-0000-0000-0000-00000000000${courseId}`;

        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', targetCourseUuid)
          .order('order_index', { ascending: true });

        if (error || !data || data.length === 0) {
          lessons = MOCK_LESSONS.filter(l => l.course_id === courseId);
        } else {
          lessons = data.map((l: any, idx: number) => ({
            lesson_id: idx + 1,
            course_id: courseId,
            topic_id: (idx % 4) + 1,
            title: l.title,
            resource_links: [],
            estimated_mins: l.estimated_minutes || 15,
            is_completed: false,
            order_index: l.order_index || idx + 1
          }));
        }
      } catch (err) {
        console.error('Error fetching lessons:', err);
        lessons = MOCK_LESSONS.filter(l => l.course_id === courseId);
      }
    }

    if (lang === 'ta') {
      return lessons.map(l => {
        const ta = TAMIL_LESSONS[l.lesson_id];
        if (ta) {
          return { ...l, title: ta.title };
        }
        return l;
      });
    }

    return lessons;
  },

  /**
   * Fetch content for a specific lesson with language support
   */
  async getLessonContent(lessonId: number): Promise<LessonContent | null> {
    // Check if this is a NISM Series XV chapter (101 - 115)
    if (lessonId > 100 && lessonId <= 115) {
      const chapterId = lessonId - 100;
      const chapter = NISM_XV_CHAPTERS.find(c => c.chapterNumber === chapterId);
      if (chapter) {
        return {
          content_id: 200 + chapterId,
          lesson_id: lessonId,
          content_type: 'MARKDOWN_TEXT',
          content_url: '',
          raw_body: chapter.detailedBody,
          key_takeaways: chapter.keyTakeaways,
          formulas: chapter.formulas.map(f => ({
            label: f.label,
            formula: f.formula,
            explanation: f.explanation
          }))
        };
      }
    }

    const lang = getActiveLanguage();
    let content: LessonContent | null = null;

    if (!isSupabaseConfigured) {
      content = MOCK_LESSON_CONTENTS.find(lc => lc.lesson_id === lessonId) || MOCK_LESSON_CONTENTS[0];
    } else {
      try {
        const { data: allLessons } = await supabase.from('lessons').select('id').order('order_index', { ascending: true });
        const targetLessonUuid = allLessons?.[lessonId - 1]?.id || `00000005-0000-0000-0000-00000000000${lessonId}`;

        const { data, error } = await supabase
          .from('lesson_content')
          .select('*')
          .eq('lesson_id', targetLessonUuid)
          .maybeSingle();

        if (error || !data) {
          content = MOCK_LESSON_CONTENTS.find(lc => lc.lesson_id === lessonId) || MOCK_LESSON_CONTENTS[0];
        } else {
          content = {
            content_id: 1,
            lesson_id: lessonId,
            content_type: data.content_type || 'MARKDOWN_TEXT',
            content_url: data.content_url || '',
            raw_body: data.raw_body || '',
            key_takeaways: data.metadata?.key_takeaways || [],
            formulas: data.metadata?.formulas || []
          };
        }
      } catch (err) {
        console.error('Error fetching lesson content:', err);
        content = MOCK_LESSON_CONTENTS.find(lc => lc.lesson_id === lessonId) || MOCK_LESSON_CONTENTS[0];
      }
    }

    if (content && lang === 'ta') {
      const ta = TAMIL_LESSON_CONTENTS[lessonId];
      if (ta) {
        return {
          ...content,
          raw_body: ta.raw_body,
          key_takeaways: ta.key_takeaways
        };
      }
    }

    return content;
  },

  /**
   * Fetch resources for a lesson
   */
  async getLessonResources(lessonId: number): Promise<LessonResource[]> {
    if (!isSupabaseConfigured) {
      return MOCK_LESSON_RESOURCES.filter(lr => lr.lesson_id === lessonId);
    }
    try {
      const { data, error } = await supabase.from('lesson_resources').select('*');
      if (error || !data || data.length === 0) {
        return MOCK_LESSON_RESOURCES.filter(lr => lr.lesson_id === lessonId);
      }
      return data.map((r: any, idx: number) => ({
        resource_id: idx + 1,
        lesson_id: lessonId,
        resource_title: r.resource_title,
        resource_url: r.resource_url,
        resource_type: r.resource_type || 'PDF_CHEAT_SHEET'
      }));
    } catch (err) {
      console.error('Error fetching lesson resources:', err);
      return MOCK_LESSON_RESOURCES.filter(lr => lr.lesson_id === lessonId);
    }
  },

  /**
   * Fetch all topics with language support
   */
  async getTopics(): Promise<Topic[]> {
    const lang = getActiveLanguage();
    let topics: Topic[] = [];

    if (!isSupabaseConfigured) {
      topics = MOCK_TOPICS;
    } else {
      try {
        const { data, error } = await supabase.from('topics').select('*');
        if (error || !data || data.length === 0) {
          topics = MOCK_TOPICS;
        } else {
          topics = data.map((t: any, idx: number) => ({
            topic_id: idx + 1,
            topic_name: t.topic_name,
            difficulty_level: t.difficulty_level || 'INTERMEDIATE',
            description: t.description || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
        topics = MOCK_TOPICS;
      }
    }

    if (lang === 'ta') {
      return topics.map(t => {
        const ta = TAMIL_TOPICS[t.topic_id];
        if (ta) {
          return { ...t, topic_name: ta.topic_name, description: ta.description };
        }
        return t;
      });
    }

    return topics;
  },

  /**
   * Record User Lesson Progress in Supabase
   */
  async recordLessonProgress(userId: string, lessonId: string, progressPercent: number, isCompleted: boolean) {
    if (!isSupabaseConfigured) return;
    try {
      const { data: allLessons } = await supabase.from('lessons').select('id').order('order_index', { ascending: true });
      const targetLessonUuid = allLessons?.[Number(lessonId) - 1]?.id || lessonId;

      await supabase.from('user_lesson_progress').upsert({
        user_id: userId,
        lesson_id: targetLessonUuid,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        progress_percent: progressPercent,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });
    } catch (err) {
      console.error('Error recording lesson progress:', err);
    }
  },

  /**
   * Fetch Course Ratings & Aggregate Score
   */
  async getCourseRatings(courseId: number | string): Promise<{ average: number; count: number; ratings: any[] }> {
    if (!isSupabaseConfigured) {
      return { average: 4.9, count: 28, ratings: [] };
    }
    try {
      const { data: allCourses } = await supabase.from('courses').select('id').order('created_at', { ascending: true });
      const targetCourseUuid = allCourses?.[Number(courseId) - 1]?.id || String(courseId);

      const { data, error } = await supabase
        .from('course_ratings')
        .select('*, profiles:user_id(full_name)')
        .eq('course_id', targetCourseUuid)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return { average: 4.9, count: 28, ratings: [] };
      }

      const total = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      const avg = Number((total / data.length).toFixed(1));

      return {
        average: avg,
        count: data.length,
        ratings: data.map((r: any) => ({
          id: r.id,
          course_id: courseId,
          user_id: r.user_id,
          user_name: r.profiles?.full_name || 'Learner',
          rating: r.rating,
          review: r.review,
          created_at: r.created_at
        }))
      };
    } catch (err) {
      console.warn('Error fetching course ratings:', err);
      return { average: 4.9, count: 28, ratings: [] };
    }
  },

  /**
   * Submit or Update Course Rating for Authenticated User
   */
  async submitCourseRating(
    userId: string,
    courseId: number | string,
    rating: number,
    review?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { data: allCourses } = await supabase.from('courses').select('id').order('created_at', { ascending: true });
      const targetCourseUuid = allCourses?.[Number(courseId) - 1]?.id || String(courseId);

      const { error } = await supabase
        .from('course_ratings')
        .upsert({
          course_id: targetCourseUuid,
          user_id: userId,
          rating: Math.min(5, Math.max(1, rating)),
          review: review?.trim() || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'course_id,user_id' });

      if (error) {
        console.error('Error submitting course rating:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error submitting course rating exception:', err);
      return { success: false, error: err?.message || 'Failed to submit rating.' };
    }
  }
};
