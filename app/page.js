"use client";
import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import CheckoutDialog from "../components/CheckoutDialog";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const products = [
    { id: 1, name: "Tişört", price: 249.99, image: "/tshirt.jpg" },
    { id: 2, name: "Hoodie", price: 449.99, image: "/hoodie.jpg" },
    { id: 3, name: "Pantolon", price: 599.99, image: "/pants.jpg" },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };
const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🛍️ TekinWardrobe</h1>

      {/* Ürünler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {/* Sepet */}
      <Cart 
  cart={cart} 
  removeFromCart={removeFromCart} 
  total={total} 
  setOpenCheckout={setCheckoutOpen} 
/>
      {/* Ödeme Modalı */}
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} />
    </div>
  );
}

