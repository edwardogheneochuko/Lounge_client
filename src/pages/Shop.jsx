import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import api from "../utils/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // if product already in cart, increase quantity
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div>
      <h2>Shop</h2>
      {user && <p>Welcome {user.email}</p>}
      {products.map((p) => (
        <div key={p._id}>
          <img src={p.image} alt={p.name} width="100" />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Shop;
