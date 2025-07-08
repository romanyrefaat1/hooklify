'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { WidgetRow } from '@/types/supabase-schemas';
import { supabase } from '@/lib/supabase/client';

// Type definitions
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface SiteWidgetsContextType {
  widgets: WidgetRow[]
  loading: boolean
  error: string | null
  siteId: string | null
  refetch: () => Promise<void>
}

// Context
const SiteWidgetsContext = createContext<SiteWidgetsContextType | undefined>(undefined);

// Provider component
interface SiteWidgetsProviderProps {
  children: ReactNode
}

export function SiteWidgetsProvider({ children }: SiteWidgetsProviderProps) {
  const [widgets, setWidgets] = useState<WidgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  // Extract siteId from pathname (split by '/' and take index 2)
  const siteId = pathname ? pathname.split('/')[2] || null : null;

  // Fetch widgets function
  const fetchWidgets = async () => {
    if (!siteId) {
      setWidgets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('widgets')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setWidgets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWidgets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch widgets when siteId changes
  useEffect(() => {
    fetchWidgets();
  }, [siteId]);

  // Refetch function for manual refresh
  const refetch = async () => {
    await fetchWidgets();
  };

  const value: SiteWidgetsContextType = {
    widgets,
    loading,
    error,
    siteId,
    refetch,
  };

  return (
    <SiteWidgetsContext.Provider value={value}>
      {children}
    </SiteWidgetsContext.Provider>
  );
}

// Custom hook to use the context
export function useSiteWidgets() {
  const context = useContext(SiteWidgetsContext);
  if (context === undefined) {
    throw new Error('useSiteWidgets must be used within a SiteWidgetsProvider');
  }
  return context;
}