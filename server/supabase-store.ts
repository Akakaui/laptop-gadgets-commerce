import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readStore as readLocalStore, writeStore as writeLocalStore, type Store, type Product, type Order, type Coupon } from './db.js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseEnabled = Boolean(url && serviceKey);
const client: SupabaseClient | null = supabaseEnabled ? createClient(url!, serviceKey!, { auth: { autoRefreshToken: false, persistSession: false } }) : null;
let cachedStore: Store | null = null;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const statusToDb: Record<string, string> = { 'Awaiting payment': 'awaiting_payment', 'Awaiting confirmation': 'awaiting_confirmation', 'Ready to ship': 'ready_to_ship', Shipped: 'shipped', 'Out for delivery': 'out_for_delivery', Delivered: 'delivered', Returned: 'returned', Cancelled: 'cancelled' };
const statusFromDb: Record<string, string> = Object.fromEntries(Object.entries(statusToDb).map(([label, key]) => [key, label]));
const paymentToDb: Record<string, string> = { Pending: 'pending', Paid: 'paid', Failed: 'failed', Refunded: 'refunded', COD: 'cod' };
const paymentFromDb: Record<string, string> = Object.fromEntries(Object.entries(paymentToDb).map(([label, key]) => [key, label]));

async function loadRemote(): Promise<Store> {
  if (!client) return readLocalStore();
  const [products, orders, coupons, events] = await Promise.all([
    client.from('products').select('*').order('created_at', { ascending: false }),
    client.from('orders').select('*').order('created_at', { ascending: false }),
    client.from('coupons').select('*').order('created_at', { ascending: false }),
    client.from('payment_events').select('event_id'),
  ]);
  const firstError = [products, orders, coupons, events].find((result) => result.error)?.error;
  if (firstError) throw new Error(`Supabase load failed: ${firstError.message}`);
  return {
    products: (products.data || []).map((row: any) => ({ id: row.id, name: row.name, brand: row.brand, category: row.category || 'Laptops', price: Number(row.price), compareAt: row.compare_at ? Number(row.compare_at) : undefined, stock: row.stock, limited: row.limited, condition: row.condition, badge: row.badge || undefined, description: row.description, specs: row.specs || [], colors: row.colors || [], imageTone: row.image_tone || 'carbon' })),
    orders: (orders.data || []).map((row: any) => ({ id: row.id, customer: row.customer, phone: row.phone, email: row.email || undefined, address: row.address || undefined, itemCount: row.item_count, total: Number(row.total), status: statusFromDb[row.status] || row.status, payment: paymentFromDb[row.payment] || row.payment, city: row.city, placed: row.placed_at ? new Date(row.placed_at).toLocaleString('en-NG') : 'Unknown', product: row.product, providerReference: row.provider_reference || undefined, items: row.items || [] })),
    coupons: (coupons.data || []).map((row: any) => ({ id: row.id, code: row.code, type: row.type, value: Number(row.value), uses: row.uses, limit: row.usage_limit, expiry: row.expiry ? new Date(row.expiry).toLocaleDateString('en-GB') : '', active: row.active })),
    paymentEvents: (events.data || []).map((row: any) => row.event_id),
  };
}

async function persistRemote(store: Store) {
  if (!client) { writeLocalStore(store); return; }
  const products = store.products.map((product: Product) => ({ id: product.id, name: product.name, slug: slugify(product.name), brand: product.brand, category: product.category, condition: product.condition, description: product.description, price: product.price, compare_at: product.compareAt || null, stock: product.stock, limited: product.limited, badge: product.badge || null, specs: product.specs, colors: product.colors, image_tone: product.imageTone, active: true, updated_at: new Date().toISOString() }));
  const orders = store.orders.map((order: Order) => ({ id: order.id, customer: order.customer, phone: order.phone, email: order.email || null, address: order.address || null, item_count: order.itemCount, total: order.total, status: statusToDb[order.status] || 'awaiting_confirmation', payment: paymentToDb[order.payment] || 'pending', city: order.city, product: order.product, items: order.items || [], provider_reference: order.providerReference || null, placed_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
  const coupons = store.coupons.map((coupon: Coupon) => ({ id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value, uses: coupon.uses, usage_limit: coupon.limit, expiry: coupon.expiry ? new Date(coupon.expiry).toISOString().slice(0, 10) : null, active: coupon.active, updated_at: new Date().toISOString() }));
  const results = await Promise.all([client.from('products').upsert(products), client.from('orders').upsert(orders), client.from('coupons').upsert(coupons)]);
  const error = results.find((result) => result.error)?.error;
  if (error) throw new Error(`Supabase save failed: ${error.message}`);
}

export async function initializeRepository() { if (supabaseEnabled) cachedStore = await loadRemote(); else cachedStore = readLocalStore(); }
export async function getStore() { if (!cachedStore) await initializeRepository(); return cachedStore!; }
export async function saveStore(store: Store) { cachedStore = store; await persistRemote(store); }
export function closeRepository() { cachedStore = null; }
export async function getSupabaseUser(token?: string) { if (!client || !token) return null; const result = await client.auth.getUser(token); return result.error ? null : result.data.user; }
export async function recordPaymentEvent(eventId: string, provider: string, eventType: string, payload: unknown) { if (!client) { const store = await getStore(); if (!store.paymentEvents.includes(eventId)) { store.paymentEvents.push(eventId); await saveStore(store); } return true; } const result = await client.from('payment_events').insert({ event_id: eventId, provider, event_type: eventType, payload }); return !result.error || result.error.code === '23505'; }
