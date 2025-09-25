import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore"; 
import api from "../utils/api";
import ShopNav from "../components/ShopNav";

function Shop() {
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();
  const { addToCart } = useCartStore(); 

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNav />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          🛒 Explore Our Products
        </h1>
        <p className="mt-2 text-gray-600">
          Find the best deals and add items to your cart easily.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden 
              flex flex-col hover:shadow-lg transition relative">
              {!p.available && (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full shadow">
                  Out of Stock
                </span>
              )}

              <img
                src={
                  p.image
                    ? `${import.meta.env.VITE_BASE_URL}${p.image}`
                    : "/uploads/default.png"
                }
                alt={p.name}
                className={`w-full h-48 object-cover transition ${
                  !p.available ? "grayscale opacity-60" : ""
                }`}
              />

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-gray-800 truncate">
                  {p.name}
                </h3>
                <p
                  className={`mt-1 text-md font-medium ${
                    !p.available ? "text-gray-400" : "text-green-700"
                  }`}
                >
                  ₦{p.price.toLocaleString()}
                </p>

                <button
                  onClick={() => {
                    addToCart(p);
                    alert("✅ Added to cart");
                  }}
                  disabled={!p.available}
                  className={`mt-auto w-full py-2 rounded-lg text-white font-medium 
                    transition ${
                    p.available
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {p.available ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
