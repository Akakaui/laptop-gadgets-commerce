# Production handoff requests

The demo is not blocked for local use. The following dealer-specific inputs are required before real transactions are enabled:

| Request | Why it is needed | Expected input | Where it goes |
|---|---|---|---|
| Paystack or Flutterwave merchant credentials | Initialize and verify live payments | Server-side secret key, public key if using hosted checkout, webhook secret/hash | Deployment environment variables |
| GIGL or preferred logistics account | Create shipments, calculate live rates, and track deliveries | API credentials and confirmed service coverage | Deployment environment variables and shipping adapter |
| Store identity | Rebrand the storefront | Logo, store name, colors, phone, email, address, WhatsApp number | Admin settings and public assets |
| Catalog assets | Make listings launch-ready | Dealer-owned product photos, exact specs, warranty/condition details, prices | Catalog storage and product records |
| Policies | Set buyer expectations and reduce disputes | Returns, warranty, delivery, privacy, terms, payment-on-delivery rules | Store content/settings |
| Sender details | Send customer notifications | SMTP/provider credentials and verified sender address/phone | Deployment environment variables |

The customer can provide these values through a secure deployment environment. Do not commit secrets to GitHub or place them in browser local storage. Until they are provided, the UI correctly communicates that payment and logistics integrations are “Not connected” or “Provider-ready.”
