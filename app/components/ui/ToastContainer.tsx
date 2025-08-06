import { useState, useCallback } from 'react'
import Toast, { ToastType } from './Toast'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, message?: string, duration?: number, action?: ToastItem['action']) => {
    addToast({ type: 'success', title, message, duration, action })
  }, [addToast])

  const showError = useCallback((title: string, message?: string, duration?: number, action?: ToastItem['action']) => {
    addToast({ type: 'error', title, message, duration, action })
  }, [addToast])

  const showWarning = useCallback((title: string, message?: string, duration?: number, action?: ToastItem['action']) => {
    addToast({ type: 'warning', title, message, duration, action })
  }, [addToast])

  const showInfo = useCallback((title: string, message?: string, duration?: number, action?: ToastItem['action']) => {
    addToast({ type: 'info', title, message, duration, action })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[], onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  )
} 