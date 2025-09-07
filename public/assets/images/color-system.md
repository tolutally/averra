# Averra Color System — Lilac & Charcoal 

Cool, proper, professional. Dark **buttons** and a **dark sidebar** for clarity; lilac carries brand character without owning every control. High accessibility by default.

---

## 1) Core palette (raw hues)

**Brand — Lilac** (for links, highlights, chips, hero tints)

* Brand 800: **#5E4EE0**
* Brand 700: **#6E5AE6** *(primary link/focus, key accents)*
* Brand 600: **#7D6EF0** *(secondary accents, icons)*
* Brand 300: **#E3DFFF** *(pastel surfaces, badges)*
* Brand 100: **#F4F2FF** *(very light tint, empty states)*

**Action — Charcoal** (for CTAs & dark sidebar)

* Action 900: **#0A0F1A** *(pressed)*
* Action 800: **#0B1220** *(hover)*
* Action 700: **#111827** *(primary CTA, sidebar text on hover)*

**Neutrals — Warm/Slate** (readability)

* Neutral 50: **#F6F5F3** *(page bg)*
* Neutral 100: **#FAFAF9** *(alt surface)*
* Neutral 200: **#F1F5F9** *(muted blocks)*
* Neutral 250: **#E5E7EB** *(borders/dividers)*
* Neutral 400: **#94A3B8** *(subtle text on dark)*
* Neutral 600: **#475569** *(secondary text)*
* Neutral 700: **#334155** *(body text)*
* Neutral 800: **#1F2937** *(headings)*
* Neutral 900: **#111827** *(dark text/sidebars)*
* White: **#FFFFFF**

**Semantic/status**

* Success 600: **#16A34A**
* Warning 600: **#B45309**
* Danger 600: **#DC2626**
* Info 600: **#0284C7**

---

## 2) Semantic design tokens (CSS)

Use semantic tokens in product code; raw hues stay in design files.

```css
:root{
  /* Brand (Lilac) */
  --brand-100:#F4F2FF; --brand-300:#E3DFFF; --brand-600:#7D6EF0; --brand-700:#6E5AE6; --brand-800:#5E4EE0;

  /* Action (Charcoal buttons/sidebar) */
  --action-700:#111827; --action-800:#0B1220; --action-900:#0A0F1A;

  /* Neutrals */
  --neutral-50:#F6F5F3; --neutral-100:#FAFAF9; --neutral-200:#F1F5F9; --neutral-250:#E5E7EB;
  --neutral-400:#94A3B8; --neutral-600:#475569; --neutral-700:#334155; --neutral-800:#1F2937; --neutral-900:#111827; --white:#FFFFFF;

  /* Status */
  --success-600:#16A34A; --warning-600:#B45309; --danger-600:#DC2626; --info-600:#0284C7;

  /* Surfaces */
  --surface-page:var(--neutral-50);
  --surface-card:var(--white);
  --surface-alt:var(--neutral-100);
  --surface-border:var(--neutral-250);

  /* Text */
  --text-strong:var(--neutral-800);
  --text-body:var(--neutral-700);
  --text-muted:var(--neutral-600);
  --text-inverse:var(--white);

  /* Links & focus */
  --link:var(--brand-700);
  --link-hover:var(--brand-800);
  --focus-ring:var(--brand-700);

  /* Buttons */
  --btn-primary-bg:var(--action-700);
  --btn-primary-bg-hover:var(--action-800);
  --btn-primary-bg-active:var(--action-900);
  --btn-primary-text:var(--text-inverse);
  --btn-secondary-bg:var(--white);
  --btn-secondary-text:var(--text-body);
  --btn-secondary-border:var(--surface-border);
  --btn-danger-bg:var(--danger-600);
  --btn-danger-text:var(--text-inverse);

  /* Sidebar (dark) */
  --sidebar-bg:var(--action-700);
  --sidebar-divider:#1F2937;
  --sidebar-text:#CBD5E1;
  --sidebar-text-active:var(--text-inverse);
  --sidebar-item-active-bg:#1E293B;
  --sidebar-icon-muted:#94A3B8;
  --sidebar-accent:var(--brand-700);

  /* Banners (pastel tints) */
  --banner-info-bg:#EFF6FF; --banner-info-text:#075985; --banner-info-border:#BFDBFE;
  --banner-success-bg:#F0FDF4; --banner-success-text:#166534; --banner-success-border:#BBF7D0;
  --banner-warning-bg:#FFF7E6; --banner-warning-text:#92400E; --banner-warning-border:#FDE68A;
  --banner-danger-bg:#FEF2F2; --banner-danger-text:#991B1B; --banner-danger-border:#FECACA;
  --banner-brand-bg:var(--brand-100); --banner-brand-text:var(--brand-800); --banner-brand-border:var(--brand-300);

  /* Pills/Chips */
  --pill-bg:var(--brand-100); --pill-text:var(--brand-800); --pill-border:var(--brand-300);
}
```

