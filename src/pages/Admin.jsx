import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api"; 

function Admin() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "" });

  // Fetch products + orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get("/products");
        setProducts(productRes.data);

        const orderRes = await api.get("/orders");
        setOrders(orderRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Add product
  const addProduct = async () => {
    try {
      const res = await api.post("/products", form);
      setProducts((prev) => [...prev, res.data]);
      setForm({ name: "", price: "", image: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  if (user?.role !== "admin") {
    return <p>Unauthorized – Admins only</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Product Form */}
      <h3>Add Product</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <button onClick={addProduct}>Add</button>

      {/* Products */}
      <h3>Products</h3>
      {products.map((p) => (
        <div key={p._id}>
          <img src={p.image} alt={p.name} width="50" />
          {p.name} - ${p.price}
        </div>
      ))}

      {/* Orders */}
      <h3>Orders</h3>
      {orders.map((o) => (
        <div key={o._id}>
          Order #{o._id} - {o.user?.email} - ${o.total} - {o.status}
        </div>
      ))}
    </div>
  );
}

export default Admin;
