import type { FormField, RepeaterEntry } from '../../types/schema.types'

function getDisplayValue(field: FormField, value: unknown): string {
  if (field.type === 'select' || field.type === 'radio') {
    const option = field.options?.find((opt) => opt.value === String(value))
    if (option) return option.label
  }
  return String(value)
}

interface RepeaterListProps {
  entries: RepeaterEntry[]
  fields: FormField[]
  itemLabel: string
  editingIndex: number | null
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function RepeaterList({ entries, fields, itemLabel, editingIndex, onEdit, onDelete }: RepeaterListProps) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        {itemLabel}s adicionados ({entries.length})
      </h3>

      <div role="list" aria-label={`${itemLabel}s adicionados`} className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            role="listitem"
            aria-label={`${itemLabel} ${index + 1}`}
            className={`border rounded-lg p-4 bg-white transition-all ${
              editingIndex === index
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {itemLabel} {index + 1}
                  </span>
                  {editingIndex === index && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Editando...
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {fields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => {
                      const value = entry.data[field.key]
                      if (value === undefined || value === null || value === '') return null
                      return (
                        <div key={field.key} className="flex gap-2">
                          <span className="font-medium text-gray-500 min-w-[100px]">{field.label}:</span>
                          <span className="text-gray-800 truncate">{getDisplayValue(field, value)}</span>
                        </div>
                      )
                    })}
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  disabled={editingIndex !== null && editingIndex !== index}
                  aria-label={`Editar ${itemLabel} ${index + 1}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  disabled={editingIndex !== null}
                  aria-label={`Excluir ${itemLabel} ${index + 1}`}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
