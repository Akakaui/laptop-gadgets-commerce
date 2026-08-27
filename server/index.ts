import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const dataFile = path.join(dataDir, 'store.json');
const port = Number(process.env.PORT || 8787);

type Product = { id: string; name: string; brand: string; category: string; price: number; stock: number; limited: boolean; condition: string; badge?: string; description: string; specs: { label: string; value: string }[]; colors: string[]; imageTone: string };
type Order = { id: string; customer: string; phone: string; itemCount: number; total: number; status: string; payment: string; city: string; placed: string; product: string };
type Coupon = { id: string; code: string; type: 'percent' | 'fixed'; value: number; uses: number; limit: number; expiry: string; active: boolean };
type Store = { products: Product[]; orders: Order[]; coupons: Coupon[]; paymentEvents: string[] };

const seed: Store = {
  products: [
    { id: 'p1', name: 'ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', category: 'Laptops', price: 1480000, stock: 4, limited: true, condition: 'Refurbished', badge: 'Staff pick', description: 'A featherlight business laptop with a quiet keyboard, excellent battery life, and enough power for serious work.', specs: [{ label: 'Processor', value: 'Intel Core i7-1365U' }, { label: 'Memory', value: '16GB RAM' }, { label: 'Storage', value: '512GB SSD' }, { label: 'Display', value: '14” WUXGA' }], colors: ['Carbon black', 'Storm grey'], imageTone: 'carbon' },
    { id: 'p2', name: 'MacBook Air M3 15-inch', brand: 'Apple', category: 'Laptops', price: 2150000, stock: 7, limited: false, condition: 'New', badge: 'New arrival', description: 'A spacious, silent everyday machine for founders, creatives, and teams that live in the browser.', specs: [{ label: 'Processor', value: 'Apple M3 chip' }, { label: 'Memory', value: '8GB unified' }, { label: 'Storage', value: '256GB SSD' }, { label: 'Display', value: '15.3” Liquid Retina' }], colors: ['Midnight', 'Starlight', 'Silver'], imageTone: 'silver' },
    { id: 'p3', name: 'EliteBook 840 G10', brand: 'HP', category: 'Laptops', price: 1225000, stock: 2, limited: true, condition: 'Refurbished', badge: 'Only 2 left', description: 'A reliable professional laptop with a comfortable keyboard, strong webcam, and business-grade build.', specs: [{ label: 'Processor', value: 'Intel Core i5-1335U' }, { label: 'Memory', value: '16GB RAM' }, { label: 'Storage', value: '512GB SSD' }, { label: 'Display', value: '14” FHD IPS' }], colors: ['Silver'], imageTone: 'blue' },
    { id: 'p4', name: 'ROG Zephyrus G14', brand: 'ASUS', category: 'Gaming', price: 1890000, stock: 5, limited: false, condition: 'New', badge: 'Performance', description: 'Compact gaming performance with a high-refresh display for workdays that extend past midnight.', specs: [{ label: 'Processor', value: 'Ryzen 9 8945HS' }, { label: 'Memory', value: '16GB RAM' }, { label: 'Storage', value: '1TB SSD' }, { label: 'Graphics', value: 'RTX 4060 8GB' }], colors: ['Eclipse grey'], imageTone: 'orange' },
    { id: 'p5', name: 'Dell Latitude 5420', brand: 'Dell', category: 'Laptops', price: 670000, stock: 11, limited: false, condition: 'Refurbished', description: 'A dependable office workhorse for teams, students, and first-time laptop buyers.', specs: [{ label: 'Processor', value: 'Intel Core i5-1145G7' }, { label: 'Memory', value: '8GB RAM' }, { label: 'Storage', value: '256GB SSD' }, { label: 'Display', value: '14” FHD' }], colors: ['Black'], imageTone: 'slate' },
    { id: 'p6', name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'Accessories', price: 145000, stock: 18, limited: false, condition: 'New', badge: 'Desk essential', description: 'An ergonomic wireless mouse tuned for long editing sessions and productive desk setups.', specs: [{ label: 'Connection', value: 'Bluetooth / Bolt' }, { label: 'DPI', value: '8,000 DPI' }, { label: 'Battery', value: 'Up to 70 days' }, { label: 'Colour', value: 'Graphite' }], colors: ['Graphite', 'Pale grey'], imageTone: 'mouse' },
  ],
  orders: [
    { id: 'KOR-1048', customer: 'Aisha Bello', phone: '0803 555 0194', itemCount: 1, total: 1480000, status: 'Ready to ship', payment: 'Paid', city: 'Ikeja, Lagos', placed: 'Today, 09:42', product: 'ThinkPad X1 Carbon Gen 11' },
    { id: 'KOR-1047', customer: 'Chinedu Okafor', phone: '0816 240 7710', itemCount: 2, total: 815000, status: 'Awaiting payment', payment: 'Transfer', city: 'Wuse 2, Abuja', placed: 'Today, 08:18', product: 'Dell Latitude 5420 + MX Master 3S' },
    { id: 'KOR-1046', customer: 'Mariam Yusuf', phone: '0705 880 2114', itemCount: 1, total: 2150000, status: 'Out for delivery', payment: 'Paid', city: 'Yaba, Lagos', placed: 'Yesterday, 15:06', product: 'MacBook Air M3 15-inch' },
    { id: 'KOR-1045', customer: 'Tunde Adeyemi', phone: '0902 109 3344', itemCount: 1, total: 1225000, status: 'Delivered', payment: 'Paid', city: 'Port Harcourt', placed: 'Yesterday, 11:36', product: 'EliteBook 840 G10' },
  ],
  coupons: [
    { id: 'c1', code: 'WELCOME5', type: 'percent', value: 5, uses: 18, limit: 100, expiry: '31 Dec 2026', active: true },
    { id: 'c2', code: 'LAGOS10000', type: 'fixed', value: 10000, uses: 6, limit: 20, expiry: '30 Sep 2026', active: true },
  ],
  paymentEvents: [],
};

