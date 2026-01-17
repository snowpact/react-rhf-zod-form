import type { DemoConfig } from './types';

export function generateInstallCode(): string {
  return `npm install react-hook-form @hookform/resolvers zod
npm install @snowpact/react-rhf-zod-form`;
}

export function generateSetupCode(): string {
  return `// Run once at app startup (e.g., app/setup.ts, _app.tsx, main.tsx)
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';

setupSnowForm({
  // Translation function (i18next.t, next-intl t, or identity)
  translate: (key) => key,

  // Custom translations (optional)
  translations: {
    'snowForm.submit': 'Submit',
    'snowForm.submitting': 'Submitting...',
    'snowForm.required': 'Required',
    'snowForm.selectPlaceholder': 'Select...',
  },

  // Scroll to first error on validation failure (optional)
  onError: (formRef, errors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = formRef?.querySelector(\`[name="\${firstErrorField}"]\`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
});`;
}

export function generateCustomComponentsCode(): string {
  return `// Run once at app startup (e.g., app/setup.ts, _app.tsx, main.tsx)
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';
import { Input, Select, Textarea, Button, Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

setupSnowForm({
  translate: (key) => key,

  // Register custom UI components globally
  components: {
    text: ({ value, onChange, placeholder, disabled, error, className }) => (
      <Input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(className, error && 'border-red-500')}
      />
    ),
    select: ({ value, onChange, options, placeholder, disabled }) => (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        {placeholder && <Select.Item value="">{placeholder}</Select.Item>}
        {options?.map((opt) => (
          <Select.Item key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Item>
        ))}
      </Select>
    ),
    textarea: ({ value, onChange, placeholder, disabled, className }) => (
      <Textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    ),
  },

  // Custom submit button
  submitButton: ({ loading, disabled, children, className }) => (
    <Button type="submit" disabled={disabled || loading} className={className}>
      {loading ? <Spinner className="mr-2" /> : null}
      {children}
    </Button>
  ),

  onError: (formRef) => {
    formRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
});`;
}

export function generateThemeCode(): string {
  return `/* Add to your global CSS file (e.g., globals.css, index.css) */

:root {
  --snow-background: #ffffff;
  --snow-foreground: #0a0a0a;
  --snow-secondary: #f5f5f5;
  --snow-placeholder: #9ca3af;
  --snow-border: #e5e5e5;
  --snow-ring: #3b82f6;
  --snow-radius: 0.375rem;
  --snow-error: #ef4444;
}

/* Dark mode example */
.dark {
  --snow-background: #1a1a2e;
  --snow-foreground: #eaeaea;
  --snow-secondary: #16213e;
  --snow-placeholder: #6b7280;
  --snow-border: #0f3460;
  --snow-ring: #3b82f6;
  --snow-error: #f87171;
}`;
}

export function generateFormCode(config: DemoConfig): string {
  const debugProp = config.showDebugMode ? '\n      debug={true}' : '';

  if (config.renderMode === 'children') {
    return `import { SnowForm } from '@snowpact/react-rhf-zod-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  acceptTerms: z.boolean().refine(val => val === true, 'Required'),
});

function MyForm() {
  return (
    <SnowForm
      schema={schema}
      defaultValues={{ firstName: '' }}${debugProp}
      onSubmit={async (data) => {
        await saveToApi(data);
      }}
      overrides={{
        firstName: { label: 'First Name', placeholder: 'John' },
        lastName: { label: 'Last Name', placeholder: 'Doe' },
        email: { label: 'Email', type: 'email' },
        bio: { label: 'Bio', type: 'textarea' },
        role: {
          label: 'Role',
          options: [
            { value: 'admin', label: 'Administrator' },
            { value: 'user', label: 'User' },
          ],
        },
        acceptTerms: { label: 'I accept the terms' },
      }}
    >
      {({ renderField, renderSubmitButton }) => (
        <div className="grid grid-cols-2 gap-4">
          <div>{renderField('firstName')}</div>
          <div>{renderField('lastName')}</div>
          <div className="col-span-2">{renderField('email')}</div>
          <div className="col-span-2">{renderField('bio')}</div>
          <div>{renderField('role')}</div>
          <div>{renderField('acceptTerms')}</div>
          <div className="col-span-2">
            {renderSubmitButton({ children: 'Create Account' })}
          </div>
        </div>
      )}
    </SnowForm>
  );
}`;
  }

  return `import { SnowForm } from '@snowpact/react-rhf-zod-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18'),
  bio: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  acceptTerms: z.boolean().refine(val => val === true, 'Required'),
});

function MyForm() {
  return (
    <SnowForm
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
      }}
    />
  );
}`;
}
