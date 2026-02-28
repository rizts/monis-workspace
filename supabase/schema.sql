-- ============================================================
-- monis.rent Workspace Builder — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id text primary key default uuid_generate_v4()::text,
  name text not null,
  category text not null check (category in ('desk', 'chair', 'monitor', 'lamp', 'plant', 'accessory', 'keyboard', 'storage')),
  price_per_week numeric(10,2) not null default 0,
  price_per_month numeric(10,2) not null default 0,
  image_url text not null default '',
  description text not null default '',
  emoji text not null default '📦',
  canvas_position jsonb default null,
  is_base boolean not null default false,
  is_featured boolean not null default false,
  metadata jsonb default null,
  created_at timestamptz not null default now()
);

-- RLS
alter table products enable row level security;
create policy "Products are publicly readable" on products
  for select using (true);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  workspace_config jsonb not null,
  rental_period text not null check (rental_period in ('1_week', '2_weeks', '1_month', '3_months', '6_months')),
  start_date date not null,
  delivery_address text not null,
  total_price numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  contact_name text not null,
  contact_email text not null,
  contact_whatsapp text not null,
  notes text default null,
  created_at timestamptz not null default now()
);

-- RLS
alter table orders enable row level security;

-- Authenticated users can see their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Anyone can insert (guest checkout supported)
create policy "Anyone can create orders" on orders
  for insert with check (true);

-- Users can update their own orders
create policy "Users can update own orders" on orders
  for update using (auth.uid() = user_id);

-- ============================================================
-- USER PROFILES TABLE
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  whatsapp text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SEED PRODUCTS (from monis.rent real catalog)
-- ============================================================
insert into products (id, name, category, price_per_week, price_per_month, image_url, description, emoji, canvas_position, is_base, is_featured) values

-- DESKS
('desk-electric', 'Electric Standing Desk', 'desk', 5, 15,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Electric height adjustment (70–118cm), smooth quiet motor, spacious tabletop.',
  '⚡', '{"x":50,"y":45,"width":420,"height":160,"z_index":10}', true, true),

('desk-mechanical', 'Mechanical Adjustable Desk', 'desk', 4, 12,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecbbe26ecabb29020807_Mechanical_Adjustable_Desk_front_new_a83b8077b0.jpeg',
  'Manual height adjustment, solid wooden top, clean minimal design.',
  '🪵', '{"x":50,"y":45,"width":420,"height":160,"z_index":10}', true, false),

('desk-compact', 'Compact Work Desk', 'desk', 3, 9,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Space-saving design, perfect for studio apartments in Bali.',
  '🗂', '{"x":80,"y":48,"width":350,"height":140,"z_index":10}', true, false),

-- CHAIRS
('chair-ergonomic', 'Ergonomic Office Chair', 'chair', 6, 18,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg',
  'Breathable mesh back, 4D armrests, adjustable lumbar support.',
  '🪑', '{"x":200,"y":190,"width":120,"height":160,"z_index":20}', true, true),

('chair-gaming', 'Racing Gaming Chair', 'chair', 7, 22,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg',
  'High-back racing style, lumbar pillow, neck cushion.',
  '🎮', '{"x":200,"y":190,"width":120,"height":160,"z_index":20}', true, false),

('chair-executive', 'Executive Leather Chair', 'chair', 9, 28,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg',
  'Premium faux leather, high back with integrated headrest.',
  '👔', '{"x":200,"y":190,"width":120,"height":160,"z_index":20}', true, false),

-- MONITORS
('monitor-24-fhd', '24" Full HD Monitor', 'monitor', 5, 15,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ea6c097ce9fb569b8c0c_24_Full_HD_Office_Monitor_A24i_1_7f987306af.jpeg',
  'Xiaomi 24" IPS, 100Hz, 1920×1080 FHD, 99% sRGB.',
  '🖥', '{"x":155,"y":20,"width":120,"height":90,"z_index":15}', false, true),

('monitor-27-4k', '27" 4K Monitor', 'monitor', 13, 40,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec4533734dcd2eaea2ea_27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpeg',
  '4K UHD, HDR, USB-C 96W charging, IPS panel.',
  '✨', '{"x":140,"y":15,"width":140,"height":100,"z_index":15}', false, true),

('monitor-27-studio', '27" Apple Studio Display', 'monitor', 75, 220,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec53811330983bf8ee38_Apple_Studio_Display_6_94c6329a05.jpeg',
  '5K Retina, 600 nits, 12MP camera, Thunderbolt 3.',
  '🍎', '{"x":140,"y":10,"width":145,"height":105,"z_index":15}', false, false),

('monitor-34-ultrawide', '34" Ultrawide Curved', 'monitor', 19, 58,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec7036de3b9f5b107126_34_4_K_Ultra_Wide_Curved_Monitor_front_3636b63aed.jpeg',
  'WQHD 3440×1440, 144Hz, curved, ultrawide.',
  '🌊', '{"x":115,"y":15,"width":190,"height":110,"z_index":15}', false, false),

-- ACCESSORIES
('lamp-desk', 'LED Desk Lamp', 'lamp', 2, 6,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Adjustable color temp, USB charging port, touch dimmer.',
  '💡', '{"x":380,"y":40,"width":50,"height":100,"z_index":16}', false, false),

('lamp-floor', 'Arc Floor Lamp', 'lamp', 3, 9,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Warm ambient light, modern arch design, dimmer switch.',
  '🌟', '{"x":420,"y":0,"width":60,"height":220,"z_index":5}', false, false),

('plant-small', 'Mini Tropical Plant', 'plant', 1, 3,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Cute succulent or pothos, low maintenance, Bali-grown.',
  '🌱', '{"x":50,"y":55,"width":45,"height":60,"z_index":16}', false, false),

('plant-large', 'Large Monstera', 'plant', 3, 9,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Statement tropical plant, adds Bali jungle vibes.',
  '🌿', '{"x":0,"y":120,"width":80,"height":180,"z_index":5}', false, false),

('keyboard-mech', 'Mechanical Keyboard', 'keyboard', 4, 12,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Tactile switches, compact TKL layout, USB-C.',
  '⌨️', '{"x":150,"y":145,"width":140,"height":50,"z_index":16}', false, false),

('docking-station', 'USB-C Docking Station', 'accessory', 4, 12,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  '12-in-1 hub, 4K HDMI, USB-A/C, SD card, Ethernet.',
  '🔌', '{"x":360,"y":135,"width":60,"height":40,"z_index":16}', false, false),

('storage-drawer', 'Desk Organizer & Drawer', 'storage', 2, 6,
  'https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg',
  'Under-desk drawers + desktop organizer tray.',
  '📦', '{"x":390,"y":155,"width":55,"height":45,"z_index":16}', false, false)

on conflict (id) do nothing;
