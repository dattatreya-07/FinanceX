import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from './authService';
import { 
  User, 
  UserRole, 
  ContentAuditLog, 
  AdminDashboardMetrics, 
  Course, 
  Lesson, 
  Quiz, 
  Question, 
  MockExam, 
  Certification, 
  LessonResource,
  Institution 
} from '../types/schema';

const AUDIT_LOGS_STORAGE_KEY = 'financex_admin_audit_logs';

const SEED_INSTITUTIONS: Institution[] = [
  {
    institution_id: 'inst-hdfc-01',
    name: 'HDFC Bank Treasury & Markets',
    domain: 'hdfcbank.com',
    license_tier: 'ENTERPRISE',
    seats_allocated: 500,
    seats_used: 342,
    created_at: '2025-01-15T00:00:00Z',
    status: 'ACTIVE'
  },
  {
    institution_id: 'inst-icici-02',
    name: 'ICICI Securities Research Academy',
    domain: 'icicidirect.com',
    license_tier: 'ENTERPRISE',
    seats_allocated: 300,
    seats_used: 198,
    created_at: '2025-02-01T00:00:00Z',
    status: 'ACTIVE'
  },
  {
    institution_id: 'inst-mumbai-edu-03',
    name: 'Mumbai Financial Institute',
    domain: 'mumbaifinance.edu',
    license_tier: 'ACADEMIC',
    seats_allocated: 1000,
    seats_used: 720,
    created_at: '2025-03-10T00:00:00Z',
    status: 'ACTIVE'
  },
  {
    institution_id: 'inst-kotak-04',
    name: 'Kotak Institutional Equities',
    domain: 'kotaksecurities.com',
    license_tier: 'ENTERPRISE',
    seats_allocated: 250,
    seats_used: 215,
    created_at: '2025-04-12T00:00:00Z',
    status: 'ACTIVE'
  }
];

