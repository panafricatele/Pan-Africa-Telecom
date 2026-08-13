import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Wifi, Signal, Globe, Phone, Sun, ChevronRight, Loader2, type LucideIcon } from 'lucide-react';
import { Package, ServiceCategory, LeadRequest } from '../types';
import { formatCurrency } from '../lib/utils';
import { leadApi, servicesApi } from '../lib/api';

const TABS: { id: ServiceCategory; label: string; unit: string; min: number; max: number; initial: number; icon: LucideIcon }[] = [
  { id: 'internet', label: 'Home & Business Internet', unit: 'Mbps', min: 5, max: 200, initial: 25, icon: Wifi },
  { id: 'lte', label: 'LTE & Mobile Data', unit: 'Mbps', min: 2, max: 100, initial: 10, icon: Signal },
  { id: 'global', label: 'Global Connectivity', unit: 'branch sites', min: 1, max: 20, initial: 3, icon: Globe },
  { id: 'voice', label: 'VoIP & SMS', unit: 'users / channels', min: 2, max: 100, initial: 10, icon: Phone },
  { id: 'solar', label: 'Renewable Solar Energy', unit: 'kW load', min: 1, max: 10, initial: 3, icon: Sun },
];

const initialSliders = Object.fromEntries(TABS.map((t) => [t.id, t.initial])) as Record<ServiceCategory, number>;

export default function ServiceExplorer() {
  const [active, setActive] = useState<ServiceCategory>('internet');
  const [slider, setSlider] = useState<Record<ServiceCategory, number>>(initialSliders);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lead, setLead] = useState<LeadRequest>({
    fullName: '',
    email: '',
    phone: '',
    serviceInterest: '',
    location: '',
    message: '',
  });

  useEffect(() => {
    setLoading(true);
    servicesApi
      .list()
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const tab = TABS.find((t) => t.id === active)!;
  const categoryPackages = useMemo(
    () => packages.filter((p) => p.category === active),
    [active, packages],
  );

  const recommended = useMemo(() => {
    if (!categoryPackages.length) return undefined;
    const value = slider[active];
    const match = categoryPackages.find(
      (p) => value >= p.demandRange[0] && value <= p.demandRange[1],
    );
    if (match) return match;
    return categoryPackages.reduce((best, p) => {
      const bestMid = (best.demandRange[0] + best.demandRange[1]) / 2;
      const pMid = (p.demandRange[0] + p.demandRange[1]) / 2;
      return Math.abs(pMid - value) < Math.abs(bestMid - value) ? p : best;
    }, categoryPackages[0]);
  }, [active, slider, categoryPackages]);

  const openSignup = (pkg: Package) => {
    setSelected(pkg);
    setLead((l) => ({ ...l, serviceInterest: `${pkg.name} (${tab.label})` }));
    setSuccess(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadApi.signup(lead);
      setSuccess(true);
      setLead({ fullName: '', email: '', phone: '', serviceInterest: '', location: '', message: '' });
    } catch {
      alert('Could not submit. Please try again or use WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="services" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Find the package that fits your needs</h2>
            <p className="mt-3 text-slate-600">
              These are the packages our team installs and supports every day. Pick a category and move the slider to see what suits your home, office or site.
            </p>
          </div>
          <div className="photo-frame overflow-hidden">
            <img
              src="/images/aerial-site.jpg"
              alt="Pan Africa Telecom technicians on a tower"
              className="h-56 w-full object-cover brightness-105 contrast-110"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active === t.id
                    ? 'bg-telecomBlue text-white shadow-lg shadow-telecomBlue/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mb-12 max-w-3xl">
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-600">
                {tab.label} demand
              </label>
              <span className="text-2xl font-bold text-telecomBlue">
                {slider[active]} <span className="text-sm font-medium text-slate-500">{tab.unit}</span>
              </span>
            </div>
            <input
              type="range"
              min={tab.min}
              max={tab.max}
              value={slider[active]}
              onChange={(e) =>
                setSlider((s) => ({ ...s, [active]: Number(e.target.value) }))
              }
              className="w-full accent-telecomBlue"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>{tab.min} {tab.unit}</span>
              <span>{tab.max} {tab.unit}</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
            <Loader2 className="animate-spin" size={20} /> Loading packages…
          </div>
        )}

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {categoryPackages.map((pkg) => {
              const isRecommended = pkg.id === recommended?.id;
              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className={`glass-card flex flex-col p-6 transition hover:-translate-y-1 ${
                    isRecommended ? 'ring-2 ring-fibreEmerald glow-blue' : ''
                  }`}
                >
                  {isRecommended && (
                    <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-fibreEmerald/10 px-3 py-1 text-xs font-bold text-fibreEmerald">
                      <CheckCircle size={12} /> Recommended for {slider[active]} {tab.unit}
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    {pkg.uncapped && (
                      <span className="rounded-full bg-fibreEmerald/10 px-2 py-0.5 text-xs font-bold text-fibreEmerald">
                        Uncapped
                      </span>
                    )}
                  </div>

                  {pkg.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pkg.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                        >
                          {tech === 'fixed-wireless' ? 'Fixed Wireless' : tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-2 text-sm text-slate-500">{pkg.tagline}</p>
                  {pkg.speed && (
                    <div className="mt-4 text-3xl font-bold text-telecomBlue">{pkg.speed}</div>
                  )}

                  <ul className="mt-4 flex-1 space-y-2">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <ChevronRight size={14} className="mt-1 shrink-0 text-telecomBlue" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold">{pkg.price > 0 ? formatCurrency(pkg.price) : 'Custom'}</span>
                      <span className="ml-1 text-sm text-slate-500">{pkg.priceLabel}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openSignup(pkg)}
                    className="btn-primary mt-4 w-full text-sm"
                  >
                    Sign up
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold">Sign up for {selected.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{selected.tagline}</p>

              {success ? (
                <div className="mt-6 rounded-xl bg-fibreEmerald/10 p-4 text-fibreEmerald">
                  Thanks! We have received your request and will contact you shortly.
                </div>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <input
                    required
                    placeholder="Full name"
                    value={lead.fullName}
                    onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                    className="input-field"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="input-field"
                  />
                  <input
                    placeholder="Phone number"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="input-field"
                  />
                  <input
                    required
                    placeholder="Town / street address"
                    value={lead.location}
                    onChange={(e) => setLead({ ...lead, location: e.target.value })}
                    className="input-field"
                  />
                  <textarea
                    rows={3}
                    placeholder="Any extra details..."
                    value={lead.message}
                    onChange={(e) => setLead({ ...lead, message: e.target.value })}
                    className="input-field"
                  />
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? 'Sending...' : 'Send enquiry'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
