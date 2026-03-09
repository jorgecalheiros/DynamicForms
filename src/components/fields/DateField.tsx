import type { UseFormRegister, FieldError } from 'react-hook-form'
import clsx from 'clsx'
import type { DateFieldConfig } from '../../types/schema.types'
import { FieldWrapper } from './FieldWrapper'
import { buildValidationRules } from '../../utils/validationRules'

interface DateFieldProps {
  fieldKey: string
  label: string
  config: DateFieldConfig
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function DateField({ fieldKey, label, config, register, error }: DateFieldProps) {
  const rules = buildValidationRules('date', config)

  return (
    <FieldWrapper label={label} fieldKey={fieldKey} error={error?.message} required={config.required}>
      <input
        id={fieldKey}
        type="date"
        min={config.min}
        max={config.max}
        aria-describedby={error ? `${fieldKey}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(
          'w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
          error ? 'border-red-500 bg-red-50' : 'border-gray-300',
        )}
        {...register(fieldKey, rules)}
      />
    </FieldWrapper>
  )
}
