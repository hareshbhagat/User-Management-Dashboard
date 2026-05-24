const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+/i;

export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(formData.phone.trim())) {
    errors.phone = 'Enter a valid phone number';
  }

  if (!formData.age) {
    errors.age = 'Age is required';
  } else if (Number(formData.age) < 1 || Number(formData.age) > 120) {
    errors.age = 'Age must be between 1 and 120';
  }

  if (!formData.gender) {
    errors.gender = 'Gender is required';
  }

  if (!formData.role) {
    errors.role = 'Role is required';
  }

  if (formData.image?.trim() && !URL_REGEX.test(formData.image.trim())) {
    errors.image = 'Enter a valid image URL';
  }

  if (formData.birthDate) {
    const date = new Date(formData.birthDate);
    if (Number.isNaN(date.getTime())) {
      errors.birthDate = 'Enter a valid birth date';
    }
  }

  if (!formData.address?.address?.trim()) {
    errors['address.address'] = 'Address line is required';
  }

  if (!formData.address?.city?.trim()) {
    errors['address.city'] = 'City is required';
  }

  if (!formData.address?.state?.trim()) {
    errors['address.state'] = 'State is required';
  }

  if (!formData.address?.country?.trim()) {
    errors['address.country'] = 'Country is required';
  }

  if (!formData.company?.name?.trim()) {
    errors['company.name'] = 'Company name is required';
  }

  if (!formData.company?.department?.trim()) {
    errors['company.department'] = 'Department is required';
  }

  if (!formData.company?.title?.trim()) {
    errors['company.title'] = 'Title is required';
  }

  return errors;
};

export const hasValidationErrors = (errors) =>
  Object.keys(errors).length > 0;
