export type FormatPriceOptions = {
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatPrice(
  value: number | null | undefined,
  {
    currency = "USD",
    locale = "en-US",
    maximumFractionDigits = 0,
    minimumFractionDigits,
  }: FormatPriceOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value ?? 0);
}
