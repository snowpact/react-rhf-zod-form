import { useState } from 'react';

import { FieldWrapper } from './FieldWrapper';
import { FormControl } from './FormProvider';
import { getRegisteredComponent } from './registry/componentRegistry';
import { getChipClass } from './registry/stylesRegistry';
import type { FieldConfig, SchemaFieldInfo } from './types';
import { resolveFieldType } from './utils';

interface ArrayFieldRendererProps {
  name: string;
  label: string;
  isRequired: boolean;
  isDisabled?: boolean;
  arrayElementInfo: SchemaFieldInfo;
  override?: FieldConfig;
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
  };
  styles?: {
    fieldWrapper?: string;
    label?: string;
    input?: string;
    error?: string;
    description?: string;
  };
}

export function ArrayFieldRenderer({
  name,
  label,
  isRequired,
  isDisabled,
  arrayElementInfo,
  override,
  field,
  styles,
}: ArrayFieldRendererProps): React.ReactElement | null {
  const [inputValue, setInputValue] = useState('');
  const arrayValue: unknown[] = Array.isArray(field.value) ? field.value : [];

  const isEnum = arrayElementInfo.baseType === 'enum';
  const isNumber = arrayElementInfo.baseType === 'number';
  const elementType = resolveFieldType(arrayElementInfo, override);
  const ElementComponent = getRegisteredComponent(elementType);

  // For enum: filter out already selected options
  const allOptions = override?.options ?? arrayElementInfo.enumValues?.map(v => ({ label: v, value: v })) ?? [];
  const availableOptions = isEnum
    ? allOptions.filter(opt => !arrayValue.includes(opt.value))
    : [];

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (isNumber) {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        field.onChange([...arrayValue, num]);
        setInputValue('');
      }
    } else {
      field.onChange([...arrayValue, trimmed]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    field.onChange(arrayValue.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!ElementComponent) {
    console.warn(
      `[SnowForm] No component registered for array element type "${elementType}". ` +
        `Register it via setupSnowForm({ components: { ${elementType}: YourComponent } }).`
    );
    return null;
  }

  const getDisplayLabel = (value: unknown): string => {
    if (isEnum) {
      const option = allOptions.find(opt => opt.value === value);
      return option?.label ?? String(value);
    }
    return String(value);
  };

  return (
    <FieldWrapper
      label={label}
      isRequired={isRequired}
      description={override?.description}
      styles={styles}
    >
      <FormControl>
        {isEnum ? (
          <ElementComponent
            value=""
            onChange={(val: unknown) => {
              if (val) {
                field.onChange([...arrayValue, val]);
              }
            }}
            onBlur={field.onBlur}
            name={name}
            disabled={isDisabled || availableOptions.length === 0}
            options={availableOptions}
            className={styles?.input}
          />
        ) : (
          <div onKeyDown={handleKeyDown}>
            <ElementComponent
              value={isNumber ? (inputValue === '' ? '' : Number(inputValue)) : inputValue}
              onChange={(val: unknown) => setInputValue(String(val ?? ''))}
              onBlur={field.onBlur}
              name={name}
              disabled={isDisabled}
              placeholder={override?.placeholder}
              className={styles?.input}
            />
          </div>
        )}
      </FormControl>

      {arrayValue.length > 0 && (
        <div>
          {arrayValue.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleRemove(index)}
              disabled={isDisabled}
              className={getChipClass()}
              aria-label={`Remove ${getDisplayLabel(item)}`}
            >
              {getDisplayLabel(item)} ×
            </button>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
