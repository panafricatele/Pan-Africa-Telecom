import { AlertCircle, LifeBuoy, MessageSquare, Phone } from 'lucide-react';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SplynxFeedbackWidget from '../components/SplynxFeedbackWidget';

export default function Support() {
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

            <div className="glass-card space-y-6 p-6 text-center lg:p-10">
              <LifeBuoy className="mx-auto text-telecomBlue" size={40} />
              <div>
                <h2 className="text-xl font-bold">Log a ticket with our support widget</h2>
                <p className="mt-2 text-slate-600">
                  Click the <span className="font-semibold text-[#d22f4c]">Support</span> button in the bottom-left
                  corner of your screen to open our ticket form. It goes straight into our helpdesk so a technician can
                  action it as soon as possible.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-telecomBlue/10 p-4 text-left text-sm text-telecomBlue">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>After-hours emergency? Call {COMPANY.phone} or WhatsApp us for urgent faults.</p>
              </div>

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <a href={`tel:${COMPANY.phone}`} className="btn-primary">
                  <Phone size={16} />
                  Call {COMPANY.phone}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <MessageSquare size={16} />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <SplynxFeedbackWidget />
    </div>
  );
}