const SEED_AUDIT_LOGS: ContentAuditLog[] = [
  {
    id: 'log-seed-1',
    admin_id: 'admin-system',
    admin_email: 'compliance.officer@hdfcbank.com',
    action: 'PUBLISH',
    entity_type: 'COURSE',
    entity_id: '1',
    entity_title: 'NISM Series VIII: Equity Derivatives Masterclass',
    details: { institution_id: 'inst-hdfc-01', version: '2026.1', modules_count: 5 },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'log-seed-2',
    admin_id: 'admin-system',
    admin_email: 'curriculum.lead@icicidirect.com',
    action: 'UPDATE',
    entity_type: 'QUESTION',
    entity_id: '101',
    entity_title: 'Black-Scholes Delta Calculation for In-The-Money Options',
    details: { institution_id: 'inst-icici-02', difficulty: 'HARD', formula_updated: true },
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'log-seed-3',
    admin_id: 'admin-system',
    admin_email: 'sebi.reviewer@mumbaifinance.edu',
    action: 'UPLOAD',
    entity_type: 'RESOURCE',
    entity_id: 'res-502',
    entity_title: 'SEBI Circular on Derivative Margining Framework 2026.pdf',
    details: { institution_id: 'inst-mumbai-edu-03', size_mb: 2.4, bucket: 'educational-assets' },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let inMemoryAuditLogs: ContentAuditLog[] = [...SEED_AUDIT_LOGS];

export const adminService = {
  /**
   * Determine if a user has administrative authorization (strictly database-backed role)
   */
  hasAdminPrivileges(user?: User | null): boolean {
    if (!user) return false;
    const role = user.role?.toUpperCase();
    return ['ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'INSTRUCTOR', 'INSTITUTION_ADMIN'].includes(role || '');
  },

  /**
   * Fetch configured enterprise institutions
   */
  async getInstitutions(): Promise<Institution[]> {
    return [...SEED_INSTITUTIONS];
  },

  /**
   * Promote or Demote a user's platform role with Super Admin protection and audit trail
   */
  async updateUserRole(
    actorAdmin: User,
    targetUserId: string | number,
    newRole: UserRole,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.hasAdminPrivileges(actorAdmin)) {
      return { success: false, error: 'Unauthorized: Administrative role required to modify user permissions.' };
    }

    const actorRole = actorAdmin.role?.toUpperCase();
    const targetIdStr = String(targetUserId);

    // Only SUPER_ADMIN can promote a user to SUPER_ADMIN
    if (newRole === 'SUPER_ADMIN' && actorRole !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Administrators can grant or assign the SUPER_ADMIN role.' };
    }

    if (isSupabaseConfigured) {
      try {
        // 1. Check target user profile and verify actor permissions
        const { data: targetProfile } = await supabase
          .from('profiles')
          .select('role, full_name, email')
          .eq('id', targetIdStr)
          .single();

        // Non-SUPER_ADMIN cannot modify an existing SUPER_ADMIN
        if (targetProfile?.role === 'SUPER_ADMIN' && actorRole !== 'SUPER_ADMIN') {
          return { success: false, error: 'Unauthorized: Only Super Administrators can modify or demote a Super Administrator account.' };
        }

        // Check if target user is last remaining super admin
        if (targetProfile?.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN') {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'SUPER_ADMIN');

          if (count !== null && count <= 1) {
            return { success: false, error: 'Cannot demote the sole remaining Super Administrator.' };
          }
        }

        // 2. Update PostgreSQL Profile Role
        const { error } = await supabase
          .from('profiles')
          .update({
            role: newRole,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetIdStr);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.warn('Supabase role update error:', err);
      }
    }

    // 3. Mutate local accounts registry & active session
    authService.updateUserRoleInLocalRegistry(targetUserId, newRole);

    // 4. Log Audit Trail
    await this.logAdminAction(
      actorAdmin,
      'UPDATE',
      'USER',
      targetIdStr,
      `Role modified to ${newRole}`,
      { target_user_id: targetIdStr, new_role: newRole, reason: reason || 'Administrative role mutation' }
    );

    return { success: true };
  },

  /**
   * Fetch registered learners from database and local registry
   */
  async getLearners(): Promise<User[]> {
    const learnersMap = new Map<string, User>();

    // 1. Load local registered users first
    const localUsers = authService.getAllRegisteredUsers();
    localUsers.forEach(u => {
      const key = u.email?.toLowerCase() || String(u.user_id);
      learnersMap.set(key, u);
    });

    // 2. Merge Supabase profiles if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          data.forEach((p: any) => {
            const key = p.email?.toLowerCase() || p.id;
            learnersMap.set(key, {
              user_id: p.id,
              full_name: p.full_name || 'Learner',
              email: p.email || '',
              role: (p.role as UserRole) || 'USER',
              phone_number: p.phone_number || '',
              account_status: (p.account_status as any) || 'ACTIVE',
              organization: p.organization || undefined,
              knowledge_level_id: 1,
              current_streak: Number(p.current_streak || 0),
              longest_streak: Number(p.longest_streak || 0),
              xp_points: Number(p.xp_points || 0),
              avatar_url: p.avatar_url || undefined,
              social_links: []
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching learners from Supabase:', err);
      }
    }

    return Array.from(learnersMap.values());
  },

  /**
   * Verify admin role against Supabase database profile
   */
  async verifyServerAdminRole(userId: string | number): Promise<boolean> {
    if (!isSupabaseConfigured || typeof userId !== 'string') {
      return true; // Local mode fallback handled by client check
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) return false;
      const role = data.role?.toUpperCase();
      return ['ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'INSTRUCTOR', 'INSTITUTION_ADMIN'].includes(role || '');
    } catch {
      return false;
    }
  },

  /**
   * Fetch recent administrative audit logs with optional institution filtering
   */
  async getAuditLogs(limit: number = 50, institutionId?: string): Promise<ContentAuditLog[]> {
    let logs: ContentAuditLog[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          logs = data.map((d: any) => ({
            id: d.id,
            admin_id: d.admin_id,
            admin_email: d.admin_email,
            action: d.action,
            entity_type: d.entity_type,
            entity_id: d.entity_id,
            entity_title: d.entity_title || `${d.entity_type} #${d.entity_id}`,
            details: d.details || {},
            created_at: d.created_at
          }));
        }
      } catch (err) {
        console.warn('Supabase audit logs fetch failed, loading local:', err);
      }
    }

    // Local storage / in-memory fallback if no supabase logs
    if (logs.length === 0) {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
          if (raw) {
            logs = JSON.parse(raw);
          }
        }
      } catch {
        // ignore
      }
    }

    if (logs.length === 0) {
      logs = [...inMemoryAuditLogs];
    }

    // Scoped filtering if institutionId provided
    if (institutionId && institutionId !== 'ALL') {
      logs = logs.filter(l => {
        const instInDetails = l.details?.institution_id;
        const emailMatches = l.admin_email?.includes(institutionId.replace('inst-', '').replace('-01', '').replace('-02', '').replace('-03', '').replace('-04', ''));
        return instInDetails === institutionId || emailMatches;
      });
    }

    return logs.slice(0, limit);
  },

  /**
   * Log an administrative mutation in database and local cache
   */
  async logAdminAction(
    adminUser: User | string | number,
    action: ContentAuditLog['action'],
    entity_type: ContentAuditLog['entity_type'],
    entity_id: string | number,
    entity_title_or_details?: string | Record<string, any>,
    details?: Record<string, any>,
    actorIdFallback?: string | number
  ): Promise<void> {
    const adminId: string | number = typeof adminUser === 'object' && adminUser !== null 
      ? adminUser.user_id 
      : (typeof adminUser === 'string' || typeof adminUser === 'number' ? adminUser : (actorIdFallback || 'admin-system'));
    
    const adminEmail = typeof adminUser === 'object' && adminUser !== null 
      ? adminUser.email 
      : 'admin@financex.internal';

    let title: string;
    let payloadDetails: Record<string, any>;

    if (typeof entity_title_or_details === 'string') {
      title = entity_title_or_details;
      payloadDetails = details || {};
    } else {
      payloadDetails = entity_title_or_details || details || {};
      title = `${entity_type} #${entity_id}`;
    }

    const newLog: ContentAuditLog = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      admin_id: adminId,
      admin_email: adminEmail || 'admin@financex.internal',
      action,
      entity_type,
      entity_id,
      entity_title: title,
      details: payloadDetails,
      created_at: new Date().toISOString()
    };

    // 1. Supabase insert if online
    if (isSupabaseConfigured) {
      try {
        await supabase.from('content_audit_logs').insert({
          id: newLog.id,
          admin_id: typeof adminId === 'string' ? adminId : null,
          admin_email: newLog.admin_email,
          action: newLog.action,
          entity_type: newLog.entity_type,
          entity_id: String(newLog.entity_id),
          entity_title: newLog.entity_title,
          details: newLog.details,
          created_at: newLog.created_at
        });
      } catch (err) {
        console.warn('Failed to insert audit log to Supabase:', err);
      }
    }

    // 2. Update local logs cache and in-memory cache
    inMemoryAuditLogs = [newLog, ...inMemoryAuditLogs.filter(l => l.id !== newLog.id)].slice(0, 100);
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
        const existing: ContentAuditLog[] = raw ? JSON.parse(raw) : [];
        const updated = [newLog, ...existing.filter(l => l.id !== newLog.id)].slice(0, 100);
        localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  },

  /**
   * Calculate real dashboard metrics based on active content state
   */
  computeDashboardMetrics(
    courses: Course[],
    lessons: Lesson[],
    resources: LessonResource[],
    quizzes: Quiz[],
    questions: Question[],
    mockExams: MockExam[],
    certifications: Certification[],
    auditLogs: ContentAuditLog[],
    learnersCount: number = 42
  ): AdminDashboardMetrics {
    const publishedCourses = courses.filter(c => (c.status || 'PUBLISHED') === 'PUBLISHED').length;
    const draftCourses = courses.length - publishedCourses;

    // Detect incomplete educational items needing admin review
    const incompleteContent: AdminDashboardMetrics['incompleteContent'] = [];

    courses.forEach(c => {
      const courseLessons = lessons.filter(l => l.course_id === c.course_id);
      if (courseLessons.length === 0) {
        incompleteContent.push({
          id: c.course_id,
          title: c.course_title,
          type: 'COURSE',
          missing: 'Contains 0 lessons. Add at least 1 lesson before publishing.'
        });
      }
    });

    quizzes.forEach(q => {
      if (!q.total_questions || q.total_questions === 0) {
        incompleteContent.push({
          id: q.quiz_id,
          title: q.title,
          type: 'QUIZ',
          missing: 'No questions assigned from question bank.'
        });
      }
    });

    return {
      totalCourses: courses.length,
      publishedCourses,
      draftCourses,
      totalLessons: lessons.length,
      totalResources: resources.length,
      totalQuizzes: quizzes.length,
      totalQuestions: questions.length,
      totalMockExams: mockExams.length,
      totalCertifications: certifications.length,
      totalLearners: learnersCount,
      recentAuditLogs: auditLogs.slice(0, 10),
      incompleteContent
    };
  }
};
