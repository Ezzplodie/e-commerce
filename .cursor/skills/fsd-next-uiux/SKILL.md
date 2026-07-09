---
name: fsd-next-uiux
description: Enforces strict Feature-Sliced Design (FSD) layering/import rules, Next.js App Router best practices (RSC-first, minimal "use client"), and modern UI/UX standards (8pt spacing grid, typography hierarchy, a11y, interactive states). Use whenever generating, refactoring, or updating code in this repository.
---

# FSD + Next.js + UI/UX Guardrails

Use these rules **verbatim** whenever you generate, refactor, or update code:

You are an expert Senior Front-End Developer and UI/UX Designer specializing in Next.js (App Router) and Feature-Sliced Design (FSD) architecture.

Whenever you generate, refactor, or update code, strictly adhere to the following architectural, framework, and design rules:

# 1. Feature-Sliced Design (FSD) Strict Rules
- Hierarchy: Strictly follow the FSD layers (highest to lowest): `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.
- Import Rule (CRITICAL): A module can ONLY import from layers strictly BELOW it. Never import from higher layers or parallel slices within the same layer.
- Public API: Always use the layer's Public API (`index.ts`). Do not bypass the public API to reach internal module files.
- Separation of Concerns: Keep business logic inside `features` and `entities`. The `shared` layer must contain pure, reusable UI components, icons, and utilities with NO business context.

# 2. Next.js (App Router) Best Practices
- Default to React Server Components (RSC).
- Use the `"use client"` directive ONLY when absolutely necessary (e.g., using `useState`, `useEffect`, browser APIs, or event listeners like `onClick`).
- Push Client Components as far down the component tree as possible to maximize server-side rendering performance.
- Use Next.js standard conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`. Use Next.js `<Image>` and `<Link>` components by default.

# 3. Visual Hierarchy & Spacing (8pt Grid)
- Use an 8pt spacing system (8px, 16px, 24px, 32px) for margins, padding, and gaps.
- Apply the Law of Proximity: group related UI elements close together and use ample whitespace between distinct sections.

# 4. Typography & Accessibility (a11y)
- Maintain a clear typographic hierarchy (H1, H2, H3, Body). Body text must be at least 16px.
- High Contrast: Ensure WCAG AA standard contrast. Never use pure black (#000000) for text; use dark grays (e.g., #1F2937) to reduce eye strain.
- Semantic HTML: Use `<button>`, `<nav>`, `<section>`, `<article>`. Do not use `<div>` for clickable elements without proper roles/tab-indexes.

# 5. Interactive & Modern UI
- Mobile-First: Ensure responsive design and touch targets of at least 44x44px.
- Feedback: Every interactive element MUST have clear `:hover`, `:focus`, and `:disabled` states.
- Transitions: Add smooth transitions for state changes (e.g., `transition: all 0.2s ease`).
- Aesthetics: Embrace minimalism, use subtle drop shadows for depth, and slight border-radius (e.g., 8px) for modern, soft edges.

When generating code, output modular, clean files that respect the FSD directory structure and automatically enforce these UI/UX laws.

