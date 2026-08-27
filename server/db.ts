import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataDir = path.join(root, 'data');
const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'kora.sqlite');
const seedPath = path.join(dataDir, 'seed.json');

export type Product = { id: string; name: string; brand: string; category: string; price: number; compareAt?: number; stock: number; limited: boolean; condition: string; badge?: string; description: string; specs: { label: string; value: string }[]; colors: string[]; imageTone: string; sku?: string; weight?: string; sizes?: string[]; variants?: { label: string; value: string; priceDelta?: number; stock?: number }[]; tags?: string[]; rating?: number; reviewCount?: number };
export type Order = { id: string; customer: string; phone: string; itemCount: number; total: number; status: string; payment: string; city: string; placed: string; product: string; email?: string; address?: string; providerReference?: string; items?: { productId: string; quantity: number }[] };
export type Coupon = { id: string; code: string; type: 'percent' | 'fixed'; value: number; uses: number; limit: number; expiry: string; active: boolean };
export type Review = { id: string; productId: string; productName: string; customer: string; rating: number; comment: string; status: 'Published' | 'Pending' | 'Hidden'; createdAt: string };
export type Lead = { id: string; email: string; source: string; createdAt: string; status: 'Subscribed' | 'Unsubscribed' };
export type StoreSettings = { storeName: string; tagline: string; logoUrl?: string; heroUrl?: string; primaryColor: string; supportPhone: string; supportEmail: string; whatsappNumber: string; address: string; currency: string; announcement: string; enabledFeatures: { reviews: boolean; emailCapture: boolean; variants: boolean; delivery: boolean; coupons: boolean; chat: boolean; cod: boolean; analytics: boolean; wishlist: boolean; payments: boolean } };
export type Store = { products: Product[]; orders: Order[]; coupons: Coupon[]; paymentEvents: string[]; reviews: Review[]; leads: Lead[]; settings: StoreSettings };

fs.mkdirSync(dataDir, { recursive: true });
export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec('CREATE TABLE IF NOT EXISTS store_snapshots (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL);');

const rawSeed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const seed: Store = { ...rawSeed, reviews: rawSeed.reviews || [], leads: rawSeed.leads || [], settings: rawSeed.settings || { storeName: 'Kora Computers', tagline: 'Good gear. Clear choices.', primaryColor: '#c9f25b', supportPhone: '0800 000 KORA', supportEmail: 'hello@koracomputers.ng', whatsappNumber: '', address: 'Lagos, Nigeria', currency: 'NGN', announcement: 'Nationwide delivery available.', enabledFeatures: { reviews: true, emailCapture: true, variants: true, delivery: true, coupons: true, chat: true, cod: true, analytics: true, wishlist: false, payments: true } } };
export function getSeedStore(): Store { return JSON.parse(JSON.stringify(seed)); }
const readSnapshot = (key: keyof Store) => db.prepare('SELECT value FROM store_snapshots WHERE key = ?').get(key) as { value: string } | undefined;
const writeSnapshot = db.prepare('INSERT INTO store_snapshots (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at');

export function resetDatabase() {
  db.exec('BEGIN IMMEDIATE;');
  try {
    db.prepare('DELETE FROM store_snapshots').run();
    const timestamp = new Date().toISOString();
    (Object.keys(seed) as (keyof Store)[]).forEach((key) => writeSnapshot.run(key, JSON.stringify(seed[key]), timestamp));
    db.exec('COMMIT;');
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

if (!readSnapshot('products')) resetDatabase();

export function readStore(): Store {
  return (Object.keys(seed) as (keyof Store)[]).reduce((store, key) => {
    const row = readSnapshot(key);
    store[key] = row ? JSON.parse(row.value) : seed[key];
    return store;
  }, {} as Store);
}

export function writeStore(store: Store) {
  db.exec('BEGIN IMMEDIATE;');
  try {
    const timestamp = new Date().toISOString();
    (Object.keys(store) as (keyof Store)[]).forEach((key) => writeSnapshot.run(key, JSON.stringify(store[key]), timestamp));
    db.exec('COMMIT;');
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

export function closeDatabase() { db.close(); }
