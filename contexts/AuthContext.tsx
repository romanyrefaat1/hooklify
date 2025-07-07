"use client"

import { supabase } from "@/lib/supabase/client";
import { UserRow } from "@/types/supabase-schemas";
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<{
  user: UserRow | null;
  loading: boolean;
  error: Error | null;
  isSignedIn: boolean;
} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRow, setUserRow] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isSignedIn = userRow !== null;

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (authUser) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (userError) throw userError;

          setUserRow(userData);
          setLoading(false);
        } else {
          setUserRow(null);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error getting user:", err);
        setUserRow(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setError(null);

      if (session?.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError) throw userError;

          setUserRow(userData);
        } catch (err: any) {
          console.error("Error on auth state change:", err);
          setError(err);
          setUserRow(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserRow(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: userRow, loading, error, isSignedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used within an AuthProvider");
  return ctx;
};
