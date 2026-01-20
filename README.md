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
- **Extensible component registry** - Replace any component with your own (inputs, layout, submit button)
- **Translation support** - i18next, next-intl, or any translation function
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

### Option 1: With Custom Components (Recommended)

For full control, register your own components. **No CSS import needed** - your components handle their own styling.

```tsx
// Run once at app startup (e.g., app/setup.ts, _app.tsx, main.tsx)
import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
import type { RegisteredComponentProps, FormUILabelProps } from '@snowpact/react-rhf-zod-form';

// Example custom input component
function MyInput({ value, onChange, placeholder, disabled, className }: RegisteredComponentProps<string>) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`my-input ${className ?? ''}`}
    />
  );
}

// Example custom label component
function MyLabel({ children, required, invalid, htmlFor }: FormUILabelProps) {
  return (
    <label htmlFor={htmlFor} className={`my-label ${invalid ? 'my-label-error' : ''}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

setupSnowForm({
  translate: (key) => key,
  components: {
    text: MyInput,
    email: (props) => <MyInput {...props} type="email" />,
    password: (props) => <MyInput {...props} type="password" />,
    // ... other components
  },
  formUI: {
    label: MyLabel,
    description: ({ children }) => <p className="my-description">{children}</p>,
    errorMessage: ({ message }) => <p className="my-error">{message}</p>,
  },
  submitButton: ({ loading, disabled, children }) => (
    <button type="submit" disabled={disabled || loading} className="my-button">
      {loading ? 'Loading...' : children}
    </button>
  ),
});
```

### Option 2: With Default Components (Quick Start)

Use SnowForm's built-in components for quick prototyping. **Requires CSS import.**

```tsx
import {
  setupSnowForm,
  DEFAULT_COMPONENTS,
  DEFAULT_FORM_UI,
  DEFAULT_SUBMIT_BUTTON,
} from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css'; // Required for default components

setupSnowForm({
  translate: (key) => key,
  components: DEFAULT_COMPONENTS,
  formUI: DEFAULT_FORM_UI,
  submitButton: DEFAULT_SUBMIT_BUTTON,
});
```

### Option 3: Mix & Match

Extend default components with your own. **Requires CSS import for defaults.**

```tsx
import {
  setupSnowForm,
  DEFAULT_COMPONENTS,
  DEFAULT_FORM_UI,
} from '@snowpact/react-rhf-zod-form';
import '@snowpact/react-rhf-zod-form/styles.css';

setupSnowForm({
  translate: (key) => key,
  components: {
    ...DEFAULT_COMPONENTS,
    text: MyCustomInput, // Override just this one
  },
  formUI: DEFAULT_FORM_UI,
  submitButton: MyCustomButton,
});
```

### 2. Use SnowForm

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

## Translations

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

## Styling

### Using Default Components

When using `DEFAULT_COMPONENTS`, `DEFAULT_FORM_UI`, or `DEFAULT_SUBMIT_BUTTON`, you **must** import the CSS:

```tsx
import '@snowpact/react-rhf-zod-form/styles.css';
```

This provides basic styling. The styles are minimal and work out of the box.

### Using Custom Components (No CSS needed)

When you register your own components, **no CSS import is needed**. Your components handle their own styling. This is the recommended approach as it allows you to use your own design system without any CSS override gymnastics.

```tsx
// No CSS import needed!
setupSnowForm({
  translate: (key) => key,
  components: {
    text: MyInput,
    select: MySelect,
    textarea: MyTextarea,
    checkbox: MyCheckbox,
  },
  formUI: {
    label: MyLabel,
    description: MyDescription,
    errorMessage: MyErrorMessage,
  },
  submitButton: MyButton,
});
```

### CSS Classes (for Default Styles)

If using the default styles, these class names are available for additional customization:

| Class                    | Description      |
| ------------------------ | ---------------- |
| `.snow-form`             | Form container   |
| `.snow-form-item`        | Field wrapper    |
| `.snow-form-label`       | Field label      |
| `.snow-form-label-error` | Label with error |
| `.snow-form-description` | Help text        |
| `.snow-form-message`     | Error message    |
| `.snow-input`            | Text inputs      |
| `.snow-textarea`         | Textarea         |
| `.snow-select`           | Select dropdown  |
| `.snow-checkbox`         | Checkbox         |
| `.snow-radio`            | Radio buttons    |
| `.snow-form-submit-btn`  | Submit button    |

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

### Adding New Field Types

You can register entirely new field types (like `rating`, `rich-text`, `color-picker`, etc.) that don't exist in the built-in types:

**1. Declare the new type** (for TypeScript support):

```typescript
// src/types/snow-form.d.ts
declare global {
  interface SnowFormCustomTypes {
    'rating': true;
    'rich-text': true;
  }
}
export {};
```

**2. Register the component**:

```tsx
setupSnowForm({
  translate: (key) => key,
  components: {
    // Built-in types
    text: MyInput,
    select: MySelect,

    // Your custom types
    'rating': ({ value, onChange, name }) => (
      <StarRating
        id={name}
        value={value ?? 0}
        onChange={onChange}
        max={5}
      />
    ),
    'rich-text': ({ value, onChange, name }) => (
      <RichTextEditor
        id={name}
        content={value}
        onChange={onChange}
      />
    ),
  },
  // ...
});
```

**3. Use in your schema**:

```tsx
<SnowForm
  schema={schema}
  overrides={{
    rating: { type: 'rating', label: 'Your Rating' },
    content: { type: 'rich-text', label: 'Article Content' },
  }}
/>
```

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
| `registerComponents(map)`            | Register multiple input components             |
| `registerComponent(type, component)` | Register single input component                |
| `registerFormUI(components)`         | Register form UI components (label, etc.)      |
| `registerSubmitButton(component)`    | Register submit button                         |
| `setTranslationFunction(fn)`         | Set translation function                       |
| `setTranslations(map)`               | Set custom translations                        |
| `setOnErrorBehavior(callback)`       | Set error behavior                             |
| `normalizeDateToISO(date)`           | Convert date to ISO string                     |

### Exported Constants

| Constant                | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `DEFAULT_COMPONENTS`    | Default input components (text, select, checkbox, etc.) |
| `DEFAULT_FORM_UI`       | Default form UI components (label, description, error)  |
| `DEFAULT_SUBMIT_BUTTON` | Default submit button component                         |

> **Note:** When using these constants, import `@snowpact/react-rhf-zod-form/styles.css`.

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
  // Form UI types
  FormUIComponents,
  FormUILabelProps,
  FormUIDescriptionProps,
  FormUIErrorMessageProps,
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


## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
