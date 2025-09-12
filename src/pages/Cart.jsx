import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const { user } = useAuthStore();

  // Load cart from localStorage when page loads
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Save cart back to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Checkout: push order to backend
  const checkout = async () => {
    if (!user) {
      alert("Please login to place an order");
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        total: getTotal(),
      };

      const res = await api.post("/orders", orderData);
      alert("Order placed successfully!");
      setCart([]);
      localStorage.removeItem("cart");
      console.log("Order response:", res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} style={{ marginBottom: "10px" }}>
              <img src={item.image} alt={item.name} width="80" />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => increaseQty(item._id)}>+</button>
              <button onClick={() => decreaseQty(item._id)}>-</button>
              <button onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ${getTotal().toFixed(2)}</h3>
          <button onClick={checkout}>Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
