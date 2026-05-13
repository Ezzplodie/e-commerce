import {
  ChevronLeftIcon,
  MailIcon,
  PhoneIcon,
  SearchStrokeIcon,
} from "@/shared/assets/icons";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import styles from "./CheckoutInformationPage.module.scss";
import { Button } from "@/shared/ui/Button";
import { ShippingAddress } from "../../model/types";
import { CheckoutReturnLink } from "./CheckoutReturnLink";

type ShippingFormProps = {
  hasItems: boolean;
  isSubmitting?: boolean;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: ShippingAddress;
};
function CountrySelectField({
  onChange,
  value,
}: {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}) {
  return (
    <label className={styles.selectLabel}>
      <span className={styles.srOnly}>Country/Region</span>
      <SelectInput
        className={styles.selectField}
        defaultValue=""
        aria-label="Country/Region"
        onChange={onChange}
        name="country"
        value={value}
        required
      >
        <option value="" disabled>
          Country/Region
        </option>
        <option value="UA">Ukraine</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </SelectInput>
    </label>
  );
}

export const ShippingForm = ({
  hasItems,
  isSubmitting = false,
  handleChange,
  handleSubmit,
  form,
}: ShippingFormProps) => {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.sectionTitle}>Shipping Address</h2>

      <div className={styles.addressFields}>
        <TextInput
          type="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          wrapperClassName={styles.field}
          className={styles.fieldInput}
          iconClassName={styles.fieldIcon}
          leftIcon={<MailIcon width={16} height={16} aria-hidden="true" />}
          onChange={handleChange}
          value={form.email}
          required
        />
        <CountrySelectField onChange={handleChange} value={form.country} />

        <div className={styles.twoColumn}>
          <TextInput
            placeholder="First Name"
            aria-label="First Name"
            className={styles.fieldInput}
            onChange={handleChange}
            name="first_name"
            value={form.first_name}
            required
          />
          <TextInput
            placeholder="Last Name"
            aria-label="Last Name"
            className={styles.fieldInput}
            onChange={handleChange}
            name="last_name"
            value={form.last_name}
            required
          />
        </div>

        <TextInput
          placeholder="Company(Optional)"
          aria-label="Company(Optional)"
          className={styles.fieldInput}
          onChange={handleChange}
          value={form.company}
          name="company"
        />
        <TextInput
          placeholder="Address"
          aria-label="Address"
          wrapperClassName={styles.field}
          className={styles.fieldInput}
          iconClassName={styles.fieldIcon}
          onChange={handleChange}
          value={form.address}
          required
          name="address"
          rightIcon={<SearchStrokeIcon width={16} height={16} aria-hidden="true" />}
        />
        <TextInput
          placeholder="Apartment, Suite, Etc.(Optional)"
          aria-label="Apartment, Suite, Etc.(Optional)"
          className={styles.fieldInput}
          onChange={handleChange}
          value={form.apartment}
          name="apartment"
        />

        <div className={styles.twoColumn}>
          <TextInput
            placeholder="Postal Code"
            aria-label="Postal Code"
            className={styles.fieldInput}
            onChange={handleChange}
            value={form.postal_code}
            name="postal_code"
          />
          <TextInput
            placeholder="City"
            aria-label="City"
            className={styles.fieldInput}
            onChange={handleChange}
            value={form.city}
            name="city"
          />
        </div>

        <TextInput
          type="tel"
          placeholder="Phone"
          aria-label="Phone"
          wrapperClassName={styles.field}
          className={styles.fieldInput}
          iconClassName={styles.fieldIcon}
          onChange={handleChange}
          value={form.phone}
          name="phone"
          rightIcon={<PhoneIcon width={16} height={16} aria-hidden="true" />}
        />
      </div>

      <div className={styles.actions}>
        <CheckoutReturnLink href="/cart" className={styles.returnLink}>
          <ChevronLeftIcon width={24} height={24} aria-hidden="true" />
          <span>Return To Cart</span>
        </CheckoutReturnLink>

        <Button
          type="submit"
          className={styles.continueButton}
          disabled={!hasItems || isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Continue To Shipping"}
        </Button>
      </div>
    </form>
  );
};

