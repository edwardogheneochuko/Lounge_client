import { useState } from "react";
import api from "../utils/api";

function OrderCard({ o, setOrders }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);


  const handleDelete = async () => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${o._id}`);
      setOrders((prev) => prev.filter((ord) => ord._id !== o._id));
    } catch {
      alert("Failed to delete order");
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border hover:shadow-md transition">
      <strong className="block text-gray-800 mb-2">Order #{o._id}</strong>
      <p className="text-gray-600">User: {o.user?.email || "Unknown"}</p>
      <p className="text-gray-600">Total: ₦{o.total}</p>

      {/* Address */}
      <div className="mt-2 text-sm text-gray-700">
        <p><b>Address:</b> {o.address?.fullName}, {o.address?.street}, {o.address?.city}, {o.address?.state}, {o.address?.zip}</p>
        <p><b>Phone:</b> {o.address?.phone}</p>
      </div>

      {/* Items */}
      <div className="mt-3">
        <b className="text-gray-800">Items:</b>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {o.items.map((it, idx) => (
            <li key={idx}>
              {it.name} x {it.quantity} – ₦{it.price * it.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Status */}
      {/* Status */}
<div className="flex items-center gap-3 mt-3">
  <span className="text-gray-700 font-medium">Status:</span>

  {!editing ? (
    <>
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
      disabled={saving}   // ✅ disables select while updating
      onChange={async (e) => {
        const newStatus = e.target.value;
        setSaving(true);
        try {
          const res = await api.patch(`/orders/${o._id}/status`, { status: newStatus });
          setOrders((prev) =>
            prev.map((ord) => (ord._id === o._id ? res.data : ord))
          );
          toast.success("✅ Status updated");
        } catch {
          toast.error("❌ Failed to update status");
        } finally {
          setSaving(false);
          setEditing(false);
        }
      }}
      className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer"
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  )}
</div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="mt-3 text-sm text-red-600 hover:text-red-800"
      >
        🗑️ Delete Order
      </button>
    </div>
  );
}

export default OrderCard;
