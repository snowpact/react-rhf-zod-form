import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

interface NumberInputComponentProps {
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

/**
 * Default number input component (HTML native)
 * Used when no custom component is registered for 'number' type
 */
export function DefaultNumberInput({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  className,
  componentProps,
  error,
}: RegisteredComponentProps<number | null>): React.ReactElement {
  const { min, max, step } = (componentProps ?? {}) as NumberInputComponentProps;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '' || rawValue === null) {
      onChange(null);
    } else {
      const parsed = parseFloat(rawValue);
      onChange(isNaN(parsed) ? null : parsed);
    }
  };

  return (
    <input
      type="number"
      id={name}
      name={name}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={cn('snow-input', error && 'snow-input-error', className)}
      min={min}
      max={max}
      step={step}
      data-testid={`auto-form-number-${name}`}
    />
  );
}
