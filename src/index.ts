// =============================================================================
// Main Component
// =============================================================================

export { SnowForm } from './SnowForm';

// =============================================================================
// Setup Functions
// =============================================================================

export { registerComponents, registerComponent, registerSubmitButton } from './registry/componentRegistry';
export { setTranslationHook } from './registry/translationRegistry';
export { setOnErrorBehavior } from './registry/behaviorRegistry';
export { registerFormUIStyles } from './registry/formUIRegistry';

// =============================================================================
// Utilities
// =============================================================================

export { normalizeDateToISO } from './utils';

// =============================================================================
// Types
// =============================================================================

export type {
  SnowFormProps,
  SnowFormHelpers,
  RegisteredComponentProps,
  SubmitButtonProps,
  FieldConfig,
  FieldOverride,
  FieldOption,
  FieldType,
  SchemaFieldInfo,
  TranslationFn,
  UseTranslationHook,
  SnowFormConfig,
  RegisterableComponent,
  RegisteredComponent,
  RegisteredSubmitButton,
} from './types';

export type { FormUIStyles, OnErrorBehavior } from './registry';
