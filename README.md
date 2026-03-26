# EmpireZ Encyclopedia (empirez-armor-chart)

Static site: `index.html`, JSON data under `data/`, scripts under `js/`, styles in `css/styles.css`.

**Live site:** [GitHub Pages](https://justaskjack.github.io/empirez-armor-chart/) (opens `index.html`).

## Deployment checklist

Ensure these exist next to `index.html` (or your host will serve 404s):

| Path | Purpose |
|------|--------|
| `css/lightbox.min.css` | Lightbox2 styles |
| `css/styles.css` | Main stylesheet |
| `js/lightbox-plus-jquery.min.js` | Lightbox2 + jQuery (armor, helms, flags, collectables, tips) |
| `js/*.js` | Feature modules |
| `data/*.json` | Content |
| `images/` | Images (including `images/empirez_logo.png`, `images/discord-icon.png`, subfolders as referenced in JSON) |
| `sounds/` | Lightsaber click sounds (`lightsabers.json`) |

**CDN (already in `index.html`):** LightGallery 2.7.1 for weapons, backpacks, bases, POI galleries.

## Version

Site build label in the header: **v2.1** (browser tab title uses the same version).
