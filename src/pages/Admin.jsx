// src/pages/Admin.jsx
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

  const borderStyles = `border-2 border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 
  placeholder:text-sm placeholder:md:text-base placeholder:tracking-wider placeholder:text-white
   focus:outline-none focus:ring-2 focus:ring-pink-500`;

  // Fetch products + orders
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

  // Preview uploaded image
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
      formData.append("price", Number(form.price));
  
      // 👇 Important: must be "image"
      if (form.image) formData.append("image", form.image);
  
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setProducts((prev) => [...prev, res.data]);
      setForm({ name: "", price: "", image: null });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Toggle availability
  const toggleAvailability = async (id) => {
    try {
      const res = await api.patch(`/products/${id}/availability`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, available: res.data.available } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  if (!user || user.role !== "admin") return <p>Unauthorized – Admins only</p>;

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-200">
        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Products</h2>

            {/* Add Product Form */}
            <div className="bg-white p-5 rounded-lg shadow mb-6">
              <h3 className="font-semibold mb-3">Add New Product</h3>
              <div className="flex flex-col gap-3">
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
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                />

                {form.image && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 rounded-md mt-2"
                  />
                )}
                <button
                  onClick={addProduct}
                  disabled={loading}
                  className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
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
                  className="bg-white p-3 rounded-lg shadow text-center relative"
                >
                  <img
                    src={p.image || "/uploads/default.png"}
                    alt={p.name}
                    className={`rounded-md w-full h-32 object-cover ${
                      !p.available ? "opacity-50" : ""
                    }`}
                  />
                  <p
                    className={`font-semibold mt-2 ${
                      !p.available ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {p.name}
                  </p>
                  <p className="text-gray-600">${p.price}</p>

                  {/* Actions */}
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={() => toggleAvailability(p._id)}
                      className="px-3 py-1 text-sm rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      {p.available ? "Mark Out of Stock" : "Mark Available"}
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <div className="flex flex-col gap-4">
              {orders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white p-4 rounded-md shadow border"
                >
                  <strong>Order #{o._id}</strong>
                  <p>User: {o.user?.email || "Unknown"}</p>
                  <p>Total: ${o.total}</p>
                  <p>Status: {o.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
