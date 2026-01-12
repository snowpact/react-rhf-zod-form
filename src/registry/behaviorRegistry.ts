import type { FieldErrors } from 'react-hook-form';

// =============================================================================
// Behavior Registry - Global error behavior callback
// =============================================================================

/**
 * Callback type for error behavior
 * Called when form has validation errors
 */
export type OnErrorBehavior = (formRef: HTMLFormElement | null, errors: FieldErrors) => void;

let onErrorBehavior: OnErrorBehavior | null = null;

/**
 * Register a global error behavior callback.
 * Called when form validation fails.
 *
 * @example
 * ```tsx
 * setOnErrorBehavior((formRef, errors) => {
 *   formRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
 * });
 * ```
 */
export function setOnErrorBehavior(callback: OnErrorBehavior): void {
  onErrorBehavior = callback;
}

/**
 * Execute the error behavior callback if registered
 * @internal Used by SnowForm
 */
export function executeOnErrorBehavior(formRef: HTMLFormElement | null, errors: FieldErrors): void {
  onErrorBehavior?.(formRef, errors);
}

/**
 * Reset the behavior registry (for testing)
 * @internal
 */
export function resetBehaviorRegistry(): void {
  onErrorBehavior = null;
}
