import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  const { user } = useAuthStore();

  const { cart, addToCart, decreaseQty, removeFromCart, clearCart } =
    useCartStore();

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (!user) {
      toast.info("Please login to place an order");
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
      toast.success("✅ Order placed successfully!");
      clearCart();
      console.log("Order response:", res.data);
    } catch (err) {
      console.error(err);
      toast.warning(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex 
        items-center gap-2">
        <Link to="/shop" className="p-2 bg-gray-200 rounded-full 
        hover:bg-gray-400 duration-200">
        <ArrowLeft/>
        </Link> 🛒 Your Cart
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
                className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.image
                        ? `${import.meta.env.VITE_BASE_URL}${item.image}`
                        : "/uploads/default.png"
                    }
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
                     bg-gray-200 hover:bg-gray-300">
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

            <div className="flex justify-between items-center pt-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ₦{getTotal().toLocaleString()}
              </span>
            </div>

            <button
              onClick={checkout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl 
              font-semibold text-lg mt-6 transition cursor-pointer">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
