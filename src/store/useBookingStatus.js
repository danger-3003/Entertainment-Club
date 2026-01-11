import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStatus = create(
  persist(
    (set) => ({
      booking: false,

      setBooking: (value) =>
        set({ booking: value }),

      resetBooking: () =>
        set({ booking: false }),
    }),
    {
      name: "user-booking-vsc",

      // persist only what you need
      partialize: (state) => ({
        booking: state.booking,
      }),
    }
  )
);

export default useBookingStatus;
