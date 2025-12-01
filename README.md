# Tire Fill Calculator

A single-page, embeddable CO2 tire fill calculator that supports both imperial and metric sizing from one interface.

## Running locally

This project is plain HTML/CSS/JS. Open `tire-fill-calculator.html` directly in a browser or serve the directory:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Embedding

Host the built files (or this folder) anywhere you like and embed it in an iframe on your site:

```html
<iframe
  src="https://yourdomain.com/path-to-calculator/tire-fill-calculator.html"
  style="width: 100%; max-width: 1024px; height: 720px; border: 0; border-radius: 16px; overflow: hidden;"
  title="Tire Fill Calculator"
></iframe>
```

The calculator offers tabs for imperial and metric sizing, computes tire air volume using a cylindrical approximation, and estimates CO2 needed per fill plus the number of fills based on the gas you have on hand.

If you prefer to embed it inline (without an iframe), drop the markup from `tire-fill-calculator.html` into your page and include the assets with conflict-resistant filenames:

```html
<link rel="stylesheet" href="/assets/tire-fill-calculator.css" />
<script type="module" src="/assets/tire-fill-calculator.js"></script>
```

Rename the files however you like—`tire-fill-calculator.css` and `tire-fill-calculator.js` are intentionally unique to avoid clashing with existing assets.

## Testing

Unit tests cover the core calculation helpers. Run them with Node:

```bash
npm test
```

## Styling and asset loading

All styling lives in `tire-fill-calculator.css`. If your site already ships a theme bundle, you can merge the calculator styles into it to avoid an extra HTTP request. The difference is small for a single stylesheet, but bundling can help reduce render-blocking calls on slow connections. When merging:

- Keep the `:root` variables intact so the calculator colors and spacing resolve correctly.
- The class names are scoped to the calculator container, so copying the rules into your theme should not override unrelated site styles. If you prefer extra isolation, prepend a parent selector that matches the embed container.
- If you inline the CSS into your theme, remove the `<link rel="stylesheet" href="tire-fill-calculator.css" />` tag from `tire-fill-calculator.html` so it does not request the standalone file.
