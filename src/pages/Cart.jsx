import { useState } from "react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import { X } from "lucide-react";
import { toast } from "react-toastify";

function Cart() {
  const { user } = useAuthStore();
  const { cart, addToCart, decreaseQty, removeFromCart, clearCart } =
    useCartStore();

  const [address, setAddress] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validate = () => {
    const { phone, street, city, state } = address;

    if (!phone || !street || !city || !state) {
      toast.warning("Please complete your shipping details");
      return false;
    }

    return true;
  };

  const checkout = async () => {
    if (!user) {
      toast.info("Please login to place an order");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        total: getTotal(),
        address: {
          fullName: user?.name || "Customer",
          ...address,
        },
      };

      await api.post("/orders", orderData);

      toast.success("Order placed successfully!");

      clearCart();
      setAddress({
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            <div className="md:col-span-2 space-y-5">

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "/uploads/default.png"}
                      className="w-16 h-16 object-cover rounded-lg"
                      alt={item.name}
                    />

                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="w-7 h-7 bg-gray-200 rounded-full"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 bg-green-500 text-white rounded-full"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 ml-2"
                    >
                      <X size={18} />
                    </button>

                  </div>
                </div>
              ))}

            </div>

            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

              <h3 className="font-semibold mb-4">Shipping Details</h3>

              {["phone", "street", "city", "state", "zip"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={address[field]}
                  onChange={handleChange}
                  placeholder={field.toUpperCase()}
                  className="w-full mb-3 border p-2 rounded-md"
                />
              ))}

              <div className="mt-6 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-600">
                  ₦{getTotal().toLocaleString()}
                </span>
              </div>

              <button
                onClick={checkout}
                disabled={loading}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Processing..." : "Checkout"}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-2 bg-gray-200 py-2 rounded-lg"
              >
                Clear Cart
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;