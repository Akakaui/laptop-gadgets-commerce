# Kora Commerce design brief

## Product

A reusable ecommerce starter for Nigerian laptop and gadget dealers. It is designed to be rebranded and deployed on a dealer-owned domain or hosting account. The first working demo uses a realistic seeded catalog and a dealer admin surface; live payment, shipping, email, and chat credentials are configured through environment variables.

## Primary audiences

The buyer is a Nigerian consumer or small business shopping for a laptop, phone, monitor, accessory, or refurbished device. The operator is a dealer or store assistant who manages catalog, inventory, prices, orders, coupons, delivery, customer chat, and revenue.

## Success criteria

A customer can discover a product, inspect configuration, add it to cart, choose a delivery area, apply a coupon, and submit an order. A dealer can add/edit/delete a product, change stock or price, mark limited inventory, update an order status, create coupons, and view revenue and top products. The app can be moved to third-party hosting without Manus-specific dependencies.

## Information architecture

Storefront routes are home, catalog, product detail, cart, checkout, order confirmation, and customer order lookup. Admin routes are dashboard, products, inventory, orders, deliveries, coupons, conversations, analytics, and settings. The demo presents these surfaces with a storefront/admin switch so a buyer can experience the entire product in one preview.

## Assumptions

The dealer sells both new and refurbished devices. Delivery zones and fees are configurable. The shop may support card, bank transfer, USSD, and cash/payment on delivery depending on the dealer's approved provider and policies. Live credentials, tax rules, return policy, and exact delivery coverage are not yet provided, so those are configuration fields rather than fabricated claims.

## Technical direction

Use a portable Vite + React frontend with an Express API server. Production data lives in Supabase Postgres, with Supabase Auth for owner/staff sessions and Supabase Storage for product media; the server keeps the service-role key private. The local SQLite seed remains only as an offline demo fallback. Payment and shipping adapters are server-side, and signed webhooks update order payment state idempotently.

## Visual direction

Quiet hardware editorial: off-white canvas, graphite navigation, electric lime operational accent, and product/specification clarity. The storefront should feel like a local specialist showroom. The admin should feel like a practical control room, not a generic analytics template.

## Content gaps for a dealer handoff

Replace the demo name/logo, add the dealer's WhatsApp/phone/email/address, confirm payment provider and live keys, configure actual delivery zones and rates, load the dealer's catalog images/specifications, publish policies, and connect a domain. The code includes a configuration panel and sample seed data to make this handoff straightforward.
