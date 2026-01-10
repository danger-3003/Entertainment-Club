import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: {
        id: "",
        mobile: "",
      },

      setUser: (user) =>
        set({ user }),

      resetUser: () =>
        set({ user: { id: "", mobile: "" } }),
    }),
    {
      name: "user-vsc",

      // persist only what you need
      partialize: (state) => ({
        user: {
          id: state.user.id,
          mobile: state.user.mobile,
        },
      }),
    }
  )
);

export default useUserStore;
