import type { RegisterableComponent, RegisteredSubmitButton } from '../types';

import {
  registerComponent,
  registerComponents,
  registerSubmitButton,
  getRegisteredComponent,
  getRegisteredSubmitButton,
  hasRegisteredComponent,
  getRegisteredTypes,
  clearRegistry,
  DefaultSubmitButton,
} from './componentRegistry';

import {
  setTranslationFunction,
  setTranslations,
  getT,
  getTranslationKeys,
  resetTranslationRegistry,
  type TranslationFunction,
} from './translationRegistry';

import {
  setOnErrorBehavior,
  executeOnErrorBehavior,
  resetBehaviorRegistry,
  type OnErrorBehavior,
} from './behaviorRegistry';

// =============================================================================
// Setup Types
// =============================================================================

/**
 * Default translation keys available in SnowForm
 */
export interface SnowFormTranslationKeys {
  'snowForm.submit': string;
  'snowForm.submitting': string;
  'snowForm.required': string;
  'snowForm.selectPlaceholder': string;
}

/**
 * Options for setupSnowForm
 */
export interface SetupSnowFormOptions {
  /**
   * Translation function (required)
   * Can be i18next's t, next-intl's t, or any (key: string) => string function
   *
   * @example Using i18next
   * ```typescript
   * import { t } from 'i18next';
   * setupSnowForm({ translate: t });
   * ```
   *
   * @example Using next-intl
   * ```typescript
   * const t = await getTranslations('form');
   * setupSnowForm({ translate: t });
   * ```
   */
  translate: TranslationFunction;

  /**
   * Custom translations to merge with defaults (optional)
   * Useful for overriding default English strings without a full i18n setup
   *
   * @example
   * ```typescript
   * setupSnowForm({
   *   translate: (key) => key,
   *   translations: {
   *     'snowForm.submit': 'Envoyer',
   *     'snowForm.submitting': 'Envoi en cours...',
   *   },
   * });
   * ```
   */
  translations?: Partial<SnowFormTranslationKeys>;

  /**
   * Custom components to register
   * Keys are field types, values are React components
   *
   * @example
   * ```typescript
   * setupSnowForm({
   *   translate: t,
   *   components: {
   *     text: MyInput,
   *     textarea: MyTextarea,
   *     select: MySelect,
   *   },
   * });
   * ```
   */
  components?: Partial<Record<string, RegisterableComponent>>;

  /**
   * Custom submit button component
   *
   * @example
   * ```typescript
   * setupSnowForm({
   *   translate: t,
   *   submitButton: ({ loading, disabled, children }) => (
   *     <Button type="submit" disabled={disabled || loading}>
   *       {loading ? <Spinner /> : children}
   *     </Button>
   *   ),
   * });
   * ```
   */
  submitButton?: RegisteredSubmitButton;

  /**
   * Error behavior callback
   * Called when form validation fails
   *
   * @example
   * ```typescript
   * setupSnowForm({
   *   translate: t,
   *   onError: (formRef, errors) => {
   *     formRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   *   },
   * });
   * ```
   */
  onError?: OnErrorBehavior;
}

// =============================================================================
// Setup State
// =============================================================================

let isSetup = false;

// =============================================================================
// Setup API
// =============================================================================

/**
 * Initialize SnowForm with your configuration.
 * Call this once at app startup (e.g., in _app.tsx, layout.tsx, or main.tsx).
 *
 * @param options - Configuration options
 *
 * @example Basic setup
 * ```typescript
 * import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
 *
 * setupSnowForm({
 *   translate: (key) => key, // Identity function if no i18n
 * });
 * ```
 *
 * @example With i18next
 * ```typescript
 * import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
 * import i18next from 'i18next';
 *
 * setupSnowForm({
 *   translate: i18next.t.bind(i18next),
 * });
 * ```
 *
 * @example Full configuration
 * ```typescript
 * import { setupSnowForm } from '@snowpact/react-rhf-zod-form';
 * import { MyInput, MySelect, MyButton } from './components';
 *
 * setupSnowForm({
 *   translate: t,
 *   translations: {
 *     'snowForm.submit': 'Send',
 *     'snowForm.submitting': 'Sending...',
 *   },
 *   components: {
 *     text: MyInput,
 *     select: MySelect,
 *   },
 *   submitButton: MyButton,
 *   onError: (formRef) => {
 *     formRef?.scrollIntoView({ behavior: 'smooth' });
 *   },
 * });
 * ```
 */
export function setupSnowForm(options: SetupSnowFormOptions): void {
  // Prevent double setup (idempotent)
  if (isSetup) {
    console.warn('[SnowForm] setupSnowForm has already been called. Ignoring duplicate call.');
    return;
  }

  // Set translation function (required)
  setTranslationFunction(options.translate);

  // Set custom translations (optional)
  if (options.translations) {
    setTranslations(options.translations);
  }

  // Register components (optional)
  if (options.components) {
    registerComponents(options.components);
  }

  // Register submit button (optional)
  if (options.submitButton) {
    registerSubmitButton(options.submitButton);
  }

  // Set error behavior (optional)
  if (options.onError) {
    setOnErrorBehavior(options.onError);
  }

  isSetup = true;
}

/**
 * Reset SnowForm to its initial state.
 * Mainly used for testing.
 */
export function resetSnowForm(): void {
  isSetup = false;
  resetTranslationRegistry();
  clearRegistry();
  resetBehaviorRegistry();
}

/**
 * Check if SnowForm has been initialized.
 *
 * @returns true if setupSnowForm has been called
 */
export function isSnowFormSetup(): boolean {
  return isSetup;
}

// =============================================================================
// Re-exports
// =============================================================================

// Component registry
export {
  registerComponent,
  registerComponents,
  registerSubmitButton,
  getRegisteredComponent,
  getRegisteredSubmitButton,
  hasRegisteredComponent,
  getRegisteredTypes,
  clearRegistry,
  DefaultSubmitButton,
};

// Translation registry
export {
  setTranslationFunction,
  setTranslations,
  getT,
  getTranslationKeys,
  resetTranslationRegistry,
  type TranslationFunction,
};

// Behavior registry
export {
  setOnErrorBehavior,
  executeOnErrorBehavior,
  resetBehaviorRegistry,
  type OnErrorBehavior,
};
