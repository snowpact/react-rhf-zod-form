import type React from 'react';

import type { RegisteredComponentProps } from '../types';

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
      className={className}
      rows={4}
      data-testid={`auto-form-textarea-${name}`}
    />
  );
}
