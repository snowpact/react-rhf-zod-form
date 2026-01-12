import type React from 'react';

import type {
  FieldType,
  RegisterableComponent,
  RegisteredComponent,
  RegisteredSubmitButton,
  SubmitButtonProps,
} from '../types';

// =============================================================================
// Component Registry
// =============================================================================

/**
 * Registry of components by type
 * Keys are field types (built-in or custom), values are React components
 */
const componentRegistry = new Map<string, RegisteredComponent>();

/**
 * The submit button component (can be customized)
 */
let submitButtonComponent: RegisteredSubmitButton | null = null;

// =============================================================================
// Registration API
// =============================================================================

/**
 * Register a single component for a field type.
 * The type must be declared in SnowFormCustomTypes for custom types.
 *
 * @example
 * ```typescript
 * import { registerComponent } from '@snowpact/react-rhf-zod-form';
 * import { MyCustomInput } from './MyCustomInput';
 *
 * registerComponent('text', MyCustomInput);
 * registerComponent('rich-text', MyRichTextEditor); // Must be declared in SnowFormCustomTypes
 * ```
 */
export function registerComponent<TValue = unknown>(type: FieldType, component: RegisteredComponent<TValue>): void {
  componentRegistry.set(type, component as RegisteredComponent);
}

/**
 * Register multiple components at once.
 * All types must be declared in SnowFormCustomTypes for custom types.
 *
 * @example
 * ```typescript
 * import { registerComponents } from '@snowpact/react-rhf-zod-form';
 *
 * registerComponents({
 *   text: MyInput,
 *   textarea: MyTextarea,
 *   select: MySelect,
 *   switch: MySwitch,
 *   number: MyNumberInput,
 *   date: MyDatePicker,
 *   'rich-text': MyRichTextEditor, // Must be declared in SnowFormCustomTypes
 * });
 * ```
 */
export function registerComponents(components: Partial<Record<FieldType, RegisterableComponent>>): void {
  for (const [type, component] of Object.entries(components)) {
    if (component) {
      componentRegistry.set(type, component);
    }
  }
}

/**
 * Register a custom submit button component
 *
 * @example
 * ```typescript
 * registerSubmitButton(({ loading, disabled, children, className }) => (
 *   <Button type="submit" disabled={disabled || loading} className={className}>
 *     {loading ? <Spinner /> : children}
 *   </Button>
 * ));
 * ```
 */
export function registerSubmitButton(component: RegisteredSubmitButton): void {
  submitButtonComponent = component;
}

// =============================================================================
// Getters
// =============================================================================

/**
 * Get a registered component by type
 * Returns undefined if not registered
 */
export function getRegisteredComponent(type: string): RegisteredComponent | undefined {
  return componentRegistry.get(type);
}

/**
 * Get the registered submit button component
 * Returns undefined if not registered (will use default)
 */
export function getRegisteredSubmitButton(): RegisteredSubmitButton | undefined {
  return submitButtonComponent ?? undefined;
}

/**
 * Check if a component type is registered
 */
export function hasRegisteredComponent(type: string): boolean {
  return componentRegistry.has(type);
}

/**
 * Get all registered component types
 */
export function getRegisteredTypes(): string[] {
  return Array.from(componentRegistry.keys());
}

// =============================================================================
// Reset (useful for testing)
// =============================================================================

/**
 * Clear all registered components (mainly for testing)
 */
export function clearRegistry(): void {
  componentRegistry.clear();
  submitButtonComponent = null;
}

// =============================================================================
// Default Submit Button
// =============================================================================

/**
 * Default submit button used when none is registered
 */
export function DefaultSubmitButton({ loading, disabled, children, className }: SubmitButtonProps): React.ReactElement {
  return (
    <button type="submit" disabled={disabled || loading} className={className}>
      {loading ? 'Loading...' : (children ?? 'Submit')}
    </button>
  );
}
