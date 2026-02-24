# Typography System Documentation

## Overview

This document defines the complete typographic system for the AI Preview Window project. The system is built on modern web standards, variable fonts, and accessibility best practices to deliver a unified, professional user experience.

## Design Principles

1. **Hierarchy** - Clear visual distinction between content levels
2. **Readability** - Optimized for comfortable reading at all sizes
3. **Consistency** - Systematic application across all components
4. **Accessibility** - WCAG 2.1 AA compliant contrast and legibility
5. **Responsiveness** - Fluid scaling across all devices and breakpoints
6. **Performance** - Optimized font loading and rendering

## Font Families

### Primary Typefaces

#### Inter (Body & UI)
- **Usage**: Body text, UI elements, forms, navigation
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold), 900 (Black)
- **Variable Font**: Supports custom weights (450, 550, 650, 750, 850)
- **Features**: Optimized for screen reading, extensive language support
- **OpenType Features**: Contextual alternates, stylistic sets, tabular numbers

#### Space Grotesk (Display & Headlines)
- **Usage**: Headlines, hero text, section titles, emphasis
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Characteristics**: Geometric, modern, high-impact
- **Best for**: Large sizes (24px+), short text blocks

#### JetBrains Mono (Code & Technical)
- **Usage**: Code snippets, technical data, monospace content
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Features**: Ligatures, zero with slash, optimized for code

## Type Scale

### Fixed Scale (Base: 16px)

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `xs` | 0.75rem | 12px | Micro labels, badges |
| `sm` | 0.875rem | 14px | Secondary text, captions |
| `base` | 1rem | 16px | Body text (default) |
| `lg` | 1.125rem | 18px | Large body text |
| `xl` | 1.25rem | 20px | Small headings |
| `2xl` | 1.5rem | 24px | Subheadings |
| `3xl` | 1.875rem | 30px | Section headings |
| `4xl` | 2.25rem | 36px | Page headings |
| `5xl` | 3rem | 48px | Hero text |
| `6xl` | 3.75rem | 60px | Large displays |
| `7xl` | 4.5rem | 72px | Extra large displays |

### Fluid Scale (Responsive)

Fluid typography automatically scales between minimum and maximum sizes based on viewport width.

| Token | Min Size | Max Size | Viewport Range |
|-------|----------|----------|----------------|
| `fluid-xs` | 12px | 14px | 320px - 1920px |
| `fluid-sm` | 14px | 16px | 320px - 1920px |
| `fluid-base` | 16px | 18px | 320px - 1920px |
| `fluid-lg` | 18px | 22px | 320px - 1920px |
| `fluid-xl` | 20px | 28px | 320px - 1920px |
| `fluid-2xl` | 24px | 34px | 320px - 1920px |
| `fluid-3xl` | 32px | 52px | 320px - 1920px |
| `fluid-4xl` | 40px | 68px | 320px - 1920px |
| `fluid-5xl` | 48px | 88px | 320px - 1920px |

## Font Weights

### Standard Weights

| Token | Value | Usage |
|-------|-------|-------|
| `light` | 300 | Decorative, large text |
| `normal` | 400 | Body text, default |
| `medium` | 500 | Emphasized body text |
| `semibold` | 600 | Strong emphasis |
| `bold` | 700 | Headings, buttons |
| `extrabold` | 800 | Large headings |
| `black` | 900 | Maximum emphasis |

### Variable Weights (Custom)

| Token | Value | Usage |
|-------|-------|-------|
| `text` | 450 | Body text (slightly heavier than 400) |
| `ui` | 550 | UI elements, buttons, labels |
| `emphasis` | 650 | Emphasized text, strong |
| `heading` | 750 | Section headings |
| `display` | 850 | Hero displays, maximum impact |

## Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 1.0 | Tight spacing, large displays |
| `tight` | 1.1 | Headlines, hero text |
| `snug` | 1.25 | Subheadings |
| `normal` | 1.5 | UI elements, short text |
| `relaxed` | 1.65 | Body text (default) |
| `loose` | 1.75 | Long-form content |
| `body` | 1.7 | Optimized for reading |

## Letter Spacing

### Standard Values

| Token | Value | Usage |
|-------|-------|-------|
| `tighter` | -0.05em | Very large text |
| `tight` | -0.025em | Large headings |
| `normal` | 0 | Default |
| `wide` | 0.025em | Small text |
| `wider` | 0.05em | Uppercase text |
| `widest` | 0.1em | Labels, badges |

### Semantic Values

| Token | Value | Usage |
|-------|-------|-------|
| `display` | -0.052em | Hero displays (h1) |
| `heading` | -0.035em | Section headings (h2-h3) |
| `subheading` | -0.025em | Subheadings (h4-h6) |
| `body` | -0.012em | Body text |
| `ui` | -0.015em | Buttons, UI elements |
| `label` | 0.08em | Uppercase labels |
| `mono` | -0.012em | Monospace text |

