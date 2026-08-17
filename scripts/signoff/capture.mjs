import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const here = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(here, '..', '..', 'documents', 'screenshots');

/* ------------------------------------------------------------------ */
/*  Tiny .env reader (avoids an extra dependency)                      */
/* ------------------------------------------------------------------ */

function loadEnv() {
  const file = path.join(here, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv();

// 127.0.0.1 rather than localhost: Node resolves localhost to ::1, but Vite binds IPv4.
const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true };

/* ------------------------------------------------------------------ */
/*  Pages to capture                                                   */
/* ------------------------------------------------------------------ */

const PAGES = [
  {
    slug: 'home',
    route: '/',
    title: 'Home',
    description:
      'Landing page: hero with ICASA/AS licensing badge, service explorer, speed test widget and contact block.',
    sections: true,
    mobile: true,
  },
  {
    slug: 'shop',
    route: '/shop',
    title: 'Shop',
    description: 'Phone and equipment catalogue with cart, driven by the products table in Supabase.',
    sections: true,
    mobile: true,
  },
  {
    slug: 'network-status',
    route: '/network-status',
    title: 'Network Status',
    description:
      'Customer-facing live status board: Evotel areas resolved from the Evotel public API, plus admin-managed Vumatel and Fixed Wireless sites.',
    sections: true,
    mobile: true,
  },
  {
    slug: 'support',
    route: '/support',
    title: 'Support',
    description: 'Support ticket capture form and contact channels.',
    sections: true,
  },
  {
    slug: 'signup',
    route: '/signup',
    title: 'Service Sign-up',
    description: 'Lead capture / service sign-up journey for new connections.',
    sections: true,
  },
  {
    slug: 'login',
    route: '/login',
    title: 'Login',
    description: 'Supabase email + password authentication.',
  },
  {
    slug: 'register',
    route: '/register',
    title: 'Register',
    description: 'Customer account creation, backed by Supabase auth and the profiles table.',
  },
];

const ADMIN_TABS = [
  {
    slug: 'admin-packages',
    tab: 'Service Packages',
    title: 'Admin Dashboard — Service Packages',
    description:
      'CRUD for service packages. The edit form is remounted per row so the form always matches the selected package.',
  },
  {
    slug: 'admin-products',
    tab: 'Products',
    title: 'Admin Dashboard — Products',
    description: 'CRUD for phones and equipment, including pricing, stock and specification fields.',
  },
  {
    slug: 'admin-network-status',
    tab: 'Network Status',
    title: 'Admin Dashboard — Network Status',
    description:
      'Manage Evotel areas (validated against the Evotel public API), Vumatel locations and Fixed Wireless sites with manual status and notes.',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const manifest = [];
let order = 0;

function nextName(slug) {
  order += 1;
  return `${String(order).padStart(2, '0')}-${slug}.png`;
}

async function record(page, slug, meta, clip) {
  const file = nextName(slug);
  const target = path.join(shotsDir, file);
  if (clip) {
    await clip.screenshot({ path: target });
  } else {
    await page.screenshot({ path: target, fullPage: true });
  }
  manifest.push({ file, ...meta });
  console.log(`  captured ${file}`);
}

async function settle(page) {
  // Framer Motion animates in JS, and several sections animate on scroll.
  // Walk the full height so everything has entered its final state.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 900));
}

// The app mounts a HashRouter, so every route lives behind the fragment.
function urlFor(route) {
  return `${BASE_URL}/#${route}`;
}

async function open(page, route, { reload = true } = {}) {
  await page.goto(urlFor(route), { waitUntil: 'networkidle2', timeout: 60000 });
  // A goto that only changes the fragment does not reload, so force one to
  // guarantee the target route renders from a clean state. Skipped after
  // signing in, where the in-memory session should be preserved.
  if (reload) await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await settle(page);
}

// index.html reads localStorage.theme, falling back to prefers-color-scheme.
// Headless Chromium reports dark, so the theme is pinned explicitly.
async function useTheme(page, theme) {
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
    { name: 'prefers-color-scheme', value: theme },
  ]);
  await page.evaluateOnNewDocument((value) => {
    localStorage.setItem('theme', value);
  }, theme);
}

// The header is fixed, so it paints over the top of any element screenshot.
async function withHeaderHidden(page, fn) {
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'shot-hide-header';
    style.textContent = 'header { visibility: hidden !important; }';
    document.head.appendChild(style);
  });
  try {
    await fn();
  } finally {
    await page.evaluate(() => document.getElementById('shot-hide-header')?.remove());
  }
}

async function captureSections(page, pageMeta) {
  const handles = await page.$$('main > section, main > div > section');
  if (handles.length === 0) return;

  await withHeaderHidden(page, async () => {
    await captureSectionHandles(page, pageMeta, handles);
  });
}

async function captureSectionHandles(page, pageMeta, handles) {
  for (let i = 0; i < handles.length; i += 1) {
    const handle = handles[i];
    const info = await handle.evaluate((el) => {
      const heading = el.querySelector('h1, h2, h3');
      const box = el.getBoundingClientRect();
      return { heading: heading ? heading.textContent.trim() : '', height: box.height };
    });
    if (info.height < 120) continue;

    const label = info.heading ? info.heading.replace(/\s+/g, ' ').slice(0, 70) : `Section ${i + 1}`;
    await handle.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await new Promise((r) => setTimeout(r, 400));
    await record(page, `${pageMeta.slug}-section-${i + 1}`, {
      title: `${pageMeta.title} — ${label}`,
      description: `Section detail from the ${pageMeta.title} page.`,
      route: pageMeta.route,
      kind: 'section',
    }, handle);
  }
}

