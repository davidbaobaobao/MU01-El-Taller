# El Taller — Claude Code Build Brief

## Project overview

Static multi-page website for **El Taller**, a ceramics studio in Gràcia, Barcelona.
Design direction: **"The Tactile Archivist"** — earthy, editorial, analogue. See `DESIGN.md` for full design system spec.

Visual reference: `_stitch_reference.html` (Stitch-generated prototype — use as tonal/aesthetic reference only, not for copy-pasting code).

---

## Tech stack

- **Pure HTML + CSS + vanilla JS** — no build step, no framework, no dependencies
- **Fonts**: Noto Serif (display) + Be Vietnam Pro (body) — loaded from Google Fonts in each page `<head>`
- **Data**: JSON files in `/data/` — fetched at runtime via `fetch()` in `assets/js/main.js`
- **Deployment target**: Static host (Netlify, GitHub Pages, or similar). No server-side code.

---

## File structure

```
el-taller/
├── index.html                  ← Homepage
├── DESIGN.md                   ← Design system specification (source of truth)
├── _stitch_reference.html      ← Visual/tonal reference from Stitch
├── _partials.html              ← Nav + footer snippets (reference only — not auto-included)
│
├── pages/
│   ├── workshops.html          ← Full workshop catalogue + all upcoming dates
│   ├── studio.html             ← About / The Studio page
│   ├── gift.html               ← Gift voucher landing page
│   ├── contact.html            ← Find us + contact form + map
│   └── book.html               ← Booking request form + upcoming dates
│
├── data/
│   ├── sessions.json           ← SESSION TYPES — dynamic source of truth
│   └── upcoming-dates.json     ← UPCOMING DATES — dynamic source of truth
│
├── assets/
│   ├── css/
│   │   └── global.css          ← All styles, design tokens, component classes
│   ├── js/
│   │   └── main.js             ← Dynamic rendering: sessions, dates, nav, grain
│   └── images/
│       └── (empty — add images here)
```

---

## Dynamic sections — implementation spec

### 1. Session types (`data/sessions.json`)

**What it does:** Renders session cards from JSON. Used on:
- `index.html` → `<div id="home-sessions">` — shows 3 cards (limit), no filter
- `pages/workshops.html` → `<div id="workshops-sessions">` — shows all, with tag filter buttons

**How to invoke:**
```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    ElTaller.renderSessionCards('home-sessions', { limit: 3 });
    // or:
    ElTaller.renderSessionCards('workshops-sessions', { limit: 0, filter: true });
  });
</script>
```

**JSON schema** (`data/sessions.json`):
```json
{
  "id": "string — slug, used in bookUrl",
  "name": "string — display name",
  "tag": "string — Solo | Group | Couples | Corporate",
  "image": "string — relative path from site root e.g. assets/images/session-classic.jpg",
  "imageAlt": "string",
  "shortDescription": "string — 1–2 sentences",
  "duration": "string — e.g. 120 min",
  "groupSize": "string — e.g. 1 person",
  "price": "string — e.g. €45 or POA",
  "priceNote": "string — e.g. per person",
  "featured": "boolean — true triggers highlighted card treatment",
  "bookUrl": "string — relative path to book page with query params"
}
```

**Adding a new session:** Add a new object to `data/sessions.json`. The UI updates automatically on next page load. No HTML changes needed.

**Editing a session:** Edit the relevant object in `data/sessions.json`. Price, description, image, tag — all driven from JSON.

---

### 2. Upcoming dates (`data/upcoming-dates.json`)

**What it does:** Renders a list of upcoming sessions with availability indicators. Used on:
- `index.html` → `<div id="home-dates">` — shows 5 rows as table
- `pages/workshops.html` → `<div id="workshops-dates">` — shows all as table
- `pages/book.html` → `<div id="book-dates">` — shows all as cards

**How to invoke:**
```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    ElTaller.renderUpcomingDates('home-dates',      { limit: 5, style: 'table' });
    ElTaller.renderUpcomingDates('workshops-dates', { limit: 0, style: 'table' });
    ElTaller.renderUpcomingDates('book-dates',      { limit: 0, style: 'cards' });
  });
</script>
```

**JSON schema** (`data/upcoming-dates.json`):
```json
{
  "id": "string — unique identifier",
  "sessionId": "string — matches session id in sessions.json",
  "sessionName": "string — display name for the session",
  "date": "string — YYYY-MM-DD format",
  "time": "string — HH:MM 24-hour",
  "spotsTotal": "number — total capacity",
  "spotsLeft": "number — remaining spots (0 = sold out)",
  "bookUrl": "string — relative path with query params, empty string if sold out"
}
```

**Sold out handling:** If `spotsLeft === 0`, the book button is replaced with "Fully booked" text. Availability bar turns grey.

