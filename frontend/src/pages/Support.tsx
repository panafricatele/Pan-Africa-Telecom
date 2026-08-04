import { useState } from 'react';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';
import { COMPANY } from '../lib/constants';
import { ticketsApi } from '../lib/api';
import { TicketRequest } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SplynxFeedbackWidget from '../components/SplynxFeedbackWidget';

const TICKET_TYPES = [
  { id: 'technical', label: 'Technical fault' },
  { id: 'billing', label: 'Billing enquiry' },
  { id: 'sales', label: 'Sales / upgrade' },
  { id: 'general', label: 'General question' },
] as const;

export default function Support() {
  const [form, setForm] = useState<TicketRequest>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    ticketType: 'technical',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await ticketsApi.create(form);
      setStatus('success');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '', ticketType: 'technical' });
    } catch {
      setStatus('idle');
      alert('Could not submit ticket. Please try again or WhatsApp us.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold md:text-5xl">Log a support ticket</h1>
              <p className="mt-4 text-lg text-slate-600">
                Tell us what is wrong and a local engineer will get back to you. For emergencies, call or WhatsApp us directly.
              </p>
            </div>

            <form onSubmit={submit} className="glass-card space-y-5 p-6 lg:p-10">
              {status === 'success' ? (
                <div className="rounded-xl bg-fibreEmerald/10 p-6 text-center text-fibreEmerald">
                  <CheckCircle className="mx-auto mb-2" size={32} />
                  <h2 className="text-xl font-bold">Ticket logged</h2>
                  <p className="mt-1 text-sm">Our support team will contact you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-secondary mt-4 text-sm"
                  >
                    Log another ticket
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
                  <input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Ticket type</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {TICKET_TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setForm({ ...form, ticketType: t.id })}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                            form.ticketType === t.id
                              ? 'border-telecomBlue bg-telecomBlue/10 text-telecomBlue'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    required
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                  />

                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field"
                  />

                  <div className="flex items-start gap-3 rounded-xl bg-telecomBlue/10 p-4 text-sm text-telecomBlue">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>After-hours emergency? Call {COMPANY.phone} or WhatsApp us for urgent faults.</p>
                  </div>

                  <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
                    {status === 'submitting' ? 'Sending…' : <><Send size={16} /> Submit Ticket</>}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <SplynxFeedbackWidget />
    </div>
  );
}
