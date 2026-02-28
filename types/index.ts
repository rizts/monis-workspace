export type Category = "desk" | "chair" | "monitor" | "lamp" | "plant" | "accessory" | "keyboard" | "storage";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price_per_week: number;
  price_per_month: number;
  image_url: string;
  description: string;
  emoji: string;
  canvas_position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    z_index: number;
  };
  is_base?: boolean; // desk and chair are base required items
  is_featured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WorkspaceConfig {
  desk: Product | null;
  chair: Product | null;
  accessories: CartItem[];
}

export type RentalPeriod = "1_week" | "2_weeks" | "1_month" | "3_months" | "6_months";

export interface RentalPeriodOption {
  value: RentalPeriod;
  label: string;
  weeks: number;
  discount?: number;
}

export interface Order {
  id?: string;
  user_id?: string;
  workspace_config: WorkspaceConfig;
  rental_period: RentalPeriod;
  start_date: string;
  delivery_address: string;
  total_price: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  contact_name: string;
  contact_email: string;
  contact_whatsapp: string;
  notes?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}
