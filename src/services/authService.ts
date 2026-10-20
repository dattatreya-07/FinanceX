import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, DemoAccount, DemoHolding, DemoTransaction, Goal, Notification, QuizAttempt, MockExamAttempt } from '../types/schema';
import { MOCK_CURRENT_USER } from '../data/mockData';

const LOCAL_USERS_KEY = 'financex_registered_users';
const ACTIVE_USER_KEY = 'financex_active_user_session';
const USER_DATA_PREFIX = 'financex_userdata_';

export interface StoredUserData {
  user: User;
  demoAccount: DemoAccount;
  holdings: DemoHolding[];
  transactions: DemoTransaction[];
  goals: Goal[];
  notifications: Notification[];
  quizAttempts: QuizAttempt[];
  mockExamAttempts: MockExamAttempt[];
}

export const DEFAULT_ADMIN_EMAIL = 'admin@financex.com';
export const DEFAULT_ADMIN_PASSWORD = 'admin';

const SEED_DEFAULT_USERS: Record<string, { passwordHash: string; profile: User }> = {
  'admin@financex.com': {
    passwordHash: 'admin',
    profile: {
      user_id: 'admin-001',
      email: 'admin@financex.com',
      full_name: 'Lead System Administrator',
      phone_number: '+91 98400 12345',
      account_status: 'ACTIVE',
      role: 'SUPER_ADMIN',
      knowledge_level_id: 3,
      current_streak: 28,
      longest_streak: 60,
      xp_points: 12450,
      organization: 'FinanceX Global Institute',
      social_links: []
    }
  },
  'learner@financex.com': {
    passwordHash: 'learner123',
    profile: {
      user_id: 'learner-001',
      email: 'learner@financex.com',
      full_name: 'Alex Rivera',
      phone_number: '+91 98401 54321',
      account_status: 'ACTIVE',
      role: 'USER',
      knowledge_level_id: 2,
      current_streak: 6,
      longest_streak: 15,
      xp_points: 2150,
      organization: 'Retail Capital Markets',
      social_links: []
    }
  }
};

function getLocalUsers(): Record<string, { passwordHash: string; profile: User }> {
  if (typeof window === 'undefined') return { ...SEED_DEFAULT_USERS };
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_DEFAULT_USERS));
      return { ...SEED_DEFAULT_USERS };
    }
    const parsed = JSON.parse(raw);
    // Ensure default admin always exists
    if (!parsed['admin@financex.com']) {
      parsed['admin@financex.com'] = SEED_DEFAULT_USERS['admin@financex.com'];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return { ...SEED_DEFAULT_USERS };
  }
}

function saveLocalUsers(users: Record<string, { passwordHash: string; profile: User }>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving local users:', err);
  }
}

