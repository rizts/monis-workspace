import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WorkspaceConfig, CartItem, RentalPeriod } from "@/types";
import { RENTAL_PERIODS, calculateTotal } from "@/lib/data";

interface WorkspaceStore {
  // Configuration
  config: WorkspaceConfig;
  rentalPeriod: RentalPeriod;
  currentStep: number; // 0=desk, 1=chair, 2=accessories, 3=checkout

  // UI state
  previewMode: "isometric" | "flat";
  checkoutOpen: boolean;

  // Actions
  setDesk: (product: Product | null) => void;
  setChair: (product: Product | null) => void;
  addAccessory: (product: Product) => void;
  removeAccessory: (productId: string) => void;
  updateAccessoryQty: (productId: string, quantity: number) => void;
  setRentalPeriod: (period: RentalPeriod) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCheckoutOpen: (open: boolean) => void;
  setPreviewMode: (mode: "isometric" | "flat") => void;
  resetConfig: () => void;

  // Computed
  getTotalPrice: () => number;
  getWeeklyPrice: () => number;
  getItemCount: () => number;
}

const initialConfig: WorkspaceConfig = {
  desk: null,
  chair: null,
  accessories: [],
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      config: initialConfig,
      rentalPeriod: "1_month",
      currentStep: 0,
      previewMode: "isometric",
      checkoutOpen: false,

      setDesk: (product) =>
        set((state) => ({
          config: { ...state.config, desk: product },
        })),

      setChair: (product) =>
        set((state) => ({
          config: { ...state.config, chair: product },
        })),

      addAccessory: (product) =>
        set((state) => {
          const existing = state.config.accessories.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return {
              config: {
                ...state.config,
                accessories: state.config.accessories.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              },
            };
          }
          return {
            config: {
              ...state.config,
              accessories: [
                ...state.config.accessories,
                { product, quantity: 1 },
              ],
            },
          };
        }),

      removeAccessory: (productId) =>
        set((state) => ({
          config: {
            ...state.config,
            accessories: state.config.accessories.filter(
              (item) => item.product.id !== productId
            ),
          },
        })),

      updateAccessoryQty: (productId, quantity) =>
        set((state) => ({
          config: {
            ...state.config,
            accessories:
              quantity === 0
                ? state.config.accessories.filter(
                    (item) => item.product.id !== productId
                  )
                : state.config.accessories.map((item) =>
                    item.product.id === productId
                      ? { ...item, quantity }
                      : item
                  ),
          },
        })),

      setRentalPeriod: (period) => set({ rentalPeriod: period }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
      setCheckoutOpen: (open) => set({ checkoutOpen: open }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      resetConfig: () =>
        set({ config: initialConfig, currentStep: 0, checkoutOpen: false }),

      getTotalPrice: () => {
        const { config, rentalPeriod } = get();
        const periodOption = RENTAL_PERIODS.find((p) => p.value === rentalPeriod);
        return calculateTotal(
          config.desk,
          config.chair,
          config.accessories,
          periodOption?.weeks || 1,
          periodOption?.discount || 0
        );
      },

      getWeeklyPrice: () => {
        const { config } = get();
        return calculateTotal(
          config.desk,
          config.chair,
          config.accessories,
          1,
          0
        );
      },

      getItemCount: () => {
        const { config } = get();
        return (
          (config.desk ? 1 : 0) +
          (config.chair ? 1 : 0) +
          config.accessories.reduce((sum, item) => sum + item.quantity, 0)
        );
      },
    }),
    {
      name: "monis-workspace-config",
      partialize: (state) => ({
        config: state.config,
        rentalPeriod: state.rentalPeriod,
      }),
    }
  )
);
