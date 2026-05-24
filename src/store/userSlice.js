import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';
import {
  applyFilters,
  applySort,
  paginate,
  getTotalPages,
  buildUserPayload,
  normalizeUser,
} from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';

const initialState = {
  users: [],
  displayedUsers: [],
  localUsers: [],
  editedUsers: [],
  total: 0,
  totalPages: 1,
  selectedUser: null,
  loading: false,
  listFetchKey: null,
  detailLoading: false,
  detailFetchId: null,
  mutationLoading: false,
  error: null,
  detailError: null,
  searchQuery: '',
  filters: { gender: '', role: '' },
  sortBy: 'name-asc',
  currentPage: 1,
  pageSize: PAGE_SIZE,
};

const needsClientProcessing = (filters) =>
  Boolean(filters.gender || filters.role);

const getClientOverridesMap = (localUsers, editedUsers) => {
  const overrides = new Map();
  editedUsers.forEach((user) => overrides.set(user.id, normalizeUser(user)));
  localUsers.forEach((user) => overrides.set(user.id, normalizeUser(user)));
  return overrides;
};

const applyClientOverrides = (users, overrides) =>
  users.map((user) => overrides.get(user.id) || normalizeUser(user));

const getLocalOnlyUsers = (overrides, apiIds) =>
  [...overrides.values()].filter((user) => !apiIds.has(user.id));

const mergeLocalUsers = (apiUsers, localUsers, editedUsers = []) => {
  const overrides = getClientOverridesMap(localUsers, editedUsers);
  const apiIds = new Set(apiUsers.map((user) => user.id));
  const overriddenApiUsers = applyClientOverrides(apiUsers, overrides);
  const localOnly = getLocalOnlyUsers(overrides, apiIds);
  return [...localOnly, ...overriddenApiUsers];
};

const isAbortError = (error) =>
  error?.name === 'CanceledError' ||
  error?.name === 'AbortError' ||
  error?.code === 'ERR_CANCELED';

const processUsers = (users, filters, sortBy, page, pageSize) => {
  const filtered = applyFilters(users, filters);
  const sorted = applySort(filtered, sortBy);
  const total = sorted.length;
  const totalPages = getTotalPages(total, pageSize);
  const safePage = Math.min(page, totalPages);
  const displayedUsers = paginate(sorted, safePage, pageSize);

  return { displayedUsers, total, totalPages, currentPage: safePage };
};

const upsertUserInList = (list, user) => {
  const exists = list.some((item) => item.id === user.id);
  if (exists) {
    return list.map((item) => (item.id === user.id ? user : item));
  }
  return [user, ...list];
};

const isClientManagedUser = (state, numericId) => {
  if (state.localUsers.some((user) => user.id === numericId)) {
    return true;
  }

  const cached = [
    ...state.users,
    ...state.displayedUsers,
    state.selectedUser,
  ].find((user) => user?.id === numericId);

  return Boolean(cached?._isLocal);
};

