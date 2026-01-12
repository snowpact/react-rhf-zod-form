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
} from './componentRegistry';

export { setTranslationHook, useSnowFormTranslation, resetTranslationRegistry } from './translationRegistry';

export { registerFormUIStyles, getFormUIStyles, resetFormUIRegistry, type FormUIStyles } from './formUIRegistry';

export {
  setOnErrorBehavior,
  executeOnErrorBehavior,
  resetBehaviorRegistry,
  type OnErrorBehavior,
} from './behaviorRegistry';
