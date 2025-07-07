export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserSitesRow = Database['public']['Tables']['sites']['Row'];
export type WidgetRow = Database['public']['Tables']['widgets']['Row'];
export type EventRow = Database['public']['Tables']['events']['Row'];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string | null
          updated_at: string | null
          first_name: string | null
          last_name: string | null
          full_name: string | null
          plan_type: "free" | "growth" | "pro" | null
          billing_cycle: "monthly" | "annual" | null
          subscription_status:
            | "active"
            | "cancelled"
            | "past_due"
            | "trialing"
            | null
          subscription_id: string | null
          customer_id: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          events_used_this_month: number | null
          events_reset_date: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string | null
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          plan_type?: "free" | "growth" | "pro" | null
          billing_cycle?: "monthly" | "annual" | null
          subscription_status?:
            | "active"
            | "cancelled"
            | "past_due"
            | "trialing"
            | null
          subscription_id?: string | null
          customer_id?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          events_used_this_month?: number | null
          events_reset_date?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          plan_type?: "free" | "growth" | "pro" | null
          billing_cycle?: "monthly" | "annual" | null
          subscription_status?:
            | "active"
            | "cancelled"
            | "past_due"
            | "trialing"
            | null
          subscription_id?: string | null
          customer_id?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          events_used_this_month?: number | null
          events_reset_date?: string | null
        }
      }
      sites: {
        Row: {
          id: string
          user_id: string | null
          site_url: string
          api_key: string
          name: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          site_url: string
          api_key?: string
          name?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          site_url?: string
          api_key?: string
          name?: string | null
        }
      }
      widgets: {
        Row: {
          id: string
          type: string
          site_url: string
          site_id: string
          created_at: string | null
          name: string
          description: string | null
          style: Json | null
          api_key: string | null
          href: string | null
        }
        Insert: {
          id?: string
          type: string
          site_url: string
          site_id: string
          created_at?: string | null
          name: string
          description?: string | null
          style?: Json | null
          api_key?: string | null
          href?: string | null
        }
        Update: {
          id?: string
          type?: string
          site_url?: string
          site_id?: string
          created_at?: string | null
          name?: string
          description?: string | null
          style?: Json | null
          api_key?: string | null
          href?: string | null
        }
      }
      events: {
        Row: {
          id: string
          site_id: string | null
          event_type: string
          event_data: {
            city: string;
            name: string;
            message: {value: string, style: string, color: string}[]
          } | null
          timestamp: string | null
          message: string | null
        }
        Insert: {
          id?: string
          site_id?: string | null
          event_type: string
          event_data?: {
            city: string;
            name: string;
            message: {value: string, style: string, color: string}[]
          } | null
          timestamp?: string | null
          message?: string | null
        }
        Update: {
          id?: string
          site_id?: string | null
          event_type?: string
          event_data?: {
            city: string;
            name: string;
            message: {value: string, style: string, color: string}[]
          } | null
          timestamp?: string | null
          message?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_events_used: {
        Args: Record<string, unknown>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}