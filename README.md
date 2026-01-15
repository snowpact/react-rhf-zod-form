# @snowpact/react-rhf-zod-form

Automatic form generation from Zod schemas with react-hook-form.

**[Live Demo](https://snowpact.github.io/react-rhf-zod-form/)**

## Requirements

- React >= 18.0.0
- react-hook-form >= 7.0.0
- zod >= 3.24.0
- @hookform/resolvers >= 3.0.0

## Features

- **Zero runtime dependencies** - Only peer dependencies (React, Zod, RHF)
- **Automatic field type detection** - Maps Zod types to form inputs
- **Schema refinements** - Full support for `refine()` and `superRefine()` cross-field validation
- **Extensible component registry** - Replace any component with your own
- **Translation support** - i18next, next-intl, or any translation hook
- **Children pattern** - Full control over layout when needed
- **TypeScript first** - Full type inference from Zod schemas

## Installation

```bash
npm install @snowpact/react-rhf-zod-form
# or
pnpm add @snowpact/react-rhf-zod-form
# or
yarn add @snowpact/react-rhf-zod-form
```

### Peer Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Quick Start

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

| Zod Type | Default Component |
|----------|-------------------|
| `z.string()` | Text input |
| `z.string().email()` | Email input |
| `z.number()` | Number input |
| `z.boolean()` | Checkbox |
| `z.date()` | Date picker |
| `z.enum([...])` | Select |

### Available Built-in Types (via overrides)

| Type | Description |
|------|-------------|
| `text` | Standard text input |
| `email` | Email input with validation styling |
| `password` | Password input (masked) |
| `number` | Numeric input |
| `textarea` | Multi-line text area |
| `select` | Dropdown select |
| `checkbox` | Boolean checkbox |
| `radio` | Radio button group |
| `date` | Date picker |
| `time` | Time picker |
| `datetime-local` | Date and time picker |
| `file` | File upload input |
| `tel` | Telephone input |
| `url` | URL input |
| `color` | Color picker |
| `hidden` | Hidden input |
| *custom* | Any custom type you register |

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

Register your own components to replace the defaults.

> **Full Example**: See [`examples/full-setup.md`](./examples/full-setup.md) for a complete Shadcn/UI setup with i18next translations, custom components, and error handling.

```tsx
import { registerComponents, registerSubmitButton } from '@snowpact/react-rhf-zod-form';
import { Input, Button, Select } from '@/components/ui';

// Register multiple components at once
registerComponents({
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
});

// Register custom submit button
registerSubmitButton(({ loading, disabled, children, className }) => (
  <Button
    type="submit"
    disabled={disabled || loading}
    className={className}
  >
    {loading ? <Spinner /> : children}
  </Button>
));
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

| Function | Description |
|----------|-------------|
| `registerComponents(map)` | Register multiple components |
| `registerComponent(type, component)` | Register single component |
| `registerSubmitButton(component)` | Register submit button |
| `setTranslationHook(hook)` | Set translation hook |
| `setOnErrorBehavior(callback)` | Set error behavior |
| `registerFormUIStyles(styles)` | Set default CSS classes |
| `normalizeDateToISO(date)` | Convert date to ISO string |

### Exported Types

```typescript
import type {
  SnowFormProps,
  SnowFormHelpers,
  RegisteredComponentProps,
  SubmitButtonProps,
  FieldConfig,
  FieldOption,
  FormUIStyles,
  FieldType,
} from '@snowpact/react-rhf-zod-form';
```

## Advanced Configuration

### Translations

#### With i18next

```tsx
import { setTranslationHook } from '@snowpact/react-rhf-zod-form';
import { useTranslation } from 'react-i18next';

setTranslationHook(() => {
  const { t } = useTranslation('form');
  return { t };
});

// locales/en/form.json
{
  "email": "Email Address",
  "password": "Password",
  "submit": "Submit"
}
```

### Styling

Register default CSS classes for form layout:

```tsx
import { registerFormUIStyles } from '@snowpact/react-rhf-zod-form';

registerFormUIStyles({
  form: 'space-y-4',
  formItem: 'grid gap-2',
  formLabel: 'text-sm font-medium',
  formLabelError: 'text-red-500',
  formDescription: 'text-sm text-gray-500',
  formMessage: 'text-sm text-red-500',
  submitButton: 'w-full bg-primary text-white py-2 rounded',
  input: 'w-full border rounded px-3 py-2',
});
```

> **Tailwind tip**: For polished inputs similar to shadcn/ui:
> ```tsx
> input: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
> ```

### Error Behavior

Register a global callback for form validation errors:

```tsx
import { setOnErrorBehavior } from '@snowpact/react-rhf-zod-form';

setOnErrorBehavior((formRef, errors) => {
  // Scroll to form on error
  formRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Or show a toast
  toast.error('Please fix the form errors');
});
```

### Custom Field Types

Extend the type system with declaration merging:

```typescript
// types/snow-form.d.ts
declare global {
  interface SnowFormCustomTypes {
    'rich-text': true;
    'color-picker': true;
  }
}
export {};
```

Then register your components with the full props:

```tsx
import { registerComponents } from '@snowpact/react-rhf-zod-form';

registerComponents({
  'rich-text': ({ value, onChange, onBlur, placeholder, disabled, className }) => (
    <RichTextEditor
      value={value ?? ''}
      onChange={(html) => onChange(html)}
      onBlur={onBlur}
      placeholder={placeholder}
      readOnly={disabled}
      className={className}
    />
  ),
  'color-picker': ({ value, onChange }) => (
    <ColorPicker
      color={value ?? '#000000'}
      onColorChange={(color) => onChange(color)}
    />
  ),
});

// Now TypeScript allows the type in overrides
<SnowForm
  schema={schema}
  overrides={{
    content: { type: 'rich-text' },
    theme: { type: 'color-picker' },
  }}
/>
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
