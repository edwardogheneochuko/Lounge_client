import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import Sidebar from "../components/AdminSideBar";
import OrderCard from "../components/OrderCard";

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
      let imageUrl = "";

      if (form.image) {
        const imgData = new FormData();
        imgData.append("image", form.image);

        const uploadRes = await api.post("/upload", imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      const res = await api.post("/products", {
        name: form.name,
        price: form.price,
        image: imageUrl,
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      <main className="flex-1 p-8 bg-gray-100 md:ml-56 overflow-auto max-h-screen">
        {activeTab === "products" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>

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

                {/* Drag & Drop Upload */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition"
                  onClick={() => document.getElementById("fileInput").click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setForm({ ...form, image: e.dataTransfer.files[0] });
                    }
                  }}
                >
                  {!preview ? (
                    <div className="text-center">
                      <p className="text-gray-500">Drag & drop an image here</p>
                      <p className="text-gray-400 text-sm">or click to browse</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-md shadow"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, image: null });
                          setPreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                />

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

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Orders</h2>
            <div className="flex flex-col gap-4">
              {orders.map((o) => (
                <OrderCard key={o._id} o={o} setOrders={setOrders} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
