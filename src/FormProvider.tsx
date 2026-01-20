import { createContext, useContext, type ReactNode } from 'react';
import {
  Controller,
  FormProvider as RHFFormProvider,
  useFormContext,
  type ControllerProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { getFormUI } from './registry/componentRegistry';
import { getFormItemClass } from './registry/stylesRegistry';
import { cn } from './utils';

// =============================================================================
// Form Context (wraps react-hook-form's FormProvider)
// =============================================================================

/**
 * Re-export RHF FormProvider as Form for convenience
 */
export const Form = RHFFormProvider;

// =============================================================================
// Field Context
// =============================================================================

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Provides field context (name) to child components
 * Uses name as id for accessibility (label htmlFor matches input id)
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  render,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  render: ControllerProps<TFieldValues, TName>['render'];
}): React.ReactElement {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} render={render} {...props} />
    </FormFieldContext.Provider>
  );
}

/**
 * Hook to get current field context
 * Must be used within a FormField component
 */
export function useFormField(): {
  name: string;
  id: string;
  error?: { message?: string };
  invalid: boolean;
} {
  const fieldContext = useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within a FormField component');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    name: fieldContext.name,
    id: fieldContext.name, // Use name as id for accessibility
    error: fieldState.error,
    invalid: !!fieldState.error,
  };
}

// =============================================================================
// Layout Components (HTML native, no Radix)
// =============================================================================

interface FormItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper for a form field (container for label + input + error)
 */
export function FormItem({ children, className }: FormItemProps): React.ReactElement {
  return <div className={cn('snow-form-item', getFormItemClass(), className)}>{children}</div>;
}

interface FormLabelProps {
  children: ReactNode;
  className?: string;
  required?: boolean;
}

/**
 * Label for a form field.
 * Uses registered label component or DEFAULT_FORM_UI fallback.
 */
export function FormLabel({ children, required }: FormLabelProps): React.ReactElement {
  const { id, invalid } = useFormField();
  const { label: Label } = getFormUI();

  return (
    <Label htmlFor={id} required={required} invalid={invalid}>
      {children}
    </Label>
  );
}

interface FormControlProps {
  children: ReactNode;
}

/**
 * Container for the actual input element
 * Passes the id from FormField context to the child
 */
export function FormControl({ children }: FormControlProps): React.ReactElement {
  // Just render children - the id is handled via useFormField in the input
  return <>{children}</>;
}

interface FormDescriptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Help text below a form field.
 * Uses registered description component or DEFAULT_FORM_UI fallback.
 */
export function FormDescription({ children }: FormDescriptionProps): React.ReactElement {
  const { description: Description } = getFormUI();

  return <Description>{children}</Description>;
}

interface FormMessageProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Error message for a form field.
 * Automatically displays the field's error if present.
 * Uses registered errorMessage component or DEFAULT_FORM_UI fallback.
 */
export function FormMessage({ children }: FormMessageProps): React.ReactElement | null {
  const { error } = useFormField();
  const { errorMessage: ErrorMessage } = getFormUI();
  const message = error?.message ?? children;

  if (!message || typeof message !== 'string') {
    return null;
  }

  return <ErrorMessage message={message} />;
}