**Dates in the past:** `main.js` automatically filters out dates where `date < today`. No manual cleanup needed.

**Adding a new date:** Add a new object to `data/upcoming-dates.json`. No HTML changes needed.

---

## Pages — section map

### `index.html` (Homepage)
| Section | Dynamic? | Notes |
|---|---|---|
| Nav | No | Fixed top bar |
| Hero | No | Headline, subtext, dual CTA, asymmetric image collage |
| Session cards | **YES** | `renderSessionCards('home-sessions', { limit: 3 })` |
| Upcoming dates | **YES** | `renderUpcomingDates('home-dates', { limit: 5, style: 'table' })` |
| Studio moments | No | 4 static photos in offset grid |
| How it works | No | 4-step static section |
| Review marquee | No | Static text, CSS animation |
| Dark CTA block | No | "Ready to get your hands dirty?" |
| Footer | No | |
| Mobile bottom nav | No | Fixed, mobile only |

### `pages/workshops.html`
| Section | Dynamic? | Notes |
|---|---|---|
| Page header | No | Title + intro text |
| Session cards | **YES** | `renderSessionCards('workshops-sessions', { limit: 0, filter: true })` — all sessions, with filter buttons |
| Upcoming dates | **YES** | `renderUpcomingDates('workshops-dates', { limit: 0, style: 'table' })` — all dates |
| FAQ | No | Static `<details>` accordions |

### `pages/studio.html`
| Section | Dynamic? | Notes |
|---|---|---|
| Hero | No | Studio story, large image |
| Stats bar | No | 4 numbers: mugs made, wheels, rating, year |
| The space | No | Copy + 2 photos |
| Instructor bio | No | Photo + text |
| Dark CTA | No | |

### `pages/gift.html`
| Section | Dynamic? | Notes |
|---|---|---|
| Hero | No | |
| How gifting works | No | 4 steps |
| Gift options | No | 3 voucher cards (Classic, Group, Date Night) — hardcoded, intentionally not dynamic |

> **Note:** Gift voucher options are intentionally static. They mirror the main sessions but with different copy and CTAs linking to the contact form. If sessions change significantly, update this page manually.

### `pages/contact.html`
| Section | Dynamic? | Notes |
|---|---|---|
| Map | No | Google Maps `<iframe>` — **replace embed URL** |
| Info block | No | Address, hours, transport |
| Contact form | No | Wire to backend (Formspree / Netlify Forms / custom API) |

> **Action required:** Replace the placeholder Google Maps embed URL with a real embed URL for Carrer de la Perla, 12, Barcelona.

### `pages/book.html`
| Section | Dynamic? | Notes |
|---|---|---|
| Booking form | Partial | URL params pre-fill session/date/time via `prefillBookingForm()` in main.js |
| Upcoming dates | **YES** | `renderUpcomingDates('book-dates', { limit: 0, style: 'cards' })` |

> **Action required:** Wire form submission to a real backend. Currently shows a confirmation message on submit with no actual data sent.

---

## Images required

All images go in `assets/images/`. The HTML references these paths. Add real photos before launch.

| Filename | Used on | Description |
|---|---|---|
| `hero-wheel.jpg` | index.html hero | Hands on pottery wheel, close up |
| `hero-mugs.jpg` | index.html hero | Finished mugs on a shelf |
| `session-classic.jpg` | sessions card | Solo person at wheel, overhead |
| `session-group.jpg` | sessions card | Group laughing at workbench |
| `session-date.jpg` | sessions card | Two pairs of hands on clay, warm lighting |
| `session-corporate.jpg` | sessions card | Colleagues in studio |
| `studio-1.jpg` to `studio-4.jpg` | index.html gallery | Studio atmosphere photos |
| `studio-hero.jpg` | studio.html | Full studio interior |
| `studio-space-1.jpg` | studio.html | Wheels in the space |
| `studio-space-2.jpg` | studio.html | Kiln or shelving |
| `instructor.jpg` | studio.html | Instructor portrait |

**Fallback:** All `<img>` tags have `onerror` handlers that hide broken images gracefully. The layout won't break with missing images.

---

## Design tokens (from `DESIGN.md`)

All tokens are CSS custom properties in `assets/css/global.css`. Key values:

| Token | Value | Use |
|---|---|---|
| `--primary` | `#904824` | Brand terracotta, CTAs, accents |
| `--secondary` | `#7b5548` | Supporting text, labels |
| `--surface` | `#fff8f2` | Page background |
| `--on-surface` | `#1e1b15` | Body text (never pure black) |
| `--font-serif` | Noto Serif | All headings, display text |
| `--font-body` | Be Vietnam Pro | All body, labels, UI |

**Do not use:** `#000000` or `#ffffff` directly. Always use the token system.

---

## Key design rules (summary from `DESIGN.md`)

