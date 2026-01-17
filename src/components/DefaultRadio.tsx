import type React from 'react';

import type { RegisteredComponentProps } from '../types';
import { cn } from '../utils';

/**
 * Default radio group component (HTML native)
 * Used when no custom component is registered for 'radio' type
 */
export function DefaultRadio({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  options,
  className,
}: RegisteredComponentProps<string>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={name}
      className={cn('snow-radio-group', className)}
      data-testid={`auto-form-radio-${name}`}
    >
      {options?.map(option => (
        <label key={option.value} className="snow-radio-label">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className="snow-radio"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
