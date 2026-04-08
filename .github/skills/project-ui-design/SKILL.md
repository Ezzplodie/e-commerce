---
name: project-ui-design
description: "Create or refine beautiful frontend UI for this e-commerce project using the existing SCSS modules, shared color tokens, responsive mixins, and typography mixins from frontend/src/shared/styles/typography.scss. Use for storefront pages, product sections, forms, cards, filters, admin screens, and visual polish that must fit the current repo instead of introducing a generic new design system."
argument-hint: "What UI should be built or restyled?"
user-invocable: true
---

# Project UI Design

## What This Skill Does

Use this skill when the task is to build, restyle, or polish UI in this repository while staying aligned with the frontend that already exists.

Default visual split:

- Storefront surfaces may be expressive and atmospheric
- Admin surfaces should stay cleaner, denser, and more utilitarian

This skill is optimized for:

- Next.js app work inside `frontend/src`
- SCSS modules, not ad hoc inline styling
- Existing design tokens from `frontend/src/shared/styles/globals.css`
- Existing typography mixins from `frontend/src/shared/styles/typography.scss`
- Existing responsive mixins from `frontend/src/shared/styles/mixins.scss`

The goal is not just to make the UI "look nice." The goal is to produce UI that feels intentional, polished, and project-native.

## When to Use

Use this skill when the user asks for any of the following:

- Create a beautiful UI
- Redesign a page or section
- Improve styles, layout, typography, spacing, or visual hierarchy
- Build a new page, card, hero, form, filter panel, drawer, or admin surface
- Make a screen feel more premium without breaking the current design language
- Add responsive polish for mobile, tablet, and desktop

Do not use this skill when:

- The task is backend-only
- The task is mostly data flow or API integration without meaningful UI changes
- The user wants a brand new design system unrelated to the current repo

## Required Project Rules

1. Inspect nearby UI before changing anything.
2. Reuse the repo's SCSS module pattern.
3. If typography is needed, always import and use mixins from `frontend/src/shared/styles/typography.scss`.
4. Do not introduce a new font stack when the existing typography system is enough.
5. Prefer existing CSS variables from `frontend/src/shared/styles/globals.css` before adding raw color values.
6. Use responsive helpers from `frontend/src/shared/styles/mixins.scss` instead of inventing new breakpoints.
7. Preserve established behavior and structure unless the task explicitly allows redesign.

## Default Styling Conventions In This Repo

### Typography

Typography is consumed like this:

```scss
@use "@/shared/styles/typography" as typo;
@use "@/shared/styles/mixins" as *;
```

Typical usage:

```scss
.title {
  @include typo.h3;
}

.copy {
  @include typo.body-md;
}

.eyebrow {
  @include typo.overline-sm;
}
```

Use the typography mixin that matches the role of the content instead of hand-writing font-size and line-height.

### Colors and Tokens

Prefer the shared CSS variables already defined in `globals.css`, including:

- `--primary-*`
- `--gray-*`
- `--white`
- `--black`
- `--neutral-gray`
- `--button-primary`
- `--button-primary-hover`
- `--transition`
- `--side-paddings`

Only hardcode a value when a local exception is justified and existing tokens clearly do not fit.

### Responsive Layout

Shared responsive mixins are:

- `@include mobile`
- `@include tablet`
- `@include desktop`

Use them for layout changes, type scaling, spacing adjustments, and visibility changes.

## Workflow

### 1. Read the Local Context First

Inspect:

- The target page or component
- The nearest sibling modules in the same feature, widget, or app route
- Shared UI components that may already solve part of the layout
- Shared style files under `frontend/src/shared/styles`

Look for:

- Existing spacing rhythm
- Typography roles already used for similar content
- Existing container widths and section padding
- Hover, focus, and active state patterns
- Mobile behavior already used nearby

### 2. Choose the Visual Direction

Before editing, decide what kind of screen this is:

- Storefront: more expressive, atmospheric, image-led, and conversion-oriented
- Shared UI surface: clean, reusable, restrained, token-driven
- Admin surface: clearer hierarchy, stronger density control, less decorative treatment

Stay within the repo palette and type scale. The point is strong composition, not novelty for its own sake.

Default bias:

- For storefront work, it is acceptable to use stronger background treatment, larger visual rhythm, and more contrast if the implementation still uses repo tokens and typography
- For admin work, prefer clarity, scanability, predictable spacing, and restrained decoration over dramatic presentation

### 3. Build With Existing Primitives

Prefer:

- SCSS modules colocated with the component or page
- Shared tokens from `globals.css`
- Typographic mixins from `typography.scss`
- Shared breakpoints and layout helpers from `mixins.scss`

Avoid:

- New one-off fonts
- Random pixel scales that fight the existing type ramp
- Generic white-card-on-gray layouts unless the local feature already uses them
- Large visual rewrites that ignore nearby components

### 4. Add Intentional Polish

When the task calls for a more beautiful UI, improve the screen through:

- Clear visual hierarchy
- Better rhythm in spacing and section grouping
- More deliberate contrast using the existing palette
- One or two meaningful background treatments such as gradients or layered neutrals
- Useful motion with the existing transition timing
- Cleaner interaction states for links, buttons, inputs, and drawers

Keep the polish disciplined. The screen should feel designed, not over-styled.

### 5. Make It Responsive

Verify the layout at mobile and desktop minimum.

Common adjustments:

- Reduce headline scale on mobile with existing typography mixins or scoped overrides
- Collapse multi-column layouts into one column on tablet or mobile
- Tighten gaps and paddings without destroying hierarchy
- Remove decorative elements that hurt clarity on small screens

### 6. Verify Before Finishing

Check that the result:

- Uses project typography instead of ad hoc type rules
- Uses shared tokens wherever practical
- Matches nearby feature and widget patterns
- Has working hover and focus-visible states
- Does not regress mobile layout
- Feels visually stronger than before without looking imported from another product

## Decision Points

If the repo already has a strong local pattern:

- Extend that pattern instead of inventing a competing one

If the target surface is empty or weakly defined:

- Build a stronger composition using the existing palette, typography, and spacing language

If a design choice conflicts with current shared UI:

- Prefer consistency for shared/admin surfaces
- Allow more visual character on storefront surfaces

If the task does not specify the surface type:

- Assume storefront pages can be more expressive
- Assume admin pages should remain visually disciplined and utility-first

If typography seems insufficient:

- First try a better existing mixin choice
- Then combine the mixin with responsive overrides
- Only introduce custom font sizing if the task truly requires it and the change stays local

## Completion Checklist

- The UI looks intentionally designed, not generic
- Typography comes from `typography.scss` whenever type styling is needed
- Shared tokens and transitions are reused
- Responsive behavior is handled with existing mixins
- The implementation fits the current repo structure and SCSS conventions
- The final result improves clarity, hierarchy, and visual quality

## Good Prompts For This Skill

- Build a more premium product listing hero using the current frontend styles
- Restyle the login page so it feels more polished but still uses the repo typography mixins
- Redesign the product filters UI with better spacing, hierarchy, and mobile behavior
- Create an admin catalog screen that is cleaner and more structured, not flashy
