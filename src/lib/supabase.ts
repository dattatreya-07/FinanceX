/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables safely across Vite and Node/test environments
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? (process.env as any) : {});

// Production project defaults to ensure continuous connectivity on deployed hosting (Vercel, Netlify, Cloudflare)
const DEFAULT_SUPABASE_URL = 'https://timegqdfnokfzsupawuo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_s28Byh0K1bEstdj3ulKNfw_2SE3wFbU';

const rawUrl = (env?.VITE_SUPABASE_URL || '').replace(/^['"]|['"]$/g, '').trim();
const rawAnonKey = (env?.VITE_SUPABASE_ANON_KEY || env?.VITE_SUPABASE_PUBLISHABLE_KEY || '').replace(/^['"]|['"]$/g, '').trim();

const supabaseUrl = (rawUrl && !rawUrl.includes('your-supabase-project-id')) ? rawUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (rawAnonKey && !rawAnonKey.includes('your-supabase-anon-public-key') && !rawAnonKey.includes('your-supabase-publishable-key')) 
  ? rawAnonKey 
  : DEFAULT_SUPABASE_ANON_KEY;

// Validate credentials
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project-id') && 
  !supabaseAnonKey.includes('your-supabase-anon-public-key') &&
  !supabaseAnonKey.includes('your-supabase-publishable-key')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[FinanceX Backend Warning] Supabase credentials (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY) are missing or set to defaults in .env. FinanceX will operate with local mock data fallbacks until connected.'
  );
} else {
  console.info(`[FinanceX Backend] Active Supabase backend connected: ${supabaseUrl}`);
}

// Fallback dummy values to prevent runtime instantiation errors if unconfigured
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const validKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
