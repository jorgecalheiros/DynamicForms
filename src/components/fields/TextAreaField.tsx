import type { UseFormRegister, FieldError } from 'react-hook-form'
import clsx from 'clsx'
import type { TextAreaFieldConfig } from '../../types/schema.types'
import { FieldWrapper } from './FieldWrapper'
import { buildValidationRules } from '../../utils/validationRules'

interface TextAreaFieldProps {
  fieldKey: string
  label: string
  config: TextAreaFieldConfig
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function TextAreaField({ fieldKey, label, config, register, error }: TextAreaFieldProps) {
  const rules = buildValidationRules('textarea', config)

  return (
    <FieldWrapper label={label} fieldKey={fieldKey} error={error?.message} required={config.required}>
      <textarea
        id={fieldKey}
        rows={config.rows ?? 4}
        placeholder={config.placeholder}
        aria-describedby={error ? `${fieldKey}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(
          'w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y',
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
        )}
        {...register(fieldKey, rules)}
      />
      {config.maxLength && (
        <p className="mt-1 text-xs text-gray-500">Máximo de {config.maxLength} caracteres</p>
      )}
    </FieldWrapper>
  )
}
