"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Truck,
  Package,
  Heart,
  Plus,
  Minus,
  Check,
  ChevronDown,
} from "lucide-react";

// shadcn/ui bileşenleri
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// -----------------------------------------------
// Yardımcılar
// -----------------------------------------------
const formatPrice = (x) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(x);

const CATEGORIES = [
  { id: "tum", label: "Tümü" },
  { id: "tisort", label: "Tişört" },
  { id: "hoodie", label: "Hoodie" },
  { id: "pantolon", label: "Pantolon" },
  { id: "aksesuar", label: "Aksesuar" },
];

const MOCK_PRODUCTS = [
  {
    id: "p1",
    title: "Oversize Basic Tişört",
    price: 499,
    rating: 4.7,
    reviews: 182,
    category: "tisort",
    colors: ["Siyah", "Beyaz", "Krem"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1520975922284-9d7f0a0a3ee0?q=80&w=1200&auto=format&fit=crop",
    tags: ["Yeni", "%100 Pamuk"],
  },
  {
    id: "p2",
    title: "Kanguru Cepli Hoodie",
    price: 999,
    rating: 4.8,
    reviews: 301,
    category: "hoodie",
    colors: ["Antrasit", "Lacivert"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&auto=format&fit=crop",
    tags: ["Sıcak Tutucu", "Unisex"],
  },
  {
    id: "p3",
    title: "Slim Fit Jean Pantolon",
    price: 1199,
    rating: 4.5,
    reviews: 98,
    category: "pantolon",
    colors: ["Açık Mavi", "Koyu Mavi"],
    sizes: ["30", "31", "32", "33", "34"],
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
    tags: ["Esnek", "Dayanıklı"],
  },
  {
    id: "p4",
    title: "Minimalist Kep Şapka",
    price: 349,
    rating: 4.6,
    reviews: 57,
    category: "aksesuar",
    colors: ["Siyah", "Bej"],
    sizes: ["Std"],
    image:
      "https://images.unsplash.com/photo-1520974151727-8acb3a4a8d56?q=80&w=1200&auto=format&fit=crop",
    tags: ["Ayarlanabilir"],
  },
  {
    id: "p5",
    title: "Logo Baskılı Tişört",
    price: 599,
    rating: 4.3,
    reviews: 64,
    category: "tisort",
    colors: ["Beyaz", "Mavi"],
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1520975849814-c5f4f6a88d47?q=80&w=1200&auto=format&fit=crop",
    tags: ["Organik"],
  },
];

// -----------------------------------------------
// Ana Bileşen
// -----------------------------------------------
export default function StoreApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("tum");
  const [sort, setSort] = useState("populer");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [cart, setCart] = useState([]); // {id, title, price, qty, color, size, image}

  const filtered = useMemo(() => {
    let list = MOCK_PRODUCTS.filter((p) =>
      [p.title, p.tags?.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "tum") list = list.filter((p) => p.category === category);
    switch (sort) {
      case "fiyatArtan":
        list.sort((a, b) => a.price - b.price);
        break;
      case "fiyatAzalan":
        list.sort((a, b) => b.price - a.price);
        break;
      case "yeni":
        list.sort((a, b) => (b.tags?.includes("Yeni") ? 1 : 0) - (a.tags?.includes("Yeni") ? 1 : 0));
        break;
      default:
        list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [query, category, sort]);

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const kargo = subtotal > 1000 || subtotal === 0 ? 0 : 49.9;
  const total = subtotal + kargo;

  function addToCart(p, { color = p.colors?.[0], size = p.sizes?.[0] } = {}) {
    setCart((cur) => {
      const idx = cur.findIndex((i) => i.id === p.id && i.color === color && i.size === size);
      if (idx !== -1) {
        const next = [...cur];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...cur, { id: p.id, title: p.title, price: p.price, image: p.image, color, size, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id, color, size, delta) {
    setCart((cur) =>
      cur
        .map((i) => (i.id === id && i.color === color && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeLine(id, color, size) {
    setCart((cur) => cur.filter((i) => !(i.id === id && i.color === color && i.size === size)));
  }

  function toggleFav(id) {
    setFavoriteIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handlePaparaCheckout(orderPayload) {
    // --- PAPARA ENTEGRASYONU (ÖN UÇ) ---
    // Bu fonksiyon, sunucunuzdaki bir endpoint'e sipariş bilgisini gönderir.
    // Sunucunuz (Next.js /api route, Node/Express, Laravel vs.), Papara Merchant API ile
    // ödeme oturumu (checkout) oluşturup dönen checkoutUrl'i bize geri iletir.
    // Burada demo amaçlı olarak gerçek istek yerine sahte bir yanıt simüle ediliyor.

    try {
      // ÖRNEK: gerçek kullanımda yorum satırını kaldırın
      // const res = await fetch("/api/papara/create-checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(orderPayload),
      // });
      // const data = await res.json();
      // if (data?.checkoutUrl) window.location.href = data.checkoutUrl;

      // DEMO
      console.log("Papara payload", orderPayload);
      alert("(Demo) Papara yönlendirme: Sunucuda checkout oluşturulmalı. Konsolu kontrol edin.");
    } catch (e) {
      console.error(e);
      alert("Ödeme başlatılırken hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Üst Bar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Logo />
          <div className="hidden md:flex items-center gap-2 ml-4 flex-1">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
              <Input
                placeholder="Ürün ara..."
                className="pl-10 pr-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Filter className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-xs text-slate-500">Sırala</div>
                    <DropdownMenuItem onClick={() => setSort("populer")}>En Popüler</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("fiyatArtan")}>Fiyat Artan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("fiyatAzalan")}>Fiyat Azalan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("yeni")}>Yeni Gelenler</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" asChild className="rounded-xl">
              <a href="#koleksiyon">Koleksiyon</a>
            </Button>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button className="relative rounded-xl">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Sepet
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-slate-900 text-white rounded-full h-5 w-5 grid place-items-center">
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[420px] p-0">
                <CartPanel
                  cart={cart}
                  subtotal={subtotal}
                  kargo={kargo}
                  total={total}
                  onQty={updateQty}
                  onRemove={removeLine}
                  onCheckout={() => setCheckoutOpen(true)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Kahraman Alan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kaliteli Tasarım, Hızlı Teslimat, <span className="text-slate-500">Papara ile Güvenli Ödeme</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              Minimal, modern ve mobil uyumlu giyim mağazası. Sepete ekleyin, adres bilgilerinizi girin ve Papara ile anında ödeyin.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="rounded-xl" onClick={() => document.getElementById("koleksiyon")?.scrollIntoView({ behavior: "smooth" })}>
                Koleksiyona Git
              </Button>
              <div className="flex items-center gap-2 text-slate-500">
                <Truck className="h-5 w-5" /> 1000₺ üzeri kargo ücretsiz
              </div>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> 14 gün iade</span>
              <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> 3D Secure</span>
              <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> SSL</span>
            </div>
          </div>
          <div className="relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
                alt="Koleksiyon"
                className="rounded-3xl shadow-lg w-full aspect-[4/3] object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow p-3 flex items-center gap-3">
              <Package className="h-5 w-5" /> Gün içinde kargoya verilir
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Ürünler */}
      <section id="koleksiyon" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Yeni Sezon</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4" /> {filtered.length} ürün
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={(opt) => addToCart(p, opt)} fav={favoriteIds.has(p.id)} onFav={() => toggleFav(p.id)} />
          ))}
        </div>
      </section>

      {/* Ödeme Modalı */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        totals={{ subtotal, kargo, total }}
        onPapara={handlePaparaCheckout}
      />

      {/* Alt Bilgi */}
      <footer className="border-t mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-4 gap-8 text-sm text-slate-600">
          <div>
            <Logo />
            <p className="mt-2">Türkiye içi hızlı kargo ve güvenli ödeme.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Mağaza</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Hakkımızda</a></li>
              <li><a href="#" className="hover:underline">İade & Değişim</a></li>
              <li><a href="#" className="hover:underline">KVKK & Gizlilik</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Destek</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Sık Sorulanlar</a></li>
              <li><a href="#" className="hover:underline">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Güvenli Ödeme</h4>
            <div className="flex items-center gap-3">
              <PaparaBadge />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -----------------------------------------------
// Alt Bileşenler
// -----------------------------------------------
function Logo() {
  return (
    <a className="flex items-center gap-2 font-extrabold tracking-tight text-lg" href="#">
      <span className="grid place-items-center h-8 w-8 rounded-xl bg-slate-900 text-white">G</span>
      GiyimCo
    </a>
  );
}

function ProductCard({ p, onAdd, fav, onFav }) {
  const [color, setColor] = useState(p.colors?.[0]);
  const [size, setSize] = useState(p.sizes?.[0]);

  return (
    <Card className="rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover" />
          <button onClick={onFav} className={`absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full backdrop-blur bg-white/80 ${fav ? "text-rose-600" : "text-slate-700"}`}>
            <Heart className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {p.tags?.map((t) => (
              <Badge key={t} className="rounded-full bg-white/90 text-slate-700 border" variant="secondary">{t}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">{p.title}</h3>
            <div className="flex items-center gap-1 text-amber-500 text-sm">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-slate-600">{p.rating} • {p.reviews}+ değerlendirme</span>
            </div>
          </div>
          <div className="text-lg font-bold">{formatPrice(p.price)}</div>
        </div>

        {/* Varyantlar */}
        <div className="mt-3 flex items-center gap-3">
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Renk" />
            </SelectTrigger>
            <SelectContent>
              {p.colors?.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-[110px] rounded-xl">
              <SelectValue placeholder="Beden" />
            </SelectTrigger>
            <SelectContent>
              {p.sizes?.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button className="rounded-xl" onClick={() => onAdd({ color, size })}>
          <Plus className="h-4 w-4 mr-2" /> Sepete Ekle
        </Button>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Truck className="h-4 w-4" /> Hızlı Gönderim
        </div>
      </CardFooter>
    </Card>
  );
}

function CartPanel({ cart, subtotal, kargo, total, onQty, onRemove, onCheckout }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sepetim</h3>
        <Badge variant="secondary" className="rounded-full">{cart.reduce((s, i) => s + i.qty, 0)} ürün</Badge>
      </div>

      <div className="flex-1 overflow-auto divide-y">
        {cart.length === 0 && (
          <div className="p-6 text-slate-500">Sepetiniz boş.</div>
        )}
        {cart.map((i) => (
          <div key={`${i.id}-${i.color}-${i.size}`} className="p-4 flex gap-3">
            <img src={i.image} alt={i.title} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="font-medium">{i.title}</div>
              <div className="text-xs text-slate-500">{i.color} • {i.size}</div>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => onQty(i.id, i.color, i.size, -1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{i.qty}</span>
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => onQty(i.id, i.color, i.size, +1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => onRemove(i.id, i.color, i.size)}>Kaldır</Button>
              </div>
            </div>
            <div className="font-semibold">{formatPrice(i.price * i.qty)}</div>
          </div>
        ))}
      </div>

      <div className="p-6 space-y-3 border-t bg-white">
        <div className="flex items-center justify-between text-sm">
          <span>Ara Toplam</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Kargo</span>
          <span>{kargo === 0 ? "Ücretsiz" : formatPrice(kargo)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold">
          <span>Toplam</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button disabled={cart.length === 0} className="w-full rounded-xl mt-2" onClick={onCheckout}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Siparişi Tamamla
        </Button>
      </div>
    </div>
  );
}

function CheckoutDialog({ open, onOpenChange, cart, totals, onPapara }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    notes: "",
    kvkk: true,
    cargo: "standart",
  });

  const canPay = cart.length > 0 && form.name && form.email && form.phone && form.address && form.city && form.postcode && form.kvkk;

  const orderPayload = {
    customer: {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postcode: form.postcode,
    },
    items: cart.map((i) => ({
      productId: i.id,
      title: i.title,
      price: i.price,
      quantity: i.qty,
      variant: { color: i.color, size: i.size },
    })),
    totals,
    cargo: form.cargo,
    // Papara özel alanlar sunucuda oluşturulacak (merchantId, referenceId, callbackUrl vb.)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ödeme Bilgileri</DialogTitle>
          <DialogDescription>Adresinizi girin ve ödeme yöntemini seçin.</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Adres Formu */}
          <div className="space-y-3">
            <Field label="Ad Soyad">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="E-posta">
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Telefon">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
            </div>
            <Field label="Adres">
              <Textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Şehir">
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </Field>
              <Field label="Posta Kodu">
                <Input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
              </Field>
            </div>
            <Field label="Not (opsiyonel)">
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">Kargo</div>
              <Select value={form.cargo} onValueChange={(v) => setForm({ ...form, cargo: v })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standart">Standart (1-3 gün)</SelectItem>
                  <SelectItem value="hizli">Hızlı (1 gün)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Switch checked={form.kvkk} onCheckedChange={(v) => setForm({ ...form, kvkk: v })} />
              <span>
                KVKK ve Mesafeli Satış Sözleşmesi'ni kabul ediyorum.
              </span>
            </div>
          </div>

          {/* Özet & Ödeme */}
          <div>
            <div className="rounded-2xl border p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span>Ara Toplam</span>
                <span className="font-medium">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kargo</span>
                <span className="font-medium">{totals.kargo === 0 ? "Ücretsiz" : formatPrice(totals.kargo)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Ödenecek</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <Button
                disabled={!canPay}
                className="w-full h-12 rounded-xl inline-flex items-center justify-center gap-2"
                onClick={() => onPapara(orderPayload)}
              >
                <PaparaBadge />
                Papara ile Öde
              </Button>
              <p className="text-xs text-slate-500">
                Ödeme için Papara sayfasına güvenle yönlendirileceksiniz. Ödeme tamamlandığında siparişiniz otomatik oluşturulur.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-slate-600">{label}</Label>
      {children}
    </div>
  );
}

function PaparaBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border bg-white text-[#6E2CF5]">
      {/* Basit Papara benzeri logo */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2c5.523 0 10 4.477 10 10 0 4.418-3.582 8-8 8H9a1 1 0 0 1-1-1v-3.2h4a6.8 6.8 0 1 0 0-13.6Z"/>
      </svg>
      <span className="font-semibold">papara</span>
    </span>
  );
}
