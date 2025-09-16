import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Shop</h2>
        {user ? (
          <div className="flex items-center gap-4">
            <p>Welcome, {user.email}</p>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-600">You are not logged in</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
          >
            <img
              src={p.image ? `${import.meta.env.VITE_BASE_URL}${p.image}` : "/uploads/default.png"}
              alt={p.name}
              className={`w-full h-48 object-cover rounded-md transition ${
                !p.available ? "grayscale opacity-60" : ""
              }`}
            />
            <h3 className="mt-2 font-semibold text-lg">{p.name}</h3>
            <p className={`text-md ${!p.available ? "text-gray-400" : "text-black"}`}>
            ₦{p.price}
            </p>
            {!p.available && (
              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                Out of Order
              </span>
            )}
            <button
              onClick={() => addToCart(p)}
              disabled={!p.available}
              className={`mt-3 w-full py-2 rounded-md text-white ${
                p.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
