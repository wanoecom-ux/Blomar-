# Blomar store – working rules

Store: blomar.store (`1yygu1-d4.myshopify.com`), edited through the Shopify MCP tools.

## New pages always go on the Blomar live (Elixir) base

- Every new product page or landing page is built inside a **duplicate of a "Blomar live" theme** (built on Elixir 1.6.2), never in a standalone custom theme. Duplicate with `themeDuplicate`, name it `Blomar live + <page name> (draft)`, and work only in that copy.
- Never write to the published (MAIN) theme. Never publish; the user publishes themselves.
- Build pages from **Elixir's own sections and blocks only**. The buy box is Elixir's `shop-product-details` section ("Product Details"). Start a new product template from the Blomar live `templates/product.json` setup and change the content. Don't add custom sections or custom buy-box blocks unless the user explicitly asks for one.
- Keep Elixir's own files as shipped. If a custom file is ever unavoidable, prefix it (`kv-*`), scope its CSS under `.kv`, use px (Elixir sets `html { font-size: 62.5% }`), and keep schema `name` at 25 characters or fewer.
- The MCP connector cannot delete theme files (`themeFilesDelete` is blocked). To retire a custom section, remove its `presets` so it no longer appears in "Add section".

## Reference

- `Copy of elixir-1-6-2-no-license` (`gid://shopify/OnlineStoreTheme/199167213751`): one-product Blomar LifeBulbs store. Homepage (`index.json`) and `product.json` use Elixir Product Details with the `kv_*` buy-box blocks plus the `kv-*` page sections (a layout recreation of the VigorNatura kids page, user asked for it explicitly). Homepage sets `current_product: blomar-lifebulbs`. Fonts Montserrat 800 / Poppins, Blomar wordmark logo.

- `Blomar live + Kids product page (draft)` (`gid://shopify/OnlineStoreTheme/199160004791`): template `product.kids-layout` is the Blomar live Elixir product setup (Product Details + Elixir sections) with the Lifebulbs USP text. Leftover `kv-*` files there are unused: no presets, not referenced by any template.
- Old standalone version: `Kids Supplement – VigorNatura layout (template)` (`gid://shopify/OnlineStoreTheme/198973128887`).
- Large theme files can be uploaded without pasting them: `stagedUploadsCreate` → curl POST the file → `themeFilesUpsert` with `body: {type: URL, value: <resourceUrl>}`.
- In 199167213751: product `blomar-lifebulbs` has option `Colour` (Warm Yellow / White Light). The colour picker is Elixir's `simple_variant_picker`; `kv-block-buy` uses Elixir's form id `product-form-<section.id>` so the picker updates the Add to cart variant (Kaching reads that form's `id`). Buy box extras: `kv_spacer` block (desktop/mobile height), `kv_buy` ship line + cart icon. Section `kv-video-reviews` (Tenderly-style video row) has a preset. Picker and Kaching styling live in `assets/kv-kaching.css`.
- The user edits templates in the theme editor at the same time. Re-fetch `templates/*.json` right before every upload and merge onto it; never upload a stale copy.
- LifeBulbs bundles (since the user chose it): product options Colour (Warm Yellow / White Light) x Pack (4 Pack / 6 Pack / 10 Pack), six variants, each with its pack image (cart shows it). Prices on the variants: USA price list $39.98/$79.96, $49.99/$119.94, $74.99/$199.90; Canada C$55.99/111.99, 69.99/167.99, 104.99/279.99; AUD base 55.99/111.99, 69.99/167.99, 104.99/278.99. Homepage uses the `kv_tiers` "Bundle boxes" block (snippet `kv-block-tiers`): each box clicks Elixir's hidden Pack button, follows the colour, per-bulb rounds down in USD. The Kaching app block is disabled on the homepage (it would multiply packs); its free-gifts bar is gone with it.- Free gifts (Bundle boxes block settings `gift_1..3_*`): free shipping with every pack, Emergency Guide from 6 Pack, Waterproof Backpack with 10 Pack. `kv-product.js` adds unlocked gift variants to the cart with the pack (skips ones already in the cart). Made free by automatic discounts "LifeBulbs 6 Pack: free Emergency Guide" (buys 6 Pack only) and "LifeBulbs 10 Pack: free Emergency Guide + Waterproof Backpack" (one discount, gets 2): a single pack line can only qualify one Buy X Get Y discount. Store also has an automatic "Free Worldwide Shipping" discount; LifeBulbs + gifts sit in the free "big 4" shipping profile. `kv_buy` has a Shop Pay / dynamic checkout button (`show_dynamic_checkout`).
