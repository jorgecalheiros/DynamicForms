import type { UseFormRegister, FieldError } from 'react-hook-form'
import type { CheckboxFieldConfig } from '../../types/schema.types'
import { buildValidationRules } from '../../utils/validationRules'

interface CheckboxFieldProps {
  fieldKey: string
  label: string
  config: CheckboxFieldConfig
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function CheckboxField({ fieldKey, label, config, register, error }: CheckboxFieldProps) {
  const rules = buildValidationRules('checkbox', config)

  return (
    <div className="mb-5">
      <div className="flex items-start gap-3">
        <input
          id={fieldKey}
          type="checkbox"
          aria-describedby={error ? `${fieldKey}-error` : undefined}
          aria-invalid={!!error}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          {...register(fieldKey, rules)}
        />
        <label htmlFor={fieldKey} className="text-sm text-gray-700 cursor-pointer leading-5">
          {label}
          {config.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      </div>
      {error && (
        <p id={`${fieldKey}-error`} role="alert" className="mt-1 text-sm text-red-600 ml-7">
          {error.message}
        </p>
      )}
    </div>
  )
}
