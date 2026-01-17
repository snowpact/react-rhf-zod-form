import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

/**
 * Default textarea component (HTML native)
 * Used when no custom component is registered for 'textarea' type
 */
export function DefaultTextarea({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
  error,
}: RegisteredComponentProps<string>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      id={name}
      name={name}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={cn('snow-textarea', error && 'snow-input-error', className)}
      rows={4}
      data-testid={`auto-form-textarea-${name}`}
    />
  );
}
