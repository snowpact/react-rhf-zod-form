import { FieldWrapper } from './FieldWrapper';
import { FormControl } from './FormProvider';
import { getRegisteredComponent } from './registry/componentRegistry';
import { getArrayContainerClass, getArrayItemClass, getButtonClass } from './registry/stylesRegistry';
import type { FieldConfig, SchemaFieldInfo } from './types';
import { resolveFieldType } from './utils';

interface ArrayFieldRendererProps {
  name: string;
  label: string;
  isRequired: boolean;
  isDisabled?: boolean;
  arrayElementInfo: SchemaFieldInfo;
  override?: FieldConfig;
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
  };
  styles?: {
    fieldWrapper?: string;
    label?: string;
    input?: string;
    error?: string;
    description?: string;
  };
}

export function ArrayFieldRenderer({
  name,
  label,
  isRequired,
  isDisabled,
  arrayElementInfo,
  override,
  field,
  styles,
}: ArrayFieldRendererProps): React.ReactElement | null {
  const arrayValue: unknown[] = Array.isArray(field.value) ? field.value : [];
  const elementType = resolveFieldType(arrayElementInfo, override);
  const ElementComponent = getRegisteredComponent(elementType);

  if (!ElementComponent) {
    console.warn(
      `[SnowForm] No component registered for array element type "${elementType}". ` +
        `Register it via setupSnowForm({ components: { ${elementType}: YourComponent } }).`
    );
    return null;
  }

  const elementOptions = arrayElementInfo.enumValues?.map(v => ({ label: v, value: v }));

  const getDefaultValue = () => {
    switch (arrayElementInfo.baseType) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'enum':
        return arrayElementInfo.enumValues?.[0] ?? '';
      default:
        return '';
    }
  };

  return (
    <FieldWrapper
      label={label}
      isRequired={isRequired}
      description={override?.description}
      styles={styles}
    >
      <div className={getArrayContainerClass()}>
        {arrayValue.map((item, index) => (
          <div key={index} className={getArrayItemClass()}>
            <FormControl>
              <ElementComponent
                value={item}
                onChange={(newVal: unknown) => {
                  const newArray = [...arrayValue];
                  newArray[index] = newVal;
                  field.onChange(newArray);
                }}
                onBlur={field.onBlur}
                name={`${name}.${index}`}
                disabled={isDisabled}
                placeholder={override?.placeholder}
                options={override?.options ?? elementOptions}
                className={styles?.input}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => field.onChange(arrayValue.filter((_, i) => i !== index))}
              className={getButtonClass()}
              disabled={isDisabled}
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => field.onChange([...arrayValue, getDefaultValue()])}
          className={getButtonClass()}
          disabled={isDisabled}
          aria-label="Add item"
        >
          +
        </button>
      </div>
    </FieldWrapper>
  );
}
