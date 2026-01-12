import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { SchemaFieldInfo } from '../types';

// =============================================================================
// Zod Schema Analysis
// =============================================================================

/**
 * Check if a Zod schema is optional (accepts undefined, null, or empty string)
 */
function isOptional(schema: z.ZodTypeAny): boolean {
  if (schema instanceof z.ZodOptional) return true;
  if (schema instanceof z.ZodNullable) return true;

  // Handle ZodUnion - e.g., z.string().url().optional().or(z.literal(''))
  // If one option is a literal (like empty string) or optional/nullable, the field is effectively optional
  if (schema instanceof z.ZodUnion) {
    const options = schema._def.options as z.ZodTypeAny[];
    for (const option of options) {
      // If any option is a literal (like ''), the field accepts empty values -> optional
      if (option instanceof z.ZodLiteral) return true;
      // If any option is optional/nullable, recursively check
      if (isOptional(option)) return true;
    }
  }

  return false;
}

/**
 * Unwrap a Zod schema to get the underlying type (removes Optional, Nullable, Default, Effects)
 */
function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema;

  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodNullable ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodEffects
  ) {
    if ('innerType' in current._def) {
      current = current._def.innerType;
    } else if ('schema' in current._def) {
      current = current._def.schema;
    } else {
      break;
    }
  }

  // Handle ZodUnion - find the main type (not a literal)
  // This supports patterns like: z.string().url().optional().or(z.literal(''))
  if (current instanceof z.ZodUnion) {
    const options = current._def.options as z.ZodTypeAny[];
    for (const option of options) {
      const unwrapped = unwrapSchema(option);
      // Return the first non-literal type found
      if (!(unwrapped instanceof z.ZodLiteral)) {
        return unwrapped;
      }
    }
  }

  return current;
}

/**
 * Check if a ZodString has email validation
 */
function isEmailString(schema: z.ZodString): boolean {
  // Check the checks array for email validation
  return schema._def.checks?.some((check: { kind: string }) => check.kind === 'email') ?? false;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Extract the shape (fields) from a Zod schema
 */
export function getZodShape(schema: z.ZodObject<z.ZodRawShape>): Record<string, z.ZodTypeAny> {
  try {
    // Try shape() function first (for lazy schemas)
    if (typeof schema._def.shape === 'function') {
      return schema._def.shape();
    }
    // Fallback to shape property
    return schema.shape ?? {};
  } catch (error) {
    console.error('[SnowForm] Error getting schema shape:', error);
    return {};
  }
}

/**
 * Get information about a specific Zod field
 */
export function getZodFieldInfo(field: z.ZodTypeAny): SchemaFieldInfo {
  const unwrapped = unwrapSchema(field);

  // Detect base type
  let baseType: SchemaFieldInfo['baseType'] = 'unknown';
  let enumValues: string[] | undefined;
  let isEmail = false;

  if (unwrapped instanceof z.ZodString) {
    baseType = 'string';
    isEmail = isEmailString(unwrapped);
  } else if (unwrapped instanceof z.ZodNumber) {
    baseType = 'number';
  } else if (unwrapped instanceof z.ZodBoolean) {
    baseType = 'boolean';
  } else if (unwrapped instanceof z.ZodEnum) {
    baseType = 'enum';
    enumValues = unwrapped._def.values as string[];
  } else if (unwrapped instanceof z.ZodDate) {
    baseType = 'date';
  } else if (unwrapped instanceof z.ZodArray) {
    baseType = 'array';
  }

  return {
    baseType,
    isOptional: isOptional(field),
    isEmail,
    enumValues,
  };
}

/**
 * Create a resolver for react-hook-form from a Zod schema
 */
export function createZodResolver(schema: z.ZodObject<z.ZodRawShape>) {
  return zodResolver(schema);
}
