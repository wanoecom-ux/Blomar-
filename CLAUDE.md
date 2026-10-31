# Blomar store – working rules

Store: blomar.store (`1yygu1-d4.myshopify.com`), edited through the Shopify MCP tools.

## New pages always go on the Blomar live (Elixir) base

- Every new product page or landing page is built inside a **duplicate of a "Blomar live" theme** (built on Elixir 1.6.2), never in a standalone custom theme. Duplicate with `themeDuplicate`, name it `Blomar live + <page name> (draft)`, and work only in that copy.
- Never write to the published (MAIN) theme. Never publish; the user publishes themselves.
- Keep Elixir's header, footer, cart drawer and global settings. Add the page as its own sections plus a new `templates/product.<name>.json` (or `page.<name>.json`).
- Prefix every added file so it cannot clash with Elixir: e.g. `sections/kv-*.liquid`, `snippets/kv-*.liquid`, `assets/kv-*.css|js`.
- Scope all added CSS under a wrapper class (the `kv` sections set `"class": "kv"` in their schema and every rule starts with `.kv`). Elixir sets `html { font-size: 62.5% }`, so use px, not rem.
- Section schema `name` must be 25 characters or fewer, or Shopify rejects the file.
- Add to cart: post to `/cart/add.js` with `sections=cart-drawer,cart-icon-bubble`, then call `document.querySelector('cart-drawer').renderContents(response)` to open Elixir's drawer.

## Reference

- `Blomar live + Kids product page (draft)` (`gid://shopify/OnlineStoreTheme/199160004791`): first page ported this way. Template `product.kids-layout`, sections `kv-*`, assets `kv-product.css` / `kv-product.js`.
- Source of that page: `Kids Supplement – VigorNatura layout (template)` (`gid://shopify/OnlineStoreTheme/198973128887`).
- Large theme files can be uploaded without pasting them: `stagedUploadsCreate` → curl POST the file → `themeFilesUpsert` with `body: {type: URL, value: <resourceUrl>}`.
