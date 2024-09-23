import { SelectHTMLAttributes } from 'react';
import styles from './styles.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ ...rest }: SelectProps) {
  return (
    <select className={styles.select} {...rest} />
  );
}
