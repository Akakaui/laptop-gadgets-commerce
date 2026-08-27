# Nigeria Laptop Ecommerce Research Notes

## Sources reviewed

1. TechBuild Africa article URL: https://techbuild.africa/9-best-places-to-buy-laptops-online-in-nigeria/
   - The URL currently returns a Page Not Found page, so it is not reliable evidence for dealer names or claims.
   - The search result suggested a current list of Nigerian laptop sellers, but the source was not usable in-page and should not be cited as verified.

2. SLOT Nigeria laptop category URL: https://slot.ng/categories/laptops
   - The storefront exposes Store Locator, product search, account, wishlist, shopping cart, About Us, Franchise, Shop Now, FAQ, warranty policy, privacy policy, terms, contact numbers, physical address, social links, and payment badges.
   - The site presents store and support information prominently, suggesting trust, warranty, and offline presence matter for Nigerian electronics buyers.
   - The site visibly supports Paystack and RexPay by Accelerex, showing local payment branding is a useful trust cue.
   - The page content was partially dynamic/blank for products in the captured view, so product merchandising details need validation from other dealer references.

## Initial product implications

- Build a mobile-first, searchable catalog with categories, product variants, stock status, wishlist/cart, and clear delivery/pickup options.
- Include trust modules for warranty, returns, physical address/store locator, customer support, and payment methods.
- Make the theme configurable so a dealer can replace logo, colors, contacts, policies, locations, and payment/shipping credentials without code changes.
- Use a provider-agnostic payment and shipping adapter layer rather than hard-coding one vendor; first-class launch options should include Paystack, Flutterwave, and manual bank transfer/payment-on-delivery where allowed.
- Keep verified claims separate from assumptions; do not invent dealer reviews, sales numbers, or certifications.

## Verified integration findings

3. Paystack Payment Channels documentation: https://paystack.com/docs/payments/payment-channels/
   - Paystack documents cards, bank-account payment, temporary bank-transfer accounts, USSD, QR, and other supported channels depending on market/account.
   - Nigeria-specific documentation states Pay with Bank and Pay with Transfer are available to Nigerian businesses.
   - Transfer confirmation is asynchronous and requires a webhook endpoint; the application should not mark an order paid from the browser redirect alone.
   - The recommended starter integration is hosted/redirect checkout with server-side verification plus webhook handling, avoiding direct handling of card data and PCI complexity.

4. GIG Logistics Developer page: https://giglogistics.com/developer/
   - GIGL states that its APIs integrate shipping directly into websites/apps, automate shipments, enable real-time tracking, and integrate delivery features.
   - GIGL lists ecommerce, last-mile, warehousing, and a shipping price calculator as offerings. API access appears to require contacting the provider for details/credentials.
   - The product should provide a GIGL adapter interface with a manual fallback for rate, shipment, and tracking updates when API credentials are not configured.

## Architecture constraint

The customer explicitly asked not to host in Manus. Therefore the build should remain portable: conventional Node/TypeScript project, environment-variable configuration, database migrations, provider adapters, seed data, Docker/managed-hosting instructions, and no dependency on Manus-only runtime features. The initial implementation can run with demo/mock providers, then switch to live Paystack/Flutterwave/GIGL credentials through environment variables.

## Supabase architecture research

Supabase's official Row Level Security documentation states that RLS provides granular authorization inside Postgres and recommends enabling RLS on every table in an exposed schema. It also warns that adding policies does not revoke existing grants, and that the `service_role` bypasses RLS and must remain server-side. Source: https://supabase.com/docs/guides/database/postgres/row-level-security

Implication for this ecommerce app: storefront-readable product/category data should use narrow public `SELECT` policies; customer/order/admin data should not be exposed to the anonymous browser; owner/staff operations should use authenticated Supabase users plus role checks, and any server-side service key must stay in the API environment.
