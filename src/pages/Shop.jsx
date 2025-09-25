import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore"; 
import api from "../utils/api";
import ShopNav from "../components/ShopNav";
import { Plus, Minus } from "lucide-react";

function Shop() {
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();
  const { cart, addToCart, removeFromCart } = useCartStore(); 

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
          {products.map((p) => {
            const inCart = cart.find((item) => item._id === p._id);

            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden 
                flex flex-col hover:shadow-lg transition relative"
              >
                {!p.available && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white
                   px-3 py-1 text-xs rounded-full shadow">
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

                  {p.available ? (
                    inCart ? (
                      <div className="mt-auto flex items-center justify-between border rounded-lg overflow-hidden">
                        <button
                          onClick={() => removeFromCart(p._id)}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200
                           text-gray-700 cursor-pointer"
                        >
                          <Minus className="w-4 h-4 mx-auto" />
                        </button>
                        <span className="px-4 font-medium">{inCart.quantity}</span>
                        <button
                          onClick={() => addToCart(p)}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700
                           text-white cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p)}
                        className="mt-auto w-full py-2 rounded-lg cursor-pointer
                         bg-green-600 hover:bg-green-700 text-white font-medium transition"
                      >
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="mt-auto w-full py-2 rounded-lg bg-gray-400 text-white font-medium cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Shop;
