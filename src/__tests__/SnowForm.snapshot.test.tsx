import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { SnowForm } from '../SnowForm';
import { resetBehaviorRegistry } from '../registry/behaviorRegistry';
import { clearRegistry } from '../registry/componentRegistry';
import { resetTranslationRegistry } from '../registry/translationRegistry';

// =============================================================================
// Test Setup
// =============================================================================

beforeEach(() => {
  clearRegistry();
  resetTranslationRegistry();
  resetBehaviorRegistry();
});

// =============================================================================
// HTML Snapshot Tests
// =============================================================================

describe('SnowForm HTML Snapshot', () => {
  it('should render form with correct HTML structure', () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      age: z.number(),
      bio: z.string().optional(),
      role: z.enum(['admin', 'user']),
      active: z.boolean(),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        overrides={{
          name: { label: 'Name' },
          email: { label: 'Email', type: 'email' },
          age: { label: 'Age' },
          bio: { label: 'Bio', type: 'textarea' },
          role: {
            label: 'Role',
            options: [
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
            ],
          },
          active: { label: 'Active' },
        }}
      />
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render form with children pattern', () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        overrides={{
          firstName: { label: 'First Name' },
          lastName: { label: 'Last Name' },
        }}
      >
        {({ renderField, renderSubmitButton }) => (
          <div className="grid grid-cols-2 gap-4">
            {renderField('firstName')}
            {renderField('lastName')}
            {renderSubmitButton()}
          </div>
        )}
      </SnowForm>
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render form with description and placeholder', () => {
    const schema = z.object({
      email: z.string().email(),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        overrides={{
          email: {
            label: 'Email Address',
            description: 'We will never share your email.',
            placeholder: 'you@example.com',
          },
        }}
      />
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render form with hidden field', () => {
    const schema = z.object({
      visible: z.string(),
      hiddenId: z.string(),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        defaultValues={{ hiddenId: 'secret-123' }}
        overrides={{
          visible: { label: 'Visible Field' },
          hiddenId: { type: 'hidden' },
        }}
      />
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render form with radio buttons', () => {
    const schema = z.object({
      size: z.enum(['small', 'medium', 'large']),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        overrides={{
          size: { label: 'Size', type: 'radio' },
        }}
      />
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render form with disabled fields', () => {
    const schema = z.object({
      readOnly: z.string(),
      editable: z.string(),
    });

    const { container } = render(
      <SnowForm
        schema={schema}
        onSubmit={async () => {}}
        defaultValues={{ readOnly: 'Cannot edit' }}
        overrides={{
          readOnly: { label: 'Read Only', disabled: true },
          editable: { label: 'Editable' },
        }}
      />
    );

    expect(container.innerHTML).toMatchSnapshot();
  });
});
