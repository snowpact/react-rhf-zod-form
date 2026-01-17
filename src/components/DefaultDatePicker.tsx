import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn, normalizeDateToISO } from '../utils';

/**
 * Default date picker component (HTML native)
 * Used when no custom component is registered for 'date' type
 */
export function DefaultDatePicker({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  className,
  error,
}: RegisteredComponentProps<Date | string | null>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(normalizeDateToISO(e.target.value || null));
  };

  // Format value for input[type="date"] (YYYY-MM-DD)
  const formatForInput = (val: Date | string | null | undefined): string => {
    if (!val) return '';
    const date = typeof val === 'string' ? new Date(val) : val;
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <input
      type="date"
      id={name}
      name={name}
      value={formatForInput(value)}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      className={cn('snow-input', error && 'snow-input-error', className)}
      data-testid={`auto-form-date-${name}`}
    />
  );
}
