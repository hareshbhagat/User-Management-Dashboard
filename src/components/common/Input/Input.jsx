import { memo, forwardRef } from 'react';
import styles from './Input.module.scss';

const Input = memo(
  forwardRef(
    (
      {
        label,
        error,
        hint,
        id,
        className = '',
        wrapperClassName = '',
        required = false,
        placeholder,
        ...props
      },
      ref
    ) => {
      const inputId = id || props.name;
      const hasFloatingLabel = Boolean(label);

      return (
        <div className={`${styles.wrapper} ${wrapperClassName}`}>
          <div
            className={`${styles.inputContainer} ${
              hasFloatingLabel ? styles.hasLabel : ''
            }`}
          >
            <input
              ref={ref}
              id={inputId}
              placeholder={hasFloatingLabel ? ' ' : placeholder}
              className={`${styles.input} ${hasFloatingLabel ? styles.floating : ''} ${
                error ? styles.error : ''
              } ${className}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
            {hasFloatingLabel && (
              <label htmlFor={inputId} className={styles.floatingLabel}>
                {label}
                {required && <span className={styles.required}>*</span>}
              </label>
            )}
          </div>
          {error && (
            <span id={`${inputId}-error`} className={styles.errorText} role="alert">
              {error}
            </span>
          )}
          {hint && !error && <span className={styles.hint}>{hint}</span>}
        </div>
      );
    }
  )
);

Input.displayName = 'Input';

export default Input;