function ensureStore() { fs.mkdirSync(dataDir, { recursive: true }); if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2)); }
function readStore(): Store { ensureStore(); return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
function writeStore(store: Store) { fs.writeFileSync(dataFile, JSON.stringify(store, null, 2)); }
function asyncHandler(fn: express.RequestHandler): express.RequestHandler { return (request, response, next) => Promise.resolve(fn(request, response, next)).catch(next); }

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(root, 'dist')));

app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'kora-commerce-api' }));
app.get('/api/products', (_request, response) => response.json(readStore().products));
app.get('/api/products/:id', (request, response) => { const product = readStore().products.find((item) => item.id === request.params.id); return product ? response.json(product) : response.status(404).json({ error: 'Product not found' }); });
app.post('/api/products', (request, response) => { const store = readStore(); const product = request.body as Product; if (!product.id || !product.name || !product.price) return response.status(400).json({ error: 'Product name, id, and price are required' }); store.products = [product, ...store.products.filter((item) => item.id !== product.id)]; writeStore(store); return response.status(201).json(product); });
app.put('/api/products/:id', (request, response) => { const store = readStore(); const index = store.products.findIndex((item) => item.id === request.params.id); if (index < 0) return response.status(404).json({ error: 'Product not found' }); store.products[index] = { ...store.products[index], ...request.body, id: request.params.id }; writeStore(store); return response.json(store.products[index]); });
app.delete('/api/products/:id', (request, response) => { const store = readStore(); store.products = store.products.filter((item) => item.id !== request.params.id); writeStore(store); return response.status(204).end(); });
app.get('/api/orders', (_request, response) => response.json(readStore().orders));
app.post('/api/orders', (request, response) => { const store = readStore(); const order = request.body as Order; if (!order.customer || !order.phone || !order.total) return response.status(400).json({ error: 'Customer, phone, and total are required' }); store.orders = [order, ...store.orders]; writeStore(store); return response.status(201).json(order); });
app.patch('/api/orders/:id', (request, response) => { const store = readStore(); const index = store.orders.findIndex((item) => item.id === request.params.id); if (index < 0) return response.status(404).json({ error: 'Order not found' }); store.orders[index] = { ...store.orders[index], ...request.body }; writeStore(store); return response.json(store.orders[index]); });
app.get('/api/coupons', (_request, response) => response.json(readStore().coupons));
app.post('/api/coupons/validate', (request, response) => { const coupon = readStore().coupons.find((item) => item.code.toLowerCase() === String(request.body.code || '').toLowerCase() && item.active && item.uses < item.limit); return coupon ? response.json(coupon) : response.status(404).json({ error: 'Coupon is invalid, inactive, expired, or fully used' }); });
app.get('/api/analytics', (_request, response) => { const store = readStore(); const paid = store.orders.filter((order) => order.payment === 'Paid'); const revenue = paid.reduce((sum, order) => sum + order.total, 0); return response.json({ revenue, paidOrders: paid.length, totalOrders: store.orders.length, lowStock: store.products.filter((product) => product.stock <= 4).length, topProducts: store.products.slice(0, 5).map((product, index) => ({ ...product, sold: [42, 31, 24, 18, 12][index] || 0 })) }); });
app.get('/api/shipping/quote', (request, response) => { const city = String(request.query.city || 'Lagos'); const fees: Record<string, number> = { Lagos: 8500, Abuja: 12000, 'Port Harcourt': 18000, Ibadan: 12000, Other: 18000 }; return response.json({ provider: process.env.GIGL_API_KEY ? 'gig' : 'manual', city, fee: fees[city] || fees.Other, currency: 'NGN', estimatedDays: city === 'Lagos' ? '1–2 business days' : '2–5 business days' }); });
app.post('/api/payments/initialize', asyncHandler(async (request, response) => { const { email, amount, reference } = request.body; if (!email || !amount) return response.status(400).json({ error: 'Email and amount are required' }); if (!process.env.PAYSTACK_SECRET_KEY) return response.json({ provider: 'demo', status: 'pending', reference: reference || `demo_${Date.now()}`, message: 'Add PAYSTACK_SECRET_KEY to enable live checkout.' }); const result = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, amount: Math.round(Number(amount) * 100), reference }) }); return response.status(result.ok ? 200 : 502).json(await result.json()); }));
app.post('/api/webhooks/paystack', (request, response) => { const eventId = String(request.body?.data?.id || request.body?.id || `${request.body?.event}-${Date.now()}`); const store = readStore(); if (!store.paymentEvents.includes(eventId)) { store.paymentEvents.push(eventId); writeStore(store); } return response.status(200).json({ received: true }); });
app.get('*', (_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')));
app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => response.status(500).json({ error: error.message || 'Server error' }));

ensureStore();
app.listen(port, () => console.log(`Kora Commerce API listening on http://localhost:${port}`));
