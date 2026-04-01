import styles from "./ProductChip.module.scss";

type Props = {
  label: string;
};

export function ProductChip({ label }: Props) {
  return <span className={styles.chip}>{label}</span>;
}
