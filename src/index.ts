// =============================================================================
// Main Component
// =============================================================================

export { SnowForm } from './SnowForm';

// =============================================================================
// Setup Function (Primary API)
// =============================================================================

export {
  setupSnowForm,
  resetSnowForm,
  isSnowFormSetup,
  type SetupSnowFormOptions,
  type SnowFormTranslationKeys,
} from './registry';

// =============================================================================
// Individual Registry Functions (Advanced Usage)
// =============================================================================

export {
  // Components
  registerComponents,
  registerComponent,
  registerSubmitButton,
  // Translation
  setTranslationFunction,
  setTranslations,
  getT,
  // Behavior
  setOnErrorBehavior,
} from './registry';

// =============================================================================
// Utilities
// =============================================================================

export { normalizeDateToISO } from './utils';

// =============================================================================
// Types
// =============================================================================

export type {
  // Main component types
  SnowFormProps,
  SnowFormHelpers,
  // Component types
  RegisteredComponentProps,
  SubmitButtonProps,
  // Field configuration
  FieldConfig,
  FieldOverride,
  FieldOption,
  FieldType,
  // Schema types
  SchemaFieldInfo,
  ZodObjectOrEffects,
  // Component registration
  RegisterableComponent,
  RegisteredComponent,
  RegisteredSubmitButton,
  // Config types
  SnowFormConfig,
} from './types';

export type { OnErrorBehavior, TranslationFunction } from './registry';
