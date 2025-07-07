"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createClient()

  // Get current session
  const {
    data: { user: authUser },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !authUser) return null

  const userId = authUser.id

  // Query your users table
  const { data: allSites, error: siteError } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)

  if (siteError) return null

  return allSites
}
