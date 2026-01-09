import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEventCartStore = create(
  persist(
    (set) => ({
      selectedEvents: [],

      setSelectedEvents: (updater) =>
        set((state) => ({
          selectedEvents:
            typeof updater === "function"
              ? updater(state.selectedEvents)
              : updater,
        })),

      resetSelectedEvents: () =>
        set({ selectedEvents: [] }),

    }),
    {
      name: "event-cart-storage",
      partialize: (state) => ({
        selectedEvents: state.selectedEvents,
        count: state.count,
      }),
    }
  )
);

export default useEventCartStore;