1. **No solid borders for section dividers** — use background colour shifts between sections
2. **No pure black text** — use `var(--on-surface)` (`#1e1b15`)
3. **Labels always uppercase + letter-spaced** — `.section-label` class
4. **Headings always Noto Serif** — `.section-heading` or `font-family: var(--font-serif)`
5. **Grain overlay** — injected on `<body>` by `main.js` on every page. Do not add manually.
6. **Asymmetry is intentional** — offset image collages, rotated elements, non-equal grid splits. Preserve them.
7. **Transitions** — use `cubic-bezier(0.4, 0, 0.2, 1)` for all animations. Avoid `ease-in-out` snap.

---

## Tasks for Claude Code to complete

### Priority 1 — Required before launch

- [ ] **Wire contact form** (`pages/contact.html`) to Formspree, Netlify Forms, or a custom POST endpoint. Remove the fake `e.preventDefault()` handler.
- [ ] **Wire booking form** (`pages/book.html`) to same or separate endpoint. Capture: name, email, phone, people count, session type, preferred date/time, notes.
- [ ] **Replace Google Maps embed** in `pages/contact.html` with real embed URL for Carrer de la Perla, 12, 08012 Barcelona.
- [ ] **Add real images** to `assets/images/` — see image list above. Update `data/sessions.json` image paths if filenames differ.
- [ ] **Update upcoming dates** in `data/upcoming-dates.json` with real session availability before launch. Replace placeholder 2025-05-xx dates.

### Priority 2 — Quality

- [ ] **Responsive check** on all pages at 375px, 768px, 1280px, 1440px breakpoints. Fix any grid overflow on mobile.
- [ ] **Grid responsiveness** — the 2-column `grid-template-columns:1fr 1fr` layouts on `studio.html` and `contact.html` need `@media` fallback to single column on mobile (add to `global.css`).
- [ ] **Test dynamic sections** by opening pages locally via a simple HTTP server (`python -m http.server 8000`). `fetch()` requires HTTP — will not work from `file://`.
- [ ] **Set `<input type="date">` min** to today's date on `book.html` to prevent past date selection:
  ```javascript
  document.getElementById('booking-date').min = new Date().toISOString().split('T')[0];
  ```
- [ ] **404 page** — create `404.html` in root with nav, a short message, and a link home.

### Priority 3 — Enhancement (post-launch)

- [ ] Replace static review marquee with a JSON-driven version (add `data/reviews.json`)
- [ ] Add Instagram feed embed to Studio Moments section
- [ ] Integrate a real booking system (Acuity Scheduling, Calendly, or custom backend) to replace the form-based booking flow

---

## Scripts

Project automation scripts live in `scripts/`. Run them from the project root.

### `scripts/generate-media-brief.js` — Image & Video production brief

Generates `el-taller-media-brief.docx` — a Word document containing every required image and video asset with:
- Technical specs (filename, orientation, resolution, usage)
- Art direction notes per asset
- A ready-to-paste **Meta AI prompt** for each image (also compatible with Midjourney and Adobe Firefly)
- A delivery checklist

**When to run:**
- Before a photo shoot, to brief a photographer
- When a new session type is added to `data/sessions.json` that needs a new image
- When the visual direction changes and prompts need updating

**How to run:**
```bash
# From the project root
node scripts/generate-media-brief.js
# Output: el-taller-media-brief.docx (in current directory)
```

**Requirements:**
```bash
npm install -g docx   # one-time install
```

**How to update prompts:** Edit the `ASSETS` array at the top of `scripts/generate-media-brief.js`. Each entry has:
- `filename` — must match the path referenced in HTML/CSS
- `priority` — `'Launch'` or `'Post-launch'`
- `usedOn` — where on the site this image appears
- `orientation` — format and minimum dimensions
- `subject` — one-line subject description
- `direction` — full art direction note for a human photographer
- `metaPrompt` — the AI generation prompt, ready to paste into imagine.meta.com

---

## Local development

```bash
# Serve locally (required — fetch() does not work on file://)
python -m http.server 8000
# then open: http://localhost:8000

# Or with Node:
npx serve .
# then open: http://localhost:3000
```

No build step. No npm install. Edit files directly.

---

## Content to confirm with client

- [ ] Exact studio address (currently: Carrer de la Perla, 12, 08012 Barcelona)
- [ ] Email address (currently: hola@eltaller.barcelona)
- [ ] Phone number (currently: +34 93 123 45 67)
- [ ] Studio hours (currently: Mon–Fri 10–21, Sat 10–20, Sun closed)
- [ ] Instructor name and bio (currently: Marta Solà, placeholder bio)
- [ ] Session prices (currently: Classic €45, Group €35pp, Date Night €85, Corporate POA)
- [ ] Cancellation policy wording
- [ ] Real Google Maps embed URL
