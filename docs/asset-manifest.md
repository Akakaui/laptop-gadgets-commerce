# Asset manifest

| ID | Class | Job | Source/tool | Ratio/format | Destination | Alt text | License/provenance | Fallback | Status |
|---|---|---|---|---|---|---|---|---|---|
| hero-laptop | 2D image | Storefront hero atmosphere | Image search result titled “Laptop Dark Pictures” from Unsplash search | 3000×2124 JPEG | `public/assets/hero-laptop.jpg` | Laptop on a dark desk | Search result identified Unsplash; verify final license/attribution with the dealer before production | CSS laptop scene | In use |
| product-device-scenes | CSS/SVG-like | Product cards, cart thumbnails, admin inventory thumbnails | Hand-authored CSS geometry and gradients | Responsive CSS | `DeviceVisual` in `src/App.tsx` | Product configuration visual; not a literal product photo | Original project code | Same CSS scene on all devices | In use |
| kora-mark | CSS mark | Wordmark and navigation identity | Hand-authored CSS mark | Vector-like CSS | `.brand-mark` in `src/index.css` | Kora Commerce mark | Original project code | Text-only KORA wordmark | In use |

## Production handoff

The hero image is a visual placeholder for the dealer's own product photography. Before launch, replace it with a verified dealer-owned or properly licensed image and update this manifest. Each catalog product should eventually accept one or more merchant-uploaded images through the storage layer; the current demo intentionally keeps the catalog lightweight and uses configuration-driven CSS scenes for stable preview performance.
