// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ShopNav from "../components/ShopNav";
import {
  Package,
  Clock,
  ArrowLeft,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <ShopNav />

      <main className="max-w-5xl mx-auto px-6 py-28">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Link
            to="/shop"
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          📦 My Orders
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <Package className="mx-auto w-12 h-12 text-gray-400" />
            <p className="mt-4 text-gray-600">You have no orders yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-block px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Orders List
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-2xl p-6 border hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="divide-y">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.image || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">
                            {item.product?.name || item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-800 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <p>
                    <Clock className="inline w-4 h-4 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-bold text-gray-900">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default MyOrders;
