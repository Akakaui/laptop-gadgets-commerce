# Kora Commerce — final verification and sales handoff

## Executive summary

Kora Commerce is a portable, copyable ecommerce website kit for physical-product businesses. It includes a customer storefront, cart and checkout journey, a dealer admin dashboard, a portable Express API, Supabase production persistence, generic catalog fields for categories/variants/sizes/weight, reviews, email leads, provider-ready payment and delivery boundaries, and documentation for separate client deployment. It is not a multi-tenant SaaS; each client gets an independent copy, Supabase project, domain, credentials, and catalog. The implementation is committed to the dedicated GitHub repository at the latest pushed commit after the Supabase migration. The original agentic-chatbot repository has been restored to its pre-commerce commit and no longer contains this product.

The product direction is deliberately suitable for a ₦50,000–₦100,000 dealer launch package: the core is reusable, the visual identity can be changed, and the merchant-specific work is isolated into catalog loading, credentials, policies, domain, and hosting handoff rather than buried in one-off code.

## Research findings that shaped the build

A current SLOT Nigeria laptop category page exposes search, account, wishlist, cart, store locator, customer service, warranty policy, physical address, support numbers, social links, and local payment badges. That supports treating **trust, warranty, offline presence, and support** as first-class storefront content rather than optional footer details.[1]

Paystack’s official payment documentation states that Nigerian merchants can use payment channels including cards, bank-account payments, temporary bank-transfer accounts, and other supported methods. It also states that transfer confirmation is asynchronous and should use a webhook, which is why the build keeps payment server-side and does not mark an order paid based only on browser return.[2]

Flutterwave’s official webhook documentation similarly requires signature verification, server-side transaction verification, fast acknowledgement, and idempotent event processing. Those are documented as launch requirements for the Flutterwave adapter rather than simulated as already complete.[3]

GIG Logistics states that its APIs can automate shipments, enable real-time tracking, and integrate delivery features directly into websites and apps. Its ecommerce page also describes payment-on-delivery, reverse logistics, last-mile delivery, and live tracking capabilities. The build therefore includes city-based manual delivery estimates now and a GIGL adapter boundary for live credentials later.[4] [5]

## What was built

| Area | Delivered |
|---|---|
| Storefront | Sticky navigation, configurable business branding, search, category browse, product detail, optional SKU/specs/condition/colours/sizes/weight/options, reviews, email capture, stock messaging, cart, coupon, city selection, payment method selection, and order confirmation; empty fields are hidden |
| Admin | Overview metrics, revenue chart, low-stock watch, catalog CRUD, category-ready product editor, SKU/specifications/sizes/colours/weight, stock/restock, limited-stock flag, order statuses, coupon toggles, customer conversations, review moderation, email leads, analytics, appearance/settings, and integration readiness |
| API | Health, generic product CRUD, orders with stock deduction, coupon validation, analytics, shipping quote, shipment creation, review submission/moderation, email lead capture, appearance settings, Paystack initialize/verify/webhook, admin login/session hooks, and idempotent payment-event recording |
| Portability | Vite + React frontend, Express server, Supabase migrations/seed command, environment-variable template, Dockerfile, Compose file, `npm run build`, `npm run start`, and no Manus hosting dependency |
| Documentation | Design system, brief, user flows, capability matrix, asset manifest, tool requests, QA checklist, research notes, and visual QA notes |

## Verification performed

The type check and production build pass with `npm run lint` and `npm run build`. A minimal product containing only an ID, name, price, stock, and availability flag was created, returned from the public catalog, and removed successfully; SKU, category, brand, condition, description, specifications, colours, sizes, weight, tags, variants, rating, and image were not required. The local API health endpoint returns a successful response. The browser review verified the storefront first screen, admin overview, product manager, product editor drawer, inventory restock view, cart, checkout fields, coupon calculation, cash-on-delivery selection, and pending-confirmation order success state. API smoke tests also verified reviews, settings, email validation, lead creation, protected lead access, and provider-ready payment initialization. Temporary QA order and email-lead records were removed before delivery so the committed demo store remains clean.

A repair was required during QA: an admin setter was initially passed as the selected product value, which caused the product drawer to render during the storefront view. The state wiring was separated, the app reloaded correctly, and the build passed afterward. A later native SQLite driver crash was diagnosed and eliminated by using Node 22’s built-in SQLite only for the offline fallback. The production path now uses Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured. The implementation uses an honest provider-ready state; it does not claim that live gateway or logistics credentials are connected.

## Deployment outside Manus

Deploy the repository to Render, Railway, Fly.io, a VPS, or another Node host. Create a Supabase project, run the SQL migration in `supabase/migrations/`, configure Supabase Auth users and the `profiles` roles, run `npm run supabase:seed` with the server-only service key, then deploy with `npm run build` and `npm run start`. The server serves `dist` and the API under `/api`. Attach the dealer’s domain and TLS through the selected provider. Docker deployment is also provided for a VPS or managed container host.

| Launch layer | Demo implementation | Production handoff |
|---|---|---|
| Persistence | Supabase Postgres via `server/supabase-store.ts`; local SQLite is offline fallback only | Supabase project with migration, RLS, backups, and seed command |
| Payments | Provider-ready UI plus Paystack demo fallback | Paystack or Flutterwave secret, hosted checkout, transaction verification, signed webhook, idempotency |
| Delivery | Manual city rates for Lagos, Abuja, Port Harcourt, Ibadan, and Other | GIGL or another logistics API for live quote, shipment, tracking, and reverse logistics |
| Notifications | Local admin conversation demo | WhatsApp, email, SMS, or support inbox transport |
| Access control | Demo workspace or password session | Supabase Auth bearer validation can be enabled with `SUPABASE_AUTH_REQUIRED=true`; RLS policies enforce owner/staff access |
| Catalog media | Local hero asset and CSS product scenes | Dealer-owned photos, storage bucket, product image upload and optimization |

## Commercial packaging recommendation

The ₦50,000 package should include copying the standalone kit, rebranding, catalog loading for a limited number of products, basic deployment, and a short handover. The ₦100,000 package should include custom storefront styling, a larger catalog import, policy pages, appearance/settings configuration, payment/shipping setup support, analytics configuration, and a launch walkthrough. Each client should receive an independent deployment rather than a shared SaaS account. Domain, hosting, gateway fees, SMS/email, logistics, photography, and ongoing maintenance should be separate charges.

The most defensible sales message is: **“A dealer-owned online shop and admin system that lets you update products, stock, prices, coupons, orders, delivery, and revenue from anywhere.”** Do not promise unrestricted custom development at this price. Sell the reusable core with paid add-ons for live gateways, GIGL integration, WhatsApp notifications, SQL migration, staff accounts, SEO, and maintenance.

## References

[1]: https://slot.ng/categories/laptops "SLOT Nigeria — laptops category"
[2]: https://paystack.com/docs/payments/payment-channels/ "Paystack — Payment Channels"
[3]: https://developer.flutterwave.com/v3.0/docs/webhooks "Flutterwave — Webhooks"
[4]: https://giglogistics.com/developer/ "GIG Logistics — Developer / API"
[5]: https://giglogistics.com/e-commerce/ "GIG Logistics — E-commerce Services"
