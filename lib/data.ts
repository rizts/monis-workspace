import type { Product, RentalPeriodOption } from "@/types";

export const RENTAL_PERIODS: RentalPeriodOption[] = [
  { value: "1_week", label: "1 Week", weeks: 1 },
  { value: "2_weeks", label: "2 Weeks", weeks: 2, discount: 5 },
  { value: "1_month", label: "1 Month", weeks: 4, discount: 10 },
  { value: "3_months", label: "3 Months", weeks: 13, discount: 20 },
  { value: "6_months", label: "6 Months", weeks: 26, discount: 30 },
];

export const MOCK_PRODUCTS: Product[] = [
  // DESKS
  {
    id: "desk-electric",
    name: "Electric Standing Desk",
    category: "desk",
    price_per_week: 5,
    price_per_month: 15,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Electric height adjustment (70–118cm), smooth quiet motor, spacious tabletop. Perfect sit-stand setup.",
    emoji: "🖥",
    is_base: true,
    is_featured: true,
    canvas_position: { x: 50, y: 45, width: 420, height: 160, z_index: 10 },
  },
  {
    id: "desk-mechanical",
    name: "Mechanical Adjustable Desk",
    category: "desk",
    price_per_week: 4,
    price_per_month: 12,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecbbe26ecabb29020807_Mechanical_Adjustable_Desk_front_new_a83b8077b0.jpeg",
    description: "Manual height adjustment, solid wooden top, clean minimal design.",
    emoji: "📋",
    is_base: true,
    canvas_position: { x: 50, y: 45, width: 420, height: 160, z_index: 10 },
  },
  {
    id: "desk-compact",
    name: "Compact Work Desk",
    category: "desk",
    price_per_week: 3,
    price_per_month: 9,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Space-saving design, perfect for studio apartments in Bali. Clean lines, bamboo finish.",
    emoji: "🗂",
    is_base: true,
    canvas_position: { x: 80, y: 48, width: 350, height: 140, z_index: 10 },
  },

  // CHAIRS
  {
    id: "chair-ergonomic",
    name: "Ergonomic Office Chair",
    category: "chair",
    price_per_week: 6,
    price_per_month: 18,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg",
    description: "Breathable mesh back, 4D armrests, adjustable lumbar support, reclining backrest.",
    emoji: "🪑",
    is_base: true,
    is_featured: true,
    canvas_position: { x: 200, y: 190, width: 120, height: 160, z_index: 20 },
  },
  {
    id: "chair-gaming",
    name: "Racing Gaming Chair",
    category: "chair",
    price_per_week: 7,
    price_per_month: 22,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg",
    description: "High-back racing style, lumbar pillow, neck cushion, wide recline range.",
    emoji: "🎮",
    is_base: true,
    canvas_position: { x: 200, y: 190, width: 120, height: 160, z_index: 20 },
  },
  {
    id: "chair-executive",
    name: "Executive Leather Chair",
    category: "chair",
    price_per_week: 9,
    price_per_month: 28,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863eca419dead1343bef567_fantech_oca259s_chair_6_b632a0c529.jpeg",
    description: "Premium faux leather, high back with integrated headrest, premium feel.",
    emoji: "👔",
    is_base: true,
    canvas_position: { x: 200, y: 190, width: 120, height: 160, z_index: 20 },
  },

  // MONITORS
  {
    id: "monitor-24-fhd",
    name: "24\" Full HD Monitor",
    category: "monitor",
    price_per_week: 5,
    price_per_month: 15,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ea6c097ce9fb569b8c0c_24_Full_HD_Office_Monitor_A24i_1_7f987306af.jpeg",
    description: "Xiaomi 24\" IPS, 100Hz, 1920×1080 FHD, 99% sRGB",
    emoji: "🖥",
    canvas_position: { x: 155, y: 20, width: 120, height: 90, z_index: 15 },
  },
  {
    id: "monitor-27-4k",
    name: "27\" 4K Monitor",
    category: "monitor",
    price_per_week: 13,
    price_per_month: 40,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec4533734dcd2eaea2ea_27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpeg",
    description: "4K UHD, HDR, USB-C 96W charging, IPS panel",
    emoji: "🖥",
    canvas_position: { x: 140, y: 15, width: 140, height: 100, z_index: 15 },
  },
  {
    id: "monitor-27-studio",
    name: "27\" Apple Studio Display",
    category: "monitor",
    price_per_week: 75,
    price_per_month: 220,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec53811330983bf8ee38_Apple_Studio_Display_6_94c6329a05.jpeg",
    description: "5K Retina, 600 nits, 12MP camera, Thunderbolt 3",
    emoji: "🍎",
    canvas_position: { x: 140, y: 10, width: 145, height: 105, z_index: 15 },
  },
  {
    id: "monitor-34-ultrawide",
    name: "34\" Ultrawide Curved",
    category: "monitor",
    price_per_week: 19,
    price_per_month: 58,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ec7036de3b9f5b107126_34_4_K_Ultra_Wide_Curved_Monitor_front_3636b63aed.jpeg",
    description: "WQHD 3440×1440, 144Hz, curved, ultrawide immersive",
    emoji: "🌊",
    canvas_position: { x: 115, y: 15, width: 190, height: 110, z_index: 15 },
  },

  // LAMPS
  {
    id: "lamp-desk",
    name: "LED Desk Lamp",
    category: "lamp",
    price_per_week: 2,
    price_per_month: 6,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Adjustable color temp, USB charging port, touch dimmer",
    emoji: "💡",
    canvas_position: { x: 380, y: 40, width: 50, height: 100, z_index: 16 },
  },
  {
    id: "lamp-floor",
    name: "Arc Floor Lamp",
    category: "lamp",
    price_per_week: 3,
    price_per_month: 9,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Warm ambient light, modern arch design, dimmer switch",
    emoji: "🌟",
    canvas_position: { x: 420, y: 0, width: 60, height: 220, z_index: 5 },
  },

  // PLANTS
  {
    id: "plant-small",
    name: "Mini Tropical Plant",
    category: "plant",
    price_per_week: 1,
    price_per_month: 3,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Cute succulent or pothos, low maintenance, Bali-grown",
    emoji: "🌱",
    canvas_position: { x: 50, y: 55, width: 45, height: 60, z_index: 16 },
  },
  {
    id: "plant-large",
    name: "Large Monstera",
    category: "plant",
    price_per_week: 3,
    price_per_month: 9,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Statement tropical plant, adds Bali jungle vibes",
    emoji: "🌿",
    canvas_position: { x: 0, y: 120, width: 80, height: 180, z_index: 5 },
  },

  // KEYBOARD/ACCESSORIES
  {
    id: "keyboard-mech",
    name: "Mechanical Keyboard",
    category: "keyboard",
    price_per_week: 4,
    price_per_month: 12,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Tactile switches, compact TKL layout, USB-C",
    emoji: "⌨️",
    canvas_position: { x: 150, y: 145, width: 140, height: 50, z_index: 16 },
  },
  {
    id: "docking-station",
    name: "USB-C Docking Station",
    category: "accessory",
    price_per_week: 4,
    price_per_month: 12,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "12-in-1 hub, 4K HDMI, USB-A/C, SD card, Ethernet",
    emoji: "🔌",
    canvas_position: { x: 360, y: 135, width: 60, height: 40, z_index: 16 },
  },
  {
    id: "storage-drawer",
    name: "Desk Organizer & Drawer",
    category: "storage",
    price_per_week: 2,
    price_per_month: 6,
    image_url: "https://cdn.prod.website-files.com/62ec28c28759bdba5015b899/6863ecb375f9b740888dd0d6_desk_titel_new_3db151d44c.jpeg",
    description: "Under-desk drawers + desktop organizer tray",
    emoji: "📦",
    canvas_position: { x: 390, y: 155, width: 55, height: 45, z_index: 16 },
  },
];

export function calculateTotal(
  desk: Product | null,
  chair: Product | null,
  accessories: { product: Product; quantity: number }[],
  rentalWeeks: number,
  discount: number = 0
): number {
  const baseWeekly =
    (desk?.price_per_week || 0) +
    (chair?.price_per_week || 0) +
    accessories.reduce((sum, item) => sum + item.product.price_per_week * item.quantity, 0);

  const total = baseWeekly * rentalWeeks;
  return Math.round(total * (1 - discount / 100) * 100) / 100;
}
