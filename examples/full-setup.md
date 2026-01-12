# SnowForm Setup Examples

This guide shows how to configure SnowForm with your UI library.

## Table of Contents

- [SnowForm Setup Examples](#snowform-setup-examples)
  - [Table of Contents](#table-of-contents)
  - [Shadcn/UI Setup](#shadcnui-setup)
  - [App.tsx Integration](#apptsx-integration)
  - [Custom Types Declaration](#custom-types-declaration)
  - [Translation Files](#translation-files)

---

## Shadcn/UI Setup

Create a setup file (e.g., `src/lib/snow-form-setup.ts`) that configures SnowForm with your components:

```tsx
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  registerComponents,
  registerSubmitButton,
  setTranslationHook,
  setOnErrorBehavior,
  registerFormUIStyles,
  normalizeDateToISO,
} from '@snowpact/react-rhf-zod-form';
import type { RegisteredComponentProps, SubmitButtonProps } from '@snowpact/react-rhf-zod-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// =============================================================================
// Component Adapters
// =============================================================================

function ShadcnInput({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
  componentProps,
}: RegisteredComponentProps<string>) {
  const type = (componentProps?.type as string) ?? 'text';

  return (
    <Input
      id={name}
      name={name}
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}

function ShadcnTextarea({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
}: RegisteredComponentProps<string>) {
  return (
    <Textarea
      id={name}
      name={name}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}

function ShadcnSelect({
  value,
  onChange,
  name,
  disabled,
  placeholder,
  options,
}: RegisteredComponentProps<string>) {
  return (
    <Select value={value ?? ''} onValueChange={val => onChange(val || undefined)} disabled={disabled}>
      <SelectTrigger id={name}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ShadcnSwitch({ value, onChange, name, disabled }: RegisteredComponentProps<boolean>) {
  return <Switch id={name} checked={value ?? false} onCheckedChange={onChange} disabled={disabled} />;
}

function NumberInputAdapter({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
}: RegisteredComponentProps<number | null>) {
  return (
    <Input
      id={name}
      name={name}
      type="number"
      value={value ?? ''}
      onChange={e => {
        const val = e.target.value;
        onChange(val === '' ? null : Number(val));
      }}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}

function DatePickerAdapter({
  value,
  onChange,
  name,
  disabled,
  className,
}: RegisteredComponentProps<Date | string | null>) {
  const dateValue = value
    ? typeof value === 'string'
      ? value.split('T')[0]
      : value.toISOString().split('T')[0]
    : '';

  return (
    <Input
      id={name}
      name={name}
      type="date"
      value={dateValue}
      onChange={e => {
        const val = e.target.value;
        onChange(val ? normalizeDateToISO(new Date(val)) : null);
      }}
      disabled={disabled}
      className={className}
    />
  );
}

function ShadcnSubmitButton({ loading, disabled, children, className }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} className={className}>
      {loading ? 'Loading...' : children}
    </Button>
  );
}

// =============================================================================
// Setup Function
// =============================================================================

let isSetup = false;

export function setupSnowForm(): void {
  if (isSetup) return;

  // Register Shadcn components
  registerComponents({
    text: ShadcnInput,
    email: props => <ShadcnInput {...props} componentProps={{ type: 'email' }} />,
    password: props => <ShadcnInput {...props} componentProps={{ type: 'password' }} />,
    textarea: ShadcnTextarea,
    select: ShadcnSelect,
    checkbox: ShadcnSwitch,
    number: NumberInputAdapter,
    date: DatePickerAdapter,
    // Custom business components:
    // 'rich-text': RichTextEditorAdapter,
    // 'media-library': MediaLibraryAdapter,
  });

  // Register submit button
  registerSubmitButton(ShadcnSubmitButton);

  // Register form UI styles (Tailwind)
  registerFormUIStyles({
    form: 'space-y-6 w-full',
    formItem: 'grid gap-2',
    formLabel: 'text-sm font-medium leading-none',
    formLabelError: 'text-destructive',
    formDescription: 'text-sm text-muted-foreground',
    formMessage: 'text-sm text-destructive',
    submitButton: 'w-full',
  });

  // Register translation hook (i18next)
  setTranslationHook(() => {
    const { t } = useTranslation();
    return {
      t: (key: string) => {
        if (key === 'submit') return t('common.submit');
        if (key === 'loading') return t('common.loading');
        return t(`form.${key}`);
      },
    };
  });

  // Register error behavior
  setOnErrorBehavior(formRef => {
    if (formRef) {
      formRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    toast.error('Please fix the form errors');
  });

  isSetup = true;
}
```

---

## App.tsx Integration

Call the setup function **once** at app startup, before your app renders:

```tsx
// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { setupSnowForm } from '@/lib/snow-form-setup';

// Initialize SnowForm before rendering
setupSnowForm();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
```

---

## Custom Types Declaration

To add custom field types (e.g., `rich-text`, `media-library`), create a type declaration file:

```typescript
// src/types/snow-form.d.ts
declare global {
  interface SnowFormCustomTypes {
    'rich-text': true;
    'media-library': true;
  }
}
export {};
```

Then register the components and use them in overrides:

```tsx
// In your setup file
registerComponents({
  // ... other components
  'rich-text': RichTextEditorAdapter,
  'media-library': MediaLibraryAdapter,
});

// In your form
<SnowForm
  schema={schema}
  overrides={{
    content: { type: 'rich-text' },
    avatar: { type: 'media-library' },
  }}
/>
```

---

## Translation Files

Example i18next translation structure:

```json
// locales/en/translation.json
{
  "common": {
    "submit": "Submit",
    "loading": "Loading..."
  },
  "form": {
    "email": "Email Address",
    "password": "Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "bio": "Biography",
    "website": "Website URL"
  }
}
```

```json
// locales/fr/translation.json
{
  "common": {
    "submit": "Envoyer",
    "loading": "Chargement..."
  },
  "form": {
    "email": "Adresse email",
    "password": "Mot de passe",
    "firstName": "Prénom",
    "lastName": "Nom",
    "bio": "Biographie",
    "website": "Site web"
  }
}
```
