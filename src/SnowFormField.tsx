import { useCallback } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import {
  DefaultCheckbox,
  DefaultDatePicker,
  DefaultInput,
  DefaultNumberInput,
  DefaultRadio,
  DefaultSelect,
  DefaultTextarea,
} from './components';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, useFormField } from './FormProvider';
import { getRegisteredComponent } from './registry/componentRegistry';
import { useSnowFormTranslation } from './registry/translationRegistry';
import type { FieldConfig, FieldType, RegisterableComponent, RegisteredComponentProps, SchemaFieldInfo } from './types';
import { resolveFieldType } from './utils';

// =============================================================================
// Default Component Mapping
// =============================================================================

const EmailInput: RegisterableComponent = props => <DefaultInput {...props} type="email" />;
const PasswordInput: RegisterableComponent = props => <DefaultInput {...props} type="password" />;
const TimeInput: RegisterableComponent = props => <DefaultInput {...props} type="time" />;
const DateTimeLocalInput: RegisterableComponent = props => <DefaultInput {...props} type="datetime-local" />;
const TelInput: RegisterableComponent = props => <DefaultInput {...props} type="tel" />;
const UrlInput: RegisterableComponent = props => <DefaultInput {...props} type="url" />;
const ColorInput: RegisterableComponent = props => <DefaultInput {...props} type="color" />;
const FileInput: RegisterableComponent = props => <DefaultInput {...props} type="file" />;

function getDefaultComponent(type: FieldType): RegisterableComponent | null {
  switch (type) {
    case 'text':
      return DefaultInput;
    case 'email':
      return EmailInput;
    case 'password':
      return PasswordInput;
    case 'time':
      return TimeInput;
    case 'datetime-local':
      return DateTimeLocalInput;
    case 'tel':
      return TelInput;
    case 'url':
      return UrlInput;
    case 'color':
      return ColorInput;
    case 'file':
      return FileInput;
    case 'textarea':
      return DefaultTextarea;
    case 'select':
      return DefaultSelect;
    case 'checkbox':
      return DefaultCheckbox;
    case 'radio':
      return DefaultRadio;
    case 'number':
      return DefaultNumberInput;
    case 'date':
      return DefaultDatePicker;
    case 'hidden':
      return null;
    default:
      return null;
  }
}

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
  const { t } = useSnowFormTranslation();
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
      <FormItem className={styles?.fieldWrapper}>
        <FormLabel className={styles?.label} required={isRequired}>
          {label}
        </FormLabel>
        <FormControl>
          {override.render({
            value: field.value,
            onChange: field.onChange,
            error: error?.message,
          })}
        </FormControl>
        {override?.description && (
          <FormDescription className={styles?.description}>{override.description}</FormDescription>
        )}
        <FormMessage className={styles?.error} />
      </FormItem>
    );
  }

  // Get component (registered > default)
  const RegisteredComponent = getRegisteredComponent(fieldType);
  const DefaultComponent = getDefaultComponent(fieldType);
  const Component = RegisteredComponent ?? DefaultComponent;

  if (!Component) {
    console.warn(
      `[SnowForm] No component registered for type "${fieldType}" and no default available. ` +
        `Register a component with registerComponent('${fieldType}', MyComponent).`
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
    <FormItem className={styles?.fieldWrapper}>
      <FormLabel className={styles?.label} required={isRequired}>
        {label}
      </FormLabel>
      <FormControl>
        <Component {...componentProps} />
      </FormControl>
      {override?.description && (
        <FormDescription className={styles?.description}>{override.description}</FormDescription>
      )}
      <FormMessage className={styles?.error} />
    </FormItem>
  );
}