### Tailwind extension (excerpt)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: {100:'#F4F2FF',300:'#E3DFFF',600:'#7D6EF0',700:'#6E5AE6',800:'#5E4EE0'},
        action: {700:'#111827',800:'#0B1220',900:'#0A0F1A'},
        neutral: {50:'#F6F5F3',100:'#FAFAF9',200:'#F1F5F9',250:'#E5E7EB',400:'#94A3B8',600:'#475569',700:'#334155',800:'#1F2937',900:'#111827'}
      }
    }
  }
}
```

---

## 3) Component mapping

**Primary button (dark)**

* Default: `bg var(--btn-primary-bg)` / `text var(--btn-primary-text)` / `focus 2px var(--focus-ring)`
* Hover: `var(--btn-primary-bg-hover)`; Active: `var(--btn-primary-bg-active)`; Disabled: `bg var(--neutral-200)` / `text var(--neutral-400)`

**Secondary button**

* Default: `bg var(--btn-secondary-bg)` / `text var(--btn-secondary-text)` / `border var(--btn-secondary-border)`
* Hover: `bg var(--neutral-100)`

**Destructive button**

* Default: `bg var(--btn-danger-bg)` / `text var(--btn-danger-text)` / Hover: darken by 8–10%

**Links**

* Inline: `color var(--link)`; hover `var(--link-hover)` + underline on hover/focus

**Inputs**

* Default: `bg var(--white)` / `border var(--surface-border)` / `text var(--text-body)`
* Focus: `outline 2px var(--focus-ring)` (outer) + `border var(--brand-700)` (inner)
* Invalid: `border var(--danger-600)`; helper text `var(--danger-600)`

**Cards & surfaces**

* Page: `bg var(--surface-page)`; Card: `bg var(--surface-card)` + `1px var(--surface-border)`
* Elevated hover: keep white; increase border to `#D0D7E2` or add soft shadow only

**Banners**

* Info/Success/Warning/Danger/Brand use the `--banner-*` pairs; keep icons same as text color

**Sidebar (dark)**

* Bg: `var(--sidebar-bg)`; Divider: `var(--sidebar-divider)`
* Item: default text `var(--sidebar-text)`; active text `var(--sidebar-text-active)` with `bg var(--sidebar-item-active-bg)` and left accent `var(--sidebar-accent)`

---

## 4) Data visualization

Use a cool, readable stack. Reserve brand lilac for emphasis.

**Series order**

1. **#6E5AE6** (Brand Lilac)
2. **#2563EB** (Blue 600)
3. **#38BDF8** (Sky 400)
4. **#7C3AED** (Violet 600)
5. **#60A5FA** (Blue 400)
6. **#0EA5E9** (Cyan 500)

**Donut/Pie**

* Completed: **#6E5AE6**; Remaining: **#E5E7EB**; Risk: **#DC2626** as a single slice only
* Labels: `var(--text-body)`; use leader lines on mid‑tones

**Heat/Progress**

