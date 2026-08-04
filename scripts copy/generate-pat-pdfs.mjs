import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "documents");
const SHOT_DIR = path.resolve(OUT_DIR, "shots");
const BASE = "http://127.0.0.1:5173";

const PROVIDER = {
  name: "Ntuthuko Smith",
  tagline: "Web & Software Development",
  email: "ntuthukosmith10@gmail.com",
  phone: "+27 67 711 5581",
  location: "KZN, South Africa",
};

const CLIENT = {
  name: "Pan Africa Telecom",
  contact: "Attn: Management",
  address1: "26 Marconi Drive, Riverside Industrial",
  address2: "Newcastle, 2940, South Africa",
  email: "info@PanAfricaTelecom.co.za",
};

const COMPANY = {
  name: "Pan Africa Telecom",
  slogan: "Connecting the Unserved & Underserved of Sub-Saharan Africa",
  address: "26 Marconi Drive, Riverside Industrial, Newcastle, 2940, South Africa",
  phone: "034-0085055",
  whatsapp: "0871525695",
  email: "info@PanAfricaTelecom.co.za",
  portalUrl: "https://portal.panafricatelecom.co.za",
  icasa: "ICASA License No: 2411/CECNS/CECN/FEB/2023 | AS: 328583",
};

const fmt = (n) =>
  "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function inWords(n) {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const triplet = (num) => {
    let s = "";
    if (num >= 100) { s += ones[Math.floor(num / 100)] + " hundred"; num %= 100; if (num) s += " and "; }
    if (num >= 20) { s += tens[Math.floor(num / 10)]; if (num % 10) s += "-" + ones[num % 10]; }
    else if (num > 0) { s += ones[num]; }
    return s;
  };
  if (n === 0) return "zero";
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  let w = "";
  if (thousands) w += triplet(thousands) + " thousand";
  if (thousands && rest) w += " ";
  if (rest) w += triplet(rest);
  return w.replace(/\b\w/g, (c) => c.toUpperCase());
}

const today = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

// ── Shared design tokens ──────────────────────────────────────────────

