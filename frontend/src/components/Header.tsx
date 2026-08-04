import { useState } from 'react';
import { Menu, Phone, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../lib/constants';
import { useCart } from '../cart/CartContext';
import CartDrawer from '../cart/CartDrawer';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Support', to: '/support' },
  { label: 'Sign Up', to: '/signup' },
  { label: 'Customer Portal', href: COMPANY.portalUrl, external: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt={COMPANY.name} className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                to={item.to}
                className="text-sm font-medium text-slate-600 transition hover:text-telecomBlue"
              >
                {item.label}
              </Link>
              ) : (
                <a
                  key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="text-sm font-medium text-slate-600 transition hover:text-telecomBlue"
              >
                {item.label}
              </a>
              )
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-telecomBlue text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <a href={`tel:${COMPANY.phone}`} className="btn-primary text-sm">
              <Phone size={16} />
              {COMPANY.phone}
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-telecomBlue text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X className="text-slate-900" /> : <Menu className="text-slate-900" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            {nav.map((item) =>
              item.to ? (
                <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-600 hover:text-telecomBlue"
              >
                {item.label}
              </Link>
              ) : (
                <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-600 hover:text-telecomBlue"
              >
                {item.label}
              </a>
              )
            )}
            <a href={`tel:${COMPANY.phone}`} className="btn-primary text-sm">
              <Phone size={16} />
              {COMPANY.phone}
            </a>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
