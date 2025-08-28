import { Dialog } from "@headlessui/react";

export default function CheckoutDialog({ open, setOpen, cart, totals }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Ödeme</Dialog.Title>
          <ul className="mb-4 space-y-1">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.price}₺</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Toplam:</span>
            <span>{totals.total}₺</span>
          </div>
          <a
            href="https://www.shopier.com/ShowProductNew/storefront.php?shop=TEKİNWEAR" 
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Shopier ile Öde
          </a>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full border py-2 rounded-lg hover:bg-gray-100"
          >
            Kapat
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
