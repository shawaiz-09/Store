import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div
      key={toast.key}
      className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg ${
        isError ? 'bg-rose-600' : 'bg-slate-900'
      }`}
    >
      {isError ? '⚠ ' : '✓ '}
      {toast.message}
    </div>
  )
}
