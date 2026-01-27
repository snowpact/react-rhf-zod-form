import { useCallback } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { ArrayFieldRenderer } from './ArrayFieldRenderer';
import { FieldWrapper } from './FieldWrapper';
import { FormControl, useFormField } from './FormProvider';
import { getRegisteredComponent } from './registry/componentRegistry';
import { getT } from './registry/translationRegistry';
import type { FieldConfig, RegisteredComponentProps, SchemaFieldInfo } from './types';
import { resolveFieldType } from './utils';

// =============================================================================
// SnowFormField Component
// =============================================================================

export interface SnowFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  /** Field name (key from schema) */
  name: TName;
  /** Schema field information */
  fieldInfo: SchemaFieldInfo;
  /** Override configuration for this field */
  override?: FieldConfig;
  /** RHF Controller field props */
  field: ControllerRenderProps<TFieldValues, TName>;
  /** Whether the form is disabled */
  formDisabled?: boolean;
  /** Default CSS classes */
  styles?: {
    fieldWrapper?: string;
    label?: string;
    input?: string;
    error?: string;
    description?: string;
  };
}

/**
 * Renders a single form field based on its schema type and overrides
 */
export function SnowFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  fieldInfo,
  override,
  field,
  formDisabled,
  styles,
}: SnowFormFieldProps<TFieldValues, TName>): React.ReactElement | null {
  const t = getT();
  const { error } = useFormField();
  const fieldType = resolveFieldType(fieldInfo, override);

  // Hidden fields render without label/wrapper
  if (fieldType === 'hidden') {
    return <input type="hidden" name={name} value={field.value ?? ''} />;
  }

  // Get label (override > translation)
  const label = override?.label ?? t(name);
  const isRequired = !fieldInfo.isOptional;
  const isDisabled = formDisabled || override?.disabled;

  // Handle custom render function
  // FieldConfig render receives { value, onChange, error } for custom components
  if (override?.render) {
    return (
      <FieldWrapper
        label={label}
        isRequired={isRequired}
        hideLabel={override.hideLabel}
        description={override.description}
        styles={styles}
      >
        <FormControl>
          {override.render({
            value: field.value,
            onChange: field.onChange,
            error: error?.message,
          })}
        </FormControl>
      </FieldWrapper>
    );
  }

  // Array fields
  if (fieldInfo.baseType === 'array' && fieldInfo.arrayElementInfo) {
    return (
      <ArrayFieldRenderer
        name={name}
        label={label}
        isRequired={isRequired}
        isDisabled={isDisabled}
        arrayElementInfo={fieldInfo.arrayElementInfo}
        override={override}
        field={field}
        styles={styles}
      />
    );
  }

  // Get registered component (strict: no fallback)
  const Component = getRegisteredComponent(fieldType);

  if (!Component) {
    console.warn(
      `[SnowForm] No component registered for type "${fieldType}". ` +
        `Register it via setupSnowForm({ components: { ${fieldType}: YourComponent } }).`
    );
    return null;
  }

  // Build options for select/enum fields
  const options =
    override?.options ??
    (fieldInfo.baseType === 'enum' && fieldInfo.enumValues
      ? fieldInfo.enumValues.map(value => ({ label: value, value }))
      : undefined);

  // Memoized onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback(
    (value: unknown) => {
      // Apply empty value transformations
      if (override?.emptyAsNull && (value === '' || value === undefined)) {
        field.onChange(null as typeof field.value);
      } else if (override?.emptyAsUndefined && (value === '' || value === null)) {
        field.onChange(undefined as typeof field.value);
      } else if (override?.emptyAsZero && (value === '' || value === null || value === undefined)) {
        field.onChange(0 as typeof field.value);
      } else {
        field.onChange(value as typeof field.value);
      }
    },
    [field.onChange, override?.emptyAsNull, override?.emptyAsUndefined, override?.emptyAsZero]
  );

  // Prepare component props
  const componentProps: RegisteredComponentProps = {
    value: field.value,
    onChange: handleChange,
    onBlur: field.onBlur,
    name,
    disabled: isDisabled,
    placeholder: override?.placeholder,
    options,
    className: styles?.input,
    componentProps: override?.componentProps,
  };

  return (
    <FieldWrapper
      label={label}
      isRequired={isRequired}
      description={override?.description}
      styles={styles}
    >
      <FormControl>
        <Component {...componentProps} />
      </FormControl>
    </FieldWrapper>
  );
}
