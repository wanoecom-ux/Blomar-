# Dream Drops product page

A product template for **Blomar Kids Magnesium Dream Drops**, laid out like the reference page's
conversion flow (gallery and buy box, benefits, evening-routine band, ingredients, steps, comparison,
guarantee, FAQ, closing call to action, reviews). All copy is Blomar's own; nothing is taken from the reference brand.

Installed on the unpublished theme **Copy of Odour Mister** and assigned to the draft product
**Blomar Kids Magnesium Dream Drops (Copy)**. The live theme is untouched.

## Files

| File | What it is |
|---|---|
| `templates/product.dream-drops.json` | The template: section order and all wording |
| `sections/dd-main-product.liquid` | Gallery, buy box, sticky add to cart, and the page design settings |
| `sections/dd-icon-cards.liquid` | Card grid (used for benefits and ingredients) |
| `sections/dd-moments.liquid` | Dark band with time-stamped cards |
| `sections/dd-steps.liquid` | Numbered how-to steps |
| `sections/dd-compare.liquid` | Comparison table |
| `sections/dd-guarantee.liquid` | Money-back band |
| `sections/dd-faq.liquid` | FAQ accordion |
| `sections/dd-cta.liquid` | Closing call to action |
| `sections/dd-reviews.liquid` | Reviews grid with filters and load more |
| `snippets/dd-heading.liquid` | Shared eyebrow + heading + intro |
| `assets/dd-product.css` | All page styles, driven by `--dd-*` variables |
| `assets/dd-theme-overrides.css` | Scoped rules that beat this theme's `!important` font, colour and button styles |
| `assets/dd-product.js` | Gallery, add to cart (opens the theme's cart drawer), sticky bar, Kaching placement, reviews |

## Preview

Shopify admin → Products → *Blomar Kids Magnesium Dream Drops (Copy)* → Preview, with the
*Copy of Odour Mister* theme selected. Or open the theme editor for that theme and choose the
`dream-drops` product template.

## Bundles (Kaching)

Kaching Bundles is enabled as an app embed. Its widget is moved into the buy box under the benefit
pills, and the deal it chooses (quantity and `__kaching_bundles` property) is sent with add to cart.
The page's own bundle picker only appears if the product gets more than one variant or a subscription plan.

## Still to replace

Everything marked `REPLACE_ME` in the theme editor. In particular:

| Item | Where | Status |
|---|---|---|
| Product images showing Blomar branding | Product media | **Current images show the Evoura brand and label** |
| Benefit claims | Buy box pills, benefit cards, comparison last row | REPLACE_ME |
| Ingredients and amounts | Ingredient cards, Ingredients accordion | REPLACE_ME |
| Dosage, servings, storage, safety | Steps, accordions, FAQ answers | REPLACE_ME |
| Shipping offer and dispatch time | Perks box, CTA chip | REPLACE_ME |
| Guarantee length and terms | Perks box, guarantee band, CTA chip | REPLACE_ME |
| Rating and review count | Buy box rating, reviews summary | REPLACE_ME |
| Reviews | Reviews section (or swap in a reviews app) | REPLACE_ME |
| Inventory | Product has 0 stock with "deny" policy | Set stock or allow overselling |

## How to customise the design

| What to change | Where | Setting |
|---|---|---|
| Colours | Theme editor → Dream Drops main product → Page design: colours | Primary, Text, Accent, Highlight, … |
| Fonts | … → Page design: type | Heading font, Body font |
| Heading and body sizes | … → Page design: type | Section heading size (desktop / mobile), Body text size |
| Button height and corners | … → Page design: shape and spacing | Button height, Button corner radius |
| Card corners | … → Page design: shape and spacing | Card corner radius |
| Section spacing and width | … → Page design: shape and spacing | Section padding (desktop / mobile), Content width |
| Hover speed | … → Page design: shape and spacing | Hover animation speed |
| Gallery image shape | Dream Drops main product → Layout | Gallery image shape |
| A section's background or alignment | That section's settings → Style | Background, Text colour, Heading alignment, Content width |
