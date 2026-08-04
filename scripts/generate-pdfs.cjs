const fs = require('fs');
const path = require('path');
const pdfMake = require('pdfmake/build/pdfmake.js');
const vfsFonts = require('pdfmake/build/vfs_fonts.js');

pdfMake.vfs = vfsFonts;
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

const outDir = path.join(__dirname, '..', 'documents');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const brandColor = '#0088FF';

function createDoc(title, content) {
  return {
    content: [
      { text: title, style: 'title' },
      { text: 'Pan Africa Telecom (Pty) Ltd', style: 'subTitle' },
      { text: 'Project: New website, shop & PayFast checkout', style: 'muted', margin: [0, 0, 0, 10] },
      ...content,
    ],
    styles: {
      title: { fontSize: 22, bold: true, color: brandColor, margin: [0, 0, 0, 6] },
      subTitle: { fontSize: 14, bold: true, margin: [0, 0, 0, 4] },
      muted: { fontSize: 10, color: '#666' },
      heading: { fontSize: 16, bold: true, color: brandColor, margin: [0, 12, 0, 6] },
      listItem: { fontSize: 11, margin: [0, 2, 0, 2] },
      tableHeader: { bold: true, color: '#fff', fillColor: brandColor, fontSize: 11 },
      tableCell: { fontSize: 11 },
      total: { fontSize: 14, bold: true, color: brandColor },
    },
    defaultStyle: { font: 'Roboto' },
    pageMargins: [40, 40, 40, 60],
  };
}

function writePdf(fileName, docDefinition) {
  const doc = pdfMake.createPdf(docDefinition);
  doc.getBuffer((buffer) => {
    fs.writeFileSync(path.join(outDir, fileName), buffer);
    console.log(`Generated: ${fileName}`);
  });
}

// 1. Scope document
const scopeDoc = createDoc('1. Scope of Work', [
  { text: 'Overview', style: 'heading' },
  { text: 'Pan Africa Telecom required a refreshed public-facing website with a light theme, a dedicated phone shop, a support ticket page, a sign-up page and a PayFast-integrated checkout.', fontSize: 11, margin: [0, 0, 0, 8] },
  { text: 'Deliverables', style: 'heading' },
  {
    ul: [
      'Light-themed, responsive React + Tailwind website',
      'Multi-page routing (Home, Shop, Support, Sign Up)',
      'Backend phone catalog API (GET /api/v1/phones)',
      'Client-side cart with add, remove, quantity controls and totals',
      'PayFast checkout backend (POST /api/v1/checkout/payfast + ITN notify)',
      'Real product images sourced from the client\'s existing site',
      'Support ticket and lead sign-up endpoints',
      'Browser preview and mobile-network access',
    ],
    style: 'listItem',
  },
  { text: 'Assumptions', style: 'heading' },
  {
    ul: [
      'Client provides PayFast merchant ID, key and passphrase for live mode',
      'Client supplies product images or approves sourcing from existing site',
      'All copy and pricing is approved by the client before go-live',
      'Hosting/deployment is out of scope unless separately quoted',
    ],
    style: 'listItem',
  },
  { text: 'Exclusions', style: 'heading' },
  {
    ul: [
      'Domain or hosting setup',
      'Email server configuration',
      'Third-party shipping provider integration',
      'Post-go-live SLA unless separately agreed',
    ],
    style: 'listItem',
  },
  { text: 'Approach', style: 'heading' },
  { text: 'The site is built with React, TypeScript, Tailwind CSS and Vite on the frontend, and a NestJS API on the backend. Data is stored in JSON files during this phase for speed and easy handover.', fontSize: 11 },
]);

