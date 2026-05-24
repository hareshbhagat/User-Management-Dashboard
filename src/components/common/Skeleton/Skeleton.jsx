import { memo } from 'react';
import styles from './Skeleton.module.scss';

const Skeleton = memo(({ width = '100%', height = '1rem', circle = false, className = '' }) => (
  <div
    className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  />
));

Skeleton.displayName = 'Skeleton';

export const UserTableSkeleton = memo(({ rows = 10 }) => (
  <div
    className={styles.tableSkeleton}
    role="status"
    aria-live="polite"
    aria-label="Loading users"
  >
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className={styles.row}>
        <Skeleton width="40px" height="40px" circle />
        <div className={styles.cells}>
          <Skeleton width="60%" height="0.875rem" />
          <Skeleton width="80%" height="0.75rem" />
        </div>
        <Skeleton width="80px" height="0.875rem" className={styles.hideMobile} />
        <Skeleton width="60px" height="1.5rem" className={styles.hideMobile} />
        <div className={styles.actions}>
          <Skeleton width="32px" height="32px" />
          <Skeleton width="32px" height="32px" />
          <Skeleton width="32px" height="32px" />
        </div>
      </div>
    ))}
  </div>
));

UserTableSkeleton.displayName = 'UserTableSkeleton';

export const UserCardSkeleton = memo(({ rows = 6 }) => (
  <div
    className={styles.cardSkeleton}
    role="status"
    aria-live="polite"
    aria-label="Loading users"
  >
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className={styles.card}>
        <div className={styles.cardHeader}>
          <Skeleton width="48px" height="48px" circle />
          <div className={styles.cells}>
            <Skeleton width="70%" height="0.875rem" />
            <Skeleton width="90%" height="0.75rem" />
          </div>
        </div>
        <div className={styles.cardGrid}>
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
        </div>
        <div className={styles.cardActions}>
          <Skeleton width="100%" height="2.25rem" />
          <Skeleton width="100%" height="2.25rem" />
          <Skeleton width="100%" height="2.25rem" />
        </div>
      </div>
    ))}
  </div>
));

UserCardSkeleton.displayName = 'UserCardSkeleton';

export const UserDetailsSkeleton = memo(() => (
  <div
    className={styles.detailsSkeleton}
    role="status"
    aria-live="polite"
    aria-label="Loading user details"
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className={styles.section}>
        <Skeleton width="140px" height="1.125rem" />
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((__, i) => (
            <Skeleton key={i} width="100%" height="2.5rem" />
          ))}
        </div>
      </div>
    ))}
  </div>
));

UserDetailsSkeleton.displayName = 'UserDetailsSkeleton';

export default Skeleton;
