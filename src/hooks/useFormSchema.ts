import { useState, useEffect } from 'react'
import type { FormSchema } from '../types/schema.types'
import { validateSchema } from '../utils/schemaValidator'

interface UseFormSchemaResult {
  schema: FormSchema | null
  loading: boolean
  error: string | null
}

export function useFormSchema(schemaPath: string): UseFormSchemaResult {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schemaPath) return

    setLoading(true)
    setError(null)
    setSchema(null)

    fetch(schemaPath)
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar schema: ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((data: unknown) => {
        const result = validateSchema(data)
        if (!result.valid) {
          throw new Error(`Schema inválido:\n${result.errors.join('\n')}`)
        }
        setSchema(data as FormSchema)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [schemaPath])

  return { schema, loading, error }
}
