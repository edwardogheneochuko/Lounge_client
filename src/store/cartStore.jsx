import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";

const useCartStore = create(
  persist(
    immer((set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item._id === product._id);
          if (existing) {
            existing.quantity += 1;
            toast.info("Increased quantity");
          } else {
            state.cart.push({ ...product, quantity: 1 });
            toast.success("Added to cart");
          }
        }),

      decreaseQty: (id) =>
        set((state) => {
          const existing = state.cart.find((item) => item._id === id);
          if (existing) {
            if (existing.quantity > 1) {
              existing.quantity -= 1;
              toast.info("Decreased quantity");
            } else {
              state.cart = state.cart.filter((item) => item._id !== id);
              toast.error("Removed from cart");
            }
          }
        }),

      removeFromCart: (id) =>
        set((state) => {
          state.cart = state.cart.filter((item) => item._id !== id);
          toast.error("Removed from cart");
        }),

      clearCart: () =>
        set((state) => {
          state.cart = [];
          toast.info("Cart cleared");
        }),
    })),
    { name: "cart-storage" }
  )
);

export default useCartStore;
