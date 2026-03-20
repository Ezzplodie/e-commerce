# Product Management Admin Notes

## What Was Added

- Category CRUD was connected from admin UI to backend endpoints.
- The admin catalog screen was split into small UI components instead of keeping everything inside one large `ProductList.tsx`.
- Admin forms now use reusable field controls:
  - `TextInput`
  - `SelectInput`
- Product variant management remains in the same feature, but its UI is isolated into a dedicated component.

## Component Structure

- `ui/ProductList.tsx`
  - Main container for admin catalog state and handlers.
  - Connects the hook to presentational components.
- `ui/components/CategoryManager.tsx`
  - Handles create, edit, and delete flows for categories.
  - Keeps category form/edit UI local to the category block.
- `ui/components/ProductFormPanel.tsx`
  - Shared product form UI for both create and edit product panels.
- `ui/components/ProductTable.tsx`
  - Displays the products list and row actions.
- `ui/components/VariantManager.tsx`
  - Manages variant editing UI, image ordering, and image uploads.

## Shared UI Controls

- `shared/ui/Input/TextInput.tsx`
  - Existing reusable input component.
- `shared/ui/Input/SelectInput.tsx`
  - New reusable select component for admin forms and controls.

## Data Flow

- `model/useAdminProducts.ts`
  - Central hook for admin catalog data.
  - Loads products and categories.
  - Exposes actions for:
    - categories: create, update, delete
    - products: create, update, delete
    - variants: create, update, delete
    - variant images: upload, delete, reorder
- `ui/ProductList.tsx`
  - Stores page-level UI state:
    - open/close panels
    - selected product
    - draft product form
    - draft variant form
    - selected upload files
  - Passes only the needed props into smaller components.

## Category CRUD

- Backend routes now expose:
  - `GET /categories`
  - `GET /categories/:slug`
  - `POST /categories`
  - `PATCH /categories/:slug`
  - `DELETE /categories/:slug`
- Frontend API layer mirrors those actions in `api/products.api.ts`.
- `CategoryManager.tsx` uses those actions through `useAdminProducts.ts`.

## Why The Split Helps

- The admin screen is easier to read because the container now mostly holds state and handlers.
- UI sections can be changed independently:
  - category block
  - product form
  - variant manager
  - products table
- Reusable controls reduce duplicated form markup and make the UI more consistent.

## Verification

- `eslint` passes for the updated admin feature and shared input controls.
- `next build` succeeds.
- Remaining build warnings are unrelated to the new category CRUD flow:
  - `img` warning in variant gallery
  - existing `Dropdown.module.scss` autoprefixer warnings
