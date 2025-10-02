import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        toast.error("❌ Failed to fetch your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="bg-white shadow p-5 rounded-lg border">
              <p className="font-semibold text-gray-800">Order #{o._id}</p>
              <p className="text-gray-600">Total: ₦{o.total}</p>
              <p className="text-gray-600">Status: {o.status}</p>
              <p className="text-gray-600">
                📍 {o.address?.street}, {o.address?.city}, {o.address?.state}
              </p>
              <ul className="mt-2 text-sm list-disc list-inside text-gray-700">
                {o.items.map((it, idx) => (
                  <li key={idx}>
                    {it.product?.name || it.name} x {it.quantity} – ₦
                    {it.price * it.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
