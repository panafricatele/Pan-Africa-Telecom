import { Gauge, MessageCircle } from 'lucide-react';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';

export default function SpeedTestWidget() {
  return (
    <section id="speed" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass-card p-8 lg:p-10">
          <div className="mb-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-telecomBlue">
              <Gauge size={24} />
              <h2 className="text-3xl font-bold md:text-4xl">Speed Test</h2>
            </div>
            <p className="text-slate-600">
              Test your real internet speed right now. Results show your actual download, upload and latency.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <iframe
              src="https://speed.cloudflare.com/"
              title="Internet Speed Test"
              className="h-[520px] w-full border-0"
              allow="fullscreen"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={COMPANY.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Customer Portal
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <MessageCircle size={16} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
