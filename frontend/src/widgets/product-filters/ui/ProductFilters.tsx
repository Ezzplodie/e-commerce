"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChipCloseFilledIcon,
  MinusStrokeIcon,
  PlusStrokeIcon,
} from "@/shared/assets/icons";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Button } from "@/shared/ui/Button";
import styles from "./ProductFilters.module.scss";
import { getMappedColorValue } from "@/shared/lib/color";
import { compareSizes } from "@/shared/lib/sizeSort";
import type { FilterFacetItem } from "@/entities/product/types";

type AppliedFilter2 = {
  label: string;
};

type FilterSectionId = "sortBy" | "size" | "color" | "collection" | "fabric";

type CheckboxOption = {
  id: string;
  label: string;
  checked?: boolean;
};

const applied: AppliedFilter2[] = [
  { label: "Best Seller" },
  { label: "S / US (4-6)" },
  { label: "White" },
  { label: "In Stock" },
];
type ProductFiltersProps = {
  colors: FilterFacetItem[];
  sizes: FilterFacetItem[];
  fabric: FilterFacetItem[];
  isFacetsLoading?: boolean;
  onClose?: () => void;
};

const sortBy: CheckboxOption[] = [
  { id: "featured", label: "Featured" },
  { id: "best_seller", label: "Best Seller", checked: true },
  { id: "price_low_high", label: "Price: Low To Hight" },
  { id: "price_high_low", label: "Price: Hight To Low" },
];

const collection: CheckboxOption[] = [
  { id: "in_stock", label: "In Stock", checked: true },
  { id: "out_stock", label: "Out Of Stock" },
];

function Section({
  id,
  title,
  children,
  defaultOpen = true,
}: {
  id: FilterSectionId;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const headingId = `${id}-heading`;
  const contentId = `${id}-content`;
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      setHeight(el.scrollHeight);
      return;
    }
    setHeight(0);
  }, [open, children]);

  return (
    <div className={styles.section} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className={styles.sectionHeader}
        id={headingId}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionIcon} aria-hidden="true">
          <PlusStrokeIcon width={20} height={20} className={styles.iconPlus} />
          <MinusStrokeIcon
            width={20}
            height={20}
            className={styles.iconMinus}
          />
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!open}
        className={styles.sectionBodyOuter}
        style={{ height: open ? `${height}px` : "0px" }}
      >
        <div ref={bodyRef} className={styles.sectionBodyInner}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  const { colors, sizes, fabric, isFacetsLoading = false, onClose } = props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const normalizeParam = (v: string) => v.trim().toLowerCase();

  const pushParams = (params: URLSearchParams) => {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const isMultiChecked = (key: string, value: string) => {
    return searchParams.getAll(key).includes(normalizeParam(value));
  };

  const isSingleChecked = (key: string, value: string) => {
    return searchParams.get(key) === normalizeParam(value);
  };

  const toggleMulti = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramValue = normalizeParam(value);
    const values = params.getAll(key);

    if (values.includes(paramValue)) {
      const nextValues = values.filter((v) => v !== paramValue);
      params.delete(key);
      nextValues.forEach((v) => params.append(key, v));
      pushParams(params);
      return;
    }

    params.append(key, paramValue);
    pushParams(params);
  };

  const setSingle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramValue = normalizeParam(value);

    if (params.get(key) === paramValue) {
      params.delete(key);
      pushParams(params);
      return;
    }

    params.set(key, paramValue);
    pushParams(params);
  };

  const sizesSorted = useMemo(
    () => [...sizes].sort((a, b) => compareSizes(a.value, b.value)),
    [sizes],
  );

  return (
    <form className={styles.root} aria-label="Filters">
      <div className={styles.modalHeader} data-has-close={onClose ? "true" : "false"}>
        <h2 className={styles.title}>Filters</h2>
        {onClose ? (
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="#0C0C0C"
              />
            </svg>
          </button>
        ) : null}
      </div>

      <section
        className={styles.applied}
        aria-labelledby="applied-filters-title"
      >
        <h3 id="applied-filters-title" className={styles.appliedTitle}>
          Applied filters
        </h3>

        <ul className={styles.chips} aria-label="Applied filters list">
          {applied.map((f) => (
            <li key={f.label} className={styles.chip}>
              <span className={styles.chipLabel}>{f.label}</span>
              <Button
                type="button"
                variant="icon"
                className={styles.chipRemove}
                aria-label={`Remove ${f.label}`}
              >
                <ChipCloseFilledIcon
                  width={24}
                  height={24}
                  className={styles.chipRemoveIcon}
                />
              </Button>
            </li>
          ))}
        </ul>

        <div className={styles.appliedActions}>
          <Button type="button" variant="secondary" className={styles.clearAll}>
            Clear All Filters
          </Button>
          <Button type="button" className={styles.appliedButton}>
            Applied Filters
          </Button>
        </div>
      </section>

      <fieldset className={styles.sections}>
        <legend className={styles.srOnly}>Filter sections</legend>

        <Section id="sortBy" title="Sort By">
          <ul className={styles.options} aria-label="Sort By options">
            {sortBy.map((o) => (
              <li key={o.id}>
                <Checkbox
                  className={styles.option}
                  checked={isSingleChecked("sortby", o.id)}
                  onChange={() => setSingle("sortby", o.id)}
                  labelClassName={styles.optionLabel}
                >
                  {o.label}
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="size" title="Size">
          <ul className={styles.options} aria-label="Size options">
            {sizesSorted.map((o) => (
              <li key={o.value}>
                <Checkbox
                  className={styles.option}
                  checked={isMultiChecked("size", o.value)}
                  onChange={() => toggleMulti("size", o.value)}
                  disabled={isFacetsLoading || o.count <= 0}
                  labelClassName={styles.optionLabel}
                >
                  {o.value} ({o.count})
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="color" title="Color">
          <ul className={styles.options} aria-label="Color options">
            {colors.map((c) => (
              <li key={c.value}>
                <Checkbox
                  className={styles.option}
                  checked={isMultiChecked("color", c.value)}
                  onChange={() => toggleMulti("color", c.value)}
                  disabled={isFacetsLoading || c.count <= 0}
                >
                  <span
                    className={styles.colorDot}
                    style={{
                      backgroundColor: getMappedColorValue(c.value),
                    }}
                    aria-hidden="true"
                    data-is-white={
                      c.value.toLocaleLowerCase() === "white" ? "true" : "false"
                    }
                  />
                  <span className={styles.optionLabel}>
                    {c.value} ({c.count})
                  </span>
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="collection" title="Collection">
          <ul className={styles.options} aria-label="Collection options">
            {collection.map((o) => (
              <li key={o.id}>
                <Checkbox
                  className={styles.option}
                  checked={isSingleChecked("collection", o.id)}
                  onChange={() => setSingle("collection", o.id)}
                  labelClassName={styles.optionLabel}
                >
                  {o.label}
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="fabric" title="Fabric">
          <ul className={styles.options} aria-label="Fabric options">
            {fabric.map((o) => (
              <li key={o.value}>
                <Checkbox
                  className={styles.option}
                  checked={isMultiChecked("fabric", o.value)}
                  onChange={() => toggleMulti("fabric", o.value)}
                  disabled={isFacetsLoading || o.count <= 0}
                  labelClassName={styles.optionLabel}
                >
                  {o.value} ({o.count})
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>
      </fieldset>
    </form>
  );
}
