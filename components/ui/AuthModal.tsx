"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, Chrome } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "login" | "signup";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleMagicLink() {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-600/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative bg-cream-50 rounded-3xl shadow-float w-full max-w-sm mx-4 p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
            >
              <X className="w-4 h-4 text-charcoal-400" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-terra-400 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl mb-4">
                m
              </div>
              <h2 className="font-display text-2xl font-semibold text-charcoal-600">
                {sent ? "Check your email" : "Sign in to monis"}
              </h2>
              <p className="text-sm text-charcoal-300 mt-1">
                {sent
                  ? `We sent a magic link to ${email}`
                  : "Save your setups and track your rentals"}
              </p>
            </div>

            {!sent ? (
              <div className="space-y-3">
                {/* Magic link */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleMagicLink}
                  disabled={loading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Magic Link"}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">📬</div>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-terra-400 hover:underline"
                >
                  Use a different email
                </button>
              </div>
            )}

            <p className="text-xs text-charcoal-300 text-center mt-4">
              You can also checkout without signing in
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
