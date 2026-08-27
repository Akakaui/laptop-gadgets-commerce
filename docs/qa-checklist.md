# QA checklist

## Build and API

- TypeScript check passes with `npm run lint`.
- Production bundle passes with `npm run build`.
- API health endpoint returns `{ ok: true }`.
- Products, orders, analytics, shipping quote, coupon validation, product CRUD, and order creation endpoints are present.
- Paystack initialization falls back to a clearly labelled demo response when a live secret is absent.
- Payment webhook endpoint is idempotent by recorded event identifier.
- Local JSON persistence can be replaced behind the server layer before high-volume production use.

## Browser flows verified

- Storefront first screen renders with stable local hero asset.
- Storefront navigation switches between home, catalog, category filters, product detail, cart, and checkout.
- Product add-to-cart confirmation updates cart quantity.
- Cart quantity decrement and removal actions work.
- Checkout accepts delivery details and Nigerian city selection.
- Coupon `WELCOME5` applies a 5% discount and recalculates total.
- Cash-on-delivery selection changes the CTA to “Place order”.
- Successful order state shows a reference and pending confirmation rather than falsely claiming payment.
- Admin overview renders metrics, revenue chart, inventory watch, and latest orders.
- Product manager renders search, edit, delete, and add-product controls.
- Product editor exposes price, stock, limited-stock, condition, description, and key specifications.
- Inventory exposes per-product restock controls and stock-health statuses.

## Accessibility and responsive checks

- Native buttons, inputs, selects, and textareas are used for interaction.
- Icon-only controls have `title` or `aria-label` text.
- Focus rings are visible and contrast is intentionally strong.
- `prefers-reduced-motion` disables transform-heavy transitions.
- Mobile CSS converts the storefront to a single-column flow and the admin shell to a compact top navigation.
- Tables retain horizontal scroll rather than collapsing data into unreadable cells.

## Known limitations before launch

Live Paystack/Flutterwave credentials, GIGL credentials, dealer-specific catalog photos, notification transport, authentication/role permissions, database migration to PostgreSQL/MySQL, and policy content still require dealer handoff work. These are explicitly documented rather than simulated as complete.
