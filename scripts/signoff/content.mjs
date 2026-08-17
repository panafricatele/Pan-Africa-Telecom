export const META = {
  title: 'Project Sign-Off & Technical Review',
  subtitle: 'Website, Phone Shop, PayFast Checkout, Network Status & Admin Dashboard',
  client: 'Pan Africa Telecom (Pty) Ltd',
  licence: 'ICASA License No: 2411/CECNS/CECN/FEB/2023  |  AS: 329467',
  vendor: 'Ntuthuko Smith — Web & Software Development',
  vendorEmail: 'ntuthukosmith10@gmail.com',
  reference: 'PAT-SIGNOFF-2026-001',
  version: '1.0',
};

export const SECTIONS = [
  {
    heading: '1. Executive Summary',
    body: [
      'This document is the formal sign-off and technical review for the Pan Africa Telecom website project. It records what was delivered, how it was built, how it behaves in production, the defects found and corrected during final review, and the outstanding items that require action from Pan Africa Telecom.',
      'The delivered solution is a responsive React single-page application backed by a NestJS API and a Supabase (PostgreSQL) database. It replaces the previous static presence with a maintainable platform that Pan Africa Telecom staff can update themselves, without developer involvement, through a purpose-built Admin Dashboard.',
      'Every customer-facing page and every administrative screen has been captured as a screenshot and is included in the appendix of this document as evidence of delivery.',
    ],
    bullets: {
      title: 'Headline outcomes',
      items: [
        'Seven public pages delivered: Home, Shop, Network Status, Support, Service Sign-up, Login and Register.',
        'Admin Dashboard with three panels: Service Packages, Products, and Network Status.',
        'Live network status board integrating the Evotel public status API, plus staff-managed Vumatel and Fixed Wireless sites.',
        'PayFast-integrated checkout for phone and equipment sales.',
        'Content is database-driven: pricing, packages, stock and network status are edited by staff, not in code.',
        'Row Level Security enforced on every table, with administrative writes restricted to admin profiles.',
      ],
    },
  },
  {
    heading: '2. Scope Delivered',
    body: [
      'The table below maps each contracted deliverable to its delivered state. All items are complete and demonstrable in the accompanying screenshots.',
    ],
    table: {
      head: ['Deliverable', 'Delivered', 'Notes'],
      widths: [200, 60, 205],
      rows: [
        ['Responsive multi-page React website', 'Yes', 'Vite + React 18 + TypeScript + Tailwind CSS'],
        ['Online phone shop with cart', 'Yes', 'Cart persisted per user in the cart_items table'],
        ['PayFast payment integration', 'Yes', 'Checkout module on the NestJS API'],
        ['Support ticket capture', 'Yes', 'Validated server-side via NestJS DTOs'],
        ['Service sign-up / lead capture', 'Yes', 'Leads module persists enquiries'],
        ['Customer accounts', 'Yes', 'Supabase auth with a profiles table'],
        ['Admin Dashboard', 'Yes', 'Packages, Products and Network Status panels'],
        ['Live network status page', 'Yes', 'Evotel API, plus Vumatel and Fixed Wireless'],
        ['Mobile-optimised layouts', 'Yes', 'Verified at 390px; see mobile screenshots'],
      ],
    },
  },
  {
    heading: '3. Architecture Overview',
    body: [
      'The solution is split into three independently deployable concerns. The frontend can operate against the API or fall back to querying Supabase directly, which keeps the public site available even if the API layer is temporarily down.',
    ],
    table: {
      head: ['Layer', 'Technology', 'Responsibility'],
      widths: [95, 150, 220],
      rows: [
        ['Frontend', 'React 18, TypeScript, Vite 5', 'All user interfaces and client-side routing'],
        ['Styling', 'Tailwind CSS 3', 'Design system, responsive layout'],
        ['Motion', 'Framer Motion 11', 'Scroll and entry animations'],
        ['Icons', 'Lucide React', 'Consistent icon set'],
        ['Routing', 'React Router 7', 'Single-page application routes'],
        ['API', 'NestJS (prefix /api/v1)', 'Coverage, services, leads, tickets, phones, checkout, network status'],
        ['Validation', 'class-validator pipes', 'Whitelisted DTOs, non-whitelisted fields rejected'],
        ['Database / Auth', 'Supabase (PostgreSQL)', 'Data, authentication, Row Level Security'],
        ['Payments', 'PayFast', 'Hosted payment for shop orders'],
      ],
    },
    bullets: {
      title: 'Resilience decisions',
      items: [
        'The API runs behind the global prefix /api/v1 with CORS enabled and a strict global validation pipe.',
        'Public pages degrade gracefully: if the API call fails, the page queries Supabase directly rather than showing an error.',
        'The Evotel component list is fetched server-side to avoid browser CORS issues, with a direct browser fallback if the API route is unavailable.',
      ],
    },
  },
  {
    heading: '4. Public Pages — Detailed Review',
    body: [
      'Each page below is evidenced by a full-page screenshot in the appendix, along with individual section captures.',
    ],
    table: {
      head: ['Page', 'Route', 'Function'],
      widths: [110, 110, 245],
      rows: [
        ['Home', '/', 'Hero with live ICASA/AS licensing badge, service explorer, speed test widget, contact and support block'],
        ['Shop', '/shop', 'Phone and equipment catalogue rendered from the products table, with cart and checkout entry'],
        ['Network Status', '/network-status', 'Live status for Evotel, Vumatel and Fixed Wireless areas, plus links to upstream provider status pages'],
        ['Support', '/support', 'Support ticket form and published contact channels'],
        ['Sign-up', '/signup', 'New service enquiry capture for fibre, wireless and LTE'],
        ['Login', '/login', 'Email and password authentication via Supabase'],
        ['Register', '/register', 'Account creation, which provisions a matching profiles row'],
      ],
    },
  },
  {
    heading: '5. Admin Dashboard — Detailed Review',
    body: [
      'The Admin Dashboard is reached at /admin and is guarded twice: the route redirects any non-admin visitor away, and the database independently rejects writes from non-admin accounts through Row Level Security. A leaked or guessed URL therefore grants no access.',
      'The dashboard is organised into three tabs, each captured in the appendix.',
    ],
    bullets: {
      title: 'Service Packages panel',
      items: [
        'Create, edit and delete service packages, filtered by category (internet, fibre, LTE, global, voice, solar).',
        'Controls price, price label, speed, tagline, uncapped flag, technologies and a free-form feature list.',
        'Changes appear immediately on the public site, because the Home page service explorer reads the same table.',
      ],
    },
  },
  {
    heading: '5.1 Admin Dashboard — Products & Network Status',
    bullets: {
      title: 'Products panel',
      items: [
        'Manage phones and equipment: brand, model, colour, price, compare-at price, stock level, imagery, description and specifications.',
        'Stock levels drive shop availability, so the catalogue is controlled entirely by staff.',
      ],
    },
    bulletsTwo: {
      title: 'Network Status panel',
      items: [
        'Evotel: area names are validated against the live Evotel public API, with a picker listing every published area, preventing typos that would silently break status reporting.',
        'Vumatel: coordinate-based locations, recorded with latitude and longitude.',
        'Fixed Wireless: fully staff-managed sites with a manual status (Operational, Degraded, Partial outage, Major outage, Under maintenance) and an optional customer-visible note.',
        'Wireless notes are editable in place, and are cleared automatically when a site is returned to Operational so stale outage messages cannot remain published.',
      ],
    },
  },
  {
    heading: '6. Network Status Integration',
    body: [
      'The network status feature is the most integration-heavy part of the project and warrants specific attention at sign-off.',
      'Evotel publishes a public status API. The backend retrieves the component list, normalises it, and matches it against the areas Pan Africa Telecom has chosen to monitor. Matching is deliberately tolerant: names are trimmed, internal whitespace is collapsed and comparison is case-insensitive, because Evotel publishes some component names with trailing spaces. The parser also accepts either documented response shape and flattens nested child components, so newly grouped areas continue to resolve.',
      'Vumatel does not expose an equivalent public API. Those entries therefore display the status last recorded by staff, and the design makes that explicit rather than implying live data. Fixed Wireless is Pan Africa Telecom infrastructure and is likewise staff-managed.',
    ],
    bullets: {
      title: 'Behaviour under failure',
      items: [
        'If the Evotel API is unreachable, monitored areas fall back to their last stored status instead of showing an error.',
        'If the API returns a non-200 response, this is treated as a failure rather than as an empty area list, so areas are never falsely reported as operational.',
        'In the Admin Dashboard, an unavailable Evotel API is stated plainly, and the administrator is warned that names cannot be validated before they add an area.',
      ],
    },
  },
  {
    heading: '7. Database & Security Review',
    body: [
      'Six tables carry the application. Row Level Security is enabled on all of them; public read access is granted where content is intentionally public, and write access is restricted to accounts whose profiles row carries the admin role.',
    ],
    table: {
      head: ['Table', 'Purpose', 'Access'],
      widths: [125, 195, 145],
      rows: [
        ['profiles', 'Customer detail, extends auth.users, holds the admin role', 'Owner reads own row'],
        ['cart_items', 'Per-user persisted shopping cart', 'Owner only'],
        ['packages', 'Service plans shown on the site', 'Public read, admin write'],
        ['products', 'Phones and equipment', 'Public read, admin write'],
        ['coverage_areas', 'Serviceable areas', 'Public read, admin write'],
        ['network_status_monitors', 'Monitored Evotel, Vumatel and wireless areas', 'Public read, admin write'],
      ],
    },
    bullets: {
      title: 'Security observations',
      items: [
        'Administrative authority is held in the database, not the browser. Modifying client-side code cannot grant write access.',
        'The API applies a whitelisting validation pipe that strips unknown fields and rejects requests containing them.',
        'Only the Supabase anon (public) key is used in the browser, which is its intended use; privileged keys are not shipped to the client.',
        'RECOMMENDED: move the Supabase URL and anon key in the backend service to environment variables and remove the in-code fallback values before the next deployment.',
      ],
    },
  },
  {
    heading: '8. Defects Found & Corrected During Final Review',
    body: [
      'The following issues were identified during final review and have all been corrected, verified by a clean production build, and committed.',
    ],
    table: {
      head: ['Issue', 'Cause', 'Resolution'],
      widths: [130, 175, 160],
      rows: [
        [
          'Evotel area names not reliably validated',
          'Only one API response shape handled; naive name comparison missed trailing whitespace and nested components',
          'Shared parser that accepts both shapes, flattens child components and normalises names; area picker added to the admin form',
        ],
        [
          'No Fixed Wireless section existed',
          'The provider constraint permitted only Evotel and Vumatel',
          'Wireless provider and note column added; admin panel and public card built',
        ],
        [
          'Editing a package showed another package\u2019s data',
          'The edit form copied its values only on first mount and was reused across rows, so a save could overwrite the wrong record',
          'Form is now remounted per selection, guaranteeing the form matches the chosen record',
        ],
        [
          'Incorrect AS licensing number published',
          'Superseded number carried across five files',
          'Corrected to AS 329467 in all occurrences',
        ],
        [
          'Outage note remained after a site recovered',
          'Status updates did not clear the note, forcing staff to delete and re-add the site',
          'Note is cleared when a site returns to Operational, and is editable in place',
        ],
      ],
    },
  },
  {
    heading: '9. Verification & Known Limitations',
    bullets: {
      title: 'Verification performed',
      items: [
        'TypeScript compilation and production builds pass cleanly for both the frontend and the backend.',
        'Every public page and every Admin Dashboard tab was rendered and captured at 1440px, and key pages additionally at 390px.',
        'Evotel API integration was exercised against the live endpoint, including its real published component names.',
        'Administrative create, status-change, note-edit and delete paths were each exercised.',
      ],
    },
    bulletsTwo: {
      title: 'Known limitations, disclosed for transparency',
      items: [
        'Vumatel status is not live. Vumatel publishes no public status API, so those entries show the status last set by staff.',
        'Fixed Wireless status is manual by design; it reflects what staff record, not automated monitoring.',
        'The frontend JavaScript bundle exceeds 500KB before compression. It is acceptable at current traffic, but code-splitting is the recommended next optimisation.',
        'No automated test suite is included in this scope; verification was performed manually and via type-checked builds.',
      ],
    },
  },
  {
    heading: '10. Handover & Operating Notes',
    bullets: {
      title: 'Day-to-day operation',
      items: [
        'Pricing, packages, products, stock and network status are all edited in the Admin Dashboard. No code change or developer is required.',
        'Admin rights are granted by setting the role to admin on the relevant row in the profiles table.',
        'Evotel statuses refresh automatically from the upstream API. Vumatel and Fixed Wireless must be updated by staff during an incident.',
      ],
    },
    bulletsTwo: {
      title: 'Action required by Pan Africa Telecom',
      items: [
        'Run the updated supabase/migration.sql in the Supabase SQL editor. Until this is applied, Fixed Wireless sites cannot be saved, because the previous constraint rejects the wireless provider. The migration is written to be safely re-runnable.',
        'Confirm the corrected AS number, 329467, is the number to publish site-wide.',
        'Nominate the staff accounts that should hold admin rights.',
      ],
    },
  },
];

export const SIGNOFF_INTRO =
  'By signing below, the parties confirm that the deliverables described in this document have been demonstrated, reviewed and accepted. Acceptance covers the scope recorded in section 2 and acknowledges the limitations disclosed in section 9 and the actions listed in section 10.';
