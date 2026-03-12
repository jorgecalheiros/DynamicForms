import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { FormSchema } from '../../types/schema.types'
import { FieldRenderer } from './FieldRenderer'

interface RepeaterInputFormProps {
  schema: FormSchema
  initialData?: Record<string, unknown>
  isEditing: boolean
  addButtonText: string
  onAdd: (data: Record<string, unknown>) => void
  onSaveEdit: (data: Record<string, unknown>) => void
  onCancel?: () => void
}

export function RepeaterInputForm({
  schema,
  initialData,
  isEditing,
  addButtonText,
  onAdd,
  onSaveEdit,
  onCancel,
}: RepeaterInputFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Record<string, unknown>>({
    defaultValues: initialData ?? {},
    mode: 'onTouched',
  })

  useEffect(() => {
    reset(initialData ?? {})
  }, [initialData, reset])

  const onSubmit = (data: Record<string, unknown>) => {
    if (isEditing) {
      onSaveEdit(data)
    } else {
      onAdd(data)
      reset({})
    }
  }

  const sortedFields = [...schema.fields].sort((a, b) => a.order - b.order)

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
      {isEditing && (
        <h3 className="text-base font-semibold text-gray-700 mb-4">✏️ Editar item</h3>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {sortedFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              register={register}
              errors={errors}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isEditing ? '💾 Salvar alterações' : `➕ ${addButtonText}`}
          </button>
        </div>
      </form>
    </div>
  )
}