const buildListFetchKey = ({
  currentPage,
  searchQuery,
  filters,
  sortBy,
}) =>
  `${currentPage}|${searchQuery}|${filters.gender}|${filters.role}|${sortBy}`;

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue, signal }) => {
    try {
      const {
        searchQuery,
        filters,
        sortBy,
        currentPage,
        pageSize,
        localUsers,
        editedUsers,
      } = getState().users;

      const hasFilters = needsClientProcessing(filters);
      const hasSearch = Boolean(searchQuery.trim());
      const needsGlobalFetch = hasSearch || hasFilters || sortBy !== 'name-asc';
      const requestConfig = { signal };

      if (needsGlobalFetch) {
        const response = hasSearch
          ? await userApi.searchUsers(
              searchQuery.trim(),
              { limit: 100 },
              requestConfig
            )
          : await userApi.getUsers({ limit: 100 }, requestConfig);

        const mergedUsers = mergeLocalUsers(
          response.users.map(normalizeUser),
          localUsers,
          editedUsers
        );

        return processUsers(
          mergedUsers,
          filters,
          sortBy,
          currentPage,
          pageSize
        );
      }

      const skip = (currentPage - 1) * pageSize;
      const response = await userApi.getUsers(
        { limit: pageSize, skip },
        requestConfig
      );
      const overrides = getClientOverridesMap(localUsers, editedUsers);
      const apiUsers = response.users.map(normalizeUser);
      const apiIds = new Set(apiUsers.map((user) => user.id));
      const mergedPageUsers = applyClientOverrides(apiUsers, overrides);
      const localOnly = getLocalOnlyUsers(overrides, apiIds);

      let displayedUsers = mergedPageUsers;
      if (currentPage === 1 && localOnly.length > 0) {
        displayedUsers = [...localOnly, ...mergedPageUsers].slice(0, pageSize);
      }

      displayedUsers = applySort(displayedUsers, sortBy);
      const localOnlyCount = getLocalOnlyUsers(overrides, new Set()).length;

      return {
        displayedUsers,
        total: response.total + localOnlyCount,
        totalPages: getTotalPages(response.total + localOnlyCount, pageSize),
        currentPage,
        rawUsers: displayedUsers,
      };
    } catch (error) {
      if (signal.aborted || isAbortError(error)) {
        return rejectWithValue(null);
      }

      const message =
        error?.message || 'Failed to load users. Please try again.';
      if (import.meta.env.DEV) {
        console.error('[fetchUsers]', message, error);
      }
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState().users;
      const key = buildListFetchKey(state);

      if (state.loading && state.listFetchKey === key) {
        return false;
      }

      if (
        !state.loading &&
        state.listFetchKey === key &&
        state.displayedUsers.length > 0
      ) {
        return false;
      }

      return true;
    },
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { getState, rejectWithValue, signal }) => {
    const numericId = Number(id);
    const { localUsers, editedUsers } = getState().users;
    const localUser = localUsers.find((user) => user.id === numericId);
    const editedOverride = editedUsers.find((user) => user.id === numericId);

    if (localUser?._isLocal) {
      return normalizeUser(editedOverride || localUser);
    }

    try {
      const user = await userApi.getUserById(id, { signal });
      return normalizeUser(
        editedOverride ? { ...user, ...editedOverride } : user
      );
    } catch (error) {
      if (signal.aborted || isAbortError(error)) {
        return rejectWithValue(null);
      }

      
      if (editedOverride) {
        return normalizeUser(editedOverride);
      }

      const message =
        error?.message || 'Failed to load user details. Please try again.';
      if (import.meta.env.DEV) {
        console.error('[fetchUserById]', message, error);
      }
      return rejectWithValue(message);
    }
  },
  {
    condition: (id, { getState }) => {
      const numericId = Number(id);
      const { detailLoading, detailFetchId } = getState().users;
      return !(detailLoading && detailFetchId === numericId);
    },
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = buildUserPayload(formData);
      const user = await userApi.createUser(payload);
      return normalizeUser({ ...payload, ...user });
    } catch (error) {
      const message =
        error?.message || 'Failed to create user. Please try again.';
      if (import.meta.env.DEV) {
        console.error('[createUser]', message, error);
      }
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, formData }, { getState, rejectWithValue }) => {
    const numericId = Number(id);
    const isLocal = getState().users.localUsers.some(
      (user) => user.id === numericId
    );

    try {
      const payload = buildUserPayload(formData);
      const updatedUser = normalizeUser({ id: numericId, ...payload });

      if (isLocal) {
        return { user: updatedUser, isLocal: true };
      }

      await userApi.updateUser(id, payload);
      return { user: updatedUser, isLocal: false };
    } catch (error) {
      const message =
        error?.message || 'Failed to update user. Please try again.';
      if (import.meta.env.DEV) {
        console.error('[updateUser]', message, error);
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    const numericId = Number(id);
    const previousUsers = getState().users.users;
    const isLocal = isClientManagedUser(getState().users, numericId);

    if (isLocal) {
      return { id: numericId, isLocal: true, previousUsers };
    }

    try {
      await userApi.deleteUser(id);
      return { id: numericId, isLocal: false, previousUsers };
    } catch (error) {
      const message =
        error?.message || 'Failed to delete user. Please try again.';

      if (/not found/i.test(message)) {
        return { id: numericId, isLocal: false, previousUsers, alreadyRemoved: true };
      }

      if (import.meta.env.DEV) {
        console.error('[deleteUser]', message, error);
      }
      return rejectWithValue({ message, previousUsers });
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.detailError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.listFetchKey = null;
    },
    optimisticDelete: (state, action) => {
      const id = action.payload;
      state.listFetchKey = null;
      state.users = state.users.filter((user) => user.id !== id);
      state.displayedUsers = state.displayedUsers.filter(
        (user) => user.id !== id
      );
      if (state.selectedUser?.id === id) {
        state.selectedUser = null;
      }
      state.total = Math.max(0, state.total - 1);
      state.totalPages = getTotalPages(state.total, state.pageSize);
    },
    optimisticUpdate: (state, action) => {
      state.listFetchKey = null;
      const updated = normalizeUser(action.payload);
      const updateList = (list) =>
        list.map((user) => (user.id === updated.id ? updated : user));

      state.users = updateList(state.users);
      state.displayedUsers = updateList(state.displayedUsers);
      state.localUsers = updateList(state.localUsers);
      state.editedUsers = upsertUserInList(state.editedUsers, updated);

      if (state.selectedUser?.id === updated.id) {
        state.selectedUser = updated;
      }
    },
    optimisticCreate: (state, action) => {
      state.listFetchKey = null;
      const newUser = normalizeUser(action.payload);
      state.users = [newUser, ...state.users.filter((user) => !user._temp)];
      state.displayedUsers = [newUser, ...state.displayedUsers.filter(
        (user) => !user._temp
      )].slice(0, state.pageSize);
      state.currentPage = 1;
      state.total += 1;
      state.totalPages = getTotalPages(state.total, state.pageSize);
    },
    revertOptimisticCreate: (state) => {
      state.users = state.users.filter((user) => !user._temp);
      state.displayedUsers = state.displayedUsers.filter((user) => !user._temp);
      state.total = Math.max(0, state.total - 1);
      state.totalPages = getTotalPages(state.total, state.pageSize);
    },
    revertOptimisticDelete: (state, action) => {
      state.users = action.payload;
      state.displayedUsers = action.payload.slice(0, state.pageSize);
      state.total = action.payload.length;
      state.totalPages = getTotalPages(state.total, state.pageSize);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.listFetchKey = buildListFetchKey(state);
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.displayedUsers = action.payload.displayedUsers;
        state.users = action.payload.rawUsers || action.payload.displayedUsers;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        if (action.meta.aborted || action.payload == null) return;
        state.listFetchKey = null;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state, action) => {
        state.detailLoading = true;
        state.detailFetchId = Number(action.meta.arg);
        state.detailError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailFetchId = null;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailFetchId = null;
        if (action.meta.aborted || action.payload == null) return;
        state.detailError = action.payload;
        state.selectedUser = null;
      })
      .addCase(createUser.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.mutationLoading = false;
        const newUser = { ...action.payload, _isLocal: true };

        state.localUsers = upsertUserInList(state.localUsers, newUser);
        state.users = upsertUserInList(
          state.users.filter((user) => !user._temp),
          newUser
        );
        state.displayedUsers = upsertUserInList(
          state.displayedUsers.filter((user) => !user._temp),
          newUser
        ).slice(0, state.pageSize);
        state.currentPage = 1;
        state.total = Math.max(state.total, state.displayedUsers.length);
        state.totalPages = getTotalPages(state.total, state.pageSize);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
        state.users = state.users.filter((user) => !user._temp);
        state.displayedUsers = state.displayedUsers.filter((user) => !user._temp);
      })
      .addCase(updateUser.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.mutationLoading = false;
        const { user, isLocal } = action.payload;
        const updateList = (list) =>
          list.map((item) => (item.id === user.id ? user : item));

        state.users = updateList(state.users);
        state.displayedUsers = updateList(state.displayedUsers);

        if (isLocal) {
          state.localUsers = upsertUserInList(state.localUsers, {
            ...user,
            _isLocal: true,
          });
          state.editedUsers = state.editedUsers.filter(
            (item) => item.id !== user.id
          );
        } else {
          state.editedUsers = upsertUserInList(state.editedUsers, user);
        }

        if (state.selectedUser?.id === user.id) {
          state.selectedUser = user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutationLoading = false;
        const { id } = action.payload;

        state.users = state.users.filter((user) => user.id !== id);
        state.displayedUsers = state.displayedUsers.filter(
          (user) => user.id !== id
        );
        state.localUsers = state.localUsers.filter((user) => user.id !== id);
        state.editedUsers = state.editedUsers.filter((user) => user.id !== id);

        if (state.selectedUser?.id === id) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.mutationLoading = false;
        if (action.payload?.previousUsers) {
          state.users = action.payload.previousUsers;
          state.displayedUsers = action.payload.previousUsers.slice(
            0,
            state.pageSize
          );
        }
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setSortBy,
  setCurrentPage,
  clearSelectedUser,
  clearError,
  optimisticDelete,
  optimisticUpdate,
  optimisticCreate,
  revertOptimisticCreate,
  revertOptimisticDelete,
} = userSlice.actions;

export default userSlice.reducer;
