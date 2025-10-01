import { useState } from "react";
import api from "../utils/api";

function OrderCard({ o, setOrders }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-white p-5 rounded-lg shadow border hover:shadow-md transition">
      <strong className="block text-gray-800 mb-2">Order #{o._id}</strong>
      <p className="text-gray-600">User: {o.user?.email || "Unknown"}</p>
      <p className="text-gray-600">Total: ₦{o.total}</p>

      {/* Status Section */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-gray-700 font-medium">Status:</span>

        {!editing ? (
          <>
            {/* Badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold
                ${
                  o.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : o.status === "processing"
                    ? "bg-blue-100 text-blue-700"
                    : o.status === "shipped"
                    ? "bg-purple-100 text-purple-700"
                    : o.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {o.status}
            </span>

            <button
              onClick={() => setEditing(true)}
              className="text-sm text-pink-600 hover:text-pink-800 font-medium"
            >
              ✏️ Edit
            </button>
          </>
        ) : (
          <select
            value={o.status}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                const res = await api.patch(`/orders/${o._id}/status`, {
                  status: newStatus,
                });
                setOrders((prev) =>
                  prev.map((ord) => (ord._id === o._id ? res.data : ord))
                );
              } catch (err) {
                alert("Failed to update status");
              } finally {
                setEditing(false);
              }
            }}
            className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer
              focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
