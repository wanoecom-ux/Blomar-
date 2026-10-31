# Blomar store – working rules

Store: blomar.store (`1yygu1-d4.myshopify.com`), edited through the Shopify MCP tools.

## New pages always go on the Blomar live (Elixir) base

- Every new product page or landing page is built inside a **duplicate of a "Blomar live" theme** (built on Elixir 1.6.2), never in a standalone custom theme. Duplicate with `themeDuplicate`, name it `Blomar live + <page name> (draft)`, and work only in that copy.
- Never write to the published (MAIN) theme. Never publish; the user publishes themselves.
- Build pages from **Elixir's own sections and blocks only**. The buy box is Elixir's `shop-product-details` section ("Product Details"). Start a new product template from the Blomar live `templates/product.json` setup and change the content. Don't add custom sections or custom buy-box blocks unless the user explicitly asks for one.
- Keep Elixir's own files as shipped. If a custom file is ever unavoidable, prefix it (`kv-*`), scope its CSS under `.kv`, use px (Elixir sets `html { font-size: 62.5% }`), and keep schema `name` at 25 characters or fewer.
- The MCP connector cannot delete theme files (`themeFilesDelete` is blocked). To retire a custom section, remove its `presets` so it no longer appears in "Add section".

## Reference

- `Blomar live + Kids product page (draft)` (`gid://shopify/OnlineStoreTheme/199160004791`): template `product.kids-layout` is the Blomar live Elixir product setup (Product Details + Elixir sections) with the Lifebulbs USP text. Leftover `kv-*` files there are unused: no presets, not referenced by any template.
- Old standalone version: `Kids Supplement – VigorNatura layout (template)` (`gid://shopify/OnlineStoreTheme/198973128887`).
- Large theme files can be uploaded without pasting them: `stagedUploadsCreate` → curl POST the file → `themeFilesUpsert` with `body: {type: URL, value: <resourceUrl>}`.
