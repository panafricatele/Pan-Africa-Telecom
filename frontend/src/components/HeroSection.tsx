import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Search, Wifi, Zap } from 'lucide-react';
import { coverageApi } from '../lib/api';
import { CoverageResponse, Package } from '../types';
import { useUptime } from '../hooks/useUptime';
import { COMPANY } from '../lib/constants';
import { formatCurrency, pad } from '../lib/utils';

const NETWORK_START = new Date('2023-02-01T00:00:00+02:00');

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CoverageResponse | null>(null);

  const uptime = useUptime(NETWORK_START);

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
    <section id="hero" className="relative overflow-hidden bg-slate-50 pt-10 pb-24 lg:pt-20 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-telecomBlue/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-telecomBlue/30 bg-telecomBlue/10 px-4 py-1.5 text-xs font-semibold text-telecomBlue">
              <span className="h-2 w-2 rounded-full bg-fibreEmerald animate-pulse" />
              ICASA Licensed ISP • AS {COMPANY.icasaLicense.match(/AS:\s*([0-9]+)/)?.[1] ?? '328583'}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Real connections.{' '}
              <span className="text-telecomBlue">Real people.</span>{' '}
              <span className="text-fibreEmerald">Real coverage.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              From Newcastle across KwaZulu-Natal, our team designs, installs and supports Fibre, Fixed Wireless, LTE and ICT networks for homes, schools, businesses and communities. No chatbots — just local engineers and a 24/7 network operations centre.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                <Wifi size={18} /> Explore packages
              </Link>
              <a href={COMPANY.portalUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Customer Portal
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="photo-frame">
              <img
                src="/images/aerial-site.jpg"
                alt="Pan Africa Telecom technicians installing equipment on a tower"
                className="h-64 w-full object-cover"
              />
            </div>

            <form onSubmit={handleCheck} className="glass-card flex flex-col gap-3 p-3 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter street address or town"
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" disabled={checking || !query.trim()} className="btn-primary disabled:opacity-50">
                {checking ? 'Checking...' : <><Search size={16} /> Check Coverage</>}
              </button>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card border-l-4 p-5 ${result.available ? 'border-l-fibreEmerald' : 'border-l-telecomBlue'}`}
              >
                <h3 className="font-semibold">
                  {result.available ? 'Coverage available' : 'Coverage check result'}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{result.message}</p>
                {result.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.technologies.map((tech) => {
                      const label =
                        tech === 'fibre' ? 'Fibre' : tech === 'lte' ? 'Telkom LTE' : 'Fixed Wireless';
                      return (
                        <span key={tech} className="rounded-full bg-fibreEmerald/10 px-3 py-1 text-xs font-semibold text-fibreEmerald">
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
                {result.estimatedSpeed && (
                  <p className="mt-3 text-xs text-slate-400">{result.estimatedSpeed}</p>
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
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 text-fibreEmerald">
                  <Activity size={18} />
                  <span className="text-sm font-semibold">Network uptime</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Live core network timer since go-live</p>
                <div className="mt-3 font-mono text-2xl font-bold tracking-tight">
                  {pad(uptime.days)}d {pad(uptime.hours)}h {pad(uptime.minutes)}m {pad(uptime.seconds)}s
                </div>
              </div>

              <div className="glass-card p-5">
                <Zap className="text-fibreEmerald" size={18} />
                <div className="mt-2 text-3xl font-bold">24/7</div>
                <p className="text-xs text-slate-500">Local NOC &amp; support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
