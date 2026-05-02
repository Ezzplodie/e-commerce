import {
  ChipCloseFilledIcon,
  MinusStrokeIcon,
  PlusStrokeIcon,
} from "@/shared/assets/icons";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Button } from "@/shared/ui/Button";
import styles from "./ProductFilters.module.scss";

type AppliedFilter = {
  label: string;
};

type FilterSectionId = "sortBy" | "size" | "color" | "collection" | "fabric";

type CheckboxOption = {
  id: string;
  label: string;
  checked?: boolean;
};

type ColorOption = {
  id: string;
  label: string;
  hex: string;
  checked?: boolean;
};

const applied: AppliedFilter[] = [
  { label: "Best Seller" },
  { label: "S / US (4-6)" },
  { label: "White" },
  { label: "In Stock" },
];

const sortBy: CheckboxOption[] = [
  { id: "featured", label: "Featured" },
  { id: "best_seller", label: "Best Seller", checked: true },
  { id: "price_low_high", label: "Price: Low To Hight" },
  { id: "price_high_low", label: "Price: Hight To Low" },
];

const size: CheckboxOption[] = [
  { id: "xs", label: "XS / US (0-4)" },
  { id: "s", label: "S / US (4-6)", checked: true },
  { id: "m", label: "M / US (6-10)" },
  { id: "l", label: "L / US (10-14)" },
  { id: "xl", label: "XL / US (12-16)" },
];

const colors: ColorOption[] = [
  { id: "black", label: "Black", hex: "#111111" },
  { id: "red", label: "Red", hex: "#B43A3A" },
  { id: "green", label: "Green", hex: "#4F6C57" },
  { id: "yellow", label: "Yellow", hex: "#C9B458" },
  { id: "dark_blue", label: "Dark Blue", hex: "#2E3E5C" },
  { id: "purple", label: "Purple", hex: "#6B4BB7" },
  { id: "pink", label: "Pink", hex: "#D06AA3" },
  { id: "light_blue", label: "Light Blue", hex: "#8AB6E6" },
  { id: "orange", label: "Orange", hex: "#E38A3B" },
  { id: "white", label: "White", hex: "#FFFFFF", checked: true },
];

const collection: CheckboxOption[] = [
  { id: "in_stock", label: "In Stock", checked: true },
  { id: "out_stock", label: "Out Of Stock" },
];

const fabric: CheckboxOption[] = [
  { id: "cotton", label: "Cotton", checked: true },
  { id: "linen", label: "Linen" },
  { id: "wool", label: "Wool", checked: true },
  { id: "silk", label: "Silk", checked: true },
  { id: "cashmere", label: "Cashmere" },
];

function Section({
  id,
  title,
  children,
  defaultOpen = true,
}: {
  id: FilterSectionId;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className={styles.section} open={defaultOpen}>
      <summary className={styles.sectionHeader} aria-controls={`${id}-content`}>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionIcon} aria-hidden="true">
          <PlusStrokeIcon width={18} height={18} className={styles.iconPlus} />
          <MinusStrokeIcon width={18} height={18} className={styles.iconMinus} />
        </span>
      </summary>
      <div className={styles.sectionBodyOuter}>
        <div id={`${id}-content`} className={styles.sectionBodyInner}>
          {children}
        </div>
      </div>
    </details>
  );
}

export function ProductFilters() {
  return (
    <form className={styles.root} aria-label="Filters">
      <h2 className={styles.title}>Filters</h2>

      <section className={styles.applied} aria-labelledby="applied-filters-title">
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
                  defaultChecked={o.checked}
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
            {size.map((o) => (
              <li key={o.id}>
                <Checkbox
                  className={styles.option}
                  defaultChecked={o.checked}
                  labelClassName={styles.optionLabel}
                >
                  {o.label}
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="color" title="Color">
          <ul className={styles.options} aria-label="Color options">
            {colors.map((c) => (
              <li key={c.id}>
                <Checkbox className={styles.option} defaultChecked={c.checked}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: c.hex }}
                    aria-hidden="true"
                    data-is-white={c.id === "white" ? "true" : "false"}
                  />
                  <span className={styles.optionLabel}>{c.label}</span>
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
                  defaultChecked={o.checked}
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
              <li key={o.id}>
                <Checkbox
                  className={styles.option}
                  defaultChecked={o.checked}
                  labelClassName={styles.optionLabel}
                >
                  {o.label}
                </Checkbox>
              </li>
            ))}
          </ul>
        </Section>
      </fieldset>
    </form>
  );
}

