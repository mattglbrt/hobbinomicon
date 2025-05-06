// src/lib/check-auth.ts

import { supabase } from "./supabase";

export async function checkAdminAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "/admin/login";
  }
}
