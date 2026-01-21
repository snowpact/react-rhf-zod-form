import type {
  RegisteredComponentProps,
  FormUIDescriptionProps,
  FormUIErrorMessageProps,
  SubmitButtonProps,
  FieldOption,
  RegisterableComponent,
} from '../../../src';

// =============================================================================
// Custom Input Components (Classic Tailwind styling)
// =============================================================================

export function CustomInput({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  name,
  type = 'text',
}: RegisteredComponentProps<string> & { type?: string }) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      data-testid={`auto-form-input-${name}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}

export function CustomTextarea({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  name,
}: RegisteredComponentProps<string>) {
  return (
    <textarea
      id={name}
      name={name}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y disabled:bg-gray-100"
    />
  );
}

export function CustomSelect({
  value,
  onChange,
  onBlur,
  options,
  disabled,
  name,
}: RegisteredComponentProps<string>) {
  return (
    <select
      id={name}
      name={name}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-100 bg-white"
    >
      <option value="">Select...</option>
      {options?.map((opt: FieldOption) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function CustomCheckbox({
  value,
  onChange,
  onBlur,
  disabled,
  name,
}: RegisteredComponentProps<boolean>) {
  return (
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={value ?? false}
      onChange={e => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
  );
}

export function CustomNumberInput({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  name,
}: RegisteredComponentProps<number>) {
  return (
    <input
      id={name}
      name={name}
      type="number"
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-100"
    />
  );
}

export function CustomDatePicker({
  value,
  onChange,
  onBlur,
  disabled,
  name,
}: RegisteredComponentProps<string | Date>) {
  const dateValue = value instanceof Date ? value.toISOString().split('T')[0] : (value ?? '');

  return (
    <input
      id={name}
      name={name}
      type="date"
      value={dateValue}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-100"
    />
  );
}

export function CustomRadio({
  value,
  onChange,
  onBlur,
  options,
  disabled,
  name,
}: RegisteredComponentProps<string>) {
  return (
    <div className="flex flex-wrap gap-4">
      {options?.map((opt: FieldOption) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

// =============================================================================
// Custom Form UI Components
// =============================================================================

export function CustomDescription({ children }: FormUIDescriptionProps) {
  return <p className="text-sm text-gray-500 mt-1">{children}</p>;
}

export function CustomErrorMessage({ message }: FormUIErrorMessageProps) {
  return (
    <p className="text-sm text-red-600 mt-1" role="alert">
      {message}
    </p>
  );
}

// =============================================================================
// Custom Submit Button
// =============================================================================

export function CustomSubmitButton({ loading, disabled, children, className }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children ?? 'Submit'
      )}
    </button>
  );
}

// =============================================================================
// Custom Components Map (for setupSnowForm)
// =============================================================================

export const CUSTOM_COMPONENTS: Record<string, RegisterableComponent> = {
  text: CustomInput,
  email: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="email" />,
  password: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="password" />,
  time: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="time" />,
  'datetime-local': (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="datetime-local" />,
  tel: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="tel" />,
  url: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="url" />,
  color: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="color" />,
  file: (props: RegisteredComponentProps<string>) => <CustomInput {...props} type="file" />,
  textarea: CustomTextarea,
  select: CustomSelect,
  checkbox: CustomCheckbox,
  radio: CustomRadio,
  number: CustomNumberInput,
  date: CustomDatePicker,
};

export const CUSTOM_FORM_UI = {
  description: CustomDescription,
  errorMessage: CustomErrorMessage,
};

export const CUSTOM_SUBMIT_BUTTON = CustomSubmitButton;
