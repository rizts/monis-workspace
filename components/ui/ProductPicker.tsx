"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus, Info } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductPickerProps {
  title: string;
  subtitle: string;
  products: Product[];
  selectedId?: string;
  selectedIds?: string[];
  onSelect?: (product: Product) => void;
  onToggle?: (product: Product) => void;
  type: "single" | "multi";
  emptyHint?: string;
}

// Group accessories by category for multi picker
const CATEGORY_LABELS: Record<string, string> = {
  monitor: "🖥 Monitors",
  lamp: "💡 Lighting",
  plant: "🌿 Plants",
  keyboard: "⌨️ Input",
  accessory: "🔌 Accessories",
  storage: "📦 Storage",
};

function groupByCategory(products: Product[]) {
  const groups: Record<string, Product[]> = {};
  for (const p of products) {
    const cat = p.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  }
  return groups;
}

export default function ProductPicker({
  title,
  subtitle,
  products,
  selectedId,
  selectedIds = [],
  onSelect,
  onToggle,
  type,
  emptyHint,
}: ProductPickerProps) {
  const { config } = useWorkspaceStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (type === "single") {
    return (
      <div className="p-4 pt-6 lg:pt-8 lg:pr-6 h-full flex flex-col gap-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl text-charcoal-600 font-semibold">
            {title}
          </h2>
          <p className="text-sm text-charcoal-300 mt-1">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {products.map((product, idx) => {
            const isSelected = selectedId === product.id;
            return (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => onSelect?.(product)}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "product-card text-left relative overflow-hidden",
                  isSelected && "selected"
                )}
              >
                {/* Check badge */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-terra-400 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}

                {/* Featured badge */}
                {product.is_featured && (
                  <div className="absolute top-2.5 left-2.5 z-10 bg-forest-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    ★ Popular
                  </div>
                )}

                {/* Image */}
                <div className="relative h-32 bg-sand-100 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f0e8d5' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c8b07a' font-size='40'%3E${encodeURIComponent(product.emoji)}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="font-medium text-charcoal-500 text-sm leading-snug">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="font-display text-terra-400 font-semibold">
                      {formatCurrency(product.price_per_week)}
                    </span>
                    <span className="text-xs text-charcoal-300">/week</span>
                    <span className="text-charcoal-200 text-xs">·</span>
                    <span className="text-xs text-charcoal-300">
                      {formatCurrency(product.price_per_month)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Multi select (accessories)
  const groups = groupByCategory(products);

  return (
    <div className="p-4 pt-6 lg:pt-8 lg:pr-6 h-full flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl text-charcoal-600 font-semibold">
          {title}
        </h2>
        <p className="text-sm text-charcoal-300 mt-1">{subtitle}</p>
      </div>

      {/* Selected count */}
      {selectedIds.length > 0 && (
        <div className="text-xs text-forest-500 font-medium bg-forest-100 rounded-lg px-3 py-2">
          ✓ {selectedIds.length} accessory{selectedIds.length !== 1 ? "s" : ""} added to your setup
        </div>
      )}

      <div className="space-y-5 overflow-y-auto pb-4 max-h-[calc(100vh-300px)]">
        {Object.entries(groups).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-charcoal-300 uppercase tracking-wider mb-2.5">
              {CATEGORY_LABELS[cat] || cat}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {items.map((product, idx) => {
                const isSelected = selectedIds.includes(product.id);
                const cartItem = config.accessories.find(
                  (a) => a.product.id === product.id
                );

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200",
                      isSelected
                        ? "border-terra-300 bg-terra-100"
                        : "border-sand-100 bg-cream-50 hover:border-sand-200"
                    )}
                    onClick={() => !isSelected && onToggle?.(product)}
                  >
                    {/* Product image small */}
                    <div className="w-14 h-14 rounded-lg bg-sand-100 overflow-hidden shrink-0 relative">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23f0e8d5' width='56' height='56'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c8b07a' font-size='24'%3E${encodeURIComponent(product.emoji)}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-charcoal-500 text-sm leading-tight truncate">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-display text-terra-400 text-sm font-semibold">
                          {formatCurrency(product.price_per_week)}
                        </span>
                        <span className="text-xs text-charcoal-300">/week</span>
                      </div>
                    </div>

                    {/* Add/remove control */}
                    {isSelected && cartItem ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            const store = useWorkspaceStore.getState();
                            if (cartItem.quantity <= 1) store.removeAccessory(product.id);
                            else store.updateAccessoryQty(product.id, cartItem.quantity - 1);
                          }}
                          className="w-7 h-7 rounded-full bg-white border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-charcoal-400" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-charcoal-500">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const store = useWorkspaceStore.getState();
                            store.updateAccessoryQty(product.id, cartItem.quantity + 1);
                          }}
                          className="w-7 h-7 rounded-full bg-terra-400 border border-terra-400 flex items-center justify-center hover:bg-terra-500 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle?.(product);
                        }}
                        className="w-8 h-8 rounded-full bg-sand-100 hover:bg-terra-100 hover:border-terra-300 border border-sand-200 flex items-center justify-center transition-all"
                      >
                        <Plus className="w-4 h-4 text-charcoal-400" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
