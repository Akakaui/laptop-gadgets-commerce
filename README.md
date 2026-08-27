# Kora Commerce

Kora Commerce is a portable full-stack ecommerce starter for Nigerian laptop and gadget dealers. It includes a polished storefront and a dealer control room for products, inventory, orders, coupons, customer conversations, settings, and analytics.

> This project is intentionally **not hosted in Manus**. It is a conventional Vite + React frontend with an Express API that can be deployed on a VPS or a third-party Node host.

## What is included

| Surface | Included capability |
|---|---|
| Storefront | Responsive home page, category browsing, search, product details, specs, conditions, colors, cart, coupon code, checkout, city-based delivery estimate, order confirmation |
| Admin | Dashboard metrics, revenue chart, inventory watch, catalog CRUD, price/stock/limited flags, specifications, order status, coupon management, conversation inbox, analytics, store settings |
| API | Product CRUD, order creation/status, coupons, analytics, shipping quote, shipment creation, Paystack initialize/verify/webhook, admin login/session hook, and health check |
| Integrations | Server-side Paystack initialization path, Flutterwave/GIGL readiness notes, manual shipping and demo fallbacks |
| Data | SQLite persistence in `data/kora.sqlite`, seeded from committed `data/seed.json`; use PostgreSQL/MySQL when the dealer outgrows the single-instance starter |

## Local launch

The repository is designed to run as a standalone Node service. The default non-production mode is a demo workspace; set production credentials before exposing it to the public.

```bash
npm install
npm run dev:api
# In another terminal:
npm run dev
```

Open `http://localhost:3000`. The API runs on `http://localhost:8787` and the Vite proxy routes `/api` calls to it.

For a production-style local run:

```bash
npm run build
npm run start
```

## Environment variables

Copy `.env.example` to `.env` for the API process. Never commit real credentials. In production, set `NODE_ENV=production`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `SESSION_SECRET` of at least 32 characters.

| Variable | Purpose |
|---|---|
| `PORT` | API port, defaults to `8787` |
| `PAYSTACK_SECRET_KEY` | Enables live Paystack transaction initialization |
| `PAYSTACK_WEBHOOK_SECRET` | Secret used to validate Paystack events in a production webhook implementation |
| `FLW_SECRET_KEY` | Reserved for the Flutterwave adapter |
| `FLW_SECRET_HASH` | Reserved for Flutterwave webhook verification |
| `GIGL_API_KEY` | Switches shipping quote metadata to the GIGL adapter when the account is configured |
| `DATABASE_PATH` | Optional SQLite file path; defaults to `data/kora.sqlite` |
| `ADMIN_USERNAME` | Production admin username, defaults to `admin` |
| `ADMIN_PASSWORD` | Production admin password; required when `NODE_ENV=production` |
| `SESSION_SECRET` | Session signing secret; use at least 32 random characters |
| `PUBLIC_ORIGIN` | Allowed frontend origin for CORS, such as `https://dealer-domain.com` |

## Deployment outside Manus

The simplest route is a Node host such as Render, Railway, Fly.io, or a VPS. Build the app with `npm run build`, start it with `npm run start`, and configure the environment variables in the host dashboard. Attach the dealer's custom domain and TLS certificate through the host. The starter uses SQLite with WAL mode and atomic snapshot writes, which is suitable for a small single-instance dealer deployment. If the store needs multiple application instances or high concurrency, move the repository layer to PostgreSQL/MySQL.

The server serves the built frontend from `dist` and exposes API routes under `/api`. A reverse proxy is not required on managed Node hosts. On a VPS, use a process manager such as systemd or PM2 and place Nginx/Caddy in front of the Node process. Docker deployment is provided with `Dockerfile` and `docker-compose.yml`; the compose volume persists the SQLite database across restarts.

## Live payments and delivery

The UI is deliberately provider-ready, not falsely live. For Paystack, add the secret key server-side, implement hosted checkout initialization from `/api/payments/initialize`, verify transaction amount/currency/reference server-side, and handle webhook events idempotently before marking an order paid. Flutterwave can be added through the same adapter boundary. GIG Logistics or another provider can supply live shipping rates, shipment creation, and tracking after the merchant account is activated; the UI already includes manual city rates and a provider status surface.

## How to sell this starter for ₦50k–₦100k

Position the code as a **dealer launch package**, not as a generic template. A ₦50k offer can include rebrand, catalog loading for a small number of products, basic deployment, and a short handover. A ₦100k offer can include custom storefront styling, a larger catalog migration, payment/shipping setup support, policy pages, analytics configuration, and a launch walkthrough. Charge gateway, domain, hosting, SMS/email, logistics, and product photography costs separately because those are recurring or merchant-specific.

Do not promise “everything” for ₦50k–₦100k. The strongest offer is a repeatable core plus paid add-ons: catalog migration, WhatsApp notifications, live payment verification, GIGL integration, role-based staff accounts, PostgreSQL migration, SEO pages, and monthly maintenance.

## Important pre-launch work

Replace the demo Kora identity, copy, catalog data, and hero asset. Add dealer-owned photos, exact warranty and return policies, approved delivery zones, support details, provider credentials, and order notification transport. The SQLite layer, admin login hook, rate limiting, security headers, signed Paystack webhook verification, and Docker path are included; review the remaining handoff items in `docs/tool-requests.md` before enabling live transactions.

## Key files

`src/App.tsx` contains the storefront/admin UI and demo workflows. `src/index.css` contains the living visual system. `server/index.ts` contains the portable API. `server/db.ts` contains the SQLite data layer. `data/seed.json` is the committed demo seed and `data/kora.sqlite` is created at runtime. `Dockerfile`, `docker-compose.yml`, and `.env.example` cover deployment. `design.md`, `docs/design-brief.md`, `docs/user-flows.md`, `docs/asset-manifest.md`, `docs/qa-checklist.md`, and `docs/visual-qa-notes.md` document the product and its verification.
