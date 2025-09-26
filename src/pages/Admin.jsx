import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import Sidebar from "../components/AdminSideBar";

function Admin() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const borderStyles = `border-2 border-gray-300 p-3 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 
    placeholder:text-gray-400`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
        ]);
        setProducts(productRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const addProduct = async () => {
    if (!form.name || !form.price) return alert("Name and price are required");
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price); // No need to convert here, backend handles it
  
      // Only append image if selected
      if (form.image) {
        formData.append("image", form.image);
      }
  
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setProducts((prev) => [...prev, res.data]);
      setForm({ name: "", price: "", image: null });
      setPreview(null);
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const res = await api.patch(`/products/${id}/toggle`);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!user || user.role !== "admin") return <p>Unauthorized – Admins only</p>;

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 md:ml-56 overflow-auto max-h-screen">
        {/* ✅ PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="font-semibold mb-4 text-lg">Add New Product</h3>
              <div className="flex flex-col gap-4">
                <input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={borderStyles}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={borderStyles}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md mt-2 shadow"
                  />
                )}
                <button
                  onClick={addProduct}
                  disabled={loading}
                  className="bg-pink-600 text-white py-2 rounded-md 
                  hover:bg-pink-700 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white p-4 rounded-lg shadow text-center relative overflow-hidden group hover:shadow-lg transition"
                >
                  <div className="relative">
                    <img
                      src={
                        p.image
                          ? p.image
                          : "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={p.name}
                      className={`rounded-md w-full h-40 object-cover transition ${
                        !p.available ? "grayscale opacity-60" : ""
                      }`}
                    />
                    {!p.available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-[200%] h-1 bg-red-600 rotate-45 opacity-80"></div>
                      </div>
                    )}
                  </div>

                  <p
                    className={`font-semibold mt-3 text-lg ${
                      !p.available ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p
                    className={`${
                      !p.available ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    ₦{p.price}
                  </p>

                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => toggleAvailability(p._id)}
                      className={`px-3 py-2 rounded-md text-white cursor-pointer text-xs ${
                        p.available
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {p.available ? "Mark Out of Stock" : "Mark Available"}
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 
                      hover:bg-red-700 text-white font-medium cursor-pointer
                      shadow-md active:scale-95 transition relative "

                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Orders</h2>
            <div className="flex flex-col gap-4">
              {orders.map((o) => {
                const [editing, setEditing] = useState(false);

                return (
                  <div
                    key={o._id}
                    className="bg-white p-5 rounded-lg shadow border hover:shadow-md transition"
                  >
                    <strong className="block text-gray-800 mb-2">
                      Order #{o._id}
                    </strong>
                    <p className="text-gray-600">
                      User: {o.user?.email || "Unknown"}
                    </p>
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

                          {/* Edit button */}
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
                              const res = await api.patch(
                                `/orders/${o._id}/status`,
                                { status: newStatus }
                              );
                              setOrders((prev) =>
                                prev.map((ord) =>
                                  ord._id === o._id ? res.data : ord
                                )
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
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
