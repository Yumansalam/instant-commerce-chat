export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          items: Json
          status: string
          total_amount: number
          whatsapp_message: string | null
        }
        Insert: {
          created_at?: string
          currency: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items: Json
          status?: string
          total_amount: number
          whatsapp_message?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          status?: string
          total_amount?: number
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          price: number
          store_owner_id: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          price: number
          store_owner_id: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          price?: number
          store_owner_id?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_store_owner_id_fkey"
            columns: ["store_owner_id"]
            isOneToOne: false
            referencedRelation: "store_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          profile_picture_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_owners: {
        Row: {
          business_name: string
          created_at: string
          currency: string
          email: string
          id: string
          logo_url: string | null
          profile_id: string | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          business_name?: string
          created_at?: string
          currency?: string
          email: string
          id?: string
          logo_url?: string | null
          profile_id?: string | null
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          business_name?: string
          created_at?: string
          currency?: string
          email?: string
          id?: string
          logo_url?: string | null
          profile_id?: string | null
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_owners_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
