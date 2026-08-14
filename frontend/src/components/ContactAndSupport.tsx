import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send, type LucideIcon } from 'lucide-react';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';
import { leadApi } from '../lib/api';
import { LeadRequest } from '../types';

function ContactRow({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-start gap-4 rounded-xl p-4 transition hover:bg-slate-100">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-telecomBlue/10 text-telecomBlue">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </a>
  );
}

export default function ContactAndSupport() {
  const [form, setForm] = useState<LeadRequest>({
    fullName: '',
    email: '',
    phone: '',
    serviceInterest: 'General enquiry',
    location: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await leadApi.signup(form);
      setStatus('success');
      setForm({ fullName: '', email: '', phone: '', serviceInterest: 'General enquiry', location: '', message: '' });
    } catch {
      setStatus('idle');
      alert('Could not send enquiry. Please call or WhatsApp us.');
    }
  };

  return (
    <section id="contact" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Talk to a real person</h2>
            <p className="mt-3 text-slate-600">
              Feasibility checks, quotes, installations and support are handled by our team in Newcastle. Call, WhatsApp or send a message and a local engineer will get back to you.
            </p>

            <div className="photo-frame mt-6">
              <img
                src="/images/support.jpg"
                alt="Friendly customer support representative"
                className="h-56 w-full object-cover brightness-105 contrast-110"
              />
            </div>

            <div className="mt-8 space-y-2">
              <ContactRow
                icon={MapPin}
                label="Office"
                value={COMPANY.address}
                href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`}
              />
              <ContactRow icon={Phone} label="Phone" value={COMPANY.phone} href={`tel:${COMPANY.phone}`} />
              <ContactRow icon={MessageCircle} label="WhatsApp" value={COMPANY.whatsapp} href={WHATSAPP_LINK} />
              <ContactRow icon={Mail} label="Email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
            </div>
          </div>

          <form onSubmit={submit} className="glass-card space-y-4 p-8">
            {status === 'success' ? (
              <div className="rounded-xl bg-fibreEmerald/10 p-6 text-fibreEmerald">
                <h3 className="font-bold">Enquiry received</h3>
                <p className="mt-1 text-sm">Our team will respond within one business day.</p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-secondary mt-4 text-sm">
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
                <input
                  placeholder="Service interest (e.g. SD-WAN, 50 Mbps Fibre, Solar)"
                  value={form.serviceInterest}
                  onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
                  className="input-field"
                />
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field"
                />
                <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
                  {status === 'submitting' ? 'Sending...' : <><Send size={16} /> Send enquiry</>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
