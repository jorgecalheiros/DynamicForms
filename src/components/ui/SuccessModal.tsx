interface SuccessModalProps {
  data: Record<string, unknown>
  formTitle: string
  onClose: () => void
}

export function SuccessModal({ data, formTitle, onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              Formulário enviado!
            </h2>
            <p className="text-sm text-gray-500">{formTitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-600 mb-3">Dados coletados (JSON):</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fechar e resetar formulário
          </button>
        </div>
      </div>
    </div>
  )
}
