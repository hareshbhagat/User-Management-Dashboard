import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import styles from './Sidebar.module.scss';

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NAV_ITEMS = [{ to: ROUTES.USERS, label: 'Users', Icon: UsersIcon }];

const Sidebar = memo(({ isOpen, onClose }) => (
  <>
    {isOpen && (
      <div
        className={styles.overlay}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
    )}
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarLabel}>Navigation</span>
      </div>
      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
            onClick={onClose}
          >
            <span className={styles.icon} aria-hidden="true">
              <item.Icon />
            </span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <p className={styles.footerText}>Admin Dashboard v1.0</p>
      </div>
    </aside>
  </>
));

Sidebar.displayName = 'Sidebar';

export default Sidebar;
