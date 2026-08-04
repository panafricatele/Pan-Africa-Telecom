import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Send } from 'lucide-react';
import { COMPANY } from '../lib/constants';
import { leadApi } from '../lib/api';
import { LeadRequest } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const INTERESTS = [
  'Home Internet',
  'Business Internet',
  'Global Connectivity',
  'VoIP & SMS',
  'Renewable Solar Energy',
  'General Enquiry',
];

export default function Signup() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<LeadRequest>({
    fullName: '',
    email: '',
    phone: '',
    serviceInterest: params.get('service') || 'General Enquiry',
    location: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const service = params.get('service');
    if (service) {
      setForm((f) => ({ ...f, serviceInterest: service }));
    }
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await leadApi.signup(form);
      setStatus('success');
      setForm({ fullName: '', email: '', phone: '', serviceInterest: 'General Enquiry', location: '', message: '' });
    } catch {
      setStatus('idle');
      alert('Could not submit. Please try again or WhatsApp us.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold md:text-5xl">Sign up for a service</h1>
              <p className="mt-4 text-lg text-slate-600">
                Fill in your details and a local engineer will call you back with availability and next steps.
              </p>
            </div>

            <form onSubmit={submit} className="glass-card space-y-5 p-6 lg:p-10">
              {status === 'success' ? (
                <div className="rounded-xl bg-fibreEmerald/10 p-6 text-center text-fibreEmerald">
                  <CheckCircle className="mx-auto mb-2" size={32} />
                  <h2 className="text-xl font-bold">Thanks, {COMPANY.name} received your enquiry</h2>
                  <p className="mt-1 text-sm">We will call or email you within one business day.</p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-secondary mt-4 text-sm"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Full name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="input-field"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                    />
                    <input
                      required
                      placeholder="Town / street address"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Service interest</label>
                    <select
                      value={form.serviceInterest}
                      onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
                      className="input-field"
                    >
                      {INTERESTS.map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Tell us more about what you need"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field"
                  />

                  <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
                    {status === 'submitting' ? 'Sending…' : <><Send size={16} /> Send Enquiry</>}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
