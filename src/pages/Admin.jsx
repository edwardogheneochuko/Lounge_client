import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";

function Admin() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("products"); // sidebar tab
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Image preview
  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  // Add product
  const addProduct = async () => {
    if (!form.name || !form.price) return alert("Name and price are required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      if (form.image) formData.append("image", form.image);

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) => [...prev, res.data]);
      setForm({ name: "", price: "", image: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") return <p>Unauthorized – Admins only</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", backgroundColor: "#2c3e50", color: "#fff", padding: "20px" }}>
        <h2 style={{ color: "#ecf0f1", marginBottom: "30px" }}>Admin Panel</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "10px",
              textAlign: "left",
              backgroundColor: activeTab === "products" ? "#34495e" : "transparent",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px",
              textAlign: "left",
              backgroundColor: activeTab === "orders" ? "#34495e" : "transparent",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Orders
          </button>
          <button
            onClick={logout}
            style={{
              marginTop: "30px",
              padding: "10px",
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "30px", backgroundColor: "#ecf0f1" }}>
        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <h2>Products</h2>

            {/* Add Product Form */}
            <div style={{ margin: "20px 0", padding: "20px", borderRadius: "8px", backgroundColor: "#fff" }}>
              <h3>Add New Product</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
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
                    width="120"
                    style={{ borderRadius: "4px", marginTop: "10px" }}
                  />
                )}
                <button
                  onClick={addProduct}
                  disabled={loading}
                  style={{
                    padding: "10px",
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" }}>
              {products.map((p) => (
                <div key={p._id} style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                  <img
                    src={p.image || "/uploads/default.png"}
                    alt={p.name}
                    width="100%"
                    style={{ borderRadius: "4px" }}
                  />
                  <p style={{ fontWeight: "bold", margin: "10px 0 5px" }}>{p.name}</p>
                  <p>${p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2>Orders</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {orders.map((o) => (
                <div key={o._id} style={{ padding: "15px", borderRadius: "6px", backgroundColor: "#fff", border: "1px solid #ddd" }}>
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
