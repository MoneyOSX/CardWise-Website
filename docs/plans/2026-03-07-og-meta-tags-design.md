# OG Meta Tags + Generated OG Image Design

## Goal

Add Open Graph and Twitter Card meta tags to CardWise so shared links display rich preview cards on WhatsApp, Twitter, LinkedIn, etc. Generate the OG image programmatically using HTML/CSS + Puppeteer.

## Scope

- OG and Twitter Card meta tags in `index.html`
- A code-generated 1200x630px OG image
- No domain yet — URLs will use relative paths, updated when domain is set

## Meta Tags

Added to `index.html` `<head>`:

```html
<meta name="description" content="50+ Indian credit cards. Matched to your income and spending. Takes 2 minutes.">

<meta property="og:type" content="website">
<meta property="og:title" content="CardWise - Find Your Perfect Credit Card">
<meta property="og:description" content="50+ Indian cards. Matched to your income and spending. Takes 2 minutes.">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CardWise - Find Your Perfect Credit Card">
<meta name="twitter:description" content="50+ Indian cards. Matched to your income and spending. Takes 2 minutes.">
<meta name="twitter:image" content="/og-image.png">
```

`og:url` left empty until domain is configured. Image paths are relative — will resolve correctly when deployed.

## OG Image Design

Dimensions: 1200x630px

Layout:
- Dark/gradient background matching the app's color scheme
- CardWise logo in top-left corner
- "Find Your Perfect Credit Card" headline
- 3 simplified sample card tiles (HDFC, SBI, ICICI) with star ratings
- Bold "Save up to 11,000/year" as the scroll-stopping hook
- Subtitle: "50+ cards compared in 2 min"

## Implementation

### Files

| File | Purpose |
|------|---------|
| `index.html` | Add meta tags to `<head>` |
| `scripts/og-image/template.html` | Self-contained HTML/CSS template for the OG image |
| `scripts/og-image/generate.ts` | Puppeteer script to screenshot template to `public/og-image.png` |

### Dependencies

- `puppeteer` (dev dependency) — for screenshotting the HTML template

### Build Integration

New npm script:
```json
"og:generate": "npx tsx scripts/og-image/generate.ts"
```

Run manually or as a pre-build step to regenerate the OG image.

## Future Considerations

- Update `og:url` and image paths to absolute URLs when domain is set
- Consider adding structured data (JSON-LD) for search engine rich results
- PWA manifest and favicon improvements as separate work
