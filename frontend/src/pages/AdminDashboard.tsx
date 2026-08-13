import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Smartphone, Plus, Pencil, Trash2, Save, X, Loader2, Upload, MapPin,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CoveragePanel } from './CoveragePanel';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

interface ProductRow {
  id: string;
  slug: string;
  category: string;
  name: string;
  brand: string;
  model: string;
  color: string;
  color_code: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  image: string;
  description: string;
  specs: Record<string, string>;
}

const PACKAGE_CATEGORIES = ['internet', 'fibre', 'lte', 'global', 'voice', 'solar'] as const;
const PRODUCT_CATEGORIES = ['phone', 'equipment'] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function emptyPkg(): PkgRow {
  return {
    id: '', category: 'internet', technologies: [], name: '', tagline: '',
    price: 0, price_label: '/ month', speed: '', uncapped: false,
    features: [], demand_range: [0, 0],
  };
}

function emptyProduct(): ProductRow {
  return {
    id: '', slug: '', category: 'phone', name: '', brand: '', model: '',
    color: '', color_code: '#000000', price: 0, compare_at_price: null,
    stock: 0, image: '', description: '', specs: {},
  };
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type Tab = 'packages' | 'products' | 'coverage';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('packages');

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-telecomBlue" size={32} />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <LayoutDashboard className="text-telecomBlue" size={28} />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setTab('packages')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === 'packages'
                ? 'border-telecomBlue text-telecomBlue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Package size={16} /> Service Packages
          </button>
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === 'products'
                ? 'border-telecomBlue text-telecomBlue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone size={16} /> Products
          </button>
          <button
            onClick={() => setTab('coverage')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === 'coverage'
                ? 'border-telecomBlue text-telecomBlue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapPin size={16} /> Coverage Areas
          </button>
        </div>

        {tab === 'packages' ? <PackagesPanel /> : tab === 'products' ? <ProductsPanel /> : <CoveragePanel />}
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================== */
/*  Packages Panel                                                     */
/* ================================================================== */

function PackagesPanel() {
  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PkgRow | null>(null);
  const [filterCat, setFilterCat] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('packages')
      .select('*')
      .order('category')
      .order('price');
    setPackages((data as PkgRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (pkg: PkgRow) => {
    const isNew = !packages.find((p) => p.id === pkg.id);
    if (isNew) {
      await supabase.from('packages').insert(pkg);
    } else {
      await supabase.from('packages').update(pkg).eq('id', pkg.id);
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await supabase.from('packages').delete().eq('id', id);
    load();
  };

  const filtered = filterCat ? packages.filter((p) => p.category === filterCat) : packages;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setEditing(emptyPkg())} className="btn-primary text-sm">
          <Plus size={16} /> Add Package
        </button>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="">All categories</option>
          {PACKAGE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {editing && (
        <PackageForm
          initial={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="mx-auto animate-spin text-telecomBlue" size={24} /></div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No packages found. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">Uncapped</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-telecomBlue/10 px-2 py-0.5 text-xs font-medium text-telecomBlue">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">R{p.price.toLocaleString()} {p.price_label}</td>
                  <td className="px-4 py-3">{p.speed || '—'}</td>
                  <td className="px-4 py-3">{p.uncapped ? 'Yes' : 'No'}</td>
                  <td className="flex justify-end gap-2 px-4 py-3">
                    <button onClick={() => setEditing(p)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-telecomBlue">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(p.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
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

/* ------------------------------------------------------------------ */
/*  Package form                                                       */
/* ------------------------------------------------------------------ */

function PackageForm({ initial, onSave, onCancel }: {
  initial: PkgRow;
  onSave: (p: PkgRow) => void;
  onCancel: () => void;
}) {
  const [pkg, setPkg] = useState<PkgRow>({ ...initial });
  const [featuresText, setFeaturesText] = useState(initial.features.join('\n'));
  const [techText, setTechText] = useState(initial.technologies.join(', '));
  const isNew = !initial.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = isNew ? slugify(pkg.category + '-' + pkg.name) : pkg.id;
    onSave({
      ...pkg,
      id,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      technologies: techText.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-telecomBlue/20 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">{isNew ? 'Add Package' : `Edit: ${initial.name}`}</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
          <input required value={pkg.name} onChange={(e) => setPkg({ ...pkg, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Category *</label>
          <select value={pkg.category} onChange={(e) => setPkg({ ...pkg, category: e.target.value })} className="input-field">
            {PACKAGE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Price *</label>
          <input type="number" required min={0} step="0.01" value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: +e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Price Label</label>
          <input value={pkg.price_label} onChange={(e) => setPkg({ ...pkg, price_label: e.target.value })} className="input-field" placeholder="/ month" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Speed</label>
          <input value={pkg.speed || ''} onChange={(e) => setPkg({ ...pkg, speed: e.target.value || null })} className="input-field" placeholder="e.g. 25 Mbps" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Technologies (comma-separated)</label>
          <input value={techText} onChange={(e) => setTechText(e.target.value)} className="input-field" placeholder="fibre, fixed-wireless" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">Tagline</label>
          <input value={pkg.tagline || ''} onChange={(e) => setPkg({ ...pkg, tagline: e.target.value })} className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">Features (one per line)</label>
          <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="input-field" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={pkg.uncapped} onChange={(e) => setPkg({ ...pkg, uncapped: e.target.checked })} id="uncapped" className="h-4 w-4 rounded border-slate-300" />
          <label htmlFor="uncapped" className="text-sm font-medium text-slate-700">Uncapped</label>
        </div>
        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm"><X size={14} /> Cancel</button>
          <button type="submit" className="btn-primary text-sm"><Save size={14} /> {isNew ? 'Create' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}

/* ================================================================== */
/*  Products Panel                                                     */
/* ================================================================== */

function ProductsPanel() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [filterCat, setFilterCat] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('name');
    setProducts((data as ProductRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (prod: ProductRow) => {
    const isNew = !products.find((p) => p.id === prod.id);
    if (isNew) {
      await supabase.from('products').insert(prod);
    } else {
      await supabase.from('products').update(prod).eq('id', prod.id);
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const filtered = filterCat ? products.filter((p) => p.category === filterCat) : products;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setEditing(emptyProduct())} className="btn-primary text-sm">
          <Plus size={16} /> Add Product
        </button>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="">All categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="mx-auto animate-spin text-telecomBlue" size={24} /></div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No products found. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt="" className="h-8 w-8 rounded object-contain bg-white" />}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-fibreEmerald/10 px-2 py-0.5 text-xs font-medium text-fibreEmerald">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3">R{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="flex justify-end gap-2 px-4 py-3">
                    <button onClick={() => setEditing(p)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-telecomBlue">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(p.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
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

/* ------------------------------------------------------------------ */
/*  Product form                                                       */
/* ------------------------------------------------------------------ */

function ProductForm({ initial, onSave, onCancel }: {
  initial: ProductRow;
  onSave: (p: ProductRow) => void;
  onCancel: () => void;
}) {
  const [prod, setProd] = useState<ProductRow>({ ...initial });
  const [specsText, setSpecsText] = useState(
    Object.entries(initial.specs).map(([k, v]) => `${k}: ${v}`).join('\n')
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNew = !initial.id;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'webp';
      const path = `products/${Date.now()}-${slugify(prod.name || 'product')}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
      setProd({ ...prod, image: publicUrl });
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = isNew ? slugify(prod.brand + '-' + prod.model + '-' + prod.color) : prod.id;
    const slug = isNew ? slugify(prod.name) : prod.slug;
    const specs: Record<string, string> = {};
    specsText.split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });
    onSave({ ...prod, id, slug, specs });
  };

  return (
    <div className="mb-6 rounded-xl border border-fibreEmerald/20 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">{isNew ? 'Add Product' : `Edit: ${initial.name}`}</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
          <input required value={prod.name} onChange={(e) => setProd({ ...prod, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Category *</label>
          <select value={prod.category} onChange={(e) => setProd({ ...prod, category: e.target.value })} className="input-field">
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Brand *</label>
          <input required value={prod.brand} onChange={(e) => setProd({ ...prod, brand: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Model *</label>
          <input required value={prod.model} onChange={(e) => setProd({ ...prod, model: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Price *</label>
          <input type="number" required min={0} step="0.01" value={prod.price} onChange={(e) => setProd({ ...prod, price: +e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Compare-at Price</label>
          <input type="number" min={0} step="0.01" value={prod.compare_at_price ?? ''} onChange={(e) => setProd({ ...prod, compare_at_price: e.target.value ? +e.target.value : null })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Stock *</label>
          <input type="number" required min={0} value={prod.stock} onChange={(e) => setProd({ ...prod, stock: +e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Image</label>
          <div className="flex gap-2">
            <input value={prod.image} onChange={(e) => setProd({ ...prod, image: e.target.value })} className="input-field flex-1" placeholder="URL or upload" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary flex items-center gap-1 text-xs whitespace-nowrap"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {prod.image && <img src={prod.image} alt="Preview" className="mt-2 h-16 w-16 rounded border object-contain bg-white" />}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
          <input value={prod.color} onChange={(e) => setProd({ ...prod, color: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Color Code</label>
          <div className="flex gap-2">
            <input type="color" value={prod.color_code} onChange={(e) => setProd({ ...prod, color_code: e.target.value })} className="h-10 w-10 cursor-pointer rounded border border-slate-200 p-0.5" />
            <input value={prod.color_code} onChange={(e) => setProd({ ...prod, color_code: e.target.value })} className="input-field flex-1" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
          <textarea rows={2} value={prod.description} onChange={(e) => setProd({ ...prod, description: e.target.value })} className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">Specs (Key: Value, one per line)</label>
          <textarea rows={5} value={specsText} onChange={(e) => setSpecsText(e.target.value)} className="input-field" placeholder="Display: 6.88&quot; HD+&#10;Battery: 5100mAh" />
        </div>
        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm"><X size={14} /> Cancel</button>
          <button type="submit" className="btn-primary text-sm"><Save size={14} /> {isNew ? 'Create' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
