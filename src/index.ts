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
  // Form UI
  registerFormUI,
  // Translation
  setTranslationFunction,
  setTranslations,
  getT,
  // Behavior
  setOnErrorBehavior,
  // Styles
  setFormStyles,
  // Default constants
  DEFAULT_FORM_UI,
  DEFAULT_SUBMIT_BUTTON,
} from './registry';

// Default components (requires CSS import)
export { DEFAULT_COMPONENTS } from './components';

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
  // Form UI types
  FormUIComponents,
  FormUILabelProps,
  FormUIDescriptionProps,
  FormUIErrorMessageProps,
  // Config types
  SnowFormConfig,
} from './types';

export type { OnErrorBehavior, TranslationFunction, FormStyles } from './registry';
