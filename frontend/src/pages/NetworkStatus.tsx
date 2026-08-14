import { useEffect, useState } from 'react';
import { Activity, ExternalLink, MapPin, RefreshCw, Wifi } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { supabase } from '../lib/supabase';

interface CoverageRow {
  id: string;
  city: string;
  area: string;
  providers: string[];
}

const PROVIDER_STATUS_LINKS: Record<string, { label: string; url: string }> = {
  evotel: {
    label: 'Evotel Network Status',
    url: 'https://status.evotel.co.za/',
  },
  telkom: {
    label: 'Vumatel / Telkom Network Status',
    url: 'https://vumatel.co.za/network-status',
  },
};

function ProviderLink({ provider }: { provider: string }) {
  const status = PROVIDER_STATUS_LINKS[provider] || {
    label: `${provider} Status`,
    url: '#',
  };

  return (
    <a
      href={status.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-telecomBlue/10 px-3 py-1 text-xs font-medium text-telecomBlue hover:bg-telecomBlue/20"
    >
      {status.label} <ExternalLink size={12} />
    </a>
  );
}

export default function NetworkStatus() {
  const [areas, setAreas] = useState<CoverageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coverage_areas')
        .select('id, city, area, providers')
        .eq('is_active', true)
        .order('city')
        .order('area');

      if (error) {
        console.error('Error loading coverage areas:', error);
      } else {
        setAreas((data as CoverageRow[]) || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const grouped = areas.reduce<Record<string, CoverageRow[]>>((acc, area) => {
    if (!acc[area.city]) acc[area.city] = [];
    acc[area.city].push(area);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-telecomBlue/10 text-telecomBlue">
                <Activity size={32} />
              </div>
              <h1 className="text-4xl font-bold md:text-5xl">Network Status</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Check the live network status for your area. Select your provider below to view their official status page.
              </p>
            </div>

            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="https://status.evotel.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-center justify-between p-5 transition hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-bold">Evotel Network Status</h3>
                  <p className="text-sm text-slate-500">View Evotel&apos;s live network status page</p>
                </div>
                <ExternalLink className="text-slate-400" size={20} />
              </a>

              <a
                href="https://vumatel.co.za/network-status"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-center justify-between p-5 transition hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-bold">Vumatel Network Status</h3>
                  <p className="text-sm text-slate-500">View Vumatel&apos;s live network status page</p>
                </div>
                <ExternalLink className="text-slate-400" size={20} />
              </a>

              <a
                href="https://portal.panafricatelecom.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-center justify-between p-5 transition hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-bold">Customer Portal</h3>
                  <p className="text-sm text-slate-500">Log in to view your service status</p>
                </div>
                <ExternalLink className="text-slate-400" size={20} />
              </a>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Coverage Areas</h2>
              <button
                onClick={loadAreas}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-telecomBlue hover:underline disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading coverage areas…</div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="py-12 text-center text-slate-500">No coverage areas found.</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(grouped).map(([city, cityAreas]) => (
                  <div key={city} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <MapPin className="text-telecomBlue" size={20} />
                      <h3 className="text-lg font-bold">{city}</h3>
                    </div>
                    <ul className="space-y-3">
                      {cityAreas.map((area) => (
                        <li key={area.id} className="rounded-lg bg-slate-50 p-3">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{area.area}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Wifi size={12} /> Pan Africa Telecom
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(area.providers || ['pan-africa']).map((provider) => (
                              <ProviderLink key={provider} provider={provider} />
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
