import { memo } from 'react';
import Button from '../Button';
import styles from './EmptyState.module.scss';

const EmptyState = memo(
  ({
    icon = '📋',
    title = 'No data found',
    description,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
  }) => (
    <div className={styles.emptyState} role="status">
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {(actionLabel || secondaryActionLabel) && (
        <div className={styles.actions}>
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
