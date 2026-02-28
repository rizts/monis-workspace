"use client";

import { Suspense } from "react";
import ConfiguratorLayout from "@/components/layout/ConfiguratorLayout";

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-charcoal-300 font-display text-2xl animate-pulse">Loading your workspace...</div>
    </div>}>
      <ConfiguratorLayout />
    </Suspense>
  );
}
