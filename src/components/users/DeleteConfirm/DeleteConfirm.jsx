import { memo } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { getFullName } from '../../../utils/helpers';
import styles from './DeleteConfirm.module.scss';

const DeleteConfirm = memo(({ isOpen, user, loading, onConfirm, onCancel }) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title="Delete User"
    size="sm"
    footer={
      <>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </>
    }
  >
    <div className={styles.content}>
      <div className={styles.iconWrapper} aria-hidden="true">
        <span className={styles.icon}>⚠</span>
      </div>
      <p className={styles.message}>
        Are you sure you want to delete{' '}
        <strong>{user ? getFullName(user) : 'this user'}</strong>? This action
        cannot be undone.
      </p>
    </div>
  </Modal>
));

DeleteConfirm.displayName = 'DeleteConfirm';

export default DeleteConfirm;