// 2. Website sections & pages document
const sectionsDoc = createDoc('2. Website Sections & Pages', [
  { text: 'Public Pages', style: 'heading' },
  {
    table: {
      headerRows: 1,
      widths: ['25%', '40%', '35%'],
      body: [
        [{ text: 'Page', style: 'tableHeader' }, { text: 'Sections / Components', style: 'tableHeader' }, { text: 'Purpose', style: 'tableHeader' }],
        [
          { text: 'Home (/ | #/)', style: 'tableCell' },
          { text: 'Hero, Network Map, Service Explorer, Speed Test, Contact & Support', style: 'tableCell' },
          { text: 'Marketing landing page with coverage check and lead capture', style: 'tableCell' },
        ],
        [
          { text: 'Shop (/#/shop)', style: 'tableCell' },
          { text: 'Phone catalog, product specs modal, quantity selector, Add to Cart', style: 'tableCell' },
          { text: 'Browse and buy IIIF150 rugged phones', style: 'tableCell' },
        ],
        [
          { text: 'Support (/#/support)', style: 'tableCell' },
          { text: 'Support ticket form (technical, billing, sales, general)', style: 'tableCell' },
          { text: 'Log support tickets', style: 'tableCell' },
        ],
        [
          { text: 'Sign Up (/#/signup)', style: 'tableCell' },
          { text: 'Lead form for services with service interest dropdown', style: 'tableCell' },
          { text: 'Enquire about internet / connectivity services', style: 'tableCell' },
        ],
      ],
    },
  },
  { text: 'Reusable Components', style: 'heading' },
  {
    ul: [
      'Header — sticky navigation, cart icon with count, mobile menu',
      'Footer — contact info, internal links, social links',
      'WhatsApp Float — one-click WhatsApp chat',
      'Cart Drawer — slide-out cart with quantity controls and PayFast checkout',
      'HeroSection — coverage check with real-time results and package links',
      'NetworkMap — interactive SVG coverage map with terrain background',
      'ServiceExplorer — slider-based package finder with category tabs',
      'SpeedTestWidget — simulated speed test gauge',
      'ContactAndSupport — contact details and form',
    ],
    style: 'listItem',
  },
  { text: 'Backend API Endpoints', style: 'heading' },
  {
    table: {
      headerRows: 1,
      widths: ['35%', '25%', '40%'],
      body: [
        [{ text: 'Endpoint', style: 'tableHeader' }, { text: 'Method', style: 'tableHeader' }, { text: 'Description', style: 'tableHeader' }],
        [{ text: '/api/v1/services', style: 'tableCell' }, { text: 'GET', style: 'tableCell' }, { text: 'List internet / connectivity packages', style: 'tableCell' }],
        [{ text: '/api/v1/coverage/check', style: 'tableCell' }, { text: 'POST', style: 'tableCell' }, { text: 'Check network coverage for a location', style: 'tableCell' }],
        [{ text: '/api/v1/leads/signup', style: 'tableCell' }, { text: 'POST', style: 'tableCell' }, { text: 'Submit a service lead', style: 'tableCell' }],
        [{ text: '/api/v1/tickets', style: 'tableCell' }, { text: 'POST', style: 'tableCell' }, { text: 'Log a support ticket', style: 'tableCell' }],
        [{ text: '/api/v1/phones', style: 'tableCell' }, { text: 'GET', style: 'tableCell' }, { text: 'List phones for the shop', style: 'tableCell' }],
        [{ text: '/api/v1/checkout/payfast', style: 'tableCell' }, { text: 'POST', style: 'tableCell' }, { text: 'Generate signed PayFast payment payload', style: 'tableCell' }],
        [{ text: '/api/v1/checkout/notify', style: 'tableCell' }, { text: 'POST', style: 'tableCell' }, { text: 'PayFast ITN webhook handler', style: 'tableCell' }],
      ],
    },
  },
]);

// 3. Quotation document
const quoteDoc = createDoc('3. Quotation', [
  { text: 'Quotation summary', style: 'heading' },
  { text: 'Total project price as agreed with Pan Africa Telecom (Pty) Ltd.', fontSize: 11, margin: [0, 0, 0, 8] },
  {
    table: {
      headerRows: 1,
      widths: ['45%', '12%', '18%', '25%'],
      body: [
        [{ text: 'Item', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }, { text: 'Unit', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader' }],
        [{ text: 'Theme & visual refresh (light theme, real images, polished UI)', style: 'tableCell' }, { text: '1', style: 'tableCell' }, { text: 'R 800.00', style: 'tableCell' }, { text: 'R 800.00', style: 'tableCell' }],
        [{ text: 'Multi-page website (Home, Shop, Support, Sign Up + routing)', style: 'tableCell' }, { text: '1', style: 'tableCell' }, { text: 'R 700.00', style: 'tableCell' }, { text: 'R 700.00', style: 'tableCell' }],
        [{ text: 'Phone shop with cart and PayFast checkout integration', style: 'tableCell' }, { text: '1', style: 'tableCell' }, { text: 'R 1 000.00', style: 'tableCell' }, { text: 'R 1 000.00', style: 'tableCell' }],
      ],
    },
  },
  { text: ' ', fontSize: 6 },
  {
    table: {
      widths: ['75%', '25%'],
      body: [
        [{ text: 'Subtotal', style: 'tableCell', bold: true }, { text: 'R 2 500.00', style: 'tableCell' }],
        [{ text: 'VAT (0%) — exempt / included', style: 'tableCell' }, { text: 'R 0.00', style: 'tableCell' }],
        [{ text: 'Total', style: 'total' }, { text: 'R 2 500.00', style: 'total' }],
      ],
    },
  },
  { text: 'Terms', style: 'heading' },
  {
    ul: [
      '50% deposit to commence work, balance on completion before go-live',
      'Price is fixed for the scope above; additional features will be quoted separately',
      'Payment to be made via EFT or PayFast',
      'Work is delivered in staged milestones: design, build, payment integration, handover',
    ],
    style: 'listItem',
  },
  { text: 'Banking details', style: 'heading' },
  { text: 'Banking details to be supplied by Pan Africa Telecom accounts department.', fontSize: 11 },
]);

writePdf('1-scope.pdf', scopeDoc);
writePdf('2-website-sections.pdf', sectionsDoc);
writePdf('3-quotation.pdf', quoteDoc);