## Semantic Text Classes

### Display & Headings

#### `.text-display-hero`
- **Font**: Space Grotesk
- **Size**: Fluid 5xl (48px - 88px)
- **Weight**: 850
- **Line Height**: 0.92
- **Letter Spacing**: -0.052em
- **Usage**: Main hero headlines, landing page titles

#### `.text-heading-section`
- **Font**: Space Grotesk
- **Size**: Fluid 4xl (40px - 68px)
- **Weight**: 800
- **Line Height**: 0.98
- **Letter Spacing**: -0.045em
- **Usage**: Page section titles

#### `.text-heading-subsection`
- **Font**: Space Grotesk
- **Size**: Fluid 3xl (32px - 52px)
- **Weight**: 750
- **Line Height**: 1.05
- **Letter Spacing**: -0.035em
- **Usage**: Subsection headings

### Body Text

#### `.text-body-lg`
- **Font**: Inter
- **Size**: Fluid lg (18px - 22px)
- **Weight**: 450
- **Line Height**: 1.75
- **Letter Spacing**: -0.014em
- **Usage**: Introductory paragraphs, lead text

#### `.text-body-base`
- **Font**: Inter
- **Size**: Fluid base (16px - 18px)
- **Weight**: 450
- **Line Height**: 1.7
- **Letter Spacing**: -0.012em
- **Usage**: Standard paragraph text

#### `.text-body-sm`
- **Font**: Inter
- **Size**: Fluid sm (14px - 16px)
- **Weight**: 400
- **Line Height**: 1.65
- **Letter Spacing**: -0.01em
- **Usage**: Secondary text, descriptions

### UI Elements

#### `.text-label`
- **Font**: Space Grotesk
- **Size**: Fluid xs (12px - 14px)
- **Weight**: 700
- **Line Height**: 1.2
- **Letter Spacing**: 0.08em
- **Transform**: Uppercase
- **Usage**: Form labels, badges, tags

#### `.text-caption`
- **Font**: Inter
- **Size**: Fluid xs (12px - 14px)
- **Weight**: 500
- **Line Height**: 1.5
- **Letter Spacing**: -0.008em
- **Usage**: Image captions, footnotes

#### `.text-ui`
- **Font**: Space Grotesk
- **Size**: 14px
- **Weight**: 550
- **Line Height**: 1.4
- **Letter Spacing**: -0.015em
- **Usage**: Buttons, navigation, controls

#### `.text-mono`
- **Font**: JetBrains Mono
- **Size**: 0.9em (relative)
- **Weight**: 500
- **Letter Spacing**: -0.012em
- **Usage**: Code snippets, technical data

## Component Typography

### Buttons

```css
font-family: Space Grotesk
font-size: 14px (mobile) / 14px (desktop)
font-weight: 700
letter-spacing: -0.015em
line-height: 1.4
text-transform: none
```

### Form Inputs

```css
font-family: Inter
font-size: max(16px, 1rem) /* Prevents iOS zoom */
font-weight: 500
letter-spacing: -0.012em
line-height: 1.5
```

### Navigation

```css
font-family: Space Grotesk
font-size: 12px (mobile) / 14px (desktop)
font-weight: 600 (inactive) / 700 (active)
letter-spacing: -0.012em
text-transform: none
```

### Badges & Tags