/* ------------------------------------------------------------------ */
/*  Admin login                                                        */
/* ------------------------------------------------------------------ */

async function loginAsAdmin(page) {
  await page.goto(urlFor('/login'), { waitUntil: 'networkidle2' });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  await page.type('input[type="email"]', ADMIN_EMAIL, { delay: 10 });
  await page.type('input[type="password"]', ADMIN_PASSWORD, { delay: 10 });
  await page.click('button[type="submit"]');

  // The login page navigates to /shop on success, or renders an inline error.
  await page.waitForFunction(
    () => !window.location.hash.startsWith('#/login') || !!document.querySelector('.text-red-600'),
    { timeout: 30000 }
  );

  if (page.url().includes('#/login')) {
    const message = await page
      .$eval('.text-red-600', (el) => el.textContent.trim())
      .catch(() => 'unknown error');
    throw new Error(`Admin login failed: ${message}`);
  }
}

async function captureAdmin(page) {
  // The role is resolved asynchronously after sign-in, so allow a few attempts
  // before concluding the account genuinely lacks admin rights.
  let reached = false;
  for (let attempt = 1; attempt <= 4 && !reached; attempt += 1) {
    await open(page, '/admin', { reload: false });
    reached = await page
      .waitForFunction(
        () =>
          window.location.hash.startsWith('#/admin') &&
          !!document.querySelector('h1') &&
          document.querySelector('h1').textContent.includes('Admin'),
        { timeout: 8000 }
      )
      .then(() => true)
      .catch(() => false);
    if (!reached) console.log(`  admin route not ready (attempt ${attempt})`);
  }

  if (!reached) {
    throw new Error(
      'Could not reach /admin. Confirm the signed-in account has role = admin in the profiles table.'
    );
  }

  for (const tabMeta of ADMIN_TABS) {
    const clicked = await page.evaluate((label) => {
      const button = [...document.querySelectorAll('button')].find(
        (b) => b.textContent.trim() === label
      );
      if (!button) return false;
      button.click();
      return true;
    }, tabMeta.tab);

    if (!clicked) {
      console.warn(`  ! tab "${tabMeta.tab}" not found, skipping`);
      continue;
    }

    await new Promise((r) => setTimeout(r, 2500));
    await settle(page);
    await record(page, tabMeta.slug, {
      title: tabMeta.title,
      description: tabMeta.description,
      route: '/admin',
      kind: 'page',
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const res = await fetch(BASE_URL).catch(() => null);
  if (!res) {
    console.error(`\nCannot reach ${BASE_URL}.`);
    console.error('Start the frontend first:  cd frontend && npm run dev');
    console.error('If it is running on another port, set BASE_URL in scripts/signoff/.env\n');
    process.exit(1);
  }

  fs.rmSync(shotsDir, { recursive: true, force: true });
  fs.mkdirSync(shotsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(DESKTOP);
    await useTheme(page, 'light');

    for (const pageMeta of PAGES) {
      console.log(`\n${pageMeta.title} (${pageMeta.route})`);
      await open(page, pageMeta.route);
      await record(page, pageMeta.slug, {
        title: pageMeta.title,
        description: pageMeta.description,
        route: pageMeta.route,
        kind: 'page',
      });
      if (pageMeta.sections) await captureSections(page, pageMeta);
    }

    console.log('\nMobile views');
    const mobile = await browser.newPage();
    await mobile.setViewport(MOBILE);
    await useTheme(mobile, 'light');
    for (const pageMeta of PAGES.filter((p) => p.mobile)) {
      await open(mobile, pageMeta.route);
      await record(mobile, `${pageMeta.slug}-mobile`, {
        title: `${pageMeta.title} — Mobile (390px)`,
        description: `Responsive rendering of the ${pageMeta.title} page at mobile width.`,
        route: pageMeta.route,
        kind: 'mobile',
      });
    }
    await mobile.close();

    console.log('\nDark mode');
    const darkPage = await browser.newPage();
    await darkPage.setViewport(DESKTOP);
    await useTheme(darkPage, 'dark');
    await open(darkPage, '/');
    await record(darkPage, 'home-dark-mode', {
      title: 'Home — Dark Mode',
      description:
        'The site ships a dark theme, toggled from the header and remembered per visitor. It also honours the operating system colour scheme on a first visit.',
      route: '/',
      kind: 'page',
    });
    await darkPage.close();

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      console.log('\nAdmin Dashboard');
      await loginAsAdmin(page);
      await captureAdmin(page);
    } else {
      console.warn('\n! ADMIN_EMAIL / ADMIN_PASSWORD not set in scripts/signoff/.env');
      console.warn('  Skipping the Admin Dashboard screenshots.');
    }

    fs.writeFileSync(
      path.join(shotsDir, 'manifest.json'),
      JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl: BASE_URL, shots: manifest }, null, 2)
    );
    console.log(`\nDone. ${manifest.length} screenshots in documents/screenshots/`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\nCapture failed:', err.message);
  process.exit(1);
});
