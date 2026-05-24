import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  setSearchQuery,
  setFilters,
  setSortBy,
  setCurrentPage,
  optimisticDelete,
  optimisticUpdate,
  optimisticCreate,
  revertOptimisticCreate,
  revertOptimisticDelete,
  clearSelectedUser,
  clearError,
} from '../store/userSlice';
import useDebounce from './useDebounce';
import { DEBOUNCE_DELAY } from '../utils/constants';
import { buildUserPayload, normalizeUser } from '../utils/helpers';


const useUsers = ({ autoFetchList = true } = {}) => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users);
  const { searchQuery, filters, sortBy, currentPage } = usersState;
  const debouncedSearch = useDebounce(searchQuery, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!autoFetchList) return;
    dispatch(fetchUsers());
  }, [
    dispatch,
    autoFetchList,
    debouncedSearch,
    filters.gender,
    filters.role,
    sortBy,
    currentPage,
  ]);

  const handleSearchChange = useCallback(
    (value) => dispatch(setSearchQuery(value)),
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (filters) => dispatch(setFilters(filters)),
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sortBy) => dispatch(setSortBy(sortBy)),
    [dispatch]
  );

  const loadUserById = useCallback(
    (id) => dispatch(fetchUserById(id)),
    [dispatch]
  );

  const handleCreateUser = useCallback(
    async (formData) => {
      const optimisticUser = normalizeUser({
        _temp: true,
        id: Date.now(),
        ...buildUserPayload(formData),
      });
      dispatch(optimisticCreate(optimisticUser));

      const result = await dispatch(createUser(formData));
      if (createUser.fulfilled.match(result)) {
        dispatch(setCurrentPage(1));
        return { success: true, data: result.payload };
      }

      dispatch(revertOptimisticCreate());
      const errorMessage =
        typeof result.payload === 'string'
          ? result.payload
          : 'Failed to create user';
      return { success: false, error: errorMessage };
    },
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    async (id, formData) => {
      const optimisticUser = normalizeUser({
        id: Number(id),
        ...buildUserPayload(formData),
      });
      dispatch(optimisticUpdate(optimisticUser));

      const result = await dispatch(updateUser({ id, formData }));
      if (updateUser.fulfilled.match(result)) {
        return { success: true, data: result.payload.user };
      }

      dispatch(fetchUsers());
      const errorMessage =
        typeof result.payload === 'string'
          ? result.payload
          : 'Failed to update user';
      return { success: false, error: errorMessage };
    },
    [dispatch]
  );

  const handleDeleteUser = useCallback(
    async (id) => {
      const numericId = Number(id);
      const snapshot = usersState.users;

      dispatch(optimisticDelete(numericId));

      const result = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(result)) {
        if (!result.payload.isLocal && !result.payload.alreadyRemoved) {
          dispatch(fetchUsers());
        }
        return { success: true };
      }

      dispatch(revertOptimisticDelete(snapshot));
      return { success: false, error: result.payload?.message };
    },
    [dispatch, usersState.users]
  );

  const refreshUsers = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleClearSelectedUser = useCallback(
    () => dispatch(clearSelectedUser()),
    [dispatch]
  );

  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return {
    ...usersState,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    loadUserById,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    refreshUsers,
    clearSelectedUser: handleClearSelectedUser,
    clearError: handleClearError,
  };
};

export default useUsers;
