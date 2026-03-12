import { useState } from 'react'
import { DynamicForm } from '../DynamicForm/DynamicForm'
import { validateSchema } from '../../utils/schemaValidator'
import type { FormSchema } from '../../types/schema.types'

const EXAMPLE_SCHEMA = JSON.stringify(
  {
    formId: 'playground-form',
    title: 'Formulário de Teste',
    description: 'Edite o schema abaixo e clique em Renderizar para ver o resultado.',
    fields: [
      {
        key: 'name',
        type: 'text',
        label: 'Nome',
        order: 1,
        config: { required: true, placeholder: 'Digite seu nome', minLength: 2 },
      },
      {
        key: 'email',
        type: 'text',
        label: 'E-mail',
        order: 2,
        config: {
          required: true,
          placeholder: 'email@exemplo.com',
          pattern: '^[^@]+@[^@]+\\.[^@]+$',
        },
      },
      {
        key: 'role',
        type: 'select',
        label: 'Função',
        order: 3,
        config: {
          required: true,
          options: [
            { value: 'dev', label: 'Desenvolvedor' },
            { value: 'design', label: 'Designer' },
            { value: 'pm', label: 'Product Manager' },
          ],
        },
      },
    ],
  },
  null,
  2
)

export function SchemaPlayground() {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_SCHEMA)
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null)
  const [renderKey, setRenderKey] = useState(0)

  const handleRender = () => {
    setSubmittedData(null)
    setSchema(null)
    setParseError(null)
    try {
      const parsed: unknown = JSON.parse(jsonInput)
      const result = validateSchema(parsed)
      if (!result.valid) {
        setParseError('Schema inválido:\n' + result.errors.join('\n'))
        return
      }
      setSchema(parsed as FormSchema)
      setRenderKey((k) => k + 1)
    } catch (e) {
      setParseError('JSON inválido: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const handleSubmit = (data: Record<string, unknown>) => {
    setSubmittedData(data)
  }

  return (
    <div className="space-y-5">
      {/* JSON editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Schema JSON</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-72 font-mono text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-y"
          spellCheck={false}
          placeholder="Cole seu schema JSON aqui..."
        />
      </div>

      <button
        onClick={handleRender}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Renderizar Formulário
      </button>

      {parseError && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <p className="font-semibold mb-1">Erro no schema</p>
          <pre className="whitespace-pre-wrap font-mono text-xs">{parseError}</pre>
        </div>
      )}

      {schema && (
        <>
          <hr className="border-gray-200" />
          <DynamicForm key={renderKey} schema={schema} onSubmit={handleSubmit} />
        </>
      )}

      {submittedData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-semibold text-green-800 mb-2">Dados submetidos:</p>
          <pre className="text-xs font-mono text-green-700 overflow-auto max-h-48">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
