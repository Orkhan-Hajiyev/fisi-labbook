import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigMissing = !supabaseUrl || !supabaseAnonKey;

export const supabase = supabaseConfigMissing
  ? null
  : createClient(supabaseUrl!, supabaseAnonKey!);
