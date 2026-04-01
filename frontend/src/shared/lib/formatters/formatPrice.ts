export type FormatPriceOptions = {
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
};

export function formatPrice(
  value: number | null | undefined,
  {
    currency = "USD",
    locale = "en-US",
    maximumFractionDigits = 0,
  }: FormatPriceOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits,
  }).format(value ?? 0);
}
