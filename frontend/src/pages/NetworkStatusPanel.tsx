import { useEffect, useState, useCallback } from 'react';
import { Activity, Plus, Trash2, RefreshCw, Loader2, Radio } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { networkStatusApi } from '../lib/api';
import { EvotelComponent, findEvotelComponent } from '../lib/evotel';

type NetworkProvider = 'evotel' | 'vumatel' | 'wireless';

interface NetworkMonitor {
  id: string;
  provider: NetworkProvider;
  area: string;
  latitude: number | null;
  longitude: number | null;
  external_id: string | null;
  status: string;
  note: string | null;
  is_active: boolean;
}

const WIRELESS_STATUS_OPTIONS = [
  { value: 'OPERATIONAL', label: 'Operational' },
  { value: 'DEGRADED', label: 'Degraded performance' },
  { value: 'PARTIALOUTAGE', label: 'Partial outage' },
  { value: 'MAJOROUTAGE', label: 'Major outage' },
  { value: 'MAINTENANCE', label: 'Under maintenance' },
];

const STATUS_COLORS: Record<string, string> = {
  OPERATIONAL: 'bg-emerald-100 text-emerald-700',
  PARTIALOUTAGE: 'bg-amber-100 text-amber-700',
  MAJOROUTAGE: 'bg-red-100 text-red-700',
  INVESTIGATING: 'bg-amber-100 text-amber-700',
  DEGRADED: 'bg-amber-100 text-amber-700',
  MAINTENANCE: 'bg-sky-100 text-sky-700',
  NOT_FOUND: 'bg-slate-100 text-slate-600',
};

