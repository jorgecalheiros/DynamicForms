import { useState } from 'react'
import { useFormSchema } from './hooks/useFormSchema'
import { DynamicForm } from './components/DynamicForm/DynamicForm'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { SchemaPlayground } from './components/ui/SchemaPlayground'

type Tab = 'forms' | 'playground'

const FORM_OPTIONS = [
  { id: 'contact-form', label: 'Formulário de Contato', path: '/schemas/contact-form.json' },
  { id: 'survey-form', label: 'Pesquisa de Satisfação', path: '/schemas/survey-form.json' },
  { id: 'registration-form', label: 'Cadastro de Usuário', path: '/schemas/registration-form.json' },
  { id: 'dependentes-form', label: 'Cadastro de Dependentes', path: '/schemas/dependentes-form.json' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('forms')
  const [selectedPath, setSelectedPath] = useState(FORM_OPTIONS[0]!.path)
  const { schema, loading, error } = useFormSchema(selectedPath)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dynamic Forms</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Formulários renderizados dinamicamente a partir de schemas JSON
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              activeTab === 'forms'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Formulários
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              activeTab === 'playground'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Schema Playground
          </button>
        </div>

        {/* Tab: Formulários */}
        {activeTab === 'forms' && (
          <>
            {/* Form selector */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {FORM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPath(opt.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    selectedPath === opt.path
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {loading && <LoadingSpinner />}

            {error && (
              <div
                role="alert"
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              >
                <p className="font-semibold mb-1">Erro ao carregar formulário</p>
                <p className="whitespace-pre-wrap font-mono text-xs">{error}</p>
              </div>
            )}

            {!loading && !error && schema && <DynamicForm key={schema.formId} schema={schema} />}

            <p className="text-center text-xs text-gray-400 mt-8">
              Dynamic Forms — schema: <code className="font-mono">{selectedPath}</code>
            </p>
          </>
        )}

        {/* Tab: Schema Playground */}
        {activeTab === 'playground' && <SchemaPlayground />}
      </div>
    </div>
  )
}
