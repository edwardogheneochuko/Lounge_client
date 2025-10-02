// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import useCartStore from "../store/cartStore";
import ShopNav from "../components/ShopNav";
import { ShoppingBag } from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

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

  return (
    <>
      <ShopNav />

      <main className="max-w-7xl mx-auto px-6 py-28">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">🛒 Our Products</h1>
          <p className="text-gray-500">{products.length} items available</p>
        </div>

        {/* Loading & Empty State */}
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
          // Product Grid
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
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
                <p className="text-green-600 font-bold mt-1">${p.price}</p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-auto w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Shop;
