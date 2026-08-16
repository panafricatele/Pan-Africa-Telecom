# Pan Africa Telecom — Website Redesign

A modern, interactive redesign for **Pan Africa Telecom** (ICASA License No: `2411/CECNS/CECN/FEB/2023`, AS: `329467`).

## Structure

```
PanAfricaTelecom/
├── frontend/          # Vite + React + TypeScript + Tailwind CSS
└── backend/           # NestJS API with class-validator DTOs
```

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` to the backend.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

The API runs on `http://localhost:3000/api/v1`.

## API endpoints

- `POST /api/v1/coverage/check` — Checks Pan Africa Telecom coverage zones, Telkom/Openserve, and Evotel; returns provider-specific results and matching packages.
- `GET /api/v1/services` — Lists packages. Optional filters: `?category=internet` and `?technology=fibre`.
- `POST /api/v1/leads/signup` — Submits a service inquiry / signup lead.

## Maintaining prices, packages, and coverage

The backend is the single source of truth for packages and coverage data:

- **Packages and pricing:** edit `backend/src/database/products.json`.
- **Pan Africa Telecom coverage:** edit `backend/src/database/coverage-zones.json`. Add town, suburb, or address fragments to a zone's `keywords` list.
- **Provider integrations:** configure `backend/src/database/providers.json`.

Restart the backend after changing coverage or provider configuration. Package and zone repositories expose reload methods, but a restart is the supported deployment workflow. Run `npm run build` in `backend` before a production launch so these JSON files are copied to `dist`.

`Telkom / Openserve` and `Evotel` adapters currently use deterministic mock responses while `mock` is `true` in `providers.json`. When approved provider API credentials and integration specifications are available, set `mock` to `false`, keep credentials in environment variables rather than source control, and implement their authenticated HTTP requests in the respective coverage adapters.

## Design tokens

- **Primary Dark:** `#0B192C`
- **Accent Blue:** `#0088FF`
- **Success/Fibre:** `#10B981`

## Notes

- Icons: `lucide-react`
- Animations: `framer-motion`
- Coverage and package data are representative and can be wired to a real database or CRM.
