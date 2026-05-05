import { AttributeValue } from "../types";
import { getSizeSortRank } from "@/shared/lib/sizeSort";

export const normalizeAttributeText = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? "";

const compareAttributeValues = (
  attributeCode: string,
  left: string,
  right: string,
) => {
  if (attributeCode === "size") {
    const rankDiff = getSizeSortRank(left) - getSizeSortRank(right);
    if (rankDiff !== 0) {
      return rankDiff;
    }
  }

  return left.localeCompare(right, undefined, { sensitivity: "base" });
};

export const getAttributeOptions = (
  attributeValues: AttributeValue[],
  attributeCode: "color" | "size",
) => {
  const uniqueValues = new Map<string, string>();

  for (const attributeValue of attributeValues) {
    if (attributeValue.attribute_code !== attributeCode) {
      continue;
    }

    const normalizedValue = normalizeAttributeText(attributeValue.value);
    if (!normalizedValue || uniqueValues.has(normalizedValue)) {
      continue;
    }

    uniqueValues.set(normalizedValue, attributeValue.value);
  }

  const options = Array.from(uniqueValues.values());

  if (attributeCode === "size") {
    return options.sort((left, right) =>
      compareAttributeValues(attributeCode, left, right),
    );
  }

  return options;
};

export const parseVariantPrice = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const getVariantAttributeValueIds = (
  attributes: Record<string, string>,
  attributeValues: AttributeValue[],
  overrides: Partial<Record<"color" | "size", string>>,
) => {
  const nextAttributes = new Map<string, string>();

  for (const [code, value] of Object.entries(attributes || {})) {
    const normalizedCode = normalizeAttributeText(code);
    const trimmedValue = value?.trim();

    if (!normalizedCode || !trimmedValue) {
      continue;
    }

    nextAttributes.set(normalizedCode, trimmedValue);
  }

  for (const [code, value] of Object.entries(overrides)) {
    const normalizedCode = normalizeAttributeText(code);
    const trimmedValue = value?.trim();

    if (!normalizedCode) {
      continue;
    }

    if (trimmedValue) {
      nextAttributes.set(normalizedCode, trimmedValue);
    } else {
      nextAttributes.delete(normalizedCode);
    }
  }

  return Array.from(nextAttributes.entries()).flatMap(([code, value]) => {
    const matchedValue = attributeValues.find(
      (attributeValue) =>
        attributeValue.attribute_code === code &&
        normalizeAttributeText(attributeValue.value) ===
          normalizeAttributeText(value),
    );

    return matchedValue ? [matchedValue.id] : [];
  });
};
