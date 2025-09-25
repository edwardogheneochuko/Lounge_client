import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useCartStore = create(
  persist(
    immer((set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item._id === product._id);
          if (existing) {
            existing.quantity += 1; 
          } else {
            state.cart.push({ ...product, quantity: 1 });
          }
        }),

      decreaseQty: (id) =>
        set((state) => {
          const existing = state.cart.find((item) => item._id === id);
          if (existing) {
            if (existing.quantity > 1) {
              existing.quantity -= 1;
            } else {
              state.cart = state.cart.filter((item) => item._id !== id); 
            }
          }
        }),

      removeFromCart: (id) =>
        set((state) => {
          state.cart = state.cart.filter((item) => item._id !== id);
        }),

      clearCart: () =>
        set((state) => {
          state.cart = [];
        }),
    })),
    { name: "cart-storage" }
  )
);

export default useCartStore;
