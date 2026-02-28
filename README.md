# Monis — Workspace Builder

> An interactive configurator where digital nomads and remote workers visually build their perfect office setup and submit a rental request — all delivered to their door.

![Preview](./public/og-image.jpg)

## ✨ Features

- **Visual Workspace Builder** — SVG-based isometric workspace that updates in real-time as you pick items
- **3-Step Flow** — Desk → Chair → Accessories → Review & Rent
- **Product Catalog** — Real monis.rent products (desks, chairs, monitors, lamps, plants, keyboards, etc.)
- **Smart Cart** — Quantity controls, instant price calculation, rental period selection
- **5 Rental Periods** — 1 week, 2 weeks, 1 month, 3 months, 6 months with progressive discounts
- **Checkout Flow** — Full form with validation, delivery details, WhatsApp contact
- **Auth** — Supabase Auth with Google OAuth + Magic Link email
- **Database** — Orders saved to Supabase (with graceful mock fallback)
- **Persistent Config** — localStorage via Zustand persist

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** (App Router) | Framework |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Zustand** | State management |
| **Supabase** | Auth + PostgreSQL DB |
| **Vercel** | Deployment |

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/rizts/monis-workspace
cd monis-workspace
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `/supabase/schema.sql`
3. In **Authentication → Providers**, enable:
   - Email (for magic links)
4. In **Authentication → URL Configuration**, add:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URL: `https://your-domain.vercel.app/auth/callback`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo in the Vercel dashboard. Add env variables in **Project → Settings → Environment Variables**.

## 🗄 Database Schema

The app uses 3 tables:

### `products`
Stores all rentable items. Pre-seeded with real monis.rent catalog.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Unique product slug |
| name | text | Display name |
| category | enum | desk, chair, monitor, lamp, plant, keyboard, accessory, storage |
| price_per_week | numeric | Weekly rental price in USD |
| price_per_month | numeric | Monthly rental price in USD |
| image_url | text | Product image |
| emoji | text | Fallback emoji icon |
| canvas_position | jsonb | Position hints for the visual canvas |
| is_base | boolean | True for desk/chair (required items) |
| is_featured | boolean | True for Popular badge |

### `orders`
All rental requests, linked to authenticated users or as guest.

### `profiles`
Auto-created on signup via trigger, stores user metadata.

## 🎨 Design System

**Palette:** Warm cream, sand, terracotta, forest green, deep charcoal  
**Fonts:** Fraunces (display/headings) + DM Sans (body)  
**Vibe:** Bali tropical minimal — warm, organic, inviting

## 🏗 Project Structure

```
monis-workspace-builder/
├── app/
│   ├── layout.tsx           # Root layout with fonts + Toaster
│   ├── page.tsx             # Redirects to /configure
│   ├── configure/
│   │   └── page.tsx         # Main configurator page
│   ├── api/
│   │   ├── products/route.ts # Products API (Supabase + mock fallback)
│   │   └── orders/route.ts   # Orders API
│   └── auth/
│       └── callback/route.ts # OAuth callback
├── components/
│   ├── canvas/
│   │   └── WorkspaceCanvas.tsx  # SVG isometric workspace preview
│   ├── layout/
│   │   ├── ConfiguratorLayout.tsx  # Main orchestrator
│   │   └── TopNav.tsx
│   └── ui/
│       ├── StepBar.tsx          # Progress bar + navigation
│       ├── ProductPicker.tsx    # Single/multi product selection
│       ├── CartSummary.tsx      # Review + price breakdown
│       ├── CheckoutModal.tsx    # Order form + success state
│       └── AuthModal.tsx        # Login/signup modal
├── lib/
│   ├── data.ts              # Mock products + rental periods + price calc
│   ├── store.ts             # Zustand workspace state
│   ├── supabase.ts          # Supabase browser client
│   ├── supabase-server.ts   # Supabase server client (SSR)
│   └── utils.ts             # cn(), formatCurrency()
├── supabase/
│   └── schema.sql           # Full DB schema + seed data
├── types/
│   └── index.ts             # TypeScript types
└── tailwind.config.ts       # Custom design tokens
```

## 🔧 Customization

### Adding Products
Add to `lib/data.ts` → `MOCK_PRODUCTS` array, or insert directly into Supabase `products` table.

### Canvas Visual
The isometric workspace is in `components/canvas/WorkspaceCanvas.tsx`. Each item is a pure SVG component. Extend by adding new item renderers.

### Pricing
Rental periods and discounts are in `lib/data.ts` → `RENTAL_PERIODS`.

---