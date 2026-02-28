import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { MOCK_PRODUCTS } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Try Supabase first, fall back to mock data
  try {
    const supabase = createSupabaseServerClient();
    let query = supabase.from("products").select("*").order("price_per_week");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (data && data.length > 0) {
      return NextResponse.json({ products: data });
    }
  } catch (err) {
    console.warn("Supabase unavailable, using mock data:", err);
  }

  // Fall back to mock data
  const filtered = category
    ? MOCK_PRODUCTS.filter((p) => p.category === category)
    : MOCK_PRODUCTS;

  return NextResponse.json({ products: filtered });
}
