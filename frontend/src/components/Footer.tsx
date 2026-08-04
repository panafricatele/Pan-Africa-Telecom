import { Link } from 'react-router-dom';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-slate-500">
            <Link to="/">
              <img src="/images/logo.png" alt={COMPANY.name} className="mb-3 h-8 w-auto" />
            </Link>
            <p className="font-semibold text-slate-900">{COMPANY.name}</p>
            <p>{COMPANY.address}</p>
            <p className="mt-1">{COMPANY.icasaLicense}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <Link to="/shop" className="hover:text-telecomBlue">Shop</Link>
            <Link to="/support" className="hover:text-telecomBlue">Support</Link>
            <Link to="/signup" className="hover:text-telecomBlue">Sign Up</Link>
            <a href={COMPANY.wapaCoC} target="_blank" rel="noopener noreferrer" className="hover:text-telecomBlue">
              WAPA Code of Conduct
            </a>
            <a href={WHATSAPP_LINK} className="hover:text-telecomBlue">
              WhatsApp: {COMPANY.whatsapp}
            </a>
            <a href={`tel:${COMPANY.phone}`} className="hover:text-telecomBlue">
              Tel: {COMPANY.phone}
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {COMPANY.name} (Pty) Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
