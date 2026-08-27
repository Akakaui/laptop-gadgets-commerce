# Kora Commerce design system

## Product position

Kora Commerce is a compact, dealer-owned online shop for Nigerian laptop and gadget retailers. It helps a customer find the right device, understand the configuration, choose delivery, pay with confidence, and receive clear order updates. It helps the dealer manage stock, prices, product details, coupons, orders, deliveries, conversations, and revenue without touching code.

## Design movement

**Quiet hardware editorial:** a warm off-white canvas, graphite navigation, electric lime as the operational accent, precise product metadata, and restrained red for risk or out-of-stock states. The interface should feel like a well-run showroom rather than a generic marketplace.

## Typography

Use `DM Sans` for UI/body and `Space Grotesk` for display labels and numeric metrics, with system fallbacks. Body text stays between 13–16px. Product specs use compact 12–13px text. Labels are sentence case, never decorative all-caps. Large prices use tabular numerals and strong contrast.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#111315` | Primary text and navigation |
| `--ink-soft` | `#34393D` | Secondary headings |
| `--muted` | `#7A8387` | Supporting copy and metadata |
| `--canvas` | `#F5F6F3` | Page background |
| `--surface` | `#FFFFFF` | Cards, panels, drawers |
| `--line` | `#E4E8E4` | Borders and dividers |
| `--lime` | `#C9F25B` | Primary action, active state, highlights |
| `--lime-deep` | `#7FAF18` | Positive emphasis and chart bars |
| `--blue` | `#DDEBFF` | Informational background |
| `--blue-ink` | `#1E5B9A` | Informational text |
| `--amber` | `#FFEDD0` | Pending, attention |
| `--amber-ink` | `#9A5C00` | Pending text |
| `--red` | `#FFE0DD` | Destructive and low-stock background |
| `--red-ink` | `#B13B30` | Destructive and low-stock text |

## Spacing, radii, and surfaces

Use a 4px base scale with 8, 12, 16, 20, 24, 32, and 48px semantic steps. Storefront cards use 18px radii; admin tables use 14px radii; controls use 10–12px radii. Borders remain visible but quiet. Shadows are short and soft: `0 12px 30px rgba(17,19,21,.08)` for floating panels and `0 4px 12px rgba(17,19,21,.05)` for cards.

## Icon rules

Use Lucide React only for conventional controls at 16–20px with a consistent 1.8px stroke. Use the Kora wordmark as text plus a small CSS mark; do not use emoji, decorative glyphs, or mixed icon families. Every icon-only control needs an accessible label and tooltip/title.

## Layout and component variants

The storefront uses a sticky header, wide editorial hero, category strip, featured products, trust band, and a compact footer. The admin uses a collapsible dark side rail, dense but breathable content panels, metric tiles, tables, and a right-side edit drawer. Buttons have primary lime, secondary white, ghost, and destructive variants. Product cards have default, featured, low-stock, and sold-out states. Status badges use semantic color tokens.

## Interaction and motion

Normal controls transition in 160–220ms. Product cards lift 2px on hover; buttons compress to 0.98 on press. Drawers slide 240ms ease-out. Use number changes and bar width transitions sparingly for metrics. Respect `prefers-reduced-motion` by removing transforms and transition-heavy effects.

## Responsive behavior

At desktop widths the storefront is two-column where product imagery benefits from it, and the admin uses a rail plus content. At tablet widths the admin rail collapses to icons and tables allow horizontal scrolling. At phone widths the storefront becomes one column with a bottom cart bar when items exist, while the admin becomes a top bar plus horizontal nav tabs. All touch targets are at least 44px.

## Content voice

Specific, calm, and commerce-literate. Say “Add to cart”, “Reserve item”, “Awaiting payment”, and “Ready to ship”. Avoid fake urgency, invented reviews, unsupported guarantees, and marketplace jargon. Use NGN formatting consistently.

## Accessibility and recovery

Use semantic buttons/links, visible focus rings, descriptive labels, logical keyboard order, 4.5:1 text contrast, alt text for imagery, and adjacent validation messages. Destructive product deletion requires confirmation. Payment state must be recoverable from the order page and never inferred only from a redirect. Empty states always name the next action.

## Approved and rejected patterns

Approved: configuration chips, specs-first product cards, operational status badges, clear empty states, low-stock alerts grounded in actual inventory, local payment and delivery choices, and admin edit drawers with save feedback.

Rejected: generic purple gradients, fake star ratings, random testimonials, impossible “instant delivery” promises, all-caps UI, emoji icons, repeated pill containers, hiding specs behind hover, or showing a successful payment before server verification.
