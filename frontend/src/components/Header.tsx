import { useState, useRef, useEffect } from 'react';
import { Menu, Moon, Phone, ShoppingCart, Sun, X, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { COMPANY } from '../lib/constants';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import CartDrawer from '../cart/CartDrawer';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Network Status', to: '/network-status' },
  { label: 'Support', to: '/support' },
  { label: 'Sign Up', to: '/signup' },
  { label: 'Customer Portal', href: COMPANY.portalUrl, external: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const { isDark, toggle } = useDarkMode();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt={COMPANY.name} className="h-20 w-auto" />
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
              onClick={toggle}
              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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
            <AccountMenu user={user} profile={profile} isAdmin={isAdmin} onSignOut={handleSignOut} />
            <a href={`tel:${COMPANY.phone}`} className="btn-primary text-sm">
              <Phone size={16} />
              {COMPANY.phone}
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <AccountMenu user={user} profile={profile} isAdmin={isAdmin} onSignOut={handleSignOut} />
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

/* ------------------------------------------------------------------ */
/*  Account icon + dropdown (sits next to the cart icon)               */
/* ------------------------------------------------------------------ */

interface AccountMenuProps {
  user: ReturnType<typeof useAuth>['user'];
  profile: ReturnType<typeof useAuth>['profile'];
  isAdmin: boolean;
  onSignOut: () => void;
}

function AccountMenu({ user, profile, isAdmin, onSignOut }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
        aria-label="Sign in"
      >
        <UserCircle size={22} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 text-telecomBlue transition hover:bg-slate-100"
        aria-label="Account menu"
      >
        <UserCircle size={22} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2">
            <p className="text-sm font-semibold text-slate-900">{profile?.full_name || 'My Account'}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          )}

          <button
            onClick={() => { onSignOut(); setOpen(false); }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
