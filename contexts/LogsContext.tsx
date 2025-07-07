"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useUserSites } from "./UserSites";
import { EventRow } from "@/types/supabase-schemas";

interface LogsContextValue {
  logs: EventRow[];
}

const LogsContext = createContext<LogsContextValue>({ logs: [] });

export const LogsProvider = ({ children }: { children: React.ReactNode }) => {
  const { sites } = useUserSites();

  // Flatten all events from all sites and sort globally by timestamp (newest to oldest)
  const logs = useMemo(() => {
    const allEvents = sites.flatMap(site => site.events || []);
    return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sites]);

  return (
    <LogsContext.Provider value={{ logs }}>
      {children}
    </LogsContext.Provider>
  );
};

// Custom hook to get logs, optionally limiting the number returned
export function useLogs(limit?: number): { logs: EventRow[] } {
  const { logs } = useContext(LogsContext);
  if (typeof limit === "number") {
    return { logs: logs.slice(0, limit) };
  }
  return { logs };
}
