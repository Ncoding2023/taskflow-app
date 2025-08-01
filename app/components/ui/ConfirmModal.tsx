import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Modal from './Modal'
import Button from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const typeStyles = {
  danger: {
    icon: 'text-red-600 dark:text-red-400',
    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  },
  warning: {
    icon: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  },
  info: {
    icon: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'danger'
}: ConfirmModalProps) {
  const styles = typeStyles[type]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-6 w-6 ${styles.icon}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          className={styles.button}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
} 