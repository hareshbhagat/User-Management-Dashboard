import { memo } from 'react';
import styles from './Select.module.scss';

const Select = memo(
  ({
    label,
    options = [],
    value,
    onChange,
    id,
    name,
    error,
    required = false,
    className = '',
    ...props
  }) => {
    const selectId = id || name;
    const hasMatchingOption = options.some((option) => option.value === value);
    const safeValue = hasMatchingOption ? value : (options[0]?.value ?? '');

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.selectWrapper}>
          <select
            id={selectId}
            name={name}
            value={safeValue}
            onChange={onChange}
            className={`${styles.select} ${error ? styles.error : ''}`}
            aria-invalid={Boolean(error)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </div>
        {error && (
          <span className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
