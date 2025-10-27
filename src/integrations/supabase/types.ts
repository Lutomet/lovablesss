export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_management: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_trial: boolean
          max_accounts: number
          max_channel_names: number
          trial_claimed_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_trial?: boolean
          max_accounts?: number
          max_channel_names?: number
          trial_claimed_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_trial?: boolean
          max_accounts?: number
          max_channel_names?: number
          trial_claimed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          active: boolean
          avatar_url: string | null
          channel_ids: number[]
          channel_name: string | null
          created_at: string
          dm_reply: string | null
          guild_id: string | null
          id: string
          interval: number
          last_sent: string | null
          message: string
          messages_sent: number
          token_valid: boolean
          updated_at: string
          user_id: string
          user_token: string
          username: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          channel_ids?: number[]
          channel_name?: string | null
          created_at?: string
          dm_reply?: string | null
          guild_id?: string | null
          id?: string
          interval?: number
          last_sent?: string | null
          message: string
          messages_sent?: number
          token_valid?: boolean
          updated_at?: string
          user_id: string
          user_token: string
          username: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          channel_ids?: number[]
          channel_name?: string | null
          created_at?: string
          dm_reply?: string | null
          guild_id?: string | null
          id?: string
          interval?: number
          last_sent?: string | null
          message?: string
          messages_sent?: number
          token_valid?: boolean
          updated_at?: string
          user_id?: string
          user_token?: string
          username?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          account_id: string
          created_at: string
          details: string
          error_type: string
          id: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          details: string
          error_type: string
          id?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          details?: string
          error_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          account_id: string
          channel_id: number
          created_at: string
          error: string | null
          id: string
          message: string
          message_id: number | null
          success: boolean
          user_id: string
        }
        Insert: {
          account_id: string
          channel_id: number
          created_at?: string
          error?: string | null
          id?: string
          message: string
          message_id?: number | null
          success: boolean
          user_id: string
        }
        Update: {
          account_id?: string
          channel_id?: number
          created_at?: string
          error?: string | null
          id?: string
          message?: string
          message_id?: number | null
          success?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          id: string
          last_update: string
          today_count: number
          total_count: number
          user_id: string
          week_count: number
        }
        Insert: {
          id?: string
          last_update?: string
          today_count?: number
          total_count?: number
          user_id: string
          week_count?: number
        }
        Update: {
          id?: string
          last_update?: string
          today_count?: number
          total_count?: number
          user_id?: string
          week_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
