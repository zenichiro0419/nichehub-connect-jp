
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vhdermocoaeuuzmcbryb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZGVybW9jb2FldXV6bWNicnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTc3OTEsImV4cCI6MjA1OTc3Mzc5MX0.2Ne156r6Hubi0RnRHmMxVRupBy9Xxd-725nM56oU8YI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
