import { memo } from 'react';
import {
  getFullName,
  getInitials,
  getUserRole,
  getUserImage,
  getRoleBadgeKey,
} from '../../../utils/helpers';
import Button from '../../common/Button';
import styles from './UserCard.module.scss';

const UserCard = memo(({ user, onView, onEdit, onDelete }) => {
  const profileImage = getUserImage(user);
  const fullName = getFullName(user);
  const roleKey = getRoleBadgeKey(user);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className={styles.avatar}
            />
          ) : (
            <span className={styles.initials}>{getInitials(user)}</span>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{fullName || '—'}</h3>
          <p className={styles.email}>{user.email || '—'}</p>
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detailItem}>
          <dt>Phone</dt>
          <dd>{user.phone || '—'}</dd>
        </div>
        <div className={styles.detailItem}>
          <dt>Company Name</dt>
          <dd>{user.company?.name || '—'}</dd>
        </div>
        <div className={styles.detailItem}>
          <dt>Role</dt>
          <dd>
            <span className={`${styles.roleBadge} ${styles[`role_${roleKey}`]}`}>
              {getUserRole(user) || 'user'}
            </span>
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <Button variant="outline" size="sm" onClick={() => onView(user)}>
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
          Delete
        </Button>
      </div>
    </article>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;
