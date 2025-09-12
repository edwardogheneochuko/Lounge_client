import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";

function Admin() {
  const { user, logout } = useAuthStore();
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
    if (!form.name || !form.price) {
      return alert("Name and price are required");
    }

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

  if (!user || user.role !== "admin") {
    return <p>Unauthorized – Admins only</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Add Product Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h3>Add Product</h3>
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
          {preview && (
            <img src={preview} alt="preview" width="120" style={{ borderRadius: "4px", marginTop: "10px" }} />
          )}
          <button
            onClick={addProduct}
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* Products List */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Products</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px" }}>
          {products.map((p) => (
            <div
              key={p._id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", backgroundColor: "#fff" }}
            >
              <img
                src={p.image || "/uploads/default.png"} // placeholder if no image
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

      {/* Orders List */}
      <div>
        <h3>Orders</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orders.map((o) => (
            <div key={o._id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "6px", backgroundColor: "#fefefe" }}>
              <strong>Order #{o._id}</strong>
              <p>User: {o.user?.email || "Unknown"}</p>
              <p>Total: ${o.total}</p>
              <p>Status: {o.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