function formatStatus(status: string): string {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function NetworkStatusPanel() {
  const [monitors, setMonitors] = useState<NetworkMonitor[]>([]);
  const [evotelComponents, setEvotelComponents] = useState<EvotelComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [newEvotel, setNewEvotel] = useState('');
  const [newVumatel, setNewVumatel] = useState({ area: '', latitude: '', longitude: '' });
  const [newWireless, setNewWireless] = useState({
    area: '',
    status: 'OPERATIONAL',
    note: '',
  });

  const loadMonitors = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('network_status_monitors')
        .select('*')
        .order('provider')
        .order('area');

      if (error) {
        console.error('Error loading monitors:', error);
      } else {
        setMonitors((data as NetworkMonitor[]) || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEvotelComponents = useCallback(async () => {
    try {
      const components = await networkStatusApi.evotelComponents();
      setEvotelComponents(components);
    } catch (err) {
      console.error('Error loading Evotel components:', err);
      setEvotelComponents([]);
    }
  }, []);

  useEffect(() => {
    loadMonitors();
    loadEvotelComponents();
  }, [loadMonitors, loadEvotelComponents]);

  const evotelComponentFor = (area: string): EvotelComponent | undefined =>
    findEvotelComponent(evotelComponents, area);

  const evotelStatusFor = (area: string, storedStatus: string = 'OPERATIONAL'): string => {
    if (evotelComponents.length === 0) return storedStatus;
    const match = evotelComponentFor(area);
    return match ? match.status : 'OPERATIONAL';
  };

  const addEvotel = async () => {
    const area = newEvotel.trim();
    if (!area) return;

    const match = evotelComponentFor(area);

    if (evotelComponents.length > 0 && !match) {
      alert(`'${area}' is not a valid Evotel area. Please choose from the published Evotel components.`);
      return;
    }

    if (evotelComponents.length === 0) {
      const proceed = window.confirm(
        `Could not load the Evotel component list. Add '${area}' without validation?`
      );
      if (!proceed) return;
    }

    try {
      const { error } = await supabase.from('network_status_monitors').insert({
        provider: 'evotel',
        area: match ? match.name : area,
        status: match ? match.status : 'OPERATIONAL',
        is_active: true,
      });
      if (error) throw error;
      setNewEvotel('');
      await loadMonitors();
    } catch (err: any) {
      alert('Error adding Evotel area: ' + (err.message || 'Unknown error'));
    }
  };

  const addVumatel = async () => {
    const area = newVumatel.area.trim();
    if (!area) return;
    if (!newVumatel.latitude || !newVumatel.longitude) {
      alert('Please enter both latitude and longitude for this Vumatel location.');
      return;
    }
    if (evotelComponents.length > 0 && evotelComponentFor(area)) {
      alert(`'${area}' appears to be an Evotel area. Please add it under Evotel instead.`);
      return;
    }
    try {
      const { error } = await supabase.from('network_status_monitors').insert({
        provider: 'vumatel',
        area: area,
        latitude: parseFloat(newVumatel.latitude),
        longitude: parseFloat(newVumatel.longitude),
        status: 'OPERATIONAL',
        is_active: true,
      });
      if (error) throw error;
      setNewVumatel({ area: '', latitude: '', longitude: '' });
      await loadMonitors();
    } catch (err: any) {
      alert('Error adding Vumatel location: ' + (err.message || 'Unknown error'));
    }
  };

  const addWireless = async () => {
    const area = newWireless.area.trim();
    if (!area) {
      alert('Please enter a wireless site or area name.');
      return;
    }
    if (
      monitors.some(
        (m) => m.provider === 'wireless' && m.area.trim().toLowerCase() === area.toLowerCase()
      )
    ) {
      alert(`'${area}' is already being monitored as a wireless area.`);
      return;
    }
    try {
      const { error } = await supabase.from('network_status_monitors').insert({
        provider: 'wireless',
        area,
        status: newWireless.status,
        note: newWireless.note.trim() || null,
        is_active: true,
      });
      if (error) throw error;
      setNewWireless({ area: '', status: 'OPERATIONAL', note: '' });
      await loadMonitors();
    } catch (err: any) {
      alert('Error adding wireless area: ' + (err.message || 'Unknown error'));
    }
  };

  const updateWirelessStatus = async (id: string, status: string) => {
    setTesting(id);
    try {
      const { error } = await supabase
        .from('network_status_monitors')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await loadMonitors();
    } catch (err: any) {
      alert('Error updating wireless status: ' + (err.message || 'Unknown error'));
    } finally {
      setTesting(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this monitor?')) return;
    try {
      const { error } = await supabase.from('network_status_monitors').delete().eq('id', id);
      if (error) throw error;
      await loadMonitors();
    } catch (err: any) {
      alert('Error removing monitor: ' + (err.message || 'Unknown error'));
    }
  };

  const testVumatel = async (id: string) => {
    setTesting(id);
    try {
      // Placeholder: Vumatel API not yet available, mark as operational
      const { error } = await supabase
        .from('network_status_monitors')
        .update({ status: 'OPERATIONAL', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await loadMonitors();
    } catch (err: any) {
      alert('Error testing Vumatel: ' + (err.message || 'Unknown error'));
    } finally {
      setTesting(null);
    }
  };

  const refreshAll = async () => {
    await loadEvotelComponents();
    setSaving(true);
    try {
      const evotelMonitors = monitors.filter((m) => m.provider === 'evotel');
      for (const monitor of evotelMonitors) {
        const status = evotelStatusFor(monitor.area, monitor.status);
        if (status !== monitor.status) {
          await supabase
            .from('network_status_monitors')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', monitor.id);
        }
      }
      await loadMonitors();
    } finally {
      setSaving(false);
    }
  };

  const evotelMonitors = monitors.filter((m) => m.provider === 'evotel');
  const vumatelMonitors = monitors.filter((m) => m.provider === 'vumatel');
  const wirelessMonitors = monitors.filter((m) => m.provider === 'wireless');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Network Status Administration</h2>
          <p className="text-sm text-slate-500">
            Manage the Evotel areas, Vumatel locations and wireless sites published on the customer-facing network status page.
          </p>
        </div>
        <button
          onClick={refreshAll}
          disabled={saving || loading}
          className="btn-primary text-sm"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <Loader2 className="mx-auto mb-2 animate-spin" size={24} />
          Loading monitors…
        </div>
      ) : (
        <>
          {/* Evotel */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Evotel</h3>
                <h4 className="text-xl font-bold">Monitored areas</h4>
                <p className="text-sm text-slate-500">
                  Enter Evotel component/town names exactly as Evotel publishes them.
                </p>
              </div>
              <button onClick={addEvotel} className="btn-primary text-sm">
                <Plus size={16} /> Add area
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-slate-200 p-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">Area / Town</label>
              <div className="flex gap-2">
                <input
                  value={newEvotel}
                  onChange={(e) => setNewEvotel(e.target.value)}
                  placeholder="e.g. Newcastle"
                  list="evotel-areas"
                  className="input-field flex-1"
                />
                <datalist id="evotel-areas">
                  {evotelComponents.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
                <button onClick={addEvotel} className="btn-primary text-sm">
                  <Plus size={16} /> Add
                </button>
              </div>
              {evotelComponents.length === 0 ? (
                <p className="mt-2 text-xs text-amber-600">
                  Could not load the Evotel public API right now, so names cannot be validated.
                </p>
              ) : newEvotel.trim() && !evotelComponentFor(newEvotel) ? (
                <p className="mt-2 text-xs text-red-600">
                  Not an Evotel area. Pick one of the {evotelComponents.length} published areas.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              {evotelMonitors.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.area}</p>
                    <p className="text-xs text-slate-500">Evotel component</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COLORS[m.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {formatStatus(m.status)}
                    </span>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {evotelMonitors.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">No Evotel areas monitored yet.</p>
              )}
            </div>
          </div>

          {/* Vumatel */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Vumatel</h3>
                <h4 className="text-xl font-bold">Monitored locations</h4>
                <p className="text-sm text-slate-500">
                  Vumatel is coordinate-specific. Use a representative Vumatel-serviced location for each area you want PAT to monitor.
                </p>
              </div>
              <button onClick={addVumatel} className="btn-primary text-sm">
                <Plus size={16} /> Add location
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-slate-200 p-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Area / Town</label>
                  <input
                    value={newVumatel.area}
                    onChange={(e) => setNewVumatel({ ...newVumatel, area: e.target.value })}
                    placeholder="e.g. Newcastle"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Latitude</label>
                  <input
                    value={newVumatel.latitude}
                    onChange={(e) => setNewVumatel({ ...newVumatel, latitude: e.target.value })}
                    placeholder="-27.7191773"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Longitude</label>
                  <input
                    value={newVumatel.longitude}
                    onChange={(e) => setNewVumatel({ ...newVumatel, longitude: e.target.value })}
                    placeholder="29.9454771"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {vumatelMonitors.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.area}</p>
                    <p className="text-xs text-slate-500">
                      {m.latitude && m.longitude ? `${m.latitude}, ${m.longitude}` : 'No coordinates'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COLORS[m.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {formatStatus(m.status)}
                    </span>
                    <button
                      onClick={() => testVumatel(m.id)}
                      disabled={testing === m.id}
                      className="text-sm font-medium text-telecomBlue hover:underline disabled:opacity-50"
                    >
                      {testing === m.id ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                      Test
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {vumatelMonitors.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">No Vumatel locations monitored yet.</p>
              )}
            </div>
          </div>

          {/* Wireless */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                  <Radio size={14} /> Fixed Wireless
                </h3>
                <h4 className="text-xl font-bold">Monitored wireless sites</h4>
                <p className="text-sm text-slate-500">
                  Wireless sites are managed by PAT. Add any tower, suburb or coverage area and set its
                  status manually.
                </p>
              </div>
              <button onClick={addWireless} className="btn-primary text-sm">
                <Plus size={16} /> Add site
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-slate-200 p-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Site / Area name
                  </label>
                  <input
                    value={newWireless.area}
                    onChange={(e) => setNewWireless({ ...newWireless, area: e.target.value })}
                    placeholder="e.g. Newcastle Tower 3"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                  <select
                    value={newWireless.status}
                    onChange={(e) => setNewWireless({ ...newWireless, status: e.target.value })}
                    className="input-field"
                  >
                    {WIRELESS_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Note (optional)
                  </label>
                  <input
                    value={newWireless.note}
                    onChange={(e) => setNewWireless({ ...newWireless, note: e.target.value })}
                    placeholder="e.g. Scheduled upgrade until 18:00"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {wirelessMonitors.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.area}</p>
                    <p className="text-xs text-slate-500">{m.note || 'Fixed wireless site'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COLORS[m.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {formatStatus(m.status)}
                    </span>
                    <select
                      value={m.status}
                      onChange={(e) => updateWirelessStatus(m.id, e.target.value)}
                      disabled={testing === m.id}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm disabled:opacity-50"
                    >
                      {WIRELESS_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {wirelessMonitors.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  No wireless sites monitored yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
