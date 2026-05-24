import { memo } from 'react';
import styles from './Button.module.scss';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
const SIZES = ['sm', 'md', 'lg'];

const Button = memo(
  ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    ...props
  }) => {
    const variantClass = VARIANTS.includes(variant) ? styles[variant] : styles.primary;
    const sizeClass = SIZES.includes(size) ? styles[size] : styles.md;

    return (
      <button
        type={type}
        disabled={disabled || loading}
        className={`${styles.button} ${variantClass} ${sizeClass} ${
          fullWidth ? styles.fullWidth : ''
        } ${loading ? styles.loading : ''} ${className}`}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={loading ? styles.hiddenText : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
