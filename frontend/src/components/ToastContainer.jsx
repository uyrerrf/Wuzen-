import { useStore } from '../store'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const colors = {
  success: 'text-wuzen-success border-wuzen-success/30 bg-wuzen-success/10',
  error: 'text-wuzen-danger border-wuzen-danger/30 bg-wuzen-danger/10',
  info: 'text-wuzen-primary border-wuzen-primary/30 bg-wuzen-primary/10'
}

export default function ToastContainer() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-fade-in ${colors[toast.type] || colors.info}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
