import React, { useEffect, useState } from "react";
import api from "../utils/api";
import useCartStore from "../store/cartStore";
import ShopNav from "../components/Navbar";
import { ShoppingBag, Minus, Plus } from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, decreaseQty } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  // Helper to get product quantity in cart
  const getQty = (id) => cart.find((item) => item._id === id)?.quantity || 0;

  return (
    <>
      <ShopNav />

      <main className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">🛒 Our Products</h1>
          <p className="text-gray-500">{products.length} items available</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto w-12 h-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No products available yet.</p>
          </div> 
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const qty = getQty(p._id);

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {p.name}
                  </h2>
                  <p className="text-green-600 font-bold my-2">₦{p.price}</p>

                  {qty > 0 ? (
                    <div className="mt-auto flex items-center justify-between bg-green-50 border border-green-300 rounded-xl p-2">
                      <button
                        onClick={() => decreaseQty(p._id)}
                        className="bg-red-600 text-white w-8 h-8 flex items-center
                         justify-center rounded-full hover:bg-red-700 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-lg font-medium text-gray-800">
                        {qty}
                      </span>

                      <button
                        onClick={() => addToCart(p)}
                        className="bg-green-600 text-white w-8 h-8 flex cursor-pointer
                         items-center justify-center rounded-full hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-auto w-full bg-green-600 text-white py-2 cursor-pointer
                       px-4 rounded-xl hover:bg-green-700 transition flex items-center
                        justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default Shop;
