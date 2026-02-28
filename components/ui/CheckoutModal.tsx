"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, MapPin, Calendar, User, Mail, Phone, FileText, Loader2 } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { RENTAL_PERIODS } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "form" | "success";

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { config, rentalPeriod, getTotalPrice, resetConfig } = useWorkspaceStore();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    startDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = getTotalPrice();
  const periodOption = RENTAL_PERIODS.find((p) => p.value === rentalPeriod)!;

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (!form.whatsapp.trim()) errs.whatsapp = "WhatsApp number required";
    if (!form.address.trim()) errs.address = "Delivery address required";
    if (!form.startDate) errs.startDate = "Start date required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_config: config,
          rental_period: rentalPeriod,
          start_date: form.startDate,
          delivery_address: form.address,
          total_price: totalPrice,
          contact_name: form.name,
          contact_email: form.email,
          contact_whatsapp: form.whatsapp,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.order.id);
        setStep("success");
        toast.success("🎉 Your workspace is being prepared!");
      } else {
        throw new Error("Order failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (step === "success") {
      resetConfig();
    }
    setStep("form");
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-charcoal-600/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-float w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
            >
              <X className="w-4 h-4 text-charcoal-400" />
            </button>

            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 sm:p-8"
                >
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-semibold text-charcoal-600">
                      Almost there! 🌴
                    </h2>
                    <p className="text-sm text-charcoal-300 mt-1">
                      Fill in your details and we'll deliver your workspace to you in Bali.
                    </p>
                  </div>

                  {/* Order summary pill */}
                  <div className="bg-charcoal-500 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-cream-200 text-xs font-medium uppercase tracking-wide">
                        {config.desk?.name} + {config.chair?.name}
                      </div>
                      <div className="text-charcoal-200 text-xs mt-0.5">
                        + {config.accessories.length} accessories · {periodOption.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-cream-50 text-xl font-semibold">
                        {formatCurrency(totalPrice)}
                      </div>
                      {periodOption.discount && (
                        <div className="text-forest-300 text-xs">
                          {periodOption.discount}% off applied
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                        <input
                          type="text"
                          placeholder="Alex Johnson"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all",
                            errors.name ? "border-red-300" : "border-sand-200"
                          )}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                        <input
                          type="email"
                          placeholder="alex@email.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all",
                            errors.email ? "border-red-300" : "border-sand-200"
                          )}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                        <input
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={form.whatsapp}
                          onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all",
                            errors.whatsapp ? "border-red-300" : "border-sand-200"
                          )}
                        />
                      </div>
                      {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
                    </div>

                    {/* Delivery address */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        Delivery Address in Bali
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal-300" />
                        <textarea
                          placeholder="Jl. Pantai Batu Bolong No. 69, Canggu, Bali"
                          value={form.address}
                          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                          rows={2}
                          className={cn(
                            "w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all resize-none",
                            errors.address ? "border-red-300" : "border-sand-200"
                          )}
                        />
                      </div>
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>

                    {/* Start date */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        Delivery Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                        <input
                          type="date"
                          value={form.startDate}
                          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                          onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all",
                            errors.startDate ? "border-red-300" : "border-sand-200"
                          )}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                        Notes (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-charcoal-300" />
                        <textarea
                          placeholder="Any special instructions or preferences..."
                          value={form.notes}
                          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                          rows={2}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3.5 text-base mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Confirm Rental</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-charcoal-300 text-center">
                      Next-day delivery across Bali · Setup included · Cancel anytime
                    </p>
                  </form>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center flex flex-col items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-forest-500" />
                  </motion.div>

                  <div>
                    <h2 className="font-display text-2xl font-semibold text-charcoal-600">
                      You're all set! 🌴
                    </h2>
                    <p className="text-charcoal-300 mt-2 text-sm">
                      Your dream workspace is confirmed. We'll deliver and set everything up for you.
                    </p>
                  </div>

                  {orderId && (
                    <div className="bg-sand-100 rounded-xl px-4 py-3 w-full">
                      <div className="text-xs text-charcoal-300 font-medium uppercase tracking-wide">
                        Order ID
                      </div>
                      <div className="font-mono text-sm text-charcoal-500 mt-0.5 break-all">
                        {orderId}
                      </div>
                    </div>
                  )}

                  <div className="bg-charcoal-500 rounded-2xl p-4 w-full text-left space-y-2">
                    <div className="text-cream-200 text-xs font-medium uppercase tracking-wide mb-3">
                      What happens next
                    </div>
                    {[
                      "⚡ We confirm your order via WhatsApp within 1 hour",
                      "🚚 Your workspace is delivered next business day",
                      "🔧 We set up everything in your space",
                      "💼 You start working from paradise",
                    ].map((item) => (
                      <div key={item} className="text-sm text-cream-200 flex items-start gap-2">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleClose}
                    className="btn-primary w-full py-3"
                  >
                    Start a New Setup
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
