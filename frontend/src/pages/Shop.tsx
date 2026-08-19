import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { phonesApi } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Phone } from '../types';
import { useCart } from '../cart/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
}

function PhoneThumb({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative h-56 w-full rounded-t-2xl bg-white">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-contain p-6"
      />
    </div>
  );
}

function AddToCart({ phone, onOpenEnquiry }: { phone: Phone; onOpenEnquiry: (phone: Phone) => void }) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const inCart = items.find((i) => i.phone.id === phone.id);
  const [qty, setQty] = useState(1);

  if (phone.stock <= 0) {
    return (
      <div className="mt-4 flex items-center gap-3">
        <p className="text-sm font-bold text-red-600">Out of stock</p>
        <button
          onClick={() => onOpenEnquiry(phone)}
          className="text-sm font-medium text-telecomBlue hover:underline"
        >
          Email for enquiries
        </button>
      </div>
    );
  }

  if (inCart) {
    return (
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => updateQuantity(phone.id, inCart.quantity - 1)}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center font-semibold">{inCart.quantity}</span>
        <button
          onClick={() => updateQuantity(phone.id, inCart.quantity + 1)}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <Plus size={14} />
        </button>
        <button onClick={() => removeItem(phone.id)} className="ml-auto text-sm text-red-500 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(phone.stock, q + 1))}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <Plus size={14} />
        </button>
        <button onClick={() => addItem(phone, qty)} className="btn-primary ml-auto flex items-center gap-2 text-sm">
          <ShoppingCart size={16} /> Add
        </button>
      </div>
      {phone.stock <= 3 && (
        <p className="text-xs text-amber-600">Only {phone.stock} left in stock</p>
      )}
    </div>
  );
}

function ProductGrid({ products, onSelect, onOpenEnquiry }: { products: Phone[]; onSelect: (phone: Phone) => void; onOpenEnquiry: (phone: Phone) => void }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((phone) => (
        <div
          key={phone.id}
          className="glass-card overflow-hidden p-0 transition hover:-translate-y-1"
        >
          <PhoneThumb image={phone.image} name={phone.name} />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">{phone.name}</h3>
              <span
                className="h-4 w-4 rounded-full border border-slate-200"
                style={{ backgroundColor: phone.colorCode }}
                title={phone.color}
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">{phone.description}</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-telecomBlue">{formatCurrency(phone.price)}</span>
              {phone.compareAtPrice && phone.compareAtPrice > phone.price && (
                <span className="text-sm text-slate-400 line-through">{formatCurrency(phone.compareAtPrice)}</span>
              )}
            </div>

            <button
              onClick={() => onSelect(phone)}
              className="mt-2 text-sm font-medium text-telecomBlue hover:underline"
            >
              View specs
            </button>

            <AddToCart phone={phone} onOpenEnquiry={onOpenEnquiry} />
          </div>
        </div>
      ))}
    </div>
  );
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'phone', label: 'Phones' },
  { id: 'equipment', label: 'GPON / Network Equipment' },
];

export default function Shop() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Phone | null>(null);
  const [enquiryPhone, setEnquiryPhone] = useState<Phone | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({ fullName: '', email: '', phone: '', address: '', details: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: cartItems, clearCart } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      // Decrement stock in Supabase for each purchased item
      for (const item of cartItems) {
        supabase.rpc('decrement_stock', { product_id: item.phone.id, qty: item.quantity }).then(() => {});
      }
      clearCart();
      setPaymentSuccess(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    phonesApi
      .list()
      .then(setPhones)
      .catch(() => setError('Could not load phones. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? phones
      : phones.filter((p) => (p.category ?? 'phone') === selectedCategory);

  const handleOpenEnquiry = (phone: Phone) => {
    setEnquiryPhone(phone);
    setEnquiryForm({ fullName: '', email: '', phone: '', address: '', details: '' });
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: enquiryForm.fullName,
          email: enquiryForm.email,
          phone: enquiryForm.phone,
          serviceInterest: `Product Enquiry: ${enquiryPhone?.name}`,
          location: enquiryForm.address,
          message: enquiryForm.details,
        }),
      });
      if (response.ok) {
        setEnquiryPhone(null);
        alert('Enquiry sent successfully! We will contact you soon.');
      } else {
        alert('Failed to send enquiry. Please try again.');
      }
    } catch (err) {
      alert('Error sending enquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            {paymentSuccess && (
              <div className="mb-8 flex items-center gap-3 rounded-xl border border-fibreEmerald/30 bg-fibreEmerald/10 p-4">
                <CheckCircle className="shrink-0 text-fibreEmerald" size={22} />
                <div>
                  <p className="font-semibold text-fibreEmerald">Payment successful!</p>
                  <p className="text-sm text-slate-600">Thank you for your order. We'll be in touch shortly.</p>
                </div>
              </div>
            )}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold md:text-5xl">The Shop</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Rugged smartphones and GPON network equipment ready for life in Sub-Saharan Africa. Add to cart and checkout securely with PayFast.
              </p>
            </div>

            {!loading && !error && (
              <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-telecomBlue text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading products…</div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">{error}</div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <ProductGrid products={filteredProducts} onSelect={setSelected} onOpenEnquiry={handleOpenEnquiry} />
                ) : (
                  <p className="py-12 text-center text-slate-500">No products found in this category.</p>
                )}
              </>
            )}
          </div>
        </section>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-bold">{selected.name} specs</h3>
                <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                  ✕
                </button>
              </div>
              <ul className="space-y-2 text-sm">
                {Object.entries(selected.specs).map(([key, value]) => (
                  <li key={key} className="flex justify-between gap-4 border-b border-slate-100 py-2">
                    <span className="text-slate-500">{key}</span>
                    {value.startsWith('http') ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-medium text-telecomBlue hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-right font-medium text-slate-900">{value}</span>
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={() => setSelected(null)} className="btn-secondary mt-6 w-full text-sm">
                Close
              </button>
            </div>
          </div>
        )}

        {enquiryPhone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setEnquiryPhone(null)}
          >
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">Enquiry for {enquiryPhone.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{enquiryPhone.description}</p>
                </div>
                <button onClick={() => setEnquiryPhone(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={enquiryForm.fullName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-telecomBlue focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-telecomBlue focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-telecomBlue focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Town / street address"
                  value={enquiryForm.address}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-telecomBlue focus:outline-none"
                />
                <textarea
                  placeholder="Any extra details..."
                  value={enquiryForm.details}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, details: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-telecomBlue focus:outline-none"
                  rows={4}
                />
                <button
                  type="submit"
                  disabled={enquiryLoading}
                  className="btn-primary w-full text-sm disabled:opacity-50"
                >
                  {enquiryLoading ? 'Sending...' : 'Send enquiry'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
