import clsx from 'clsx'

interface SubmitButtonProps {
  isSubmitting: boolean
  label?: string
}

export function SubmitButton({ isSubmitting, label = 'Enviar' }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={clsx(
        'w-full py-3 px-6 text-white text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isSubmitting
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      )}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Enviando...
        </span>
      ) : (
        label
      )}
    </button>
  )
}
