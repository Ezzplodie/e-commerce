import { MegaMenu } from "./types";

export const getMegaMenuByKey = (
  menus: MegaMenu[],
  key: MegaMenu["key"]
): MegaMenu | undefined => {
  return menus.find((menu) => menu.key === key);
};
