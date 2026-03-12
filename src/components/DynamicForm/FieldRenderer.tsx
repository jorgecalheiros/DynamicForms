import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { FormField } from '../../types/schema.types'
import { TextField } from '../fields/TextField'
import { NumberField } from '../fields/NumberField'
import { SelectField } from '../fields/SelectField'
import { TextAreaField } from '../fields/TextAreaField'
import { CheckboxField } from '../fields/CheckboxField'
import { RadioField } from '../fields/RadioField'
import { DateField } from '../fields/DateField'
import type {
  TextFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  TextAreaFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
} from '../../types/schema.types'

interface FieldRendererProps {
  field: FormField
  register: UseFormRegister<Record<string, unknown>>
  errors: FieldErrors<Record<string, unknown>>
}

export function FieldRenderer({ field, register, errors }: FieldRendererProps) {
  const error = errors[field.key]
  const commonProps = {
    fieldKey: field.key,
    label: field.label,
    register,
  }

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...commonProps}
          config={field.config as TextFieldConfig}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'number':
      return (
        <NumberField
          {...commonProps}
          config={field.config as NumberFieldConfig}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'select':
      return (
        <SelectField
          {...commonProps}
          config={field.config as SelectFieldConfig}
          options={field.options ?? []}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'textarea':
      return (
        <TextAreaField
          {...commonProps}
          config={field.config as TextAreaFieldConfig}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'checkbox':
      return (
        <CheckboxField
          {...commonProps}
          config={field.config as CheckboxFieldConfig}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'radio':
      return (
        <RadioField
          {...commonProps}
          config={field.config as RadioFieldConfig}
          options={field.options ?? []}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    case 'date':
      return (
        <DateField
          {...commonProps}
          config={field.config as DateFieldConfig}
          error={error as import('react-hook-form').FieldError | undefined}
        />
      )
    default:
      return (
        <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
          Campo não suportado: {field.type}
        </div>
      )
  }
}
