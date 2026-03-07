# OG Meta Tags + Generated OG Image — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add OG/Twitter meta tags and a code-generated 1200x630 OG image so CardWise links show rich previews on social platforms.

**Architecture:** Static meta tags in `index.html`, plus a Puppeteer build script that screenshots an HTML template into `public/og-image.png`. No runtime dependencies — image is generated at build time.

**Tech Stack:** HTML/CSS (OG template), Puppeteer (screenshot), TypeScript (build script)

---

## Context

- **App:** React + TypeScript + Vite credit card recommendation site
- **Color scheme:** Navy (`#0B1120`), Blue (`#2F6FED`), Teal (`#0ABFA3`), Green (`#10B981`), White (`#FFFFFF`)
- **Font:** Plus Jakarta Sans
- **Logo:** `<div class="logo-mark">&#10022;</div><div class="logo-text">Card<span>Wise</span></div>`
- **No domain yet** — use relative paths, update later
- **No test framework installed** — skip TDD for this task (it's static HTML + a build script)

---

### Task 1: Add OG and Twitter meta tags to index.html

**Files:**
- Modify: `index.html:3-7`

**Step 1: Add meta tags**

Open `index.html` and add these tags inside `<head>`, after the viewport meta tag and before `<title>`:

```html
    <!-- SEO -->
    <meta name="description" content="50+ Indian credit cards. Matched to your income and spending. Takes 2 minutes.">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="CardWise — Find Your Perfect Credit Card">
    <meta property="og:description" content="50+ Indian cards. Matched to your income and spending. Takes 2 minutes.">
    <meta property="og:image" content="/og-image.png">
    <meta property="og:url" content="">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="CardWise — Find Your Perfect Credit Card">
    <meta name="twitter:description" content="50+ Indian cards. Matched to your income and spending. Takes 2 minutes.">
    <meta name="twitter:image" content="/og-image.png">
```

**Step 2: Verify the HTML is valid**

Run: `npx vite build --mode development 2>&1 | head -5`
Expected: Build succeeds without errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add OG and Twitter Card meta tags"
```

---

### Task 2: Create the OG image HTML template

**Files:**
- Create: `scripts/og-image/template.html`

**Step 1: Create directory**

```bash
mkdir -p scripts/og-image
```

**Step 2: Create `scripts/og-image/template.html`**

Self-contained HTML file (all styles inline, no external dependencies) at exactly 1200x630px. The design:

- Background: linear gradient from `#0B1120` to `#131C2E`
- Top-left: CardWise logo (purple square with star + "CardWise" text)
- Right side headline: "Find Your Perfect Credit Card" in white
- Center: 3 card tiles side by side — simplified result cards with:
  - Card gradient background (blue to navy)
  - Bank name (HDFC, SBI, ICICI)
  - Card name below
  - Match score and net savings
- Bottom center: large bold "Save up to ₹11,000/year" in green (`#10B981`)
- Below that: "50+ cards compared in 2 minutes" in muted text

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #0B1120 0%, #131C2E 50%, #1B2740 100%);
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
    overflow: hidden;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #2F6FED, #0ABFA3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: white;
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    color: #F0F4FF;
  }

  .logo-text span {
    color: #2F6FED;
  }

  .headline {
    font-size: 32px;
    font-weight: 800;
    text-align: right;
    line-height: 1.2;
    color: #F0F4FF;
  }

  .cards-row {
    display: flex;
    gap: 24px;
    justify-content: center;
  }

  .card {
    width: 320px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .card-art {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #2F6FED, #0B1120);
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .card-bank {
    font-size: 13px;
    color: #8A96A8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-name {
    font-size: 17px;
    font-weight: 700;
    margin: 4px 0 16px;
    color: #F0F4FF;
  }

  .card-metrics {
    display: flex;
    justify-content: space-between;
  }

  .metric-label {
    font-size: 11px;
    color: #8A96A8;
    margin-bottom: 2px;
  }

  .metric-val {
    font-size: 16px;
    font-weight: 700;
  }

  .metric-val.blue { color: #2F6FED; }
  .metric-val.green { color: #10B981; }

  .card.top {
    border-color: rgba(47, 111, 237, 0.4);
    box-shadow: 0 0 30px rgba(47, 111, 237, 0.15);
  }

  .bottom {
    text-align: center;
  }

  .savings {
    font-size: 36px;
    font-weight: 800;
    color: #10B981;
  }

  .subtitle {
    font-size: 18px;
    color: #8A96A8;
    margin-top: 4px;
  }
</style>
</head>
<body>
  <div class="top-row">
    <div class="logo">
      <div class="logo-mark">&#10022;</div>
      <div class="logo-text">Card<span>Wise</span></div>
    </div>
    <div class="headline">Find Your Perfect<br>Credit Card</div>
  </div>

  <div class="cards-row">
    <div class="card top">
      <div class="card-art"></div>
      <div class="card-bank">HDFC Bank</div>
      <div class="card-name">Regalia Gold</div>
      <div class="card-metrics">
        <div>
          <div class="metric-label">Match</div>
          <div class="metric-val blue">92/100</div>
        </div>
        <div>
          <div class="metric-label">Net Savings</div>
          <div class="metric-val green">&#8377;11,200</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-art" style="background: linear-gradient(135deg, #0ABFA3, #0B1120);"></div>
      <div class="card-bank">SBI Card</div>
      <div class="card-name">SimplyCLICK</div>
      <div class="card-metrics">
        <div>
          <div class="metric-label">Match</div>
          <div class="metric-val blue">87/100</div>
        </div>
        <div>
          <div class="metric-label">Net Savings</div>
          <div class="metric-val green">&#8377;8,400</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-art" style="background: linear-gradient(135deg, #F5A623, #0B1120);"></div>
      <div class="card-bank">ICICI Bank</div>
      <div class="card-name">Amazon Pay</div>
      <div class="card-metrics">
        <div>
          <div class="metric-label">Match</div>
          <div class="metric-val blue">84/100</div>
        </div>
        <div>
          <div class="metric-label">Net Savings</div>
          <div class="metric-val green">&#8377;7,100</div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom">
    <div class="savings">Save up to &#8377;11,000/year</div>
    <div class="subtitle">50+ cards compared in 2 minutes</div>
  </div>
</body>
</html>
```

**Step 3: Open in browser to visually verify**

```bash
open scripts/og-image/template.html
```

Expected: The template renders at 1200x630 with the dark gradient background, 3 card tiles, and savings text. Visually inspect it looks good.

**Step 4: Commit**

```bash
git add scripts/og-image/template.html
git commit -m "feat: add OG image HTML template"
```

---

### Task 3: Create the Puppeteer generation script

**Files:**
- Create: `scripts/og-image/generate.ts`

**Step 1: Install puppeteer as dev dependency**

```bash
npm install -D puppeteer
```

**Step 2: Create `scripts/og-image/generate.ts`**

```typescript
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });

  const templatePath = path.resolve(__dirname, 'template.html');
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve(__dirname, '../../public/og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });

  await browser.close();
  console.log(`OG image generated: ${outputPath}`);
}

generate();
```

**Step 3: Add npm script to package.json**

In `package.json`, add to `"scripts"`:

```json
"og:generate": "npx tsx scripts/og-image/generate.ts"
```

**Step 4: Run the script and verify**

```bash
npm run og:generate
```

Expected: Prints `OG image generated: .../public/og-image.png`. File exists at `public/og-image.png`.

**Step 5: Verify the image**

```bash
open public/og-image.png
```

Expected: 1200x630 PNG matching the template design.

**Step 6: Commit**

```bash
git add scripts/og-image/generate.ts package.json package-lock.json public/og-image.png
git commit -m "feat: add Puppeteer OG image generation script"
```

---

### Task 4: Final verification

**Step 1: Run a full build**

```bash
npm run build
```

Expected: Build succeeds. `dist/og-image.png` is included in the output.

**Step 2: Preview and inspect HTML**

```bash
npm run preview
```

Open the page, view source, confirm all meta tags are present in `<head>` and `/og-image.png` is accessible.

**Step 3: Test with OG debugger (optional, when deployed)**

Use Facebook's Sharing Debugger or Twitter Card Validator to confirm the preview renders correctly.

---

## Summary of all files

| Action | File |
|--------|------|
| Modify | `index.html` — add 10 meta tags |
| Create | `scripts/og-image/template.html` — 1200x630 HTML/CSS OG image template |
| Create | `scripts/og-image/generate.ts` — Puppeteer screenshot script |
| Modify | `package.json` — add `og:generate` script |
| Generate | `public/og-image.png` — output image (committed to repo) |
| Install | `puppeteer` (dev dependency) |
