import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import usePagination from '../../hooks/usePagination';
import useToast from '../../hooks/useToast';
import UserFilters from '../../components/users/UserFilters';
import UserTable from '../../components/users/UserTable';
import UserCard from '../../components/users/UserCard';
import UserForm from '../../components/users/UserForm';
import DeleteConfirm from '../../components/users/DeleteConfirm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { UserTableSkeleton, UserCardSkeleton } from '../../components/common/Skeleton';
import styles from './Users.module.scss';

const UsersPage = memo(() => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    displayedUsers,
    loading,
    error,
    mutationLoading,
    searchQuery,
    filters,
    sortBy,
    total,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    refreshUsers,
  } = useUsers();

  const {
    currentPage,
    totalPages,
    goToNext,
    goToPrevious,
    hasNext,
    hasPrevious,
  } = usePagination();

  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  const handleView = useCallback(
    (user) => navigate(`/users/${user.id}`),
    [navigate]
  );

  const handleEdit = useCallback(
    (user) => setFormModal({ open: true, user }),
    []
  );

  const handleDelete = useCallback(
    (user) => setDeleteModal({ open: true, user }),
    []
  );

  const handleAddUser = useCallback(
    () => setFormModal({ open: true, user: null }),
    []
  );

  const closeFormModal = useCallback(
    () => setFormModal({ open: false, user: null }),
    []
  );

  const closeDeleteModal = useCallback(
    () => setDeleteModal({ open: false, user: null }),
    []
  );

  const handleFormSubmit = useCallback(
    async (formData) => {
      const isEdit = Boolean(formModal.user);
      const result = isEdit
        ? await handleUpdateUser(formModal.user.id, formData)
        : await handleCreateUser(formData);

      if (result.success) {
        addToast(
          isEdit ? 'User updated successfully' : 'User created successfully',
          'success'
        );
        closeFormModal();
      } else {
        addToast(result.error || 'Operation failed', 'error');
      }
    },
    [
      formModal.user,
      handleCreateUser,
      handleUpdateUser,
      addToast,
      closeFormModal,
    ]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModal.user) return;

    const result = await handleDeleteUser(deleteModal.user.id);
    if (result.success) {
      addToast('User deleted successfully', 'success');
      closeDeleteModal();
    } else {
      addToast(result.error || 'Failed to delete user', 'error');
    }
  }, [deleteModal.user, handleDeleteUser, addToast, closeDeleteModal]);

  const isEditing = Boolean(formModal.user);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className={styles.eyebrow}>Admin Control Center</span>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>
            Manage profiles, roles, access, and company details from a polished
            workspace built for fast team operations.
          </p>
        </div>
        {!loading && (
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.statValue}>{total}</span>
              <span className={styles.statLabel}>Total Users</span>
            </div>
          </div>
        )}
      </header>

      <UserFilters
        searchQuery={searchQuery}
        filters={filters}
        sortBy={sortBy}
        loading={loading}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onAddUser={handleAddUser}
      />

      {error && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refreshUsers} disabled={loading}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <>
          <div className={styles.tableSkeletonView}>
            <UserTableSkeleton rows={10} />
          </div>
          <div className={styles.cardSkeletonView}>
            <UserCardSkeleton rows={6} />
          </div>
        </>
      ) : error && displayedUsers.length === 0 ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load users"
          description={error}
          actionLabel="Retry"
          onAction={refreshUsers}
        />
      ) : displayedUsers.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No users found"
          description="Try adjusting your search or filter criteria, or add a new user."
          actionLabel="Add User"
          onAction={handleAddUser}
        />
      ) : (
        <>
          <div className={styles.contentPanel}>
            <div className={styles.tableView}>
              <UserTable
                users={displayedUsers}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
          <div className={styles.cardView}>
            {displayedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={goToPrevious}
            onNext={goToNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            disabled={loading}
          />
        </>
      )}

      <Modal
        isOpen={formModal.open}
        onClose={closeFormModal}
        title={isEditing ? 'Edit User' : 'Add New User'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="user-form"
              loading={mutationLoading}
            >
              {isEditing ? 'Save Changes' : 'Create User'}
            </Button>
          </>
        }
      >
        <UserForm
          key={formModal.user?.id ?? 'new-user'}
          initialData={formModal.user}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <DeleteConfirm
        isOpen={deleteModal.open}
        user={deleteModal.user}
        loading={mutationLoading}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
});

UsersPage.displayName = 'UsersPage';

export default UsersPage;
