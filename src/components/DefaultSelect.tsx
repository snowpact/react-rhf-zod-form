import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

/**
 * Default select component (HTML native)
 * Used when no custom component is registered for 'select' type
 */
export function DefaultSelect({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  options,
  className,
  error,
}: RegisteredComponentProps<string>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    // Empty string means "no selection" - convert to undefined
    onChange(newValue === '' ? (undefined as unknown as string) : newValue);
  };

  return (
    <select
      id={name}
      name={name}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      className={cn('snow-select', error && 'snow-input-error', className)}
      data-testid={`auto-form-select-${name}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
