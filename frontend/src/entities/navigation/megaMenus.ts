// entities/navigation/model/megaMenus.ts
import { MegaMenu } from "./types";

export const megaMenus: MegaMenu[] = [
  {
    key: "category",
    label: "Category",
    items: [
      "Shop all",
      "Blouses & tops",
      "Pants",
      "Dresses & jumpsuits",
      "Outwear & jackets",
      "Pullovers",
      "Tees",
      "Shorts & skirts",
    ],
  },
  {
    key: "featured",
    label: "Featured",
    items: ["New in", "Modiweek", "Plus size", "Best seller"],
  },
  {
    key: "more",
    label: "More",
    items: ["Bundles", "Occasion wear", "Matching set", "Suiting"],
  },
  {
    key: "trending",
    label: "Trending",
    items: ["Plus size", "Fall collection", "Modiweek"],
  },
  {
    key: "sustainability",
    label: "Sustainability",
    items: [
      "Mission",
      "Processing",
      "Materials",
      "Packaging",
      "Product care",
      "Our suppliers",
    ],
  },
];