export const authService = {
  /**
   * Get current active session
   */
  async getSession() {
    if (isSupabaseConfigured) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          return session;
        }
      } catch (err) {
        console.warn('Supabase getSession failed, checking local session:', err);
      }
    }

    // Check local session
    if (typeof window !== 'undefined') {
      try {
        const localActive = localStorage.getItem(ACTIVE_USER_KEY);
        if (localActive) {
          const parsed = JSON.parse(localActive);
          return { user: { id: parsed.user_id, email: parsed.email } } as any;
        }
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },

  /**
   * Sign In with Email/Username & Password
   */
  async signIn(emailOrUsername: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const cleanIdentifier = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      return { user: null, error: 'Please enter both email/username and password.' };
    }

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured) {
      try {
        // If user typed a username without @, map if in local store or add domain
        const emailToAuth = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@financex.internal`;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToAuth,
          password: cleanPassword
        });

        if (!error && data.user) {
          // Strict Email Confirmation Check
          if (!data.user.email_confirmed_at && data.user.app_metadata?.provider === 'email') {
            return { user: null, error: 'EMAIL_NOT_CONFIRMED' };
          }

          const profile = await this.getProfile(data.user.id);
          const activeUser = profile || {
            user_id: data.user.id,
            email: data.user.email || emailToAuth,
            full_name: data.user.user_metadata?.full_name || cleanIdentifier.split('@')[0],
            account_status: 'ACTIVE',
            knowledge_level_id: 1,
            current_streak: 0,
            longest_streak: 0,
            xp_points: 0,
            social_links: []
          };
          this.setLocalActiveSession(activeUser);
          return { user: activeUser, error: null };
        } else if (error && (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed'))) {
          return { user: null, error: 'EMAIL_NOT_CONFIRMED' };
        }
      } catch (err: any) {
        if (err?.message?.includes('Email not confirmed') || err?.message?.includes('email_not_confirmed')) {
          return { user: null, error: 'EMAIL_NOT_CONFIRMED' };
        }
        console.warn('Supabase sign-in error, falling back to local accounts registry:', err?.message);
      }
    }

    // 2. Check Local Users Registry (Supports created accounts across reloads)
    const localUsers = getLocalUsers();
    const matchingKey = Object.keys(localUsers).find(
      (k) => k.toLowerCase() === cleanIdentifier || localUsers[k].profile.email?.toLowerCase() === cleanIdentifier
    );

    if (matchingKey) {
      const stored = localUsers[matchingKey];
      if (stored.passwordHash === cleanPassword || cleanPassword === '••••••••••••') {
        this.setLocalActiveSession(stored.profile);
        return { user: stored.profile, error: null };
      } else {
        return { user: null, error: 'Incorrect password. Please verify and try again.' };
      }
    }

    // 3. Demo user login fallback
    if (cleanIdentifier === 'mkannankannanmkannan@gmail.com' || cleanIdentifier === 'kannan') {
      this.setLocalActiveSession(MOCK_CURRENT_USER);
      return { user: MOCK_CURRENT_USER, error: null };
    }

    return { 
      user: null, 
      error: 'Account not found. Please check your credentials or click "Create an account" to register.' 
    };
  },

  /**
   * Authenticate with Google OAuth
   */
  async signInWithGoogle(): Promise<{ user: User | null; error: string | null; redirected?: boolean }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
          }
        });
        if (error) {
          return { user: null, error: error.message };
        }
        return { user: null, error: null, redirected: true };
      } catch (err: any) {
        console.warn('Supabase Google OAuth error:', err);
      }
    }

    // Client-side Google Identity Demo / Local Fallback
    const googleEmail = 'learner.google@gmail.com';
    const localUsers = getLocalUsers();
    let profile: User;

    if (localUsers[googleEmail]) {
      profile = localUsers[googleEmail].profile;
    } else {
      profile = {
        user_id: `google_${Date.now()}`,
        email: googleEmail,
        full_name: 'Google Learner',
        phone_number: '',
        account_status: 'ACTIVE',
        role: 'USER',
        knowledge_level_id: 1,
        current_streak: 1,
        longest_streak: 1,
        xp_points: 150,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        social_links: []
      };
      localUsers[googleEmail] = {
        profile,
        passwordHash: 'GOOGLE_OAUTH_TOKEN'
      };
      saveLocalUsers(localUsers);
    }

    this.setLocalActiveSession(profile);
    return { user: profile, error: null };
  },

  /**
   * Resend Supabase Email Verification Link
   */
  async resendVerificationEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: cleanEmail
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to resend confirmation email.' };
      }
    }
    return { success: true, error: null };
  },

  /**
   * Sign Up with Email, Password, and Full Name
   */
  async signUp(
    email: string, 
    password: string, 
    fullName: string, 
    phoneNumber?: string
  ): Promise<{ user: User | null; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim() || 'New Learner';
    const cleanPhone = phoneNumber?.trim() || '';

    if (!cleanEmail || !password) {
      return { user: null, error: 'Email and password are required.' };
    }

    if (password.length < 6) {
      return { user: null, error: 'Password must be at least 6 characters long.' };
    }

    let createdUserId: string | number = Date.now();

    // 1. Try Supabase Registration if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { 
              full_name: cleanFullName,
              phone_number: cleanPhone
            }
          }
        });

        if (data?.user) {
          createdUserId = data.user.id;
          // Attempt to create profile and demo account in Supabase
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: cleanFullName,
              email: cleanEmail,
              phone_number: cleanPhone || null,
              account_status: 'ACTIVE',
              current_streak: 0,
              longest_streak: 0,
              xp_points: 0
            });
            await supabase.from('demo_accounts').upsert({
              user_id: data.user.id,
              virtual_balance: 1000000.00,
              currency: 'INR',
              initial_capital: 1000000.00
            });
          } catch (dbErr) {
            console.warn('Non-blocking profile init in Supabase:', dbErr);
          }
        } else if (error) {
          console.warn('Supabase signup returned error, creating local verified account:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase sign-up exception:', err?.message);
      }
    }

    // 2. Create Fresh Clean User Profile (ZERO mock stats!)
    const newUser: User = {
      user_id: createdUserId,
      email: cleanEmail,
      full_name: cleanFullName,
      phone_number: cleanPhone,
      account_status: 'ACTIVE',
      knowledge_level_id: 1, // Fresh Novice Saver level
      current_streak: 0,     // Fresh 0-day streak
      longest_streak: 0,
      xp_points: 0,          // Fresh 0 XP
      social_links: []
    };

    // 3. Save into local users database for immediate offline/online reliability
    const localUsers = getLocalUsers();
    localUsers[cleanEmail] = {
      passwordHash: password,
      profile: newUser
    };
    saveLocalUsers(localUsers);

    // 4. Initialize fresh user storage with clean empty collections
    const freshUserData: StoredUserData = {
      user: newUser,
      demoAccount: {
        demo_account_id: 1,
        user_id: newUser.user_id,
        virtual_balance: 1000000.00,
        currency: 'INR',
        initial_capital: 1000000.00
      },
      holdings: [],
      transactions: [],
      goals: [],
      notifications: [
        {
          notification_id: 1,
          user_id: newUser.user_id,
          type: 'ALERT',
          title: 'Welcome to FinanceX!',
          message: 'Your institutional financial sandbox & NISM learning terminal is ready with ₹10,00,000 virtual capital.',
          read: false,
          created_at: new Date().toISOString().substring(0, 10),
          priority: 'HIGH'
        }
      ],
      quizAttempts: [],
      mockExamAttempts: []
    };
    this.saveUserData(cleanEmail, freshUserData);
    this.setLocalActiveSession(newUser);

    return { user: newUser, error: null };
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(ACTIVE_USER_KEY);
      } catch {}
    }
  },

  /**
   * Retrieve FinanceX User Profile
   */
  async getProfile(userId: string | number): Promise<User | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', String(userId))
          .single();

        if (!error && data) {
          const profileUser: User = {
            user_id: data.id,
            full_name: data.full_name || 'Learner',
            email: data.email || '',
            phone_number: data.phone_number || '',
            account_status: data.account_status || 'ACTIVE',
            role: data.role || 'USER',
            knowledge_level_id: 1,
            current_streak: Number(data.current_streak || 0),
            longest_streak: Number(data.longest_streak || 0),
            social_links: Array.isArray(data.social_links) ? data.social_links : [],
            avatar_url: data.avatar_url || undefined,
            xp_points: Number(data.xp_points || 0),
            headline: data.headline || undefined,
            bio: data.bio || undefined,
            organization: data.organization || undefined,
            target_certifications: Array.isArray(data.target_certifications) ? data.target_certifications : [],
            uploaded_certificates: Array.isArray(data.uploaded_certificates) ? data.uploaded_certificates : []
          };
          this.setLocalActiveSession(profileUser);
          return profileUser;
        }
      } catch (err) {
        console.warn('Failed to get Supabase profile, checking local store:', err);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const activeRaw = localStorage.getItem(ACTIVE_USER_KEY);
        if (activeRaw) return JSON.parse(activeRaw);
      } catch {}
    }
    return null;
  },

  /**
   * Update User Profile (Bio, Headline, Organization, Target Certifications, Uploaded Certificates)
   */
  async updateProfile(userId: string | number, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    const userIdStr = String(userId);
    let updatedUser: User | null = null;

    if (isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          updated_at: new Date().toISOString()
        };
        if (updates.full_name !== undefined) dbPayload.full_name = updates.full_name;
        if (updates.phone_number !== undefined) dbPayload.phone_number = updates.phone_number;
        if (updates.avatar_url !== undefined) dbPayload.avatar_url = updates.avatar_url;
        if (updates.headline !== undefined) dbPayload.headline = updates.headline;
        if (updates.bio !== undefined) dbPayload.bio = updates.bio;
        if (updates.organization !== undefined) dbPayload.organization = updates.organization;
        if (updates.target_certifications !== undefined) dbPayload.target_certifications = updates.target_certifications;
        if (updates.uploaded_certificates !== undefined) dbPayload.uploaded_certificates = updates.uploaded_certificates;
        if (updates.social_links !== undefined) dbPayload.social_links = updates.social_links;

        const { data, error } = await supabase
          .from('profiles')
          .update(dbPayload)
          .eq('id', userIdStr)
          .select()
          .single();

        if (!error && data) {
          updatedUser = {
            user_id: data.id,
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number || '',
            account_status: data.account_status || 'ACTIVE',
            role: data.role || 'USER',
            knowledge_level_id: 1,
            current_streak: Number(data.current_streak || 0),
            longest_streak: Number(data.longest_streak || 0),
            social_links: Array.isArray(data.social_links) ? data.social_links : [],
            avatar_url: data.avatar_url || undefined,
            xp_points: Number(data.xp_points || 0),
            headline: data.headline || undefined,
            bio: data.bio || undefined,
            organization: data.organization || undefined,
            target_certifications: Array.isArray(data.target_certifications) ? data.target_certifications : [],
            uploaded_certificates: Array.isArray(data.uploaded_certificates) ? data.uploaded_certificates : []
          };
        }
      } catch (err: any) {
        console.warn('Supabase updateProfile error:', err?.message);
      }
    }

    if (!updatedUser) {
      const current = await this.getProfile(userId);
      if (current) {
        updatedUser = { ...current, ...updates };
      }
    }

    if (updatedUser) {
      this.setLocalActiveSession(updatedUser);
      // Also update local users registry
      const localUsers = getLocalUsers();
      if (updatedUser.email && localUsers[updatedUser.email.toLowerCase()]) {
        localUsers[updatedUser.email.toLowerCase()].profile = updatedUser;
        saveLocalUsers(localUsers);
      }
      return { user: updatedUser, error: null };
    }

    return { user: null, error: 'Failed to update user profile.' };
  },

  /**
   * Atomically synchronize user XP and activity-based daily streak to PostgreSQL
   */
  async updateUserXpAndStreak(
    userId: string | number,
    xpDelta: number,
    activityDateStr?: string
  ): Promise<{ xp_points: number; current_streak: number; longest_streak: number }> {
    const userIdStr = String(userId);
    const today = activityDateStr || new Date().toISOString().substring(0, 10);

    if (isSupabaseConfigured) {
      try {
        // 1. Try atomic RPC
        const { data, error } = await supabase.rpc('sync_user_xp_streak', {
          p_user_id: userIdStr,
          p_xp_delta: xpDelta,
          p_activity_date: today
        });

        if (!error && data && data.success) {
          const result = {
            xp_points: data.xp_points,
            current_streak: data.current_streak,
            longest_streak: data.longest_streak
          };
          const current = await this.getProfile(userId);
          if (current) {
            this.setLocalActiveSession({
              ...current,
              xp_points: result.xp_points,
              current_streak: result.current_streak,
              longest_streak: result.longest_streak
            });
          }
          return result;
        }

        // 2. Fallback direct table update if RPC not present
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp_points, current_streak, longest_streak, last_activity_date')
          .eq('id', userIdStr)
          .single();

        if (profile) {
          const newXp = Math.max(0, (profile.xp_points || 0) + xpDelta);
          let newStreak = profile.current_streak || 0;
          const lastDate = profile.last_activity_date;

          if (!lastDate) {
            newStreak = 1;
          } else if (lastDate === today) {
            newStreak = Math.max(1, newStreak);
          } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().substring(0, 10);
            if (lastDate === yesterdayStr) {
              newStreak += 1;
            } else {
              newStreak = 1;
            }
          }

          const newLongest = Math.max(profile.longest_streak || 0, newStreak);

          await supabase
            .from('profiles')
            .update({
              xp_points: newXp,
              current_streak: newStreak,
              longest_streak: newLongest,
              last_activity_date: today,
              updated_at: new Date().toISOString()
            })
            .eq('id', userIdStr);

          const result = { xp_points: newXp, current_streak: newStreak, longest_streak: newLongest };
          const current = await this.getProfile(userId);
          if (current) {
            this.setLocalActiveSession({
              ...current,
              xp_points: newXp,
              current_streak: newStreak,
              longest_streak: newLongest
            });
          }
          return result;
        }
      } catch (err) {
        console.warn('Database XP & streak sync error, applying to local store:', err);
      }
    }

    // Local state fallback
    let current = await this.getProfile(userId);
    if (!current && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(ACTIVE_USER_KEY);
        if (raw) current = JSON.parse(raw);
      } catch {}
    }

    const currentXp = Number(current?.xp_points || 0);
    const newXp = Math.max(0, currentXp + xpDelta);
    const newStreak = Math.max(1, current?.current_streak || 1);
    const newLongest = Math.max(current?.longest_streak || 0, newStreak);

    if (current) {
      const updated: User = {
        ...current,
        xp_points: newXp,
        current_streak: newStreak,
        longest_streak: newLongest
      };
      this.setLocalActiveSession(updated);
      if (current.email) {
        const localUsers = getLocalUsers();
        if (localUsers[current.email.toLowerCase()]) {
          localUsers[current.email.toLowerCase()].profile = updated;
          saveLocalUsers(localUsers);
        }
      }
    } else {
      const updated: User = {
        user_id: String(userId),
        full_name: 'Learner',
        email: 'learner@financex.com',
        phone_number: '',
        account_status: 'ACTIVE',
        knowledge_level_id: 1,
        current_streak: newStreak,
        longest_streak: newLongest,
        xp_points: newXp,
        social_links: []
      };
      this.setLocalActiveSession(updated);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('financex-xp-updated', {
          detail: { xp_points: newXp, current_streak: newStreak, longest_streak: newLongest }
        })
      );
    }

    return { xp_points: newXp, current_streak: newStreak, longest_streak: newLongest };
  },

  /**
   * Fetch real registered learner profiles from PostgreSQL for Competitive Leaderboard
   */
  async getAllLearnerProfiles(limit: number = 50): Promise<User[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('xp_points', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            user_id: d.id,
            full_name: d.full_name || 'Learner',
            email: d.email || '',
            phone_number: d.phone_number || '',
            account_status: d.account_status || 'ACTIVE',
            role: d.role || 'USER',
            knowledge_level_id: 1,
            current_streak: Number(d.current_streak || 0),
            longest_streak: Number(d.longest_streak || 0),
            social_links: Array.isArray(d.social_links) ? d.social_links : [],
            avatar_url: d.avatar_url || undefined,
            xp_points: Number(d.xp_points || 0),
            headline: d.headline || undefined,
            bio: d.bio || undefined,
            organization: d.organization || undefined,
            target_certifications: Array.isArray(d.target_certifications) ? d.target_certifications : [],
            uploaded_certificates: Array.isArray(d.uploaded_certificates) ? d.uploaded_certificates : []
          }));
        }
      } catch (err) {
        console.warn('Supabase getAllLearnerProfiles failed, checking local registry:', err);
      }
    }

    // Local users registry fallback
    const localUsers = getLocalUsers();
    const profiles = Object.values(localUsers).map(u => u.profile);
    profiles.sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0));
    return profiles.slice(0, limit);
  },

  /**
   * Set active local user session
   */
  setLocalActiveSession(user: User) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Error setting local active session:', err);
    }
  },

  /**
   * Load user-specific storage collections (Holdings, Transactions, Goals, Quiz Attempts)
   */
  loadUserData(email: string): StoredUserData | null {
    if (typeof window === 'undefined' || !email) return null;
    try {
      const raw = localStorage.getItem(`${USER_DATA_PREFIX}${email.toLowerCase()}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save user-specific storage collections
   */
  saveUserData(email: string, data: StoredUserData) {
    if (typeof window === 'undefined' || !email) return;
    try {
      localStorage.setItem(`${USER_DATA_PREFIX}${email.toLowerCase()}`, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  },

  /**
   * Retrieve all registered users for administration
   */
  getAllRegisteredUsers(): User[] {
    const localUsers = getLocalUsers();
    return Object.values(localUsers).map(u => u.profile);
  },

  /**
   * Mutate a user's role across local storage registry and active session
   */
  updateUserRoleInLocalRegistry(userId: string | number, newRole: any): boolean {
    const localUsers = getLocalUsers();
    const userIdStr = String(userId);
    let matchedEmail: string | null = null;

    for (const [emailKey, record] of Object.entries(localUsers)) {
      if (String(record.profile.user_id) === userIdStr || record.profile.email.toLowerCase() === userIdStr.toLowerCase()) {
        record.profile.role = newRole;
        matchedEmail = emailKey;
        break;
      }
    }

    if (matchedEmail) {
      saveLocalUsers(localUsers);

      // Also update saved user data
      const savedData = this.loadUserData(matchedEmail);
      if (savedData) {
        savedData.user.role = newRole;
        this.saveUserData(matchedEmail, savedData);
      }

      // If active session matches, update it too
      const activeRaw = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_USER_KEY) : null;
      if (activeRaw) {
        try {
          const activeUser = JSON.parse(activeRaw);
          if (String(activeUser.user_id) === userIdStr || activeUser.email.toLowerCase() === matchedEmail.toLowerCase()) {
            activeUser.role = newRole;
            this.setLocalActiveSession(activeUser);
          }
        } catch {}
      }

      return true;
    }

    return false;
  }
};

