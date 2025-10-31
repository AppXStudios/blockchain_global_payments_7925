import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "https://mnmbauwakbkubwvgdwzs.supabase.co";
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWJhdXdha2JrdWJ3dmdkd3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjQxODQsImV4cCI6MjA3NzQ0MDE4NH0.bb1wcQDtQrzknle-gwGeKI3NqicZ7v3lSArQAqOMJZo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);