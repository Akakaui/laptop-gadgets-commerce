# Capability matrix

| Capability | Available | Required | Decision |
|---|---:|---:|---|
| Web browsing | Yes | Yes | Used to inspect Nigerian retail, payment, and logistics references. |
| Screenshots / visual review | Yes | Yes | Used during local browser QA at desktop and mobile widths. |
| Web/image search | Yes | Yes | Used to source a laptop hero image reference; copied into `public/assets`. |
| Image generation | Available | No | Not required; the product surface uses a local photo plus CSS product scenes and labels. |
| Video generation | Available | No | Not required for an operations-first ecommerce app. |
| 3D model creation/rendering | Available | No | Not required for the dealer starter; product galleries can accept additional photos later. |
| Asset storage | Local/project storage | Yes | Stable local asset path under `public/assets`; production storage can be S3-compatible. |
| Visual review | Yes | Yes | Browser screenshots and DOM/interaction inspection are part of final QA. |
| External payments | Provider APIs | Yes for launch | Paystack and Flutterwave adapters are planned; demo falls back to mock/pending state until keys are configured. |
| External logistics | Provider API | Yes for launch | GIGL adapter contract plus manual rate/tracking fallback; provider access is credential-dependent. |
| Chat delivery | Optional provider | No for demo | Local inbox is implemented; WhatsApp/Telegram/email transport is a dealer configuration extension. |
| Hosting | Third-party | Yes | No Manus hosting dependency. Deploy with Node process, Docker, Render/Railway/Fly/ VPS, or similar. |

## Known gaps

Live provider credentials, merchant verification, shipping account activation, domain, email/SMS sender, and final product photos are dealer-specific and must be supplied before production launch. Those gaps are intentionally exposed in the handoff documentation instead of being hidden behind fake success states.
