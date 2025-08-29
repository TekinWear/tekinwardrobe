import { useCart } from "../app/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
      <img
        src={product.image}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-lg mb-3"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 mb-3">{product.price}₺</p>
      <button
        onClick={() => addToCart(product)}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Sepete Ekle
      </button>
    </div>
  );
}

