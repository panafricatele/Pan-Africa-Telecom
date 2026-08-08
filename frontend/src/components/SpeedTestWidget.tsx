import { ExternalLink, Gauge, MessageCircle } from 'lucide-react';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';

const SPEED_TESTS = [
  { name: 'Fast.com', url: 'https://fast.com', desc: 'Powered by Netflix' },
  { name: 'Speedtest.net', url: 'https://www.speedtest.net', desc: 'By Ookla' },
  { name: 'Cloudflare', url: 'https://speed.cloudflare.com', desc: 'By Cloudflare' },
];

export default function SpeedTestWidget() {
  return (
    <section id="speed" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass-card p-8 lg:p-10">
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-telecomBlue">
              <Gauge size={24} />
              <h2 className="text-3xl font-bold md:text-4xl">Test Your Speed</h2>
            </div>
            <p className="text-slate-600">
              Check your real internet speed using any of these trusted speed test tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {SPEED_TESTS.map((test) => (
              <a
                key={test.name}
                href={test.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center transition hover:border-telecomBlue hover:shadow-lg"
              >
                <Gauge className="text-telecomBlue transition group-hover:scale-110" size={32} />
                <div>
                  <p className="text-lg font-bold">{test.name}</p>
                  <p className="text-xs text-slate-500">{test.desc}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-telecomBlue">
                  Run Test <ExternalLink size={14} />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
