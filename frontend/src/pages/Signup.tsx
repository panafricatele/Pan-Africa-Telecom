import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const SPLYNX_SIGNUP_IFRAME_SRC =
  'https://portal.panafricatelecom.co.za/admin/crm/sign-up?selected_internet=0&selected_voice=0&selected_recurring=0&selected_bundle=0&formTitle=Signup&formButtonText=Signup&submitThanks=Thank%20you%20for%20your%20sign%20up!%20%0A%0AOne%20of%20our%20admin%20will%20contact%20you%20shortly.%20%0AWhatsApp%3A%200871525695&required_tariff=1&vat_included=0&partner_id=1&admin_id=0&crm_status=1&location=1&show_form_terms=1&form_terms_template=86&required_first_name=1&required_last_name=1&required_email=1&required_phone=1&required_street=1&required_city=1&required_zip=0&required_referrer=0';

export default function Signup() {
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

            <div className="glass-card overflow-hidden p-0">
              <iframe
                data-widget-type="embedded"
                title="Pan Africa Telecom Signup"
                width="100%"
                height="900"
                src={SPLYNX_SIGNUP_IFRAME_SRC}
                frameBorder="0"
                id="splynx-signup-widget-frame"
                className="block w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
