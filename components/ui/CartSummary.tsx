"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { RENTAL_PERIODS } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";
import type { RentalPeriod } from "@/types";

interface CartSummaryProps {
  onCheckout: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const {
    config,
    rentalPeriod,
    setRentalPeriod,
    setDesk,
    setChair,
    removeAccessory,
    updateAccessoryQty,
    getTotalPrice,
    getWeeklyPrice,
    setStep,
  } = useWorkspaceStore();

  const { desk, chair, accessories } = config;
  const totalPrice = getTotalPrice();
  const weeklyPrice = getWeeklyPrice();
  const selectedPeriod = RENTAL_PERIODS.find((p) => p.value === rentalPeriod)!;

  const allItems = [
    ...(desk ? [{ product: desk, quantity: 1, type: "desk" as const }] : []),
    ...(chair ? [{ product: chair, quantity: 1, type: "chair" as const }] : []),
    ...accessories.map((a) => ({ ...a, type: "accessory" as const })),
  ];

  return (
    <div className="p-4 pt-6 lg:pt-8 lg:pr-6 flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl text-charcoal-600 font-semibold">
          Your setup
        </h2>
        <p className="text-sm text-charcoal-300 mt-1">
          Review your configuration before renting
        </p>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {allItems.length === 0 && (
          <div className="text-sm text-charcoal-300 py-4 text-center">
            No items yet.{" "}
            <button onClick={() => setStep(0)} className="text-terra-400 underline">
              Start building
            </button>
          </div>
        )}
        {allItems.map((item, idx) => (
          <motion.div
            key={item.product.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-3 bg-cream-50 rounded-xl border border-sand-100 p-3"
          >
            {/* Image */}
            <div className="w-12 h-12 rounded-lg bg-sand-100 overflow-hidden relative shrink-0">
              <Image
                src={item.product.image_url}
                alt={item.product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23f0e8d5' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3E${encodeURIComponent(item.product.emoji)}%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-charcoal-500 truncate">
                {item.product.name}
              </div>
              <div className="text-xs text-charcoal-300 capitalize">{item.product.category}</div>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold font-display text-charcoal-500">
                {formatCurrency(item.product.price_per_week * item.quantity)}
                <span className="font-body font-normal text-xs text-charcoal-300">/wk</span>
              </div>
            </div>

            {/* Controls */}
            {item.type === "accessory" ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => {
                    if (item.quantity <= 1) removeAccessory(item.product.id);
                    else updateAccessoryQty(item.product.id, item.quantity - 1);
                  }}
                  className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="w-3 h-3 text-charcoal-400" />
                  ) : (
                    <Minus className="w-3 h-3 text-charcoal-400" />
                  )}
                </button>
                <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateAccessoryQty(item.product.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
                >
                  <Plus className="w-3 h-3 text-charcoal-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (item.type === "desk") { setDesk(null); setStep(0); }
                  if (item.type === "chair") { setChair(null); setStep(1); }
                }}
                className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors ml-1"
              >
                <X className="w-3 h-3 text-charcoal-400" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Rental period */}
      <div>
        <div className="text-sm font-semibold text-charcoal-500 mb-2">Rental Period</div>
        <div className="grid grid-cols-5 gap-1.5">
          {RENTAL_PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setRentalPeriod(period.value as RentalPeriod)}
              className={cn(
                "rounded-xl py-2 px-1 text-center transition-all duration-200 border-2 text-xs",
                rentalPeriod === period.value
                  ? "border-terra-400 bg-terra-100 text-terra-500 font-semibold"
                  : "border-sand-100 bg-cream-50 text-charcoal-400 hover:border-sand-200"
              )}
            >
              <div className="font-medium">{period.label}</div>
              {period.discount && (
                <div className="text-[10px] text-forest-500 font-semibold mt-0.5">
                  -{period.discount}%
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-charcoal-500 rounded-2xl p-4 text-cream-100 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-200">Weekly rate</span>
          <span className="font-medium">{formatCurrency(weeklyPrice)}/wk</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-200">Duration</span>
          <span className="font-medium">{selectedPeriod.label}</span>
        </div>
        {selectedPeriod.discount && (
          <div className="flex justify-between text-sm">
            <span className="text-forest-300">Discount</span>
            <span className="text-forest-300 font-medium">-{selectedPeriod.discount}%</span>
          </div>
        )}
        <div className="pt-2 border-t border-charcoal-400 flex justify-between items-baseline">
          <span className="font-semibold">Total</span>
          <div className="text-right">
            <span className="font-display text-2xl font-semibold text-cream-100">
              {formatCurrency(totalPrice)}
            </span>
            <span className="text-charcoal-300 text-sm ml-1">
              for {selectedPeriod.label.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onCheckout}
        disabled={!desk || !chair}
        className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-terra"
      >
        <span>🎉</span>
        <span>Rent This Setup</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {!desk && (
        <p className="text-xs text-charcoal-300 text-center -mt-3">
          Please{" "}
          <button onClick={() => setStep(0)} className="text-terra-400 underline">
            select a desk
          </button>{" "}
          and{" "}
          <button onClick={() => setStep(1)} className="text-terra-400 underline">
            chair
          </button>{" "}
          first
        </p>
      )}
    </div>
  );
}
