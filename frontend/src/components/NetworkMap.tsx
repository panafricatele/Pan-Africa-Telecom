import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, CheckCircle, XCircle, Wifi, Radio } from 'lucide-react';
import { coverageApi } from '../lib/api';
import { CoverageResponse, Package } from '../types';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { WHATSAPP_LINK } from '../lib/constants';

export default function NetworkMap() {
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CoverageResponse | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setChecking(true);
    try {
      const data = await coverageApi.check(query);
      setResult(data);
    } catch {
      setResult({
        location: query,
        available: false,
        technologies: [],
        message: 'Unable to check coverage right now. Please call or WhatsApp us for a manual feasibility check.',
        sources: [],
        packages: [],
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <section id="coverage" className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Check your coverage</h2>
          <p className="mt-3 text-slate-600">
            Enter your street address or suburb to see which services are available at your location.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <form onSubmit={handleCheck} className="glass-card flex flex-col gap-3 p-5 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your street address, suburb or town"
                className="input-field pl-10"
              />
            </div>
            <button type="submit" disabled={checking || !query.trim()} className="btn-primary disabled:opacity-50">
              {checking ? 'Checking...' : <><Search size={16} /> Check</>}
            </button>
          </form>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card mt-6 border-l-4 p-6 ${result.available ? 'border-l-fibreEmerald' : 'border-l-slate-300'}`}
            >
              <div className="flex items-start gap-3">
                {result.available ? (
                  <CheckCircle className="mt-0.5 shrink-0 text-fibreEmerald" size={22} />
                ) : (
                  <XCircle className="mt-0.5 shrink-0 text-slate-400" size={22} />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {result.available ? 'Coverage available!' : 'Not yet available'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{result.message}</p>
                </div>
              </div>

              {result.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.technologies.map((tech) => {
                    const label = tech === 'fibre' ? 'Fibre' : tech === 'lte' ? 'Telkom LTE' : 'Fixed Wireless';
                    const Icon = tech === 'fibre' ? Wifi : Radio;
                    return (
                      <span key={tech} className="flex items-center gap-1.5 rounded-full bg-fibreEmerald/10 px-3 py-1.5 text-xs font-semibold text-fibreEmerald">
                        <Icon size={13} /> {label}
                      </span>
                    );
                  })}
                </div>
              )}

              {result.sources && result.sources.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Provider checks</p>
                  {result.sources.map((source) => (
                    <div key={source.source} className="flex items-start gap-3 rounded-lg bg-slate-100 p-3">
                      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${source.available ? 'bg-fibreEmerald' : 'bg-slate-300'}`} />
                      <div>
                        <p className="text-sm font-semibold">{source.providerName}</p>
                        <p className="text-xs text-slate-500">{source.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.packages.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recommended packages</p>
                  <div className="mt-3 grid gap-3">
                    {result.packages.slice(0, 3).map((pkg: Package) => (
                      <Link
                        key={pkg.id}
                        to={`/signup?service=${encodeURIComponent(pkg.name)}`}
                        className="flex items-center justify-between rounded-lg bg-slate-100 p-3 transition hover:bg-slate-200"
                      >
                        <div>
                          <p className="font-semibold">{pkg.name}</p>
                          <p className="text-xs text-slate-500">
                            {pkg.speed} {pkg.uncapped ? '• Uncapped' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{pkg.price > 0 ? formatCurrency(pkg.price) : 'Custom'}</p>
                          <p className="text-xs text-slate-400">{pkg.priceLabel}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!result.available && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/signup" className="btn-primary text-sm">
                    Register Interest
                  </Link>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                    WhatsApp Us
                  </a>
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fibreEmerald" /> Fibre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-telecomBlue" /> Fixed Wireless
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> LTE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
