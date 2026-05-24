import { memo } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../../hooks/useTheme';
import { ROUTES } from '../../../utils/constants';
import Button from '../../common/Button';
import styles from './Navbar.module.scss';

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const Navbar = memo(({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </Button>
        <Link to={ROUTES.USERS} className={styles.brand}>
          <span className={styles.logo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandText}>Serviots</span>
            <span className={styles.brandSubtext}>User Management</span>
          </div>
        </Link>
      </div>

      <div className={styles.right}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={styles.themeBtn}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