const sharedHead = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
`;

// ── SCOPE PROPOSAL HTML ───────────────────────────────────────────────

const PROPOSAL_HTML = `<!doctype html>
<html><head><meta charset="utf-8"/>${sharedHead}<style>
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #0f172a; background: white; }
h1, h2, h3 { font-family: 'Poppins', sans-serif; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.page { width: 210mm; min-height: 297mm; padding: 16mm 18mm 14mm; background: white; position: relative; page-break-after: always; }
.page:last-child { page-break-after: auto; }
.brand-strip { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 5mm; border-bottom: 2pt solid #0f172a; margin-bottom: 9mm; }
.brand-name { font-family: 'Poppins', sans-serif; font-size: 15pt; font-weight: 800; line-height: 1; letter-spacing: -0.03em; color: #0f172a; }
.brand-name span { color: #0088FF; }
.brand-sub { font-size: 7pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.5); margin-top: 1.5mm; }
.page-num { font-size: 7.5pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.45); }
.cover { padding: 0; min-height: 297mm; background: #0f172a; display: flex; flex-direction: column; }
.cover-inner { padding: 22mm 18mm; display: flex; flex-direction: column; flex: 1; }
.cover .top-meta { display: flex; justify-content: space-between; align-items: flex-start; font-size: 8pt; color: rgba(255,255,255,0.35); letter-spacing: 0.22em; text-transform: uppercase; font-family: 'Inter', sans-serif; }
.cover .brand-name { color: white; font-size: 16pt; }
.cover .brand-name span { color: #0088FF; }
.cover .center { margin-top: auto; margin-bottom: auto; }
.cover .kicker { font-size: 8pt; letter-spacing: 0.35em; text-transform: uppercase; color: #0088FF; margin-bottom: 8mm; font-weight: 700; }
.cover h1 { font-size: 34pt; line-height: 1.1; color: #fff; max-width: 155mm; }
.cover .sub { font-size: 11pt; font-weight: 300; color: rgba(255,255,255,0.62); line-height: 1.65; max-width: 150mm; margin-top: 10mm; }
.cover .for { margin-top: 14mm; font-size: 8pt; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.cover .for b { color: #fff; letter-spacing: 0; font-family: 'Poppins', sans-serif; font-size: 13pt; font-weight: 700; text-transform: none; display: block; margin-top: 2mm; }
.cover .pill { display: inline-flex; align-items: center; gap: 2mm; background: rgba(0,136,255,0.12); border: 1px solid rgba(0,136,255,0.3); color: #0088FF; font-size: 7.5pt; padding: 1.5mm 4mm; border-radius: 99pt; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; margin-top: 10mm; }
.cover .footer-meta { margin-top: auto; padding-top: 12mm; border-top: 1px solid rgba(255,255,255,0.12); display: flex; justify-content: space-between; font-size: 8pt; color: rgba(255,255,255,0.35); }
.section-kicker { font-size: 8pt; letter-spacing: 0.3em; text-transform: uppercase; color: #0088FF; margin-bottom: 4mm; font-weight: 700; }
.section-title { font-size: 22pt; color: #0f172a; line-height: 1.1; margin-bottom: 5mm; max-width: 160mm; }
.section-lead { font-size: 10pt; color: rgba(15,23,42,0.72); line-height: 1.65; max-width: 165mm; font-weight: 400; margin-bottom: 10mm; }
.issues { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.issue-card { padding: 5mm 6mm 5mm; background: #f8fafc; border: 1px solid rgba(15,23,42,0.1); border-radius: 4pt; border-left: 2.5pt solid #ef4444; position: relative; }
.issue-card .num { position: absolute; top: 4mm; right: 5mm; font-family: 'Poppins', sans-serif; font-size: 18pt; color: rgba(239,68,68,0.12); font-weight: 800; line-height: 1; }
.issue-card .h { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 700; color: #0f172a; margin-bottom: 2mm; line-height: 1.25; padding-right: 10mm; }
.issue-card .b { font-size: 8pt; line-height: 1.55; color: rgba(15,23,42,0.72); }
.fixes { margin-top: 2mm; }
.fix-row { display: grid; grid-template-columns: 38% 1fr; gap: 6mm; padding: 5mm 0; border-bottom: 1px solid rgba(15,23,42,0.1); align-items: flex-start; }
.fix-row:first-child { border-top: 2pt solid #0f172a; padding-top: 5mm; }
.fix-row .issue-tag { font-size: 7pt; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(239,68,68,0.85); margin-bottom: 1.5mm; font-weight: 700; }
.fix-row .issue-name { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 600; color: rgba(15,23,42,0.5); text-decoration: line-through; text-decoration-color: rgba(239,68,68,0.5); }
.fix-row .arrow { font-size: 9pt; color: rgba(15,23,42,0.35); margin-top: 3mm; }
.fix-row .fix-tag { font-size: 7pt; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; margin-bottom: 1.5mm; font-weight: 700; }
.fix-row .fix-name { font-family: 'Poppins', sans-serif; font-size: 11pt; font-weight: 700; color: #0f172a; margin-bottom: 2mm; }
.fix-row .fix-detail { font-size: 8.5pt; line-height: 1.55; color: rgba(15,23,42,0.72); }
.impact { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 9mm; }
.impact-tile { padding: 6mm; background: #f8fafc; border-radius: 4pt; border-top: 2.5pt solid #10B981; }
.impact-tile .label { font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(15,23,42,0.55); margin-bottom: 2mm; font-weight: 600; }
.impact-tile .value { font-family: 'Poppins', sans-serif; font-size: 18pt; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 3mm; }
.impact-tile .why { font-size: 8.5pt; line-height: 1.55; color: rgba(15,23,42,0.72); }
.timeline { margin-top: 2mm; }
.time-row { display: grid; grid-template-columns: 30mm 1fr; gap: 4mm; padding: 4mm 0; border-bottom: 1px dashed rgba(15,23,42,0.15); }
.time-row:first-child { border-top: 1px dashed rgba(15,23,42,0.15); }
.time-row .wk { font-family: 'Poppins', sans-serif; font-size: 9.5pt; color: #0088FF; font-weight: 700; }
.time-row .t { font-size: 9.5pt; font-weight: 700; color: #0f172a; margin-bottom: 1mm; font-family: 'Poppins', sans-serif; }
.time-row .d { font-size: 8.5pt; line-height: 1.5; color: rgba(15,23,42,0.72); }
.close { margin-top: 8mm; padding: 7mm 8mm; background: #0f172a; color: white; border-radius: 6pt; }
.close h3 { font-family: 'Poppins', sans-serif; font-size: 15pt; font-weight: 800; margin-bottom: 3mm; }
.close p { font-size: 9.5pt; line-height: 1.65; color: rgba(255,255,255,0.75); margin: 0 0 4mm; }
.close .cta { display: flex; gap: 8mm; margin-top: 5mm; font-size: 8.5pt; line-height: 1.6; }
.close .cta b { color: #10B981; font-family: 'Poppins', sans-serif; font-size: 11pt; font-weight: 700; display: block; margin-bottom: 1mm; }
.close .signature { margin-top: 6mm; padding-top: 5mm; border-top: 1px solid rgba(255,255,255,0.15); font-size: 8pt; color: rgba(255,255,255,0.45); letter-spacing: 0.12em; text-transform: uppercase; }
</style></head><body>

<section class="page cover">
  <div class="cover-inner">
    <div class="top-meta">
      <div class="brand-name">${CLIENT.name} <span>Project</span></div>
      <div>PROP-2026-001</div>
    </div>
    <div class="center">
      <div class="kicker">Website, Phone Shop &middot; PayFast Checkout</div>
      <h1>Modern website, phone shop & PayFast checkout for ${CLIENT.name}.</h1>
      <p class="sub">A proposal to design and build a multi-page React website with a light theme, an online phone shop with cart functionality, a PayFast payment backend, a support ticket page and a dedicated service sign-up page.</p>
      <div class="for">Prepared for <b>${CLIENT.name} &middot; ${CLIENT.contact}</b></div>
      <div class="pill">${COMPANY.icasa}</div>
    </div>
    <div class="footer-meta">
      <div>${PROVIDER.name} &middot; ${PROVIDER.tagline}</div>
      <div>${PROVIDER.email}</div>
    </div>
  </div>
</section>

<section class="page">
  <div class="brand-strip">
    <div><div class="brand-name">${CLIENT.name} <span>Project</span></div><div class="brand-sub">Proposal &middot; Project scope</div></div>
    <div class="page-num">02 &middot; Scope</div>
  </div>
  <div class="section-kicker">01 &middot; What is included</div>
  <h2 class="section-title">Deliverables and in-scope work.</h2>
  <p class="section-lead">The engagement covers front-end design and build, back-end API additions, cart and payment integration, content population and a working preview of every page.</p>
  <div class="issues">
    <div class="issue-card" style="border-left-color:#0088FF">
      <div class="num" style="color:rgba(0,136,255,0.12)">01</div>
      <div class="h">Light theme UI</div>
      <div class="b">Full visual refresh using the company blue and green palette, white cards, soft shadows and friendly typography on every page.</div>
    </div>
    <div class="issue-card" style="border-left-color:#0088FF">
      <div class="num" style="color:rgba(0,136,255,0.12)">02</div>
      <div class="h">Multi-page site</div>
      <div class="b">Home, Shop, Support and Sign-up pages connected via React Router with a shared header and footer.</div>
    </div>
    <div class="issue-card" style="border-left-color:#0088FF">
      <div class="num" style="color:rgba(0,136,255,0.12)">03</div>
      <div class="h">Phone shop catalog</div>
      <div class="b">Three IIIF150 phone variants loaded from the back-end, with real product images, pricing, stock counts and a specs modal.</div>
    </div>
    <div class="issue-card" style="border-left-color:#0088FF">
      <div class="num" style="color:rgba(0,136,255,0.12)">04</div>
      <div class="h">Cart & PayFast checkout</div>
      <div class="b">Add-to-cart, quantity controls and a PayFast-integrated checkout that signs the payload server-side and processes ITN notifications.</div>
    </div>
    <div class="issue-card" style="border-left-color:#10B981">
      <div class="num" style="color:rgba(16,185,129,0.12)">05</div>
      <div class="h">Support & sign-up</div>
      <div class="b">Support ticket logging and lead sign-up forms, each backed by a NestJS API endpoint with in-memory storage.</div>
    </div>
    <div class="issue-card" style="border-left-color:#10B981">
      <div class="num" style="color:rgba(16,185,129,0.12)">06</div>
      <div class="h">Build & preview</div>
      <div class="b">Production builds, local dev servers and a live browser preview that can be opened on the local network.</div>
    </div>
  </div>
</section>

<section class="page">
  <div class="brand-strip">
    <div><div class="brand-name">${CLIENT.name} <span>Project</span></div><div class="brand-sub">Proposal &middot; Exclusions & assumptions</div></div>
    <div class="page-num">03 &middot; Boundaries</div>
  </div>
  <div class="section-kicker">02 &middot; What is and is not included</div>
  <h2 class="section-title">Assumptions, exclusions and next steps.</h2>
  <p class="section-lead">The following assumptions and exclusions keep the project tightly scoped and delivery-ready within the quoted budget.</p>
  <div class="fixes">
    <div class="fix-row">
      <div>
        <div class="fix-tag">Assumption</div>
        <div class="fix-name">Client provides PayFast credentials</div>
        <div class="fix-detail">A live merchant ID, merchant key and passphrase must be supplied before PayFast can be switched out of sandbox mode.</div>
      </div>
      <div>
        <div class="fix-tag">Assumption</div>
        <div class="fix-name">Product data is approved</div>
        <div class="fix-detail">Product names, pricing, stock counts and images are approved; changes after go-live are treated as separate updates.</div>
      </div>
    </div>
    <div class="fix-row">
      <div>
        <div class="fix-tag">Exclusion</div>
        <div class="fix-name">Hosting and domain setup</div>
        <div class="fix-detail">Server provisioning, DNS, SSL certificates, email mailboxes and hosting configuration are not included.</div>
      </div>
      <div>
        <div class="fix-tag">Exclusion</div>
        <div class="fix-name">Payment settlement & accounting</div>
        <div class="fix-detail">PayFast account activation, reconciliation and charge-back handling remain the client’s responsibility.</div>
      </div>
    </div>
    <div class="fix-row">
      <div>
        <div class="fix-tag">Exclusion</div>
        <div class="fix-name">Long-term maintenance SLA</div>
        <div class="fix-detail">Ongoing updates, support retainers or feature additions after handover are not included.</div>
      </div>
      <div>
        <div class="fix-tag">Exclusion</div>
        <div class="fix-name">Stock and order management dashboard</div>
        <div class="fix-detail">Inventory and order fulfilment tooling are out of scope; the checkout creates an order ID only.</div>
      </div>
    </div>
  </div>
  <div class="callout" style="margin-top: 7mm; padding: 5mm 6mm; background: #f8fafc; border-left: 2.5pt solid #0088FF; border-radius: 4pt;">
    <div style="font-size:7.5pt; letter-spacing:0.28em; text-transform:uppercase; color:#0088FF; font-weight:700; margin-bottom:2.5mm;">Next step</div>
    <div style="font-size:10pt; line-height:1.6; color:rgba(15,23,42,0.85);"><b>Acceptance of the attached quotation</b> releases the build. Work is staged as design review, front-end build, back-end and payment integration, then final preview and handover.</div>
  </div>
</section>

<section class="page">
  <div class="brand-strip">
    <div><div class="brand-name">${CLIENT.name} <span>Project</span></div><div class="brand-sub">Proposal &middot; Timeline</div></div>
    <div class="page-num">04 &middot; Roadmap</div>
  </div>
  <div class="section-kicker">03 &middot; Staged delivery</div>
  <h2 class="section-title">Four milestones to a live site.</h2>
  <p class="section-lead">The project is delivered in short, testable milestones so each part of the site can be reviewed before the next is built.</p>
  <div class="timeline">
    <div class="time-row"><div class="wk">Week 1</div><div><div class="t">Design review & content lock</div><div class="d">Confirm the light theme, page structure, product images and PayFast account details. Finalise all copy and pricing.</div></div></div>
    <div class="time-row"><div class="wk">Week 2</div><div><div class="t">Front-end build</div><div class="d">Build Home, Shop, Support and Sign-up with React Router, Tailwind, real images, header, footer and WhatsApp float.</div></div></div>
    <div class="time-row"><div class="wk">Week 3</div><div><div class="t">Back-end, cart & PayFast</div><div class="d">Add phone API, cart state, checkout endpoint, PayFast signature and ITN validation. Wire forms to API endpoints.</div></div></div>
    <div class="time-row"><div class="wk">Week 4</div><div><div class="t">Preview, QA & handover</div><div class="d">Cross-device preview, payment testing, final adjustments and code handover with deployment guidance.</div></div></div>
    <div class="time-row"><div class="wk">Post-launch</div><div><div class="t">30 days support</div><div class="d">Bug fixes, minor tweaks and guidance on switching PayFast from sandbox to live.</div></div></div>
  </div>
</section>

<section class="page">
  <div class="brand-strip">
    <div><div class="brand-name">${CLIENT.name} <span>Project</span></div><div class="brand-sub">Proposal &middot; Close</div></div>
    <div class="page-num">05 &middot; Close</div>
  </div>
  <div class="section-kicker">04 &middot; Where we go from here</div>
  <h2 class="section-title">Ready to build.</h2>
  <p class="section-lead">The full investment is detailed in the accompanying quotation. Acceptance starts the staged delivery roadmap above.</p>
  <div class="close">
    <h3>What happens next</h3>
    <p>Sign off the quotation and provide the PayFast merchant credentials. The first deliverable is a working front-end preview, followed by the cart and payment integration, then the final handover and deployment guidance.</p>
    <div class="cta">
      <div><b>Contact</b>${PROVIDER.email}<br/>${PROVIDER.phone}</div>
      <div><b>Client</b>${CLIENT.name}<br/>${CLIENT.address1}</div>
    </div>
    <div class="signature">${PROVIDER.name} &middot; ${PROVIDER.email} &middot; ${PROVIDER.phone}</div>
  </div>
</section>

</body></html>`;

// ── WEBSITE DECK HTML (template, screenshots injected) ─────────────────

const DESIGN_CSS = `
@page { size: A3 landscape; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #0f172a; background: #f8fafc; }
h1, h2, h3 { font-family: 'Poppins', sans-serif; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.page { width: 420mm; height: 297mm; padding: 16mm 20mm; position: relative; background: #f8fafc; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }
.brand { position: absolute; top: 16mm; left: 20mm; }
.brand .name { font-family: 'Poppins', sans-serif; font-size: 15pt; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
.brand .name span { color: #0088FF; }
.brand .sub { font-size: 7pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.5); margin-top: 1mm; }
.page-num { position: absolute; top: 16mm; right: 20mm; font-size: 8pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.4); }
.cover { background: #0f172a; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.cover .brand { position: static; }
.cover .brand .name { color: white; font-size: 17pt; }
.cover .brand .sub { color: rgba(255,255,255,0.35); }
.cover .kicker { color: #0088FF; font-size: 9pt; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700; margin-bottom: 8mm; }
.cover h1 { color: white; font-size: 44pt; line-height: 1.1; max-width: 260mm; margin-bottom: 8mm; }
.cover h1 span { color: #0088FF; }
.cover .sub { color: rgba(255,255,255,0.6); font-size: 12pt; max-width: 220mm; line-height: 1.65; margin-bottom: 10mm; }
.cover .meta { position: absolute; bottom: 16mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; font-size: 8pt; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
.section-header { margin-top: 24mm; margin-bottom: 8mm; }
.section-header .kicker { font-size: 8pt; letter-spacing: 0.3em; text-transform: uppercase; color: #0088FF; margin-bottom: 3mm; font-weight: 700; }
.section-header h2 { font-size: 28pt; color: #0f172a; }
.section-header .desc { font-size: 10pt; color: rgba(15,23,42,0.6); margin-top: 4mm; max-width: 200mm; line-height: 1.6; }
.layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 12mm; height: calc(100% - 55mm); }
.frame { background: white; border-radius: 6pt; box-shadow: 0 10pt 36pt -10pt rgba(15,23,42,0.18); overflow: hidden; border: 1px solid rgba(15,23,42,0.07); }
.frame-head { display: flex; align-items: center; gap: 6pt; padding: 5pt 9pt; background: #0f172a; font-size: 7pt; color: rgba(255,255,255,0.4); }
.dot { width: 7pt; height: 7pt; border-radius: 50%; }
.dot.r { background: #FF6B5B; } .dot.y { background: #FFC24C; } .dot.g { background: #10B981; }
.frame-body { background: #f8fafc; }
.desktop-img, .mobile-img { width: 100%; display: block; }
.desktop-scroll { max-height: 170mm; overflow: hidden; }
.caption { font-size: 7pt; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(15,23,42,0.5); margin-bottom: 2.5mm; font-weight: 600; }
.mobile-frame { width: 72mm; margin: 0 auto; border: 2.5pt solid #0f172a; border-radius: 10pt; padding: 3pt; background: #0f172a; }
.mobile-inner { max-height: 155mm; overflow: hidden; border-radius: 7pt; }
.notes { padding: 5mm 6mm; background: white; border-left: 2.5pt solid #0088FF; border-radius: 0 4pt 4pt 0; font-size: 9.5pt; line-height: 1.6; color: rgba(15,23,42,0.75); }
.notes b { color: #0f172a; }
.specs { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 5mm; }
.spec { padding: 4mm 5mm; background: white; border-radius: 4pt; border: 1px solid rgba(15,23,42,0.07); }
.spec .k { font-size: 7pt; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(15,23,42,0.5); margin-bottom: 1.5mm; font-weight: 600; }
.spec .v { font-size: 10pt; color: #0f172a; font-weight: 600; font-family: 'Poppins', sans-serif; }
.end-page .section-header { margin-top: 18mm; }
.home-grid .section-header { margin-top: 22mm; margin-bottom: 6mm; }
.home-grid .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; height: calc(100% - 65mm); }
.home-grid .shot { background: white; border-radius: 5pt; overflow: hidden; border: 1px solid rgba(15,23,42,0.08); box-shadow: 0 6pt 22pt -8pt rgba(15,23,42,0.14); display: flex; flex-direction: column; }
.home-grid .shot.wide { grid-column: span 2; }
.home-grid .shot img { width: 100%; flex: 1; object-fit: cover; object-position: top; display: block; }
.home-grid .shot-label { padding: 2.5mm 3mm; font-size: 8pt; font-weight: 700; color: #0f172a; font-family: 'Poppins', sans-serif; background: #f8fafc; border-top: 1px solid rgba(15,23,42,0.06); }
`;

function buildDesignHtml(sections, homeSections) {
  const total = 2 + sections.length * 2;

  const cover = `
    <section class="page cover">
      <div class="brand"><div class="name">${CLIENT.name} <span>Website</span></div><div class="sub">Design Deck &middot; Every Section & Page</div></div>
      <div class="page-num">01 / ${total}</div>
      <p class="kicker">Pages, Components & User Flows</p>
      <h1>Website design deck.<br/><span>Every page, every section.</span></h1>
      <p class="sub">A visual walkthrough of the new multi-page website across desktop and mobile — Home, Shop, Support, Sign-up and the cart / checkout experience.</p>
      <div class="meta"><span>${CLIENT.address1}, ${CLIENT.address2}</span><span>${COMPANY.phone} &middot; ${COMPANY.email}</span></div>
    </section>
  `;

  const homeGrid = `
    <section class="page home-grid">
      <div class="brand"><div class="name">${CLIENT.name} <span>Website</span></div><div class="sub">Home page sections</div></div>
      <div class="page-num">02 / ${total}</div>
      <div class="section-header">
        <div class="kicker">01 &middot; Home</div>
        <h2>Every home page section.</h2>
        <p class="desc">Five scrollable sections that make up the landing page, captured at desktop viewport.</p>
      </div>
      <div class="grid">
        ${homeSections.map((s, i) => `
          <div class="shot ${i === 0 ? 'wide' : ''}">
            <img src="${s.shot}" />
            <div class="shot-label">${s.label}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  const pages = sections.map((s, i) => `
    <section class="page">
      <div class="brand"><div class="name">${CLIENT.name} <span>Website</span></div><div class="sub">${s.label}</div></div>
      <div class="page-num">${String(3 + i * 2).padStart(2, "0")} / ${total}</div>
      <div class="section-header">
        <div class="kicker">0${i + 1} &middot; Page</div>
        <h2>${s.heading}</h2>
        <p class="desc">${s.desc}</p>
      </div>
      <div class="layout">
        <div>
          <div class="caption">Desktop &middot; 1440 &times; 900</div>
          <div class="frame">
            <div class="frame-head"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span> panafricatelecom.co.za${s.path}</div>
            <div class="frame-body desktop-scroll"><img class="desktop-img" src="${s.desktopShot}" /></div>
          </div>
        </div>
        <div>
          <div class="caption">Mobile &middot; 390 &times; 844</div>
          <div class="mobile-frame"><div class="mobile-inner"><img class="mobile-img" src="${s.mobileShot}" /></div></div>
        </div>
      </div>
    </section>
    <section class="page end-page">
      <div class="brand"><div class="name">${CLIENT.name} <span>Website</span></div><div class="sub">${s.label} &middot; Notes</div></div>
      <div class="page-num">${String(4 + i * 2).padStart(2, "0")} / ${total}</div>
      <div class="section-header">
        <div class="kicker">Design notes</div>
        <h2>${s.heading}</h2>
      </div>
      <div class="notes">${s.notes}</div>
      <div class="specs">${s.highlights.map((h) => `<div class="spec"><div class="k">${h.k}</div><div class="v">${h.v}</div></div>`).join("")}</div>
    </section>
  `).join("");

  return `<!doctype html><html><head><meta charset="utf-8"/>${sharedHead}<style>${DESIGN_CSS}</style></head><body>${cover}${homeGrid}${pages}</body></html>`;
}

// ── QUOTATION HTML ────────────────────────────────────────────────────

const QUOTE_NUMBER = `PAT-${new Date().getFullYear()}-001`;

const QUOTATION_ITEMS = [
  { title: "UX / UI refresh & design system", detail: "Light theme, Tailwind colour system, typography, buttons, cards and mobile responsiveness across all pages.", qty: 1, rate: 800 },
  { title: "Multi-page website build", detail: "Home, Shop, Support and Sign-up pages with React Router, shared header, footer, WhatsApp float and navigation.", qty: 1, rate: 700 },
  { title: "Phone shop, cart & PayFast checkout", detail: "Product catalog, cart context, quantity controls, PayFast signed-payload backend and ITN notify endpoint.", qty: 1, rate: 1000 },
];
const SUBTOTAL = QUOTATION_ITEMS.reduce((s, i) => s + i.qty * i.rate, 0);
const TOTAL = SUBTOTAL;

const QUOTATION_HTML = `<!doctype html>
<html><head><meta charset="utf-8"/>${sharedHead}<style>
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #0f172a; background: white; }
h1, h2, h3 { font-family: 'Poppins', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
.page { width: 210mm; padding: 8mm 13mm 8mm; background: white; }
.top { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 2mm; border-bottom: 2.5pt solid #0f172a; }
.brand .name { font-family: 'Poppins', sans-serif; font-size: 15pt; font-weight: 800; color: #0f172a; line-height: 1; letter-spacing: -0.03em; }
.brand .name span { color: #0088FF; }
.brand .sub { font-size: 7.5pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.5); margin-top: 1mm; }
.meta { text-align: right; font-size: 8pt; line-height: 1.45; color: rgba(15,23,42,0.8); }
.meta .k { letter-spacing: 0.2em; text-transform: uppercase; font-size: 7pt; color: rgba(15,23,42,0.45); }
.meta .v { font-weight: 600; }
.title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2mm; margin-bottom: 1.5mm; }
.title-row h1 { font-size: 18pt; color: #0f172a; }
.title-row .pill { display: inline-block; padding: 1.5mm 4mm; border: 1.5pt solid rgba(15,23,42,0.25); border-radius: 999pt; font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(15,23,42,0.65); font-family: 'Inter', sans-serif; }
.parties { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-bottom: 2mm; }
.party { padding: 3mm 4mm; background: #f8fafc; border-radius: 4pt; border-left: 2.5pt solid #0088FF; }
.party .label { font-size: 7pt; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(15,23,42,0.48); margin-bottom: 1.5mm; font-weight: 600; }
.party .name { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 700; color: #0f172a; margin-bottom: 1mm; }
.party .line { font-size: 8pt; line-height: 1.45; color: rgba(15,23,42,0.78); }
.blurb { padding: 2mm 4mm; background: #f8fafc; border: 1px solid rgba(15,23,42,0.1); border-radius: 3pt; margin-bottom: 2mm; font-size: 8pt; line-height: 1.45; color: rgba(15,23,42,0.78); }
.blurb b { color: #0f172a; font-weight: 700; }
table { width: 100%; border-collapse: collapse; margin-bottom: 2mm; }
thead th { font-size: 7pt; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(15,23,42,0.5); text-align: left; padding: 1.5mm 2mm; border-bottom: 2pt solid #0f172a; font-weight: 700; }
.r { text-align: right; }
tbody td { padding: 0.8mm 2mm; vertical-align: top; border-bottom: 1px solid rgba(15,23,42,0.08); font-size: 8.5pt; }
.item-title { font-weight: 700; color: #0f172a; margin-bottom: 0.3mm; font-size: 8pt; font-family: 'Poppins', sans-serif; }
.item-detail { font-size: 6.5pt; color: rgba(15,23,42,0.65); line-height: 1.3; }
.totals { display: flex; justify-content: flex-end; }
.totals-box { width: 76mm; }
.totals-row { display: flex; justify-content: space-between; padding: 1mm 0; font-size: 9pt; }
.totals-row.grand { border-top: 2.5pt solid #0f172a; margin-top: 0.5mm; padding-top: 2mm; font-size: 12pt; font-family: 'Poppins', sans-serif; font-weight: 800; color: #0f172a; }
.totals-row .v { font-variant-numeric: tabular-nums; }
.vat-note { font-size: 7.5pt; color: rgba(15,23,42,0.48); text-align: right; margin-top: 1mm; font-style: italic; }
.in-words { font-size: 8.5pt; color: #0088FF; text-align: right; margin-top: 1.5mm; font-weight: 700; font-family: 'Poppins', sans-serif; }
.terms { margin-top: 2mm; padding: 2.5mm 4mm; background: #f8fafc; border-radius: 3pt; font-size: 7.5pt; line-height: 1.45; color: rgba(15,23,42,0.78); border-left: 2pt solid #0f172a; }
.terms b { color: #0f172a; font-weight: 700; }
.signoff { margin-top: 2.5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
.sign { font-size: 8pt; }
.sign .line { border-bottom: 1px solid rgba(15,23,42,0.3); height: 6mm; }
.sign .label { letter-spacing: 0.2em; text-transform: uppercase; font-size: 6.5pt; color: rgba(15,23,42,0.5); margin-top: 1.5mm; }
.foot { margin-top: 2mm; padding-top: 2mm; border-top: 1px solid rgba(15,23,42,0.12); font-size: 6.5pt; color: rgba(15,23,42,0.45); text-align: center; letter-spacing: 0.15em; text-transform: uppercase; }
</style></head>
<body>
<div class="page">
  <div class="top">
    <div class="brand"><div class="name">${CLIENT.name} <span>Quotation</span></div><div class="sub">Website &middot; Shop &middot; PayFast Checkout</div></div>
    <div class="meta">
      <div class="k">From</div><div class="v">${PROVIDER.name}</div>
      <div>${PROVIDER.email}</div><div>${PROVIDER.phone}</div>
      <div>${PROVIDER.location}</div>
    </div>
  </div>
  <div class="title-row"><h1>Quotation</h1><span class="pill">${QUOTE_NUMBER}</span></div>
  <div class="parties">
    <div class="party">
      <div class="label">Prepared for</div>
      <div class="name">${CLIENT.name}</div>
      <div class="line">${CLIENT.contact}<br/>${CLIENT.address1}<br/>${CLIENT.address2}<br/>${CLIENT.email}</div>
    </div>
    <div class="party">
      <div class="label">Quote details</div>
      <div class="line"><b>Date issued:</b> ${today}<br/><b>Valid until:</b> ${validUntil}<br/><b>Currency:</b> ZAR<br/><b>Project:</b> Website, phone shop & PayFast</div>
    </div>
  </div>
  <table>
    <thead><tr><th style="width:60%">Description</th><th class="r" style="width:8%">Qty</th><th class="r" style="width:16%">Rate</th><th class="r" style="width:16%">Amount</th></tr></thead>
    <tbody>
      ${QUOTATION_ITEMS.map(it => `<tr><td><div class="item-title">${it.title}</div><div class="item-detail">${it.detail}</div></td><td class="r">${it.qty}</td><td class="r">${fmt(it.rate)}</td><td class="r">${fmt(it.qty * it.rate)}</td></tr>`).join("")}
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span class="v">${fmt(SUBTOTAL)}</span></div>
      <div class="totals-row"><span>VAT</span><span class="v">Not applicable</span></div>
      <div class="totals-row grand"><span>Total due</span><span class="v">${fmt(TOTAL)}</span></div>
      <div class="in-words">${inWords(TOTAL)} Rand only</div>
      <div class="vat-note">Quoted in ZAR. Supplier not VAT-registered.</div>
    </div>
  </div>
  <div class="terms">
    <b>Payment:</b> 50% deposit on acceptance, 50% on go-live sign-off. Banking details on invoice. &nbsp;|&nbsp; <b>Validity:</b> Quote valid until ${validUntil}. &nbsp;|&nbsp; <b>Out of scope:</b> hosting, domain, PayFast merchant account setup, ongoing monthly support.
  </div>
  <div class="signoff">
    <div class="sign"><div class="line"></div><div class="label">Client signature & date</div></div>
    <div class="sign"><div class="line"></div><div class="label">${PROVIDER.name}</div></div>
  </div>
  <div class="foot">Thank you &middot; ${QUOTE_NUMBER} &middot; Valid until ${validUntil}</div>
</div>
</body></html>`;

// ── Screenshot helpers ────────────────────────────────────────────────

async function waitForServer(url, maxTries = 30) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(`${url}/api/v1/services`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Front-end dev server not responding");
}

async function captureHomeSections(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(`${BASE}/#/`, { waitUntil: "networkidle0", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 1500));

  const sections = [
    { id: "hero", label: "01 &middot; Hero" },
    { id: "network", label: "02 &middot; Network map" },
    { id: "services", label: "03 &middot; Service explorer" },
    { id: "speed", label: "04 &middot; Speed test" },
    { id: "contact", label: "05 &middot; Contact & support" },
  ];

  const shots = [];
  for (const s of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, s.id);
    await new Promise((r) => setTimeout(r, 900));
    const file = `home-section-${s.id}.png`;
    const p = path.join(SHOT_DIR, file);
    await page.screenshot({ path: p, fullPage: false });
    shots.push({ ...s, shot: `shots/${file}` });
  }
  await page.close();
  return shots;
}

async function capturePage(browser, route, name) {
  const page = await browser.newPage();

  // Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(`${BASE}/#${route}`, { waitUntil: "networkidle0", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 1200));
  const desktopPath = path.join(SHOT_DIR, `${name}-desktop.png`);
  await page.screenshot({ path: desktopPath, fullPage: false });

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/#${route}`, { waitUntil: "networkidle0", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 1200));
  const mobilePath = path.join(SHOT_DIR, `${name}-mobile.png`);
  await page.screenshot({ path: mobilePath, fullPage: false });

  await page.close();
  return { desktop: `shots/${path.basename(desktopPath)}`, mobile: `shots/${path.basename(mobilePath)}` };
}

// ── Main ──────────────────────────────────────────────────────────────

async function render(browser, name, html, opts) {
  const htmlFile = path.join(OUT_DIR, `${name}.html`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(htmlFile, html, "utf8");
  const page = await browser.newPage();
  await page.goto("file:///" + htmlFile.replaceAll("\\", "/"), { waitUntil: "networkidle0" });
  const pdfPath = path.join(OUT_DIR, `${name}.pdf`);
  await page.pdf({ ...opts, path: pdfPath, printBackground: true, preferCSSPageSize: true });
  await page.close();
  const stat = await fs.stat(pdfPath);
  console.log(`  ✓ ${pdfPath} (${(stat.size / 1024).toFixed(1)} KB)`);
}

async function main() {
  await fs.mkdir(SHOT_DIR, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("Waiting for dev server…");
  await waitForServer(BASE);

  const browser = await puppeteer.launch({ headless: "new" });

  // Scope proposal
  console.log("\nGenerating scope proposal…");
  await render(browser, "1-scope", PROPOSAL_HTML, { format: "A4" });

  // Website design deck with screenshots
  console.log("\nCapturing home page sections…");
  const homeSectionShots = await captureHomeSections(browser);
  console.log("\nCapturing page screenshots…");
  const homeShots = await capturePage(browser, "/", "home");
  const shopShots = await capturePage(browser, "/shop", "shop");
  const supportShots = await capturePage(browser, "/support", "support");
  const signupShots = await capturePage(browser, "/signup", "signup");

  const designSections = [
    {
      label: "Home",
      path: "/",
      heading: "Home page — coverage, services & trust",
      desc: "The marketing landing page with hero, coverage checker, network map, service explorer, speed test, contact and support.",
      desktopShot: homeShots.desktop,
      mobileShot: homeShots.mobile,
      notes: "The <b>Hero</b> leads with the company slogan and an interactive coverage lookup. <b>NetworkMap</b> visualises the Newcastle backbone and coverage nodes. <b>ServiceExplorer</b> lets users filter packages by category and demand. <b>SpeedTestWidget</b> provides a live speed-test gauge. <b>ContactAndSupport</b> rounds out the page with a lead form and WhatsApp call-to-action.",
      highlights: [
        { k: "Hero", v: "Coverage checker + CTA" },
        { k: "Network Map", v: "Animated SVG coverage" },
        { k: "Service Explorer", v: "Slider-based package finder" },
        { k: "Contact", v: "Lead form + WhatsApp" },
      ],
    },
    {
      label: "Shop",
      path: "/shop",
      heading: "Phone shop — catalog, cart & checkout",
      desc: "The e-commerce page showing the IIIF150 A5Pro rugged phone range with real product photos, stock and PayFast checkout.",
      desktopShot: shopShots.desktop,
      mobileShot: shopShots.mobile,
      notes: "The <b>Shop</b> page lists each phone variant with a real product image, price, stock count and an <b>Add to Cart</b> control. Clicking a product opens a spec modal. The header cart icon opens a drawer with quantity controls, customer details and a <b>Pay with PayFast</b> button that submits a server-signed payment form.",
      highlights: [
        { k: "Products", v: "IIIF150 A5Pro variants" },
        { k: "Cart", v: "Add, update, remove, total" },
        { k: "Checkout", v: "PayFast signed payload" },
        { k: "Stock", v: "Live counts per colour" },
      ],
    },
    {
      label: "Support",
      path: "/support",
      heading: "Support — log a ticket",
      desc: "A dedicated support page where customers can raise technical, billing, sales or general tickets.",
      desktopShot: supportShots.desktop,
      mobileShot: supportShots.mobile,
      notes: "The <b>Support</b> form captures full name, email, phone, ticket type, subject and message. The data is submitted to <code>/api/v1/tickets</code> and stored with a generated ticket ID. Success and error states are handled with clear user feedback.",
      highlights: [
        { k: "Ticket types", v: "Technical / Billing / Sales / General" },
        { k: "Backend", v: "POST /api/v1/tickets" },
        { k: "Validation", v: "Required fields + email" },
        { k: "UX", v: "Clear success/error messages" },
      ],
    },
    {
      label: "Sign Up",
      path: "/signup",
      heading: "Sign up — service lead capture",
      desc: "A dedicated lead-capture page for customers interested in internet, global connectivity, VoIP/SMS or solar services.",
      desktopShot: signupShots.desktop,
      mobileShot: signupShots.mobile,
      notes: "The <b>Sign-up</b> form pre-fills the service of interest from query parameters (e.g. after clicking a package link). It posts to <code>/api/v1/leads/signup</code> and stores the lead for the sales team to follow up.",
      highlights: [
        { k: "Pre-fill", v: "?service= query support" },
        { k: "Backend", v: "POST /api/v1/leads/signup" },
        { k: "Fields", v: "Name, email, phone, interest, location" },
        { k: "CTA", v: "Direct to WhatsApp fallback" },
      ],
    },
  ];

  const designHtml = buildDesignHtml(designSections, homeSectionShots);
  console.log("\nGenerating website design deck…");
  await render(browser, "2-website-sections", designHtml, { width: "420mm", height: "297mm" });

  // Quotation
  console.log("\nGenerating quotation…");
  await render(browser, "3-quotation", QUOTATION_HTML, { format: "A4" });

  await browser.close();
  console.log("\nAll PDFs generated in:", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
