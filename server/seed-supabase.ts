import { saveStore, supabaseEnabled, closeRepository } from './supabase-store.js';
import { getSeedStore } from './db.js';

if (!supabaseEnabled) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running npm run supabase:seed.');
}
const store = getSeedStore();
await saveStore(store);
console.log(`Seeded ${store.products.length} products, ${store.orders.length} orders, and ${store.coupons.length} coupons into Supabase.`);
closeRepository();
