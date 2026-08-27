# Supabase production setup

Kora Commerce uses **Supabase Postgres as the production database**, Supabase Auth as the optional owner/staff identity provider, and Supabase Storage for product media. The API uses the server-only service-role key because it needs to write orders, decrement inventory, initialize payments, and process webhooks. Do not place that key in the browser or commit it to GitHub.

## Create the project

Create a Supabase project and copy its project URL and service-role key into the deployment environment. In the SQL editor, run the complete migration at `supabase/migrations/202608270001_initial_dealer_commerce.sql`. It creates the catalog, categories, product images, customers, orders, coupons, shipments, conversations, payment event idempotency table, owner/staff profiles, RLS policies, and the public `product-images` storage bucket.

Supabase recommends enabling Row Level Security on exposed tables and keeping the `service_role` key server-side.[1] The migration therefore grants public read access only to active categories/products and gives authenticated owner/staff users management policies. Customer orders, payment events, shipments, conversations, and settings are not anonymously readable.

## Create an owner

In Supabase Auth, create the dealer owner user. Then insert the matching role record in the SQL editor:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Dealer Owner', 'owner');
```

For a quick owner/staff pilot, set `SUPABASE_AUTH_REQUIRED=true` and have the frontend use a Supabase Auth access token. The current UI also supports the simpler server-side admin password session path for a small VPS deployment. Before a multi-staff launch, use Supabase Auth for all staff accounts and add a profile-aware sign-in screen.

## Seed the project

After the migration and environment variables are present, run:

```bash
npm install
npm run supabase:seed
```

The command loads `data/seed.json` through the server-only Supabase client. It is safe to run on a new project. Review and replace the sample Kora products, prices, images, policies, and order data before showing the store to a dealer.

## Product images

The `product-images` bucket is public for storefront delivery, while upload/update/delete is restricted to authenticated staff by Storage RLS policies. Add dealer-owned files through Supabase Storage and save their paths in `product_images`. The current UI uses local CSS device scenes for the demo; the storage table and bucket are ready for real uploads.

## Deploy the API

Set `NODE_ENV=production`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a randomly generated `SESSION_SECRET`. Add Paystack/Flutterwave and logistics credentials only after the dealer has verified the merchant accounts. Run `npm run build` and `npm run start`, or use the provided Dockerfile and `docker-compose.yml` on a VPS. Configure Paystack to send signed events to `/api/webhooks/paystack` and confirm the public origin uses HTTPS.

## References

[1]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase — Row Level Security"
