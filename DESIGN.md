# Design System Strategy: The Tactile Archivist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Tactile Archivist."** 

This system rejects the sterile, frictionless "tech" aesthetic in favor of a digital maker space that feels weathered, intentional, and profoundly human. Inspired by the independent studios of Barcelona’s Gràcia neighborhood and the editorial pacing of *Kinfolk* magazine, the experience must feel like flipping through a heavy-stock art zine.

To break the "template" look, we utilize **Intentional Asymmetry**. Elements should never feel perfectly centered or mechanically aligned. We use overlapping images, "floating" serif captions, and organic, non-geometric containers. The goal is to create a digital interface that feels as though it was laid out by hand on a wooden workbench.

---

## 2. Colors: Earth, Kiln, and Linen
Our palette is rooted in the physical materials of the craft: terracotta clay, sun-bleached linen, and raw parchment.

*   **Primary (#904824):** The "Terracotta" heart of the system. Used for high-intent actions and brand moments.
*   **Surface (#fff8f2):** The "Warm Linen" foundation. This is our default canvas.
*   **Secondary (#7b5548):** The "Dusty Adobe." Used for supporting elements that require a softer touch than the primary clay.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined through **Background Color Shifts**. For example:
*   A hero section in `surface` transitions into a featured gallery in `surface-container-low`.
*   A sidebar uses `surface-container-high` to distinguish itself from the main `surface` feed.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked physical materials. To create depth, use the Tiered Surface tokens:
*   **Base:** `surface`
*   **Floating Elements:** `surface-container-lowest` (creates a subtle "lift" against a warmer background).
*   **In-set Content:** `surface-container-highest` (creates a "pressed-in" feel, like a debossed stamp).

### The "Glass & Gradient" Rule
To add visual "soul," avoid flat color blocks for large CTAs. Instead, apply subtle gradients transitioning from `primary` to `primary_container`. For overlays (modals or navigation drawers), use **Glassmorphism**: a semi-transparent `surface_variant` with a heavy `backdrop-blur` (12px–20px) to mimic frosted glass sitting atop a messy workbench.

---

## 3. Typography: The Calligrapher vs. The Typist
The typographic tension between a romantic serif and a functional humanist sans-serif is the core of our editorial identity.

*   **Display & Headline (Noto Serif):** These are our "Calligrapher" tokens. Use `display-lg` and `headline-md` for storytelling. These should be set with slightly tighter letter-spacing (-2%) to feel like high-end print. 
*   **Body & Title (Be Vietnam Pro):** These are our "Typist" tokens. This humanist sans-serif provides the functional clarity of an artisan’s handwritten notes. `body-lg` should be the workhorse for all narrative text, utilizing a generous line-height (1.6) to ensure the "breathability" seen in luxury magazines.
*   **Labels (Be Vietnam Pro):** Use `label-md` in all-caps with increased letter-spacing (+5%) for a "stamped" or "archival" effect on metadata.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to simulate height; we use **Tonal Layering** to simulate physical presence.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural, soft lift without the need for artificial drop shadows.
*   **Ambient Shadows:** If a "floating" state is required (e.g., a floating action button), use an extra-diffused shadow. 
    *   *Spec:* Blur: 24px, Opacity: 6% of `on_surface`. This mimics natural ambient light in a sunlit studio.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border; it breaks the organic flow of the "Tactile Archivist."

---

## 5. Components: Styled Primitives

### Buttons
*   **Primary:** Filled with `primary`, text in `on_primary`. Shape: `xl` (1.5rem) for a soft, pebble-like feel.
*   **Secondary:** Ghost style using `outline-variant` at 20% opacity. No fill.
*   **Tertiary:** Text-only using `primary` color, underlined with a hand-drawn SVG stroke rather than a standard CSS underline.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Separation:** Use `surface-container-low` for card backgrounds and separate them with 32px of vertical whitespace.
*   **Imagery:** Images within cards should have a subtle grain texture overlay and a `sm` (0.25rem) corner radius to feel like printed photographs.

### Input Fields
*   **Styling:** Use `surface-container-highest` for the input track.
*   **State:** The "Active" state should not be a bright blue ring; instead, use a 2px `primary` bottom-border to mimic a signature line on a document.

### Interactive "Scraps" (Chips)
*   Use `secondary_container` for the background and `on_secondary_container` for the text. Shape: `full` (9999px). These should feel like small bits of clay or stones dropped onto the layout.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Whitespace:** Treat "empty" space as a design element, not a gap to be filled.
*   **Overlap Elements:** Allow an image to slightly overlap a text block or a background container to create an analogue, "scrapbook" feel.
*   **Apply Texture:** Use a 5% opacity grain overlay across the entire `background` to eliminate the "digital flat" look.

### Don't:
*   **Use Pure Black:** Always use `on_surface` (#1e1b15) for text. Pure black is too harsh for the "Warm Craft" mood.
*   **Use Geometric Grids:** Avoid strictly equal 3-column layouts. Try a 40/60 split or an offset 33/66 split to maintain the editorial "Archivist" feel.
*   **Animate with "Snap":** Animations should be slow and "heavy." Use `cubic-bezier(0.4, 0, 0.2, 1)` to mimic the weight of physical objects moving across a table.

### Accessibility Note:
While we prioritize a "soft" look, ensure that all text in `body-md` and `body-sm` maintains a contrast ratio of at least 4.5:1 against its respective `surface` container. Use `on_surface_variant` sparingly for decorative text only.