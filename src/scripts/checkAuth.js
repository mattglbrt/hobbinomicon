// src/scripts/checkAuth.js

import { supabase } from "../lib/supabase";

export async function checkAdminAuth() {
  const session = supabase.auth.session();
  if (!session) {
    window.location.href = "/admin/login";  // Redirect to login if no session
  }
}

// Use this script on any admin pages where authentication is needed
