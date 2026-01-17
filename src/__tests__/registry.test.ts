import type { FieldErrors } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { executeOnErrorBehavior, resetBehaviorRegistry, setOnErrorBehavior } from '../registry/behaviorRegistry';
import {
  clearRegistry,
  getRegisteredComponent,
  getRegisteredSubmitButton,
  registerComponent,
  registerSubmitButton,
} from '../registry/componentRegistry';
import {
  getT,
  resetTranslationRegistry,
  setTranslationFunction,
  setTranslations,
} from '../registry/translationRegistry';

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

  it('should use registered translation function', () => {
    const mockT = vi.fn((key: string) => `translated_${key}`);
    setTranslationFunction(mockT);

    const t = getT();
    const result = t('email');

    expect(result).toBe('translated_email');
    expect(mockT).toHaveBeenCalledWith('email');
  });

  it('should use default translation (return key as-is) when no function registered', () => {
    const t = getT();

    expect(t('email')).toBe('email');
    expect(t('firstName')).toBe('firstName');
  });

  it('should return default translations for known keys', () => {
    const t = getT();

    expect(t('snowForm.submit')).toBe('Submit');
    expect(t('snowForm.submitting')).toBe('Submitting...');
    expect(t('snowForm.required')).toBe('Required');
    expect(t('snowForm.selectPlaceholder')).toBe('Select...');
  });

  it('should allow setting custom translations', () => {
    setTranslations({
      'snowForm.submit': 'Envoyer',
      'snowForm.submitting': 'Envoi en cours...',
    });

    const t = getT();

    expect(t('snowForm.submit')).toBe('Envoyer');
    expect(t('snowForm.submitting')).toBe('Envoi en cours...');
    // Other defaults should remain
    expect(t('snowForm.required')).toBe('Required');
  });

  it('should reset translation registry', () => {
    setTranslations({ 'snowForm.submit': 'Custom' });
    resetTranslationRegistry();

    const t = getT();
    expect(t('snowForm.submit')).toBe('Submit'); // Back to default
  });

  it('should prefer custom translation function over defaults', () => {
    setTranslationFunction((key: string) => {
      if (key === 'snowForm.submit') return 'Send';
      return key;
    });

    const t = getT();
    expect(t('snowForm.submit')).toBe('Send');
  });

  it('should fallback to defaults when custom function returns the key unchanged', () => {
    setTranslationFunction((key: string) => key);

    const t = getT();
    expect(t('snowForm.submit')).toBe('Submit'); // Falls back to default
  });
});
