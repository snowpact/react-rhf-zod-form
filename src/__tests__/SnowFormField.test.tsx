import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { useEffect, type ReactNode } from 'react';

import { SnowFormField } from '../SnowFormField';
import { Form, FormField } from '../FormProvider';
import { clearRegistry, registerComponent, registerFormUI } from '../registry/componentRegistry';
import { setTranslationFunction } from '../registry/translationRegistry';
import type { SchemaFieldInfo } from '../types';

// Note: Test setup (component registration) is handled in src/__tests__/setup.ts

// =============================================================================
// Test Wrapper
// =============================================================================

interface TestWrapperProps {
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
}

function TestWrapper({ children, defaultValues = { testField: '' } }: TestWrapperProps) {
  const form = useForm({ defaultValues });
  return <Form {...form}>{children}</Form>;
}

// =============================================================================
// Helper to render SnowFormField
// =============================================================================

interface RenderFieldOptions {
  name?: string;
  fieldInfo?: SchemaFieldInfo;
  override?: Parameters<typeof SnowFormField>[0]['override'];
  defaultValue?: unknown;
  formDisabled?: boolean;
}

function renderSnowFormField(options: RenderFieldOptions = {}) {
  const {
    name = 'testField',
    fieldInfo = { baseType: 'string', isOptional: false, isEmail: false },
    override,
    defaultValue = '',
    formDisabled = false,
  } = options;

  return render(
    <TestWrapper defaultValues={{ [name]: defaultValue }}>
      <FormField
        name={name}
        render={({ field }) => (
          <SnowFormField
            name={name}
            fieldInfo={fieldInfo}
            override={override}
            field={field}
            formDisabled={formDisabled}
          />
        )}
      />
    </TestWrapper>
  );
}

// =============================================================================
// Tests
// =============================================================================

