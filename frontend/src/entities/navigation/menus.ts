// entities/navigation/model/megaMenus.ts
import { MenuItem } from "./types";

export const navigationMenus: MenuItem[] = [
  {
    key: "category",
    label: "Category",
    items: [
      { id: "all", label: "Shop all", href: "/category" },
      { id: "tops", label: "Blouses & tops", href: "/category/tops" },
      { id: "pants", label: "Pants", href: "/category/pants" },
      {
        id: "dresses",
        label: "Dresses & jumpsuits",
        href: "/category/dresses",
      },
      {
        id: "outerwear",
        label: "Outwear & jackets",
        href: "/category/outerwear",
      },
      { id: "pullovers", label: "Pullovers", href: "/category/pullovers" },
      { id: "tees", label: "Tees", href: "/category/tees" },
      { id: "skirts", label: "Shorts & skirts", href: "/category/skirts" },
    ],
  },
  {
    key: "featured",
    label: "Featured",
    items: [
      { id: "new-in", label: "New in", href: "/featured/new-in" },
      { id: "modiweek", label: "Modiweek", href: "/featured/modiweek" },
      { id: "plus-size", label: "Plus size", href: "/featured/plus-size" },
      {
        id: "best-seller",
        label: "Best seller",
        href: "/featured/best-seller",
      },
    ],
  },
  {
    key: "more",
    label: "More",
    items: [
      { id: "bundles", label: "Bundles", href: "/more/bundles" },
      { id: "occasion", label: "Occasion wear", href: "/more/occasion" },
      { id: "matching-set", label: "Matching set", href: "/more/matching-set" },
      { id: "suiting", label: "Suiting", href: "/more/suiting" },
    ],
  },
  {
    key: "trending",
    label: "Trending",
    items: [
      { id: "plus-size", label: "Plus size", href: "/trending/plus-size" },
      { id: "fall", label: "Fall collection", href: "/trending/fall" },
      { id: "modiweek", label: "Modiweek", href: "/trending/modiweek" },
    ],
  },
  {
    key: "sustainability",
    label: "Sustainability",
    items: [
      { id: "mission", label: "Mission", href: "/sustainability/mission" },
      {
        id: "processing",
        label: "Processing",
        href: "/sustainability/processing",
      },
      {
        id: "materials",
        label: "Materials",
        href: "/sustainability/materials",
      },
      {
        id: "packaging",
        label: "Packaging",
        href: "/sustainability/packaging",
      },
      { id: "care", label: "Product care", href: "/sustainability/care" },
      {
        id: "suppliers",
        label: "Our suppliers",
        href: "/sustainability/suppliers",
      },
    ],
  },
];
