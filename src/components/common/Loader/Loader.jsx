import { memo } from 'react';
import styles from './Loader.module.scss';

const Loader = memo(({ size = 'md', label = 'Loading...' }) => (
  <div className={styles.wrapper} role="status" aria-label={label}>
    <div className={`${styles.spinner} ${styles[size]}`} />
    {label && <span className={styles.label}>{label}</span>}
  </div>
));

Loader.displayName = 'Loader';

export default Loader;
