// =============================================================================
// Translation Registry
// =============================================================================

/**
 * Translation function type
 */
export type TranslationFunction = (key: string) => string;

/**
 * Default translations (English)
 */
const defaultTranslations: Record<string, string> = {
  'snowForm.submit': 'Submit',
  'snowForm.submitting': 'Submitting...',
  'snowForm.required': 'Required',
  'snowForm.selectPlaceholder': 'Select...',
};

/**
 * Custom translation function (set via setupSnowForm)
 */
let customTranslateFn: TranslationFunction | null = null;

/**
 * Translate a key using custom function or fallback to defaults
 */
const translate = (key: string): string => {
  if (customTranslateFn) {
    const result = customTranslateFn(key);
    // If custom function returns the key unchanged, try defaults
    if (result !== key) return result;
  }
  return defaultTranslations[key] ?? key;
};

// =============================================================================
// Registration API
// =============================================================================

/**
 * Set the translation function.
 * Called internally by setupSnowForm.
 *
 * @param fn - Translation function (e.g., i18next t function)
 *
 * @example
 * ```typescript
 * import { useTranslation } from 'react-i18next';
 *
 * const { t } = useTranslation('data');
 * setTranslationFunction(t);
 * ```
 */
export function setTranslationFunction(fn: TranslationFunction): void {
  customTranslateFn = fn;
}

/**
 * Set custom translations to merge with defaults.
 * Called internally by setupSnowForm.
 *
 * @param translations - Partial translations to merge
 *
 * @example
 * ```typescript
 * setTranslations({
 *   'snowForm.submit': 'Envoyer',
 *   'snowForm.submitting': 'Envoi en cours...',
 * });
 * ```
 */
export function setTranslations(translations: Partial<typeof defaultTranslations>): void {
  Object.assign(defaultTranslations, translations);
}

/**
 * Get the translate function.
 * Used internally by SnowForm components.
 *
 * @returns The translate function
 */
export function getT(): TranslationFunction {
  return translate;
}

/**
 * Get all translation keys (useful for debugging)
 *
 * @returns Array of all translation keys
 */
export function getTranslationKeys(): string[] {
  return Object.keys(defaultTranslations);
}

// =============================================================================
// Reset (useful for testing)
// =============================================================================

/**
 * Reset translation registry to defaults (mainly for testing)
 */
export function resetTranslationRegistry(): void {
  customTranslateFn = null;
  // Reset to original defaults
  Object.keys(defaultTranslations).forEach(key => {
    delete defaultTranslations[key];
  });
  Object.assign(defaultTranslations, {
    'snowForm.submit': 'Submit',
    'snowForm.submitting': 'Submitting...',
    'snowForm.required': 'Required',
    'snowForm.selectPlaceholder': 'Select...',
  });
}