* Single‑hue ramp from **Brand 100 → Brand 700**; avoid rainbow scales

---

## 5) Accessibility & contrast (quick rules)

* Body text: `var(--text-body)` on white **≥ 10:1** (AA/AAA)
* Headings: `var(--text-strong)` on white **≥ 12:1** (AAA)
* **Dark CTA**: white text on **Action 700** ≈ **12.8:1** (AAA); hover/active get darker, never lighter
* **Links**: Brand 700 on white ≈ **6.7:1** (AA); on dark backgrounds use Brand 300/600 as needed with underline
* Icons/controls min: **≥3.0:1**; small text: **≥7.0:1** preferred

---

## 6) Pastel tints (pills • tags • badges)

Use soft bg 50–100, dark readable text 700–800, 1px border 200–300.

* **Brand lilac** — bg **#F4F2FF** / text **#5E4EE0** / border **#E3DFFF**
* **Info sky** — bg **#EFF6FF** / text **#075985** / border **#BFDBFE**
* **Success leaf** — bg **#F0FDF4** / text **#166534** / border **#BBF7D0**
* **Warning amber** — bg **#FFF7E6** / text **#92400E** / border **#FDE68A**
* **Danger rose** — bg **#FEF2F2** / text **#991B1B** / border **#FECACA**
* **Neutral** — bg **#F1F5F9** / text **#334155** / border **#E2E8F0**

**Sizes**: 22/26/32px heights; 12–15px text; optional 6px status dot using text color

**Usage ratio**: ≤ **10%** of a screen to keep a professional tone

---

## 7) Usage guidance (how it all fits)

* **Ratios**: Neutrals 75–80% • Brand lilac 8–12% (links, highlights, hero) • Dark action 5–8% (CTAs) • Semantic as needed
* **CTAs**: Always dark; do not recolor primary buttons to lilac
* **Brand expression**: Use lilac in gradients for hero bands, chips, empty states, charts (series‑1) — not backgrounds of dense data tables
* **Sidebar**: Keep dark even in light theme for navigation contrast and to anchor the layout
* **Borders over shadows**: Prefer 1px `var(--surface-border)`; keep shadows subtle to avoid muddy beige‑lilac mixes
* **Warm photos + lilac**: If imagery is warm, buffer with a white card or neutral overlay to avoid color clash

---

## 8) Quick starter checklist

* [ ] Implement tokens above in CSS/Tailwind
* [ ] Turn primary buttons dark (`--btn-primary-*`)
* [ ] Sidebar uses `--sidebar-*` tokens with active pill/line accent in brand lilac
* [ ] Links adopt brand lilac with focus rings
* [ ] Banners/pills use the pastel pairs
* [ ] Charts use the cool series with brand‑first only when needed

---

## 9) Example helpers (drop‑in CSS)

```css
.button--primary{background:var(--btn-primary-bg);color:var(--btn-primary-text)}
.button--primary:hover{background:var(--btn-primary-bg-hover)}
.button--primary:active{background:var(--btn-primary-bg-active)}
.button--secondary{background:var(--btn-secondary-bg);color:var(--btn-secondary-text);border:1px solid var(--btn-secondary-border)}
.link{color:var(--link)} .link:hover{color:var(--link-hover);text-decoration:underline}
.input{background:var(--white);border:1px solid var(--surface-border)}
.input:focus{outline:2px solid var(--focus-ring);border-color:var(--brand-700)}
.card{background:var(--surface-card);border:1px solid var(--surface-border)}
.sidebar{background:var(--sidebar-bg);color:var(--sidebar-text)}
.sidebar .item--active{background:var(--sidebar-item-active-bg);color:var(--sidebar-text-active);border-left:3px solid var(--sidebar-accent)}
.pill{display:inline-flex;align-items:center;gap:6px;padding:.25rem .5rem;border-radius:9999px;font-weight:600;line-height:1;border:1px solid var(--pill-border);background:var(--pill-bg);color:var(--pill-text)}
```
