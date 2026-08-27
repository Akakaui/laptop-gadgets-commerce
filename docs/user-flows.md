# Kora Commerce user flows

| Flow | User goal | Entry | Steps | Success | Failure/recovery | Priority |
|---|---|---|---|---|---|---|
| Discover and compare | Find a suitable laptop quickly | Storefront home or catalog | Search, choose category, inspect specs, select variant | Product detail makes model, configuration, price, stock, and delivery clear | No-results state suggests removing filters or browsing all products | P0 |
| Product to cart | Reserve the exact configuration | Product detail | Choose color/storage/condition when available, set quantity, add | Cart count and line item update with subtotal | Sold-out or insufficient stock blocks add and explains next action | P0 |
| Checkout | Submit a complete order | Cart | Enter name, phone, email, address, city, delivery method, coupon, payment method | Order created with clear reference and pending/paid status | Inline validation, invalid coupon explanation, payment retry, order lookup recovery | P0 |
| Payment confirmation | Pay without false success | Checkout/payment redirect | Initialize provider checkout, return, verify server-side, show status | Order is marked paid only after verification/webhook | Pending status remains recoverable; retry or contact support | P0 |
| Delivery tracking | Know where an order is | Order confirmation or lookup | View status timeline, tracking number, delivery provider, support contact | Customer sees awaiting fulfilment, shipped, out for delivery, delivered, or returned | Manual tracking fallback shows last update and contact path | P1 |
| Admin catalog | Keep product data accurate | Admin Products | Search, filter, create/edit, set price, stock, specs, badges, visibility, limited quantity | Product appears correctly in storefront and inventory counts update | Validation prevents missing name/price/category; delete requires confirmation | P0 |
| Admin fulfilment | Move an order to completion | Admin Orders/Deliveries | Review payment, assign delivery, add tracking, update status, add internal note | Customer-facing timeline updates | Invalid status transition is blocked with explanation | P0 |
| Admin promotions | Increase conversion safely | Admin Coupons | Create code, discount type/value, minimum spend, expiry, usage limit, active state | Coupon validates at checkout and reports usage | Expired, invalid, or limit-reached codes explain why | P1 |
| Admin conversations | Answer customer questions | Admin Conversations | Open inbox, read message, respond, mark resolved | Customer receives reply in connected channel when configured | Local fallback stores message and shows configuration requirement | P1 |
| Admin analytics | See whether the shop is working | Admin Dashboard/Analytics | Review revenue, orders, AOV, stock warnings, top products, conversion proxy | Metrics reflect current orders and are legible | Empty data state shows how to get first order | P1 |

## Required states

The app includes loading, empty catalog, no-results, low stock, sold out, invalid form, invalid coupon, pending payment, failed payment, successful payment, order not found, API unavailable, unsaved admin edit, destructive confirmation, and success feedback. The demo can be used without credentials; live provider buttons are clearly labelled as needing configuration until environment variables are supplied.
