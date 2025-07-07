"use server"

import { createClient } from "@/lib/supabase/server"
import { UserRow } from "@/types/supabase-schemas"

export async function getCurrentUser(): Promise<UserRow | null> {
  const supabase = await createClient()

  // Get current session
  const {
    data: { user: authUser },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !authUser) return null

  const userId = authUser.id

  // Query your users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (userError) return null

  return userData
}
