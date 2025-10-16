# Golffox Design System (Preview)

This document captures the first iteration of the premium interface guidelines requested for the Golffox ecosystem. It is focused on providing a baseline that can be shared across the multiple panels (admin, operator, carrier, driver and passenger) and for the API portals. The structure is optimized for Tailwind CSS 4 with Framer Motion animations.

## Brand Foundations

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `colors.primary` | `#5B2EFF` | Key actions, primary CTAs, map focus states |
| `colors.secondary` | `#00E0FF` | Secondary CTAs, highlights for realtime elements |
| `colors.accent` | `#FFD700` | Status badges, alert emphasis |
| `colors.dark` | `#0A0A0A` | High-contrast surfaces, dark mode backgrounds |
| `colors.light` | `#F5F5F7` | Light mode backgrounds, cards |
| `colors.neutral` | `#D1D5DB` | Borders, dividers, disabled controls |

### Typography

Primary font stack:

```css
font-family: "Inter", "SF Pro Display", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Use bold weights (600-700) for titles, medium (500) for section headers and regular (400) for body copy. Maintain generous line-height (1.5+) to reinforce the premium feel inspired by Apple and Nubank.

### Spacing & Layout

- Base spacing unit: `4px`
- Container width: `1200px` max with comfortable breathing room on desktop
- Rounded corners: `20px` for primary cards, `14px` for secondary surfaces, `999px` for pills/badges

## Components

### Buttons
- Tailwind utility proposal: `inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold`
- Gradient background from `primary` to `secondary`
- Motion: subtle `scale` to `1.03` on hover via Framer Motion, returning with spring easing
- Focus ring uses `colors.secondary` at 50% opacity

### Cards
- Glassmorphism using `bg-white/70` in light mode, `bg-dark/60` in dark mode
- Backdrop blur `md`, border `1px` with `colors.light`/`colors.dark` transparency
- Elevation: `shadow-[0_30px_60px_-30px_rgba(91,46,255,0.35)]`
- On hover: translate `y-1`, scale `1.01`

### Navigation (Navbar & Sidebar)
- Sticky header with `backdrop-blur-lg` and gradient bottom border
- Sidebar collapsible to icons-only state under `md` breakpoint
- Active indicator: glowing bar using `colors.secondary`
- Motion: `layout` animations for menu groups, `whileHover` to lighten background

### Tables
- Skeleton rows using shimmering gradients
- Row hover: `bg-primary/5`
- Compact density with `leading-6` and `px-4`
- Empty state card featuring icon + message in accent color

### Modal
- Combined fade (`opacity`) + scale from `0.95` to `1`
- Backdrop `bg-dark/70` with blur
- Close button floats top-right with `colors.primary`

### MapCard
- Container with rounded corners and drop shadow
- Overlay chip in top-left showing route info with gradient border
- Map integrates dynamic theme (light/dark) and 3D tilt using Google Maps `mapId`

### StatusBadge
- Animated gradient background using keyframes defined in Tailwind plugin
- States: `success`, `warning`, `danger`, `idle` mapping to `secondary`, `accent`, `primary`, `neutral`

### Loader
- Inspired by iOS spinner: `conic-gradient` background with rotation animation at `1.2s` linear infinite

## Motion Guidelines

- Page transitions: `opacity` from `0.6` to `1` combined with `scale` `0.98 -> 1`
- Microinteractions: Buttons and inputs respond within `150ms` using spring `stiffness: 220`
- Scroll reveal: `y` from `24px` to `0` with fade on 15% viewport entry
- Splash screen: Golffox logotype reveals through mask animation followed by glow pulse

## Theming

```ts
export const themes = {
  light: {
    background: "#FFFFFF",
    text: "#111827",
    surface: "#F9FAFB",
  },
  dark: {
    background: "#0B0B0F",
    text: "#E5E7EB",
    surface: "#1F2937",
  },
} as const;
```

Tailwind CSS can bind these tokens via CSS variables (`--color-background`, `--color-surface`) toggled with `data-theme="dark"` on the `<html>` element.

## Implementation Notes

1. Theme tokens, fonts e provedores estão em `packages/shared/ui/theme` (`colors.ts`, `themes.ts`, `ThemeProvider.tsx`).
2. Variantes Framer Motion comuns residem em `packages/shared/ui/animations/presets.ts`.
3. Componentes premium (Button, Card, Navbar, Sidebar, Table, Modal, MapCard, StatusBadge, Loader) vivem em `packages/shared/ui/components`.
4. Use o preset do Tailwind atualizado (`tailwind.config.js`) para expor cores, animações e utilitários globais.
5. Storybook (ou Ladle) pode ser configurado futuramente para documentação interativa.

This document will continue evolving as more panels adopt the shared UI kit.
