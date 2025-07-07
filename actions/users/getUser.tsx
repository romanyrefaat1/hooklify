"use server"

import { supabase } from "@/lib/supabase/client"
import { UserRow } from "@/types/supabase-schemas"

export async function getUser(userId: string): Promise<UserRow | null> {
  // Query your users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (userError) return null

  return userData
}
