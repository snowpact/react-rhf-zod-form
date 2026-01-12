import type { TranslationFn, UseTranslationHook } from '../types';

// =============================================================================
// Translation Registry
// =============================================================================

/**
 * Default translation function - returns the key as-is
 */
const defaultTranslation: TranslationFn = (key: string) => key;

/**
 * The registered translation hook
 * Default: returns a simple function that returns the key
 */
let useTranslationHook: UseTranslationHook = () => ({
  t: defaultTranslation,
});

// =============================================================================
// Registration API
// =============================================================================

/**
 * Set the translation hook to use in SnowForm.
 * Use a namespace to have field keys at root level.
 *
 * @example Using i18next with a namespace (recommended)
 * ```typescript
 * import { setTranslationHook } from '@snowpact/react-rhf-zod-form';
 * import { useTranslation } from 'react-i18next';
 *
 * // Use 'data' namespace - translations in locales/fr/data.json
 * setTranslationHook(() => {
 *   const { t } = useTranslation('data');
 *   return { t };
 * });
 *
 * // Then in data.json:
 * // { "email": "Email", "password": "Mot de passe", "common.submit": "Envoyer" }
 * ```
 *
 * @example Using next-intl
 * ```typescript
 * import { useTranslations } from 'next-intl';
 *
 * setTranslationHook(() => {
 *   const t = useTranslations('data');
 *   return { t };
 * });
 * ```
 */
export function setTranslationHook(hook: UseTranslationHook): void {
  useTranslationHook = hook;
}

/**
 * Internal hook used by SnowForm to get translations
 * Uses the registered hook or falls back to returning keys
 */
export function useSnowFormTranslation(): { t: TranslationFn } {
  return useTranslationHook();
}

// =============================================================================
// Reset (useful for testing)
// =============================================================================

/**
 * Reset translation registry to defaults (mainly for testing)
 */
export function resetTranslationRegistry(): void {
  useTranslationHook = () => ({ t: defaultTranslation });
}
