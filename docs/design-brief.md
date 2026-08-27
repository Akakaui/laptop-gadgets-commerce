# Kora Commerce design brief

## Product

A reusable ecommerce website kit for physical-product businesses. It is copied, rebranded, and deployed separately for each client on that client’s own domain or hosting account; it is not a multi-tenant SaaS. The same core can support clothing, shoes, gadgets, laptops, beauty, home goods, accessories, computer parts, and other retail categories. Live payment, shipping, email, and chat credentials are configured through environment variables.

## Primary audiences

The buyer is a consumer or small business shopping for any physical product. The operator is the business owner or store assistant who manages catalog, categories, inventory, prices, variants, sizes, weights, orders, coupons, delivery, customer chat, reviews, email leads, and revenue.

## Success criteria

A customer can discover a product, inspect configuration, add it to cart, choose a delivery area, apply a coupon, and submit an order. A dealer can add/edit/delete a product, change stock or price, mark limited inventory, update an order status, create coupons, and view revenue and top products. The app can be moved to third-party hosting without Manus-specific dependencies.

## Information architecture

Storefront routes are home, catalog, product detail, cart, checkout, order confirmation, reviews, email signup, and customer order lookup. Admin routes are dashboard, products, categories, inventory, orders, deliveries, coupons, conversations, review moderation, email leads, analytics, appearance, and settings. The demo presents these surfaces with a storefront/admin switch so a buyer can experience the entire product in one preview.

## Assumptions

The dealer sells both new and refurbished devices. Delivery zones and fees are configurable. The shop may support card, bank transfer, USSD, and cash/payment on delivery depending on the dealer's approved provider and policies. Live credentials, tax rules, return policy, and exact delivery coverage are not yet provided, so those are configuration fields rather than fabricated claims.

## Technical direction

Use a portable Vite + React frontend with an Express API server. Each copied client project has its own Supabase Postgres database, Auth users, Storage bucket, domain, and credentials; there is no shared tenant layer. The server keeps the Supabase service-role key private. The local SQLite seed remains only as an offline demo fallback. Payment and shipping adapters are server-side, and signed webhooks update order payment state idempotently.

## Visual direction

Quiet hardware editorial: off-white canvas, graphite navigation, electric lime operational accent, and product/specification clarity. The storefront should feel like a local specialist showroom. The admin should feel like a practical control room, not a generic analytics template.

## Content gaps for a dealer handoff

Replace the demo name/logo, add the dealer's WhatsApp/phone/email/address, confirm payment provider and live keys, configure actual delivery zones and rates, load the dealer's catalog images/specifications, publish policies, and connect a domain. The code includes a configuration panel and sample seed data to make this handoff straightforward.
