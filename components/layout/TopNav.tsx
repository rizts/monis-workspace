"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, LogIn, User, ShoppingBag } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { cn, formatCurrency } from "@/lib/utils";
import AuthModal from "@/components/ui/AuthModal";

export default function TopNav() {
  const { getItemCount, getWeeklyPrice, setCheckoutOpen } = useWorkspaceStore();
  const [authOpen, setAuthOpen] = useState(false);
  const itemCount = getItemCount();
  const weeklyPrice = getWeeklyPrice();

  return (
    <>
      <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-8 border-b border-sand-200 bg-cream-50/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-terra-400 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm group-hover:bg-terra-500 transition-colors">
            m
          </div>
          <span className="font-display text-charcoal-600 font-semibold text-lg tracking-tight hidden sm:block">
            monis.rent
          </span>
        </Link>

        {/* Location badge */}
        <div className="flex items-center gap-1.5 bg-forest-100 text-forest-500 rounded-full px-3 py-1.5 text-xs font-medium">
          <MapPin className="w-3 h-3" />
          <span>Bali, Indonesia</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Price preview */}
          {itemCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setCheckoutOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-terra-400 text-cream-50 rounded-xl px-4 py-2 text-sm font-medium hover:bg-terra-500 transition-colors shadow-terra"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{formatCurrency(weeklyPrice)}/wk</span>
              <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </motion.button>
          )}

          {/* Auth */}
          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-1.5 text-charcoal-400 hover:text-charcoal-600 text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:block">Sign in</span>
          </button>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