```css
font-family: Space Grotesk
font-size: 9px - 11px
font-weight: 700
letter-spacing: 0.08em
text-transform: uppercase
line-height: 1.2
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Contrast Ratios

| Text Size | Weight | Minimum Contrast | Recommended |
|-----------|--------|------------------|-------------|
| < 18px | < 700 | 4.5:1 | 7:1 (AAA) |
| < 18px | ≥ 700 | 4.5:1 | 7:1 (AAA) |
| ≥ 18px | Any | 3:1 | 4.5:1 (AA) |
| ≥ 24px | Any | 3:1 | 4.5:1 (AA) |

#### Color Combinations (Tested)

| Foreground | Background | Ratio | Level | Usage |
|------------|------------|-------|-------|-------|
| #000000 | #FFFFFF | 21:1 | AAA | Body text, headings |
| #525252 | #FFFFFF | 7.0:1 | AAA | Secondary text |
| #737373 | #FFFFFF | 4.54:1 | AA | Captions, metadata |
| #f97316 | #FFFFFF | 3.04:1 | AA (Large) | Links, accents |
| #ea580c | #FFFFFF | 3.77:1 | AA (Large) | Hover states |

### Touch Targets

- Minimum size: 44x44px (WCAG 2.1 Level AAA)
- Applies to: Buttons, links, form controls
- Spacing: Minimum 8px between targets

### Focus Indicators

- Visible outline: 2px solid #f97316
- Offset: 2px
- Border radius: 2px
- Applies to all interactive elements

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Animation duration: 0.01ms
- Transition duration: 0.01ms
- Iteration count: 1

## Responsive Behavior

### Breakpoints

| Name | Min Width | Typography Adjustments |
|------|-----------|------------------------|
| Mobile | 0px | Base scale, fluid typography |
| Small | 576px | Maintain base scale |
| Medium | 768px | Maintain base scale |
| Large | 992px | Maintain base scale |
| XLarge | 1200px | Base size: 17px (improved readability) |

### Mobile Optimizations

1. **iOS Zoom Prevention**: Input font-size minimum 16px
2. **Touch Targets**: Minimum 44x44px
3. **Line Length**: Max 65-75 characters per line
4. **Spacing**: Increased touch-friendly spacing

## OpenType Features

### Inter Features

```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'calt', 'ss01', 'ss02';
```

- `cv02` - Alternate lowercase 'a'
- `cv03` - Alternate lowercase 'g'
- `cv04` - Alternate lowercase 'i'
- `cv11` - Alternate lowercase 'l'
- `calt` - Contextual alternates
- `ss01` - Stylistic set 1
- `ss02` - Stylistic set 2

### Space Grotesk Features

```css
font-feature-settings: 'ss01', 'ss02', 'calt';
```

### JetBrains Mono Features

```css
font-feature-settings: 'zero', 'ss01';
```

- `zero` - Slashed zero
- `ss01` - Stylistic set 1

### Numeric Features

```css
font-variant-numeric: tabular-nums;
```

- Ensures consistent width for numbers
- Ideal for tables, data, counters

## Implementation Guide

### CSS Custom Properties

All typography values are available as CSS custom properties:

```css
/* Font families */
var(--font-sans)
var(--font-display)
var(--font-mono)

/* Font sizes */
var(--font-size-xs) through var(--font-size-7xl)
var(--font-fluid-xs) through var(--font-fluid-5xl)

/* Font weights */
var(--font-weight-light) through var(--font-weight-black)
var(--font-weight-text), var(--font-weight-ui), etc.

/* Line heights */
var(--line-height-none) through var(--line-height-loose)

/* Letter spacing */
var(--letter-spacing-tighter) through var(--letter-spacing-widest)
var(--letter-spacing-display), var(--letter-spacing-heading), etc.
```

### Usage Examples

#### Hero Section

```jsx
<h1 className="text-display-hero text-black">
  Build <span className="text-gradient-orange">Faster</span>
</h1>
<p className="text-body-lg text-neutral-500">
  Transform your ideas into production-ready UI components.
</p>
```

#### Section Heading

```jsx
<h2 className="text-heading-section text-neutral-900">
  Your Collection
</h2>
<p className="text-caption text-neutral-400">
  5 variations generated — scroll to explore
</p>
```

#### Button

```jsx
<button className="text-ui font-bold tracking-tight">
  Generate Components
</button>
```

#### Form Label

```jsx
<label className="text-label text-neutral-400">
  API Key
</label>
<input className="text-body-base font-medium" />
```

## Testing Checklist

### Visual Testing

- [ ] All text is legible at minimum size (12px)
- [ ] Hierarchy is clear and consistent
- [ ] Line lengths are comfortable (45-75 characters)
- [ ] Spacing feels balanced and intentional
- [ ] Text doesn't overflow containers

### Accessibility Testing

- [ ] All text meets WCAG 2.1 AA contrast ratios
- [ ] Focus indicators are visible on all interactive elements
- [ ] Text can be resized to 200% without loss of functionality
- [ ] Touch targets are minimum 44x44px
- [ ] Reduced motion preferences are respected

### Responsive Testing

- [ ] Text scales appropriately on mobile (320px)
- [ ] Text scales appropriately on tablet (768px)
- [ ] Text scales appropriately on desktop (1920px)
- [ ] No horizontal scrolling at any breakpoint
- [ ] iOS inputs don't trigger zoom (16px minimum)

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Samsung Internet

## Performance Considerations

### Font Loading Strategy

1. **Preconnect** to Google Fonts
2. **Font-display: swap** for immediate text rendering
3. **Subset fonts** if possible (Latin only)
4. **Variable fonts** reduce file size

### Optimization Tips

- Use system fonts as fallbacks
- Limit font weights loaded (only use what's needed)
- Combine font requests in single URL
- Cache fonts with long expiry headers

## Maintenance

### Adding New Text Styles

1. Define semantic class in `typography.css`
2. Document in this file
3. Add to component library
4. Test accessibility
5. Update design system

### Updating Font Weights

1. Check variable font support
2. Update CSS custom properties
3. Test across all components
4. Verify accessibility compliance

## Resources

- [Inter Font](https://rsms.me/inter/)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Fluid Typography Calculator](https://www.fluid-type-scale.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Version History

- **v1.0.0** (2024-02-23) - Initial comprehensive typography system
  - Defined complete type scale
  - Implemented fluid typography
  - Added semantic text classes
  - Ensured WCAG 2.1 AA compliance
  - Documented all tokens and usage
