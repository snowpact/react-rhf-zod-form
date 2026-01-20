import type React from 'react';

import type {
  FieldType,
  FormUIComponents,
  FormUIDescriptionProps,
  FormUIErrorMessageProps,
  FormUILabelProps,
  RegisterableComponent,
  RegisteredComponent,
  RegisteredSubmitButton,
  SubmitButtonProps,
} from '../types';
import { cn } from '../utils';
import { getLabelClass, getDescriptionClass, getErrorMessageClass } from './stylesRegistry';

// =============================================================================
// Component Registry
// =============================================================================

/**
 * Registry of components by type
 * Keys are field types (built-in or custom), values are React components
 */
const componentRegistry = new Map<string, RegisteredComponent>();

/**
 * The submit button component (can be customized)
 */
let submitButtonComponent: RegisteredSubmitButton | null = null;

/**
 * Registry for form UI components (label, description, errorMessage)
 */
let formUIComponents: FormUIComponents = {};

// =============================================================================
// Registration API
// =============================================================================

/**
 * Register a single component for a field type.
 * The type must be declared in SnowFormCustomTypes for custom types.
 *
 * @example
 * ```typescript
 * import { registerComponent } from '@snowpact/react-rhf-zod-form';
 * import { MyCustomInput } from './MyCustomInput';
 *
 * registerComponent('text', MyCustomInput);
 * registerComponent('rich-text', MyRichTextEditor); // Must be declared in SnowFormCustomTypes
 * ```
 */
export function registerComponent<TValue = unknown>(type: FieldType, component: RegisteredComponent<TValue>): void {
  componentRegistry.set(type, component as RegisteredComponent);
}

/**
 * Register multiple components at once.
 * All types must be declared in SnowFormCustomTypes for custom types.
 *
 * @example
 * ```typescript
 * import { registerComponents } from '@snowpact/react-rhf-zod-form';
 *
 * registerComponents({
 *   text: MyInput,
 *   textarea: MyTextarea,
 *   select: MySelect,
 *   switch: MySwitch,
 *   number: MyNumberInput,
 *   date: MyDatePicker,
 *   'rich-text': MyRichTextEditor, // Must be declared in SnowFormCustomTypes
 * });
 * ```
 */
export function registerComponents(components: Partial<Record<FieldType, RegisterableComponent>>): void {
  for (const [type, component] of Object.entries(components)) {
    if (component) {
      componentRegistry.set(type, component);
    }
  }
}

/**
 * Register a custom submit button component
 *
 * @example
 * ```typescript
 * registerSubmitButton(({ loading, disabled, children, className }) => (
 *   <Button type="submit" disabled={disabled || loading} className={className}>
 *     {loading ? <Spinner /> : children}
 *   </Button>
 * ));
 * ```
 */
export function registerSubmitButton(component: RegisteredSubmitButton): void {
  submitButtonComponent = component;
}

/**
 * Register custom form UI components (label, description, errorMessage)
 *
 * @example
 * ```typescript
 * registerFormUI({
 *   label: ({ children, required, invalid, htmlFor }) => (
 *     <label htmlFor={htmlFor} className={cn('my-label', invalid && 'error')}>
 *       {children}
 *       {required && <span className="text-red-500">*</span>}
 *     </label>
 *   ),
 *   description: ({ children }) => (
 *     <p className="text-sm text-gray-500">{children}</p>
 *   ),
 *   errorMessage: ({ message }) => (
 *     <p className="text-sm text-red-500">{message}</p>
 *   ),
 * });
 * ```
 */
export function registerFormUI(components: FormUIComponents): void {
  formUIComponents = { ...formUIComponents, ...components };
}

// =============================================================================
// Getters
// =============================================================================

/**
 * Get a registered component by type
 * Returns undefined if not registered
 */
export function getRegisteredComponent(type: string): RegisteredComponent | undefined {
  return componentRegistry.get(type);
}

