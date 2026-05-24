import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  getFullName,
  getInitials,
  getUserRole,
  getUserImage,
  formatBirthDate,
  getRoleBadgeKey,
} from '../../../utils/helpers';
import { ROUTES } from '../../../utils/constants';
import Button from '../../common/Button';
import styles from './UserDetailsView.module.scss';

const DetailItem = memo(({ label, value }) => (
  <div className={styles.detailItem}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>{value ?? '—'}</dd>
  </div>
));

DetailItem.displayName = 'DetailItem';

const Section = memo(({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <dl className={styles.grid}>{children}</dl>
  </section>
));

Section.displayName = 'Section';

const formatGender = (gender) =>
  gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—';

const UserDetailsView = memo(({ user, onEdit, onDelete }) => {
  if (!user) return null;

  const profileImage = getUserImage(user);
  const fullName = getFullName(user);
  const role = getUserRole(user);
  const roleKey = getRoleBadgeKey(user);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={ROUTES.USERS} className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Users
        </Link>
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => onEdit(user)}>
            Edit User
          </Button>
          <Button variant="danger" onClick={() => onDelete(user)}>
            Delete User
          </Button>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroAvatar}>
          {profileImage ? (
            <img src={profileImage} alt={fullName} className={styles.avatar} />
          ) : (
            <span className={styles.initials}>{getInitials(user)}</span>
          )}
        </div>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroName}>{fullName}</h1>
          <p className={styles.heroEmail}>{user.email}</p>
          <p className={styles.heroMeta}>
            {user.company?.title || 'Team Member'}
            {user.company?.name ? ` · ${user.company.name}` : ''}
          </p>
          <span className={`${styles.roleBadge} ${styles[`role_${roleKey}`]}`}>
            {role}
          </span>
        </div>
      </div>

      <Section title="Basic Information">
        <div className={styles.detailItem}>
          <dt className={styles.label}>Profile Image</dt>
          <dd className={styles.value}>
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className={styles.profileImage}
              />
            ) : (
              <span className={styles.initialsSmall}>{getInitials(user)}</span>
            )}
          </dd>
        </div>
        <DetailItem label="Full Name" value={fullName} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Phone" value={user.phone} />
        <DetailItem label="Age" value={user.age} />
        <DetailItem label="Gender" value={formatGender(user.gender)} />
        <DetailItem label="Role" value={role} />
      </Section>

      <Section title="Address Information">
        <DetailItem label="Address Line" value={user.address?.address} />
        <DetailItem label="City" value={user.address?.city} />
        <DetailItem label="State" value={user.address?.state} />
        <DetailItem label="Country" value={user.address?.country} />
      </Section>

      <Section title="Company Information">
        <DetailItem label="Company Name" value={user.company?.name} />
        <DetailItem label="Department" value={user.company?.department} />
        <DetailItem label="Title" value={user.company?.title} />
      </Section>

      <Section title="Additional Information">
        <DetailItem
          label="Birth Date"
          value={formatBirthDate(user.birthDate) || '—'}
        />
        <DetailItem label="University" value={user.university} />
      </Section>
    </div>
  );
});

UserDetailsView.displayName = 'UserDetailsView';

export default UserDetailsView;
