import type { DemoConfig } from './types';

export function generateInstallCode(): string {
  return `npm install react react-dom react-hook-form @hookform/resolvers zod @snowpact/react-rhf-zod-form`;
}

export function generateSetupCode(): string {
  return `import { z } from 'zod';
import { SnowForm, registerFormUIStyles, setOnErrorBehavior } from '@snowpact/react-rhf-zod-form';

// Register default styles (Tailwind classes)
registerFormUIStyles({
  form: 'space-y-4',
  formItem: 'grid gap-2',
  formLabel: 'text-sm font-medium text-gray-700',
  formLabelError: 'text-red-500',
  formDescription: 'text-sm text-gray-500',
  formMessage: 'text-sm text-red-500',
});

// Scroll to first error on validation failure
setOnErrorBehavior((formRef, errors) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = formRef?.querySelector(\`[name="\${firstErrorField}"]\`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});`;
}

export function generateSchemaCode(): string {
  return `const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18'),
  bio: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  acceptTerms: z.boolean().refine(val => val === true, 'Required'),
});

type FormData = z.infer<typeof schema>;`;
}

export function generateSnowFormCode(config: DemoConfig): string {
  const debugProp = config.showDebugMode ? '\n  debug={true}' : '';

  return `<SnowForm
  schema={schema}
  defaultValues={{ firstName: '' }}${debugProp}
  onSubmit={async (data) => {
    await saveToApi(data);
  }}
  overrides={{
    firstName: { label: 'First Name', placeholder: 'John' },
    lastName: { label: 'Last Name', placeholder: 'Doe' },
    email: {
      label: 'Email',
      type: 'email',
      description: 'We will never share your email',
    },
    age: { label: 'Age' },
    bio: { label: 'Bio', type: 'textarea' },
    role: {
      label: 'Role',
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' },
      ],
    },
    acceptTerms: { label: 'I accept the terms' },
    // Custom render for a field not in schema
    customField: {
      render: ({ value, onChange }) => (
        <MyCustomInput value={value} onChange={onChange} />
      ),
    },
  }}
/>`;
}
