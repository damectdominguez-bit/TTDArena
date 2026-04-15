import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email, password, options = {}) {
  const emailRedirectTo =
    options.emailRedirectTo ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: options.fullName || "",
        gender: options.gender || "",
        role: "athlete",
      },
    },
  });

  if (error) throw error;

  return data;
}
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}
