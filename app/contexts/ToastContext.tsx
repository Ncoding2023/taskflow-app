import { createContext, useContext, ReactNode } from 'react'
import { useToast } from '~/components/ui/ToastContainer'
import ToastContainer from '~/components/ui/ToastContainer'

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo, addToast } = useToast()
  
  return (
    <ToastContext.Provider value={{ toasts, removeToast, showSuccess, showError, showWarning, showInfo, addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
} 