import type { UseFormRegister, FieldError } from 'react-hook-form'
import clsx from 'clsx'
import type { SelectFieldConfig, SelectOption } from '../../types/schema.types'
import { FieldWrapper } from './FieldWrapper'
import { buildValidationRules } from '../../utils/validationRules'

interface SelectFieldProps {
  fieldKey: string
  label: string
  config: SelectFieldConfig
  options: SelectOption[]
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError
}

export function SelectField({ fieldKey, label, config, options, register, error }: SelectFieldProps) {
  const rules = buildValidationRules('select', config)

  return (
    <FieldWrapper label={label} fieldKey={fieldKey} error={error?.message} required={config.required}>
      <select
        id={fieldKey}
        multiple={config.multiple}
        aria-describedby={error ? `${fieldKey}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(
          'w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
          error ? 'border-red-500 bg-red-50' : 'border-gray-300',
          config.multiple && 'min-h-[100px]',
        )}
        {...register(fieldKey, rules)}
      >
        {!config.multiple && <option value="">Selecione...</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {config.multiple && (
        <p className="mt-1 text-xs text-gray-500">Ctrl+Click para selecionar múltiplos</p>
      )}
    </FieldWrapper>
  )
}
