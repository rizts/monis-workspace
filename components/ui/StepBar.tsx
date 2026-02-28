"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  icon: string;
  description: string;
}

interface StepBarProps {
  steps: Step[];
}

export default function StepBar({ steps }: StepBarProps) {
  const { currentStep, setStep, config } = useWorkspaceStore();

  const isStepComplete = (idx: number) => {
    if (idx === 0) return !!config.desk;
    if (idx === 1) return !!config.chair;
    if (idx === 2) return config.accessories.length > 0;
    return false;
  };

  const canNavigateTo = (idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return !!config.desk;
    if (idx === 2) return !!config.desk && !!config.chair;
    if (idx === 3) return !!config.desk && !!config.chair;
    return false;
  };

  return (
    <div className="px-4 lg:px-8 py-4 bg-cream-50/50 border-b border-sand-100">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          {steps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isComplete = isStepComplete(idx);
            const isPast = currentStep > idx;
            const canNav = canNavigateTo(idx);

            return (
              <div key={idx} className="flex items-center flex-1 min-w-0">
                {/* Step */}
                <button
                  onClick={() => canNav && setStep(idx)}
                  disabled={!canNav}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2 sm:px-3 py-2 transition-all duration-200 min-w-0 flex-1",
                    isActive && "bg-terra-100 text-terra-500",
                    !isActive && canNav && "hover:bg-sand-100 text-charcoal-400",
                    !canNav && "opacity-40 cursor-not-allowed text-charcoal-300"
                  )}
                >
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                      isActive && "border-terra-400 bg-terra-400 text-white",
                      isPast && isComplete && "border-forest-400 bg-forest-400 text-white",
                      isPast && !isComplete && "border-sand-300 bg-sand-100 text-charcoal-400",
                      !isActive && !isPast && "border-sand-200 bg-sand-100 text-charcoal-300"
                    )}
                  >
                    {isPast && isComplete ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-xs font-semibold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Label - hide on mobile for non-active steps */}
                  <div className={cn("min-w-0", !isActive && "hidden sm:block")}>
                    <div
                      className={cn(
                        "text-xs sm:text-sm font-medium leading-tight",
                        isActive && "text-terra-500"
                      )}
                    >
                      {step.label}
                    </div>
                    {isActive && (
                      <div className="text-xs text-charcoal-300 leading-tight hidden sm:block truncate">
                        {step.description}
                      </div>
                    )}
                  </div>
                </button>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="h-px flex-1 mx-1 min-w-[8px]">
                    <div
                      className={cn(
                        "h-px transition-all duration-500",
                        currentStep > idx
                          ? "bg-forest-300"
                          : "bg-sand-200"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => useWorkspaceStore.getState().prevStep()}
            disabled={currentStep === 0}
            className={cn(
              "text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            )}
          >
            ← Back
          </button>

          {currentStep < 3 && (
            <button
              onClick={() => useWorkspaceStore.getState().nextStep()}
              disabled={
                (currentStep === 0 && !config.desk) ||
                (currentStep === 1 && !config.chair)
              }
              className="btn-primary py-2 px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {currentStep === 2 ? "Review Setup →" : "Continue →"}
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={() => useWorkspaceStore.getState().setCheckoutOpen(true)}
              disabled={!config.desk || !config.chair}
              className="btn-primary py-2 px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎉 Rent This Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
