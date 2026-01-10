import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEventCartStore = create(
  persist(
    (set) => ({
      selectedEvents: [],
      isCouponApplied: false,

      // events
      setSelectedEvents: (updater) =>
        set((state) => ({
          selectedEvents:
            typeof updater === "function"
              ? updater(state.selectedEvents)
              : updater,
        })),

      resetSelectedEvents: () =>
        set({ selectedEvents: [] }),

      // coupon
      setIsCouponApplied: (value) =>
        set({ isCouponApplied: value }),

      resetCoupon: () =>
        set({ isCouponApplied: false }),
    }),
    {
      name: "event-cart-storage",
      partialize: (state) => ({
        selectedEvents: state.selectedEvents,
        isCouponApplied: state.isCouponApplied,
      }),
    }
  )
);

export default useEventCartStore;
