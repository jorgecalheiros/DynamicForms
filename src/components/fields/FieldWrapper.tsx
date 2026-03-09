import type { ReactNode } from 'react'
import clsx from 'clsx'

interface FieldWrapperProps {
  label: string
  fieldKey: string
  error?: string
  children: ReactNode
  required?: boolean
}

export function FieldWrapper({ label, fieldKey, error, children, required }: FieldWrapperProps) {
  return (
    <div className="mb-5">
      <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${fieldKey}-error`}
          role="alert"
          className={clsx('mt-1 text-sm text-red-600')}
        >
          {error}
        </p>
      )}
    </div>
  )
}
