export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAILS: '/users/:id',
};

export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'age-asc', label: 'Age Low-High' },
  { value: 'age-desc', label: 'Age High-Low' },
];

export const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'user', label: 'User' },
];

export const GENDER_FORM_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const ROLE_FORM_OPTIONS = [
  { value: '', label: 'Select role' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'user', label: 'User' },
];

export const VALID_ROLES = ['admin', 'moderator', 'user'];

export const USER_FORM_FIELDS = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  birthDate: '',
  gender: '',
  role: '',
  image: '',
  address: {
    address: '',
    city: '',
    state: '',
    country: '',
  },
  company: {
    name: '',
    department: '',
    title: '',
  },
};

export const DEBOUNCE_DELAY = 400;

export const TOAST_DURATION = 4000;
