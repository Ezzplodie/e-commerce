import { navigationMenus } from "./menus";
import type { MenuItem, MenuKey } from "./types";

export const getMenusByKeys = (keys: MenuKey[]): MenuItem[] => {
  return navigationMenus.filter((menu) => keys.includes(menu.key));
};
export const getMenuByKey = (key: MenuKey): MenuItem | undefined => {
  return navigationMenus.find((menu) => menu.key === key);
};
