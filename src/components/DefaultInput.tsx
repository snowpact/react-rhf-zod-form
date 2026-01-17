import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

export interface DefaultInputProps extends RegisteredComponentProps<string> {
  type?: 'text' | 'email' | 'password' | 'time' | 'datetime-local' | 'tel' | 'url' | 'color' | 'file';
}

/**
 * Default text input component (HTML native)
 * Used when no custom component is registered for 'text', 'email', or 'password' types
 */
export function DefaultInput({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
  error,
  type = 'text',
}: DefaultInputProps): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={cn('snow-input', error && 'snow-input-error', className)}
      data-testid={`auto-form-input-${name}`}
      data-input-type={type}
    />
  );
}
