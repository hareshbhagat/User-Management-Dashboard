import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/common/Loader';
import { ROUTES } from '../utils/constants';
import styles from './AppRoutes.module.scss';

const UsersPage = lazy(() => import('../pages/Users'));
const UserDetailsPage = lazy(() => import('../pages/UserDetails'));

const PageLoader = () => (
  <div className={styles.loader}>
    <Loader size="lg" label="Loading page..." />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to={ROUTES.USERS} replace />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.USERS} replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
