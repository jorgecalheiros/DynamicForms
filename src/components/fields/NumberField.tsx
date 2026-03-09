import type { UseFormRegister, FieldError } from 'react-hook-form'
import clsx from 'clsx'
import type { NumberFieldConfig } from '../../types/schema.types'
import { FieldWrapper } from './FieldWrapper'
import { buildValidationRules } from '../../utils/validationRules'

interface NumberFieldProps {
  fieldKey: string
  label: string
  config: NumberFieldConfig
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function NumberField({ fieldKey, label, config, register, error }: NumberFieldProps) {
  const rules = buildValidationRules('number', config)

  return (
    <FieldWrapper label={label} fieldKey={fieldKey} error={error?.message} required={config.required}>
      <input
        id={fieldKey}
        type="number"
        placeholder={config.placeholder}
        min={config.min}
        max={config.max}
        step={config.step ?? 1}
        aria-describedby={error ? `${fieldKey}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(
          'w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
        )}
        {...register(fieldKey, rules)}
      />
    </FieldWrapper>
  )
}
