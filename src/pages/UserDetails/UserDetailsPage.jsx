import { memo, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import useToast from '../../hooks/useToast';
import UserDetailsView from '../../components/users/UserDetails';
import UserForm from '../../components/users/UserForm';
import DeleteConfirm from '../../components/users/DeleteConfirm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { UserDetailsSkeleton } from '../../components/common/Skeleton';
import { ROUTES } from '../../utils/constants';
import styles from './UserDetailsPage.module.scss';

const UserDetailsPage = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    selectedUser,
    detailLoading,
    detailError,
    mutationLoading,
    loadUserById,
    handleUpdateUser,
    handleDeleteUser,
    clearSelectedUser,
  } = useUsers({ autoFetchList: false });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadUserById(id);
    }
  }, [id, loadUserById]);

  useEffect(
    () => () => {
      clearSelectedUser();
    },
    [clearSelectedUser]
  );

  const handleEdit = useCallback(() => setEditModalOpen(true), []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);
  const handleDelete = useCallback(() => setDeleteModalOpen(true), []);
  const closeDeleteModal = useCallback(() => setDeleteModalOpen(false), []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      const result = await handleUpdateUser(id, formData);
      if (result.success) {
        addToast('User updated successfully', 'success');
        closeEditModal();
      } else {
        addToast(result.error || 'Failed to update user', 'error');
      }
    },
    [id, handleUpdateUser, addToast, closeEditModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    const result = await handleDeleteUser(id);
    if (result.success) {
      addToast('User deleted successfully', 'success');
      navigate(ROUTES.USERS);
    } else {
      addToast(result.error || 'Failed to delete user', 'error');
    }
  }, [id, handleDeleteUser, addToast, navigate]);

  const handleRetry = useCallback(() => {
    if (id) {
      loadUserById(id);
    }
  }, [id, loadUserById]);

  if (detailLoading || (!selectedUser && !detailError)) {
    return (
      <div className={styles.page}>
        <UserDetailsSkeleton />
      </div>
    );
  }

  if (detailError || !selectedUser) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="⚠️"
          title="Unable to load user"
          description={detailError || 'The requested user could not be found.'}
          actionLabel="Retry"
          onAction={handleRetry}
          secondaryActionLabel="Back to Users"
          onSecondaryAction={() => navigate(ROUTES.USERS)}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <UserDetailsView
        user={selectedUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        title="Edit User"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="user-form"
              loading={mutationLoading}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <UserForm
          key={selectedUser.id}
          initialData={selectedUser}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <DeleteConfirm
        isOpen={deleteModalOpen}
        user={selectedUser}
        loading={mutationLoading}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
});

UserDetailsPage.displayName = 'UserDetailsPage';

export default UserDetailsPage;
