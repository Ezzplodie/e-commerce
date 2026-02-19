export const normalizeColor = (value: string | null | undefined) =>
  value?.toLowerCase().trim() ?? "";
