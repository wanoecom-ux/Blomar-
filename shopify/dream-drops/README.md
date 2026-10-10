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
| `sections/dd-announcement.liquid` | Sky-blue announcement bar with sale countdown; moves itself above the header and hides the theme's bar on this page |
| `sections/dd-main-product.liquid` | Gallery, buy box, sticky add to cart, and the page design settings |
| `sections/dd-icon-cards.liquid` | Card grid (used for benefits and ingredients) |
| `sections/dd-moments.liquid` | Dark band with time-stamped cards |
| `sections/dd-steps.liquid` | Numbered how-to steps |
| `sections/dd-compare.liquid` | Comparison table |
| `sections/dd-guarantee.liquid` | Money-back band |
| `sections/dd-faq.liquid` | FAQ accordion |
| `sections/dd-cta.liquid` | Closing call to action |
| `sections/dd-reviews.liquid` | Reviews grid with filters and load more |
| `templates/page.parent-guide.json` | Parent guide page: dosage, ingredients, safety, FAQs, shipping and a link to the product |
| `sections/dd-guide-hero.liquid` | Guide header with product card; loads the page fonts for pages without a product section |
| `sections/dd-guide-list.liquid` | Guide "other ingredients" box with feature pills |
| `sections/dd-guide-dose.liquid` | Age-band dosage cards, caution note and other ingredients list |
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

## Still to replace or confirm

Page text has been filled in from the reference page, with the brand changed to Blomar.

| Item | Where | Status |
|---|---|---|
| Product images | Product media | **Current images show the Evoura brand and label** |
| Supplement facts image | Ingredients accordion | Shows "Evoura" and is only 324px wide (soft when zoomed) |
| Reviews and rating | Reviews section (hidden), buy box rating (removed) | Add real Blomar reviews or a reviews app, then re-enable |
| Low-stock bar | Buy box | Shows only when stock is tracked and 1–20 units are left; current stock is 0 |
| Sale end date | Announcement bar → Sale ends | Set to 31 Oct 2026, 11:59pm Sydney; the countdown hides itself after that |
| Operational claims | Perks box | Confirm "Ships Within 1-2 Days" and "FREE Shipping Protection" are true |
| Guarantee | Guarantee band, CTA chip | Set to 30 days to match the store's announcement bar |

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

## Parent guide page

Page **Parent Guide** (`/pages/parent-guide`) is created hidden and uses the `parent-guide` template on
the *Copy of Odour Mister* theme. The wording is Blomar's own. Before publishing, check it against the label:
the other ingredients list, the dispatch time and the shipping answers.
