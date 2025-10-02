import { useState } from "react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const { user } = useAuthStore();
  const { cart, addToCart, decreaseQty, removeFromCart, clearCart } = useCartStore();

  // Address fields
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (!user) {
      toast.info("Please login to place an order");
      return;
    }

    if (!phone.trim() || !street.trim() || !city.trim() || !state.trim()) {
      toast.warning("Please complete your shipping details");
      return;
    }

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
          fullName: user?.name || "Customer", // ✅ taken from logged-in user
          phone,
          street,
          city,
          state,
          zip,
        },
      };

      const res = await api.post("/orders", orderData);
      toast.success("✅ Order placed successfully!");
      clearCart();
      setPhone("");
      setStreet("");
      setCity("");
      setState("");
      setZip("");
      console.log("Order response:", res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Link
            to="/shop"
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-400 duration-200"
          >
            <ArrowLeft />
          </Link>
          🛒 Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image ? item.image : "/uploads/default.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                     bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                     bg-green-500 text-white hover:bg-green-600"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:text-red-800 ml-4 cursor-pointer"
                >
                  <X />
                </button>
              </div>
            ))}

            {/* Phone */}
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Street */}
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter your street..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Total + Buttons */}
            <div className="flex justify-between items-center pt-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ₦{getTotal().toLocaleString()}
              </span>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={clearCart}
                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={checkout}
                disabled={loading || cart.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl 
                font-semibold text-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
