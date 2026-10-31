# Blomar store – working rules

Store: blomar.store (`1yygu1-d4.myshopify.com`), edited through the Shopify MCP tools.

## New pages always go on the Blomar live (Elixir) base

- Every new product page or landing page is built inside a **duplicate of a "Blomar live" theme** (built on Elixir 1.6.2), never in a standalone custom theme. Duplicate with `themeDuplicate`, name it `Blomar live + <page name> (draft)`, and work only in that copy.
- Never write to the published (MAIN) theme. Never publish; the user publishes themselves.
- Keep Elixir's header, footer, cart drawer and global settings. Add the page as its own sections plus a new `templates/product.<name>.json` (or `page.<name>.json`).
- The buy box is always Elixir's own `shop-product-details` section ("Product Details"), so all Elixir blocks stay available. Never replace it with a custom main-product section. Custom buy-box blocks are added as `kv_*` block types: block definitions go at the start of the `blocks` array in `sections/shop-product-details.liquid`'s schema, and a matching `{% when 'kv_*' %}{% render 'kv-block-*', block: block %}` branch goes before the last top-level `{% endcase %}` in `snippets/product-info.liquid`. Every Elixir section stays addable on top of that.
- Prefix every added file so it cannot clash with Elixir: e.g. `sections/kv-*.liquid`, `snippets/kv-*.liquid`, `assets/kv-*.css|js`.
- Scope all added CSS under a wrapper class (the `kv` sections set `"class": "kv"` in their schema and every rule starts with `.kv`). Elixir sets `html { font-size: 62.5% }`, so use px, not rem.
- Section schema `name` must be 25 characters or fewer, or Shopify rejects the file.
- Add to cart: post to `/cart/add.js` with `sections=cart-drawer,cart-icon-bubble`, then call `document.querySelector('cart-drawer').renderContents(response)` to open Elixir's drawer.

## Reference

- `Blomar live + Kids product page (draft)` (`gid://shopify/OnlineStoreTheme/199160004791`): first page ported this way. Template `product.kids-layout` (Elixir Product Details buy box holding the kids buy box as `kv_*` blocks: style, rating, badges, title, usp, checklist, ship, tiers, buy, videos, faq; `kv_style` sets fonts and colours for every kids block and section), page sections `kv-*`, assets `kv-product.css` / `kv-product.js`. `sections/kv-main-product.liquid` is no longer used.
- Source of that page: `Kids Supplement – VigorNatura layout (template)` (`gid://shopify/OnlineStoreTheme/198973128887`).
- Large theme files can be uploaded without pasting them: `stagedUploadsCreate` → curl POST the file → `themeFilesUpsert` with `body: {type: URL, value: <resourceUrl>}`.
