export interface MenuItem {
  key: MenuKey;
  label: string;
  items: MenuItemLink[];
}
export interface MenuItemLink {
  id: string;
  label: string;
  href: string;
}
export type MenuKey =
  | "category"
  | "featured"
  | "more"
  | "trending"
  | "sustainability";
