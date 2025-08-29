import ProductCard from "../components/ProductCard";
import CheckoutDialog from "../components/CheckoutDialog";

const products = [
  { id: 1, name: "Tişört", price: 150, image: "tshirt.jpg" },
  { id: 2, name: "Hoodie", price: 300, image: "hoodie.jpg" },
  { id: 3, name: "Mont", price: 500, image: "jacket.jpg" },
];

export default function Home() {
  return (
    <main className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold mb-4">Giyim Mağazası</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8">
        <CheckoutDialog />
      </div>
    </main>
  );
}
