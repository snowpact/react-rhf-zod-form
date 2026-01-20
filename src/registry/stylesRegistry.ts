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
 * Reset the styles registry (for testing)
 * @internal
 */
export function resetStylesRegistry(): void {
  registeredStyles = {};
}
