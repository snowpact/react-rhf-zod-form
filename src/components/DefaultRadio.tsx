import type React from 'react';

import type { RegisteredComponentProps } from '../types';

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
    <div role="radiogroup" aria-labelledby={name} className={className} data-testid={`auto-form-radio-${name}`}>
      {options?.map(option => (
        <label key={option.value} className="inline-flex items-center gap-2 mr-4">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
