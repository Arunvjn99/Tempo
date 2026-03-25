# Design System Specification: The Fluid Architectural Standard

## 1. Overview & Creative North Star: "The Digital Curator"
This design system rejects the "boxed-in" nature of traditional fintech. Our Creative North Star is **The Digital Curator**: an experience that feels like a high-end gallery space—quiet, authoritative, and meticulously organized, yet possessing the tactile depth of physical glass and light.

We move beyond the "SaaS Template" look by prioritizing **intentional asymmetry** and **tonal layering**. We do not use lines to define space; we use light, shadow, and material properties. The result is a dashboard that feels less like a utility and more like a premium advisory service.

---

## 2. Colors & Materiality
The palette is rooted in a sophisticated neutral base to allow white-label accents and AI-driven insights to command attention without visual noise.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or layout containment. 
Boundaries must be defined through:
1. **Background Color Shifts:** Placing a `surface_container_low` card on a `surface` background.
2. **Tonal Transitions:** Using the 8pt spacing scale to create "rivers" of negative space that act as natural dividers.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
*   **Base Level:** `surface` (#f7f9fb) – The canvas.
*   **Secondary Level:** `surface_container_low` (#f2f4f6) – For sidebar or utility zones.
*   **Floating Level:** `surface_container_lowest` (#ffffff) – Reserved for primary content cards and interactive modules.

### The Glass & AI Token
*   **Glassmorphism:** For floating overlays (Modals, Tooltips, Navigation), use `surface_container_lowest` at 70% opacity with a `20px` backdrop-blur.
*   **AI-Color (Violet):** Use `on_tertiary_container` (#9863ff) for AI-generated insights. This color should always be paired with a subtle glow or a `0.05` opacity violet background to signify "intelligence."

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance technical precision with premium editorial flair.

*   **The Display Scale (Manrope):** Large, breathable headers (`display-lg` to `headline-sm`) use Manrope. These should be set with tighter letter-spacing (-0.02em) to feel "machined" and expensive. 
*   **The Functional Scale (Inter):** All body text, labels, and numeric data use Inter. 
*   **Numeric Emphasis:** Retirement balances and performance data should use `headline-lg` or `display-sm` with a medium weight. Numbers are the "hero" of this system; they deserve more white space than the labels describing them.
*   **Muted Hierarchy:** Use `on_surface_variant` (#45464d) for secondary descriptions. This creates a soft contrast that guides the eye to primary data first (Progressive Disclosure).

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural geometry.

*   **The Layering Principle:** Stacking tiers creates natural lift. Place a `surface_container_highest` element inside a `surface_container` to indicate a "pressed" or "nested" state.
*   **Ambient Shadows:** For floating elements, use extra-diffused shadows. 
    *   *Token:* `0px 12px 32px rgba(25, 28, 30, 0.04)`. 
    *   The shadow must be a tinted version of `on_surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#c6c6cd) at **15% opacity**. Never use 100% opaque borders.
*   **Signature Textures:** Apply a linear gradient from `primary` (#000000) to `primary_container` (#1b1b1b) on main CTAs to add "soul" and dimension.

---

## 5. Components & Modular Elements

### Buttons
*   **Primary:** High-contrast (`primary` background, `on_primary` text). Apply a subtle `0.5px` inner-glow on hover.
*   **Secondary:** Glass-style. `surface_container_highest` at 40% opacity with backdrop-blur.
*   **Interaction:** On hover, buttons should "lift" (Y-axis -2px) and the shadow spread should increase by 4px.

### Cards & Data Lists
*   **Cards:** Use `xl` (0.75rem) roundedness. No borders. Use `surface_container_lowest` to pop against the `surface` background.
*   **Lists:** Forbid divider lines. Separate list items using `1.5` (0.5rem) spacing units. On hover, the background should shift to `surface_container_high`.

### Input Fields
*   **Styling:** Minimalist. Use a `surface_container_highest` bottom-only highlight or a subtle background fill. Labels should use `label-md` and always sit above the field, never as placeholders.

### AI Insight Chips
*   **Styling:** Semi-transparent violet background (`tertiary_container` at 10% opacity) with a `1px` Ghost Border in `on_tertiary_container`. These chips "glow" subtly using a 4px violet shadow.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use the 8pt spacing scale (`2`, `4`, `8`) to create rhythmic white space.
*   **Do** favor "Flat Depth"—using color shifts instead of shadows wherever possible.
*   **Do** use `manrope` for any text larger than 24px to maintain the editorial "vibe."
*   **Do** utilize micro-interactions. A card should feel like it's magnetically attracting the cursor (subtle lift + glow).

### Don't:
*   **Don't** use 100% black (#000000) for body text; use `on_surface` for better readability.
*   **Don't** ever use a solid grey line to separate content. If you need a line, use a 1px `surface_container_highest` fill, but try spacing first.
*   **Don't** clutter the screen. If a piece of info isn't critical *right now*, use progressive disclosure (e.g., "Show More" or hover tooltips).
*   **Don't** use sharp corners. Every element must adhere to the `Roundedness Scale`, favoring `lg` and `xl` for a soft, premium feel.