/**
 * Get the registered submit button component
 * Returns undefined if not registered (will use default)
 */
export function getRegisteredSubmitButton(): RegisteredSubmitButton | undefined {
  return submitButtonComponent ?? undefined;
}

/**
 * Get the registered form UI components
 * Falls back to DEFAULT_FORM_UI for any unregistered component
 */
export function getFormUI(): Required<FormUIComponents> {
  return {
    label: formUIComponents.label ?? DefaultLabel,
    description: formUIComponents.description ?? DefaultDescription,
    errorMessage: formUIComponents.errorMessage ?? DefaultErrorMessage,
  };
}

/**
 * Check if a component type is registered
 */
export function hasRegisteredComponent(type: string): boolean {
  return componentRegistry.has(type);
}

/**
 * Get all registered component types
 */
export function getRegisteredTypes(): string[] {
  return Array.from(componentRegistry.keys());
}

// =============================================================================
// Reset (useful for testing)
// =============================================================================

/**
 * Clear all registered components (mainly for testing)
 */
export function clearRegistry(): void {
  componentRegistry.clear();
  submitButtonComponent = null;
  formUIComponents = {};
}

// =============================================================================
// Default Submit Button
// =============================================================================

/**
 * Default submit button used when none is registered
 */
export function DefaultSubmitButton({ loading, disabled, children, className }: SubmitButtonProps): React.ReactElement {
  return (
    <button type="submit" disabled={disabled || loading} className={className}>
      {loading ? 'Loading...' : (children ?? 'Submit')}
    </button>
  );
}

// =============================================================================
// Default Form UI Components
// =============================================================================

/**
 * Default label component
 */
function DefaultLabel({ children, required, invalid, htmlFor }: FormUILabelProps): React.ReactElement {
  return (
    <label htmlFor={htmlFor} className={cn('snow-form-label', getLabelClass(), invalid && 'snow-form-label-error')}>
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );
}

/**
 * Default description component
 */
function DefaultDescription({ children }: FormUIDescriptionProps): React.ReactElement {
  return <p className={cn('snow-form-description', getDescriptionClass())}>{children}</p>;
}

/**
 * Default error message component
 */
function DefaultErrorMessage({ message }: FormUIErrorMessageProps): React.ReactElement {
  return (
    <p className={cn('snow-form-message', getErrorMessageClass())} role="alert">
      {message}
    </p>
  );
}

// =============================================================================
// Default Constants for Export
// =============================================================================

/**
 * Default form UI components (label, description, errorMessage).
 * Import these if you want to use SnowForm's default styled UI components.
 * Requires importing '@snowpact/react-rhf-zod-form/styles.css'.
 *
 * @example
 * ```typescript
 * import { setupSnowForm, DEFAULT_FORM_UI } from '@snowpact/react-rhf-zod-form';
 * import '@snowpact/react-rhf-zod-form/styles.css';
 *
 * setupSnowForm({
 *   translate: (key) => key,
 *   formUI: DEFAULT_FORM_UI,
 * });
 * ```
 */
export const DEFAULT_FORM_UI: FormUIComponents = {
  label: DefaultLabel,
  description: DefaultDescription,
  errorMessage: DefaultErrorMessage,
};

/**
 * Default submit button component.
 * Import this if you want to use SnowForm's default styled submit button.
 * Requires importing '@snowpact/react-rhf-zod-form/styles.css'.
 *
 * @example
 * ```typescript
 * import { setupSnowForm, DEFAULT_SUBMIT_BUTTON } from '@snowpact/react-rhf-zod-form';
 * import '@snowpact/react-rhf-zod-form/styles.css';
 *
 * setupSnowForm({
 *   translate: (key) => key,
 *   submitButton: DEFAULT_SUBMIT_BUTTON,
 * });
 * ```
 */
export const DEFAULT_SUBMIT_BUTTON: RegisteredSubmitButton = DefaultSubmitButton;
