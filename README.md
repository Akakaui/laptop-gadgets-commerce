# Kora Commerce

Kora Commerce is a portable, copyable full-stack ecommerce website kit for any business that sells physical products online or offline. Copy the repository for each client, rebrand the storefront, load the client’s catalog, and deploy it as that business’s own independent website. It works for clothing, shoes, gadgets, laptops, beauty, home goods, accessories, computer parts, food products, and other physical retail categories.

> This project is intentionally **not hosted in Manus**. It is a conventional Vite + React frontend with an Express API that can be deployed on a VPS or a third-party Node host.

## What is included

| Surface | Included capability |
|---|---|
| Storefront | Responsive home page, configurable branding, category browsing, search, product details, SKU/specifications, condition, colours, sizes, weight, options, ratings/reviews, cart, coupon code, email signup, checkout, city-based delivery estimate, order confirmation |
| Admin | Dashboard metrics, revenue chart, inventory watch, catalog CRUD, categories, price/stock/limited flags, SKU/specifications, sizes, colours, weight, variants/options, order status, coupon management, conversation inbox, review moderation, email leads, appearance/settings, analytics |
| API | Product/category-ready catalog reads and CRUD, order creation/status with stock deduction, coupons, analytics, shipping quote, shipment creation, review submission/moderation, email lead capture, appearance settings, Paystack initialize/verify/webhook, admin login/session hook, and health check |
| Integrations | Server-side Paystack initialization path, Flutterwave/GIGL readiness notes, manual shipping and demo fallbacks |
| Data | Supabase Postgres, RLS, Auth hooks, Storage bucket policies, and a repeatable seed migration; local SQLite is an offline demo fallback only |

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
| `SUPABASE_URL` | Client’s Supabase project URL; required for production database mode |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase key; never expose it in frontend code |
| `SUPABASE_AUTH_REQUIRED` | Set `true` to require Supabase Auth bearer sessions on admin API routes |
| `DATABASE_PATH` | Optional offline-demo SQLite path; not the production data store |
| `ADMIN_USERNAME` | Production admin username, defaults to `admin` |
| `ADMIN_PASSWORD` | Production admin password; required when `NODE_ENV=production` |
| `SESSION_SECRET` | Session signing secret; use at least 32 random characters |
| `PUBLIC_ORIGIN` | Allowed frontend origin for CORS, such as `https://dealer-domain.com` |

## Deployment outside Manus

The simplest route is a Node host such as Render, Railway, Fly.io, or a VPS with a separate Supabase project for that client. Run the migration in `supabase/migrations/`, create the client’s Auth owner, run `npm run supabase:seed`, then build with `npm run build`, start with `npm run start`, and configure the environment variables in the host dashboard. Attach the client’s custom domain and TLS certificate through the host.

The server serves the built frontend from `dist` and exposes API routes under `/api`. A reverse proxy is not required on managed Node hosts. On a VPS, use a process manager such as systemd or PM2 and place Nginx/Caddy in front of the Node process. Docker deployment is provided with `Dockerfile` and `docker-compose.yml`. Each copied project can use its own Supabase project, domain, credentials, brand, and catalog without sharing customer data with another business.

## Live payments and delivery

The UI is deliberately provider-ready, not falsely live. For Paystack, add the secret key server-side, implement hosted checkout initialization from `/api/payments/initialize`, verify transaction amount/currency/reference server-side, and handle webhook events idempotently before marking an order paid. Flutterwave can be added through the same adapter boundary. GIG Logistics or another provider can supply live shipping rates, shipment creation, and tracking after the merchant account is activated; the UI already includes manual city rates and a provider status surface.

## How to sell this starter for ₦50k–₦100k

Position the code as a **dealer launch package**, not as a generic template. A ₦50k offer can include rebrand, catalog loading for a small number of products, basic deployment, and a short handover. A ₦100k offer can include custom storefront styling, a larger catalog migration, payment/shipping setup support, policy pages, analytics configuration, and a launch walkthrough. Charge gateway, domain, hosting, SMS/email, logistics, and product photography costs separately because those are recurring or merchant-specific.

Do not promise “everything” for ₦50k–₦100k. The strongest offer is a repeatable core plus paid add-ons: catalog migration, WhatsApp notifications, live payment verification, GIGL integration, role-based staff accounts, PostgreSQL migration, SEO pages, and monthly maintenance.

## Important pre-launch work

Replace the demo Kora identity, copy, catalog data, and hero asset. Add dealer-owned photos, exact warranty and return policies, approved delivery zones, support details, provider credentials, and order notification transport. The SQLite layer, admin login hook, rate limiting, security headers, signed Paystack webhook verification, and Docker path are included; review the remaining handoff items in `docs/tool-requests.md` before enabling live transactions.

## Key files

`src/App.tsx` contains the storefront/admin UI and reusable demo workflows. `src/index.css` contains the living visual system. `server/index.ts` contains the portable API. `server/supabase-store.ts` contains the production Supabase adapter, while `server/db.ts` contains the offline SQLite fallback. `supabase/migrations/202608270001_initial_dealer_commerce.sql` defines the production schema, RLS, Auth roles, and Storage policies. `data/seed.json` is the committed demo seed. `Dockerfile`, `docker-compose.yml`, `.env.example`, and `.github/workflows/ci.yml` cover deployment and verification. `docs/supabase-production-setup.md`, `docs/design-brief.md`, `docs/user-flows.md`, `docs/asset-manifest.md`, `docs/qa-checklist.md`, and `docs/visual-qa-notes.md` document the product and its handoff.
