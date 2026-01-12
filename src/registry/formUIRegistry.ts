/**
 * Form UI Style Registry
 *
 * Allows registering default CSS classes for form layout components.
 * This keeps the library UI-agnostic while allowing customization.
 *
 * @example
 * ```typescript
 * // Register Tailwind/shadcn-like styles
 * registerFormUIStyles({
 *   formItem: 'grid gap-2',
 *   formLabel: 'text-sm font-medium',
 *   formLabelError: 'text-destructive',
 *   formDescription: 'text-muted-foreground text-sm',
 *   formMessage: 'text-destructive text-sm',
 *   input: 'flex h-9 w-full rounded-md border ...',
 * });
 * ```
 */

export interface FormUIStyles {
  /** Form element - container for all fields */
  form?: string;
  /** Container for label + input + description + error */
  formItem?: string;
  /** Label element */
  formLabel?: string;
  /** Label when field has error */
  formLabelError?: string;
  /** Help text / hint below field */
  formDescription?: string;
  /** Error message */
  formMessage?: string;
  /** Submit button className */
  submitButton?: string;
  /** Input className - passed to all default components via styles.input */
  input?: string;
}

let formUIStyles: FormUIStyles = {};

/**
 * Register default CSS classes for form UI components
 */
export function registerFormUIStyles(styles: FormUIStyles): void {
  formUIStyles = { ...formUIStyles, ...styles };
}

/**
 * Get registered form UI styles
 */
export function getFormUIStyles(): FormUIStyles {
  return formUIStyles;
}

/**
 * Reset form UI styles (for testing)
 */
export function resetFormUIRegistry(): void {
  formUIStyles = {};
}
