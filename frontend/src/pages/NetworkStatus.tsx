import { useEffect, useState } from 'react';
import { Activity, ExternalLink, MapPin, RefreshCw, Server } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { networkStatusApi } from '../lib/api';

interface NetworkStatusResult {
  provider: 'evotel' | 'vumatel';
  area: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPERATIONAL: 'bg-emerald-100 text-emerald-700',
  PARTIALOUTAGE: 'bg-amber-100 text-amber-700',
  MAJOROUTAGE: 'bg-red-100 text-red-700',
  INVESTIGATING: 'bg-amber-100 text-amber-700',
  DEGRADED: 'bg-amber-100 text-amber-700',
};

function formatStatus(status: string): string {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function NetworkStatus() {
  const [results, setResults] = useState<NetworkStatusResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await networkStatusApi.list();
      setResults(data as NetworkStatusResult[]);
    } catch (err) {
      console.error('Error loading network status:', err);
    } finally {
      setLoading(false);
    }
  };

  const evotelResults = results.filter((r) => r.provider === 'evotel');
  const vumatelResults = results.filter((r) => r.provider === 'vumatel');

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
              <h2 className="text-2xl font-bold">Live Network Status</h2>
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-telecomBlue hover:underline disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading network status…</div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Server className="text-telecomBlue" size={20} />
                    <h3 className="text-lg font-bold">Evotel</h3>
                  </div>
                  {evotelResults.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500">No Evotel areas monitored yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {evotelResults.map((r) => (
                        <li key={`${r.provider}-${r.area}`} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="font-medium">{r.area}</span>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {formatStatus(r.status)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Server className="text-telecomBlue" size={20} />
                    <h3 className="text-lg font-bold">Vumatel</h3>
                  </div>
                  {vumatelResults.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500">No Vumatel locations monitored yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {vumatelResults.map((r) => (
                        <li key={`${r.provider}-${r.area}`} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-slate-400" />
                              <span className="font-medium">{r.area}</span>
                            </div>
                            {r.latitude && r.longitude && (
                              <p className="text-xs text-slate-500">{r.latitude}, {r.longitude}</p>
                            )}
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {formatStatus(r.status)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
