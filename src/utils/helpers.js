import { VALID_ROLES, USER_FORM_FIELDS } from './constants';

export const getUserRole = (user) =>
  user?.company?.role || user?.role || 'user';

export const normalizeRole = (role) => {
  const normalized = role?.toString?.().toLowerCase?.().trim();
  return VALID_ROLES.includes(normalized) ? normalized : 'user';
};

export const getRoleBadgeKey = (user) => normalizeRole(getUserRole(user));

export const getUserImage = (user) => user?.image || user?.profileImage || '';

export const getUserBirthDate = (user) => user?.birthDate || user?.birthdate || '';

export const normalizeUser = (user) => {
  if (!user) return user;

  const role = normalizeRole(getUserRole(user));
  const image = getUserImage(user);
  const birthDate = getUserBirthDate(user);

  return {
    ...user,
    role,
    image,
    birthDate,
    company: {
      ...(user.company || {}),
      role,
      department: user.company?.department || '',
      title: user.company?.title || '',
      name: user.company?.name || '',
    },
    address: {
      ...(user.address || {}),
      address: user.address?.address || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      country: user.address?.country || '',
    },
  };
};

export const getFullName = (user) => {
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

export const getInitials = (user) => {
  const first = user?.firstName?.charAt(0) || '';
  const last = user?.lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || '?';
};

export const applyFilters = (users, filters) => {
  let result = [...users];

  if (filters.gender) {
    result = result.filter(
      (user) => user.gender?.toLowerCase() === filters.gender.toLowerCase()
    );
  }

  if (filters.role) {
    result = result.filter(
      (user) => getUserRole(user).toLowerCase() === filters.role.toLowerCase()
    );
  }

  return result;
};

export const applySort = (users, sortBy) => {
  const sorted = [...users];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) =>
        getFullName(a).localeCompare(getFullName(b))
      );
    case 'name-desc':
      return sorted.sort((a, b) =>
        getFullName(b).localeCompare(getFullName(a))
      );
    case 'age-asc':
      return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    case 'age-desc':
      return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    default:
      return sorted;
  }
};

export const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const getTotalPages = (total, pageSize) =>
  Math.max(1, Math.ceil(total / pageSize));

export const formatBirthDateForInput = (birthDate) => {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const buildUserPayload = (formData) => {
  const role = normalizeRole(formData?.role);
  const image = (formData?.image ?? formData?.profileImage ?? '').trim();
  const birthDate = formData?.birthDate
    ? new Date(formData.birthDate).toISOString()
    : undefined;

  return {
    firstName: formData?.firstName?.trim?.() ?? '',
    lastName: formData?.lastName?.trim?.() ?? '',
    email: formData?.email?.trim?.() ?? '',
    phone: formData?.phone?.trim?.() ?? '',
    age: Number(formData?.age) || 0,
    gender: formData?.gender || 'male',
    role,
    ...(birthDate ? { birthDate } : {}),
    image,
    address: {
      address: formData?.address?.address?.trim?.() ?? '',
      city: formData?.address?.city?.trim?.() ?? '',
      state: formData?.address?.state?.trim?.() ?? '',
      country: formData?.address?.country?.trim?.() ?? '',
    },
    company: {
      name: formData?.company?.name?.trim?.() ?? '',
      department: formData?.company?.department?.trim?.() ?? '',
      title: formData?.company?.title?.trim?.() ?? '',
      role,
    },
  };
};

export const mapUserToFormData = (user) => {
  if (!user) return { ...USER_FORM_FIELDS };

  const normalized = normalizeUser(user);

  return {
    firstName: normalized.firstName ?? '',
    lastName: normalized.lastName ?? '',
    email: normalized.email ?? '',
    phone: normalized.phone ?? '',
    age: normalized.age != null ? String(normalized.age) : '',
    birthDate: formatBirthDateForInput(normalized.birthDate),
    gender: normalized.gender || 'male',
    role: normalized.role,
    image: normalized.image ?? '',
    address: {
      address: normalized.address?.address ?? '',
      city: normalized.address?.city ?? '',
      state: normalized.address?.state ?? '',
      country: normalized.address?.country ?? '',
    },
    company: {
      name: normalized.company?.name ?? '',
      department: normalized.company?.department ?? '',
      title: normalized.company?.title ?? '',
    },
  };
};

export const formatPhone = (phone) => phone || '—';

export const formatBirthDate = (birthDate) => {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return birthDate;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const clampPage = (page, totalPages) =>
  Math.min(Math.max(page, 1), totalPages);
