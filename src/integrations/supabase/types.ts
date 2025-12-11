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
      chat_history: {
        Row: {
          chat_type: string
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          chat_type: string
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          chat_type?: string
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      chennai_areas: {
        Row: {
          id: string
          latitude: number
          longitude: number
          name: string
          zone: string
        }
        Insert: {
          id?: string
          latitude: number
          longitude: number
          name: string
          zone: string
        }
        Update: {
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          zone?: string
        }
        Relationships: []
      }
      congestion_data: {
        Row: {
          area_id: string
          congestion_level: string
          current_speed: number | null
          id: string
          prediction_10min: string | null
          prediction_1hr: string | null
          prediction_2hr: string | null
          prediction_30min: string | null
          prediction_3hr: string | null
          reason: string | null
          recorded_at: string | null
          vehicle_density: number | null
        }
        Insert: {
          area_id: string
          congestion_level: string
          current_speed?: number | null
          id?: string
          prediction_10min?: string | null
          prediction_1hr?: string | null
          prediction_2hr?: string | null
          prediction_30min?: string | null
          prediction_3hr?: string | null
          reason?: string | null
          recorded_at?: string | null
          vehicle_density?: number | null
        }
        Update: {
          area_id?: string
          congestion_level?: string
          current_speed?: number | null
          id?: string
          prediction_10min?: string | null
          prediction_1hr?: string | null
          prediction_2hr?: string | null
          prediction_30min?: string | null
          prediction_3hr?: string | null
          reason?: string | null
          recorded_at?: string | null
          vehicle_density?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "congestion_data_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "chennai_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      route_analytics: {
        Row: {
          avg_speed: number | null
          congestion_frequency: number | null
          created_at: string | null
          date: string
          hour: number
          id: string
          prediction_accuracy: number | null
          route_id: string
          weather_condition: string | null
        }
        Insert: {
          avg_speed?: number | null
          congestion_frequency?: number | null
          created_at?: string | null
          date: string
          hour: number
          id?: string
          prediction_accuracy?: number | null
          route_id: string
          weather_condition?: string | null
        }
        Update: {
          avg_speed?: number | null
          congestion_frequency?: number | null
          created_at?: string | null
          date?: string
          hour?: number
          id?: string
          prediction_accuracy?: number | null
          route_id?: string
          weather_condition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_analytics_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          distance_km: number | null
          end_area_id: string | null
          estimated_time_mins: number | null
          id: string
          name: string
          path_coordinates: Json | null
          start_area_id: string | null
        }
        Insert: {
          distance_km?: number | null
          end_area_id?: string | null
          estimated_time_mins?: number | null
          id?: string
          name: string
          path_coordinates?: Json | null
          start_area_id?: string | null
        }
        Update: {
          distance_km?: number | null
          end_area_id?: string | null
          estimated_time_mins?: number | null
          id?: string
          name?: string
          path_coordinates?: Json | null
          start_area_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_end_area_id_fkey"
            columns: ["end_area_id"]
            isOneToOne: false
            referencedRelation: "chennai_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_start_area_id_fkey"
            columns: ["start_area_id"]
            isOneToOne: false
            referencedRelation: "chennai_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "citizen" | "authority"
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
    Enums: {
      user_role: ["citizen", "authority"],
    },
  },
} as const
