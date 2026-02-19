import { normalizeColor } from "@/shared/lib/color";

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  red: "#d92d20",
  green: "#5c8a4b",
  blue: "#2f6fed",
  yellow: "#f4c542",
  orange: "#f28c28",
  purple: "#7a4fb6",
  pink: "#e78ac3",
  gray: "#8a8a8a",
  grey: "#8a8a8a",
  brown: "#8b5a2b",
  beige: "#d9c7a3",
  navy: "#243447",
};

export function getMappedColorValue(colorName: string): string {
  const normalized = normalizeColor(colorName);
  return COLOR_MAP[normalized] ?? normalized;
}
