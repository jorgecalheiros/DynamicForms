import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FormSchema } from '../../types/schema.types'
import { FieldRenderer } from './FieldRenderer'
import { SubmitButton } from './SubmitButton'
import { SuccessModal } from '../ui/SuccessModal'
import { RepeaterForm } from './RepeaterForm'

interface DynamicFormProps {
  schema: FormSchema
}

export function DynamicForm({ schema }: DynamicFormProps) {
  if (schema.type === 'repeater') {
    return <RepeaterForm schema={schema} />
  }

  return <DefaultForm schema={schema} />
}

function DefaultForm({ schema }: { schema: FormSchema }) {
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>()

  const onSubmit = async (data: Record<string, unknown>) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`[${schema.formId}] Form submitted:`, data)
    setSubmittedData(data)
  }

  const handleCloseModal = () => {
    setSubmittedData(null)
    reset()
  }

  const sortedFields = [...schema.fields].sort((a, b) => a.order - b.order)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Form header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">{schema.title}</h2>
          {schema.description && (
            <p className="mt-1 text-sm text-gray-600">{schema.description}</p>
          )}
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-6">
          {sortedFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              register={register}
              errors={errors}
            />
          ))}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>

      {submittedData && (
        <SuccessModal
          data={submittedData}
          formTitle={schema.title}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
