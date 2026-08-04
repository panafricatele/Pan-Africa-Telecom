import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X, CreditCard } from 'lucide-react';
import { checkoutApi } from '../lib/api';
import { useCart } from './CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function PhoneThumb({ image, name }: { image: string; name: string }) {
  return (
    <img
      src={image}
      alt={name}
      className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-contain bg-white p-1"
    />
  );
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const origin = window.location.origin;
      const { payment, action } = await checkoutApi.payfast({
        items: items.map((i) => ({ phoneId: i.phone.id, quantity: i.quantity })),
        name,
        email,
        phone,
        returnUrl: `${origin}/#/shop?payment=success`,
        cancelUrl: `${origin}/#/shop?payment=cancelled`,
        notifyUrl: `${origin}/api/v1/checkout/notify`,
      });

      // Populate and auto-submit the form to PayFast
      if (formRef.current) {
        for (const [key, value] of Object.entries(payment)) {
          const input = formRef.current.elements.namedItem(key) as HTMLInputElement | null;
          if (input) input.value = value;
        }
        formRef.current.action = action;
        formRef.current.submit();
      }
    } catch {
      setLoading(false);
      alert('Could not start checkout. Please check your details or WhatsApp us.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={22} /> Your Cart ({count})
          </h2>
          <button onClick={onClose} className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <ShoppingBag size={48} className="mx-auto mb-3" />
            <p>Your cart is empty.</p>
            <Link to="/shop" onClick={onClose} className="btn-primary mt-4 inline-block text-sm">
              Shop phones
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.phone.id} className="flex gap-4 rounded-xl border border-slate-200 p-3">
                  <PhoneThumb image={item.phone.image} name={item.phone.name} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.phone.name}</p>
                    <p className="text-sm text-slate-500">
                      {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(item.phone.price)} each
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.phone.id, item.quantity - 1)}
                        className="rounded-lg border border-slate-200 p-1 hover:bg-slate-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.phone.id, item.quantity + 1)}
                        className="rounded-lg border border-slate-200 p-1 hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeItem(item.phone.id)} className="ml-auto text-sm text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="mb-4 flex items-baseline justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-telecomBlue">
                  {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(total)}
                </span>
              </div>

              <form onSubmit={checkout} className="space-y-3">
                <input
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
                <input
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Preparing…' : <><CreditCard size={16} /> Pay with PayFast</>}
                </button>
                <button type="button" onClick={clearCart} className="btn-secondary w-full text-sm">
                  Clear cart
                </button>
              </form>

              <p className="mt-3 text-xs text-slate-500">
                You will be redirected to PayFast to complete the payment securely.
              </p>
            </div>
          </>
        )}

        <form ref={formRef} method="POST" target="_blank" className="hidden">
          {[
            'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
            'name_first', 'name_last', 'email_address', 'm_payment_id', 'amount',
            'item_name', 'item_description', 'signature',
          ].map((key) => (
            <input key={key} name={key} type="hidden" />
          ))}
        </form>
      </div>
    </div>
  );
}
