import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PkgRow {
  id: string;
  category: string;
  technologies: string[];
  name: string;
  tagline: string | null;
  price: number;
  price_label: string;
  speed: string | null;
  uncapped: boolean;
  features: string[];
  demand_range: number[];
}

interface CoverageArea {
  id: string;
  city: string;
  area: string;
  technologies: string[];
  package_ids: string[];
  is_active: boolean;
}

export function CoveragePanel() {
  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CoverageArea | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: areasData, error: areasError } = await supabase
        .from('coverage_areas')
        .select('*')
        .order('city')
        .order('area');
      const { data: pkgsData, error: pkgsError } = await supabase
        .from('packages')
        .select('*')
        .order('name');
      
      if (areasError) console.error('Error loading areas:', areasError);
      if (pkgsError) console.error('Error loading packages:', pkgsError);
      
      setAreas((areasData as CoverageArea[]) || []);
      setPackages((pkgsData as PkgRow[]) || []);
    } catch (err) {
      console.error('Error in load:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (area: CoverageArea) => {
    try {
      const isNew = !area.id || area.id === '';
      if (isNew) {
        // Omit id field for new areas - let database generate UUID
        const { id, ...areaWithoutId } = area;
        const { error } = await supabase.from('coverage_areas').insert(areaWithoutId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('coverage_areas').update(area).eq('id', area.id);
        if (error) throw error;
      }
      setEditing(null);
      await load();
    } catch (err: any) {
      alert('Error saving coverage area: ' + (err.message || 'Unknown error'));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this coverage area?')) return;
    try {
      const { error } = await supabase.from('coverage_areas').delete().eq('id', id);
      if (error) throw error;
      await load();
    } catch (err: any) {
      alert('Error deleting coverage area: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <>
      <div className="mb-4">
        <button onClick={() => setEditing({ id: '', city: '', area: '', technologies: [], package_ids: [], is_active: true })} className="btn-primary text-sm">
          <Plus size={16} /> Add Coverage Area
        </button>
      </div>

      {editing && (
        <CoverageForm
          initial={editing}
          packages={packages}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="mx-auto animate-spin text-telecomBlue" size={24} /></div>
      ) : areas.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No coverage areas defined. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Technologies</th>
                <th className="px-4 py-3">Packages</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {areas.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium">{a.city}</td>
                  <td className="px-4 py-3">{a.area}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.technologies.map((t) => (
                        <span key={t} className="rounded-full bg-telecomBlue/10 px-2 py-0.5 text-xs font-medium text-telecomBlue">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{a.package_ids.length} package(s)</td>
                  <td className="px-4 py-3">{a.is_active ? '✓' : '✗'}</td>
                  <td className="flex justify-end gap-2 px-4 py-3">
                    <button onClick={() => setEditing(a)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-telecomBlue">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(a.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

interface CoverageFormProps {
  initial: CoverageArea;
  packages: PkgRow[];
  onSave: (area: CoverageArea) => void;
  onCancel: () => void;
}

function CoverageForm({ initial, packages, onSave, onCancel }: CoverageFormProps) {
  const [area, setArea] = useState(initial);
  const isNew = !initial.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.city.trim() || !area.area.trim()) {
      alert('City and area are required');
      return;
    }
    onSave(area);
  };

  const toggleTech = (tech: string) => {
    setArea({
      ...area,
      technologies: area.technologies.includes(tech)
        ? area.technologies.filter((t) => t !== tech)
        : [...area.technologies, tech],
    });
  };

  const togglePackage = (pkgId: string) => {
    setArea({
      ...area,
      package_ids: area.package_ids.includes(pkgId)
        ? area.package_ids.filter((p) => p !== pkgId)
        : [...area.package_ids, pkgId],
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold">{isNew ? 'Add Coverage Area' : 'Edit Coverage Area'}</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">City *</label>
          <input value={area.city} onChange={(e) => setArea({ ...area, city: e.target.value })} className="input-field" placeholder="e.g. Newcastle" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Area *</label>
          <input value={area.area} onChange={(e) => setArea({ ...area, area: e.target.value })} className="input-field" placeholder="e.g. Riverside Industrial" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium text-slate-600">Technologies</label>
          <div className="flex flex-wrap gap-2">
            {['fibre', 'fixed-wireless', 'lte'].map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  area.technologies.includes(tech)
                    ? 'bg-telecomBlue text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tech === 'fixed-wireless' ? 'Fixed Wireless' : tech.charAt(0).toUpperCase() + tech.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium text-slate-600">Available Packages</label>
          <div className="max-h-40 overflow-y-auto space-y-2 rounded border border-slate-200 p-3">
            {packages.length === 0 ? (
              <p className="text-xs text-slate-500">No packages available</p>
            ) : (
              packages.map((pkg) => (
                <label key={pkg.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={area.package_ids.includes(pkg.id)}
                    onChange={() => togglePackage(pkg.id)}
                    className="rounded border-slate-300"
                  />
                  <span>{pkg.name} ({pkg.category})</span>
                </label>
              ))
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={area.is_active}
              onChange={(e) => setArea({ ...area, is_active: e.target.checked })}
              className="rounded border-slate-300"
            />
            <span className="font-medium text-slate-600">Active</span>
          </label>
        </div>
        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm"><X size={14} /> Cancel</button>
          <button type="submit" className="btn-primary text-sm"><Save size={14} /> {isNew ? 'Create' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
