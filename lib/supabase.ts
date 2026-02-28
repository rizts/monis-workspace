import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price_per_week: number;
          price_per_month: number;
          image_url: string;
          description: string;
          emoji: string;
          canvas_position: Record<string, number> | null;
          is_base: boolean;
          is_featured: boolean;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          workspace_config: Record<string, unknown>;
          rental_period: string;
          start_date: string;
          delivery_address: string;
          total_price: number;
          status: string;
          contact_name: string;
          contact_email: string;
          contact_whatsapp: string;
          notes: string | null;
          created_at: string;
        };
      };
    };
  };
};
