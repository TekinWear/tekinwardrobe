export default function Cart({ cart, removeFromCart, total, setOpenCheckout }) {
  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white shadow-2xl p-4 border-t">
      <h2 className="text-xl font-bold mb-2">Sepetim</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Sepetiniz boş.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <span>{item.name}</span>
                <span>{item.price}₺</span>
                <button
                  onClick={() => removeFromCart(i)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-3 font-bold">
            <span>Toplam:</span>
            <span>{total}₺</span>
          </div>
          <button
            onClick={() => setOpenCheckout(true)}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Shopier ile Öde
          </button>
        </>
      )}
    </div>
  );
}
