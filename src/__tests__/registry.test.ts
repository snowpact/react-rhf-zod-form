import type { FieldErrors } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { executeOnErrorBehavior, resetBehaviorRegistry, setOnErrorBehavior } from '../registry/behaviorRegistry';
import { getFormUIStyles, registerFormUIStyles, resetFormUIRegistry } from '../registry/formUIRegistry';
import {
  clearRegistry,
  getRegisteredComponent,
  getRegisteredSubmitButton,
  registerComponent,
  registerSubmitButton,
} from '../registry/componentRegistry';
import { resetTranslationRegistry, setTranslationHook, useSnowFormTranslation } from '../registry/translationRegistry';

// =============================================================================
// Behavior Registry Tests
// =============================================================================

describe('behaviorRegistry', () => {
  beforeEach(() => {
    resetBehaviorRegistry();
  });

  it('should execute registered error behavior', () => {
    const callback = vi.fn();
    setOnErrorBehavior(callback);

    const mockFormRef = document.createElement('form');
    const mockErrors: FieldErrors = { name: { type: 'required', message: 'Required' } };

    executeOnErrorBehavior(mockFormRef, mockErrors);

    expect(callback).toHaveBeenCalledWith(mockFormRef, mockErrors);
  });

  it('should not throw when no behavior is registered', () => {
    expect(() => {
      executeOnErrorBehavior(null, {});
    }).not.toThrow();
  });

  it('should reset behavior registry', () => {
    const callback = vi.fn();
    setOnErrorBehavior(callback);
    resetBehaviorRegistry();

    executeOnErrorBehavior(null, {});

    expect(callback).not.toHaveBeenCalled();
  });
});

// =============================================================================
// Form UI Registry Tests
// =============================================================================

describe('formUIRegistry', () => {
  beforeEach(() => {
    resetFormUIRegistry();
  });

  it('should register and retrieve form UI styles', () => {
    registerFormUIStyles({
      form: 'form-class',
      formItem: 'form-item-class',
      formLabel: 'label-class',
    });

    const styles = getFormUIStyles();

    expect(styles.form).toBe('form-class');
    expect(styles.formItem).toBe('form-item-class');
    expect(styles.formLabel).toBe('label-class');
  });

  it('should merge styles when registering multiple times', () => {
    registerFormUIStyles({ form: 'form-1', formItem: 'item-1' });
    registerFormUIStyles({ form: 'form-2', formLabel: 'label-2' });

    const styles = getFormUIStyles();

    expect(styles.form).toBe('form-2'); // Overwritten
    expect(styles.formItem).toBe('item-1'); // Kept
    expect(styles.formLabel).toBe('label-2'); // Added
  });

  it('should return empty object when no styles registered', () => {
    const styles = getFormUIStyles();
    expect(styles).toEqual({});
  });

  it('should reset styles', () => {
    registerFormUIStyles({ form: 'some-class' });
    resetFormUIRegistry();

    const styles = getFormUIStyles();
    expect(styles).toEqual({});
  });
});

// =============================================================================
// Component Registry Tests
// =============================================================================

describe('componentRegistry', () => {
  beforeEach(() => {
    clearRegistry();
  });

  it('should register and retrieve component', () => {
    const MockComponent = () => null;
    registerComponent('text', MockComponent);

    const retrieved = getRegisteredComponent('text');
    expect(retrieved).toBe(MockComponent);
  });

  it('should return undefined for unregistered component', () => {
    const retrieved = getRegisteredComponent('unknown-type');
    expect(retrieved).toBeUndefined();
  });

  it('should register and retrieve submit button', () => {
    const MockButton = () => null;
    registerSubmitButton(MockButton);

    const retrieved = getRegisteredSubmitButton();
    expect(retrieved).toBe(MockButton);
  });

  it('should return undefined when no submit button registered', () => {
    const retrieved = getRegisteredSubmitButton();
    expect(retrieved).toBeUndefined();
  });

  it('should clear all registered components', () => {
    const MockComponent = () => null;
    const MockButton = () => null;

    registerComponent('text', MockComponent);
    registerSubmitButton(MockButton);

    clearRegistry();

    expect(getRegisteredComponent('text')).toBeUndefined();
    expect(getRegisteredSubmitButton()).toBeUndefined();
  });
});

// =============================================================================
// Translation Registry Tests
// =============================================================================

describe('translationRegistry', () => {
  beforeEach(() => {
    resetTranslationRegistry();
  });

  it('should use registered translation hook', () => {
    const mockT = vi.fn((key: string) => `translated_${key}`);
    setTranslationHook(() => ({ t: mockT }));

    const { t } = useSnowFormTranslation();
    const result = t('email');

    expect(result).toBe('translated_email');
    expect(mockT).toHaveBeenCalledWith('email');
  });

  it('should use default translation (return key as-is) when no hook registered', () => {
    const { t } = useSnowFormTranslation();

    expect(t('email')).toBe('email');
    expect(t('firstName')).toBe('firstName');
    expect(t('submit')).toBe('submit');
  });

  it('should reset translation registry', () => {
    const mockT = vi.fn(() => 'custom');
    setTranslationHook(() => ({ t: mockT }));
    resetTranslationRegistry();

    const { t } = useSnowFormTranslation();
    expect(t('email')).toBe('email'); // Back to default (key as-is)
  });
});
