import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { useEffect, type ReactNode } from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '../FormProvider';
import { registerFormUIStyles, resetFormUIRegistry } from '../registry/formUIRegistry';

// =============================================================================
// Test Wrapper
// =============================================================================

interface TestFormProps {
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

function TestForm({ children, defaultValues = { testField: '' } }: TestFormProps) {
  const form = useForm({ defaultValues });
  return <Form {...form}>{children}</Form>;
}

// =============================================================================
// FormItem Tests
// =============================================================================

describe('FormItem', () => {
  beforeEach(() => {
    resetFormUIRegistry();
  });

  it('should render children', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <span data-testid="child">Content</span>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem className="custom-class">
              <span>Content</span>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Content').parentElement).toHaveClass('custom-class');
  });

  it('should apply registered styles', () => {
    registerFormUIStyles({ formItem: 'registered-item-class' });

    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <span>Content</span>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Content').parentElement).toHaveClass('registered-item-class');
  });
});

// =============================================================================
// FormLabel Tests
// =============================================================================

describe('FormLabel', () => {
  beforeEach(() => {
    resetFormUIRegistry();
  });

  it('should render label with htmlFor attribute', () => {
    render(
      <TestForm>
        <FormField
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>
    );

    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('should show asterisk for required fields', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>
    );

    const label = screen.getByText('Name');
    expect(label.textContent).toContain('*');
  });

  it('should not show asterisk for optional fields', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormLabel>Optional</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>
    );

    const label = screen.getByText('Optional');
    expect(label.textContent).not.toContain('*');
  });

  it('should apply custom className', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormLabel className="custom-label">Label</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Label')).toHaveClass('custom-label');
  });

  it('should apply error styles when field is invalid', () => {
    registerFormUIStyles({ formLabelError: 'error-label-class' });

    function InvalidForm() {
      const form = useForm({
        defaultValues: { testField: '' },
      });

      // Set error in useEffect to avoid infinite re-render
      useEffect(() => {
        form.setError('testField', { message: 'Error' });
      }, [form]);

      return (
        <Form {...form}>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <FormLabel>Label</FormLabel>
              </FormItem>
            )}
          />
        </Form>
      );
    }

    render(<InvalidForm />);

    expect(screen.getByText('Label')).toHaveClass('error-label-class');
  });
});

// =============================================================================
// FormDescription Tests
// =============================================================================

describe('FormDescription', () => {
  beforeEach(() => {
    resetFormUIRegistry();
  });

  it('should render description text', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormDescription>Help text here</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Help text here')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormDescription className="custom-desc">Description</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Description')).toHaveClass('custom-desc');
  });

  it('should apply registered styles', () => {
    registerFormUIStyles({ formDescription: 'registered-desc-class' });

    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormDescription>Description</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByText('Description')).toHaveClass('registered-desc-class');
  });
});

// =============================================================================
// FormMessage Tests
// =============================================================================

describe('FormMessage', () => {
  beforeEach(() => {
    resetFormUIRegistry();
  });

  it('should not render when no error', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormMessage data-testid="message" />
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render error message from field state', () => {
    function FormWithError() {
      const form = useForm({ defaultValues: { testField: '' } });

      useEffect(() => {
        form.setError('testField', { message: 'Field is required' });
      }, [form]);

      return (
        <Form {...form}>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    }

    render(<FormWithError />);

    expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
  });

  it('should render custom children as message', () => {
    function FormWithError() {
      const form = useForm({ defaultValues: { testField: '' } });
      // No error set, but we provide custom children
      return (
        <Form {...form}>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <FormMessage>Custom message</FormMessage>
              </FormItem>
            )}
          />
        </Form>
      );
    }

    render(<FormWithError />);

    expect(screen.getByRole('alert')).toHaveTextContent('Custom message');
  });

  it('should apply registered styles', () => {
    registerFormUIStyles({ formMessage: 'registered-msg-class' });

    function FormWithError() {
      const form = useForm({ defaultValues: { testField: '' } });

      useEffect(() => {
        form.setError('testField', { message: 'Error' });
      }, [form]);

      return (
        <Form {...form}>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    }

    render(<FormWithError />);

    expect(screen.getByRole('alert')).toHaveClass('registered-msg-class');
  });
});

// =============================================================================
// FormControl Tests
// =============================================================================

describe('FormControl', () => {
  it('should render children as-is', () => {
    render(
      <TestForm>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <FormControl>
                <input data-testid="input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});

// =============================================================================
// useFormField Tests
// =============================================================================

describe('useFormField', () => {
  it('should throw error when used outside FormField', () => {
    function InvalidComponent() {
      useFormField();
      return null;
    }

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <TestForm>
          <InvalidComponent />
        </TestForm>
      );
    }).toThrow('useFormField must be used within a FormField component');

    consoleSpy.mockRestore();
  });

  it('should return field context with name and id', () => {
    let fieldContext: ReturnType<typeof useFormField> | null = null;

    function FieldContextReader() {
      fieldContext = useFormField();
      return <span data-testid="reader">Read</span>;
    }

    render(
      <TestForm>
        <FormField
          name="myField"
          render={() => (
            <FormItem>
              <FieldContextReader />
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(fieldContext).not.toBeNull();
    expect(fieldContext!.name).toBe('myField');
    expect(fieldContext!.id).toBe('myField');
    expect(fieldContext!.invalid).toBe(false);
  });

  it('should return invalid=true when field has error', () => {
    let fieldContext: ReturnType<typeof useFormField> | null = null;

    function FieldContextReader() {
      fieldContext = useFormField();
      return null;
    }

    function FormWithError() {
      const form = useForm({ defaultValues: { myField: '' } });

      useEffect(() => {
        form.setError('myField', { message: 'Invalid' });
      }, [form]);

      return (
        <Form {...form}>
          <FormField
            name="myField"
            render={() => (
              <FormItem>
                <FieldContextReader />
              </FormItem>
            )}
          />
        </Form>
      );
    }

    render(<FormWithError />);

    expect(fieldContext!.invalid).toBe(true);
    expect(fieldContext!.error?.message).toBe('Invalid');
  });
});

// =============================================================================
// FormField Tests
// =============================================================================

describe('FormField', () => {
  it('should render with Controller', () => {
    render(
      <TestForm defaultValues={{ username: 'test' }}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <input data-testid="input" value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
      </TestForm>
    );

    expect(screen.getByTestId('input')).toHaveValue('test');
  });

  it('should provide field context to children', () => {
    render(
      <TestForm>
        <FormField
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email Label</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>
    );

    // FormLabel should have access to field name for htmlFor
    expect(screen.getByText('Email Label')).toHaveAttribute('for', 'email');
  });
});
