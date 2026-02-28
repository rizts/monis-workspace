"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspaceStore } from "@/lib/store";
import { MOCK_PRODUCTS } from "@/lib/data";
import WorkspaceCanvas from "@/components/canvas/WorkspaceCanvas";
import StepBar from "@/components/ui/StepBar";
import ProductPicker from "@/components/ui/ProductPicker";
import CartSummary from "@/components/ui/CartSummary";
import CheckoutModal from "@/components/ui/CheckoutModal";
import TopNav from "@/components/layout/TopNav";
import type { Product } from "@/types";

const STEPS = [
  { label: "Desk", icon: "🗂", description: "Choose your workspace foundation" },
  { label: "Chair", icon: "🪑", description: "Pick your command seat" },
  { label: "Accessories", icon: "✨", description: "Level up your setup" },
  { label: "Review", icon: "🛒", description: "Confirm & rent" },
];

export default function ConfiguratorLayout() {
  const { currentStep, config, checkoutOpen, setCheckoutOpen, getItemCount } = useWorkspaceStore();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products?.length) setProducts(data.products);
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const desks = products.filter((p) => p.category === "desk");
  const chairs = products.filter((p) => p.category === "chair");
  const accessories = products.filter(
    (p) => !["desk", "chair"].includes(p.category)
  );

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNav />

      {/* Step Bar */}
      <StepBar steps={STEPS} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 max-w-[1600px] w-full mx-auto px-4 lg:px-8 pb-8">

        {/* Left: Product Picker */}
        <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentStep === 0 && (
                <ProductPicker
                  title="Choose your desk"
                  subtitle={STEPS[0].description}
                  products={desks}
                  selectedId={config.desk?.id}
                  onSelect={(p) => useWorkspaceStore.getState().setDesk(p)}
                  type="single"
                  emptyHint="Select a desk to start building your workspace"
                />
              )}
              {currentStep === 1 && (
                <ProductPicker
                  title="Choose your chair"
                  subtitle={STEPS[1].description}
                  products={chairs}
                  selectedId={config.chair?.id}
                  onSelect={(p) => useWorkspaceStore.getState().setChair(p)}
                  type="single"
                  emptyHint="Pick the perfect chair for long work sessions"
                />
              )}
              {currentStep === 2 && (
                <ProductPicker
                  title="Add accessories"
                  subtitle={STEPS[2].description}
                  products={accessories}
                  selectedIds={config.accessories.map((a) => a.product.id)}
                  onToggle={(p) => {
                    const store = useWorkspaceStore.getState();
                    const exists = config.accessories.find((a) => a.product.id === p.id);
                    if (exists) store.removeAccessory(p.id);
                    else store.addAccessory(p);
                  }}
                  type="multi"
                  emptyHint="Enhance your setup with monitors, plants, and more"
                />
              )}
              {currentStep === 3 && (
                <CartSummary onCheckout={() => setCheckoutOpen(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Workspace Canvas */}
        <div className="flex-1 order-1 lg:order-2 min-h-[380px] lg:min-h-0">
          <WorkspaceCanvas />
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