describe('SnowFormField', () => {

  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('should render text input for string field', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
      });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render email input for email field', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: true },
      });

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render number input for number field', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'number', isOptional: false, isEmail: false },
      });

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should render checkbox for boolean field', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'boolean', isOptional: false, isEmail: false },
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render select for enum field', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'enum',
          isOptional: false,
          isEmail: false,
          enumValues: ['option1', 'option2'],
        },
      });

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'option1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'option2' })).toBeInTheDocument();
    });

    it('should render date input for date field', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'date', isOptional: false, isEmail: false },
      });

      const input = screen.getByLabelText(/testField/i);
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  // ===========================================================================
  // Hidden Field
  // ===========================================================================

  describe('Hidden Field', () => {
    it('should render hidden input without label', () => {
      renderSnowFormField({
        override: { type: 'hidden' },
        defaultValue: 'secret',
      });

      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('secret');

      // Should not have label
      expect(screen.queryByText(/testField/i)).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Type Override
  // ===========================================================================

  describe('Type Override', () => {
    it('should render textarea when type is overridden', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
        override: { type: 'textarea' },
      });

      expect(screen.getByRole('textbox')).toHaveProperty('tagName', 'TEXTAREA');
    });

    it('should render password input when type is overridden', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
        override: { type: 'password' },
      });

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render radio buttons when type is overridden', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'enum',
          isOptional: false,
          isEmail: false,
          enumValues: ['a', 'b', 'c'],
        },
        override: { type: 'radio' },
      });

      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });
  });

  // ===========================================================================
  // Labels and Description
  // ===========================================================================

  describe('Labels and Description', () => {
    it('should use field name as default label', () => {
      renderSnowFormField({ name: 'email' });

      expect(screen.getByText('email')).toBeInTheDocument();
    });

    it('should use override label when provided', () => {
      renderSnowFormField({
        override: { label: 'Custom Label' },
      });

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should use translation when function is set', () => {
      setTranslationFunction((key: string) => `translated_${key}`);

      renderSnowFormField({ name: 'username' });

      expect(screen.getByText('translated_username')).toBeInTheDocument();
    });

    it('should show description when provided', () => {
      renderSnowFormField({
        override: { description: 'This is help text' },
      });

      expect(screen.getByText('This is help text')).toBeInTheDocument();
    });

    it('should show asterisk for required fields', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
      });

      const label = screen.getByText('testField');
      expect(label.textContent).toContain('*');
    });

    it('should not show asterisk for optional fields', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: true, isEmail: false },
      });

      const label = screen.getByText('testField');
      expect(label.textContent).not.toContain('*');
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================

  describe('Disabled State', () => {
    it('should disable field when override.disabled is true', () => {
      renderSnowFormField({
        override: { disabled: true },
      });

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should disable field when formDisabled is true', () => {
      renderSnowFormField({
        formDisabled: true,
      });

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  // ===========================================================================
  // Placeholder
  // ===========================================================================

  describe('Placeholder', () => {
    it('should show placeholder when provided', () => {
      renderSnowFormField({
        override: { placeholder: 'Enter your name' },
      });

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Custom Options
  // ===========================================================================

  describe('Custom Options', () => {
    it('should use override options for select', () => {
      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
        override: {
          type: 'select',
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Germany', value: 'DE' },
          ],
        },
      });

      expect(screen.getByRole('option', { name: 'France' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Custom Render
  // ===========================================================================

  describe('Custom Render', () => {
    it('should use custom render function when provided', () => {
      renderSnowFormField({
        override: {
          render: ({ value, onChange }) => (
            <div data-testid="custom-component">
              <span>Value: {String(value)}</span>
              <button onClick={() => onChange('clicked')}>Click</button>
            </div>
          ),
        },
        defaultValue: 'initial',
      });

      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
      expect(screen.getByText('Value: initial')).toBeInTheDocument();
    });

    it('should pass error to custom render function', () => {
      function FormWithError() {
        const form = useForm({ defaultValues: { testField: '' } });

        useEffect(() => {
          form.setError('testField', { message: 'Custom error' });
        }, [form]);

        return (
          <Form {...form}>
            <FormField
              name="testField"
              render={({ field }) => (
                <SnowFormField
                  name="testField"
                  fieldInfo={{ baseType: 'string', isOptional: false, isEmail: false }}
                  override={{
                    render: ({ error }) => <div data-testid="custom-error">Error: {error}</div>,
                  }}
                  field={field}
                />
              )}
            />
          </Form>
        );
      }

      render(<FormWithError />);

      expect(screen.getByTestId('custom-error')).toHaveTextContent('Error: Custom error');
    });
  });

  // ===========================================================================
  // Registered Components
  // ===========================================================================

  describe('Registered Components', () => {
    it('should use registered component over default', () => {
      const CustomInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <input data-testid="registered-input" value={value ?? ''} onChange={e => onChange(e.target.value)} />
      );

      registerComponent('text', CustomInput);

      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
      });

      expect(screen.getByTestId('registered-input')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Empty Value Transformations
  // ===========================================================================

  describe('Empty Value Transformations', () => {
    it('should transform empty string to null with emptyAsNull', async () => {
      const user = userEvent.setup();
      let capturedValue: unknown;

      function CaptureForm() {
        const form = useForm({ defaultValues: { testField: 'initial' } });

        return (
          <Form {...form}>
            <FormField
              name="testField"
              render={({ field }) => {
                capturedValue = field.value;
                return (
                  <SnowFormField
                    name="testField"
                    fieldInfo={{ baseType: 'string', isOptional: true, isEmail: false }}
                    override={{ emptyAsNull: true }}
                    field={field}
                  />
                );
              }}
            />
          </Form>
        );
      }

      render(<CaptureForm />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(capturedValue).toBeNull();
    });

    it('should transform empty to 0 with emptyAsZero', async () => {
      const user = userEvent.setup();
      let capturedValue: unknown;

      function CaptureForm() {
        const form = useForm({ defaultValues: { testField: 5 } });

        return (
          <Form {...form}>
            <FormField
              name="testField"
              render={({ field }) => {
                capturedValue = field.value;
                return (
                  <SnowFormField
                    name="testField"
                    fieldInfo={{ baseType: 'number', isOptional: false, isEmail: false }}
                    override={{ emptyAsZero: true }}
                    field={field}
                  />
                );
              }}
            />
          </Form>
        );
      }

      render(<CaptureForm />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);

      expect(capturedValue).toBe(0);
    });
  });

  // ===========================================================================
  // Unknown Type Warning
  // ===========================================================================

  describe('Unknown Type', () => {
    it('should warn and return null for custom type without registered component', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
        // Force a custom type that doesn't exist
        override: { type: 'custom-nonexistent-type' as 'text' },
      });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No component registered for type'));

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Array Fields
  // ===========================================================================

  describe('Array Fields', () => {
    it('should render array field with input', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
        },
        defaultValue: [],
      });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render chips with remove buttons for existing items', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
        },
        defaultValue: ['tag1', 'tag2'],
      });

      // Only one input for adding new items
      expect(screen.getAllByRole('textbox')).toHaveLength(1);

      // Chips are clickable buttons with the value
      const chip1 = screen.getByRole('button', { name: /remove tag1/i });
      const chip2 = screen.getByRole('button', { name: /remove tag2/i });
      expect(chip1).toBeInTheDocument();
      expect(chip2).toBeInTheDocument();
    });

    it('should add new item when pressing Enter', async () => {
      const user = userEvent.setup();
      let capturedValue: unknown;

      function CaptureForm() {
        const form = useForm({ defaultValues: { testField: ['existing'] } });

        return (
          <Form {...form}>
            <FormField
              name="testField"
              render={({ field }) => {
                capturedValue = field.value;
                return (
                  <SnowFormField
                    name="testField"
                    fieldInfo={{
                      baseType: 'array',
                      isOptional: true,
                      isEmail: false,
                      arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
                    }}
                    field={field}
                  />
                );
              }}
            />
          </Form>
        );
      }

      render(<CaptureForm />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'new item{Enter}');

      expect(capturedValue).toEqual(['existing', 'new item']);
    });

    it('should remove item when clicking remove button', async () => {
      const user = userEvent.setup();
      let capturedValue: unknown;

      function CaptureForm() {
        const form = useForm({ defaultValues: { testField: ['first', 'second'] } });

        return (
          <Form {...form}>
            <FormField
              name="testField"
              render={({ field }) => {
                capturedValue = field.value;
                return (
                  <SnowFormField
                    name="testField"
                    fieldInfo={{
                      baseType: 'array',
                      isOptional: true,
                      isEmail: false,
                      arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
                    }}
                    field={field}
                  />
                );
              }}
            />
          </Form>
        );
      }

      render(<CaptureForm />);

      const chip = screen.getByRole('button', { name: /remove first/i });
      await user.click(chip);

      expect(capturedValue).toEqual(['second']);
    });

    it('should render array of numbers with number input and chips', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'number', isOptional: false, isEmail: false },
        },
        defaultValue: [1, 2, 3],
      });

      // Only one number input for adding new items
      expect(screen.getAllByRole('spinbutton')).toHaveLength(1);

      // Chips are clickable buttons
      expect(screen.getByRole('button', { name: /remove 1/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove 2/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove 3/i })).toBeInTheDocument();
    });

    it('should render array of enums with select inputs', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: {
            baseType: 'enum',
            isOptional: false,
            isEmail: false,
            enumValues: ['option1', 'option2'],
          },
        },
        defaultValue: ['option1'],
      });

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should use custom render and bypass array logic', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
        },
        override: {
          render: ({ value }) => (
            <div data-testid="custom-array-render">
              Custom: {JSON.stringify(value)}
            </div>
          ),
        },
        defaultValue: ['a', 'b'],
      });

      expect(screen.getByTestId('custom-array-render')).toBeInTheDocument();
      expect(screen.getByText('Custom: ["a","b"]')).toBeInTheDocument();
    });

    it('should show description for array fields', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
        },
        override: { description: 'Add your tags here' },
        defaultValue: [],
      });

      expect(screen.getByText('Add your tags here')).toBeInTheDocument();
    });

    it('should disable inputs and buttons when disabled', () => {
      renderSnowFormField({
        fieldInfo: {
          baseType: 'array',
          isOptional: true,
          isEmail: false,
          arrayElementInfo: { baseType: 'string', isOptional: false, isEmail: false },
        },
        override: { disabled: true },
        defaultValue: ['item1'],
      });

      expect(screen.getByRole('textbox')).toBeDisabled();

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  // ===========================================================================
  // Partial Registration (user only registers some components)
  // ===========================================================================

  describe('Partial Component Registration', () => {
    it('should not crash when user registers partial components and uses unregistered type', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Clear the registry to simulate a user who only registers some components
      clearRegistry();

      // User only registered 'text', not 'color'
      registerComponent('text', ({ value, onChange }) => (
        <input value={String(value ?? '')} onChange={e => onChange(e.target.value)} data-testid="custom-text" />
      ));

      // Register formUI so labels work
      registerFormUI({
        label: ({ children, htmlFor }) => <label htmlFor={htmlFor}>{children}</label>,
        description: ({ children }) => <p>{children}</p>,
        errorMessage: ({ message }) => <p role="alert">{message}</p>,
      });

      // Try to render a 'color' field - should warn but not crash
      const { container } = renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
        override: { type: 'color' },
      });

      // Should have warned about missing component
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No component registered for type "color"')
      );

      // Should not have rendered the field (returns null)
      expect(container.querySelector('input[type="color"]')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should render correctly when registered component exists', () => {
      // Register a custom text component
      registerComponent('text', ({ value, onChange, name }) => (
        <input
          id={name}
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value)}
          data-testid="my-custom-input"
        />
      ));

      renderSnowFormField({
        fieldInfo: { baseType: 'string', isOptional: false, isEmail: false },
      });

      // Should render the custom component
      expect(screen.getByTestId('my-custom-input')).toBeInTheDocument();
    });
  });
});
