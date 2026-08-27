# QA checklist

## Build and API

- TypeScript check passes with `npm run lint`.
- Production bundle passes with `npm run build`.
- API health endpoint returns `{ ok: true }`.
- Products, orders, analytics, shipping quote, coupon validation, product CRUD, and order creation endpoints are present.
- Paystack initialization falls back to a clearly labelled demo response when a live secret is absent.
- Payment webhook endpoint is idempotent by recorded event identifier.
- Supabase is the production repository when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured; SQLite is offline fallback only.
- The Supabase migration enables RLS on every exposed table, limits anonymous reads to active catalog data, and protects admin/customer/payment data.
- `npm run supabase:seed` is run only with the server-only service key and succeeds on a migrated project.

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

Live Paystack/Flutterwave credentials, GIGL credentials, dealer-specific catalog photos, notification transport, final Supabase Auth user creation, policy content, and provider account configuration still require dealer handoff work. The production migration, RLS policies, Supabase repository adapter, Storage bucket policies, seed command, security headers, rate limiting, and signed webhook boundary are included rather than simulated as missing.
