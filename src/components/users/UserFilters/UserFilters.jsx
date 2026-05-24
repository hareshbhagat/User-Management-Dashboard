import { memo, useCallback } from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import {
  GENDER_OPTIONS,
  ROLE_OPTIONS,
  SORT_OPTIONS,
} from '../../../utils/constants';
import styles from './UserFilters.module.scss';

const UserFilters = memo(
  ({
    searchQuery,
    filters,
    sortBy,
    loading = false,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onAddUser,
  }) => {
    const handleSearchInput = useCallback(
      (event) => onSearchChange(event.target.value),
      [onSearchChange]
    );

    const handleClearSearch = useCallback(
      () => onSearchChange(''),
      [onSearchChange]
    );

    const handleGenderChange = useCallback(
      (event) => onFilterChange({ gender: event.target.value }),
      [onFilterChange]
    );

    const handleRoleChange = useCallback(
      (event) => onFilterChange({ role: event.target.value }),
      [onFilterChange]
    );

    const handleSortChange = useCallback(
      (event) => onSortChange(event.target.value),
      [onSortChange]
    );

    return (
      <div className={styles.filters}>
        <div className={styles.topRow}>
          <div className={styles.searchWrapper}>
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearchInput}
              aria-label="Search users"
              disabled={loading}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className={styles.clearBtn}
                aria-label="Clear search"
              >
                ✕
              </Button>
            )}
          </div>
          <Button variant="primary" onClick={onAddUser} className={styles.addBtn} disabled={loading}>
            + Add User
          </Button>
        </div>

        <div className={styles.bottomRow}>
          <Select
            label="Gender"
            value={filters.gender}
            onChange={handleGenderChange}
            options={GENDER_OPTIONS}
            className={styles.filterSelect}
            disabled={loading}
          />
          <Select
            label="Role"
            value={filters.role}
            onChange={handleRoleChange}
            options={ROLE_OPTIONS}
            className={styles.filterSelect}
            disabled={loading}
          />
          <Select
            label="Sort By"
            value={sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            className={styles.filterSelect}
            disabled={loading}
          />
        </div>
      </div>
    );
  }
);

UserFilters.displayName = 'UserFilters';

export default UserFilters;
