import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import NetworkMap from '../components/NetworkMap';
import ServiceExplorer from '../components/ServiceExplorer';
import SpeedTestWidget from '../components/SpeedTestWidget';
import ContactAndSupport from '../components/ContactAndSupport';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <NetworkMap />
        <section id="packages">
          <ServiceExplorer />
        </section>
        <SpeedTestWidget />
        <ContactAndSupport />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
