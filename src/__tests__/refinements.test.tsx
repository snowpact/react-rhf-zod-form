import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { SnowForm } from '../SnowForm';
import { resetBehaviorRegistry } from '../registry/behaviorRegistry';
import { clearRegistry } from '../registry/componentRegistry';
import { resetFormUIRegistry } from '../registry/formUIRegistry';
import { resetTranslationRegistry } from '../registry/translationRegistry';

// =============================================================================
// Test Setup
// =============================================================================

beforeEach(() => {
  clearRegistry();
  resetTranslationRegistry();
  resetBehaviorRegistry();
  resetFormUIRegistry();
  vi.clearAllMocks();
});

// =============================================================================
// Zod refine/superRefine Tests
// =============================================================================

describe('SnowForm with Zod Refinements', () => {
  describe('Schema with .refine()', () => {
    it('should render form with schema using refine', () => {
      const schema = z
        .object({
          password: z.string().min(8, 'Password must be at least 8 characters'),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        });

      render(<SnowForm schema={schema} />);

      expect(screen.getByTestId('auto-form-input-password')).toBeInTheDocument();
      expect(screen.getByTestId('auto-form-input-confirmPassword')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should validate using refine and show cross-field error', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      const schema = z
        .object({
          password: z.string().min(8, 'Password must be at least 8 characters'),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Fill passwords that don't match
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'differentpassword');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show refine error
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/don't match/i);
      });

      // Should not have called onSubmit
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should pass validation when refine condition is met', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});

      const schema = z
        .object({
          password: z.string().min(8, 'Password must be at least 8 characters'),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Fill matching passwords
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password123');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should call onSubmit
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          password: 'password123',
          confirmPassword: 'password123',
        });
      });
    });
  });

  describe('Schema with .superRefine()', () => {
    it('should render form with schema using superRefine', () => {
      const schema = z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.startDate && data.endDate && data.startDate > data.endDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End date must be after start date',
              path: ['endDate'],
            });
          }
        });

      render(<SnowForm schema={schema} />);

      expect(screen.getByLabelText(/startDate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/endDate/i)).toBeInTheDocument();
    });

    it('should validate using superRefine and show error', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      const schema = z
        .object({
          startDate: z.string().min(1, 'Start date is required'),
          endDate: z.string().min(1, 'End date is required'),
        })
        .superRefine((data, ctx) => {
          if (data.startDate && data.endDate && data.startDate > data.endDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End date must be after start date',
              path: ['endDate'],
            });
          }
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Fill dates where start > end
      await user.type(screen.getByLabelText(/startDate/i), '2024-12-31');
      await user.type(screen.getByLabelText(/endDate/i), '2024-01-01');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show superRefine error
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/after start date/i);
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should pass validation when superRefine condition is met', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});

      const schema = z
        .object({
          startDate: z.string().min(1, 'Start date is required'),
          endDate: z.string().min(1, 'End date is required'),
        })
        .superRefine((data, ctx) => {
          if (data.startDate && data.endDate && data.startDate > data.endDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End date must be after start date',
              path: ['endDate'],
            });
          }
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Fill valid dates
      await user.type(screen.getByLabelText(/startDate/i), '2024-01-01');
      await user.type(screen.getByLabelText(/endDate/i), '2024-12-31');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        });
      });
    });

    it('should handle multiple issues from superRefine', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      const schema = z
        .object({
          min: z.string(),
          max: z.string(),
        })
        .superRefine((data, ctx) => {
          const minNum = Number(data.min);
          const maxNum = Number(data.max);

          if (isNaN(minNum)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Min must be a number',
              path: ['min'],
            });
          }

          if (isNaN(maxNum)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Max must be a number',
              path: ['max'],
            });
          }

          if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Min must be less than max',
              path: ['min'],
            });
          }
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Fill invalid values
      await user.type(screen.getByLabelText(/min/i), 'abc');
      await user.type(screen.getByLabelText(/max/i), 'xyz');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show errors
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThanOrEqual(1);
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Nested refinements', () => {
    it('should handle schema with multiple chained refines', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});

      const schema = z
        .object({
          value: z.string(),
        })
        .refine(data => data.value.length >= 3, {
          message: 'Must be at least 3 characters',
          path: ['value'],
        })
        .refine(data => data.value !== 'forbidden', {
          message: 'This value is forbidden',
          path: ['value'],
        });

      render(<SnowForm schema={schema} onSubmit={onSubmit} />);

      // Test first refine - too short
      await user.type(screen.getByLabelText(/value/i), 'ab');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/at least 3 characters/i);
      });

      // Clear and test second refine - forbidden value
      await user.clear(screen.getByLabelText(/value/i));
      await user.type(screen.getByLabelText(/value/i), 'forbidden');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/forbidden/i);
      });

      // Clear and test valid value
      await user.clear(screen.getByLabelText(/value/i));
      await user.type(screen.getByLabelText(/value/i), 'allowed');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ value: 'allowed' });
      });
    });
  });

  describe('Children pattern with refinements', () => {
    it('should work with children render function and refine', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});

      const schema = z
        .object({
          email: z.string().email('Invalid email'),
          confirmEmail: z.string(),
        })
        .refine(data => data.email === data.confirmEmail, {
          message: 'Emails must match',
          path: ['confirmEmail'],
        });

      render(
        <SnowForm schema={schema} onSubmit={onSubmit}>
          {({ renderField, renderSubmitButton }) => (
            <div data-testid="custom-layout">
              {renderField('email')}
              {renderField('confirmEmail')}
              {renderSubmitButton()}
            </div>
          )}
        </SnowForm>
      );

      expect(screen.getByTestId('custom-layout')).toBeInTheDocument();

      // Fill matching emails
      await user.type(screen.getByTestId('auto-form-input-email'), 'test@example.com');
      await user.type(screen.getByTestId('auto-form-input-confirmEmail'), 'test@example.com');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          confirmEmail: 'test@example.com',
        });
      });
    });
  });

  describe('Default values with refinements', () => {
    it('should accept defaultValues with refined schema', () => {
      const schema = z
        .object({
          username: z.string(),
          nickname: z.string(),
        })
        .refine(data => data.username !== data.nickname, {
          message: 'Nickname must be different from username',
          path: ['nickname'],
        });

      render(
        <SnowForm
          schema={schema}
          defaultValues={{
            username: 'john',
            nickname: 'johnny',
          }}
        />
      );

      expect(screen.getByDisplayValue('john')).toBeInTheDocument();
      expect(screen.getByDisplayValue('johnny')).toBeInTheDocument();
    });
  });
});
