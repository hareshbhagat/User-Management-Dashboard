import { memo, useState, useCallback, useEffect } from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';
import {
  GENDER_FORM_OPTIONS,
  ROLE_FORM_OPTIONS,
  USER_FORM_FIELDS,
} from '../../../utils/constants';
import { mapUserToFormData, normalizeRole } from '../../../utils/helpers';
import { validateUserForm, hasValidationErrors } from '../../../utils/validators';
import styles from './UserForm.module.scss';

const FormField = memo(({ children, className = '' }) => (
  <div className={`${styles.field} ${className}`}>{children}</div>
));

FormField.displayName = 'FormField';

const UserForm = memo(({ initialData, onSubmit, formId = 'user-form' }) => {
  const [formData, setFormData] = useState(() => ({ ...USER_FORM_FIELDS }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(mapUserToFormData(initialData));
    } else {
      setFormData({ ...USER_FORM_FIELDS });
    }
    setErrors({});
    setTouched({});
  }, [initialData?.id, initialData]);

  const getError = useCallback(
    (field) => (touched[field] ? errors[field] : undefined),
    [errors, touched]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'role' ? (value === '' ? '' : normalizeRole(value)) : value,
      }));
    }
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const validationErrors = validateUserForm(formData);
      setErrors(validationErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        role: true,
        image: true,
        'address.address': true,
        'address.city': true,
        'address.state': true,
        'address.country': true,
        'company.name': true,
        'company.department': true,
        'company.title': true,
      });

      if (!hasValidationErrors(validationErrors)) {
        onSubmit(formData);
      }
    },
    [formData, onSubmit]
  );

  return (
    <form id={formId} onSubmit={handleSubmit} className={styles.form} noValidate>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>
        <div className={styles.grid}>
          <FormField>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('firstName')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('lastName')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('email')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('phone')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Age"
              name="age"
              type="number"
              min="1"
              max="120"
              value={formData.age ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('age')}
              required
            />
          </FormField>
          <FormField>
            <Select
              label="Gender"
              name="gender"
              value={formData.gender ?? ''}
              onChange={handleChange}
              options={GENDER_FORM_OPTIONS}
              error={getError('gender')}
              required
            />
          </FormField>
          <FormField>
            <Select
              label="Role"
              name="role"
              value={formData.role ?? ''}
              onChange={handleChange}
              options={ROLE_FORM_OPTIONS}
              error={getError('role')}
              required
            />
          </FormField>
          <FormField className={styles.fullWidth}>
            <Input
              label="Profile Image URL"
              name="image"
              type="url"
              value={formData.image ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('image')}
              hint="Optional — must be a valid URL"
            />
          </FormField>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Address Information</h3>
        <div className={styles.grid}>
          <FormField className={styles.fullWidth}>
            <Input
              label="Address Line"
              name="address.address"
              value={formData.address?.address ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('address.address')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="City"
              name="address.city"
              value={formData.address?.city ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('address.city')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="State"
              name="address.state"
              value={formData.address?.state ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('address.state')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Country"
              name="address.country"
              value={formData.address?.country ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('address.country')}
              required
            />
          </FormField>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Company Information</h3>
        <div className={styles.grid}>
          <FormField>
            <Input
              label="Company Name"
              name="company.name"
              value={formData.company?.name ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('company.name')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Department"
              name="company.department"
              value={formData.company?.department ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('company.department')}
              required
            />
          </FormField>
          <FormField>
            <Input
              label="Title"
              name="company.title"
              value={formData.company?.title ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError('company.title')}
              required
            />
          </FormField>
        </div>
      </section>
    </form>
  );
});

UserForm.displayName = 'UserForm';

export default UserForm;
