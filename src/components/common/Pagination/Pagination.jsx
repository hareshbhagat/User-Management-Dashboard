import { memo } from 'react';
import Button from '../Button';
import styles from './Pagination.module.scss';

const Pagination = memo(
  ({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
    disabled = false,
  }) => (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={disabled || !hasPrevious}
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      <span className={styles.indicator} aria-live="polite">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={disabled || !hasNext}
        aria-label="Go to next page"
      >
        Next
      </Button>
    </nav>
  )
);

Pagination.displayName = 'Pagination';

export default Pagination;
