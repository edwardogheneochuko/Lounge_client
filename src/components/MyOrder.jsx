import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ShopNav from "./Navbar";
import { Package, ArrowLeft } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <>
      <ShopNav />

      <main className="max-w-5xl mx-auto px-6 py-28">

        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/shop"
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h2 className="text-2xl font-bold text-gray-800">
            📦 My Orders
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">No orders yet</p>

            <Link
              to="/shop"
              className="mt-6 inline-block px-5 py-2 bg-green-600 text-white rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-2xl p-6 border"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </h3>

                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="divide-y">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.image || "/placeholder.png"}
                          className="w-12 h-12 rounded-md object-cover"
                          alt=""
                        />

                        <div>
                          <p className="font-medium">
                            {item.product?.name || item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>

                  <span className="font-bold text-gray-900">
                    Total: ₦{order.total.toLocaleString()}
                  </span>
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