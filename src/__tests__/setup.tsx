import '@testing-library/jest-dom/vitest';
import React from 'react';
import { beforeEach } from 'vitest';
import type { RegisteredComponentProps, SubmitButtonProps, FormUILabelProps, FormUIDescriptionProps, FormUIErrorMessageProps } from '../types';
import { resetSnowForm, setupSnowForm } from '../registry';
import { cn } from '../utils';

// =============================================================================
// Test Components (match the API/attributes of the original default components)
// =============================================================================

interface TestInputProps extends RegisteredComponentProps<string> {
  type?: 'text' | 'email' | 'password' | 'time' | 'datetime-local' | 'tel' | 'url' | 'color' | 'file';
}

const TestInput = ({ value, onChange, onBlur, name, placeholder, disabled, className, error, type = 'text' }: TestInputProps) => (
  <input
    type={type}
    id={name}
    name={name}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    disabled={disabled}
    className={cn('snow-input', error && 'snow-input-error', className)}
    data-testid={`auto-form-input-${name}`}
    data-input-type={type}
  />
);

const TestTextarea = ({ value, onChange, onBlur, name, placeholder, disabled, className, error }: RegisteredComponentProps<string>) => (
  <textarea
    id={name}
    name={name}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    disabled={disabled}
    className={cn('snow-textarea', error && 'snow-textarea-error', className)}
    data-testid={`auto-form-input-${name}`}
  />
);

const TestSelect = ({ value, onChange, onBlur, name, options, disabled, className, error }: RegisteredComponentProps<string>) => (
  <select
    id={name}
    name={name}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
    disabled={disabled}
    className={cn('snow-select', error && 'snow-select-error', className)}
    data-testid={`auto-form-input-${name}`}
  >
    <option value="">Select...</option>
    {options?.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const TestNumberInput = ({ value, onChange, onBlur, name, disabled, className, error }: RegisteredComponentProps<number>) => (
  <input
    id={name}
    name={name}
    type="number"
    value={value ?? ''}
    onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    onBlur={onBlur}
    disabled={disabled}
    className={cn('snow-input', error && 'snow-input-error', className)}
    data-testid={`auto-form-input-${name}`}
  />
);

const TestDatePicker = ({ value, onChange, onBlur, name, disabled, className, error }: RegisteredComponentProps<string>) => (
  <input
    id={name}
    name={name}
    type="date"
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
    disabled={disabled}
    className={cn('snow-input', error && 'snow-input-error', className)}
    data-testid={`auto-form-input-${name}`}
    data-input-type="date"
  />
);

const TestCheckbox = ({ value, onChange, onBlur, name, disabled, className, error }: RegisteredComponentProps<boolean>) => (
  <input
    id={name}
    name={name}
    type="checkbox"
    checked={value ?? false}
    onChange={e => onChange(e.target.checked)}
    onBlur={onBlur}
    disabled={disabled}
    className={cn('snow-checkbox', error && 'snow-checkbox-error', className)}
    data-testid={`auto-form-input-${name}`}
  />
);

const TestRadio = ({ value, onChange, name, options, disabled, className, error }: RegisteredComponentProps<string>) => (
  <div className={cn('snow-radio', error && 'snow-radio-error', className)}>
    {options?.map(opt => (
      <label key={opt.value}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          data-testid={`auto-form-input-${name}-${opt.value}`}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

const TestLabel = ({ children, required, invalid, htmlFor }: FormUILabelProps) => (
  <label htmlFor={htmlFor} className={cn('snow-form-label', invalid && 'snow-form-label-error')}>
    {children}
    {required && <span aria-hidden="true"> *</span>}
  </label>
);

const TestDescription = ({ children }: FormUIDescriptionProps) => (
  <p className="snow-form-description">{children}</p>
);

const TestErrorMessage = ({ message }: FormUIErrorMessageProps) => (
  <p className="snow-form-message" role="alert">{message}</p>
);

const TestSubmitButton = ({ loading, disabled, children, className }: SubmitButtonProps) => (
  <button type="submit" disabled={disabled || loading} className={cn('snow-form-submit-btn', className)}>
    {loading ? 'Loading...' : children}
  </button>
);

// Test components registry
const TEST_COMPONENTS = {
  text: TestInput,
  email: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="email" />,
  password: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="password" />,
  time: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="time" />,
  'datetime-local': (props: RegisteredComponentProps<string>) => <TestInput {...props} type="datetime-local" />,
  tel: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="tel" />,
  url: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="url" />,
  color: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="color" />,
  file: (props: RegisteredComponentProps<string>) => <TestInput {...props} type="file" />,
  textarea: TestTextarea,
  select: TestSelect,
  checkbox: TestCheckbox,
  radio: TestRadio,
  number: TestNumberInput,
  date: TestDatePicker,
};

const TEST_FORM_UI = {
  label: TestLabel,
  description: TestDescription,
  errorMessage: TestErrorMessage,
};

// Setup test components before each test
beforeEach(() => {
  // Reset to clean state
  resetSnowForm();

  // Setup with test components
  setupSnowForm({
    translate: (key: string) => key,
    components: TEST_COMPONENTS,
    formUI: TEST_FORM_UI,
    submitButton: TestSubmitButton,
  });
});
