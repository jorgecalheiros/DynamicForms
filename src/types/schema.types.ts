// Base config shared across field types
export interface BaseFieldConfig {
  required?: boolean
  placeholder?: string
}

export interface TextFieldConfig extends BaseFieldConfig {
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface NumberFieldConfig extends BaseFieldConfig {
  min?: number
  max?: number
  step?: number
}

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldConfig extends BaseFieldConfig {
  multiple?: boolean
}

export interface TextAreaFieldConfig extends BaseFieldConfig {
  minLength?: number
  maxLength?: number
  rows?: number
}

export interface CheckboxFieldConfig {
  required?: boolean
}

export interface RadioFieldConfig {
  required?: boolean
}

export interface DateFieldConfig {
  required?: boolean
  min?: string
  max?: string
}

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date'

export type FormType = 'default' | 'repeater'

export interface RepeaterConfig {
  minEntries?: number
  maxEntries?: number
  addButtonText?: string
  itemLabel?: string
  allowReorder?: boolean
  confirmDelete?: boolean
  showCounter?: boolean
}

export interface RepeaterEntry {
  id: string
  data: Record<string, unknown>
  timestamp: number
  isValid: boolean
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | TextAreaFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | DateFieldConfig

export interface FormField {
  key: string
  type: FieldType
  label: string
  order: number
  options?: SelectOption[] | null
  config: FieldConfig
}

export interface FormSchema {
  formId: string
  title: string
  description?: string
  type?: FormType
  repeaterConfig?: RepeaterConfig
  fields: FormField[]
}
