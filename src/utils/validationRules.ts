import type { RegisterOptions } from 'react-hook-form'
import type {
  FieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  TextAreaFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
  FieldType,
} from '../types/schema.types'

export function buildValidationRules(type: FieldType, config: FieldConfig): RegisterOptions {
  const rules: RegisterOptions = {}

  if (config.required) {
    rules.required = 'Este campo é obrigatório'
  }

  if (type === 'text') {
    const c = config as TextFieldConfig
    if (c.minLength) {
      rules.minLength = {
        value: c.minLength,
        message: `Mínimo de ${c.minLength} caracteres`,
      }
    }
    if (c.maxLength) {
      rules.maxLength = {
        value: c.maxLength,
        message: `Máximo de ${c.maxLength} caracteres`,
      }
    }
    if (c.pattern) {
      rules.pattern = {
        value: new RegExp(c.pattern),
        message: 'Formato inválido',
      }
    }
  }

  if (type === 'textarea') {
    const c = config as TextAreaFieldConfig
    if (c.minLength) {
      rules.minLength = {
        value: c.minLength,
        message: `Mínimo de ${c.minLength} caracteres`,
      }
    }
    if (c.maxLength) {
      rules.maxLength = {
        value: c.maxLength,
        message: `Máximo de ${c.maxLength} caracteres`,
      }
    }
  }

  if (type === 'number') {
    const c = config as NumberFieldConfig
    rules.valueAsNumber = true
    if (c.min !== undefined) {
      rules.min = {
        value: c.min,
        message: `Valor mínimo: ${c.min}`,
      }
    }
    if (c.max !== undefined) {
      rules.max = {
        value: c.max,
        message: `Valor máximo: ${c.max}`,
      }
    }
  }

  if (type === 'select') {
    const c = config as SelectFieldConfig
    if (c.required && !c.multiple) {
      rules.validate = (value: unknown) => {
        if (!value || value === '') return 'Este campo é obrigatório'
        return true
      }
    }
  }

  if (type === 'checkbox') {
    const c = config as CheckboxFieldConfig
    if (c.required) {
      rules.validate = (value: unknown) => {
        if (!value) return 'Este campo é obrigatório'
        return true
      }
    }
  }

  if (type === 'radio') {
    const c = config as RadioFieldConfig
    if (c.required) {
      rules.required = 'Selecione uma opção'
    }
  }

  if (type === 'date') {
    const c = config as DateFieldConfig
    if (c.min || c.max) {
      rules.validate = (value: unknown) => {
        if (!value && c.required) return 'Este campo é obrigatório'
        if (!value) return true
        const dateVal = value as string
        if (c.min && dateVal < c.min) return `Data mínima: ${c.min}`
        if (c.max && dateVal > c.max) return `Data máxima: ${c.max}`
        return true
      }
    }
  }

  return rules
}
