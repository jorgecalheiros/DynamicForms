import type { FormField } from '../types/schema.types'
import { isValidFieldType } from './fieldTypeRegistry'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

function validateField(field: unknown, index: number): string[] {
  const errors: string[] = []
  if (typeof field !== 'object' || field === null) {
    errors.push(`Field at index ${index} must be an object`)
    return errors
  }
  const f = field as Record<string, unknown>
  if (!f.key || typeof f.key !== 'string') errors.push(`Field ${index}: missing or invalid 'key'`)
  if (!f.type || typeof f.type !== 'string') {
    errors.push(`Field ${index}: missing or invalid 'type'`)
  } else if (!isValidFieldType(f.type)) {
    errors.push(`Field ${index}: unsupported type '${f.type}'`)
  }
  if (!f.label || typeof f.label !== 'string') errors.push(`Field ${index}: missing or invalid 'label'`)
  if (typeof f.order !== 'number') errors.push(`Field ${index}: missing or invalid 'order'`)
  if (typeof f.config !== 'object' || f.config === null) errors.push(`Field ${index}: missing or invalid 'config'`)
  return errors
}

export function validateSchema(data: unknown): ValidationResult {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Schema must be a JSON object'] }
  }

  const schema = data as Record<string, unknown>

  if (!schema.formId || typeof schema.formId !== 'string') errors.push("Missing or invalid 'formId'")
  if (!schema.title || typeof schema.title !== 'string') errors.push("Missing or invalid 'title'")
  if (schema.description !== undefined && typeof schema.description !== 'string') {
    errors.push("'description' must be a string if provided")
  }
  if (!Array.isArray(schema.fields)) {
    errors.push("Missing or invalid 'fields' array")
  } else if (schema.fields.length === 0) {
    errors.push("'fields' array must not be empty")
  } else {
    schema.fields.forEach((field, i) => {
      errors.push(...validateField(field, i))
    })

    // Check for duplicate keys
    const keys = (schema.fields as FormField[]).map((f) => f.key)
    const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i)
    if (duplicates.length > 0) {
      errors.push(`Duplicate field keys: ${duplicates.join(', ')}`)
    }
  }

  return { valid: errors.length === 0, errors }
}
