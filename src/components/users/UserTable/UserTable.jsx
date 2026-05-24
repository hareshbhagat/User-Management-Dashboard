import { memo } from 'react';
import {
  getFullName,
  getInitials,
  getUserRole,
  getUserImage,
  getRoleBadgeKey,
} from '../../../utils/helpers';
import Table from '../../common/Table';
import Button from '../../common/Button';
import styles from './UserTable.module.scss';

const COLUMNS = [
  { key: 'avatar', label: 'Avatar', width: '72px' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email', hideOnMobile: true },
  { key: 'phone', label: 'Phone', hideOnMobile: true },
  { key: 'company', label: 'Company Name', hideOnMobile: true },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions', width: '200px' },
];

const UserTable = memo(({ users, onView, onEdit, onDelete }) => (
  <Table columns={COLUMNS}>
    {users.map((user) => {
      const profileImage = getUserImage(user);
      const fullName = getFullName(user);
      const roleKey = getRoleBadgeKey(user);

      return (
        <tr key={user.id}>
          <td>
            <div className={styles.avatarWrapper}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className={styles.avatar}
                  loading="lazy"
                />
              ) : (
                <span className={styles.initials}>{getInitials(user)}</span>
              )}
            </div>
          </td>
          <td className={styles.nameCell}>{fullName || '—'}</td>
          <td className={styles.emailCell}>{user.email || '—'}</td>
          <td className={styles.hideMobile}>{user.phone || '—'}</td>
          <td className={styles.hideMobile}>{user.company?.name || '—'}</td>
          <td>
            <span className={`${styles.roleBadge} ${styles[`role_${roleKey}`]}`}>
              {getUserRole(user) || 'user'}
            </span>
          </td>
          <td>
            <div className={styles.actions}>
              <Button variant="outline" size="sm" onClick={() => onView(user)}>
                View
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
                Delete
              </Button>
            </div>
          </td>
        </tr>
      );
    })}
  </Table>
));

UserTable.displayName = 'UserTable';

export default UserTable;
