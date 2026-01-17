import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

/**
 * Default checkbox component (HTML native)
 * Used when no custom component is registered for 'checkbox' type
 */
export function DefaultCheckbox({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  className,
}: RegisteredComponentProps<boolean>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={value ?? false}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      className={cn('snow-checkbox', className)}
      data-testid={`auto-form-checkbox-${name}`}
    />
  );
}
