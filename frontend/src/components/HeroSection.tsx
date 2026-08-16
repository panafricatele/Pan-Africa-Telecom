import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { COMPANY } from '../lib/constants';

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50 pt-10 pb-24 lg:pt-20 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-telecomBlue/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-telecomBlue/30 bg-telecomBlue/10 px-4 py-1.5 text-xs font-semibold text-telecomBlue">
              <span className="h-2 w-2 rounded-full bg-fibreEmerald animate-pulse" />
              ICASA Licensed ISP • AS {COMPANY.icasaLicense.match(/AS:\s*([0-9]+)/)?.[1] ?? '329467'}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Real connections.{' '}
              <span className="text-telecomBlue">Real people.</span>{' '}
              <span className="text-fibreEmerald">Real coverage.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              From Newcastle across KwaZulu-Natal, our team designs, installs and supports Fibre, Fixed Wireless, LTE and ICT networks for homes, schools, businesses and communities. No chatbots — just local engineers and a 24/7 network operations centre.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <Wifi size={18} /> Explore packages
              </button>
              <a href={COMPANY.portalUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Customer Portal
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="photo-frame">
              <img
                src="/images/aerial-site.jpg"
                alt="Pan Africa Telecom technicians installing equipment on a tower"
                className="h-64 w-full object-cover"
              />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
