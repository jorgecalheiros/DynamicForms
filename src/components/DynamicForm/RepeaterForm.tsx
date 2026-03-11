import { useState } from 'react'
import type { FormSchema, RepeaterEntry } from '../../types/schema.types'
import { RepeaterList } from './RepeaterList'
import { RepeaterInputForm } from './RepeaterInputForm'
import { SuccessModal } from '../ui/SuccessModal'

interface RepeaterFormProps {
  schema: FormSchema
}

export function RepeaterForm({ schema }: RepeaterFormProps) {
  const [entries, setEntries] = useState<RepeaterEntry[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [submittedData, setSubmittedData] = useState<Array<Record<string, unknown>> | null>(null)

  const config = schema.repeaterConfig ?? {}
  const {
    minEntries = 0,
    maxEntries = Infinity,
    addButtonText = 'Adicionar outro',
    itemLabel = 'Item',
    confirmDelete = true,
    showCounter = true,
  } = config

  const canAdd = entries.length < maxEntries
  const canSubmit = entries.length >= minEntries

  const handleAdd = (data: Record<string, unknown>) => {
    const newEntry: RepeaterEntry = {
      id: crypto.randomUUID(),
      data,
      timestamp: Date.now(),
      isValid: true,
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  const handleSaveEdit = (data: Record<string, unknown>) => {
    if (editingIndex === null) return
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === editingIndex ? { ...entry, data, timestamp: Date.now() } : entry
      )
    )
    setEditingIndex(null)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirmDelete) {
      if (!window.confirm(`Tem certeza que deseja excluir ${itemLabel} ${index + 1}?`)) return
    }
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFinalSubmit = () => {
    if (!canSubmit) {
      alert(`Você precisa adicionar pelo menos ${minEntries} ${itemLabel}(s).`)
      return
    }
    const data = entries.map((entry) => entry.data)
    setSubmittedData(data)
  }

  const handleCloseModal = () => {
    setSubmittedData(null)
    setEntries([])
    setEditingIndex(null)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">{schema.title}</h2>
          {schema.description && (
            <p className="mt-1 text-sm text-gray-600">{schema.description}</p>
          )}
          {showCounter && (
            <p className="mt-2 text-xs text-gray-500">
              {entries.length} {itemLabel}(s) adicionado(s)
              {maxEntries !== Infinity && ` de ${maxEntries} permitido(s)`}
            </p>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Empty state */}
          {entries.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center text-sm text-gray-500">
              Nenhum {itemLabel.toLowerCase()} adicionado ainda. Preencha o formulário abaixo para começar.
            </div>
          )}

          {/* Entry list */}
          {entries.length > 0 && (
            <RepeaterList
              entries={entries}
              fields={schema.fields}
              itemLabel={itemLabel}
              editingIndex={editingIndex}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Input form - shown when not at max or when editing */}
          {(editingIndex !== null || canAdd) ? (
            <RepeaterInputForm
              key={editingIndex !== null ? `edit-${editingIndex}` : `new-${entries.length}`}
              schema={schema}
              initialData={editingIndex !== null ? entries[editingIndex]?.data : undefined}
              isEditing={editingIndex !== null}
              addButtonText={addButtonText}
              onAdd={handleAdd}
              onSaveEdit={handleSaveEdit}
              onCancel={editingIndex !== null ? handleCancelEdit : undefined}
            />
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 text-center">
              Limite de {maxEntries} {itemLabel}(s) atingido. Exclua um item para adicionar mais.
            </div>
          )}

          {/* Submit */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={!canSubmit || editingIndex !== null}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                canSubmit && editingIndex === null
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Salvar todos ({entries.length})
            </button>
          </div>
        </div>
      </div>

      {submittedData !== null && (
        <SuccessModal
          data={submittedData}
          formTitle={schema.title}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
