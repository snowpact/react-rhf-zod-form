# @snowpact/react-rhf-zod-form

Automatic form generation from Zod schemas with react-hook-form.

**[Live Demo](https://snowpact.github.io/react-rhf-zod-form/)**

## Requirements

- React >= 18.0.0
- react-hook-form >= 7.0.0
- zod >= 4.0.0
- @hookform/resolvers >= 3.0.0

## Features

- **Zero runtime dependencies** - Only peer dependencies (React, Zod, RHF)
- **Automatic field type detection** - Maps Zod types to form inputs
- **Schema refinements** - Full support for `refine()` and `superRefine()` cross-field validation
- **Extensible component registry** - Replace any component with your own
- **Translation support** - i18next, next-intl, or any translation function
- **CSS Variables** - Easy theming with `--snow-*` CSS variables
- **Children pattern** - Full control over layout when needed
- **TypeScript first** - Full type inference from Zod schemas

## Installation

```bash
npm install @snowpact/react-rhf-zod-form
```

### Peer Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Quick Start

### 1a. Quick setup

```tsx
// Run once at app startup (e.g., app/setup.ts, _app.tsx, main.tsx)
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
      const element = formRef?.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
});
```

### 1b. With custom components (optional)

```tsx
// Run once at app startup (e.g., app/setup.ts, _app.tsx, main.tsx)
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';
import { Input, Select, Button, Spinner } from '@/components/ui';
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
});
```

### 2. Custom theme (optional)

Customize the look by overriding CSS variables:

```css
:root {
  --snow-input-active-ring: #8b5cf6;
  --snow-input-radius: 0.5rem;
}
```

### 3. Use SnowForm

```tsx
import { SnowForm } from '@snowpact/react-rhf-zod-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(5),
});

function MyForm() {
  return (
    <SnowForm
      schema={schema}
      onSubmit={async (values) => {
        console.log(values); // { name: string, email: string, age: number }
      }}
      onSuccess={() => {
        alert('Form submitted!');
      }}
    />
  );
}
```

## Field Type Mapping

### Automatic Detection (from Zod schema)

| Zod Type             | Default Component |
| -------------------- | ----------------- |
| `z.string()`         | Text input        |
| `z.string().email()` | Email input       |
| `z.number()`         | Number input      |
| `z.boolean()`        | Checkbox          |
| `z.date()`           | Date picker       |
| `z.enum([...])`      | Select            |

### Available Built-in Types (via overrides)

| Type             | Description                         |
| ---------------- | ----------------------------------- |
| `text`           | Standard text input                 |
| `email`          | Email input with validation styling |
| `password`       | Password input (masked)             |
| `number`         | Numeric input                       |
| `textarea`       | Multi-line text area                |
| `select`         | Dropdown select                     |
| `checkbox`       | Boolean checkbox                    |
| `radio`          | Radio button group                  |
| `date`           | Date picker                         |
| `time`           | Time picker                         |
| `datetime-local` | Date and time picker                |
| `file`           | File upload input                   |
| `tel`            | Telephone input                     |
| `url`            | URL input                           |
| `color`          | Color picker                        |
| `hidden`         | Hidden input                        |
| *custom*         | Any custom type you register        |

## Setup API

### setupSnowForm()

Initialize SnowForm once at app startup:

```tsx
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';

setupSnowForm({
  // Required: Translation function
  translate: (key) => key,

  // Optional: Custom translations
  translations: {
    'snowForm.submit': 'Submit',
    'snowForm.submitting': 'Submitting...',
    'snowForm.required': 'Required',
    'snowForm.selectPlaceholder': 'Select...',
  },

  // Optional: Custom components
  components: {
    text: MyInput,
    select: MySelect,
  },

  // Optional: Custom submit button
  submitButton: MyButton,

  // Optional: Error behavior
  onError: (formRef, errors) => {
    formRef?.scrollIntoView({ behavior: 'smooth' });
  },
});
```

### With i18next

```tsx
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import i18next from 'i18next';

setupSnowForm({
  translate: i18next.t.bind(i18next),
});
```

### With next-intl

```tsx
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import { useTranslations } from 'next-intl';

// In a client component
function SetupProvider({ children }) {
  const t = useTranslations('form');

  useEffect(() => {
    setupSnowForm({ translate: t });
  }, [t]);

  return children;
}
```

## CSS Variables

The default styles use CSS variables for easy customization:

```css
:root {
  --snow-input-foreground: #0a0a0a;
  --snow-input-placeholder: #9ca3af;
  --snow-input-border: #e5e5e5;
  --snow-input-active-ring: #3b82f6;
  --snow-input-disabled-background: #f5f5f5;
  --snow-input-radius: 0.375rem;
  --snow-input-error: #ef4444;
}

/* Dark mode */
.dark {
  --snow-input-foreground: #eaeaea;
  --snow-input-placeholder: #6b7280;
  --snow-input-border: #0f3460;
  --snow-input-active-ring: #3b82f6;
  --snow-input-disabled-background: #16213e;
  --snow-input-error: #f87171;
}
```

### CSS Classes

The library uses semantic class names:

| Class                    | Description      |
| ------------------------ | ---------------- |
| `.snow-form`             | Form container   |
| `.snow-form-item`        | Field wrapper    |
| `.snow-form-label`       | Field label      |
| `.snow-form-label-error` | Label with error |
| `.snow-form-description` | Help text        |
| `.snow-form-message`     | Error message    |
| `.snow-input`            | Input fields     |
| `.snow-textarea`         | Textarea         |
| `.snow-select`           | Select dropdown  |
| `.snow-checkbox`         | Checkbox         |
| `.snow-radio`            | Radio buttons    |
| `.snow-btn`              | Buttons          |
| `.snow-btn-primary`      | Primary button   |

## Schema Refinements

SnowForm fully supports Zod's `refine()` and `superRefine()` for cross-field validation:

```tsx
const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Works with superRefine too
const dateSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate'],
      });
    }
  });

// Use directly - refinements are fully validated on submit
<SnowForm schema={schema} onSubmit={handleSubmit} />
```

## Overrides

Override auto-detected field types or add custom configuration:

```tsx
<SnowForm
  schema={schema}
  overrides={{
    password: { type: 'password' },
    bio: { type: 'textarea' },
    website: {
      type: 'url',
      label: 'Your Website',
      placeholder: 'https://...',
      description: 'Optional personal website',
      emptyAsNull: true, // Transform empty string to null on submit
    },
  }}
/>
```

### Available Override Options

```typescript
interface FieldConfig {
  label?: string;           // Custom label
  description?: string;     // Help text below field
  placeholder?: string;     // Input placeholder
  disabled?: boolean;       // Disable the field
  type?: FieldType;         // Override detected type
  options?: FieldOption[]; // For select fields
  emptyAsNull?: boolean;    // Convert '' to null on submit
  emptyAsUndefined?: boolean; // Convert '' to undefined on submit
  emptyAsZero?: boolean;    // Convert '' to 0 for numbers
  render?: (props) => JSX;  // Custom render function
  componentProps?: object;  // Pass-through props to component
}
```

### Custom Render Function

Use the `render` option for full control over a specific field:

```tsx
<SnowForm
  schema={schema}
  overrides={{
    avatar: {
      label: 'Profile Picture',
      render: ({ value, onChange, error }) => (
        <div>
          <ImageUploader
            value={value}
            onChange={(url) => onChange(url)}
          />
          {error && <span className="text-red-500">{error}</span>}
        </div>
      ),
    },
    rating: {
      render: ({ value, onChange }) => (
        <StarRating
          value={value ?? 0}
          onChange={onChange}
          max={5}
        />
      ),
    },
  }}
/>
```

The render function receives:
- `value` - Current field value
- `onChange(newValue)` - Function to update the value
- `error` - Validation error message (if any)

## Children Pattern

For full layout control, use the children render pattern:

```tsx
<SnowForm schema={schema} onSubmit={handleSubmit}>
  {({ renderField, renderSubmitButton, form }) => (
    <div className="grid grid-cols-2 gap-4">
      {/* Render multiple fields at once */}
      {renderField('firstName', 'lastName')}

      {/* Or render individually for custom wrappers */}
      <div className="col-span-2">{renderField('email')}</div>

      {/* Conditional fields */}
      {form.watch('showBio') && renderField('bio')}

      <div className="col-span-2">
        {renderSubmitButton({ children: 'Create Account' })}
      </div>
    </div>
  )}
</SnowForm>
```

## Custom Components

Register your own components via `setupSnowForm()` or the individual registration functions.

```tsx
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import { Input, Button, Select } from '@/components/ui';

setupSnowForm({
  translate: (key) => key,

  components: {
    text: ({ value, onChange, placeholder, disabled, className }) => (
      <Input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    ),
    select: ({ value, onChange, options, placeholder, disabled }) => (
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        {placeholder && <Select.Item value="">{placeholder}</Select.Item>}
        {options?.map((opt) => (
          <Select.Item key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Item>
        ))}
      </Select>
    ),
  },

  submitButton: ({ loading, disabled, children, className }) => (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={className}
    >
      {loading ? <Spinner /> : children}
    </Button>
  ),
});
```

## API Reference

### SnowForm Props

```typescript
interface SnowFormProps<TSchema, TResponse = unknown> {
  schema: TSchema;                      // Zod schema
  overrides?: Record<string, FieldConfig>; // Field customizations
  defaultValues?: Partial<z.infer<TSchema>>; // Initial values
  fetchDefaultValues?: () => Promise<...>;   // Async initial values
  onSubmit?: (values) => Promise<TResponse>; // Submit handler
  onSuccess?: (response: TResponse) => void; // Success callback
  onSubmitError?: (setErrors, error) => void; // Error handler
  debug?: boolean;                      // Enable console logging
  className?: string;                   // Form element class
  id?: string;                          // Form element id
  children?: (helpers) => ReactNode;    // Custom layout
}
```

### Exported Functions

| Function                             | Description                                    |
| ------------------------------------ | ---------------------------------------------- |
| `setupSnowForm(options)`             | Initialize SnowForm (call once at app startup) |
| `resetSnowForm()`                    | Reset all registries (mainly for testing)      |
| `registerComponents(map)`            | Register multiple components                   |
| `registerComponent(type, component)` | Register single component                      |
| `registerSubmitButton(component)`    | Register submit button                         |
| `setTranslationFunction(fn)`         | Set translation function                       |
| `setTranslations(map)`               | Set custom translations                        |
| `setOnErrorBehavior(callback)`       | Set error behavior                             |
| `normalizeDateToISO(date)`           | Convert date to ISO string                     |

### Exported Types

```typescript
import type {
  SnowFormProps,
  SnowFormHelpers,
  RegisteredComponentProps,
  SubmitButtonProps,
  FieldConfig,
  FieldOption,
  FieldType,
  SetupSnowFormOptions,
  TranslationFunction,
  OnErrorBehavior,
} from '@snowpact/react-rhf-zod-form';
```

## Migration from v1.x

Version 2.0 introduces a unified setup API. Here's how to migrate:

### Before (v1.x)

```tsx
import {
  setTranslationHook,
  registerFormUIStyles,
  setOnErrorBehavior,
  registerComponents,
} from '@snowpact/react-rhf-zod-form';

setTranslationHook(() => {
  const { t } = useTranslation('form');
  return { t };
});

registerFormUIStyles({
  form: 'space-y-4',
  formItem: 'grid gap-2',
  // ...
});

setOnErrorBehavior((formRef) => {
  formRef?.scrollIntoView({ behavior: 'smooth' });
});

registerComponents({ text: MyInput });
```

### After (v2.0)

```tsx
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';

setupSnowForm({
  translate: i18next.t.bind(i18next), // Function instead of hook

  components: {
    text: MyInput,
  },

  onError: (formRef) => {
    formRef?.scrollIntoView({ behavior: 'smooth' });
  },
});
```

### Breaking Changes

1. **`setTranslationHook()` removed** - Use `setupSnowForm({ translate: fn })` with a function instead of a hook
2. **`registerFormUIStyles()` removed** - Import `@snowpact/react-rhf-zod-form/styles.css` and customize via CSS variables
3. **`registerComponents()` moved** - Use `setupSnowForm({ components: {...} })` or continue using `registerComponents()` directly
4. **`setOnErrorBehavior()` moved** - Use `setupSnowForm({ onError: fn })` or continue using `setOnErrorBehavior()` directly

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
