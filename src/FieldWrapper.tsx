import type { ReactNode } from 'react';

import { FormDescription, FormItem, FormLabel, FormMessage } from './FormProvider';

interface FieldWrapperProps {
  label: string;
  isRequired: boolean;
  hideLabel?: boolean;
  description?: string;
  styles?: {
    fieldWrapper?: string;
    label?: string;
    description?: string;
    error?: string;
  };
  children: ReactNode;
}

export function FieldWrapper({
  label,
  isRequired,
  hideLabel,
  description,
  styles,
  children,
}: FieldWrapperProps) {
  return (
    <FormItem className={styles?.fieldWrapper}>
      {!hideLabel && (
        <FormLabel className={styles?.label} required={isRequired}>
          {label}
        </FormLabel>
      )}
      {children}
      {description && <FormDescription className={styles?.description}>{description}</FormDescription>}
      <FormMessage className={styles?.error} />
    </FormItem>
  );
}
