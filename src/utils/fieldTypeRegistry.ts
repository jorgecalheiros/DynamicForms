import type { FieldType } from '../types/schema.types'

export const SUPPORTED_FIELD_TYPES: FieldType[] = [
  'text',
  'number',
  'select',
  'textarea',
  'checkbox',
  'radio',
  'date',
]

export function isValidFieldType(type: string): type is FieldType {
  return SUPPORTED_FIELD_TYPES.includes(type as FieldType)
}
