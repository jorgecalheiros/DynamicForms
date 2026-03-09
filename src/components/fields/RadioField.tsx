import type { UseFormRegister, FieldError } from 'react-hook-form'
import type { RadioFieldConfig } from '../../types/schema.types'
import { buildValidationRules } from '../../utils/validationRules'

interface RadioFieldProps {
  fieldKey: string
  label: string
  config: RadioFieldConfig
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function RadioField({ fieldKey, label, config, register, error }: RadioFieldProps) {
  const rules = buildValidationRules('radio', config)

  return (
    <div className="mb-5">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {config.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </legend>
        <div className="space-y-2">
          {config.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-3">
              <input
                id={`${fieldKey}-${opt.value}`}
                type="radio"
                value={opt.value}
                aria-describedby={error ? `${fieldKey}-error` : undefined}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                {...register(fieldKey, rules)}
              />
              <label
                htmlFor={`${fieldKey}-${opt.value}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {error && (
        <p id={`${fieldKey}-error`} role="alert" className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
}
