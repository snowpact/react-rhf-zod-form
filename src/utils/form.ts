import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

import type { FieldConfig, FieldType, SchemaFieldInfo } from '../types';
import { getZodFieldInfo } from './zod';

/**
 * Initialize default values based on schema types and overrides
 *
 * @param schemaShape - The schema shape (field definitions)
 * @param providedValues - User-provided default values
 * @param overrides - Field configuration overrides
 * @returns Default values for the form
 */
export function initializeDefaultValues<T extends FieldValues>(
  schemaShape: Record<string, z.ZodTypeAny>,
  providedValues: Partial<T> = {},
  overrides: Partial<Record<string, FieldConfig>> = {}
): DefaultValues<T> {
  try {
    const defaultValues = Object.entries(schemaShape).reduce(
      (acc, [key, field]) => {
        const fieldInfo = getZodFieldInfo(field);
        const override = overrides[key];

        // Check if a provided value exists for this field
        if (providedValues[key as keyof T] !== undefined) {
          acc[key] = providedValues[key as keyof T];
          return acc;
        }

        // Initialize based on field type
        switch (fieldInfo.baseType) {
          case 'string':
            if (override?.emptyAsNull) acc[key] = null;
            else if (override?.emptyAsUndefined) acc[key] = undefined;
            else acc[key] = '';
            break;
          case 'number':
            if (override?.emptyAsZero) acc[key] = 0;
            else if (override?.emptyAsNull) acc[key] = null;
            else if (override?.emptyAsUndefined) acc[key] = undefined;
            else acc[key] = null;
            break;
          case 'boolean':
            acc[key] = false;
            break;
          case 'date':
            acc[key] = null;
            break;
          case 'enum':
            acc[key] = undefined;
            break;
          default:
            acc[key] = undefined;
        }

        return acc;
      },
      {} as Record<string, unknown>
    );

    return { ...defaultValues, ...providedValues } as DefaultValues<T>;
  } catch (error) {
    console.error('[SnowForm] Error initializing default values:', error);
    return {} as DefaultValues<T>;
  }
}

/**
 * Apply empty value overrides before submission
 * Transforms empty strings to null/undefined/0 based on field config
 *
 * @param values - The form values to transform
 * @param overrides - Field configuration overrides
 * @returns Transformed values
 */
export function applyEmptyValueOverrides<T extends FieldValues>(
  values: T,
  overrides: Partial<Record<string, FieldConfig>>
): T {
  const transformed = { ...values };

  for (const key of Object.keys(transformed)) {
    const override = overrides[key];
    if (!override) continue;

    const value = transformed[key];
    const isEmptyString = value === '' || (typeof value === 'string' && value.trim() === '');

    if (override.emptyAsNull && isEmptyString) {
      transformed[key as keyof T] = null as T[keyof T];
    } else if (override.emptyAsUndefined && isEmptyString) {
      transformed[key as keyof T] = undefined as T[keyof T];
    } else if (override.emptyAsZero && (value === null || value === undefined || isEmptyString)) {
      transformed[key as keyof T] = 0 as T[keyof T];
    }
  }

  return transformed;
}

/**
 * Determine the field type based on schema info and override.
 * Override type takes priority, otherwise auto-detect from schema.
 */
export function resolveFieldType(fieldInfo: SchemaFieldInfo, override?: FieldConfig): FieldType {
  if (override?.type) {
    return override.type;
  }

  switch (fieldInfo.baseType) {
    case 'string':
      return fieldInfo.isEmail ? 'email' : 'text';
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'date':
      return 'date';
    case 'enum':
      return 'select';
    default:
      return 'text';
  }
}
