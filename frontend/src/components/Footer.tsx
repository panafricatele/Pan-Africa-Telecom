import { Link } from 'react-router-dom';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';

const policyLinks = [
  { label: 'Terms & Condition', href: COMPANY.policies.terms },
  { label: 'Privacy Policy', href: COMPANY.policies.privacy },
  { label: 'WAPA CoC', href: COMPANY.policies.wapaCoC },
  { label: 'Code Of Conduct', href: COMPANY.policies.codeOfConduct },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-sm text-slate-500">
            <Link to="/">
              <img src="/images/logo.png" alt={COMPANY.name} className="mb-3 h-8 w-auto" />
            </Link>
            <p className="font-semibold text-slate-900">{COMPANY.name}</p>
            <p>{COMPANY.address}</p>
            <p className="mt-1">{COMPANY.icasaLicense}</p>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-start">
            <p className="text-sm font-semibold text-slate-900">Customer Support</p>
            <div className="flex flex-col gap-3">
              {policyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-r from-telecomBlue to-fibreEmerald px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
          <Link to="/shop" className="hover:text-telecomBlue">Shop</Link>
          <Link to="/support" className="hover:text-telecomBlue">Support</Link>
          <Link to="/signup" className="hover:text-telecomBlue">Sign Up</Link>
          <a href={WHATSAPP_LINK} className="hover:text-telecomBlue">
            WhatsApp: {COMPANY.whatsapp}
          </a>
          <a href={`tel:${COMPANY.phone}`} className="hover:text-telecomBlue">
            Tel: {COMPANY.phone}
          </a>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {COMPANY.name} (Pty) Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
