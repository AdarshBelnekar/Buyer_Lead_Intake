import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a single Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
