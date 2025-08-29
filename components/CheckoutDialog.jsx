import { useCart } from "../context/CartContext";

export default function CheckoutDialog() {
  const { totals } = useCart();  // 🔥 Artık totals burada tanımlı
  // Sepet toplamını hesapla
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Toplam:</span>
        <span>{total}₺</span>
      </div>

      <a
        href="https://www.shopier.com/ShowProductNew/storefront.php?shop=TEKINWEAR"
        className="bg-black text-white px-4 py-2 rounded"
      >Satın Al
      </a>
    </div>
  );
}