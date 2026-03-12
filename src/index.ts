// Main component
export { DynamicForm } from './components/DynamicForm/DynamicForm'
export type { DynamicFormProps } from './components/DynamicForm/DynamicForm'

// Schema validation
export { validateSchema } from './utils/schemaValidator'
export type { ValidationResult } from './utils/schemaValidator'

// Field type registry
export { SUPPORTED_FIELD_TYPES, isValidFieldType } from './utils/fieldTypeRegistry'

// TypeScript types
export type {
  FormSchema,
  FormField,
  FieldType,
  FieldConfig,
  BaseFieldConfig,
  SelectOption,
  TextFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  TextAreaFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
} from './types/schema.types'
