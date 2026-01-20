// =============================================================================
// Styles Registry - Global CSS class names for form layout
// =============================================================================

/**
 * Registered styles for form elements
 */
export interface FormStyles {
  /** CSS class for the form container (e.g., 'space-y-4') */
  form?: string;
  /** CSS class for field wrappers (e.g., 'grid gap-2') */
  formItem?: string;
  /** CSS class for labels (e.g., 'text-sm font-medium') */
  label?: string;
  /** CSS class for descriptions (e.g., 'text-xs text-gray-500') */
  description?: string;
  /** CSS class for error messages (e.g., 'text-xs text-red-500') */
  errorMessage?: string;
}

let registeredStyles: FormStyles = {};

/**
 * Register CSS classes for form layout elements.
 * These classes are applied in addition to default classes.
 *
 * @example
 * ```tsx
 * setFormStyles({
 *   form: 'space-y-4',
 *   formItem: 'grid gap-2',
 * });
 * ```
 */
export function setFormStyles(styles: FormStyles): void {
  registeredStyles = { ...styles };
}

/**
 * Get the registered form class
 * @internal Used by SnowForm
 */
export function getFormClass(): string | undefined {
  return registeredStyles.form;
}

/**
 * Get the registered form item class
 * @internal Used by FormProvider
 */
export function getFormItemClass(): string | undefined {
  return registeredStyles.formItem;
}

/**
 * Get the registered label class
 * @internal Used by DEFAULT_FORM_UI
 */
export function getLabelClass(): string | undefined {
  return registeredStyles.label;
}

/**
 * Get the registered description class
 * @internal Used by DEFAULT_FORM_UI
 */
export function getDescriptionClass(): string | undefined {
  return registeredStyles.description;
}

/**
 * Get the registered error message class
 * @internal Used by DEFAULT_FORM_UI
 */
export function getErrorMessageClass(): string | undefined {
  return registeredStyles.errorMessage;
}

/**
 * Reset the styles registry (for testing)
 * @internal
 */
export function resetStylesRegistry(): void {
  registeredStyles = {};
}
